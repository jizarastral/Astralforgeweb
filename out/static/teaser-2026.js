(()=>{"use strict";
const canvas=document.querySelector(".network-canvas");if(!canvas)return;
const reduce=window.matchMedia("(prefers-reduced-motion: reduce)");const ctx=canvas.getContext("2d",{alpha:true});if(!ctx)return;
let w=0,h=0,dpr=1,raf=0,start=0;let nodes=[];let lines=[];let seeds=[];
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function project(x,y,z){const scale=1+z*.095;return {x:w*.76+(x-3.5)*Math.min(w*.044,51)*scale +z*21,y:h*.42+(y-3.1)*Math.min(h*.065,55)*scale-z*15};}
function layout(){const rect=canvas.getBoundingClientRect();w=Math.max(1,rect.width);h=Math.max(1,rect.height);dpr=Math.min(window.devicePixelRatio||1,2);canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);nodes=[];lines=[];
const cols=w<700?6:8,rows=w<700?7:9;for(let z=0;z<3;z++){for(let y=0;y<rows;y++){for(let x=0;x<cols;x++){const omit=((x*11+y*7+z*3)%9)<3;if(omit)continue;const pos=project(x,y,z);nodes.push({...pos,x0:x,y0:y,z,arrival:(x+y*.7+z*2)/20,phase:x*1.37+y*2.13+z*1.1,size:z===2?1.6:.9});}}}
const dict=new Map(nodes.map((p,i)=>[p.x0+","+p.y0+","+p.z,i]));nodes.forEach((n,i)=>{for(const delta of [[1,0,0],[0,1,0],[0,0,1]]){const k=[n.x0+delta[0],n.y0+delta[1],n.z+delta[2]].join(",");if(dict.has(k))lines.push([i,dict.get(k)]);}});seeds=Array.from({length:45},(_,i)=>({x:(i*71.17%100)/100*w,y:(i*29.41%100)/100*h,r:.25+(i%7)*.12,phase:i*1.9}));}
function draw(t){const time=(t-start)/1000;ctx.clearRect(0,0,w,h);
const veil=ctx.createRadialGradient(w*.77,h*.47,20,w*.77,h*.47,w*.43);veil.addColorStop(0,"rgba(85,103,204,.13)");veil.addColorStop(1,"rgba(85,103,204,0)");ctx.fillStyle=veil;ctx.fillRect(0,0,w,h);
for(const s of seeds){ctx.fillStyle="rgba(185,210,249,"+(.12+.15*Math.sin(time*.4+s.phase)).toFixed(3)+")";ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);ctx.fill();}
const build=reduce.matches?1:clamp(time/7,0,1);ctx.lineWidth=.7;for(const [a,b] of lines){const p=nodes[a],q=nodes[b];const ready=clamp((build-Math.max(p.arrival,q.arrival)*.8)*4,0,1);if(!ready)continue;ctx.strokeStyle="rgba(129,160,234,"+(.03+.17*ready).toFixed(3)+")";ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.stroke();}
nodes.forEach((p,i)=>{const ready=clamp((build-p.arrival*.8)*4,0,1);if(!ready)return;const shimmer=reduce.matches?1:.75+.25*Math.sin(time*.9+p.phase);const alpha=(.16+.47*shimmer)*ready;ctx.fillStyle=i%9===0?"rgba(146,251,236,"+alpha+")":"rgba(172,180,255,"+alpha+")";ctx.fillRect(p.x-p.size/2,p.y-p.size/2,p.size,p.size);if(i%31===0){ctx.strokeStyle="rgba(147,211,235,"+(.1*ready)+")";ctx.strokeRect(p.x-8,p.y-8,16,16);}});
if(!reduce.matches){raf=requestAnimationFrame(draw);}}
function restart(){cancelAnimationFrame(raf);layout();start=performance.now();if(reduce.matches)draw(start+9000);else raf=requestAnimationFrame(draw);}
window.addEventListener("resize",restart,{passive:true});document.addEventListener("visibilitychange",()=>{if(document.hidden){cancelAnimationFrame(raf)}else restart()});if(reduce.addEventListener)reduce.addEventListener("change",restart);restart();
})();