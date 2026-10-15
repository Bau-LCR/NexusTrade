// Motor de mercado simulado: GBM + reversión a la media + factor común (correlación parcial). Reloj propio, un único timer.
export const ASSETS=[['BUX','Buxer Capital','Acciones',120,.012],['RBC','Roble Corp','Acciones',48,.015],['GUAU','Guau Coin','Cripto',.42,.03],['LUNA','Lunar Token','Cripto',8.7,.028],['PIX','Pixel Índice','Índices',2450,.006],['PALO','Palo Verde Fund','Acciones',33,.01],['BLOQ','Bloq Chain','Cripto',215,.025],['GEM','Gema Metales','Materias primas',74,.011],['NOVA','Nova Energía','Acciones',19.5,.014],['AERO','Aero Índice','Índices',980,.007],['VORT','Vortex FX','Divisas',1.0842,.003],['ZEN','Zen Divisa','Divisas',.0067,.004],['QUAD','Quad Petróleo','Materias primas',61.3,.013],['ORBX','Orbix Labs','Acciones',255,.016],['NEX','Nex Coin','Cripto',3.15,.03]]
 .map(([sym,name,cat,p0,vol],i)=>({sym,name,cat,p0,vol,i,dec:p0<.01?5:p0<10?4:2}));
const MAX=2400,HIST=1800;
export function rng(s){return()=>{s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
export function agg(bars,tf){if(tf===1)return bars;const ms=tf*1000,out=[];let c;for(const b of bars){const k=Math.floor(b.t/ms)*ms;if(!c||c.t!==k){c={t:k,o:b.o,h:b.h,l:b.l,c:b.c,v:b.v};out.push(c)}else{c.h=Math.max(c.h,b.h);c.l=Math.min(c.l,b.l);c.c=b.c;c.v+=b.v}}return out}
export class Market{
 constructor(sv){this.seed=sv?.seed??(Date.now()%2147483647);this.n=sv?.n||0;this.simT=sv?.simT??Date.now();this.rand=rng(this.seed+this.n);
  this.paused=false;this.speed=1;this.vm=1;this.corr=true;this.subs=new Set();this.timer=null;this.s={};
  for(const a of ASSETS){const o=sv?.s?.[a.sym];this.s[a.sym]=Array.isArray(o?.bars)&&o.bars.length>20&&o.p>0?o:this.seedAsset(a)}}
 g(r=this.rand){return Math.sqrt(-2*Math.log(r()||1e-12))*Math.cos(2*Math.PI*r())}
 next(a,p,zm,r=this.rand){const z=this.corr?.4*zm+.92*this.g(r):this.g(r);const x=a.vol*.15*this.vm*z-.0004*Math.log(p/a.p0);return Math.max(p*Math.exp(Math.max(-.05,Math.min(.05,x))),1e-6)}
 mkBar(a,t,o,c,r){const w=a.vol*.03;return{t,o,c,h:Math.max(o,c)*(1+Math.abs(this.g(r))*w),l:Math.min(o,c)*(1-Math.abs(this.g(r))*w),v:Math.round(50+r()*200*(1+Math.abs(c/o-1)*200))}}
 seedAsset(a){const r=rng(this.seed+a.i*977+1),bars=[];let p=a.p0*(.9+r()*.2);const t0=this.simT-HIST*1000;
  for(let k=0;k<HIST;k++){const q=this.next(a,p,this.g(r),r);bars.push(this.mkBar(a,t0+k*1000,p,q,r));p=q}
  return{p,hi:Math.max(...bars.map(b=>b.h)),lo:Math.min(...bars.map(b=>b.l)),vol:bars.reduce((s,b)=>s+b.v,0),bars}}
 tick(){if(this.paused)return;this.simT+=1000;const zm=this.g();
  for(const a of ASSETS){const s=this.s[a.sym],o=s.p,c=this.next(a,o,zm),b=this.mkBar(a,this.simT,o,c,this.rand);s.p=c;s.hi=Math.max(s.hi,b.h);s.lo=Math.min(s.lo,b.l);s.vol+=b.v;s.bars.push(b);if(s.bars.length>MAX)s.bars.shift()}
  this.n++;this.subs.forEach(f=>f(this))}
 chg(sym){const b=this.s[sym].bars;return this.s[sym].p/b[Math.max(0,b.length-1441)].o-1}
 start(){clearTimeout(this.timer);if(this.paused)return;const loop=()=>{this.tick();this.timer=setTimeout(loop,1000/this.speed)};this.timer=setTimeout(loop,1000/this.speed)}
 pause(){this.paused=true;clearTimeout(this.timer)} resume(){this.paused=false;this.start()}
 setSpeed(x){this.speed=x;this.start()}
 snapshot(){return{seed:this.seed,n:this.n,simT:this.simT,s:this.s}}
}
