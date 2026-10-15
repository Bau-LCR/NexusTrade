// Contabilidad: patrimonio = efectivo + Σ cantidad×precio. La comisión de compra se suma al costo medio.
// Realizado en venta = (cantidad×precio − comisión) − costo medio×cantidad. Largo únicamente, sin apalancamiento.
const ok=m=>({ok:true,msg:m}),er=m=>({ok:false,err:m}),fin=Number.isFinite;
export const fresh=()=>({cash0:1e5,cash:1e5,pos:{},orders:[],fills:[],realized:0,fees:0,id:1,fee:.001,slip:.0005});
export const equity=(ac,p)=>ac.cash+Object.entries(ac.pos).reduce((s,[k,v])=>s+v.qty*(p[k]||0),0);
export function reserved(ac){const r={cash:0,q:{}};for(const o of ac.orders)if(o.status==='pendiente'){if(o.side==='buy')r.cash+=o.qty*o.price*(1+ac.fee);else r.q[o.sym]=(r.q[o.sym]||0)+o.qty}return r}
export function avail(ac,p,sym,side){const r=reserved(ac);return side==='buy'?Math.max(0,(ac.cash-r.cash)/(p[sym]*(1+ac.slip)*(1+ac.fee))):Math.max(0,(ac.pos[sym]?.qty||0)-(r.q[sym]||0))}
function exec(ac,o,mp,t,lim){
 const fp=lim?(o.side==='buy'?Math.min(o.price,mp):Math.max(o.price,mp)):mp*(1+(o.side==='buy'?ac.slip:-ac.slip));let rl=0,q=o.qty;
 if(o.side==='buy'){const g=q*fp,fee=g*ac.fee,p=ac.pos[o.sym]||(ac.pos[o.sym]={qty:0,avg:0});ac.cash-=g+fee;p.avg=(p.avg*p.qty+g+fee)/(p.qty+q);p.qty+=q;o.fee=fee}
 else{const p=ac.pos[o.sym];q=Math.min(q,p.qty);const g=q*fp,fee=g*ac.fee;rl=g-fee-p.avg*q;ac.cash+=g-fee;ac.realized+=rl;p.qty-=q;if(p.qty<1e-9)delete ac.pos[o.sym];o.fee=fee}
 ac.fees+=o.fee;o.status='ejecutada';o.fp=fp;ac.fills.unshift({id:o.id,t,sym:o.sym,side:o.side,qty:q,price:fp,fee:o.fee,rl});ac.fills.length=Math.min(ac.fills.length,500);ac.orders.length=Math.min(ac.orders.length,500)}
export function place(ac,p,o,t){
 const qty=Math.round(+o.qty*1e8)/1e8,mp=p[o.sym],lim=o.type==='limit',lp=+o.price;
 if(!(qty>0&&fin(qty)))return er('Cantidad inválida');if(!(mp>0))return er('Activo sin precio');if(lim&&!(lp>0&&fin(lp)))return er('Precio límite inválido');
 const ref=lim?lp:mp*(1+(o.side==='buy'?ac.slip:-ac.slip)),r=reserved(ac);
 if(qty*ref<10)return er('Mínimo por orden: 10');
 if(o.side==='buy'){if(qty*ref*(1+ac.fee)>ac.cash-r.cash+1e-9)return er('Saldo insuficiente')}
 else if(qty>(ac.pos[o.sym]?.qty||0)-(r.q[o.sym]||0)+1e-9)return er('Cantidad no disponible (no hay ventas en corto)');
 const ord={id:ac.id++,t,sym:o.sym,side:o.side,type:o.type,qty,price:lim?lp:null,status:'pendiente'};ac.orders.unshift(ord);
 if(!lim||(o.side==='buy'?mp<=lp:mp>=lp)){exec(ac,ord,mp,t,lim);return ok(`Orden #${ord.id} ejecutada`)}
 return ok(`Orden #${ord.id} pendiente`)}
export function onTick(ac,p,t){let ch=false;
 for(const o of ac.orders){if(o.status!=='pendiente')continue;const mp=p[o.sym];if(!(o.side==='buy'?mp<=o.price:mp>=o.price))continue;
  if(o.side==='sell'&&(ac.pos[o.sym]?.qty||0)<o.qty-1e-9)o.status='rechazada';else exec(ac,o,mp,t,true);ch=true}return ch}
export function cancel(ac,id){const o=ac.orders.find(x=>x.id===id);if(!o||o.status!=='pendiente')return er('La orden ya no está pendiente');o.status='cancelada';return ok(`Orden #${id} cancelada`)}
export function close(ac,p,sym,f,t){const a=avail(ac,p,sym,'sell');if(!ac.pos[sym])return er('Sin posición');if(a<=0)return er('Cancelá las órdenes pendientes que reservan la posición');
 return place(ac,p,{sym,side:'sell',type:'market',qty:f>=1?a:Math.min(a,ac.pos[sym].qty*f)},t)}
