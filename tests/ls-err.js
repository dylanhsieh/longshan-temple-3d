const {chromium}=require('playwright');const path=require('path');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist']});const p=await b.newPage();
p.on('pageerror',e=>console.log('PE',e.message,e.stack&&e.stack.split('\n')[1]));p.on('console',m=>m.type()==='error'&&console.log('CE',m.text().slice(0,200)));
await p.goto('file://'+path.resolve(__dirname,'../index.html'));await p.waitForTimeout(3000);await b.close()})();
