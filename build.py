"""Build index.html: one self-contained, offline-capable file (Three.js r128 inlined).
Usage: python3 build.py            -> index.html
Order matters: borrowed helpers, then details.js and realism.js (function declarations + their own consts),
then tour.js (main program; calls buildDetails()/makeMats()/... during startup)."""
import os
os.chdir(os.path.dirname(os.path.abspath(__file__)))
rd=lambda p:open(p,encoding='utf-8').read()
js='\n'.join(["'use strict';",rd('src/borrowed.js'),rd('src/details.js'),rd('src/realism.js'),rd('src/tour.js')])
out=rd('src/head.html')+'\n<script>'+rd('vendor/three.min.js')+'</script>\n<script>\n(()=>{\n'+js+'\n})();\n</script>\n</body>\n</html>\n'
open('index.html','w',encoding='utf-8').write(out)
open('tests/bundle-check.js','w',encoding='utf-8').write('(()=>{\n'+js+'\n})();')
print('index.html',len(out),'chars')
