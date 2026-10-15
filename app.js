import {Market,ASSETS,agg} from './market.js';
import * as T from './trading.js';
import {Chart} from './chart.js';
import {load,save,validate,download} from './persistence.js';

const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const fmt=(n,d=2)=>Number.isFinite(n)?n.toLocaleString('es-AR',{minimumFractionDigits:d,maximumFractionDigits:d}):'—';
const A=Object.fromEntries(ASSETS.map(a=>[a.sym,a])),cls=n=>n>0?'up':n<0?'dn':'';
const ui={sym:'BUX',tf:5,side:'buy',type:'market',cat:'Todas',q:'',sort:'name',tab:'pos',fav:new Set(),ct:'candles'};
let mk,ac,chart,canSave=true,saveT;

const px=()=>Object.fromEntries(ASSETS.map(a=>[a.sym,mk.s[a.sym].p]));
const snap=()=>({v:1,account:ac,market:mk.snapshot(),ui:{sym:ui.sym,tf:ui.tf,ct:ui.ct,fav:[...ui.fav]}});
const persist=()=>{clearTimeout(saveT);saveT=setTimeout(doSave,300)};
async function doSave(){if(!canSave)return;try{await save('state',snap());$('#saved').textContent='Guardado '+new Date().toLocaleTimeString('es-AR')}catch{$('#saved').textContent='Error al guardar'}}
function say(r){const m=$('#msg');m.textContent=r.ok?r.msg:r.err;m.className=r.ok?'ok':'err'}

/* ---------- Lista de activos y cinta ---------- */
function renderList(){
  const f=ASSETS.filter(a=>(ui.cat==='Todas'||(ui.cat==='Favoritos'?ui.fav.has(a.sym):a.cat===ui.cat))&&(a.sym+a.name).toLowerCase().includes(ui.q.toLowerCase()));
  const key={name:a=>a.sym,price:a=>-mk.s[a.sym].p,chg:a=>-mk.chg(a.sym),vol:a=>-mk.s[a.sym].vol}[ui.sort];
  f.sort((a,b)=>key(a)>key(b)?1:-1);
  $('#list').innerHTML=f.map(a=>`<li data-s="${a.sym}" class="${a.sym===ui.sym?'sel':''}" title="Volumen simulado: ${fmt(mk.s[a.sym].vol,0)}"><button class="star ${ui.fav.has(a.sym)?'on':''}" aria-label="Favorito">★</button><div><b>${a.sym}</b><small>${a.name} · ${a.cat}</small></div><canvas width="56" height="20"></canvas><div class="pc"><span class="px"></span><span class="chg"></span></div></li>`).join('')||'<li class="empty">Sin resultados</li>';
  updateList();
}
function updateList(){
  for(const li of $$('#list li[data-s]')){
    const s=li.dataset.s,c=mk.chg(s),b=mk.s[s].bars,g=li.querySelector('canvas').getContext('2d'),pts=b.slice(-300).filter((_,i)=>i%5===0);
    li.querySelector('.px').textContent=fmt(mk.s[s].p,A[s].dec);
    const e=li.querySelector('.chg');e.textContent=(c>=0?'+':'')+fmt(c*100)+'%';e.className='chg '+cls(c);
    const lo=Math.min(...pts.map(x=>x.c)),hi=Math.max(...pts.map(x=>x.c));
    g.clearRect(0,0,56,20);g.strokeStyle=c>=0?'#26c281':'#ef4f5f';g.beginPath();
    pts.forEach((x,i)=>{const X=i/(pts.length-1)*56,Y=18-(x.c-lo)/((hi-lo)||1)*16;i?g.lineTo(X,Y):g.moveTo(X,Y)});g.stroke();
  }
  for(const t of $$('#ticker span')){
    const s=t.dataset.t,c=mk.chg(s),e=t.querySelector('.chg');
    t.querySelector('.px').textContent=fmt(mk.s[s].p,A[s].dec);
    e.textContent=(c>=0?'+':'')+fmt(c*100)+'%';e.className='chg '+cls(c);
  }
}

/* ---------- Cabecera, ficha y estado ---------- */
function updateTop(p){
  const eq=T.equity(ac,p),pl=eq-ac.cash0;
  $('#eq').textContent=fmt(eq);
  $('#pl').textContent=(pl>=0?'+':'')+fmt(pl)+' ('+fmt(pl/ac.cash0*100)+'%)';$('#pl').className=cls(pl);
  $('#cash').textContent=fmt(ac.cash);
  $('#clock').textContent=new Date(mk.simT).toLocaleTimeString('es-AR');
  const a=A[ui.sym],s=mk.s[ui.sym],c=mk.chg(ui.sym);
  $('#hd').innerHTML=`<b>${a.sym}</b> ${a.name} <b class="${cls(c)}">${fmt(s.p,a.dec)} (${c>=0?'+':''}${fmt(c*100)}%)</b>`;
  $('#info').innerHTML=[['Categoría',a.cat],['Var. sesión',(c>=0?'+':'')+fmt(c*100)+'%'],['Volatilidad',fmt(a.vol*100,1)+'%'],['Máx. sesión',fmt(s.hi,a.dec)],['Mín. sesión',fmt(s.lo,a.dec)],['Volumen',fmt(s.vol,0)]].map(([k,v])=>`<div><span>${k}</span><b>${v}</b></div>`).join('');
  $('#osym').textContent=a.sym;$('#opx').textContent=fmt(s.p,a.dec);
  $('#oav').textContent=fmt(T.avail(ac,p,ui.sym,ui.side),4)+' u.';
  const q=+$('#qty').value,ref=ui.type==='limit'?+$('#lp').value:s.p,v=q*ref;
  $('#oval').textContent=v>0?fmt(v):'—';$('#ofee').textContent=v>0?fmt(v*ac.fee,4):'—';
  const pill=$('#pill');pill.textContent=mk.paused?'● Motor en pausa':'● Motor en vivo';pill.className='pill '+(mk.paused?'off':'live');
  $('#st').textContent=`Simulación local · ${mk.speed}× · tick ${mk.n} · último proceso ${new Date().toLocaleTimeString('es-AR')}`;
}

/* ---------- Gráfico ---------- */
function drawChart(){const s=mk.s[ui.sym];chart.set(agg(s.bars,ui.tf),A[ui.sym].dec,ac.orders.filter(o=>o.status==='pendiente'&&o.sym===ui.sym))}

/* ---------- Libro de órdenes simulado (liquidez ficticia derivada del precio) ---------- */
function renderBook(){
  if($('#book').matches(':hover'))return;
  const a=A[ui.sym],p=mk.s[ui.sym].p,tick=Math.max(p*a.vol*.05,10**-a.dec);
  const lv=(sgn,ph)=>{let c=0;return Array.from({length:8},(_,i)=>{const sz=Math.round(20+Math.abs(Math.sin(i*12.9898+a.i*78.233+ph+(mk.n>>2)*3.1))*480);c+=sz;return{pr:Math.max(p+sgn*(tick/2+i*tick),10**-a.dec),sz,c}})};
  const ak=lv(1,0),bd=lv(-1,50),mx=Math.max(ak[7].c,bd[7].c);
  const row=(l,k)=>`<div class="bk ${k}" data-p="${l.pr.toFixed(a.dec)}" style="--w:${(l.c/mx*100).toFixed(1)}%"><span>${fmt(l.pr,a.dec)}</span><span>${fmt(l.sz,0)}</span><span>${fmt(l.c,0)}</span></div>`;
  $('#book').innerHTML=`<div class="bh"><span>Precio</span><span>Cantidad</span><span>Acum.</span></div>${ak.slice().reverse().map(l=>row(l,'dn')).join('')}<div class="sp">${fmt(p,a.dec)}<small>Dif. ${fmt(tick,a.dec)}</small></div>${bd.map(l=>row(l,'up')).join('')}`;
}

/* ---------- Tablas inferiores ---------- */
function renderTable(){
  const p=px(),t=$('#tbl');$$('#tabs button').forEach(b=>b.classList.toggle('on',b.dataset.t===ui.tab));let h='';
  if(ui.tab==='pos'){
    const r=Object.entries(ac.pos).map(([s,q])=>{const m=p[s],d=A[s].dec,v=q.qty*m,pl=v-q.avg*q.qty;
      return`<tr data-s="${s}"><td><b>${s}</b></td><td>${fmt(q.qty,4)}</td><td>${fmt(q.avg,d)}</td><td>${fmt(m,d)}</td><td>${fmt(v)}</td><td class="${cls(pl)}">${fmt(pl)} (${fmt(pl/(q.avg*q.qty)*100)}%)</td><td>${[.25,.5,1].map(f=>`<button data-close="${s}" data-f="${f}">${f*100}%</button>`).join(' ')}</td></tr>`});
    h=r.length?`<table><tr><th>Símbolo</th><th>Cantidad</th><th>Entrada</th><th>Actual</th><th>Valor</th><th>Resultado</th><th>Cerrar</th></tr>${r.join('')}</table>`:'<div class="empty">Sin posiciones abiertas. Comprá desde el panel derecho.</div>';
  }else if(ui.tab==='ord'){
    const r=ac.orders.filter(o=>o.status==='pendiente').map(o=>`<tr><td>#${o.id}</td><td>${o.sym}</td><td class="${o.side==='buy'?'up':'dn'}">${o.side==='buy'?'Compra':'Venta'}</td><td>${fmt(o.qty,4)}</td><td>${fmt(o.price,A[o.sym].dec)}</td><td><button data-cancel="${o.id}">Cancelar</button></td></tr>`);
    h=r.length?`<table><tr><th>ID</th><th>Activo</th><th>Lado</th><th>Cantidad</th><th>Límite</th><th></th></tr>${r.join('')}</table>`:'<div class="empty">No hay órdenes pendientes. Elegí «Límite» en el panel para crear una.</div>';
  }else{
    const r=ac.orders.map(o=>`<tr><td>#${o.id}</td><td>${new Date(o.t).toLocaleTimeString('es-AR')}</td><td>${o.sym}</td><td class="${o.side==='buy'?'up':'dn'}">${o.side==='buy'?'Compra':'Venta'} ${o.type==='limit'?'límite':'mercado'}</td><td>${fmt(o.qty,4)}</td><td>${o.fp?fmt(o.fp,A[o.sym].dec):'—'}</td><td>${o.fee!=null?fmt(o.fee,4):'—'}</td><td>${o.status}</td></tr>`);
    h=r.length?`<table><tr><th>ID</th><th>Hora sim.</th><th>Activo</th><th>Tipo</th><th>Cantidad</th><th>Precio ejec.</th><th>Comisión</th><th>Estado</th></tr>${r.join('')}</table><div class="empty">Realizado: <b class="${cls(ac.realized)}">${fmt(ac.realized)}</b> · Comisiones: <b>${fmt(ac.fees,4)}</b></div>`:'<div class="empty">Todavía no hay operaciones.</div>';
  }
  t.innerHTML=h;
}
// Actualiza solo los números de las posiciones (no recrea los botones, así los clics no se pierden)
function updatePos(){
  const p=px();
  for(const tr of $$('#tbl tr[data-s]')){
    const s=tr.dataset.s,q=ac.pos[s];if(!q)continue;
    const m=p[s],v=q.qty*m,pl=v-q.avg*q.qty,c=tr.cells;
    c[3].textContent=fmt(m,A[s].dec);c[4].textContent=fmt(v);
    c[5].textContent=`${fmt(pl)} (${fmt(pl/(q.avg*q.qty)*100)}%)`;c[5].className=cls(pl);
  }
}

/* ---------- Flujo principal ---------- */
function after(r){say(r);renderTable();updateTop(px());drawChart();persist()}
function onTick(){
  const p=px();
  if(T.onTick(ac,p,mk.simT)){renderTable();persist()}
  updateList();updateTop(p);
  if(ui.tab==='pos')updatePos();
  renderBook();drawChart();
}
function setSide(){
  $$('#sides button').forEach(b=>{b.className=b.dataset.s===ui.side?'on '+ui.side:''});
  $$('#types button').forEach(b=>b.classList.toggle('on',b.dataset.y===ui.type));
  $('#lpw').hidden=ui.type!=='limit';$('#go').className=ui.side==='sell'?'sell':'';
  $('#go').textContent=(ui.side==='buy'?'Comprar ':'Vender ')+ui.sym;
}
function pick(s){ui.sym=s;chart.off=0;$('#lp').value='';renderList();setSide();drawChart();updateTop(px());renderBook();persist()}

async function init(){
  let sv=null;
  try{sv=await load('state')}catch{canSave=false;$('#saved').textContent='Sin almacenamiento: no se guardará'}
  if(sv&&validate(sv)){console.warn('Estado guardado inválido, se ignora:',validate(sv));canSave=false;$('#saved').textContent='Estado guardado inválido: no se sobrescribe';sv=null}
  mk=new Market(sv?.market);ac=sv?.account||T.fresh();
  if(sv?.ui){ui.sym=A[sv.ui.sym]?sv.ui.sym:ui.sym;ui.tf=sv.ui.tf||5;ui.ct=sv.ui.ct||'candles';ui.fav=new Set(sv.ui.fav||[])}
  chart=new Chart($('#cv'));chart.type=ui.ct;$('#ct').value=ui.ct;
  $('#cat').innerHTML=['Todas','Favoritos','Acciones','Cripto','Índices','Divisas','Materias primas'].map(c=>`<option>${c}</option>`).join('');
  $('#tfs').innerHTML=[[1,'1s'],[5,'5s'],[15,'15s'],[60,'1m'],[300,'5m']].map(([v,l])=>`<button data-tf="${v}" class="${v===ui.tf?'on':''}">${l}</button>`).join('');
  $('#ticker').innerHTML=ASSETS.map(a=>`<span data-t="${a.sym}"><b>${a.sym}</b><i class="px"></i><i class="chg"></i></span>`).join('');
  $('#cfee').value=ac.fee*100;$('#cslip').value=ac.slip*100;
  renderList();setSide();renderTable();onTick();
  mk.subs.add(onTick);mk.start();
  setInterval(doSave,30000);addEventListener('pagehide',doSave);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)doSave()});
}

/* ---------- Eventos ---------- */
$('#list').onclick=e=>{const li=e.target.closest('li[data-s]');if(!li)return;if(e.target.closest('.star')){const s=li.dataset.s;ui.fav.has(s)?ui.fav.delete(s):ui.fav.add(s);renderList();persist()}else pick(li.dataset.s)};
$('#ticker').onclick=e=>{const t=e.target.closest('span[data-t]');if(t)pick(t.dataset.t)};
$('#q').oninput=e=>{ui.q=e.target.value;renderList()};
$('#cat').onchange=e=>{ui.cat=e.target.value;renderList()};
$('#sort').onchange=e=>{ui.sort=e.target.value;renderList()};
$('#tfs').onclick=e=>{const b=e.target.closest('[data-tf]');if(!b)return;ui.tf=+b.dataset.tf;$$('#tfs button').forEach(x=>x.classList.toggle('on',x===b));chart.off=0;drawChart();persist()};
$('#ct').onchange=e=>{ui.ct=chart.type=e.target.value;chart.req();persist()};
for(const[id,k]of[['isma','sma'],['iema','ema'],['ivol','vol']])$('#'+id).onchange=e=>{chart[k]=e.target.checked;chart.req()};
$('#rv').onclick=()=>chart.reset();
$('#tabs').onclick=e=>{if(e.target.dataset.t){ui.tab=e.target.dataset.t;renderTable()}};
$('#tbl').onclick=e=>{const c=e.target.dataset;if(c.close)after(T.close(ac,px(),c.close,+c.f,mk.simT));else if(c.cancel)after(T.cancel(ac,+c.cancel))};
$('#sides').onclick=e=>{if(e.target.dataset.s){ui.side=e.target.dataset.s;setSide();updateTop(px())}};
$('#types').onclick=e=>{if(e.target.dataset.y){ui.type=e.target.dataset.y;if(ui.type==='limit'&&!$('#lp').value)$('#lp').value=mk.s[ui.sym].p.toFixed(A[ui.sym].dec);setSide();updateTop(px())}};
$('#book').onclick=e=>{const r=e.target.closest('.bk');if(!r)return;ui.type='limit';$('#lp').value=r.dataset.p;setSide();updateTop(px())};
$('.pcts').onclick=e=>{if(e.target.tagName!=='BUTTON')return;const a=T.avail(ac,px(),ui.sym,ui.side);$('#qty').value=(Math.floor(a*+e.target.textContent/100*1e6)/1e6)||'';updateTop(px())};
$('#qty').oninput=$('#lp').oninput=()=>updateTop(px());
$('#go').onclick=()=>after(T.place(ac,px(),{sym:ui.sym,side:ui.side,type:ui.type,qty:$('#qty').value,price:$('#lp').value},mk.simT));
for(const[id,k]of[['cfee','fee'],['cslip','slip']])$('#'+id).onchange=e=>{const v=+e.target.value/100;if(v>=0&&v<=.05)ac[k]=v;else e.target.value=ac[k]*100;persist()};
$('#pause').onclick=()=>{mk.paused?mk.resume():mk.pause();$('#pause').textContent=mk.paused?'Reanudar':'Pausar';updateTop(px())};
$('#speed').onchange=e=>{mk.setSpeed(+e.target.value);updateTop(px())};
$('#vol').onchange=e=>mk.vm=+e.target.value;
$('#corr').onchange=e=>mk.corr=e.target.checked;
$('#wmin').onclick=()=>{const w=$('#warn');w.classList.toggle('min');$('#wmin').textContent=w.classList.contains('min')?'⚠ Simulación — ver aviso':'Minimizar'};
$('#exp').onclick=()=>download(JSON.stringify(snap()),'bolsin-copia-'+Date.now()+'.json');
$('#imp').onclick=()=>$('#file').click();
$('#file').onchange=async e=>{
  const f=e.target.files[0];e.target.value='';if(!f)return;let d;
  try{d=JSON.parse(await f.text())}catch{return alert('El archivo no es JSON válido. Se conserva tu cuenta actual.')}
  const err=validate(d);if(err)return alert('Importación rechazada: '+err+'. Se conserva tu cuenta actual.');
  if(!confirm('Esto reemplaza tu cuenta actual por la del archivo. ¿Continuar?'))return;
  canSave=false;await save('state',d);location.reload();
};
$('#rst').onclick=()=>{
  if(!confirm('¿Reiniciar la cuenta? Se pierden posiciones, órdenes e historial.'))return;
  if(confirm('¿Descargar una copia antes de reiniciar?'))download(JSON.stringify(snap()),'bolsin-copia-previa.json');
  ac=T.fresh();renderTable();onTick();persist();
};

init();

// Puente de solo lectura para extras.js (no modifica el comportamiento existente)
export const ctx={get mk(){return mk},get ac(){return ac},get chart(){return chart},ui,A,fmt,cls,px,pick,persist,say,updateTop,renderTable};
