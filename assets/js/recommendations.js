/* Multi-step plant recommendation wizard (demo rules in mock-ai.js). */
(function(){
const root=document.getElementById('app'),F=Forms.field,esc=Forms.esc;
const O=a=>({options:a});
const STEPS=[['Your space',[['city','City / area','text'],['size','Garden size','select',O([['1','Balcony / small'],['2','Medium garden'],['3','Large garden']])]]],
 ['Growing conditions',[['sun','Sunlight','select',O([['full','Full sun'],['partial','Partial shade'],['shade','Shade']])],['soil','Soil type','select',O([['clay','Clay'],['sandy','Sandy'],['loam','Loam'],['rocky','Rocky']])],['water','Water availability','select',O([['limited','Limited'],['occasional','Occasional'],['regular','Regular irrigation']])]]],
 ['Your goals',[['purpose','Planting purpose','select',O([['fruit','Fruit'],['ornamental','Ornamental'],['shade','Shade'],['herbs','Herbs']])],['maint','Maintenance preference','select',O([['1','Low effort'],['2','Some effort'],['3','Happy to maintain']])]]]];
let step=0;
root.innerHTML=AI.tabs('reco')+`<div class="head"><h2>Find the right plants</h2><p class="lead">Answer a few questions to see sample matches.</p></div><div class="split top"><form class="card form" id="wiz" novalidate><div class="body"><div class="stepbar" id="bar"></div>
${STEPS.map((s,i)=>`<fieldset data-step="${i}" style="border:0;padding:0"><legend class="h3" style="font-weight:600;margin-bottom:12px">${s[0]}</legend><div class="fgrid2">${s[1].map(f=>F(f)).join('')}</div></fieldset>`).join('')}
<div class="wiz-nav"><button type="button" class="btn ghost" id="back">Back</button><button type="submit" class="btn" id="next">Next</button></div></div></form><div id="out"><div class="empty"><i class="bi bi-flower3"></i><p>Your suggestions will appear here.</p></div></div></div>`;
const f=document.getElementById('wiz'),$=id=>document.getElementById(id);
function show(){f.querySelectorAll('fieldset').forEach((s,i)=>s.hidden=i!==step);$('bar').innerHTML=STEPS.map((s,i)=>`<i class="${i<=step?'on':''}"></i>`).join('');
 $('back').style.visibility=step?'visible':'hidden';$('next').textContent=step===STEPS.length-1?'Show recommendations':'Next'}
function ok(){let good=true;f.querySelectorAll(`[data-step="${step}"] [name]`).forEach(el=>{const e=$('e-'+el.name),bad=!el.value.trim();e.textContent=bad?'Please choose an option.':'';el.setAttribute('aria-invalid',bad);if(bad)good=false});return good}
$('back').onclick=()=>{step--;show()};
f.onsubmit=async e=>{e.preventDefault();if(!ok())return;if(step<STEPS.length-1){step++;show();return}
 const a=Forms.data(f),o=$('out');o.innerHTML='<div class="empty"><i class="bi bi-hourglass-split"></i><p>Matching plants to your conditions…</p></div>';$('next').disabled=true;
 try{const r=await AI.recommend(a);Store.set('ai:reco',{answers:a,results:r.map(p=>p.id),at:new Date().toISOString()});
  o.innerHTML=r.length?`<div class="demo-note"><i class="bi bi-stars"></i>Sample matches for ${esc(a.city)}: demo rules, not real AI.</div><div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(230px,1fr))">${r.map(p=>`<article class="card rcard">${phHTML('plants/'+p.id+'.jpg',p.name,'bi-flower1')}<div class="body"><span class="match">${p.pct}% match</span><h3>${p.name}</h3><p class="muted">Why: ${p.why.join(', ')}.</p><div class="meta"><span>Water: ${AI.LV[p.need]}</span><span>Sun: ${p.sun.join('/')}</span><span>Care: ${AI.LV[p.maint]}</span></div><a class="btn sm" href="../plant-tree.html?tree=${p.tree}&location=${encodeURIComponent(a.city)}">Request planting</a><a class="btn sm ghost" href="care-plan.html?plant=${p.id}">Care plan</a></div></article>`).join('')}</div>`
  :'<div class="empty"><i class="bi bi-emoji-neutral"></i><p>No strong matches. Try more water or a sunnier spot, or book an expert.</p><a class="btn" style="margin-top:12px" href="../consultation.html">Book a consultation</a></div>';loadImages(o)}
 catch(err){o.innerHTML='<div class="empty"><i class="bi bi-exclamation-triangle"></i><p>Could not get recommendations. Please try again.</p></div>'}
 $('next').disabled=false};
const sv=Store.get('ai:reco');if(sv)Object.keys(sv.answers).forEach(k=>{if(f.elements[k])f.elements[k].value=sv.answers[k]});
show();
})();
