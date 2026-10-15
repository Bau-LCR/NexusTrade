import {ctx} from './app.js';
import {ASSETS,agg} from './market.js';
import * as T from './trading.js';
import {load,save} from './persistence.js';

const $=s=>document.querySelector(s);
const {fmt,cls,A}=ctx,mk=()=>ctx.mk,ac=()=>ctx.ac;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>'&#'+c.charCodeAt(0)+';');
const hm=t=>new Date(t).toLocaleTimeString('es-AR');
// Estado propio persistido en IndexedDB (clave 'extras', versión 1). La cuenta existente no se modifica.
const X={v:1,tab:'map',eq:[],alerts:[],hist:[],journal:{},risk:{maxLoss:10,maxExp:40},aid:1};
const flags=new Set(),TABS=[['map','Mapa de calor'],['perf','Rendimiento'],['risk','Riesgo'],['alerts','Alertas'],['diary','Diario'],['calc','Calculadora']];
const KL={price:'Precio',chg:'Variación %',rsi:'RSI(14)'};
let open=false,size='vol',lastN=-1,sT;
const store=()=>{clearTimeout(sT);sT=setTimeout(()=>save('extras',X).catch(()=>{}),800)};
// Evita redibujar el panel mientras la persona escribe o abre un selector
const typing=()=>{const e=document.activeElement;return !!e&&/^(INPUT|SELECT)$/.test(e.tagName)&&!!$('#ob')?.contains(e)};
function toast(m){const d=document.createElement('div');d.textContent=m;$('#toasts').append(d);setTimeout(()=>d.remove(),6000)}
const rsi=(c,n=14)=>{if(c.length<=n)return null;let g=0,l=0;for(let i=1;i<=n;i++){const d=c[i]-c[i-1];d>0?g+=d:l-=d}g/=n;l/=n;
 for(let i=n+1;i<c.length;i++){const d=c[i]-c[i-1];g=(g*(n-1)+Math.max(d,0))/n;l=(l*(n-1)+Math.max(-d,0))/n}return l===0?100:100-100/(1+g/l)};
function line(id,ys,col){const c=$(id);if(!c)return;const W=c.width=c.clientWidth,H=c.height=c.clientHeight,g=c.getContext('2d');g.font='10px ui-monospace,monospace';g.fillStyle='#7f8aa0';
 if(ys.length<2)return g.fillText('Reuniendo datos… (1 punto cada 5 s simulados)',10,20);
 const lo=Math.min(...ys),hi=Math.max(...ys),r=hi-lo||1;g.strokeStyle=col;g.beginPath();
 ys.forEach((y,i)=>{const x=i/(ys.length-1)*W,v=H-8-(y-lo)/r*(H-16);i?g.lineTo(x,v):g.moveTo(x,v)});g.stroke();g.fillText(fmt(hi,2),4,10);g.fillText(fmt(lo,2),4,H-2)}
const row2=(k,v)=>`<span>${k}</span><b>${v}</b>`;

/* ---------- Vistas ---------- */
const V={
 map(){const m=mk(),t=ASSETS.map(a=>({a,c:m.chg(a.sym),w:size==='vol'?m.s[a.sym].vol:size==='cap'?m.s[a.sym].p*(a.i+3)*5e6:1})),tot=t.reduce((s,x)=>s+x.w,0);
  return`<div class="bar"><label>Tamaño <select id="msize"><option value="vol">Volumen simulado</option><option value="cap">Capitalización ficticia</option><option value="eq">Igual</option></select></label><small>Color = variación de sesión simulada. Datos ficticios.</small></div><div id="hm">${t.sort((x,y)=>y.w-x.w).map(({a,c,w})=>`<button class="tile" data-s="${a.sym}" style="flex:${(w/tot*100).toFixed(2)} 1 ${Math.max(90,Math.round(w/tot*700))}px;background:rgba(${c>=0?'38,194,129':'239,79,95'},${Math.min(.9,.25+Math.abs(c)*6).toFixed(2)})"><b>${a.sym}</b><span>${fmt(m.s[a.sym].p,a.dec)}</span><span>${c>=0?'+':''}${fmt(c*100)}%</span></button>`).join('')}</div>`},
 perf(){const a=ac(),p=ctx.px(),eq=T.equity(a,p),s=a.fills.filter(f=>f.side==='sell'),w=s.filter(f=>f.rl>0),l=s.filter(f=>f.rl<=0),sum=x=>x.reduce((t,f)=>t+f.rl,0);
  let pk=-Infinity,mdd=0;for(const[,e]of X.eq){pk=Math.max(pk,e);mdd=Math.min(mdd,e/pk-1)}const cur=X.eq.length?eq/Math.max(pk,eq)-1:0,pv=Object.entries(a.pos).map(([k,q])=>[k,q.qty*p[k]]);
  const row=(k,v,c='')=>`<span>${k}</span><b class="${c}">${v}</b>`,ret=eq/a.cash0-1;
  return`<div class="g2"><div><small>Patrimonio</small><canvas class="cc" id="ceq"></canvas><small>Drawdown</small><canvas class="cc" id="cdd"></canvas><button id="eqclr">Reiniciar historial de curvas</button></div>
  <div><div class="kvs">${row('Patrimonio',fmt(eq))}${row('Rentabilidad acumulada',(ret>=0?'+':'')+fmt(ret*100)+'%',cls(ret))}${row('Drawdown actual',fmt(cur*100)+'%',cls(cur))}${row('Drawdown máximo',fmt(mdd*100)+'%',cls(mdd))}${row('Operaciones cerradas',s.length)}${row('Ganadoras',s.length?fmt(w.length/s.length*100)+'% ('+w.length+')':'—')}${row('Beneficio medio',w.length?fmt(sum(w)/w.length):'—','up')}${row('Pérdida media',l.length?fmt(sum(l)/l.length):'—','dn')}${row('Resultado realizado',fmt(a.realized),cls(a.realized))}${row('Comisiones',fmt(a.fees,4))}</div>
  <h3>Distribución de cartera</h3>${[['Efectivo',a.cash],...pv].map(([k,v])=>`<div class="dist"><span>${k}</span><i style="width:${Math.max(0,v/eq*100).toFixed(1)}%"></i><span>${fmt(v/eq*100,1)}%</span></div>`).join('')}</div></div>`},
 risk(){const a=ac(),p=ctx.px(),eq=T.equity(a,p),pos=Object.entries(a.pos).map(([k,q])=>[k,q.qty*p[k]]),tv=pos.reduce((s,x)=>s+x[1],0),loss=(a.cash0-eq)/a.cash0*100;
  return`<div class="g2"><div><div class="kvs">${row2('Margen utilizado','0 (sin apalancamiento)')}${row2('Posiciones',fmt(tv))}${row2('Reservado en órdenes',fmt(T.reserved(a).cash))}${row2('Pérdida virtual vs. capital inicial',fmt(Math.max(loss,0))+'% / límite '+X.risk.maxLoss+'%')}</div>
  <h3>Límites</h3><div class="form"><label>Pérdida máx. % <input id="rml" type="number" min="0.1" max="100" step="0.1" value="${X.risk.maxLoss}"></label><label>Exposición máx. por activo % <input id="rme" type="number" min="1" max="100" step="1" value="${X.risk.maxExp}"></label></div></div>
  <div><h3>Exposición por instrumento</h3>${pos.length?pos.map(([k,v])=>`<div class="dist"><span>${k}</span><i style="width:${Math.min(100,v/eq*100).toFixed(1)}%"></i><span class="${v/eq*100>X.risk.maxExp?'dn':''}">${fmt(v/eq*100,1)}%</span></div>`).join(''):'<div class="empty">Sin posiciones abiertas.</div>'}
  <h3>Escenarios hipotéticos (todas las posiciones)</h3><div class="kvs">${[-20,-10,-5,5,10].map(s=>row2((s>0?'+':'')+s+'%',fmt(a.cash+tv*(1+s/100))+'  ('+fmt((a.cash+tv*(1+s/100)-eq))+')')).join('')}</div></div></div>`},
 alerts(){const L=X.alerts.map(a=>`<tr><td>${esc(a.sym)}</td><td>${KL[a.kind]} ${a.dir==='above'?'≥':'≤'} ${a.val}</td><td>${a.on?(a.armed?'activa':'disparada'):'desactivada'}</td><td><button data-tog="${a.id}">${a.on?'Desactivar':'Activar'}</button> <button data-del="${a.id}">Eliminar</button></td></tr>`);
  return`<div class="form"><select id="asym">${ASSETS.map(a=>`<option ${a.sym===ctx.ui.sym?'selected':''}>${a.sym}</option>`).join('')}</select><select id="akind"><option value="price">Precio</option><option value="chg">Variación % sesión</option><option value="rsi">RSI(14, velas 5 s)</option></select><select id="adir"><option value="above">sube a o supera</option><option value="below">baja a o por debajo</option></select><input id="aval" type="number" step="any" placeholder="Valor"><button id="aadd">Crear alerta</button></div>
  ${L.length?`<table><tr><th>Activo</th><th>Condición</th><th>Estado</th><th></th></tr>${L.join('')}</table>`:'<div class="empty">Sin alertas. Creá una arriba.</div>'}
  <h3>Historial de activaciones</h3>${X.hist.length?`<table>${X.hist.slice(0,30).map(h=>`<tr><td>${hm(h.t)}</td><td style="text-align:left">${esc(h.msg)}</td></tr>`).join('')}</table>`:'<div class="empty">Todavía no se activó ninguna.</div>'}`},
 diary(){const a=ac(),tg={};for(const f of a.fills){const j=X.journal[f.t+'-'+f.id];if(j?.tag&&f.side==='sell'){const o=tg[j.tag]||(tg[j.tag]={n:0,r:0});o.n++;o.r+=f.rl}}
  return`${Object.keys(tg).length?`<div class="kvs">${Object.entries(tg).map(([k,o])=>`<span>${esc(k)} (${o.n})</span><b class="${cls(o.r)}">${fmt(o.r)}</b>`).join('')}</div>`:'<small>Etiquetá operaciones de venta para ver el resultado por etiqueta.</small>'}
  ${a.fills.length?`<table><tr><th>Hora</th><th>Activo</th><th>Lado</th><th>Cant.</th><th>Precio</th><th>Resultado</th><th>Etiqueta</th><th>Motivo / nota</th></tr>${a.fills.slice(0,40).map(f=>{const k=f.t+'-'+f.id,j=X.journal[k]||{};return`<tr><td>${hm(f.t)}</td><td>${f.sym}</td><td class="${f.side==='buy'?'up':'dn'}">${f.side==='buy'?'Compra':'Venta'}</td><td>${fmt(f.qty,4)}</td><td>${fmt(f.price,A[f.sym].dec)}</td><td class="${cls(f.rl)}">${f.side==='sell'?fmt(f.rl):'—'}</td><td><input type="text" maxlength="20" data-j="${k}" data-f="tag" value="${esc(j.tag)}"></td><td><input type="text" maxlength="200" data-j="${k}" data-f="note" value="${esc(j.note)}"></td></tr>`}).join('')}</table>`:'<div class="empty">Todavía no hay operaciones para anotar.</div>'}`},
 calc(){const p=mk().s[ctx.ui.sym].p;return`<div class="form"><select id="csym">${ASSETS.map(a=>`<option ${a.sym===ctx.ui.sym?'selected':''}>${a.sym}</option>`).join('')}</select><input id="cq" type="number" step="any" min="0" placeholder="Cantidad"><input id="cen" type="number" step="any" min="0" placeholder="Entrada" value="${p.toFixed(A[ctx.ui.sym].dec)}"><input id="cex" type="number" step="any" min="0" placeholder="Salida objetivo"><input id="cst" type="number" step="any" min="0" placeholder="Stop"></div><div id="cres"></div><p class="note">Compra de mercado con las reglas de tu cuenta: deslizamiento y comisión en entrada y salida. Solo posiciones largas.</p>`}
};
const AFTER={
 map(){$('#msize').value=size},
 perf(){const ys=X.eq.map(e=>e[1]);let pk=-Infinity;line('#ceq',ys,'#8b6cf0');line('#cdd',ys.map(y=>(pk=Math.max(pk,y),(y/pk-1)*100)),'#ef4f5f')},
 calc
};
function calc(){const g=id=>+$(id).value,a=ac(),q=g('#cq'),en=g('#cen'),ex=g('#cex'),st=g('#cst'),r=$('#cres');if(!r)return;
 if(!(q>0&&en>0))return void(r.innerHTML='<div class="empty">Ingresá cantidad y precio de entrada.</div>');
 const cost=q*en*(1+a.slip),basis=cost*(1+a.fee),out=x=>{const gr=q*x*(1-a.slip);return gr*(1-a.fee)-basis},eq=T.equity(a,ctx.px());
 const rows=[['Efectivo necesario',fmt(basis)+' ('+fmt(basis/eq*100,1)+'% del patrimonio)'],['Comisión de entrada',fmt(cost*a.fee,4)],['Disponible hoy',fmt(a.cash)+(basis>a.cash?'  — insuficiente':'')]];
 if(ex>0)rows.push(['Resultado hipotético en salida',fmt(out(ex))+' ('+fmt(out(ex)/basis*100)+'%)']);
 if(st>0)rows.push(['Pérdida en el stop',fmt(out(st))+' ('+fmt(out(st)/eq*100)+'% del patrimonio)']);
 if(ex>0&&st>0&&out(st)<0)rows.push(['Relación beneficio/riesgo',fmt(out(ex)/-out(st))]);
 r.innerHTML=`<div class="kvs">${rows.map(([k,v])=>row2(k,v)).join('')}</div>`}

/* ---------- Render, cinta y alertas ---------- */
function render(){if(!open)return;$('#otabs').innerHTML=TABS.map(([k,l])=>`<button data-k="${k}" class="${k===X.tab?'on':''}">${l}</button>`).join('');$('#ob').innerHTML=V[X.tab]();AFTER[X.tab]?.()}
function renderTape(){const m=mk(),s=ctx.ui.sym,d=A[s].dec;$('#tsym').textContent=s+' · simulada';
 $('#tape').innerHTML=`<div class="tp"><span>Hora</span><span>Precio</span><span>Cant.</span><span></span></div>`+m.s[s].bars.slice(-12).reverse().map(b=>`<div class="tp ${b.c>=b.o?'up':'dn'}"><span>${hm(b.t)}</span><span>${fmt(b.c,d)}</span><span>${Math.max(1,Math.round(b.v/10))}</span><span>${b.c>=b.o?'Compra':'Venta'}</span></div>`).join('')}
function ask(a){const m=mk(),s=m.s[a.sym];return a.kind==='price'?s.p:a.kind==='chg'?m.chg(a.sym)*100:rsi(agg(s.bars,5).map(b=>b.c))}
function checkAlerts(){let dirty=false;const m=mk();
 for(const a of X.alerts){if(!a.on)continue;const v=ask(a);if(v==null)continue;const hit=a.dir==='above'?v>=a.val:v<=a.val;
  if(!hit){if(!a.armed){a.armed=true;dirty=true}continue}
  if(a.armed&&m.simT>=(a.cool||0)){a.armed=false;a.cool=m.simT+30000;const msg=`${a.sym}: ${KL[a.kind]} ${a.dir==='above'?'≥':'≤'} ${a.val} (ahora ${fmt(v,a.kind==='price'?A[a.sym].dec:2)})`;X.hist.unshift({t:m.simT,msg});X.hist.length=Math.min(X.hist.length,100);toast('🔔 '+msg);dirty=true}}
 if(dirty){store();if(open&&X.tab==='alerts'&&!typing())render()}}
function chk(k,bad,msg){if(!bad){flags.delete(k);return}if(!flags.has(k)){flags.add(k);toast('⚠ '+msg);X.hist.unshift({t:mk().simT,msg:'Riesgo: '+msg});store()}}
function checkRisk(eq,p){const a=ac();chk('loss',(a.cash0-eq)/a.cash0*100>=X.risk.maxLoss,`la pérdida virtual superó el límite de ${X.risk.maxLoss}%`);
 for(const f of [...flags])if(f[0]==='e'&&!a.pos[f.slice(1)])flags.delete(f);
 for(const[s,q]of Object.entries(a.pos))chk('e'+s,q.qty*p[s]/eq*100>X.risk.maxExp,`${s} superó ${X.risk.maxExp}% del patrimonio`)}
function onT(){const m=mk();if(m.n===lastN)return;lastN=m.n;const p=ctx.px(),eq=T.equity(ac(),p);renderTape();
 if(m.n%5===0){X.eq.push([m.simT,eq]);if(X.eq.length>3000)X.eq.shift();if(m.n%30===0)store()}
 checkAlerts();checkRisk(eq,p);if(open&&m.n%2===0&&['map','perf','risk'].includes(X.tab)&&!typing())render()}
const show=v=>{open=v;$('#ov').hidden=!v;if(v)render()};

/* ---------- Montaje y eventos ---------- */
function mount(){
 document.body.insertAdjacentHTML('beforeend','<div id="ov" hidden><div class="box" role="dialog" aria-label="Herramientas de análisis"><div class="oh"><nav id="otabs"></nav><button id="oc">Cerrar</button></div><div id="ob"></div></div></div><div id="toasts" role="status"></div>');
 $('#top .ctl').insertAdjacentHTML('afterbegin','<button id="oa">Análisis</button>');
 $('#book').insertAdjacentHTML('afterend','<h3>Cinta de operaciones <small id="tsym">simulada</small></h3><div id="tape"></div>');
 $('#oa').onclick=()=>show(true);
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&open)show(false)});
 $('#ov').onclick=e=>{const d=e.target.dataset,id=e.target.id,tile=e.target.closest('[data-s]');
  if(id==='ov'||id==='oc')return show(false);
  if(d.k){X.tab=d.k;store();return render()}
  if(tile){ctx.pick(tile.dataset.s);return show(false)}
  if(id==='eqclr'){X.eq=[];store();return render()}
  if(d.tog){const a=X.alerts.find(x=>x.id==d.tog);if(a){a.on=!a.on;a.armed=true;store();render()}return}
  if(d.del){X.alerts=X.alerts.filter(x=>x.id!=d.del);store();return render()}
  if(id==='aadd'){const v=+$('#aval').value;if(!Number.isFinite(v)||$('#aval').value==='')return toast('Ingresá un valor numérico para la alerta');
   X.alerts.push({id:X.aid++,sym:$('#asym').value,kind:$('#akind').value,dir:$('#adir').value,val:v,on:true,armed:true,cool:0});store();render()}};
 $('#ov').onchange=e=>{const t=e.target,d=t.dataset;
  if(t.id==='msize'){size=t.value;render()}
  else if(t.id==='rml'||t.id==='rme'){const v=+t.value,k=t.id==='rml'?'maxLoss':'maxExp';if(v>0&&v<=100){X.risk[k]=v;flags.clear();store()}else t.value=X.risk[k]}
  else if(d.j){const o=X.journal[d.j]||(X.journal[d.j]={});o[d.f]=t.value.slice(0,200);store()}
  else if(t.id==='csym'){$('#cen').value=mk().s[t.value].p.toFixed(A[t.value].dec);calc()}};
 $('#ov').oninput=e=>{if(/^c(q|en|ex|st)$/.test(e.target.id))calc()};
}

/* ---------- Arranque: espera al motor, restaura datos validados y se suscribe ---------- */
(async()=>{
 while(!ctx.mk)await new Promise(r=>setTimeout(r,50));
 try{const s=await load('extras');if(s&&s.v===1){
  if(Array.isArray(s.eq))X.eq=s.eq.filter(e=>Array.isArray(e)&&Number.isFinite(e[0])&&Number.isFinite(e[1]));
  if(Array.isArray(s.alerts))X.alerts=s.alerts.filter(a=>a&&A[a.sym]&&KL[a.kind]&&(a.dir==='above'||a.dir==='below')&&Number.isFinite(a.val)&&Number.isFinite(a.id)).map(a=>({id:a.id,sym:a.sym,kind:a.kind,dir:a.dir,val:a.val,on:!!a.on,armed:a.armed!==false,cool:+a.cool||0}));
  if(Array.isArray(s.hist))X.hist=s.hist.filter(h=>h&&Number.isFinite(h.t)&&typeof h.msg==='string').slice(0,100);
  if(s.journal&&typeof s.journal==='object')X.journal=s.journal;
  if(s.risk&&s.risk.maxLoss>0&&s.risk.maxExp>0)X.risk=s.risk;
  if(TABS.some(t=>t[0]===s.tab))X.tab=s.tab;
  X.aid=Math.max(1,...X.alerts.map(a=>a.id+1))}}catch{}
 mount();mk().subs.add(onT);onT();
})();
