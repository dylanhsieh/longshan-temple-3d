const {chromium}=require('playwright');const path=require('path');
const FILE='file://'+path.resolve(__dirname,'../index.html'),OUT=path.resolve(__dirname,'../shots');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist']});
 for(const [w,h,tag] of [[844,390,'land'],[390,844,'port']]){
  const ctx=await b.newContext({viewport:{width:w,height:h},hasTouch:true,isMobile:true,deviceScaleFactor:2});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
  await p.goto(FILE);await p.waitForTimeout(2500);await p.screenshot({path:OUT+`/ls-m-${tag}-title.png`});
  await p.tap('#go');await p.waitForTimeout(800);
  const c=await ctx.newCDPSession(p);const T=(type,pts)=>c.send('Input.dispatchTouchEvent',{type,touchPoints:pts});
  const st=()=>p.evaluate(()=>__lt.st());
  console.log(tag,'touchUI visible',await p.isVisible('#touch'),'hud',await p.isVisible('#hud'));
  let s0=await st();
  // left stick: push up for 3 s
  const sx=w*.2,sy=h*.7;await T('touchStart',[{x:sx,y:sy,id:1}]);for(let i=1;i<=5;i++){await T('touchMove',[{x:sx,y:sy-10*i,id:1}]);await p.waitForTimeout(40)}
  await p.waitForTimeout(3000);let s1=await st();await T('touchEnd',[]);console.log(tag,'stick moved z',s0.z,'->',s1.z);
  // right drag look
  const lx=w*.75,ly=h*.4;await T('touchStart',[{x:lx,y:ly,id:2}]);for(let i=1;i<=6;i++){await T('touchMove',[{x:lx-15*i,y:ly,id:2}]);await p.waitForTimeout(30)}await T('touchEnd',[]);await p.waitForTimeout(300);
  let s2=await st();console.log(tag,'look yaw',s1.yaw,'->',s2.yaw);
  // pinch zoom (two touches on right side spreading)
  await T('touchStart',[{x:w*.6,y:h*.5,id:3},{x:w*.8,y:h*.5,id:4}]);for(let i=1;i<=6;i++){await T('touchMove',[{x:w*.6-8*i,y:h*.5,id:3},{x:w*.8+8*i,y:h*.5,id:4}]);await p.waitForTimeout(30)}await T('touchEnd',[]);await p.waitForTimeout(200);
  let s3=await st();console.log(tag,'pinch dist',s2.dist,'->',s3.dist.toFixed(2));
  // zoom button hold
  const zb=await (await p.$('#tZout')).boundingBox();await T('touchStart',[{x:zb.x+zb.width/2,y:zb.y+zb.height/2,id:5}]);await p.waitForTimeout(1200);await T('touchEnd',[]);let s4=await st();console.log(tag,'zoom-out button dist',s3.dist.toFixed(2),'->',s4.dist.toFixed(2));
  // camera toggle button + teleport via jump list
  await p.tap('#bCam');await p.waitForTimeout(300);console.log(tag,'cam',(await st()).camMode);await p.tap('#bCam');
  await p.tap('#bJump');await p.waitForTimeout(200);await p.tap('#jumpList button:nth-child(6)');await p.waitForTimeout(1200);console.log(tag,'jump ->',(await st()).spot);
  await p.screenshot({path:OUT+`/ls-m-${tag}-main.png`});
  await p.tap('#bJump');await p.waitForTimeout(200);await p.screenshot({path:OUT+`/ls-m-${tag}-jumplist.png`});await p.tap('#jumpList button:nth-child(4)');await p.waitForTimeout(1500);
  await p.screenshot({path:OUT+`/ls-m-${tag}-drum.png`});
  // check overlaps: HUD vs info card vs minimap
  const bb=async s=>{const e=await p.$(s);return e&&await e.isVisible()?await e.boundingBox():null};
  const boxes={hud:await bb('#hud'),info:await bb('#info'),map:await bb('#mapBox'),zin:await bb('#tZin')};console.log(tag,JSON.stringify(boxes));
  console.log(tag,'scrollW',await p.evaluate(()=>[document.documentElement.scrollWidth,innerWidth]),'errors',errs);await ctx.close()}
 await b.close()})();
