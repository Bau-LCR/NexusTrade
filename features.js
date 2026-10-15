#ov{position:fixed;inset:0;z-index:50;background:rgba(4,6,10,.78);display:flex;align-items:center;justify-content:center;padding:24px}
#ov .box{width:min(1100px,100%);max-height:100%;display:flex;flex-direction:column;background:var(--p1);border:1px solid var(--line);border-radius:4px}
#ov .oh{display:flex;justify-content:space-between;gap:8px;padding:8px;border-bottom:1px solid var(--line);flex-wrap:wrap}
#otabs{display:flex;gap:4px;flex-wrap:wrap}#otabs button.on{background:var(--acc);border-color:var(--acc)}
#ob{padding:12px;overflow:auto}
.bar{display:flex;gap:12px;align-items:center;margin-bottom:8px;flex-wrap:wrap}.bar small,#ob small{color:var(--mute)}
#hm{display:flex;flex-wrap:wrap;gap:3px}
.tile{display:flex;flex-direction:column;justify-content:center;align-items:center;min-height:84px;border:0;border-radius:2px;color:#fff;gap:2px}
.tile b{font-size:15px}.tile span{font-family:ui-monospace,Menlo,Consolas,monospace;font-size:11px}
.g2{display:grid;grid-template-columns:1fr 1fr;gap:14px}@media(max-width:800px){.g2{grid-template-columns:1fr}}
.kvs{display:grid;grid-template-columns:1fr auto;gap:3px 12px}.kvs span{color:var(--mute)}.kvs b{text-align:right}
canvas.cc{width:100%;height:130px;background:var(--bg);border:1px solid var(--line);display:block;margin-bottom:6px}
.dist{display:grid;grid-template-columns:70px 1fr 60px;gap:6px;align-items:center;margin:2px 0}.dist i{display:block;height:8px;background:var(--acc);border-radius:1px}
.form{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px}.form input{width:110px}
#ob input[type=text]{width:100%}
#tape{font-family:ui-monospace,Menlo,Consolas,monospace;font-size:11px}
.tp{display:grid;grid-template-columns:62px 1fr 48px 44px;gap:4px;text-align:right;padding:1px 4px}.tp span:first-child{text-align:left;color:var(--mute)}
#toasts{position:fixed;right:14px;bottom:34px;z-index:60;display:flex;flex-direction:column;gap:6px}
#toasts div{background:var(--p3);border:1px solid var(--gold);color:var(--fg);padding:8px 12px;border-radius:3px;max-width:340px}
