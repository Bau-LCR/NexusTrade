const open=()=>new Promise((res,rej)=>{const r=indexedDB.open('bolsin',1);r.onupgradeneeded=()=>r.result.createObjectStore('kv');r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)});
const tx=async(mode,f)=>{const db=await open();return new Promise((res,rej)=>{const q=f(db.transaction('kv',mode).objectStore('kv'));q.onsuccess=()=>res(q.result);q.onerror=()=>rej(q.error)})};
export const load=k=>tx('readonly',s=>s.get(k));
export const save=(k,v)=>tx('readwrite',s=>s.put(v,k));
export function validate(d){const a=d&&d.account,f=Number.isFinite;
 if(!d||d.v!==1||!a)return'Formato o versión no reconocidos';
 for(const k of['cash0','cash','realized','fees','id','fee','slip'])if(!f(a[k]))return`Campo inválido: ${k}`;
 if(a.cash<0||a.fee<0||a.slip<0||a.fee>.05||a.slip>.05)return'Valores fuera de rango';
 if(!Array.isArray(a.orders)||!Array.isArray(a.fills)||!a.pos||typeof a.pos!=='object')return'Estructura de cuenta inválida';
 for(const p of Object.values(a.pos))if(!(p.qty>0&&p.avg>0&&f(p.qty)&&f(p.avg)))return'Posición inválida';return null}
export function download(text,name){const u=URL.createObjectURL(new Blob([text],{type:'application/json'})),l=document.createElement('a');l.href=u;l.download=name;l.click();setTimeout(()=>URL.revokeObjectURL(u),1e3)}
