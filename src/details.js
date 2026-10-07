/* ===================== detail layer (v2): brackets, caisson ceilings, doors, carved stone, statues, offerings ===================== */
const DOORS=[],CARVES=[];
/* 斗栱: stacked bracket sets on top of a beam line */
function brackets(x0,x1,z,y,step,o={}){const n=Math.max(1,Math.round((x1-x0)/step)),alongZ=o.alongZ;
 for(let i=0;i<=n;i++){const a=lerp(x0,x1,i/n),P=(u,v,w)=>alongZ?[z+v,u,a+w]:[a+w,u,z+v];
  const B=(w0,y0,d0,w1,y1,d1,c)=>{const p0=P(y0,d0,w0),p1=P(y1,d1,w1);box(G.plain,Math.min(p0[0],p1[0]),y0,Math.min(p0[2],p1[2]),Math.max(p0[0],p1[0]),y1,Math.max(p0[2],p1[2]),c,{top:shade(c,1.15)})};
  B(-.17,y,-.17,.17,y+.16,.17,K.edge);                       // 坐斗 base block
  B(-.42,y+.16,-.1,.42,y+.27,.1,K.redD);                     // 栱 cross arm
  B(-.1,y+.16,-.42,.1,y+.27,.42,K.redD);                     // 昂 projecting arm
  for(const s of[-1,1]){B(s*.42-.09,y+.27,-.09,s*.42+.09,y+.38,.09,K.gold);B(-.09,y+.27,s*.42-.09,.09,y+.38,s*.42+.09,K.gold)}
  B(-.6,y+.38,-.08,.6,y+.48,.08,K.edge);B(-.08,y+.38,-.62,.08,y+.48,.62,K.edge);  // second tier
  B(-.14,y+.48,-.14,.14,y+.6,.14,K.blue)}}
/* square ceiling with a round/octagonal hole (藻井 opening) */
function holedCeiling(cx,cz,hx,hz,r,y,n,c,c2){const ca=Math.atan2(hz,hx),A=[...Array(n).keys()].map(k=>k*TAU/n).concat([ca,Math.PI-ca,Math.PI+ca,TAU-ca]).sort((a,b)=>a-b);A.push(TAU);for(let k=0;k<A.length-1;k++){const a0=A[k],a1=A[k+1];if(a1-a0<1e-6)continue;const rp=a=>{const dx=Math.cos(a),dz=Math.sin(a),t=Math.min(hx/Math.abs(dx||1e-9),hz/Math.abs(dz||1e-9));return[cx+dx*t,y,cz+dz*t]},cp=a=>[cx+Math.cos(a)*r,y,cz+Math.sin(a)*r];
 G.plain.quad(cp(a0),cp(a1),rp(a1),rp(a0),k%2?c:c2,null,[cx,y+5,cz])}}
/* caisson (藻井): concentric stepped rings, each crowded with bracket sets; twist>0 = spiral (正殿) */
/* inward-facing drum + downward-facing cap: hides the roof cavity / sky behind a caisson */
function capInside(cx,cz,r,y0,y1,n,c){for(let k=0;k<n;k++){const a0=k*TAU/n,a1=(k+1)*TAU/n,p=(a,y)=>[cx+Math.cos(a)*r,y,cz+Math.sin(a)*r];
 const am=(a0+a1)/2;G.plain.quad(p(a0,y0),p(a1,y0),p(a1,y1),p(a0,y1),c,null,[cx+Math.cos(am)*r*4,(y0+y1)/2,cz+Math.sin(am)*r*4]);G.plain.tri([cx,y1,cz],p(a0,y1),p(a1,y1),[0,0],[1,0],[0,1],shade(c,.8),[cx,y1+5,cz])}}
function caisson(cx,cz,y0,r0,rings,sides,sets,rise,twist){capInside(cx,cz,r0+.06,y0-.02,y0+rings*rise+.3,sides<16?sides:32,K.redD);for(let i=0;i<rings;i++){const t=i/rings,r=lerp(r0,.35,t),r1=lerp(r0,.35,(i+1)/rings),y=y0+i*rise,off=twist*i;
  prism(G.plain,cx,cz,r,y,y+rise*.45,sides,i%2?K.redD:K.edge,{r1:r,off,cap:false,c2:K.gold});
  ring(G.plain,cx,cz,r1,r,y+rise*.45,y+rise*.5,sides,K.gold);
  for(let k=0;k<sets;k++){const a=off+k*TAU/sets,px=cx+Math.cos(a)*(r-.06),pz=cz+Math.sin(a)*(r-.06),ix=cx+Math.cos(a+twist*.6)*(r1+.02),iz=cz+Math.sin(a+twist*.6)*(r1+.02);
   seg(G.plain,[px,y+rise*.5,pz],[ix,y+rise,iz],.09,.08,k%2?K.gold:K.red)}}
 prism(G.shiny,cx,cz,.36,y0+rings*rise,y0+rings*rise+.12,sides,K.gold,{cap:true});
 const top=y0+rings*rise+.12;for(let k=0;k<8;k++){const a=k*TAU/8;seg(G.shiny,[cx,top-.02,cz],[cx+Math.cos(a)*.3,top-.08,cz+Math.sin(a)*.3],.05,.05,K.gold)}}
/* seated deity: pedestal/lotus, robe, hands, head, headdress, halo. Simple shapes, recognisable roles. */
function deity(x,y,z,s,o={}){const robe=o.robe||K.gold,face=o.face||col(0xe8c070),g=G.shiny,face2=shade(face,.85);
 if(o.lotus!==false){for(let k=0;k<12;k++){const a=k*TAU/12;seg(g,[x,y+.05*s,z],[x+Math.cos(a)*.62*s,y+.32*s,z+Math.sin(a)*.62*s],.26*s,.08*s,k%2?col(0xe890a0):col(0xf0c8c8))}prism(g,x,z,.5*s,y,y+.25*s,12,K.gold)}
 const b=y+.25*s;
 prism(g,x,z+.12*s,.62*s,b,b+.32*s,10,robe,{r1:.55*s});                 // crossed legs / lap
 prism(g,x,z-.04*s,.42*s,b+.3*s,b+1.02*s,10,robe,{r1:.26*s});            // torso
 prism(g,x,z+.02*s,.3*s,b+.95*s,b+1.06*s,10,shade(robe,.8));             // collar
 for(const sd of[-1,1])seg(g,[x+sd*.33*s,b+.88*s,z],[x+sd*.18*s,b+.5*s,z+.32*s],.15*s,.15*s,robe);
 prism(g,x,z+.36*s,.13*s,b+.46*s,b+.6*s,8,face2);                         // hands
 prism(g,x,z,.17*s,b+1.06*s,b+1.42*s,8,face,{r1:.15*s});                  // head
 if(o.beard)seg(g,[x,b+1.16*s,z+.15*s],[x,b+.8*s,z+.2*s],.16*s,.06*s,K.black);
 const h=b+1.42*s;
 if(o.hat==='crown'){prism(g,x,z,.2*s,h-.04*s,h+.16*s,8,K.gold,{r1:.24*s});box(g,x-.34*s,h+.16*s,z-.26*s,x+.34*s,h+.2*s,z+.26*s,K.gold);for(let k=-3;k<=3;k++)seg(g,[x+k*.09*s,h+.16*s,z+.25*s],[x+k*.09*s,h-.12*s,z+.27*s],.025*s,.025*s,col(0xffe8a0))}
 else if(o.hat==='hood'){prism(g,x,z-.02*s,.22*s,h-.3*s,h+.12*s,8,col(0xf4f0e6),{r1:.12*s});prism(g,x,z,.08*s,h+.1*s,h+.22*s,6,K.gold)}
 else if(o.hat==='cap'){prism(g,x,z,.18*s,h-.06*s,h+.14*s,8,o.hatC||K.black,{r1:.17*s});for(const sd of[-1,1])seg(g,[x+sd*.14*s,h+.04*s,z-.04*s],[x+sd*.36*s,h+.06*s,z-.04*s],.05*s,.04*s,o.hatC||K.black)}
 else prism(g,x,z,.17*s,h-.06*s,h+.08*s,8,K.black,{r1:.08*s});
 if(o.halo!==false){const hz=z-.24*s,hy=b+1.22*s,R0=.5*s;for(let k=0;k<20;k++){const a0=k*TAU/20,a1=(k+1)*TAU/20;seg(G.glow,[x+Math.cos(a0)*R0,hy+Math.sin(a0)*R0,hz],[x+Math.cos(a1)*R0,hy+Math.sin(a1)*R0,hz],.08*s,.05*s,col(0xffe0a0))}
  const R1=.72*s;for(let k=0;k<24;k++){const a0=k*TAU/24,a1=(k+1)*TAU/24;seg(G.shiny,[x+Math.cos(a0)*R1,hy+Math.sin(a0)*R1,hz-.02],[x+Math.cos(a1)*R1,hy+Math.sin(a1)*R1,hz-.02],.06*s,.05*s,K.gold)}}}
/* simplified mounts for Manjusri (lion) and Samantabhadra (white elephant) */
function mount(x,y,z,s,kind){const c=kind==='lion'?col(0x3f8a6a):col(0xf2efe6),g=G.shiny;box(g,x-.55*s,y,z-.32*s,x+.55*s,y+.55*s,z+.32*s,c);
 if(kind==='lion'){prism(g,x,z+.38*s,.3*s,y+.25*s,y+.75*s,8,c);prism(g,x,z+.42*s,.36*s,y+.55*s,y+.8*s,8,col(0x2a6a4a))}
 else{prism(g,x,z+.4*s,.28*s,y+.2*s,y+.72*s,8,c);seg(g,[x,y+.45*s,z+.62*s],[x,y+.02*s,z+.72*s],.12*s,.12*s,c);for(const sd of[-1,1])seg(g,[x+sd*.12*s,y+.4*s,z+.62*s],[x+sd*.2*s,y+.3*s,z+.82*s],.05*s,.05*s,K.white)}
 box(g,x-.5*s,y+.55*s,z-.3*s,x+.5*s,y+.62*s,z+.3*s,K.red)}
/* offerings on a table: fruit, vases with flowers, candles */
function offerings(x0,x1,z,y){const r=seeded(Math.abs((x0*7+z*3)|0)+5),n=Math.max(2,Math.round((x1-x0)/.55));for(let i=0;i<n;i++){const x=lerp(x0+.2,x1-.2,i/(n-1||1)),k=i%3;
  if(k===0){prism(G.shiny,x,z,.18,y,y+.05,8,K.gold);for(let j=0;j<4;j++)prism(G.plain,x+(j%2-.5)*.12,z+((j>>1)-.5)*.12,.07,y+.05+(j>1?.06:0),y+.17+(j>1?.06:0),6,[col(0xf0a020),col(0xd8302a),col(0xf0d040),col(0x80b040)][(r()*4)|0])}
  else if(k===1){prism(G.shiny,x,z,.08,y,y+.3,8,col(0x2a5aa0),{r1:.05});for(let j=0;j<5;j++){const a=j*TAU/5;seg(G.plain,[x,y+.28,z],[x+Math.cos(a)*.14,y+.5,z+Math.sin(a)*.14],.02,.02,K.leaf);prism(G.plain,x+Math.cos(a)*.14,z+Math.sin(a)*.14,.06,y+.48,y+.56,6,[col(0xf06070),col(0xf8f0e0),col(0xf0c030)][j%3])}}
  else{prism(G.plain,x,z,.05,y,y+.42,6,K.red);prism(G.glow,x,z,.03,y+.42,y+.52,4,col(0xffd070),{r1:0})}}}
function buildDetails(){
 /* ---- front hall: bracket rows along the porch beams, painted door leaves, carved stone panels ---- */
 brackets(-8.6,8.6,13.4,4.75,.86);brackets(-22.4,-9.6,13.4,4.15,.9);brackets(9.6,22.4,13.4,4.15,.9);
 brackets(-8.6,8.6,6.5,4.75,.86);
 const doorList=[[-1.8,1.8,4.2],[-5.8,-3.6,3.4],[3.6,5.8,3.4],[15.2,17.2,3.2],[-17.2,-15.2,3.2]];
 for(const[a,b,h]of doorList){const w=(b-a)/2;DOORS.push({hx:a,hz:9.93,w,h,y:.45,dir:1,big:h>4},{hx:b,hz:9.93,w,h,y:.45,dir:-1,big:h>4});
  box(G.plain,a-.12,.45,10.42,b+.12,.6,10.5,K.stoneD);box(G.wood,a-.12,.45+h,10.42,b+.12,.45+h+.22,10.5,K.redD,{s:.4})}
 const wallSegs=[[-23,-17.2],[-15.2,-9],[-9,-5.8],[-3.6,-1.8],[1.8,3.6],[5.8,9],[9,15.2],[17.2,23]];
 for(const[a,b]of wallSegs){const w=b-a;if(w<.8)continue;CARVES.push({x:(a+b)/2,y:.95,z:10.47,w:w-.3,h:.9,kind:'dado'});
  if(w>3.2)CARVES.push({x:(a+b)/2,y:2.75,z:10.47,w:Math.min(2.3,w-.8),h:2.3,kind:Math.abs((a+b)/2)>12?'round':'bamboo'});
  else if(w>1.4)CARVES.push({x:(a+b)/2,y:2.6,z:10.47,w:w-.4,h:2.6,kind:'tall'})}
 /* front hall interior: lattice ceiling and the octagonal caisson (八卦藻井, 32 bracket sets) */
 holedCeiling(0,8.3,9,1.65,1.55,4.85,32,K.redD,K.edge);
 for(const sx of[-1,1])box(G.wood,sx>0?9:-23,4.82,6.6,sx>0?23:-9,4.92,9.95,K.wood,{s:.4});
 caisson(0,8.3,4.85,1.5,5,8,32,.26,0);
 LANT.push([-4.5,4.1,8.3],[4.5,4.1,8.3],[-13,3.9,8.3],[13,3.9,8.3]);
 /* courtyard: offerings on the two tables, kneeling cushions, tall candle stands before the main hall */
 for(const x of[-5.5,5.5])offerings(x-2,x+2,2.6,.95);
 for(let i=-3;i<=3;i++)for(const z of[-2.8,-1.9]){box(G.plain,i*1.3-.4,.15,z-.3,i*1.3+.4,.27,z+.3,col(0xb8302a),{top:col(0xd84a3a)})}
 for(const x of[-3.6,3.6]){prism(G.shiny,x,-4.6,.32,.15,.3,8,K.bronze);prism(G.shiny,x,-4.6,.06,.3,1.6,6,K.bronzeL);prism(G.plain,x,-4.6,.11,1.6,2.3,8,K.red);prism(G.glow,x,-4.6,.06,2.3,2.48,4,col(0xffd070),{r1:0});solidC(x,-4.6,.35,2.4)}
 /* main hall interior: lattice ceiling with the round spiral caisson (螺旋藻井, Ø 5.82 m, 32 bracket sets) */
 holedCeiling(0,-13.6,6.35,3.85,2.95,5.3,40,K.redD,K.edge);
 caisson(0,-13.6,5.3,2.91,8,32,32,.17,.09);
 /* Guanyin at the centre, Manjusri (lion) and Samantabhadra (elephant) at the sides, eighteen arhats along the walls */
 box(G.wood,-1.2,.9,-16.6,1.2,1.9,-15.7,K.redD,{s:.4});solid(-1.2,-16.6,1.2,-15.7,1.9);
 deity(0,1.9,-16.15,1.25,{robe:K.gold,hat:'hood'});
 for(const[x,k]of[[-3.8,'lion'],[3.8,'elephant']]){box(G.wood,x-.8,.9,-16.6,x+.8,1.5,-15.9,K.redD,{s:.4});solid(x-.8,-16.6,x+.8,-15.9,1.5);mount(x,1.5,-16.25,.95,k);deity(x,2.12,-16.3,.8,{robe:K.gold,hat:'crown',lotus:false})}
 box(G.wood,-3,.9,-15.4,3,1.75,-14.6,K.red,{top:col(0xc04030)});solid(-3,-15.4,3,-14.6,1.75);offerings(-2.8,2.8,-15,1.75);
 {const cl=[K.red,col(0x8a4aa0),K.blue,col(0xe0902a),K.green,col(0x6a3a2a)];for(const sx of[-1,1]){const xw=sx*6.05;box(G.wood,Math.min(xw,sx*5.4),.9,-19.9,Math.max(xw,sx*5.4),1.55,-10.3,K.redD,{s:.4});solid(Math.min(xw,sx*5.4),-19.9,Math.max(xw,sx*5.4),-10.3,1.55);
  for(let i=0;i<9;i++){const z=lerp(-19.4,-10.8,i/8);deityR(sx*5.75,1.55,z,.55,cl[(i*2+(sx>0?1:0))%6],sx)}}}
 LANT.push([-3,4.6,-12],[3,4.6,-12],[-3,4.6,-18.8],[3,4.6,-18.8]);
 /* main hall + rear hall bracket rows */
 brackets(-9.8,9.8,-6.7,4.5,.82);
 brackets(-21,21,-33.6,4.25,1.05);
 /* rear hall shrines: Mazu (centre, beaded crown), Wenchang (east), Guan Yu (west, red face, beard) */
 for(const[x,o]of[[0,{robe:col(0xc8372d),hat:'crown',face:col(0x8a5a3a)}],[16,{robe:K.blue,hat:'cap',hatC:K.black}],[-16,{robe:K.green,face:col(0xc83a2a),beard:true,hat:'cap',hatC:K.green}]]){
  box(G.wood,x-1.1,.6,-38.5,x+1.1,1.6,-37.7,K.redD,{s:.4});solid(x-1.1,-38.5,x+1.1,-37.7,1.6);deity(x,1.6,-38.1,1.05,Object.assign({lotus:false},o));
  box(G.wood,x-2.2,.6,-37.2,x+2.2,1.45,-36.4,K.red,{top:col(0xc04030)});solid(x-2.2,-37.2,x+2.2,-36.4,1.45);offerings(x-2,x+2,-36.8,1.45);
  for(const sd of[-1,1])deity(x+sd*1.6,1.6,-38.1,.6,{robe:shade(o.robe,1.15),hat:'cap',hatC:K.black,lotus:false,halo:false})}
 /* wing walls: carved stone panels facing the corridors */
 for(const sx of[-1,1])for(const z of[-30.5,-20.5,-4])CARVES.push({x:sx*22.7,y:2.4,z,w:2.4,h:2.0,kind:'round',ry:sx>0?-Math.PI/2:Math.PI/2})}
/* an arhat: seated small figure turned toward the hall centre */
function deityR(x,y,z,s,robe,sx){deity(x,y,z,s,{robe,face:col(0xd8a868),hat:'bald',lotus:false,halo:false})}
/* textured details (doors with door guardians, carved granite/青斗石 panels) */
function doorCanvas(big){return mk(96,192,g=>{R(g,0,0,96,192,'#8a1c14');R(g,3,3,90,186,'#b0291c');R(g,8,8,80,176,'#9c2418');
 for(let y=14;y<188;y+=12)for(let x=12;x<88;x+=12)R(g,x,y,3,3,'#e0b040');
 // painted guardian (門神): helmet, face, beard, armour, sash, halberd
 R(g,26,40,44,30,'#1a1a1a');R(g,30,30,36,14,'#e0b040');R(g,44,22,8,10,'#d8302a');R(g,34,46,28,20,big?'#e8c090':'#d89060');R(g,38,52,6,3,'#111');R(g,52,52,6,3,'#111');R(g,40,60,16,4,'#5a1a10');
 R(g,32,64,32,12,'#1a1a1a');R(g,22,76,52,56,'#2a6a4a');for(let y=80;y<130;y+=6)for(let x=24;x<72;x+=8)R(g,x,y,6,3,'#e0b040');R(g,22,100,52,6,'#d8302a');
 R(g,30,132,14,40,'#2a4a8a');R(g,52,132,14,40,'#2a4a8a');R(g,28,170,18,8,'#1a1a1a');R(g,50,170,18,8,'#1a1a1a');R(g,78,20,4,160,'#7a5a2a');R(g,72,14,16,12,'#c0c0c0');R(g,14,90,10,10,'#e8c090')})}
function carveCanvas(kind){return mk(128,128,g=>{const r=seeded(kind.length*13+3);R(g,0,0,128,128,'#56605c');for(let i=0;i<900;i++){const v=70+(r()*40|0);R(g,r()*128|0,r()*128|0,1,1,`rgb(${v},${v+6},${v+4})`)}
 g.strokeStyle='#8f9c96';g.lineWidth=3;g.strokeRect(5,5,118,118);g.strokeStyle='#2c3432';g.strokeRect(9,9,110,110);
 if(kind==='round'){g.fillStyle='#202826';g.beginPath();g.arc(64,64,46,0,TAU);g.fill();g.strokeStyle='#9aa8a2';g.lineWidth=5;g.beginPath();g.arc(64,64,46,0,TAU);g.stroke();g.lineWidth=4;for(let k=0;k<8;k++){const a=k*TAU/8;g.beginPath();g.moveTo(64,64);g.lineTo(64+Math.cos(a)*44,64+Math.sin(a)*44);g.stroke()}g.beginPath();g.arc(64,64,18,0,TAU);g.stroke();g.beginPath();g.arc(64,64,32,0,TAU);g.stroke()}
 else if(kind==='bamboo'){R(g,16,16,96,96,'#202826');for(let x=22;x<110;x+=12){R(g,x,16,6,96,'#8f9c96');for(let y=28;y<112;y+=22)R(g,x-1,y,8,3,'#b8c4be')}}
 else if(kind==='tall'){g.strokeStyle='#9aa8a2';g.lineWidth=4;g.beginPath();for(let y=14;y<118;y+=2){const x=64+Math.sin(y/9)*30;y===14?g.moveTo(x,y):g.lineTo(x,y)}g.stroke();g.fillStyle='#9aa8a2';for(let y=20;y<118;y+=18){g.beginPath();g.arc(64+Math.sin(y/9)*30,y,5,0,TAU);g.fill()}R(g,50,56,28,16,'#b8c4be')}
 else{for(let x=14;x<114;x+=34){g.strokeStyle='#9aa8a2';g.lineWidth=3;g.strokeRect(x,24,28,80);g.beginPath();g.arc(x+14,64,9,0,TAU);g.stroke()}}})}
function detailMeshes(){const dm={},mat=k=>dm[k]||(dm[k]=new THREE.MeshLambertMaterial({map:new THREE.CanvasTexture(k.startsWith('door')?doorCanvas(k==='doorB'):carveCanvas(k)),side:THREE.DoubleSide}));
 const A=1.2;for(const d of DOORS){const m=new THREE.Mesh(new THREE.PlaneGeometry(d.w,d.h),mat(d.big?'doorB':'door'));const th=d.dir>0?A:Math.PI-A,dx=Math.cos(th),dz=-Math.sin(th);
  m.position.set(d.hx+dx*d.w/2,d.y+d.h/2,d.hz+dz*d.w/2);m.rotation.y=th;m.castShadow=true;m.receiveShadow=true;S3.add(m);solid(Math.min(d.hx,d.hx+dx*d.w)-.06,Math.min(d.hz,d.hz+dz*d.w)-.06,Math.max(d.hx,d.hx+dx*d.w)+.06,Math.max(d.hz,d.hz+dz*d.w)+.06,5)}
 for(const c of CARVES){const m=new THREE.Mesh(new THREE.PlaneGeometry(c.w,c.h),mat(c.kind));m.position.set(c.x,c.y,c.z);if(c.ry)m.rotation.y=c.ry;m.receiveShadow=true;S3.add(m)}}
