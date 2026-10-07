const {chromium}=require('playwright');const path=require('path');
const FILE='file://'+path.resolve(__dirname,'../index.html'),OUT=path.resolve(__dirname,'../shots');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist']});
 const p=await b.newPage({viewport:{width:1100,height:640}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto(FILE);await p.waitForTimeout(2500);await p.click('#go');await p.waitForTimeout(500);await p.evaluate(()=>__lt.set(0,48,0,-.25,9));
 const st=()=>p.evaluate(()=>__lt.st());
 // yaw stays 0 (north): W=north S=south A=west D=east; real key presses, axis-aligned legs
 async function leg(axis,target,maxMs=25000){const t0=Date.now();let last=null,still=0;
  while(Date.now()-t0<maxMs){const s=await st();const v=axis==='z'?s.z:s.x,d=target-v;if(Math.abs(d)<.35)return s;
   const k=axis==='z'?(d<0?'KeyW':'KeyS'):(d>0?'KeyD':'KeyA');await p.keyboard.down(k);await p.waitForTimeout(Math.max(120,Math.min(900,Math.abs(d)/3.2*1000*.6)));await p.keyboard.up(k);await p.waitForTimeout(150);
   const s2=await st();const v2=axis==='z'?s2.z:s2.x;if(last!=null&&Math.abs(v2-last)<.02){if(++still>2)return{...s2,stuck:true}}else still=0;last=v2}
  return{...(await st()),timeout:true}}
 const route=[['gate','z',38],['plaza','z',18],['frontPorch','z',12],['frontInner','z',8],['court','z',4.2],['courtE','x',13],['eastSide','z',-15],['rearCourt','z',-28],['rearHallFront','x',3],['rearHall','z',-35]];
 for(const [n,a,v] of route){const s=await leg(a,v);console.log(n.padEnd(14),JSON.stringify({x:s.x,y:s.y,z:s.z,spot:s.spot,stuck:s.stuck,timeout:s.timeout}));if(['court','rearHall','eastSide','frontInner'].includes(n))await p.screenshot({path:OUT+'/ls-walk-'+n+'.png'})}
 // collision: walk into rear wall
 await p.keyboard.down('KeyW');await p.waitForTimeout(3000);await p.keyboard.up('KeyW');let s=await st();console.log('afterWallPush z',s.z,'(rear wall at -42.8, altar to -38.4)');
 // try walking into a bronze column from the plaza
 await p.evaluate(()=>__lt.set(-2.4,16,0,-.2));await p.keyboard.down('KeyW');await p.waitForTimeout(2000);await p.keyboard.up('KeyW');s=await st();console.log('bronze column block z',s.z,'(column at 13.4)');
 // teleports via keys 1..7 and jump list
 for(let i=1;i<=7;i++){await p.keyboard.press('Digit'+i);await p.waitForTimeout(300);s=await st();console.log('tp',i,s.spot,s.x,s.z,s.y)}
 await p.click('#bJump');await p.waitForTimeout(200);await p.click('#jumpList button:nth-child(3)');await p.waitForTimeout(400);s=await st();console.log('jumplist->',s.spot);
 await p.screenshot({path:OUT+'/ls-bell-card.png'});
 // camera toggle
 await p.keyboard.press('KeyV');await p.waitForTimeout(400);s=await st();console.log('cam',s.camMode);await p.screenshot({path:OUT+'/ls-fp.png'});
 await p.mouse.move(500,300);await p.mouse.down();await p.mouse.move(650,330,{steps:5});await p.mouse.up();s=await st();console.log('after drag yaw',s.yaw,'pitch',s.pitch);
 await p.keyboard.press('KeyV');await p.waitForTimeout(300);
 await p.mouse.move(550,320);for(let i=0;i<5;i++){await p.mouse.wheel(0,200);await p.waitForTimeout(60)}s=await st();console.log('dist after wheel',s.dist);
 // shift run speed
 await p.evaluate(()=>__lt.set(0,30,0,-.2));await p.keyboard.down('ShiftLeft');await p.keyboard.down('KeyW');await p.waitForTimeout(1000);await p.keyboard.up('KeyW');await p.keyboard.up('ShiftLeft');s=await st();console.log('run 1s moved',(30-s.z).toFixed(2));
 // night
 await p.keyboard.press('KeyN');await p.evaluate(()=>__lt.set(0,5,0,-.15,9));await p.waitForTimeout(600);s=await st();console.log('night',s.night);await p.screenshot({path:OUT+'/ls-night.png'});
 await p.evaluate(()=>__lt.view(0,6,34,0,6,8));await p.waitForTimeout(300);await p.screenshot({path:OUT+'/ls-night-facade.png'});await p.evaluate(()=>__lt.resume());
 await p.keyboard.press('KeyN');
 // language
 await p.click('#bLang');await p.waitForTimeout(300);s=await st();const ls=await p.evaluate(()=>{try{return localStorage.getItem('lsTourLang')}catch(e){return 'ERR'}});console.log('lang',s.lang,'stored',ls,'htmllang',await p.evaluate(()=>document.documentElement.lang));
 await p.keyboard.press('Digit2');await p.waitForTimeout(300);console.log('card EN:',await p.textContent('#infoH'));await p.screenshot({path:OUT+'/ls-en-card.png'});
 await p.reload();await p.waitForTimeout(2500);console.log('after reload lang',await p.evaluate(()=>__lt.st().lang),await p.textContent('#go'));
 // pause
 await p.click('#go');await p.waitForTimeout(300);await p.keyboard.press('KeyP');console.log('paused',await p.evaluate(()=>__lt.st().state),await p.isVisible('#pause'));await p.screenshot({path:OUT+'/ls-pause.png'});await p.keyboard.press('KeyP');console.log('resumed',await p.evaluate(()=>__lt.st().state));
 await p.click('#bLang');
 console.log('fps',(await st()).fps,'calls',(await st()).calls,'tris',(await st()).tris);
 console.log('PAGE ERRORS',errs);await b.close()})();
