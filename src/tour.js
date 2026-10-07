/* ===================== 艋舺龍山寺 3D 導覽 · LONGSHAN TEMPLE 3D TOUR =====================
   Procedural Three.js (r128) recreation. Adapted from Village Siege 3D (fps3/game3d.js):
   same renderer/scene/fog/hemisphere+sun setup, cached nearest-filter canvas textures (tex),
   instanced meshes, grid collision with step-up floors, WASD + arrows + mouse look with pointer lock,
   left-stick / right-drag touch controls, fit/resize, pause and HTML overlays, localStorage via store.
   Units: 1 = 1 m. +x = east, +z = south (Guangzhou St.), y up. The temple faces south. */
const TAU=Math.PI*2,lerp=(a,b,t)=>a+(b-a)*t;
const COARSE=matchMedia('(pointer:coarse)').matches;
let LANG=store.get('lsTourLang','zh');if(LANG!=='en')LANG='zh';

/* ---------------- text ---------------- */
const TX={
 zh:{brand:'艋舺龍山寺',brandSub:'3D 導覽 · 近似重建',camFP:'第一人稱',camTP:'第三人稱',night:'夜景',map:'地圖',jump:'前往 ▾',help:'？',run:'快走',
  tHint:'左手：移動 · 右手：拖曳轉視角 · 雙指縮放',mapCap:'回字形平面 · 北 ↑',
  h1:'艋舺龍山寺 3D 導覽<span>LONGSHAN TEMPLE 3D TOUR · WANHUA, TAIPEI</span>',
  tag:'從廣州街的山門走進來：經過淨心瀑布、三川殿前的銅鑄龍柱，繞著正殿走過鐘樓、鼓樓，一路到後殿。你是一個小方塊。',
  go:'開始參觀',kDesk:'電腦',kPhone:'手機',
  kDeskB:'<kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> 或 <kbd>↑</kbd><kbd>↓</kbd> 移動，<kbd>←</kbd><kbd>→</kbd> 轉向<br>滑鼠拖曳轉視角（第一人稱點一下可鎖定滑鼠，<kbd>Esc</kbd> 放開）<br>滾輪縮放 · <kbd>Shift</kbd> 快走 · <kbd>V</kbd> 切換視角<br><kbd>N</kbd> 日／夜 · <kbd>M</kbd> 地圖 · <kbd>1</kbd>–<kbd>8</kbd> 跳到景點 · <kbd>P</kbd> 暫停',
  kPhoneB:'左半邊拇指：搖桿移動<br>右半邊拖曳：轉視角<br>雙指開合或 ＋／－：縮放 · 「快走」切換速度<br>上方按鈕：視角、夜景、地圖、前往景點',
  fine:'依公開資料（龍山寺官網、文化部《艋舺龍山寺保存計畫》、臺北旅遊網等）重建的非官方近似模型；比例、色彩與細部多為推估，僅供導覽參考。',
  pauseH:'暫停<span>PAUSED</span>',resume:'繼續參觀',src:'資料來源',toFP:'第一人稱視角',toTP:'第三人稱視角',dayOn:'白天',nightOn:'夜景：燈籠點亮',mapOn:'地圖開啟',mapOff:'地圖關閉',
  welcome:'歡迎！往北（前方）走進山門'},
 en:{brand:'Longshan Temple',brandSub:'3D tour · approximate model',camFP:'1st person',camTP:'3rd person',night:'Night',map:'Map',jump:'Go to ▾',help:'?',run:'Run',
  tHint:'Left thumb: walk · right side: drag to look · pinch to zoom',mapCap:'Hui (回) plan · north ↑',
  h1:'Longshan Temple 3D Tour<span>艋舺龍山寺 3D 導覽 · WANHUA, TAIPEI</span>',
  tag:'Walk in from Guangzhou Street: past the waterfall, the bronze dragon columns of the Front Hall, around the Main Hall by the bell and drum towers, and on to the Rear Hall. You are a small cube.',
  go:'Start the tour',kDesk:'Desktop',kPhone:'Phone',
  kDeskB:'<kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> or <kbd>↑</kbd><kbd>↓</kbd> move, <kbd>←</kbd><kbd>→</kbd> turn<br>Drag the mouse to look (in first person, click to lock the mouse; <kbd>Esc</kbd> releases)<br>Scroll to zoom · <kbd>Shift</kbd> walk faster · <kbd>V</kbd> camera<br><kbd>N</kbd> day/night · <kbd>M</kbd> map · <kbd>1</kbd>–<kbd>8</kbd> jump to a spot · <kbd>P</kbd> pause',
  kPhoneB:'Left thumb: stick to move<br>Drag on the right: look around<br>Pinch or + / −: zoom · “Run” toggles speed<br>Top buttons: camera, night, map, go to a spot',
  fine:'An approximate, non-official recreation based on public sources (the temple’s website, the Ministry of Culture conservation plan, Taipei Travel and others). Proportions, colours and details are estimates.',
  pauseH:'Paused<span>暫停</span>',resume:'Continue the tour',src:'Sources',toFP:'First-person view',toTP:'Third-person view',dayOn:'Daytime',nightOn:'Night: lanterns lit',mapOn:'Map on',mapOff:'Map off',
  welcome:'Welcome! Walk north (ahead) through the gate'}};
const t_=k=>(TX[LANG]&&TX[LANG][k])||TX.zh[k]||k;

/* Hotspots. Text is drawn only from RESEARCH.md sources. x,z = trigger centre, r = radius, my = marker height, tp = teleport [x,z,yaw] */
const SPOTS=[
 {id:'gate',x:6,z:33,r:8,my:4.2,tp:[0,37,0],src:'S1 S3 S4 S12',
  zh:['山門與淨心瀑布','山門建於1960年，為四柱三間、重簷歇山式的門樓，面向南邊的廣州街。進門後，人工的「淨心瀑布」與鯉魚池在右手邊（東側），左手邊（西側）是噴泉水池。'],
  en:['Mountain Gate & Waterfall','The mountain gate was built in 1960: three bays on four columns under a double-eave hip-and-gable roof, facing Guangzhou Street to the south. Inside, the man-made “Purify the Heart” waterfall and koi pond are on your right (east); a fountain pool is on the left (west).']},
 {id:'front',x:0,z:17.5,r:4.6,my:3.2,tp:[0,22,0],src:'S1 S2 S3 S9',
  zh:['三川殿與銅鑄龍柱','三川殿（前殿）是進寺的門廳，共有五個門：中間三門，左右廳各一門。中門前那對龍柱以青銅鑄造，寺方介紹為全臺唯一的銅鑄龍柱。殿內有八角形藻井。'],
  en:['Front Hall & Bronze Dragon Columns','The Front Hall (Sanchuan Hall) is the entrance hall, with five doors: three in the centre and one in each side hall. The pair of dragon columns at the central door is cast in bronze, which the temple describes as the only bronze dragon columns in Taiwan. Inside is an octagonal caisson ceiling.']},
 {id:'bell',x:14.2,z:1,r:4.2,my:3.6,tp:[10.5,2,-Math.PI/2],src:'S1 S3 S11',
  zh:['鐘樓','鐘樓與鼓樓對稱立在中庭兩側，平面六角形、重簷，屋頂是呈倒「S」曲線的盔頂（俗稱轎頂），被認為是當年臺灣首見的造型。本模型依傳統「左鐘右鼓」把鐘樓放在東側。'],
  en:['Bell Tower','The bell and drum towers stand symmetrically on either side of the courtyard: hexagonal, double-eaved, and topped by a helmet roof with a reversed “S” curve (often called a sedan-chair roof), said to be a first in Taiwan. This model follows the usual “bell on the left, drum on the right” rule and puts the bell tower on the east.']},
 {id:'drum',x:-14.2,z:1,r:4.2,my:3.6,tp:[-10.5,2,Math.PI/2],src:'S1 S4 S7 S11',
  zh:['鼓樓','鼓樓與鐘樓成對，同樣是六角重簷的轎頂造型；鐘鼓在農曆新年等節慶時使用。龍山寺的現貌大多來自1919至1924年間，由泉州大木匠師王益順主持的改建。'],
  en:['Drum Tower','The drum tower mirrors the bell tower, with the same hexagonal, double-eaved sedan-chair roof; the bell and drum are used at festivals such as Lunar New Year. Most of what you see dates from the 1919–1924 rebuild led by Quanzhou master builder Wang Yi-shun.']},
 {id:'burner',x:0,z:.6,r:3.1,my:3.9,tp:[0,4.2,0],src:'S5 S7',
  zh:['中庭與香爐','三川殿與正殿之間的中庭擺著供桌與香爐，信眾在這裡獻上花果、上香祈願。寺內供奉百餘尊佛教、道教與儒家的神像。'],
  en:['Courtyard & Incense Burner','The courtyard between the Front Hall and the Main Hall holds offering tables and an incense burner, where worshippers lay out flowers and fruit and offer incense. The temple houses more than a hundred Buddhist, Taoist and Confucian deities.']},
 {id:'main',x:0,z:-6.6,r:3.4,my:4.4,tp:[0,-6.4,0],src:'S1 S3 S4 S10',
  zh:['正殿（觀音殿）','正殿供奉主神觀世音菩薩，兩旁為文殊、普賢菩薩與十八羅漢。屋頂為重簷歇山式，高約13公尺。正殿在1945年的空襲中被炸毀，觀音像倖存，戰後於1950年代重建。'],
  en:['Main Hall (Guanyin)','The Main Hall enshrines Guanyin, flanked by Manjusri and Samantabhadra and the eighteen arhats. Its double-eave hip-and-gable roof stands about 13 m high. An air raid destroyed the hall in 1945; the Guanyin statue survived, and the hall was rebuilt in the 1950s.']},
 {id:'rear',x:0,z:-30.5,r:6.5,my:4.4,tp:[0,-25.6,0],src:'S1 S3 S6 S7',
  zh:['後殿','後殿約在18世紀末增建，面寬十一間，屋頂同為重簷歇山。殿內供奉媽祖、文昌帝君、關聖帝君等道教與民間信仰神祇，月下老人則在後方左側。'],
  en:['Rear Hall','The Rear Hall was added around the end of the 18th century. Eleven bays wide, it also has a double-eave hip-and-gable roof. It honours Taoist and folk deities including Mazu, the gods of literature and Guan Yu; Yue Lao, the matchmaker god, is at the rear left.']},
 {id:'caisson',x:0,z:8.3,r:2.2,my:3.3,tp:[0,7.6,0],src:'S13 S1',
  zh:['藻井（抬頭看）','三川殿中央的八卦藻井，由32組斗栱層層向中心收攏而成。正殿內則有直徑約5.82公尺的圓形螺旋藻井，同樣由斗栱相嵌，不用一根鐵釘。走進殿內、往上看。'],
  en:['Caisson Ceilings (look up)','Above the centre of the Front Hall is an octagonal caisson ceiling built from 32 bracket sets stepping in toward the middle. Inside the Main Hall is a round spiral caisson about 5.82 m across, also fitted together from brackets without a single nail. Step inside and look up.']}];
const SRC_NAMES={S1:'龍山寺官網',S2:'龍山寺官網·藝術',S3:'林會承講座(龍山寺電子書)',S4:'文化部保存計畫',S5:'臺北旅遊網',S6:'臺北旅遊網專文',S7:'Smithsonian',S9:'Newtalk',S10:'Spectral Codex',S11:'旅遊部落格',S12:'旅遊指南',S13:'內政部臺灣宗教百景'};
const SRC_EN={S1:'temple website',S2:'temple website (art)',S3:'Lin Hui-cheng talk (temple e-book)',S4:'Ministry of Culture conservation plan',S5:'Taipei Travel',S6:'Taipei Travel article',S7:'Smithsonian',S9:'Newtalk',S10:'Spectral Codex',S11:'travel blog',S12:'travel guide',S13:'Ministry of the Interior, Taiwan Religious Culture Map'};

/* ---------------- collision grid (borrowed idea: Village Siege cellH/blocked, refined to 0.25 m) ---------------- */
const GX0=-46,GZ0=-54,GRES=.25,GW=368,GD=448;
const FLOOR=new Float32Array(GW*GD),SOLID=new Float32Array(GW*GD),CEIL=new Float32Array(GW*GD).fill(99),RTOP=new Float32Array(GW*GD);
const gi=(x,z)=>{const i=Math.floor((x-GX0)/GRES),j=Math.floor((z-GZ0)/GRES);return(i<0||j<0||i>=GW||j>=GD)?-1:j*GW+i};
function cells(x0,z0,x1,z1,fn){const a=Math.min(x0,x1),b=Math.max(x0,x1),c=Math.min(z0,z1),d=Math.max(z0,z1);
 const i0=Math.max(0,Math.round((a-GX0)/GRES)),i1=Math.min(GW,Math.round((b-GX0)/GRES)),j0=Math.max(0,Math.round((c-GZ0)/GRES)),j1=Math.min(GD,Math.round((d-GZ0)/GRES));
 for(let j=j0;j<j1;j++)for(let i=i0;i<i1;i++)fn(j*GW+i,GX0+(i+.5)*GRES,GZ0+(j+.5)*GRES)}
const setFloor=(x0,z0,x1,z1,h)=>cells(x0,z0,x1,z1,k=>FLOOR[k]=h);
const solid=(x0,z0,x1,z1,h=99)=>cells(x0,z0,x1,z1,k=>{if(h>SOLID[k])SOLID[k]=h});
const solidC=(cx,cz,r,h=99)=>cells(cx-r,cz-r,cx+r,cz+r,(k,x,z)=>{if((x-cx)**2+(z-cz)**2<=r*r&&h>SOLID[k])SOLID[k]=h});
function cover(x0,z0,x1,z1,ceil,top){const cx=(x0+x1)/2,cz=(z0+z1)/2,hx=Math.abs(x1-x0)/2,hz=Math.abs(z1-z0)/2;
 cells(x0,z0,x1,z1,(k,x,z)=>{const e=Math.min(hx-Math.abs(x-cx),hz-Math.abs(z-cz))/Math.min(hx,hz);CEIL[k]=Math.min(CEIL[k],ceil);RTOP[k]=Math.max(RTOP[k],lerp(ceil+.6,top,Math.min(1,e*1.4)))})}
const ground=(x,z)=>{const k=gi(x,z);return k<0?99:Math.max(FLOOR[k],SOLID[k])};

/* ---------------- geometry buckets: everything static merges into ~10 draw calls ---------------- */
const col=h=>{const c=new THREE.Color(h).convertSRGBToLinear();return[c.r,c.g,c.b]};
const shade=(c,f)=>[Math.min(1,c[0]*f),Math.min(1,c[1]*f),Math.min(1,c[2]*f)];
const sub=(a,b)=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]],add=(a,b)=>[a[0]+b[0],a[1]+b[1],a[2]+b[2]],scl=(a,s)=>[a[0]*s,a[1]*s,a[2]*s];
const crs=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]],dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2],len=a=>Math.hypot(a[0],a[1],a[2]),nrm=a=>{const l=len(a)||1;return[a[0]/l,a[1]/l,a[2]/l]};
const UV0=[[0,0],[1,0],[1,1],[0,1]];
class GB{constructor(){this.P=[];this.N=[];this.U=[];this.C=[]}
 tri(a,b,c,ua,ub,uc,cl,hint){let n=crs(sub(b,a),sub(c,a));const l=len(n);if(l<1e-9)return;n=scl(n,1/l);
  if(hint){const m=[(a[0]+b[0]+c[0])/3-hint[0],(a[1]+b[1]+c[1])/3-hint[1],(a[2]+b[2]+c[2])/3-hint[2]];if(dot(n,m)<0){let t=b;b=c;c=t;t=ub;ub=uc;uc=t;n=scl(n,-1)}}
  for(const[p,u]of[[a,ua],[b,ub],[c,uc]]){this.P.push(p[0],p[1],p[2]);this.N.push(n[0],n[1],n[2]);this.U.push(u[0],u[1]);this.C.push(cl[0],cl[1],cl[2])}}
 quad(a,b,c,d,cl,uv,hint){uv=uv||UV0;this.tri(a,b,c,uv[0],uv[1],uv[2],cl,hint);this.tri(a,c,d,uv[0],uv[2],uv[3],cl,hint)}
 geo(){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(this.P,3));g.setAttribute('normal',new THREE.Float32BufferAttribute(this.N,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(this.U,2));g.setAttribute('color',new THREE.Float32BufferAttribute(this.C,3));g.computeBoundingSphere();return g}}
const G={};for(const k of['plain','tile','stone','wall','wood','ridge','shiny','brick','city','glow'])G[k]=new GB();

function box(g,x0,y0,z0,x1,y1,z1,c,o={}){const top=o.top||c,s=o.s||1,P=(x,y,z)=>[x,y,z];
 const f=[[P(x1,y0,z1),P(x1,y0,z0),P(x1,y1,z0),P(x1,y1,z1),[[0,y0],[z1-z0,y0],[z1-z0,y1],[0,y1]]],
  [P(x0,y0,z0),P(x0,y0,z1),P(x0,y1,z1),P(x0,y1,z0),[[0,y0],[z1-z0,y0],[z1-z0,y1],[0,y1]]],
  [P(x0,y0,z1),P(x1,y0,z1),P(x1,y1,z1),P(x0,y1,z1),[[x0,y0],[x1,y0],[x1,y1],[x0,y1]]],
  [P(x1,y0,z0),P(x0,y0,z0),P(x0,y1,z0),P(x1,y1,z0),[[-x1,y0],[-x0,y0],[-x0,y1],[-x1,y1]]]];
 for(const q of f){if(o.only&&!o.only.includes(f.indexOf(q)))continue;g.quad(q[0],q[1],q[2],q[3],c,q[4].map(u=>[u[0]*s,u[1]*s]))}
 if(!o.noTop)g.quad(P(x0,y1,z1),P(x1,y1,z1),P(x1,y1,z0),P(x0,y1,z0),top,[[x0*s,-z1*s],[x1*s,-z1*s],[x1*s,-z0*s],[x0*s,-z0*s]])}
function prism(g,cx,cz,r,y0,y1,n,c,o={}){const r1=o.r1??r,off=o.off||0,ctr=[cx,(y0+y1)/2,cz],P=[],Q=[];
 for(let k=0;k<=n;k++){const a=off+k*TAU/n;P.push([cx+Math.cos(a)*r,y0,cz+Math.sin(a)*r]);Q.push([cx+Math.cos(a)*r1,y1,cz+Math.sin(a)*r1])}
 const C2=o.c2;for(let k=0;k<n;k++)g.quad(P[k],P[k+1],Q[k+1],Q[k],C2&&k%2?C2:c,[[k*r,y0],[(k+1)*r,y0],[(k+1)*r,y1],[k*r,y1]],ctr);
 if(o.cap!==false&&r1>0)for(let k=0;k<n;k++)g.tri([cx,y1,cz],Q[k+1],Q[k],[0,0],[1,0],[0,1],o.top||c,[cx,y0-50,cz])}
function seg(g,p,q,w,h,c,o={}){const d=sub(q,p),L=len(d);if(L<1e-6)return;const dn=scl(d,1/L);let n=crs(dn,[0,1,0]);if(len(n)<1e-3)n=[1,0,0];n=nrm(n);const u=crs(n,dn);
 const w0=Array.isArray(w)?w[0]:w,w1=Array.isArray(w)?w[1]:w,h0=Array.isArray(h)?h[0]:h,h1=Array.isArray(h)?h[1]:h;
 const cs=[[-1,-1],[1,-1],[1,1],[-1,1]],A=cs.map(([a,b])=>add(p,add(scl(n,a*w0/2),scl(u,b*h0/2)))),B=cs.map(([a,b])=>add(q,add(scl(n,a*w1/2),scl(u,b*h1/2)))),m=scl(add(p,q),.5);
 const l0=o.l0||0,l1=l0+L;for(let k=0;k<4;k++){const k2=(k+1)%4;g.quad(A[k],A[k2],B[k2],B[k],c,[[l0,k%2?1:0],[l0,k%2?0:1],[l1,k%2?0:1],[l1,k%2?1:0]],m)}
 if(o.caps!==false){g.quad(A[0],A[1],A[2],A[3],c,null,m);g.quad(B[0],B[1],B[2],B[3],c,null,m)}return L}
function chain(g,pts,w,h,c,o={}){let l=0;const n=pts.length-1;for(let i=0;i<n;i++){const t0=i/n,t1=(i+1)/n,W=typeof w==='function'?[w(t0),w(t1)]:w,H=typeof h==='function'?[h(t0),h(t1)]:h;
 l+=seg(g,pts[i],pts[i+1],W,H,typeof c==='function'?c(i):c,{l0:l,caps:i===0||i===n-1||o.caps})}}

/* ---------------- palette ---------------- */
const K={tile:col(0xd08c34),tileG:col(0x3f8a5a),edge:col(0x2f7a52),soff:col(0x6a2a1c),red:col(0xb3261c),redD:col(0x7e1a12),gold:col(0xe0b040),
 stoneL:col(0xcfc8b8),stoneM:col(0xa9a394),stoneD:col(0x7d837f),blue:col(0x2a5aa0),green:col(0x2e8a4a),white:col(0xf0eee6),black:col(0x2a2622),
 wood:col(0x7a3a22),bronze:col(0x342c1e),bronzeL:col(0xa08240),hip:col(0x3d8f5f),pave:col(0xd8d2c4),paveC:col(0xc6c0b2),grass:col(0x6f8f4a),leaf:col(0x3f7a3a),asph:col(0x55575a)};

/* ---------------- textures (procedural canvas, nearest filtered like Village Siege) ---------------- */
function noiseFill(g,w,h,base,amp,seed){const r=seeded(seed);for(let y=0;y<h;y++)for(let x=0;x<w;x++){const v=Math.max(0,Math.min(255,base+(r()-.5)*amp|0));g.fillStyle=`rgb(${v},${v},${v})`;g.fillRect(x,y,1,1)}}
const TEXC={
 tile:()=>mk(32,32,g=>{for(let y=0;y<32;y++)for(let x=0;x<32;x++){const cx=x%4,cy=y%8;let v=cx===0?120:cx===1?235:cx===2?215:175;if(cy===0)v-=55;if(cy===1)v-=20;R(g,x,y,1,1,`rgb(${v},${v},${v})`)}}),
 stone:()=>mk(64,64,g=>{const r=seeded(7);R(g,0,0,64,64,'#888');for(let y=0;y<64;y+=16){let x=-(y/16%2)*12;while(x<64){const w=14+(r()*18|0),v=200+(r()*36|0);R(g,x+1,y+1,w-1,15,`rgb(${v},${v},${v-6})`);for(let i=0;i<6;i++){const s=v-14-(r()*10|0);R(g,x+2+(r()*(w-4)|0),y+2+(r()*12|0),1,1,`rgb(${s},${s},${s})`)}x+=w}}}),
 wall:()=>mk(32,32,g=>{const r=seeded(3);R(g,0,0,32,32,'#9a9a96');for(let y=0;y<32;y+=8){const off=(y/8%2)*8;for(let x=-8;x<32;x+=16){const v=200+(r()*30|0);R(g,x+off+1,y+1,15,7,`rgb(${v},${v},${v})`);for(let i=0;i<5;i++)R(g,x+off+2+(r()*13|0),y+2+(r()*5|0),1,1,'#bbb')}}}),
 wood:()=>mk(32,32,g=>{R(g,0,0,32,32,'#5a5a5a');for(let y=0;y<32;y+=1)for(let x=0;x<32;x++){if(x%8<2||y%8<2)R(g,x,y,1,1,'#f0f0f0');else if((x+y)%4===0)R(g,x,y,1,1,'#7a7a7a')}R(g,0,0,32,1,'#ffffff')}),
 ridge:()=>mk(64,16,g=>{const cs=['#2f7a52','#e0b040','#2a5aa0','#c8372d','#2f7a52','#f0eee6','#2a5aa0','#e07a2a'];R(g,0,0,64,16,'#2f6a4a');
  for(let i=0;i<8;i++){R(g,i*8+1,3,7,9,cs[i]);R(g,i*8+3,5,3,5,cs[(i+3)%8]);R(g,i*8+4,6,1,3,'#fff')}R(g,0,0,64,2,'#e8a83a');R(g,0,14,64,2,'#1f4a34')}),
 brick:()=>mk(32,32,g=>{const r=seeded(11);R(g,0,0,32,32,'#c9b8a0');for(let y=0;y<32;y+=4){const off=(y/4%2)*4;for(let x=-4;x<32;x+=8){const v=r();R(g,x+off,y,7,3,v<.33?'#a8442e':v<.66?'#b8523a':'#9a3c28')}}}),
 city:()=>mk(32,32,g=>{R(g,0,0,32,32,'#d8d4cc');for(let y=2;y<32;y+=8)for(let x=2;x<32;x+=8){R(g,x,y,5,5,'#5a6470');R(g,x,y,5,1,'#8a949c')}R(g,0,30,32,2,'#b0aca4')}),
 glow:()=>mk(16,16,g=>{R(g,0,0,16,16,'#ffffff');for(let x=0;x<16;x+=4)R(g,x,0,1,16,'#e8e0d0')}),
 water:()=>mk(32,32,g=>{R(g,0,0,32,32,'#3d7f8f');const r=seeded(5);for(let i=0;i<26;i++)R(g,r()*30|0,r()*32|0,2+(r()*5|0),1,i%3?'#5fa3b0':'#a8d8e0')}),
 fall:()=>mk(16,64,g=>{const r=seeded(9);R(g,0,0,16,64,'#6aa8b8');for(let x=0;x<16;x++){for(let y=0;y<64;y+=1){if(r()<.25)R(g,x,y,1,3+(r()*6|0),r()<.5?'#ffffff':'#d8f0f4')}}}),
 soft:()=>mk(32,32,g=>{const gr=g.createRadialGradient(16,16,0,16,16,16);gr.addColorStop(0,'rgba(255,255,255,1)');gr.addColorStop(.5,'rgba(255,255,255,.45)');gr.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=gr;g.fillRect(0,0,32,32)}),
 halo:()=>mk(32,32,g=>{const gr=g.createRadialGradient(16,16,0,16,16,16);gr.addColorStop(0,'rgba(255,220,150,1)');gr.addColorStop(.3,'rgba(255,140,60,.55)');gr.addColorStop(1,'rgba(255,80,20,0)');g.fillStyle=gr;g.fillRect(0,0,32,32)})};
const TX3={};function T3(k,rx=1,ry=1){if(!TX3[k]){const t=tex(TEXC[k](),true);t.repeat.set(rx,ry);TX3[k]=t}return TX3[k]}

/* ---------------- roof builders ---------------- */
/* Hip-and-gable (歇山, vb>0) or gable (vb=0) roof with concave profile, upturned corners, soffit, fascia,
   hip ridges and a main ridge with swallowtail ends (燕尾脊). rot:true runs the ridge north-south. */
function roof(o){const{cx,cz,y0,W,D,rise}=o,NU=o.nu||16,NV=o.nv||10;let vb=o.vb??.42;const jb=Math.round(vb*NV);vb=jb/NV;
 const rl=vb>0?(o.rl??W*.55):W,lift=o.lift??.9,fl=o.flare??.5,th=o.th??.28,hd=D/2,hw0=W/2;
 const T=o.rot?(x,y,z)=>[cx+z,y,cz-x]:(x,y,z)=>[cx+x,y,cz+z];
 const yv=v=>y0+rise*Math.pow(v,1.7),hwv=v=>vb>0?(v<vb?lerp(hw0,rl/2,v/vb):rl/2):hw0;
 const tile=o.col||K.tile,edge=o.edge||K.edge,soff=o.soff||K.soff,below=T(0,y0-80,0),above=T(0,y0+90,0),ctr=T(0,y0+rise*.35,0);
 const L=(x,z,y,c,t)=>{const k=c*t*t;return[x+Math.sign(x)*fl*k,y+lift*k,z+Math.sign(z)*fl*k]};
 const surf=(pt,ni,nj,uvf,eaveJ0,barge)=>{const top=[],sof=[];for(let i=0;i<=ni;i++){top.push([]);sof.push([]);for(let j=0;j<=nj;j++){const p=pt(i,j);top[i].push(T(p[0],p[1],p[2]));sof[i].push(T(p[0],p[1]-th,p[2]))}}
  for(let i=0;i<ni;i++)for(let j=0;j<nj;j++){const uv=[uvf(i,j),uvf(i+1,j),uvf(i+1,j+1),uvf(i,j+1)],cl=shade(tile,.94+((i*7+j*3)%5)*.03);
   G.tile.quad(top[i][j],top[i+1][j],top[i+1][j+1],top[i][j+1],cl,uv,below);G.plain.quad(sof[i][j],sof[i+1][j],sof[i+1][j+1],sof[i][j+1],soff,null,above)}
  if(eaveJ0)for(let i=0;i<ni;i++)G.plain.quad(top[i][0],top[i+1][0],sof[i+1][0],sof[i][0],edge,null,ctr);
  if(barge)for(const i of[0,ni])for(let j=barge[0];j<barge[1];j++)G.plain.quad(top[i][j],top[i][j+1],sof[i][j+1],sof[i][j],edge,null,ctr);return top};
 const sl=Math.hypot(hd,rise),hips=[];
 for(const s of[1,-1]){const top=surf((i,j)=>{const u=(2*i/NU-1)*s,v=j/NV,x=u*hwv(v),c=Math.max(0,(Math.abs(u)-.5)/.5)**2,t=vb>0?Math.max(0,1-v/vb):Math.max(0,1-v*1.6);return L(x,s*hd*(1-v),yv(v),c,t)},
  NU,NV,(i,j)=>[(2*i/NU-1)*hw0*s,j/NV*sl],true,vb>0?[jb,NV]:[0,NV]);
  hips.push({a:top[0],b:top[NU]})}
 if(vb>0){const NS=8;for(const sx of[1,-1])surf((i,j)=>{const u=(2*i/NS-1)*-sx,v=j/NV,c=Math.max(0,(Math.abs(u)-.5)/.5)**2,t=Math.max(0,1-v/vb);return L(sx*hwv(v),u*hd*(1-v),yv(v),c,t)},NS,jb,(i,j)=>[(2*i/NS-1)*hd,j/NV*sl],true,null)}
 /* gable pediments (山花) */
 for(const sx of[1,-1]){const gx=sx*(rl/2-.3),j0=vb>0?jb:0,pts=[];for(let j=j0;j<=NV;j++){const v=j/NV;pts.push([gx,yv(v)-.05,hd*(1-v)])}for(let j=NV-1;j>=j0;j--){const v=j/NV;pts.push([gx,yv(v)-.05,-hd*(1-v)])}
  const base=T(gx,yv(j0/NV),0),hint=T(gx-sx*5,yv(.5),0);for(let k=0;k<pts.length-1;k++)G.plain.tri(base,T(...pts[k]),T(...pts[k+1]),[0,0],[1,0],[0,1],o.gable||col(0x8a2c1e),hint);
  const fish=T(gx+sx*.06,yv(1)-1.1,0);G.shiny.quad(add(fish,o.rot?[0,.5,0]:[0,.5,0]),add(fish,o.rot?[-.3,0,0]:[0,0,.3]),add(fish,[0,-.5,0]),add(fish,o.rot?[.3,0,0]:[0,0,-.3]),K.gold,null,T(gx-sx*5,yv(1)-1.1,0))}
 /* hip / gable ridges */
 const rc=o.ridgeCol||K.hip,curl=(pts,dir)=>{const a=pts[0],b=pts[1],d=nrm(sub(a,b));return[add(a,add(scl(d,.32),[0,.3,0])),...pts]};
 for(const h of hips)for(const line of[h.a,h.b]){const p=line.map(q=>add(q,[0,.14,0]));if(vb>0){chain(G.shiny,curl(p.slice(0,jb+1)),.15,.24,rc);chain(G.shiny,p.slice(jb),.14,.22,rc)}else chain(G.shiny,curl(p),.15,.24,rc)}
 /* main ridge with swallowtails */
 const yR=yv(1)+(o.rh||.8)*.32,rcv=o.rcurve??.28,ext=o.ext??1.7,sw=o.sw??1.4,rw=o.rw||.42,rh=o.rh||.8,tails=o.tails||[1,1],rp=[];
 for(let k=0;k<=12;k++){const x=(k/12*2-1)*rl/2;rp.push(T(x,yR+rcv*(2*k/12-1)**2,0))}chain(G.ridge,rp,rw,rh,K.white);
 if(o.swallow!==false)for(const sx of[1,-1]){if(!tails[sx>0?0:1])continue;const e=sx*rl/2,P=k=>{const f=k/6;return[e+sx*ext*f,yR+rcv+sw*Math.pow(f,2.1)]};
  const stem=[0,1,2].map(k=>{const[x,y]=P(k);return T(x,y,0)});chain(G.ridge,stem,[rw,rw*.85],[rh,rh*.8],K.white);
  for(const zs of[1,-1]){const fork=[2,3,4,5,6].map((k,i)=>{const[x,y]=P(k);return T(x,y+i*.05,zs*(.04+.07*i))});chain(G.shiny,fork,f=>lerp(rw*.42,.07,f),f=>lerp(rh*.5,.12,f),o.tailCol||K.edge)}}
 else for(const sx of[1,-1]){const e=sx*rl/2;chain(G.shiny,[T(e,yR+rcv,0),T(e+sx*.5,yR+rcv+.18,0),T(e+sx*.75,yR+rcv+.42,0)],rw*.8,rh*.7,K.hip)}
 /* ridge decoration (剪黏) */
 const top=yR+rh/2,ds=o.ds||1;
 if(o.decor){const c0=T(0,top,0);if(o.decor==='pagoda')pagoda(c0,ds);else pearl(c0,ds);
  if(o.dragons!==false){const dl=Math.min(rl*.36,4.6*ds);for(const sx of[1,-1])dragon(T,sx*(dl+.7*ds),top+.05,-sx,dl,ds,x=>rcv*(x/(rl/2))**2)}
  if(o.figures!==false)for(const sx of[1,-1])figure(T(sx*(rl/2-.5*ds),top+rcv*.9,0),.9*ds,sx>0?3:5)}
 return{yR,top}}
function pearl(c,s){prism(G.shiny,c[0],c[2],.42*s,c[1],c[1]+.2*s,8,K.edge);prism(G.shiny,c[0],c[2],.3*s,c[1]+.2*s,c[1]+.75*s,8,col(0xe0502a),{r1:.12*s});prism(G.shiny,c[0],c[2],.12*s,c[1]+.75*s,c[1]+1.15*s,6,col(0xf0c040),{r1:0})}
function pagoda(c,s){let y=c[1];[[.5,.3,K.edge],[.38,.45,K.gold],[.46,.12,K.red],[.3,.4,K.white],[.38,.12,K.red],[.22,.35,K.gold],[.26,.1,K.red]].forEach(([r,h,cl])=>{prism(G.shiny,c[0],c[2],r*s,y,y+h*s,8,cl);y+=h*s});
 prism(G.shiny,c[0],c[2],.16*s,y,y+.25*s,8,col(0xe0502a));prism(G.shiny,c[0],c[2],.1*s,y+.25*s,y+.6*s,6,K.gold,{r1:0})}
function dragon(T,x0,y0,dir,len,s,ry){const n=16,pts=[];for(let i=0;i<=n;i++){const t=i/n,x=x0+dir*len*t;pts.push(T(x,y0+ry(x)+s*(.32+.3*Math.sin(t*Math.PI*2.4+.4))*(.4+.6*t),.12*s*Math.sin(t*Math.PI*3)))}
 const cs=[K.green,col(0x3aa0a0),K.green,col(0x2a7a8a)];chain(G.shiny,pts,t=>s*(.08+.22*t),t=>s*(.08+.24*t),i=>cs[i%4]);
 for(let i=3;i<n;i+=2){const p=pts[i];seg(G.shiny,add(p,[0,.08*s,0]),add(p,[0,.28*s,0]),[.06*s,.02*s],[.12*s,.04*s],col(0xe8a020))}
 const h=pts[n],fw=nrm(sub(pts[n],pts[n-1])),hd=add(h,scl(fw,.25*s));seg(G.shiny,h,hd,.34*s,.3*s,col(0x2e9a5a));seg(G.shiny,hd,add(hd,scl(fw,.22*s)),.26*s,.12*s,K.red);
 for(const z of[-1,1]){const side=nrm(crs(fw,[0,1,0]));const b=add(h,scl(side,z*.1*s));seg(G.shiny,b,add(b,add(scl(fw,-.3*s),[0,.32*s,0])),.05*s,.05*s,col(0xf0c040))}
 for(const z of[-1,1]){const side=nrm(crs(fw,[0,1,0]));const b=add(hd,scl(side,z*.12*s));seg(G.shiny,b,add(b,add(scl(fw,.15*s),add(scl(side,z*.35*s),[0,-.1*s,0]))),.03*s,.03*s,K.white)}}
function figure(p,s,seed){const r=seeded(seed*31+7),robes=[K.red,K.blue,K.green,col(0xe0902a),col(0x8a4aa0)];const c=robes[(r()*5)|0];
 prism(G.shiny,p[0],p[2],.2*s,p[1],p[1]+.5*s,6,c,{r1:.14*s});prism(G.shiny,p[0],p[2],.1*s,p[1]+.5*s,p[1]+.68*s,6,col(0xf0d0b0));prism(G.shiny,p[0],p[2],.13*s,p[1]+.68*s,p[1]+.8*s,6,K.black,{r1:.06*s});
 seg(G.shiny,[p[0]-.25*s,p[1]+.2*s,p[2]],[p[0]+.15*s,p[1]+.95*s,p[2]],.04*s,.04*s,K.gold)}
/* lower eave ring of a double-eave roof (重簷 skirt) */
function skirt(o){const{cx,cz,y0,y1,ow,od,iw,id}=o,NU=14,NV=4,lift=o.lift??.7,fl=o.flare??.4,th=.26,tile=o.col||K.tile;
 const below=[cx,y0-80,cz],above=[cx,y0+90,cz],ctr=[cx,(y0+y1)/2,cz];
 const side=(pt,ni)=>{const top=[],sof=[];for(let i=0;i<=ni;i++){top.push([]);sof.push([]);for(let j=0;j<=NV;j++){const p=pt(i,j);top[i].push(p);sof[i].push([p[0],p[1]-th,p[2]])}}
  for(let i=0;i<ni;i++)for(let j=0;j<NV;j++){G.tile.quad(top[i][j],top[i+1][j],top[i+1][j+1],top[i][j+1],shade(tile,.95+((i+j)%3)*.04),[[i*.8,j],[(i+1)*.8,j],[(i+1)*.8,j+1],[i*.8,j+1]],below);G.plain.quad(sof[i][j],sof[i+1][j],sof[i+1][j+1],sof[i][j+1],K.soff,null,above)}
  for(let i=0;i<ni;i++)G.plain.quad(top[i][0],top[i+1][0],sof[i+1][0],sof[i][0],K.edge,null,ctr);return top};
 const Y=(v,c)=>lerp(y0,y1,Math.pow(v,1.3))+lift*c*(1-v)**2,F=(c,v)=>fl*c*(1-v)**2;
 for(const s of[1,-1]){const tp=side((i,j)=>{const u=2*i/NU-1,v=j/NV,c=Math.max(0,(Math.abs(u)-.6)/.4)**2;return[cx+u*lerp(ow,iw,v)+Math.sign(u)*F(c,v),Y(v,c),cz+s*(lerp(od,id,v)+F(c,v))]},NU);
  for(const line of[tp[0],tp[NU]]){const p=line.map(q=>add(q,[0,.12,0]));const d=nrm(sub(p[0],p[1]));chain(G.shiny,[add(p[0],add(scl(d,.3),[0,.26,0])),...p],.14,.22,K.hip)}}
 for(const s of[1,-1])side((i,j)=>{const u=2*i/8-1,v=j/NV,c=Math.max(0,(Math.abs(u)-.6)/.4)**2;return[cx+s*(lerp(ow,iw,v)+F(c,v)),Y(v,c),cz+u*lerp(od,id,v)+Math.sign(u)*F(c,v)]},8)}
/* hexagonal ring with 12 points (corners lifted) used for tower eaves and the helmet roof */
function hexRoof(cx,cz,prof,o={}){const lift=o.lift||0,th=.24,rings=prof.map(([r,y,lf])=>{const ring=[];for(let k=0;k<12;k++){const a=Math.PI/6+k*Math.PI/6,corner=k%2===0,rr=r*(corner?1:Math.cos(Math.PI/6))*(corner?1+(lf||0)*.12:1);ring.push([cx+Math.cos(a)*rr,y+(corner?(lf||0):0),cz+Math.sin(a)*rr])}ring.push(ring[0]);return ring});
 const below=[cx,-50,cz],above=[cx,200,cz];
 for(let L=0;L<rings.length-1;L++)for(let k=0;k<12;k++){G.tile.quad(rings[L][k],rings[L][k+1],rings[L+1][k+1],rings[L+1][k],shade(o.col||K.tile,.95+(k%2)*.06),[[k*.7,L],[(k+1)*.7,L],[(k+1)*.7,L+1],[k*.7,L+1]],below);
  if(L<(o.soff||1))G.plain.quad(...[rings[L][k],rings[L][k+1],rings[L+1][k+1],rings[L+1][k]].map(p=>[p[0],p[1]-th,p[2]]),K.soff,null,above)}
 for(let k=0;k<12;k++){const a=rings[0][k],b=rings[0][k+1];G.plain.quad(a,b,[b[0],b[1]-th,b[2]],[a[0],a[1]-th,a[2]],K.edge,null,[cx,a[1]+2,cz])}
 for(let k=0;k<12;k+=2){const line=rings.map(r=>add(r[k],[0,.1,0])),d=nrm(sub(line[0],line[1]));chain(G.shiny,[add(line[0],add(scl(d,.32),[0,.3,0])),...line],.14,.21,K.hip)}}

/* ---------------- architecture helpers ---------------- */
function column(x,z,y0,h,r,c,o={}){const g=o.g||G.plain;prism(G.stone,x,z,r*1.55,y0,y0+.32,8,K.stoneM,{off:Math.PI/8});prism(G.stone,x,z,r*1.25,y0+.32,y0+.55,8,K.stoneL,{r1:r*1.05,off:Math.PI/8});
 prism(g,x,z,r,y0+.55,y0+h,10,c);box(G.plain,x-r*1.15,y0+h-.05,z-r*1.15,x+r*1.15,y0+h+.25,z+r*1.15,K.redD);if(o.solid!==false)solidC(x,z,r*1.5+.05,y0+h)}
function dragonColumn(x,z,y0,h,r,shaft,body,g){column(x,z,y0,h,r,shaft,{g});const n=34,pts=[];for(let i=0;i<=n;i++){const t=i/n,a=t*Math.PI*3.2+.5;pts.push([x+Math.cos(a)*(r+.12),y0+.9+t*(h-1.4),z+Math.sin(a)*(r+.12)])}
 chain(g,pts,t=>.1+.16*t,t=>.1+.18*t,i=>i%2?body:shade(body,.8));const hd=pts[n];seg(g,hd,add(hd,[0,.28,.32]),.3,.26,shade(body,1.15));
 const pl=add(hd,[0,-.1,.62]);prism(g,pl[0],pl[2],.14,pl[1]-.14,pl[1]+.14,6,K.gold);for(let i=0;i<n;i+=6){const p=pts[i];seg(g,p,add(p,[0,.18,0]),.05,.12,shade(body,1.3))}}
function wallX(x0,x1,z,y0,y1,t,doors,o={}){let cur=x0;const ds=(doors||[]).slice().sort((a,b)=>a[0]-b[0]),dado=o.dado??1.3,piece=(a,b,ya,yb)=>{if(b-a<.01)return;
  box(G.wall,a,ya,z-t/2,b,Math.min(yb,ya+dado),z+t/2,K.stoneD,{s:.5});if(yb>ya+dado)box(o.upG||G.wall,a,ya+dado,z-t/2,b,yb,z+t/2,o.up||K.stoneL,{s:.5})};
 for(const[a,b,h]of ds){piece(cur,a,y0,y1);solid(cur,z-t/2,a,z+t/2,y1);box(G.plain,a-.1,y0+h,z-t/2-.05,b+.1,y0+h+.3,z+t/2+.05,K.redD);if(y1>y0+h+.3)box(G.wall,a,y0+h+.3,z-t/2,b,y1,z+t/2,K.stoneL,{s:.5});
  const dw=(b-a)/2;for(const[side,sg]of[[a,1],[b,-1]])box(G.wood,Math.min(side,side+sg*.12),y0,z-t/2-dw+.05,Math.max(side,side+sg*.12),y0+h,z-t/2+.05,K.wood,{s:.4});cur=b}
 piece(cur,x1,y0,y1);solid(cur,z-t/2,x1,z+t/2,y1);box(G.plain,x0,y1-.35,z-t/2-.06,x1,y1,z+t/2+.06,K.edge)}
function wallZ(z0,z1,x,y0,y1,t,doors,o={}){let cur=z0;const ds=(doors||[]).slice().sort((a,b)=>a[0]-b[0]),dado=o.dado??1.3,piece=(a,b)=>{if(b-a<.01)return;
  box(G.wall,x-t/2,y0,a,x+t/2,y0+dado,b,K.stoneD,{s:.5});box(o.upG||G.wall,x-t/2,y0+dado,a,x+t/2,y1,b,o.up||K.stoneL,{s:.5});solid(x-t/2,a,x+t/2,b,y1)};
 for(const[a,b,h]of ds){piece(cur,a);box(G.plain,x-t/2-.05,y0+h,a-.1,x+t/2+.05,y0+h+.3,b+.1,K.redD);box(G.wall,x-t/2,y0+h+.3,a,x+t/2,y1,b,K.stoneL,{s:.5});cur=b}
 piece(cur,z1);box(G.plain,x-t/2-.06,y1-.35,z0,x+t/2+.06,y1,z1,K.edge)}
function ring(g,cx,cz,r0,r1,y0,y1,n,c){for(let k=0;k<n;k++){const a=k*TAU/n,b=(k+1)*TAU/n,P=(r,an,y)=>[cx+Math.cos(an)*r,y,cz+Math.sin(an)*r];
 g.quad(P(r1,a,y0),P(r1,b,y0),P(r1,b,y1),P(r1,a,y1),c,null,[cx,y0,cz]);g.quad(P(r0,a,y0),P(r0,b,y0),P(r0,b,y1),P(r0,a,y1),c,null,P(r0*3,(a+b)/2,(y0+y1)/2));g.quad(P(r0,a,y1),P(r1,a,y1),P(r1,b,y1),P(r0,b,y1),shade(c,1.1),null,[cx,y0-50,cz])}}
function platform(x0,z0,x1,z1,h,c=K.stoneL){box(G.stone,x0,0,z0,x1,h,z1,K.stoneM,{s:.5,top:c});setFloor(x0,z0,x1,z1,h)}
/* stairs: rise from h0 to h1 across [a,b] along axis 'z' (dir=-1: climbing toward -z) */
function stairs(x0,x1,z0,z1,h0,h1,axis='z',dir=-1){const n=Math.max(1,Math.round((h1-h0)/.15)),a=axis==='z'?[z0,z1]:[x0,x1],span=Math.abs(a[1]-a[0]),st=span/n;
 for(let k=0;k<n;k++){const h=h0+(h1-h0)*(k+1)/n;let lo,hi;if(dir<0){hi=Math.max(...a)-k*st;lo=hi-st}else{lo=Math.min(...a)+k*st;hi=lo+st}
  if(axis==='z'){box(G.stone,x0,0,lo,x1,h,hi,K.stoneM,{s:.5,top:K.stoneL});setFloor(x0,lo,x1,hi,h)}else{box(G.stone,lo,0,z0,hi,h,z1,K.stoneM,{s:.5,top:K.stoneL});setFloor(lo,z0,hi,z1,h)}}}
function beamBand(x0,x1,z0,z1,y){box(G.plain,x0,y,z0,x1,y+.45,z1,K.edge,{top:K.redD});box(G.ridge,x0,y+.45,z0,x1,y+.75,z1,K.white,{s:.5})}
function lanternRow(list,x0,x1,z,y,n){for(let i=0;i<n;i++){const x=n===1?(x0+x1)/2:lerp(x0,x1,i/(n-1));list.push([x,y,z])}}
function tree(x,z,s){prism(G.plain,x,z,.18*s,0,2.2*s,6,col(0x5a3a26));const r=seeded(Math.abs((x*13+z*7)|0)+1);for(let i=0;i<5;i++){const a=i*1.3,cx=x+Math.cos(a)*.9*s*(i?1:0),cz=z+Math.sin(a)*.9*s*(i?1:0),cy=2.2*s+(i?.4:1.1)*s,w=(1.1+r()*.5)*s;box(G.plain,cx-w,cy,cz-w,cx+w,cy+w*1.3,cz+w,shade(K.leaf,.85+r()*.3))}solidC(x,z,.35)}

/* ---------------- the temple ---------------- */
const LANT=[],BURNERS=[],PLAQUES=[];
function buildTemple(){
 /* city ground, streets, surrounding blocks */
 box(G.plain,-200,-.12,-200,200,-.02,200,K.asph,{only:[]});
 box(G.stone,-35,-.02,-48,35,0,41.6,K.pave,{only:[],s:.5});
 for(let x=-60;x<60;x+=6)box(G.plain,x,-.012,46.62,x+3,0,46.78,col(0xe8d070),{only:[]});
 box(G.stone,-200,-.02,41.6,200,.05,42.6,K.stoneL,{s:.5});box(G.stone,-200,-.02,51,200,.05,52.4,K.stoneL,{s:.5});
 {const r=seeded(77),tints=[[.92,.9,.86],[.86,.84,.8],[.9,.86,.8],[.8,.82,.84],[.94,.92,.88]];const lot=(x0,z0,x1,z1,alongX)=>{let a=alongX?x0:z0;const e=alongX?x1:z1;while(a<e){const w=Math.min(e-a,7+r()*9),h=8+r()*20|0,d=10+r()*12,c=tints[(r()*5)|0];
  if(alongX)box(G.city,a+.3,0,z0,a+w-.3,h,Math.min(z1,z0+d),c,{s:1/12,top:col(0x7a7874)});else box(G.city,x0,0,a+.3,Math.min(x1,x0+d),h,a+w-.3,c,{s:1/12,top:col(0x7a7874)});a+=w}};
  lot(-110,53.2,110,80,true);lot(-60,-86,60,-56,true);lot(48,-56,72,52,false);lot(-74,-56,-52,52,false)}
 /* site walls (Xiyuan Rd west, Sanshui St east, rear) */
 for(const x of[-35,35]){box(G.brick,x-.3,0,-48,x+.3,2.6,41.4,K.white,{s:.5,top:K.edge});solid(x-.3,-48,x+.3,41.4,2.6)}
 box(G.brick,-35,0,-48.3,35,2.6,-47.7,K.white,{s:.5,top:K.edge});solid(-35,-48.3,35,-47.7,2.6);
 /* front fence along Guangzhou St with the gate and two side openings */
 for(const[a,b]of[[-35,-25],[-21,-7.6],[7.6,21],[25,35]]){box(G.wall,a,0,40.9,b,1.15,41.5,K.stoneL,{s:.5,top:K.stoneM});solid(a,40.9,b,41.5,1.15);for(let x=a+1;x<b;x+=2.2)box(G.wall,x-.2,1.15,40.95,x+.2,1.5,41.45,K.stoneM,{s:.5})}
 /* ---- mountain gate (山門, 1960): 4 columns, 3 bays ---- */
 for(const x of[-7,-2.6,2.6,7]){column(x,40,0,x*x<9?5.4:4.2,.32,K.red);}
 for(const x of[-7,7])for(const z of[39.2,40.8])solidC(x,z,.3);
 box(G.plain,-7.4,4.2,39.6,7.4,4.6,40.4,K.edge,{top:K.redD});box(G.plain,-2.9,5.4,39.6,2.9,5.9,40.4,K.edge,{top:K.redD});box(G.ridge,-2.9,5.0,39.55,2.9,5.4,40.45,K.white,{s:.5});
 PLAQUES.push({txt:'龍山寺',x:0,y:4.75,z:40.48,w:2.4,h:.85,ry:0},{txt:'龍山寺',x:0,y:4.75,z:39.52,w:2.4,h:.85,ry:Math.PI});
 for(const sx of[1,-1])roof({cx:sx*5.2,cz:40,y0:4.5,W:5.6,D:4.2,rise:1.6,vb:.45,rl:2.6,lift:.6,flare:.35,rw:.3,rh:.5,ext:1.0,sw:.9,decor:null,figures:false,tails:sx>0?[1,0]:[0,1]});
 roof({cx:0,cz:40,y0:5.9,W:7.6,D:5.0,rise:2.1,vb:.42,rl:4.4,lift:.7,flare:.4,rw:.34,rh:.62,ext:1.2,sw:1.1,decor:'pearl',ds:.7});
 lanternRow(LANT,-5,5,41.2,3.6,2);lanternRow(LANT,-5,5,38.8,3.6,2);
 /* ---- plaza, waterfall & pond (east), fountain pool (west) ---- */
 box(G.wall,32.2,0,16.5,35,6.0,35.5,col(0x5a5e58),{s:.35,top:K.leaf});solid(31.6,16.5,35,35.5,6.2);
 {const r=seeded(21);for(let i=0;i<70;i++){let z=16.8+r()*18.4;const inFall=z>21.2&&z<30.8,y=inFall?(r()<.5?r()*.5:5.4+r()*.6):r()*5.6,x=inFall?31.45+r()*.4:30.4+r()*1.6,s=.45+r()*1.0;
  box(G.wall,x,y,z-s,x+s*1.4,y+s*.9,z+s,shade(col(0x7a7a70),.7+r()*.45),{s:.5,top:r()<.5?shade(K.leaf,.8+r()*.4):col(0x8a8a80)})}
  for(let i=0;i<14;i++){const z=17+r()*18,x=30.6+r()*1.4;if(z>21.2&&z<30.8)continue;const h=.5+r()*1.2;box(G.plain,x-.4,r()*4.5,z-.4,x+.4,r()*4.5+h,z+.4,shade(K.leaf,.75+r()*.4))}
  for(let i=0;i<8;i++){const z=18+r()*16;box(G.plain,31.5,5.8+r()*.4,z-.8,33.5,6.6+r()*.5,z+.8,shade(K.leaf,.8+r()*.4))}}
 box(G.wall,22.6,0,16.6,31.6,.55,17.2,K.stoneM,{s:.5});box(G.wall,22.6,0,34.8,31.6,.55,35.4,K.stoneM,{s:.5});box(G.wall,22.6,0,17.2,23.2,.55,34.8,K.stoneM,{s:.5});
 box(G.plain,23.2,0,17.2,31.6,.02,34.8,col(0x2a4a40),{only:[]});solid(22.6,16.6,31.6,35.4,.55);
 ring(G.wall,-27,27,4.2,4.6,0,.55,24,K.stoneM);prism(G.plain,-27,27,4.2,0,.02,24,col(0x2a4a40));solidC(-27,27,4.6,.55);
 prism(G.wall,-27,27,.9,0,1.1,8,K.stoneL);prism(G.shiny,-27,27,.35,1.1,1.9,8,K.edge,{r1:.2});
 for(const[x,z,s]of[[-31,18,1.2],[-20,36,1],[-31,36.5,1.1],[19,18.5,1],[-14,18,.9],[14,37,.9],[28,-44,1.2],[30,-30,1.1],[29,-10,1.2],[-29,-46,1.1],[-14,36.5,.9]])tree(x,z,s);
 /* ---- front hall (三川殿 + 龍虎門 side halls): z 6..14 ---- */
 platform(-23,6,23,14.2,.45);stairs(-23,23,14.2,15.4,0,.45,'z',-1);
 setFloor(-17,-33,17,6,.15);box(G.stone,-17,0,-33,17,.15,6,K.paveC,{s:.5,only:[]});
 wallX(-9,9,10.2,.45,5.6,.5,[[-1.8,1.8,4.2],[-5.8,-3.6,3.4],[3.6,5.8,3.4]]);
 wallX(9,23,10.2,.45,5.0,.5,[[15.2,17.2,3.2]]);wallX(-23,-9,10.2,.45,5.0,.5,[[-17.2,-15.2,3.2]]);
 for(const x of[-23,23])wallZ(6,14,x,.45,5.0,.5);
 for(const x of[-9,9]){box(G.wall,x-.25,.45,6.6,x+.25,5.4,9.95,K.stoneL,{s:.5});solid(x-.25,6.6,x+.25,9.95,5.4)}
 dragonColumn(-2.4,13.4,.45,4.9,.3,K.bronze,K.bronzeL,G.shiny);dragonColumn(2.4,13.4,.45,4.9,.3,K.bronze,K.bronzeL,G.shiny);
 for(const x of[-6,6])dragonColumn(x,13.4,.45,4.9,.28,K.stoneD,col(0x8a9a92),G.wall);
 for(const x of[-9,9,-12.6,12.6,-16.2,16.2,-19.8,19.8])column(x,13.4,.45,Math.abs(x)>9?4.3:4.9,.26,K.red);
 for(const x of[-2.4,2.4,-6,6,-9,9,-12.6,12.6,-16.2,16.2])column(x,6.5,.45,Math.abs(x)>9?4.3:4.9,.26,K.red);
 beamBand(-9.3,9.3,13.1,13.7,5.35);beamBand(-23,-9.3,13.1,13.7,4.75);beamBand(9.3,23,13.1,13.7,4.75);beamBand(-9.3,9.3,6.2,6.8,5.35);beamBand(-17,-9.3,6.2,6.8,4.75);beamBand(9.3,17,6.2,6.8,4.75);
 for(const x of[-2.4,2.4])box(G.stone,x-.6,.45,10.5,x+.6,1.1,11.2,K.stoneM,{s:.5});
 PLAQUES.push({txt:'龍山寺',x:0,y:5.12,z:10.54,w:2.6,h:.9,ry:0});
 cover(-23,5.4,23,14.6,4.8,9.6);
 roof({cx:0,cz:10.1,y0:6.05,W:11.2,D:10.6,rise:3.0,vb:0,lift:.95,flare:.5,decor:'pearl',ds:1,rw:.46,rh:.86,ext:1.6,sw:1.5});
 for(const sx of[1,-1])roof({cx:sx*7.7,cz:10.1,y0:5.55,W:5.6,D:10.2,rise:2.6,vb:0,lift:.6,flare:.3,decor:null,tails:sx>0?[1,0]:[0,1],rw:.36,rh:.7,ext:1.3,sw:1.2});
 for(const sx of[1,-1])roof({cx:sx*16.6,cz:10.1,y0:5.05,W:13.6,D:10.2,rise:2.4,vb:0,lift:.7,flare:.35,decor:'pearl',dragons:false,ds:.7,tails:sx>0?[1,0]:[0,1],rw:.36,rh:.66,ext:1.4,sw:1.3});
 lanternRow(LANT,-21,21,13.9,4.0,13);
 /* ---- wings / side corridors (護龍): x ±17..23, z -33..6 ---- */
 for(const sx of[1,-1]){const xi=sx*17.3,xo=sx*23;platform(Math.min(sx*16.9,xo),-33,Math.max(sx*16.9,xo),6,.45);
  wallZ(-33,6,xo,.45,4.4,.5,[[-15,-12.6,3.0]]);
  for(let z=-31.4;z<=5;z+=3.6)if(Math.abs(z-1.3)>3)column(xi,z,.45,3.85,.22,K.red);
  box(G.plain,Math.min(xi,xo),4.0,-33,Math.max(xi,xo),4.35,6,K.redD);beamBand(xi-.3,xi+.3,-33,-2.2,3.95);
  for(const z of[-24,-17,-8])box(G.wall,xo-sx*.27-.02,1.6,z-1.1,xo-sx*.27+.02,3.2,z+1.1,K.stoneM,{s:.5});
  cover(Math.min(sx*16.2,xo+sx*.8),-33,Math.max(sx*16.2,xo+sx*.8),6,4.0,6.6);
  roof({cx:sx*20,cz:-18.1,y0:4.3,W:30.4,D:7.6,rise:1.9,vb:0,rot:true,lift:.5,flare:.3,swallow:false,decor:null,rw:.3,rh:.5});
  lanternRow(LANT,xi-sx*.6,xi-sx*.6,0,3.5,1);for(let z=-29.6;z<-4;z+=3.6)LANT.push([xi-sx*.7,3.4,z]);
  /* bell (east) / drum (west) tower: hexagonal, double eave, helmet (盔頂/轎頂) roof */
  const tx=sx*20,tz=1.3;
  for(let k=0;k<6;k++){const a=Math.PI/6+k*Math.PI/3;column(tx+Math.cos(a)*2.9,tz+Math.sin(a)*2.9,.45,4.1,.24,K.red)}
  hexRoof(tx,tz,[[4.2,4.55,.55],[3.6,4.95,.25],[3.0,5.35,0],[2.75,5.65,0]],{soff:2});
  prism(G.wall,tx,tz,2.75,4.5,5.7,6,K.redD,{off:Math.PI/6,cap:false});
  prism(G.wall,tx,tz,2.55,5.65,8.7,6,K.red,{off:Math.PI/6,cap:false});
  for(let k=0;k<6;k++){const a=k*Math.PI/3,px=tx+Math.cos(a)*2.24,pz=tz+Math.sin(a)*2.24,n=[Math.cos(a),0,Math.sin(a)],sd=[-n[2],0,n[0]];
   G.wood.quad(add([px,6.3,pz],scl(sd,-.8)),add([px,6.3,pz],scl(sd,.8)),add([px,8.0,pz],scl(sd,.8)),add([px,8.0,pz],scl(sd,-.8)),shade(K.wood,1.3),[[0,0],[1.6,0],[1.6,1.7],[0,1.7]],[tx,7,tz])}
  hexRoof(tx,tz,[[3.9,8.55,.7],[3.15,8.95,.32],[2.55,9.4,.08],[2.2,10.05,0],[1.98,10.8,0],[1.7,11.6,0],[1.25,12.35,0],[.75,12.95,0],[.28,13.3,0],[.02,13.4,0]],{soff:1});
  prism(G.shiny,tx,tz,.3,13.3,13.75,8,K.gold);prism(G.shiny,tx,tz,.4,13.75,14.3,8,col(0xe0502a),{r1:.12});prism(G.shiny,tx,tz,.13,14.3,15.0,6,K.gold,{r1:0});
  PLAQUES.push({txt:sx>0?'鐘樓':'鼓樓',x:tx-sx*2.3,y:7.15,z:tz,w:1.5,h:.62,ry:sx>0?-Math.PI/2:Math.PI/2,v:1})}
 /* ---- courtyard: incense burner and offering tables ---- */
 BURNERS.push(burner(0,.6,.15,1));
 for(const x of[-5.5,5.5]){box(G.plain,x-2.2,.15,2.2,x+2.2,.95,3.0,K.red,{top:col(0xc04030)});solid(x-2.2,2.2,x+2.2,3.0,.95);for(let i=0;i<4;i++){const px=x-1.6+i*1.05;prism(G.plain,px,2.6,.16,.95,1.15,6,i%2?col(0xe0a030):col(0xd05a30))}}
 /* ---- main hall (正殿): platform 0.9, five bays incl. surrounding corridor, double eave ---- */
 const MZ=-15;platform(-10.5,-24,10.5,-6,.9);stairs(-7,7,-6,-3.6,.15,.9,'z',-1);stairs(-7,7,-26.4,-24,.15,.9,'z',1);
 for(const sx of[1,-1])stairs(Math.min(sx*10.5,sx*12.2),Math.max(sx*10.5,sx*12.2),-17,-13,.15,.9,'x',-sx);
 for(const x of[-9.8,-6.2,-2.2,2.2,6.2,9.8]){column(x,-6.7,.9,4.5,.27,K.red);column(x,-23.3,.9,4.5,.27,K.red)}
 for(const z of[-10.4,-15,-19.6])for(const x of[-9.8,9.8])column(x,z,.9,4.5,.27,K.red);
 wallZ(-20.6,-9.6,-6.6,.9,6.6,.5);wallZ(-20.6,-9.6,6.6,.9,6.6,.5);wallX(-6.6,6.6,-20.6,.9,6.6,.5);
 for(const x of[-4.6,-1.6,1.6,4.6])dragonColumn(x,-9.9,.9,5.2,.3,K.stoneD,col(0x8fa49a),G.wall);
 box(G.plain,-6.6,5.6,-10.2,6.6,6.6,-9.6,K.edge,{top:K.redD});box(G.ridge,-6.6,5.2,-10.25,6.6,5.6,-9.55,K.white,{s:.5});
 box(G.wood,-6.4,.9,-20.3,6.4,4.6,-16.6,K.wood,{s:.4});solid(-6.4,-20.3,6.4,-16.4,4.6);
 box(G.glow,-1.4,1.9,-16.65,1.4,4.4,-16.5,col(0xe8c070));prism(G.shiny,0,-17.2,.55,2.1,3.6,8,K.gold,{r1:.35});prism(G.shiny,0,-17.2,.3,3.6,4.1,8,col(0xf0d8a8));
 PLAQUES.push({txt:'正殿',x:0,y:4.8,z:-9.45,w:2.0,h:.72,ry:0});
 beamBand(-10.2,10.2,-7.0,-6.4,5.1);
 cover(-11.3,-24.8,11.3,-5.2,5.2,12.6);
 skirt({cx:0,cz:MZ,y0:5.4,y1:6.7,ow:11.4,od:9.9,iw:6.9,id:5.8,lift:.75});
 box(G.wood,-6.6,6.6,MZ-5.5,6.6,8.25,MZ+5.5,K.red,{s:.5,only:[0,1,2,3]});
 roof({cx:0,cz:MZ,y0:8.2,W:16.6,D:14.4,rise:3.5,vb:.42,rl:8.8,lift:1.1,flare:.6,decor:'pagoda',ds:1.15,rw:.5,rh:.95,ext:1.9,sw:1.7});
 lanternRow(LANT,-8,8,-6.2,4.4,5);
 /* ---- rear hall (後殿): 11 bays, double eave ---- */
 const RZ=-38;platform(-23,-43,23,-33,.6);stairs(-21,21,-33,-31.6,.15,.6,'z',-1);
 for(let k=0;k<=11;k++){const x=-21+k*42/11;column(x,-33.6,.6,4.4,.26,Math.abs(x)<5?K.red:K.red)}
 wallX(-23,23,-42.8,.6,6.2,.5);wallZ(-42.8,-33,-23,.6,6.2,.5);wallZ(-42.8,-33,23,.6,6.2,.5);
 for(const[x0,x1]of[[-20,-12],[-8,8],[12,20]]){box(G.wood,x0,.6,-42.5,x1,4.3,-38.6,K.wood,{s:.4});solid(x0,-42.5,x1,-38.4,4.3);box(G.glow,(x0+x1)/2-1.2,1.7,-38.65,(x0+x1)/2+1.2,3.9,-38.5,col(0xe8c070));prism(G.shiny,(x0+x1)/2,-39.1,.42,1.9,3.2,8,K.gold,{r1:.28})}
 beamBand(-23,23,-34,-33.3,4.85);
 cover(-23.8,-43.6,23.8,-32.2,5.0,10.4);
 skirt({cx:0,cz:RZ,y0:5.05,y1:6.2,ow:23.9,od:5.9,iw:21,id:3.9,lift:.7});
 box(G.wood,-21,6.0,RZ-3.9,21,7.3,RZ+3.9,K.red,{s:.5,only:[0,1,2,3]});
 roof({cx:0,cz:RZ,y0:7.2,W:45,D:10.6,rise:2.8,vb:.42,rl:36,lift:1.0,flare:.55,decor:'pagoda',ds:1,rw:.46,rh:.86,ext:1.8,sw:1.6});
 lanternRow(LANT,-19,19,-32.9,3.9,11);
 BURNERS.push(burner(0,-27.4,.15,.75));
 /* west annex (three-storey, ~13 m: conservation plan) */
 box(G.city,-34.4,0,-44,-26,12.6,-16,col(0xe2d8c8),{s:.3,top:col(0x9a958c)});solid(-34.4,-44,-26,-16,12.6);
 roof({cx:-30.2,cz:-30,y0:12.6,W:9.4,D:29,rise:1.4,vb:0,rot:true,swallow:false,decor:null,col:K.tileG,rw:.3,rh:.4,lift:.3});
 /* benches in the east yard */
 for(const z of[-36,-24,-4])box(G.wood,26.5,0,z-1.5,27.3,.45,z+1.5,K.wood,{s:.4})}
/* bronze incense burner (香爐): legs, belly, little roofed lid, finial */
function burner(x,z,y,s){const g=G.shiny,c=K.bronze,cl=K.bronzeL;for(let k=0;k<3;k++){const a=k*TAU/3+.5;seg(g,[x+Math.cos(a)*.55*s,y,z+Math.sin(a)*.55*s],[x+Math.cos(a)*.45*s,y+.7*s,z+Math.sin(a)*.45*s],.18*s,.18*s,c)}
 prism(g,x,z,.95*s,y+.6*s,y+1.25*s,8,c,{r1:1.05*s});prism(g,x,z,1.08*s,y+1.25*s,y+1.4*s,8,cl);
 for(const sx of[-1,1])seg(g,[x+sx*1.05*s,y+1.3*s,z],[x+sx*1.3*s,y+1.75*s,z],.12*s,.12*s,cl);
 for(let k=0;k<4;k++){const a=k*TAU/4+Math.PI/4;seg(g,[x+Math.cos(a)*.7*s,y+1.4*s,z+Math.sin(a)*.7*s],[x+Math.cos(a)*.6*s,y+2.1*s,z+Math.sin(a)*.6*s],.08*s,.08*s,c)}
 prism(g,x,z,1.05*s,y+2.1*s,y+2.5*s,4,c,{r1:.15*s,off:Math.PI/4});prism(g,x,z,.14*s,y+2.5*s,y+3.0*s,6,K.gold,{r1:.05*s});
 solidC(x,z,1.2*s,y+1.4*s);return{x,z,y:y+1.5*s}}

/* ---------------- three.js setup (from Village Siege initGL, scaled up for a full-window tour) ---------------- */
const GL=$('#gl');let renderer,S3,camera,hemi,sunL,ptL=[],sky,skyMat,waterMat,fallMat,smoke,spray,lanternMesh,haloPts,cube,cubeEdge,markers=[],koi,glOK=true,MATS={};
function skyCv(night){const W2=night?512:8;return mk(W2,256,g=>{const gr=g.createLinearGradient(0,0,0,256);if(night){gr.addColorStop(0,'#05081a');gr.addColorStop(.6,'#141a3a');gr.addColorStop(.86,'#3a2a48');gr.addColorStop(1,'#2a2030')}else{gr.addColorStop(0,'#3f7fc8');gr.addColorStop(.55,'#8cbbe4');gr.addColorStop(.85,'#dfe8ec');gr.addColorStop(1,'#e8e2d4')}g.fillStyle=gr;g.fillRect(0,0,W2,256);
 if(night){const r=seeded(3);for(let i=0;i<220;i++)R(g,r()*W2|0,r()*140|0,1,1,`rgba(255,255,255,${.4+r()*.6})`)}})}
function initGL(){try{renderer=new THREE.WebGLRenderer({canvas:GL,antialias:!COARSE,powerPreference:'high-performance'})}catch(e){glOK=false;return}
 renderer.setPixelRatio(Math.min(devicePixelRatio||1,COARSE?1.5:1.25));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
 S3=new THREE.Scene();S3.fog=new THREE.Fog(0xd6e2e8,70,230);
 camera=new THREE.PerspectiveCamera(58,1,.05,500);camera.rotation.order='YXZ';
 hemi=new THREE.HemisphereLight(0xfff2dc,0x8a7a66,.78);S3.add(hemi);
 sunL=new THREE.DirectionalLight(0xfff0d8,.95);sunL.position.set(-38,62,34);sunL.castShadow=true;const sc=sunL.shadow.camera;sc.left=-58;sc.right=58;sc.top=58;sc.bottom=-58;sc.near=10;sc.far=180;
 sunL.shadow.mapSize.set(COARSE?1024:2048,COARSE?1024:2048);sunL.shadow.bias=-.0006;sunL.shadow.normalBias=.04;S3.add(sunL);S3.add(sunL.target);
 for(const p of[[0,4.5,1],[0,4.4,12],[0,4.2,-28],[0,4,38]]){const l=new THREE.PointLight(0xff9a50,0,22,2);l.position.set(...p);S3.add(l);ptL.push(l)}
 skyMat=new THREE.MeshBasicMaterial({side:THREE.BackSide,fog:false,depthWrite:false});sky=new THREE.Mesh(new THREE.SphereGeometry(400,16,12),skyMat);sky.renderOrder=-1;S3.add(sky);setSky(false);
 const lam=(o)=>new THREE.MeshLambertMaterial(Object.assign({vertexColors:true},o));
 MATS={plain:lam({}),tile:lam({map:T3('tile',.7,.9)}),stone:lam({map:T3('stone',.5,.5)}),wall:lam({map:T3('wall',.9,.9)}),wood:lam({map:T3('wood',1,1)}),ridge:lam({map:T3('ridge',.5,1)}),
  shiny:new THREE.MeshPhongMaterial({vertexColors:true,shininess:55,specular:0x5a4a30}),brick:lam({map:T3('brick',1,1)}),city:lam({map:T3('city',1,1)}),glow:new THREE.MeshBasicMaterial({vertexColors:true,map:T3('glow',1,1)})};MATS=makeMats();upgradeRenderer();makeEnv(false)}
function setSky(night){const t=new THREE.CanvasTexture(skyCv(night));t.encoding=THREE.sRGBEncoding;skyMat.toneMapped=false;if(skyMat.map)skyMat.map.dispose();skyMat.map=t;skyMat.needsUpdate=true}
function buildScene(){buildTemple();buildDetails();
 for(const k in G){const g=G[k];if(!g.P.length)continue;const gg=g.geo();bakeAO(gg,k);const m=new THREE.Mesh(gg,MATS[k]);m.castShadow=!['stone','city','glow'].includes(k)||k==='city';m.receiveShadow=true;m.matrixAutoUpdate=false;S3.add(m)}
 /* plaques with Chinese characters (canvas, linear filtered for legible strokes) */
 for(const p of PLAQUES){const cv=mk(p.v?96:256,p.v?256:96,g=>{const w=g.canvas.width,h=g.canvas.height;R(g,0,0,w,h,'#c9a040');R(g,5,5,w-10,h-10,'#7a1a12');R(g,10,10,w-20,h-20,'#1c2a4a');g.fillStyle='#f0c860';g.textAlign='center';g.textBaseline='middle';
   g.font=`900 ${p.v?60:66}px "Noto Serif TC","Noto Serif CJK TC","Songti TC","PMingLiU",serif`;if(p.v){[...p.txt].forEach((ch,i)=>g.fillText(ch,w/2,h/2+(i-(p.txt.length-1)/2)*70))}else g.fillText(p.txt,w/2,h/2+3)});
  const tx=new THREE.CanvasTexture(cv);tx.anisotropy=4;tx.encoding=THREE.sRGBEncoding;const m=new THREE.Mesh(new THREE.PlaneGeometry(p.v?p.h:p.w,p.v?p.w:p.h),new THREE.MeshLambertMaterial({map:tx,emissive:0x221810}));m.position.set(p.x,p.y,p.z);m.rotation.y=p.ry;S3.add(m)}
 /* water */
 waterMat=new THREE.MeshStandardMaterial({map:(()=>{const w=new THREE.CanvasTexture(hq('water').c);w.wrapS=w.wrapT=THREE.RepeatWrapping;w.encoding=THREE.sRGBEncoding;w.anisotropy=4;return w})(),normalMap:new THREE.CanvasTexture(hq('water').n),transparent:true,opacity:.86,color:0x9fd0d8,roughness:.06,metalness:0,envMapIntensity:1.6});waterMat.normalMap.wrapS=waterMat.normalMap.wrapT=THREE.RepeatWrapping;waterMat.normalMap.repeat.set(2,4);waterMat.map.repeat.set(3,6);
 const pond=new THREE.Mesh(new THREE.PlaneGeometry(8.4,17.6),waterMat);pond.rotation.x=-Math.PI/2;pond.position.set(27.4,.3,26);pond.receiveShadow=true;S3.add(pond);
 const pool=new THREE.Mesh(new THREE.CircleGeometry(4.25,20),waterMat);pool.rotation.x=-Math.PI/2;pool.position.set(-27,.32,27);S3.add(pool);
 fallMat=new THREE.MeshLambertMaterial({map:fallTex(),transparent:true,opacity:.82,color:0xd8eef2,emissive:0x0a1a20});fallMat.map.repeat.set(4,1.2);
 const fall=new THREE.Mesh(new THREE.PlaneGeometry(9,5.7),fallMat);fall.rotation.y=-Math.PI/2;fall.position.set(31.15,3.0,26);S3.add(fall);
 /* koi */
 const kg=new THREE.BoxGeometry(.5,.12,.18);koi=new THREE.InstancedMesh(kg,new THREE.MeshLambertMaterial({color:0xffffff}),9);const kc=[0xff7a2a,0xffffff,0xff4a1a,0xffc040,0xe85a2a,0xffffff,0xff8a3a,0xd8402a,0xffb050];kc.forEach((c,i)=>koi.setColorAt(i,new THREE.Color(c)));S3.add(koi);
 /* lanterns (instanced) + halo points */
 const lg=new GB();prism(lg,0,0,.24,-.28,0,8,K.red,{r1:.3});prism(lg,0,0,.3,0,.22,8,K.red,{r1:.22});prism(lg,0,0,.12,-.36,-.28,8,K.black,{});prism(lg,0,0,.12,.22,.3,8,K.black,{});box(lg,-.02,-.62,-.02,.02,-.36,.02,K.gold);
 lanternMesh=new THREE.InstancedMesh(lg.geo(),new THREE.MeshLambertMaterial({vertexColors:true,emissive:0x000000}),LANT.length);const m4=new THREE.Matrix4();LANT.forEach((p,i)=>{m4.makeTranslation(p[0],p[1],p[2]);lanternMesh.setMatrixAt(i,m4)});S3.add(lanternMesh);
 const hp=new Float32Array(LANT.length*3);LANT.forEach((p,i)=>hp.set([p[0],p[1]-.05,p[2]],i*3));const hg=new THREE.BufferGeometry();hg.setAttribute('position',new THREE.BufferAttribute(hp,3));
 haloPts=new THREE.Points(hg,new THREE.PointsMaterial({map:tex(TEXC.halo()),size:2.2,transparent:true,opacity:0,depthWrite:false,blending:THREE.AdditiveBlending}));haloPts.visible=false;S3.add(haloPts);
 /* incense smoke + water spray particles */
 const mkP=(n,size,o)=>{const pos=new Float32Array(n*3),g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(pos,3));const p=new THREE.Points(g,new THREE.PointsMaterial(Object.assign({size,transparent:true,depthWrite:false,map:tex(TEXC.soft())},o)));p.frustumCulled=false;S3.add(p);return{p,pos,g,n,st:[]}};
 smoke=mkP(150,1.1,{opacity:.17,color:0xd0ccc4});for(let i=0;i<smoke.n;i++)smoke.st.push(newSmoke(i,Math.random()));
 spray=mkP(220,.28,{opacity:.75,color:0xf4fbff});for(let i=0;i<spray.n;i++)spray.st.push(newSpray(i,Math.random()));
 /* visitor cube */
 const fc=mk(16,16,g=>{R(g,0,0,16,16,'#2fb8c8');R(g,0,0,16,1,'#8ae8f0');R(g,0,0,1,16,'#8ae8f0');R(g,0,15,16,1,'#1a7a88');R(g,15,0,1,16,'#1a7a88')}),ff=mk(16,16,g=>{R(g,0,0,16,16,'#f5f1e4');R(g,0,0,16,1,'#fff');R(g,0,15,16,1,'#c8c0a8');R(g,6,4,4,2,'#b8291e');R(g,4,6,8,2,'#b8291e');R(g,6,8,4,4,'#b8291e')});
 const ms=new THREE.MeshLambertMaterial({map:tex(fc)}),mf=new THREE.MeshLambertMaterial({map:tex(ff)}),mt=new THREE.MeshLambertMaterial({map:tex(fc),color:0xd8f4f8});
 cube=new THREE.Mesh(new THREE.BoxGeometry(.6,.6,.6),[ms,ms,mt,ms,ms,mf]);cube.castShadow=true;S3.add(cube);
 cubeEdge=new THREE.LineSegments(new THREE.EdgesGeometry(cube.geometry),new THREE.LineBasicMaterial({color:0x0e3a42}));cube.add(cubeEdge);
 /* hotspot markers */
 SPOTS.forEach((s,i)=>{const cv=mk(32,40,g=>{const P=[[16,1],[30,15],[16,29],[2,15]];g.fillStyle='#2a0f0c';g.beginPath();P.forEach(([x,y],k)=>k?g.lineTo(x,y):g.moveTo(x,y));g.fill();g.fillStyle='#e3b04b';g.beginPath();[[16,3],[28,15],[16,27],[4,15]].forEach(([x,y],k)=>k?g.lineTo(x,y):g.moveTo(x,y));g.fill();
   g.fillStyle='#b8291e';g.beginPath();[[16,6],[25,15],[16,24],[7,15]].forEach(([x,y],k)=>k?g.lineTo(x,y):g.moveTo(x,y));g.fill();g.fillStyle='#fff';g.font='bold 11px monospace';g.textAlign='center';g.fillText(String(i+1),16,19);R(g,15,30,2,10,'#e3b04b')});
  const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:tex(cv),depthTest:true,fog:false}));sp.center.set(.5,0);sp.scale.set(.9,1.12,1);sp.position.set(s.x,(s.id==='bell'||s.id==='drum'?.45:ground(s.x,s.z))+s.my,s.z);S3.add(sp);markers.push(sp)});detailMeshes();S3.traverse(o=>{const ms=Array.isArray(o.material)?o.material:[o.material];for(const m of ms){if(m&&m.map&&m.map.encoding!==THREE.sRGBEncoding){m.map.encoding=THREE.sRGBEncoding;m.needsUpdate=true}}})}
function newSmoke(i,age){const b=BURNERS[i%BURNERS.length];return{x:b.x+(Math.random()-.5)*.5,y:b.y+.75,z:b.z+(Math.random()-.5)*.5,vx:(Math.random()-.5)*.12,vz:(Math.random()-.5)*.12,life:4+Math.random()*3,age:age*6}}
function newSpray(i,age){if(i%3===0)return{x:-27+(Math.random()-.5)*.2,y:1.9,z:27+(Math.random()-.5)*.2,vx:(Math.random()-.5)*1.4,vy:3+Math.random()*1.2,vz:(Math.random()-.5)*1.4,life:1.1,age:age*1.1};
 return{x:30.9-Math.random()*.6,y:.4+Math.random()*.3,z:21.6+Math.random()*8.8,vx:-.5-Math.random()*1.2,vy:.8+Math.random()*1.2,vz:(Math.random()-.5)*.6,life:.9,age:age*.9}}

/* ---------------- visitor, camera, state ---------------- */
const V={x:0,z:48,y:0,h:0,vx:0,vz:0};let yaw=0,pitch=-.22,dist=8.5,camMode='tp',night=false,showMap=true,state='title',lastT=performance.now(),tAcc=0,run=false,curSpot=null,fpsS=60,camY=0,fov=58;
const kb={};let lookDX=0,lookDY=0,dragging=false,stick={x:0,y:0},zoomHold=0;
const dir2=a=>[-Math.sin(a),-Math.cos(a)];
function canStand(x,z,y){let top=-1;for(const[a,b]of[[-1,-1],[1,-1],[1,1],[-1,1],[0,-1],[0,1],[-1,0],[1,0],[0,0]]){const g=ground(x+a*.3,z+b*.3);if(g>y+.46)return null;if(g>top)top=g}return top}
function moveVisitor(dt){let f=0,s=0;if(kb.KeyW||kb.ArrowUp)f+=1;if(kb.KeyS||kb.ArrowDown)f-=1;if(kb.KeyD)s+=1;if(kb.KeyA)s-=1;
 if(kb.ArrowLeft||kb.KeyQ)yaw+=dt*1.9;if(kb.ArrowRight||kb.KeyE)yaw-=dt*1.9;
 f-=stick.y;s+=stick.x;const m=Math.hypot(f,s);if(m>1){f/=m;s/=m}
 const sp=(kb.ShiftLeft||kb.ShiftRight||run?6.4:3.2),fw=dir2(yaw),rt=[Math.cos(yaw),-Math.sin(yaw)];
 const tx=(fw[0]*f+rt[0]*s)*sp,tz=(fw[1]*f+rt[1]*s)*sp,k=Math.min(1,dt*10);V.vx+=(tx-V.vx)*k;V.vz+=(tz-V.vz)*k;
 const nx=V.x+V.vx*dt,nz=V.z+V.vz*dt;let g=canStand(nx,V.z,V.y);if(g!=null)V.x=nx;else V.vx=0;g=canStand(V.x,nz,V.y);if(g!=null)V.z=nz;else V.vz=0;
 const gr=canStand(V.x,V.z,V.y);const tgt=gr==null?V.y:gr;V.y=tgt>V.y?lerp(V.y,tgt,Math.min(1,dt*16)):Math.max(tgt,V.y-dt*5);
 if(Math.hypot(V.vx,V.vz)>.3){const want=Math.atan2(-V.vx,-V.vz);let d=want-V.h;d=Math.atan2(Math.sin(d),Math.cos(d));V.h+=d*Math.min(1,dt*10)}
 return m>.05}
function camRay(tx,ty,tz,dx,dy,dz,D){let best=D,yCap=99;const k0=gi(tx,tz),under=k0>=0&&CEIL[k0]<90;let out=[tx+dx*D,ty+dy*D,tz+dz*D];
 for(let t=.3;t<=D;t+=.2){const x=tx+dx*t,z=tz+dz*t;let y=ty+dy*t;const k=gi(x,z);if(k<0){best=t-.2;break}
  if(under&&CEIL[k]<90)yCap=Math.min(yCap,CEIL[k]-.35);if(y>yCap)y=yCap;
  if(SOLID[k]>y-.15||FLOOR[k]>y-.1){best=t-.25;break}
  if(!under&&CEIL[k]<90&&y>CEIL[k]-.4&&y<RTOP[k]+.4){best=t-.25;break}
  out=[x,y,z]}
 if(best<D){const t=Math.max(.35,best);out=[tx+dx*t,Math.min(ty+dy*t,yCap),tz+dz*t]}return out}
function updateCamera(dt){camera.fov+=(fov-camera.fov)*Math.min(1,dt*8);camera.updateProjectionMatrix();
 const eye=V.y+(camMode==='fp'?1.55:.75);camY=lerp(camY||eye,eye,Math.min(1,dt*12));
 if(camMode==='fp'){camera.position.set(V.x,camY,V.z);camera.rotation.set(pitch,yaw,0);cube.visible=false;return}
 cube.visible=true;const cp=Math.cos(pitch),dx=Math.sin(yaw)*cp,dz=Math.cos(yaw)*cp,dy=-Math.sin(pitch);
 const p=camRay(V.x,camY,V.z,dx,dy,dz,dist);camera.position.set(p[0],p[1],p[2]);camera.lookAt(V.x,camY+.15,V.z)}
function teleport(i){const s=SPOTS[i];if(!s)return;V.x=s.tp[0];V.z=s.tp[1];V.y=ground(V.x,V.z);if(V.y>50)V.y=0;V.vx=V.vz=0;yaw=s.tp[2];V.h=yaw;pitch=camMode==='fp'?0:-.2;camY=0;closeJump();showSpot(s,true)}

/* ---------------- UI: info card, minimap, jump list, language ---------------- */
const infoEl=$('#info');let infoPinned=0;
function showSpot(s,pin){curSpot=s;const L=s[LANG];$('#infoN').textContent=SPOTS.indexOf(s)+1;$('#infoH').textContent=L[0];$('#infoP').textContent=L[1];
 $('#infoS').textContent=t_('src')+'：'+s.src.split(' ').map(k=>(LANG==='zh'?SRC_NAMES:SRC_EN)[k]).join(LANG==='zh'?'、':', ');infoEl.classList.remove('off');if(pin)infoPinned=2.5}
function hideSpot(){curSpot=null;infoEl.classList.add('off')}
function checkSpots(dt){if(infoPinned>0){infoPinned-=dt;return}let best=null,bd=1e9;for(const s of SPOTS){const d=Math.hypot(V.x-s.x,V.z-s.z);if(d<s.r&&d<bd){bd=d;best=s}}
 if(best&&best!==curSpot)showSpot(best);else if(!best&&curSpot)hideSpot()}
const MM={x0:-37,x1:37,z0:-50,z1:56},mini=$('#mini'),mctx=mini.getContext('2d');let mBase=null;
const mX=x=>(x-MM.x0)/(MM.x1-MM.x0)*mini.width,mZ=z=>(z-MM.z0)/(MM.z1-MM.z0)*mini.height;
function drawMiniBase(){mBase=mk(mini.width,mini.height,g=>{const r=(x0,z0,x1,z1,c)=>{g.fillStyle=c;g.fillRect(mX(x0),mZ(z0),mX(x1)-mX(x0),mZ(z1)-mZ(z0))};
 r(-37,-50,37,56,'#3a3632');r(-35,-48,35,41.4,'#cfc6b2');r(-37,41.6,37,51,'#55575a');r(-17,-33,17,6,'#e2dccd');
 r(-23,6,23,14.2,'#b8291e');r(-9,6,9,14.2,'#d9922e');r(-23,-33,-17,6,'#a33a2a');r(17,-33,23,6,'#a33a2a');r(-10.5,-24,10.5,-6,'#d9922e');r(-23,-43,23,-33,'#d9922e');
 r(-8,39.4,8,40.6,'#d9922e');r(22.6,16.6,31.6,35.4,'#5fa3b0');r(31.6,16.5,35,35.5,'#6f7a6a');r(-34.4,-44,-26,-16,'#9a958c');
 g.fillStyle='#5fa3b0';g.beginPath();g.arc(mX(-27),mZ(27),4.4*mini.width/74,0,TAU);g.fill();
 for(const sx of[1,-1]){g.fillStyle='#e0b040';g.beginPath();for(let k=0;k<6;k++){const a=Math.PI/6+k*Math.PI/3;g[k?'lineTo':'moveTo'](mX(sx*20+Math.cos(a)*3.4),mZ(1.3+Math.sin(a)*3.4))}g.fill()}
 g.fillStyle='#2a0f0c';g.font='bold 8px sans-serif';g.textAlign='center';g.fillText(LANG==='zh'?'廣州街':'Guangzhou St',mini.width/2,mZ(48)+3)})}
function drawMini(){if(!showMap)return;const g=mctx;g.drawImage(mBase,0,0);
 SPOTS.forEach((s,i)=>{const x=mX(s.x),y=mZ(s.z);g.fillStyle=s===curSpot?'#b8291e':'#2a0f0c';g.beginPath();g.arc(x,y,4.2,0,TAU);g.fill();g.fillStyle='#fff';g.font='bold 7px monospace';g.textAlign='center';g.fillText(i+1,x,y+2.5)});
 const x=mX(V.x),y=mZ(V.z),a=camMode==='fp'?yaw:V.h,f=dir2(a);g.save();g.translate(x,y);g.rotate(Math.atan2(f[1],f[0]));g.fillStyle='#2fb8c8';g.strokeStyle='#0e3a42';g.lineWidth=1.2;g.beginPath();g.moveTo(6,0);g.lineTo(-4,-4);g.lineTo(-2,0);g.lineTo(-4,4);g.closePath();g.fill();g.stroke();g.restore()}
function buildJump(){const jl=$('#jumpList');jl.innerHTML='';SPOTS.forEach((s,i)=>{const b=document.createElement('button');b.setAttribute('role','menuitem');b.innerHTML=`<b>${i+1}</b><span></span>`;b.querySelector('span').textContent=s[LANG][0];b.addEventListener('click',()=>teleport(i));jl.appendChild(b)})}
function closeJump(){$('#jumpList').hidden=true;$('#bJump').setAttribute('aria-expanded','false')}
function applyLang(l,save){LANG=l==='en'?'en':'zh';document.documentElement.lang=LANG==='zh'?'zh-Hant':'en';if(save)store.set('lsTourLang',LANG);
 document.querySelectorAll('[data-t]').forEach(el=>{const k=el.dataset.t,v=t_(k);if(k==='cam')return;if(/<|&/.test(v))el.innerHTML=v;else el.textContent=v});
 document.querySelectorAll('.lang button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.l===LANG)));
 const bl=$('#bLang');bl.textContent=LANG==='zh'?'EN':'中';bl.lang=LANG==='zh'?'en':'zh-Hant';bl.setAttribute('aria-label',LANG==='zh'?'Switch to English':'切換為中文');
 $('#bHelp').setAttribute('aria-label',LANG==='zh'?'說明與暫停':'Help and pause');camLabel();buildJump();drawMiniBase();if(curSpot)showSpot(curSpot);
 document.title=LANG==='zh'?'艋舺龍山寺 3D 導覽 Longshan Temple 3D Tour':'Longshan Temple 3D Tour 艋舺龍山寺 3D 導覽'}
function camLabel(){$('#bCam').textContent=camMode==='tp'?t_('camFP'):t_('camTP')}
let toastT=0;function toast(s){const e=$('#toast');e.textContent=s;e.classList.remove('off');toastT=2}
function setCam(m){camMode=m;camLabel();toast(m==='fp'?t_('toFP'):t_('toTP'));if(m==='tp'&&document.pointerLockElement)try{document.exitPointerLock()}catch(e){}pitch=m==='fp'?Math.max(-1,Math.min(.9,pitch+.15)):Math.min(-.05,pitch-.1)}
function setNight(n){night=n;$('#bNight').setAttribute('aria-pressed',String(n));if(!glOK)return;setSky(n);
 hemi.color.setHex(n?0x6a78b0:0xfff2dc);hemi.groundColor.setHex(n?0x2a1c14:0x8a7a66);hemi.intensity=n?.3:.42;sunL.color.setHex(n?0x9aaeff:0xfff0d8);sunL.intensity=n?.35:2.4;makeEnv(n);
 S3.fog.color.setHex(n?0x1a1a2e:0xd6e2e8);for(const l of ptL)l.intensity=n?1.6:0;lanternMesh.material.emissive.setHex(n?0xc83a14:0x000000);haloPts.visible=n;haloPts.material.opacity=n?.85:0;
 MATS.glow.color.setHex(n?0xffffff:0xc8b890);toast(n?t_('nightOn'):t_('dayOn'))}
function setMap(v){showMap=v;$('#mapBox').hidden=!v||state!=='tour';$('#bMap').setAttribute('aria-pressed',String(v))}

/* ---------------- state & overlays ---------------- */
function start(){state='tour';$('#title').hidden=true;$('#pause').hidden=true;$('#hud').hidden=false;setMap(showMap);if(touchUI){$('#touch').hidden=false;const h=$('#tHint');h.classList.remove('fade');void h.offsetWidth;setTimeout(()=>h.classList.add('fade'),6000)}
 if(V.z>45&&!start.done){start.done=1;yaw=0;pitch=-.2;toast(t_('welcome'))}GL.focus()}
function pause(){if(state!=='tour')return;state='pause';$('#pause').hidden=false;$('#touch').hidden=true;for(const k in kb)kb[k]=false;stick={x:0,y:0};try{document.exitPointerLock&&document.exitPointerLock()}catch(e){}}
$('#go').addEventListener('click',start);$('#resume').addEventListener('click',start);
$('#bHelp').addEventListener('click',e=>{pause();e.currentTarget.blur()});
$('#bCam').addEventListener('click',e=>{setCam(camMode==='tp'?'fp':'tp');e.currentTarget.blur()});
$('#bNight').addEventListener('click',e=>{setNight(!night);e.currentTarget.blur()});
$('#bMap').addEventListener('click',e=>{setMap(!showMap);toast(showMap?t_('mapOn'):t_('mapOff'));e.currentTarget.blur()});
$('#bLang').addEventListener('click',e=>{applyLang(LANG==='zh'?'en':'zh',true);e.currentTarget.blur()});
$('#bJump').addEventListener('click',e=>{const jl=$('#jumpList'),o=jl.hidden;jl.hidden=!o;e.currentTarget.setAttribute('aria-expanded',String(o));if(o){const b=jl.querySelector('button');b&&b.focus()}});
document.querySelectorAll('.lang button').forEach(b=>b.addEventListener('click',()=>applyLang(b.dataset.l,true)));
document.addEventListener('visibilitychange',()=>{if(document.hidden)pause()});

/* ---------------- input: keyboard + mouse (Village Siege pattern) ---------------- */
addEventListener('keydown',e=>{if(state==='title'){if(e.code==='Enter'&&document.activeElement===document.body)start();return}
 if(e.code==='KeyP'||(e.code==='Escape'&&!document.pointerLockElement)){if(state==='tour')pause();else if(state==='pause')start();e.preventDefault();return}
 if(state!=='tour')return;if(e.target&&e.target.closest&&e.target.closest('#jumpList')&&/Enter|Space/.test(e.code))return;
 kb[e.code]=true;if(/^Arrow|Space/.test(e.code))e.preventDefault();if(e.repeat)return;
 if(e.code==='KeyV')setCam(camMode==='tp'?'fp':'tp');else if(e.code==='KeyN')setNight(!night);else if(e.code==='KeyM'){setMap(!showMap)}else if(e.code==='KeyL')applyLang(LANG==='zh'?'en':'zh',true);
 else if(/^Digit[1-8]$/.test(e.code))teleport(+e.code.slice(5)-1)});
addEventListener('keyup',e=>{kb[e.code]=false});addEventListener('blur',()=>{for(const k in kb)kb[k]=false});
GL.classList.add('grab');
GL.addEventListener('mousedown',e=>{if(state!=='tour')return;dragging=true;closeJump();if(camMode==='fp'&&!document.pointerLockElement){try{const p=GL.requestPointerLock&&GL.requestPointerLock();if(p&&p.catch)p.catch(()=>{})}catch(err){}}});
addEventListener('mouseup',()=>dragging=false);
addEventListener('mousemove',e=>{if(state!=='tour')return;const lock=document.pointerLockElement===GL;if((lock||dragging)&&Math.abs(e.movementX)<250&&Math.abs(e.movementY)<250){const k=lock?.0024:.0042;lookDX+=e.movementX*k;lookDY+=e.movementY*k}});
GL.addEventListener('wheel',e=>{if(state!=='tour')return;e.preventDefault();const d=Math.sign(e.deltaY)*Math.min(3,Math.abs(e.deltaY)/60+.6);zoomBy(d)},{passive:false});
function zoomBy(d){if(camMode==='tp')dist=Math.max(2.2,Math.min(34,dist*(1+d*.1)));else fov=Math.max(30,Math.min(80,fov+d*3))}

/* ---------------- input: touch (left stick, right drag, pinch) ---------------- */
let touchUI=COARSE;const tpad=$('#touch'),sBase=$('#stickBase'),sKnob=$('#stickKnob');let stickId=null,sx0=0,sy0=0;const looks=new Map();let pinch0=0;
function showTouchUI(){if(touchUI)return;touchUI=true;document.body.classList.add('touch');if(state==='tour')tpad.hidden=false}
if(touchUI)document.body.classList.add('touch');
addEventListener('touchstart',()=>showTouchUI(),{passive:true});
tpad.addEventListener('touchstart',e=>{e.preventDefault();closeJump();for(const t of e.changedTouches){const b=t.target.closest&&t.target.closest('.tb');
 if(b){const k=b.dataset.k;b.classList.add('on');if(k==='zin')zoomHold=-1;else if(k==='zout')zoomHold=1;else if(k==='run'){run=!run;b.classList.toggle('on',run)}b.dataset.tid=t.identifier;continue}
 if(t.clientX<innerWidth*.45&&stickId==null){stickId=t.identifier;sx0=t.clientX;sy0=t.clientY;sBase.hidden=false;sBase.style.left=sx0+'px';sBase.style.top=sy0+'px';sKnob.style.transform=''}
 else{looks.set(t.identifier,{x:t.clientX,y:t.clientY});if(looks.size===2){const[a,b2]=[...looks.values()];pinch0=Math.hypot(a.x-b2.x,a.y-b2.y)}}}},{passive:false});
tpad.addEventListener('touchmove',e=>{e.preventDefault();for(const t of e.changedTouches){if(t.identifier===stickId){const dx=Math.max(-52,Math.min(52,t.clientX-sx0)),dy=Math.max(-52,Math.min(52,t.clientY-sy0));stick={x:Math.abs(dx)<7?0:dx/52,y:Math.abs(dy)<7?0:dy/52};sKnob.style.transform=`translate(${dx}px,${dy}px)`}
 else if(looks.has(t.identifier)){const L=looks.get(t.identifier);if(looks.size===1){lookDX+=(t.clientX-L.x)*.0075;lookDY+=(t.clientY-L.y)*.0075}L.x=t.clientX;L.y=t.clientY}}
 if(looks.size===2){const[a,b2]=[...looks.values()],d=Math.hypot(a.x-b2.x,a.y-b2.y);if(pinch0>0){zoomBy((pinch0-d)/14);pinch0=d}}},{passive:false});
function tEnd(e){e.preventDefault();for(const t of e.changedTouches){if(t.identifier===stickId){stickId=null;stick={x:0,y:0};sBase.hidden=true}looks.delete(t.identifier);if(looks.size<2)pinch0=0;
 document.querySelectorAll('.tb').forEach(b=>{if(b.dataset.tid==String(t.identifier)){delete b.dataset.tid;if(b.dataset.k!=='run')b.classList.remove('on');if(b.dataset.k==='zin'||b.dataset.k==='zout')zoomHold=0}})}}
tpad.addEventListener('touchend',tEnd,{passive:false});tpad.addEventListener('touchcancel',tEnd,{passive:false});

/* ---------------- resize / fit ---------------- */
function fit(){if(!glOK)return;const w=innerWidth,h=innerHeight;renderer.setSize(w,h,false);camera.aspect=w/h;fov=w<h?72:58;camera.fov=fov;camera.updateProjectionMatrix()}
addEventListener('resize',fit);

/* ---------------- loop ---------------- */
const m4=new THREE.Matrix4(),q4=new THREE.Quaternion(),e3=new THREE.Euler(),v3=new THREE.Vector3(),s3=new THREE.Vector3(1,1,1);let T=0;
function animate(dt){T+=dt;
 waterMat.map.offset.x=T*.03;waterMat.map.offset.y=T*.05;if(waterMat.normalMap)waterMat.normalMap.offset.set(T*.02,-T*.035);fallMat.map.offset.y=T*1.4;
 for(let i=0;i<9;i++){const a=T*(.25+i*.03)+i*.7,x=27.4+Math.cos(a)*(2.2+i%3*.6),z=26+Math.sin(a*1.3)*(5+i%4*1.2),dx=-Math.sin(a)*(2.2+i%3*.6),dz=Math.cos(a*1.3)*1.3*(5+i%4*1.2);
  e3.set(0,Math.atan2(-dz,dx),Math.sin(T*6+i)*.15);q4.setFromEuler(e3);v3.set(x,.12,z);m4.compose(v3,q4,s3);koi.setMatrixAt(i,m4)}koi.instanceMatrix.needsUpdate=true;
 for(let i=0;i<smoke.n;i++){let p=smoke.st[i];p.age+=dt;if(p.age>p.life)p=smoke.st[i]=newSmoke(i,0);const f=p.age;smoke.pos[i*3]=p.x+p.vx*f*2+Math.sin(T*.7+i)*.12*f+.22*f;smoke.pos[i*3+1]=p.y+f*.8;smoke.pos[i*3+2]=p.z+p.vz*f*2-.06*f}smoke.g.attributes.position.needsUpdate=true;
 for(let i=0;i<spray.n;i++){let p=spray.st[i];p.age+=dt;if(p.age>p.life)p=spray.st[i]=newSpray(i,0);const f=p.age;spray.pos[i*3]=p.x+p.vx*f;spray.pos[i*3+1]=Math.max(.3,p.y+p.vy*f-4.9*f*f);spray.pos[i*3+2]=p.z+p.vz*f}spray.g.attributes.position.needsUpdate=true;
 markers.forEach((m,i)=>{m.position.y+=(Math.sin(T*2+i)*.004);m.material.rotation=0;m.visible=state!=='title'})}
function frame(now){const raw=Math.max(.001,(now-lastT)/1000),dt=Math.min(.05,raw);lastT=now;if(state==='shot'){requestAnimationFrame(frame);return}fpsS=lerp(fpsS,1/raw,.1);
 if(state==='tour'){yaw-=lookDX;pitch=Math.max(-1.35,Math.min(camMode==='fp'?1.2:.35,pitch-lookDY));lookDX=lookDY=0;if(zoomHold)zoomBy(zoomHold*dt*8);const step=Math.min(.25,raw),n=Math.ceil(step/.034);for(let i=0;i<n;i++)moveVisitor(step/n);checkSpots(step)}
 else if(state==='title'){yaw+=dt*.06}
 if(toastT>0){toastT-=dt;if(toastT<=0)$('#toast').classList.add('off')}
 if(glOK){cube.position.set(V.x,V.y+.3,V.z);cube.rotation.y=V.h;animate(state==='pause'?0:dt);
  if(state==='title'){const r=62;camera.position.set(Math.sin(yaw)*r*.8,34,Math.cos(yaw)*r+4);camera.lookAt(0,4,-6)}else updateCamera(dt);
  sunL.target.position.set(0,0,0);renderer.render(S3,camera);drawMini()}
 requestAnimationFrame(frame)}

/* ---------------- boot ---------------- */
initGL();
if(glOK){buildScene();fit();V.y=ground(V.x,V.z);yaw=.15}else{$('#title .card').insertAdjacentHTML('beforeend','<p style="color:#ffb0a0">WebGL 無法啟動 / WebGL is unavailable in this browser.</p>')}
applyLang(LANG,false);setMap(true);
requestAnimationFrame(frame);
window.__lt={st:()=>({state,x:+V.x.toFixed(2),y:+V.y.toFixed(2),z:+V.z.toFixed(2),yaw:+yaw.toFixed(3),pitch:+pitch.toFixed(3),dist,camMode,night,lang:LANG,spot:curSpot&&curSpot.id,fps:Math.round(fpsS),gl:glOK,calls:glOK?renderer.info.render.calls:0,tris:glOK?renderer.info.render.triangles:0,map:showMap}),
 tp:teleport,set:(x,z,a,p,d)=>{V.x=x;V.z=z;V.y=ground(x,z);if(V.y>50)V.y=0;if(a!=null){yaw=a;V.h=a}if(p!=null)pitch=p;if(d!=null)dist=d;camY=0},
 view:(px,py,pz,lx,ly,lz)=>{state='shot';camera.position.set(px,py,pz);camera.lookAt(lx,ly,lz);renderer.render(S3,camera)},resume:()=>{state='tour'},ground,spots:SPOTS.map(s=>s.id)};
