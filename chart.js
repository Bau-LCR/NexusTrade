// Gráfico Canvas 2D (sin dependencias): velas/línea, volumen, SMA/EMA, línea de precio, cursor, zoom (rueda), arrastre, doble clic = restaurar.
const sma=(v,n)=>v.map((_,i)=>i<n-1?null:v.slice(i-n+1,i+1).reduce((a,b)=>a+b,0)/n);
const ema=(v,n)=>{const k=2/(n+1);let e=null;return v.map((x,i)=>{if(i<n-1)return null;e=e===null?v.slice(0,n).reduce((a,b)=>a+b)/n:x*k+e*(1-k);return e})};
export class Chart{
 constructor(cv){Object.assign(this,{cv,n:120,off:0,type:'candles',sma:true,ema:true,vol:true,m:null,bars:[],dec:2,lines:[],raf:0,drag:null});
  cv.addEventListener('wheel',e=>{e.preventDefault();this.n=Math.max(20,Math.min(500,Math.round(this.n*(e.deltaY>0?1.15:.87))));this.req()},{passive:false});
  cv.addEventListener('pointerdown',e=>{this.drag={x:e.clientX,off:this.off};cv.setPointerCapture(e.pointerId)});
  cv.addEventListener('pointermove',e=>{const r=cv.getBoundingClientRect();this.m={x:e.clientX-r.left,y:e.clientY-r.top};
   if(this.drag)this.off=Math.max(0,Math.min(Math.max(0,this.bars.length-20),this.drag.off+Math.round((e.clientX-this.drag.x)/((r.width-62)/this.n))));this.req()});
  cv.addEventListener('pointerup',()=>this.drag=null);cv.addEventListener('pointerleave',()=>{this.m=null;this.req()});
  cv.addEventListener('dblclick',()=>this.reset());new ResizeObserver(()=>this.req()).observe(cv.parentElement)}
 reset(){this.n=120;this.off=0;this.req()}
 set(bars,dec,lines){this.bars=bars;this.dec=dec;this.lines=lines;this.req()}
 req(){if(!this.raf)this.raf=requestAnimationFrame(()=>{this.raf=0;this.draw()})}
 draw(){const cv=this.cv,box=cv.parentElement.getBoundingClientRect(),d=devicePixelRatio||1,W=box.width,H=box.height;
  if(cv.width!==Math.round(W*d)||cv.height!==Math.round(H*d)){cv.width=Math.round(W*d);cv.height=Math.round(H*d);cv.style.width=W+'px';cv.style.height=H+'px'}
  const g=cv.getContext('2d'),cs=getComputedStyle(document.documentElement),C=k=>cs.getPropertyValue(k).trim();g.setTransform(d,0,0,d,0,0);g.fillStyle=C('--bg');g.fillRect(0,0,W,H);
  const bars=this.bars,end=bars.length-this.off,start=Math.max(0,end-this.n),vis=bars.slice(start,end);g.font='11px ui-monospace,monospace';
  if(vis.length<2){g.fillStyle=C('--mute');g.fillText('Sin datos suficientes para esta temporalidad',16,24);return}
  const R=62,B=22,pw=W-R,vh=this.vol?(H-B)*.16:0,ph=H-B-vh,bw=pw/this.n;let hi=-Infinity,lo=Infinity;
  for(const b of vis){hi=Math.max(hi,b.h);lo=Math.min(lo,b.l)}const pad=(hi-lo)*.06||hi*.001;hi+=pad;lo-=pad;
  const X=i=>pw-(vis.length-i-.5)*bw,Y=p=>(hi-p)/(hi-lo)*ph,f=p=>p.toFixed(this.dec);
  g.textBaseline='middle';for(let k=0;k<=5;k++){const p=lo+(hi-lo)*k/5,y=Y(p);g.strokeStyle=C('--line');g.beginPath();g.moveTo(0,y);g.lineTo(pw,y);g.stroke();g.fillStyle=C('--mute');g.fillText(f(p),pw+6,y)}
  const step=Math.max(1,Math.floor(vis.length/6));g.textBaseline='top';g.fillStyle=C('--mute');for(let i=0;i<vis.length;i+=step)g.fillText(new Date(vis[i].t).toLocaleTimeString('es-AR'),Math.max(2,X(i)-24),H-B+6);
  const up=C('--up'),dn=C('--dn'),vmax=Math.max(...vis.map(b=>b.v))||1;
  if(this.type==='line'){g.strokeStyle=C('--fg');g.beginPath();vis.forEach((b,i)=>i?g.lineTo(X(i),Y(b.c)):g.moveTo(X(i),Y(b.c)));g.stroke()}
  vis.forEach((b,i)=>{const col=b.c>=b.o?up:dn,x=X(i);
   if(this.vol){g.globalAlpha=.35;g.fillStyle=col;const h=b.v/vmax*vh;g.fillRect(x-bw*.4,H-B-h,bw*.8,h);g.globalAlpha=1}
   if(this.type==='candles'){g.strokeStyle=g.fillStyle=col;g.beginPath();g.moveTo(x,Y(b.h));g.lineTo(x,Y(b.l));g.stroke();const y1=Y(Math.max(b.o,b.c)),y2=Y(Math.min(b.o,b.c));g.fillRect(x-bw*.35,y1,bw*.7,Math.max(1,y2-y1))}});
  const cl=bars.map(b=>b.c),leg=[];
  for(const[on,arr,col,nm,n]of[[this.sma,sma(cl,20),'--gold','SMA 20',20],[this.ema,ema(cl,50),'--acc','EMA 50',50]]){if(!on)continue;
   if(cl.length<n){leg.push(nm+': datos insuficientes');continue}leg.push(nm);g.strokeStyle=C(col);g.beginPath();let s=false;
   vis.forEach((b,i)=>{const v=arr[start+i];if(v==null)return;s?g.lineTo(X(i),Y(v)):g.moveTo(X(i),Y(v));s=true});g.stroke()}
  const tag=(p,col,txt)=>{const y=Y(p);if(y<0||y>ph)return;g.setLineDash([4,3]);g.strokeStyle=col;g.beginPath();g.moveTo(0,y);g.lineTo(pw,y);g.stroke();g.setLineDash([]);g.fillStyle=col;g.fillRect(pw,y-8,R,16);g.fillStyle='#000';g.textBaseline='middle';g.fillText(txt,pw+4,y)};
  const last=bars[bars.length-1];tag(last.c,last.c>=last.o?up:dn,f(last.c));for(const l of this.lines)tag(l.price,C('--gold'),(l.side==='buy'?'C ':'V ')+f(l.price));
  g.fillStyle=C('--mute');g.textBaseline='top';let txt=leg.join('  ·  ');
  if(this.m&&this.m.x<pw&&this.m.y<H-B){const{x,y}=this.m;g.setLineDash([3,3]);g.strokeStyle=C('--mute');g.beginPath();g.moveTo(x,0);g.lineTo(x,H-B);g.moveTo(0,y);g.lineTo(pw,y);g.stroke();g.setLineDash([]);
   const b=vis[Math.floor(vis.length-(pw-x)/bw)];if(b)txt=`A ${f(b.o)}  M ${f(b.h)}  Mín ${f(b.l)}  C ${f(b.c)}  Vol ${b.v}`;if(y<ph){g.fillStyle=C('--p2');g.fillRect(pw,y-8,R,16);g.fillStyle=C('--fg');g.textBaseline='middle';g.fillText(f(hi-y/ph*(hi-lo)),pw+4,y);g.textBaseline='top'}g.fillStyle=C('--fg')}
  g.fillText(txt,8,6)}
}
