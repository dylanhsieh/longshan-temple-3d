const {chromium}=require('playwright');const path=require('path');
const FILE='file://'+path.resolve(__dirname,'../index.html'),OUT=path.resolve(__dirname,'../shots');const tag=process.argv[2]||'r';
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist']});
 const p=await b.newPage({viewport:{width:1100,height:640}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto(FILE);await p.waitForTimeout(2500);await p.click('#go');await p.waitForTimeout(600);
 const V=[['plaza',[-14,7,44],[0,5,12]],['facade',[0,3.2,24],[0,3.2,10]],['roof',[12,9,22],[2,7,10]],['court',[10,3,-1],[0,4,-15]],['guanyin',[0,2.6,-10.5],[0,2.6,-16.4]],['over',[45,55,70],[0,0,-5]],['fall',[18,3,22],[31,3,26]],['tower',[8,6,-8],[20,8,1]]];
 for(const[n,c,t]of V){await p.evaluate(([c,t])=>__lt.view(c[0],c[1],c[2],t[0],t[1],t[2]),[c,t]);await p.waitForTimeout(500);await p.screenshot({path:OUT+'/ls-'+tag+'-'+n+'.png'})}
 console.log('ERR',errs);await b.close()})();
