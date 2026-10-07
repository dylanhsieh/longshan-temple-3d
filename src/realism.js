/* ===================== realism layer (v3): HQ procedural textures + normal maps, PBR materials, sky IBL, baked AO ===================== */
/* value noise / fbm on a tiling grid */
function vnoise(seed,cells){const r=seeded(seed),g=new Float32Array(cells*cells);for(let i=0;i<g.length;i++)g[i]=r();
 return(x,y)=>{x=((x%cells)+cells)%cells;y=((y%cells)+cells)%cells;const xi=Math.floor(x),yi=Math.floor(y),xf=x-xi,yf=y-yi,x1=(xi+1)%cells,y1=(yi+1)%cells,s=t=>t*t*(3-2*t);
  const a=g[yi*cells+xi],b=g[yi*cells+x1],c=g[y1*cells+xi],d=g[y1*cells+x1],u=s(xf),v=s(yf);return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v}}
function fbm(seed,base){const ns=[0,1,2,3,4].map(o=>vnoise(seed+o*17,base<<o));return(x,y)=>{let v=0,a=.5,t=0;for(let o=0;o<5;o++){v+=ns[o](x*(base<<o),y*(base<<o))*a;t+=a;a*=.5}return v/t}}
/* build a colour canvas + height field in one pass; px(x,y) returns [r,g,b,height] for u,v in [0,1) */
function hqTex(w,h,px,ns=1){const c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d'),im=g.createImageData(w,h),H=new Float32Array(w*h);
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){const p=px(x/w,y/h,x,y),i=(y*w+x)*4;im.data[i]=p[0];im.data[i+1]=p[1];im.data[i+2]=p[2];im.data[i+3]=255;H[y*w+x]=p[3]}g.putImageData(im,0,0);
 const n=document.createElement('canvas');n.width=w;n.height=h;const ng=n.getContext('2d'),nm=ng.createImageData(w,h),at=(x,y)=>H[((y+h)%h)*w+((x+w)%w)];
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){const dx=(at(x+1,y)-at(x-1,y))*ns,dy=(at(x,y+1)-at(x,y-1))*ns,l=Math.hypot(dx,dy,1),i=(y*w+x)*4;
  nm.data[i]=(-dx/l*.5+.5)*255;nm.data[i+1]=(dy/l*.5+.5)*255;nm.data[i+2]=(1/l*.5+.5)*255;nm.data[i+3]=255}ng.putImageData(nm,0,0);return{c,n}}
const cl8=v=>v<0?0:v>255?255:v;
const HQ={
 /* glazed half-round roof tiles: 8 columns x 4 courses, cover tiles convex, lip shadow at each course */
 tile:()=>{const f=fbm(11,4),r=seeded(5),tint=[...Array(32)].map(()=>.9+r()*.2);return hqTex(256,256,(u,v)=>{const col=Math.floor(u*8),row=Math.floor(v*4),cu=u*8-col,cv=v*4-row,hgt=Math.sin(Math.PI*cu)**.6,lip=cv<.07?(cv/.07):1,ed=Math.min(cu,1-cu)<.06?.55:1;
  const t=tint[(row*8+col)%32],spec=Math.pow(Math.max(0,Math.sin(Math.PI*(cu-.12))),18)*.55,b=(105+95*hgt)*lip*ed*t+70*spec+(f(u,v)-.5)*28;const L=cl8(b);return[cl8(L*1.02),cl8(L),cl8(L*.95),hgt*.9+lip*.6]},3.2)},
 /* granite paving: long slabs, speckles, chamfered joints */
 stone:()=>{const f=fbm(7,6),sp=seeded(9),s2=vnoise(19,128);return hqTex(256,256,(u,v,x,y)=>{const row=Math.floor(v*4),off=(row%2)*.33,cu=((u+off)*2)%1,cv=v*4-row,j=Math.min(cu*256/2,(1-cu)*256/2,cv*64,(1-cv)*64);
  const joint=j<2.2?0:j<4?(j-2.2)/1.8:1,n=f(u,v),spk=s2(x*.9,y*.9),b=(142+n*44+(spk>.86?45:spk<.1?-55:0))*(.45+.55*joint);return[cl8(b*1.0),cl8(b*.98),cl8(b*.93),joint*.8+n*.2]},2.4)},
 /* cut stone wall blocks with chisel marks and recessed mortar */
 wall:()=>{const f=fbm(3,8),ch=vnoise(23,64);return hqTex(256,256,(u,v,x,y)=>{const row=Math.floor(v*4),off=(row%2)*.25,cu=((u+off)*2)%1,cv=v*4-row,e=Math.min(cu*128,(1-cu)*128,cv*64,(1-cv)*64);
  const m=e<2?0:e<5?(e-2)/3:1,n=f(u,v),c=ch(x*.5,y*1.3),b=(128+n*62+c*20)*(.5+.5*m);return[cl8(b),cl8(b),cl8(b*.97),m*.7+n*.3+c*.08]},2.6)},
 /* lacquered lattice screen: raised bars with wood grain, dark openings */
 wood:()=>{const gr=vnoise(31,32),f=fbm(29,4);return hqTex(256,256,(u,v,x,y)=>{const a=(u*4)%1,b=(v*4)%1,bar=Math.min(a,b)<.24,edge=Math.min(Math.abs(a-.12),Math.abs(b-.12));
  if(bar){const g=gr(x*.06,y*1.5)*.5+gr(x*1.5,y*.06)*.5,L=170+g*60+(f(u,v)-.5)*30,hl=edge<.04?40:0;return[cl8(L+hl),cl8(L*.97+hl),cl8(L*.93+hl),1-edge*2]}
  const L=60+f(u,v)*25;return[cl8(L),cl8(L),cl8(L),0]},3)},
 /* porcelain shard mosaic (剪黏) band */
 ridge:()=>{const r=seeded(41),cs=[[47,138,82],[230,180,64],[42,90,170],[200,55,45],[240,238,230],[224,122,42],[30,110,90],[250,210,90]],cells=[];for(let i=0;i<70;i++)cells.push([r()*256,r()*64,cs[(r()*8)|0]]);
  return hqTex(256,64,(u,v,x,y)=>{if(y<5||y>58){const L=y<5?230:40;return y<5?[232,168,58,.7]:[31,74,52,.2]}let b1=1e9,b2=1e9,cc=null;for(const c of cells){let dx=Math.abs(x-c[0]);dx=Math.min(dx,256-dx);const d=dx*dx+(y-c[1])**2;if(d<b1){b2=b1;b1=d;cc=c[2]}else if(d<b2)b2=d}
   const gap=Math.sqrt(b2)-Math.sqrt(b1),gl=gap<1.6?.35:1,sh=1+Math.max(0,.25-((x+y)%23)/90);return[cl8(cc[0]*gl*sh),cl8(cc[1]*gl*sh),cl8(cc[2]*gl*sh),gl]},2)},
 brick:()=>{const f=fbm(13,8),r=seeded(17),t=[...Array(64)].map(()=>.82+r()*.3);return hqTex(256,256,(u,v)=>{const row=Math.floor(v*8),off=(row%2)*.125,cu=((u+off)*4)%1,cv=v*8-row,bi=(row*4+Math.floor((u+off)*4))%64,m=Math.min(cu*64,(1-cu)*64,cv*32,(1-cv)*32)<2.2;
  if(m){const L=190+f(u,v)*30;return[L,L*.96,L*.9,0]}const k=t[bi]*(.85+f(u,v)*.3);return[cl8(178*k),cl8(78*k),cl8(56*k),1]},2)},
 city:()=>{const f=fbm(43,4);return hqTex(256,256,(u,v)=>{const cu=(u*4)%1,cv=(v*4)%1,win=cu>.18&&cu<.82&&cv>.2&&cv<.78;if(win){const g=cv<.25?.5:1,L=70+120*(1-cv)*.4;return[cl8(L*.75*g),cl8(L*.85*g),cl8(L*g+20),0]}
  const L=200+(f(u,v)-.5)*50-(cv>.92?30:0);return[cl8(L),cl8(L*.98),cl8(L*.94),1]},2)},
 water:()=>{const f=fbm(57,4);return hqTex(256,256,(u,v)=>{const n=f(u,v);const L=cl8(170+n*60);return[L,L,L,n]},4)}};
const HQC={};const hq=k=>HQC[k]||(HQC[k]=HQ[k]());
function linCol(h){return new THREE.Color(h).convertSRGBToLinear()}
function makeMats(){const A=Math.min(8,renderer.capabilities.getMaxAnisotropy()),T=(cv,rx,ry,srgb)=>{const t=new THREE.CanvasTexture(cv);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(rx,ry);t.anisotropy=A;if(srgb)t.encoding=THREE.sRGBEncoding;return t};
 const S=o=>new THREE.MeshStandardMaterial(Object.assign({vertexColors:true,envMapIntensity:.9},o));
 const W=(k,rx,ry,o,ns=1)=>{const h=hq(k);return S(Object.assign({map:T(h.c,rx,ry,true),normalMap:T(h.n,rx,ry,false),normalScale:new THREE.Vector2(ns,ns)},o))};
 const gl=new THREE.CanvasTexture(TEXC.glow());gl.encoding=THREE.sRGBEncoding;
 return{plain:S({roughness:.55,metalness:0}),tile:W('tile',.7,.9,{roughness:.28,metalness:.04,envMapIntensity:1.15},1.1),stone:W('stone',.5,.5,{roughness:.86},.9),wall:W('wall',.9,.9,{roughness:.9},1),
  wood:W('wood',1,1,{roughness:.42,envMapIntensity:1},1),ridge:W('ridge',.5,1,{roughness:.22,envMapIntensity:1.2},.8),shiny:S({roughness:.36,metalness:.55,envMapIntensity:.95}),
  brick:W('brick',1,1,{roughness:.85},1),city:W('city',1,1,{roughness:.6,metalness:.05},.6),glow:new THREE.MeshBasicMaterial({vertexColors:true,map:gl,toneMapped:false})}}
/* image-based lighting from the sky gradient + ground bounce + sun blob */
let envRT=null;
function makeEnv(night){const pm=new THREE.PMREMGenerator(renderer),sc=new THREE.Scene(),st=new THREE.CanvasTexture(skyCv(night));st.encoding=THREE.sRGBEncoding;
 sc.add(new THREE.Mesh(new THREE.SphereGeometry(50,32,16),new THREE.MeshBasicMaterial({map:st,side:THREE.BackSide})));
 const gm=new THREE.Mesh(new THREE.CircleGeometry(48,32),new THREE.MeshBasicMaterial({color:night?0x141018:0xb09a78}));gm.rotation.x=-Math.PI/2;gm.position.y=-4;sc.add(gm);
 const sun=new THREE.Mesh(new THREE.SphereGeometry(night?1.5:4,16,8),new THREE.MeshBasicMaterial({color:night?0x8090c0:0xfff2dc}));sun.material.color.multiplyScalar(night?1.2:14);sun.position.copy(sunL.position).normalize().multiplyScalar(44);sc.add(sun);
 const rt=pm.fromScene(sc,.035);pm.dispose();if(envRT)envRT.dispose();envRT=rt;S3.environment=rt.texture}
/* baked ambient occlusion in vertex colours: darker toward the base of vertical surfaces and under roofs */
function bakeAO(geo,kind){if(kind==='city'||kind==='glow')return;const p=geo.attributes.position.array,n=geo.attributes.normal.array,c=geo.attributes.color.array;
 for(let i=0;i<p.length;i+=3){const x=p[i],y=p[i+1],z=p[i+2],k=gi(x,z);if(k<0)continue;let f=1;const ny=n[i+1];
  if(ny<.7){const h=y-FLOOR[k];if(h>-.1)f*=.6+.4*Math.min(1,Math.max(0,h)/1.6)}
  if(kind!=='tile'&&kind!=='ridge'&&CEIL[k]<90&&y<CEIL[k]+.3)f*=ny>.7?.72:.82;
  if(ny<-.5)f*=.85;c[i]*=f;c[i+1]*=f;c[i+2]*=f}}
function upgradeRenderer(){renderer.outputEncoding=THREE.sRGBEncoding;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=.86;
 renderer.shadowMap.type=THREE.PCFSoftShadowMap;const big=!COARSE;sunL.shadow.mapSize.set(big?4096:2048,big?4096:2048);sunL.shadow.radius=3;sunL.shadow.bias=-.00035;sunL.shadow.normalBias=.03;
 sunL.intensity=2.6;hemi.intensity=.34;S3.fog.color.copy(linCol(0xd6e2e8))}

/* smooth waterfall sheet: streaks + foam, linear filtered */
function fallTex(){const r=seeded(9),c=mk(64,256,g=>{const gr=g.createLinearGradient(0,0,0,256);gr.addColorStop(0,'#7ab4c4');gr.addColorStop(1,'#a8d4dc');g.fillStyle=gr;g.fillRect(0,0,64,256);
 for(let i=0;i<420;i++){const x=r()*64,y=r()*256,l=10+r()*50,a=.15+r()*.5;g.fillStyle=`rgba(255,255,255,${a})`;g.fillRect(x,y,1+r()*1.5,l)}
 const fo=g.createLinearGradient(0,220,0,256);fo.addColorStop(0,'rgba(255,255,255,0)');fo.addColorStop(1,'rgba(255,255,255,.85)');g.fillStyle=fo;g.fillRect(0,220,64,36)});
 const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.encoding=THREE.sRGBEncoding;t.anisotropy=4;return t}
