// Presentation transforms use the original pixels: no regenerated measurements.
const purples=[[179,105,158],[141,80,119],[90,35,73]];
function shade(t){t=Math.max(0,Math.min(1,t));const k=t<.5?0:1,v=t<.5?t*2:(t-.5)*2;return purples[k].map((a,i)=>Math.round(a+(purples[k+1][i]-a)*v))}
function hue(r,g,b){r/=255;g/=255;b/=255;const max=Math.max(r,g,b),min=Math.min(r,g,b),d=max-min;if(d===0)return 0;let h=max===r?(g-b)/d+(g<b?6:0):max===g?(b-r)/d+2:(r-g)/d+4;return h*60}
async function processVisual(button,type){const image=button.querySelector('img');const source=new Image();source.src=button.dataset.source;await source.decode();const c=document.createElement('canvas');c.width=source.naturalWidth;c.height=source.naturalHeight;const ctx=c.getContext('2d',{willReadFrequently:true});ctx.drawImage(source,0,0);const data=ctx.getImageData(0,0,c.width,c.height),a=data.data;const sourcePixel=new Uint8ClampedArray(a);const factor=c.width/1800;const graph=[1347,1428,1511,1593,1675,1758].map(x=>({x:x*factor,ys:[]}));
for(let y=0;y<c.height;y++){for(let x=0;x<c.width;x++){const j=(y*c.width+x)*4;let r=a[j],g=a[j+1],b=a[j+2],mx=Math.max(r,g,b),mn=Math.min(r,g,b),sat=mx-mn;const xx=x/factor,yy=y/factor;let color;
const inZone=zones=>zones.some(([zx,zy,zw,zh])=>xx>=zx&&xx<=zx+zw&&yy>=zy&&yy<=zy+zh);
if(type==='text-nodes'||type==='text-visual'||type==='text-regional'||type==='text-aptitude'||type==='text-incidents'){
 let zone=type==='text-nodes'?yy<125:type==='text-visual'?inZone([[850,0,950,110],[325,25,390,45],[345,1100,240,65]]):type==='text-regional'?inZone([[0,0,1800,105],[900,165,900,70]]):type==='text-aptitude'?yy<68:(yy<52||xx<48||xx>607&&xx<650||xx>1239&&xx<1285);
 if(type==='text-incidents'&&xx<392&&yy<48){const t=Math.max(0,Math.min(1,(Math.min(r,g,b)-110)/145));const v=Math.round(105+150*t);color=[v,v,v]}
 else if(zone&&sat>20){const t=Math.max(0,Math.min(1,(255-mn)/110));const v=Math.round(255-235*t);color=[v,v,v]}
 if(type==='text-visual'&&inZone([[1430,154,350,31],[627,1090,210,38]])&&mn>214){color=[35,35,35]}
}else if(type==='bim-pastel'){
 const title=inZone([[640,0,910,110],[1300,145,300,55],[245,604,270,40],[275,715,360,42],[1030,715,350,42],[1610,0,180,95]]);
 if(title&&sat>25){const v=Math.max(20,255-(255-mn)*2);color=[v,v,v]}
 else if(sat>25){const avg=(r+g+b)/3;color=[r,g,b].map(v=>Math.round(v*.32+avg*.1+255*.58))}
 else if(mx>115&&mx<230){color=[r,g,b].map(v=>Math.round(v*.55+255*.45))}
}else if(type==='cover-sig'){
 if(sat>30){const t=1-(.2126*r+.7152*g+.0722*b)/255;color=shade(t)}
}else if(type==='watercolor'){
 const avg=(r+g+b)/3;let seed=(Math.imul(x+1,73856093)^Math.imul(y+1,19349663))>>>0;const grain=((seed%101)/100-.5)*3.4;const ripple=Math.sin(x*.43+y*.37)*.6;const density=.953+grain/255+ripple/255;
 color=[r,g,b].map(v=>Math.max(0,Math.min(255,Math.round((avg+(v-avg)*.90)*density))));
 if(xx>1100&&yy<80&&r>g+15&&b>g+15)color=[45,45,45];
}else if(type==='density'){
 const inPlot=(xx>110&&xx<715&&yy>200&&yy<901)||(xx>990&&xx<1596&&yy>200&&yy<901);
 if(inPlot&&sat<12&&mn>=195&&mx<254)color=[255,255,255];
 if(xx<800&&yy>=200&&yy<=902&&sat>35)color=shade(r>g+20&&b>g+15?((.2126*r+.7152*g+.0722*b)-140)/80:.65);
 if(xx>=990&&yy>=200&&yy<=902&&sat>35)color=shade(Math.min(1,(hue(r,g,b)>300?0:hue(r,g,b))/120));
 if(!color&&!inPlot&&sat>25&&!(xx>730&&xx<790&&yy>570&&yy<750)){const lum=.2126*r+.7152*g+.0722*b;const v=yy<100?18:Math.round(lum*.45);color=[v,v,v]}
}else if(type==='temperature'){
 const inGraph=xx>1327&&xx<1781&&yy>451&&yy<725;
 if(inGraph&&r>g+14&&b>g+14){for(const q of graph)if(Math.abs(x-q.x)<8*factor)q.ys.push(y);color=[255,255,255]}
 else if(xx<1250&&(yy>115||((xx>532&&xx<564||xx>1178&&xx<1217)&&yy>87))&&sat>35)color=shade(1-Math.min(240,hue(r,g,b)>300?0:hue(r,g,b))/240);
 else if(sat>25){const v=yy<110?20:80;color=[v,v,v]}
}else if(type==='piracy-night'){
 const signal=g>=r-8&&g>b+10&&sat>20;
 if(signal&&!(xx>1560&&yy<270)){color=[Math.min(255,Math.round(g*.88+r*.30)),Math.min(255,Math.round(g*.35+r*.55)),Math.min(255,Math.round(g*.78+Math.max(r,b)*.30))]}
 else if(sat<45){if(mx<17)color=[7,14,24];else if(mx<130){const lum=(r+g+b)/3;color=[Math.round(15+lum*.5),Math.round(20+lum*.5),Math.round(29+lum*.55)]}else color=[205,213,222]}
 else if(yy<180||xx>540&&xx<1400&&yy>900||xx<400&&yy>820||xx>1450&&yy>1000||xx>1560&&yy<270)color=[205,213,222];
 else if(r>g+12&&b>g+8)color=[82,73,92];
}else if(type==='piracy'){
 if(g>r*1.35+10&&g>b*1.25+10){const t=Math.max(0,Math.min(1,(g-r)/240));color=shade(.2+.8*t)}
 else if(sat<45){if(mx>190&&yy>140&&yy<1100&&!inZone([[235,270,190,100],[825,300,150,70],[1240,315,170,55],[860,540,170,65],[420,680,260,85],[1450,755,280,70],[130,815,230,285],[580,915,760,120],[1400,1055,400,65]])){color=[252,243,250]}else if(mx<23)color=[255,255,255];else if(mx<90){const v=250-Math.round(mx*.27);color=[v,v,v]}else{const v=Math.max(50,255-Math.round((r+g+b)/3));color=[v,v,v]}}
 else{const v=90;color=[v,v,v]}
}else if(type==='network'){
 if(xx>650&&yy>1030&&sat>25)color=[30,30,30];else if(mx<80&&sat<40)color=[255,255,255];else if(sat<45){const v=Math.max(70,255-(mx-65)*.78);color=[v,v,v]}
}
if(color){a[j]=color[0];a[j+1]=color[1];a[j+2]=color[2]}}
if(y%170===0)await new Promise(requestAnimationFrame)}ctx.putImageData(data,0,0);
if(type==='piracy-night'){
 const light=document.createElement('canvas');light.width=c.width;light.height=c.height;const lc=light.getContext('2d');const ld=lc.createImageData(c.width,c.height),p=ld.data;for(let j=0;j<sourcePixel.length;j+=4){const rr=sourcePixel[j],gg=sourcePixel[j+1],bb=sourcePixel[j+2];if(gg>rr*1.35+10&&gg>bb*1.25+10){const t=Math.max(0,Math.min(1,(gg-rr)/255));p[j]=218;p[j+1]=122;p[j+2]=200;p[j+3]=Math.round(t*110)}}lc.putImageData(ld,0,0);ctx.save();ctx.globalCompositeOperation='screen';ctx.filter=`blur(${2.2*factor}px)`;ctx.drawImage(light,0,0);ctx.restore();
}
if(type==='piracy'){
 const light=document.createElement('canvas');light.width=c.width;light.height=c.height;const lc=light.getContext('2d');const ld=lc.createImageData(c.width,c.height),pix=ld.data;for(let j=0;j<source.naturalWidth*source.naturalHeight*4;j+=4){const rr=sourcePixel[j],gg=sourcePixel[j+1],bb=sourcePixel[j+2];if(gg>rr*1.35+10&&gg>bb*1.25+10){const t=Math.max(0,Math.min(1,(gg-rr)/240));pix[j]=179;pix[j+1]=105;pix[j+2]=158;pix[j+3]=Math.round(t*110)}}lc.putImageData(ld,0,0);ctx.save();ctx.globalCompositeOperation='multiply';ctx.filter=`blur(${3.8*factor}px)`;ctx.drawImage(light,0,0);ctx.restore();
 // White light cores correspond only to the brightest source signal, not invented events.
 const core=ctx.getImageData(0,0,c.width,c.height);for(let j=0;j<sourcePixel.length;j+=4){const rr=sourcePixel[j],gg=sourcePixel[j+1],bb=sourcePixel[j+2];if(gg>242&&gg>rr*1.35+10&&gg>bb*1.25+10){const mix=.75;for(let k=0;k<3;k++)core.data[j+k]=Math.round(core.data[j+k]*(1-mix)+248*mix)}}ctx.putImageData(core,0,0);
}
if(type==='temperature'){
 ctx.strokeStyle='#fff';ctx.lineWidth=6*factor;for(const [x,y,w,h] of [[76,201,432,252],[724,201,431,253],[76,774,432,251],[724,774,431,251]])ctx.strokeRect(x*factor,y*factor,w*factor,h*factor);
 const pts=graph.map(q=>{q.ys.sort((a,b)=>a-b);return{x:q.x,y:q.ys[Math.floor(q.ys.length/2)]}});if(pts.every(q=>Number.isFinite(q.y))){const d=pts.slice(1).map((p,i)=>(p.y-pts[i].y)/(p.x-pts[i].x));const m=pts.map((p,i)=>i===0?d[0]:i===pts.length-1?d[d.length-1]:d[i-1]*d[i]<=0?0:2/(1/d[i-1]+1/d[i]));ctx.beginPath();ctx.moveTo(pts[0].x,pts[0].y);for(let i=0;i<pts.length-1;i++){const p=pts[i],q=pts[i+1],dx=(q.x-p.x)/3;ctx.bezierCurveTo(p.x+dx,p.y+m[i]*dx,q.x-dx,q.y-m[i+1]*dx,q.x,q.y)}ctx.strokeStyle='#86547f';ctx.lineWidth=2.5*factor;ctx.stroke();ctx.fillStyle='#86547f';for(const p of pts){ctx.beginPath();ctx.arc(p.x,p.y,3.8*factor,0,Math.PI*2);ctx.fill()}}
}
const blob=await new Promise(resolve=>c.toBlob(resolve,'image/png'));const url=URL.createObjectURL(blob);image.removeAttribute('srcset');image.src=url;button.dataset.full=url;button.dataset.processed='true';}
let effectQueue=Promise.resolve();
const effectObserver=new IntersectionObserver(entries=>{for(const e of entries)if(e.isIntersecting){effectObserver.unobserve(e.target);effectQueue=effectQueue.then(()=>processVisual(e.target,e.target.dataset.effect)).catch(()=>{e.target.dataset.full=e.target.dataset.source;e.target.dataset.processed='true'})}},{rootMargin:'900px'});
document.querySelectorAll('[data-effect]').forEach(b=>effectObserver.observe(b));
