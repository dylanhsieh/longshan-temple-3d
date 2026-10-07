const {chromium}=require('playwright');const path=require('path');
const FILE='file://'+path.resolve(__dirname,'../index.html'),OUT=path.resolve(__dirname,'../shots');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist']});
 const p=await b.newPage({viewport:{width:1100,height:640}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto(FILE);await p.waitForTimeout(2500);await p.click('#go');await p.waitForTimeout(600);
 const V=[['d-facade',[0,3.2,24],[0,3.2,10]],['d-doors',[-7,1.8,15.5],[0,2.4,9.5]],['d-fcais',[0,1.4,9.6],[0,6.2,8.2]],['d-guanyin',[0,2.6,-10.5],[0,2.6,-16.4]],
  ['d-mcais',[0,1.6,-11.2],[0,6.6,-13.8]],['d-arhats',[-2.5,2.2,-11.2],[-5.9,1.9,-15.5]],['d-rear',[0,2.6,-31],[0,2.4,-38.2]],['d-court',[0,2.4,-0.5],[0,2,-8]],['d-wing',[18,2,-10],[23,2.2,-20.5]]];
 for(const[n,c,t]of V){await p.evaluate(([c,t])=>__lt.view(c[0],c[1],c[2],t[0],t[1],t[2]),[c,t]);await p.waitForTimeout(500);await p.screenshot({path:OUT+'/ls-'+n+'.png'})}
 await p.keyboard.press('Digit8');await p.waitForTimeout(600);console.log('spot8',await p.textContent('#infoH'));await p.screenshot({path:OUT+'/ls-d-spot8.png'});

 console.log('ERR',errs);await b.close()})();
