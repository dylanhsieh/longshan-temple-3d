/* Small helpers borrowed verbatim from the Village Siege 3D codebase (China Civil War Games):
   src/2-core.js ($, rnd/clamp, seeded, store), fps/sprites.js (mk, R), fps3/game3d.js (cached nearest-filter tex). */
/* borrowed: src/2-core.js */
const $=s=>document.querySelector(s);
const rnd=Math.random,pick=a=>a[Math.floor(rnd()*a.length)],clamp=(v,a,b)=>v<a?a:v>b?b:v,sgn=v=>v<0?-1:1;
function seeded(s){return()=>{s=(s*16807)%2147483647;return(s-1)/2147483646}}
const store={get(k,d){try{const v=localStorage.getItem(k);return v==null?d:JSON.parse(v)}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
/* borrowed: fps/sprites.js */
function mk(w,h,fn){const c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d');g.imageSmoothingEnabled=false;fn(g);return c}
const R=(g,x,y,w,h,c)=>{g.fillStyle=c;g.fillRect(x,y,w,h)};
/* borrowed: fps3/game3d.js */
const TXC=new Map();
function tex(cv,rep){let t=TXC.get(cv);if(!t){t=new THREE.CanvasTexture(cv);t.magFilter=THREE.NearestFilter;t.minFilter=THREE.NearestFilter;t.generateMipmaps=false;if(rep){t.wrapS=t.wrapT=THREE.RepeatWrapping}TXC.set(cv,t)}return t}
