/* Care plan generator + tracker. Plans saved in LocalStorage under 'careplans' (-> /api/care-plans). */
(function(){
const root=document.getElementById('app'),F=Forms.field,esc=Forms.esc,$=id=>document.getElementById(id);
const O=a=>({options:a});
const IC={water:'bi-droplet',fertilize:'bi-flower2',prune:'bi-scissors',season:'bi-sun'},LB={all:'All',water:'Watering',fertilize:'Fertilizing',prune:'Pruning',season:'Seasonal'};
let plan=null,filter='all',saved=Store.get('careplans',[]);
const persist=()=>Store.set('careplans',saved);
const isSaved=()=>plan&&saved.some(p=>p.id===plan.id);
root.innerHTML=AI.tabs('plan')+`<div class="split top"><form class="card form" id="cf" novalidate><div class="body"><h3>Plant details</h3><div class="fgrid2">
${[['plant','Plant type','select',O(AI.PLANTS.map(p=>[p.id,p.name]))],['age','Plant age','select',O([['young','Under 1 year'],['mature','1+ years']])],['location','Location','text'],['soil','Soil type','select',O([['clay','Clay'],['sandy','Sandy'],['loam','Loam'],['rocky','Rocky']])],['sun','Sunlight','select',O([['full','Full sun'],['partial','Partial shade'],['shade','Shade']])],['water','Water availability','select',O([['limited','Limited'],['occasional','Occasional'],['regular','Regular irrigation']])]].map(f=>F(f)).join('')}
${F(['season','Current season','select',O([['spring','Spring'],['summer','Summer'],['autumn','Autumn'],['winter','Winter']]),{full:1}])}</div><button class="btn" id="gen" style="align-self:flex-start">Generate care plan</button></div></form><div id="view"></div></div><h3 style="margin:48px 0 12px">Saved plans</h3><div id="saved"></div>`;
const form=$('cf'),q=new URLSearchParams(location.search).get('plant');if(q)form.elements.plant.value=q;
function drawSaved(){$('saved').innerHTML=saved.length?saved.map(p=>{const d=p.tasks.filter(t=>t.done).length;return `<div class="task"><i class="bi bi-journal-check"></i><span><b>${esc(p.plantName)}</b> · ${esc(p.inputs.location)}<br><small class="muted">${d}/${p.tasks.length} tasks done</small></span><time><button class="btn sm ghost" data-open="${p.id}">Open</button> <button class="icon-btn" data-del="${p.id}" aria-label="Delete plan"><i class="bi bi-trash"></i></button></time></div>`}).join(''):'<div class="empty"><i class="bi bi-journal"></i><p>No saved plans yet. Generate a plan and press Save.</p></div>'}
function drawPlan(){if(!plan){$('view').innerHTML='<div class="empty"><i class="bi bi-calendar-check"></i><p>Fill in your plant details to see a sample care schedule.</p></div>';return}
 const t=plan.tasks,done=t.filter(x=>x.done).length,pct=Math.round(done/t.length*100),next=t.filter(x=>!x.done).slice(0,3),list=t.filter(x=>filter==='all'||x.type===filter);let m='';
 $('view').innerHTML=`<div class="demo-note"><i class="bi bi-stars"></i>Sample schedule from demo rules, not real AI advice.</div><h3>${esc(plan.plantName)} care plan</h3>
 <div class="bar" style="margin:10px 0 4px" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100"><i style="width:${pct}%"></i></div><p class="muted">${done} of ${t.length} tasks done</p>
 <div class="cta-row" style="margin:12px 0"><button class="btn sm" id="save">${isSaved()?'Saved ✓ (update)':'Save plan'}</button></div>
 <h3 style="margin-top:18px">Upcoming reminders</h3>${next.length?next.map(x=>`<div class="task"><i class="bi ${IC[x.type]}"></i><span>${esc(x.title)}</span><time>${x.due}</time></div>`).join(''):'<p class="muted">All tasks complete. Nice work.</p>'}
 <div class="chips" style="margin:20px 0 4px">${Object.keys(LB).map(k=>`<button type="button" data-f="${k}" class="${k===filter?'on':''}">${LB[k]}</button>`).join('')}</div>
 ${list.map(x=>{const mo=new Date(x.due+'T00:00').toLocaleDateString('en',{month:'long',year:'numeric'});let h='';if(mo!==m){m=mo;h=`<h4 class="mon">${mo}</h4>`}
  return h+`<label class="task ${x.done?'done':''}"><input type="checkbox" data-t="${x.id}" ${x.done?'checked':''}><i class="bi ${IC[x.type]}"></i><span>${esc(x.title)}</span><time>${x.due}</time></label>`}).join('')}`}
form.onsubmit=async e=>{e.preventDefault();let ok=true;form.querySelectorAll('[name]').forEach(el=>{const bad=!el.value.trim();$('e-'+el.name).textContent=bad?'Required.':'';el.setAttribute('aria-invalid',bad);if(bad)ok=false});if(!ok)return;
 $('gen').disabled=true;$('view').innerHTML='<div class="empty"><i class="bi bi-hourglass-split"></i><p>Building your schedule…</p></div>';
 try{plan=await AI.carePlan(Forms.data(form));filter='all';drawPlan()}catch(x){$('view').innerHTML='<div class="empty"><i class="bi bi-exclamation-triangle"></i><p>Could not build a plan. Please try again.</p></div>'}$('gen').disabled=false};
root.addEventListener('click',e=>{const f=e.target.closest('[data-f]'),s=e.target.closest('#save'),o=e.target.closest('[data-open]'),d=e.target.closest('[data-del]');
 if(f){filter=f.dataset.f;drawPlan()}
 if(s){const i=saved.findIndex(p=>p.id===plan.id);i<0?saved.unshift(plan):saved[i]=plan;persist();drawSaved();drawPlan();toast('Plan saved on this device (demo: backend pending)')}
 if(o){plan=JSON.parse(JSON.stringify(saved.find(p=>p.id===o.dataset.open)));filter='all';Object.keys(plan.inputs).forEach(k=>{if(form.elements[k])form.elements[k].value=plan.inputs[k]});drawPlan();$('view').scrollIntoView({behavior:'smooth'})}
 if(d){saved=saved.filter(p=>p.id!==d.dataset.del);persist();if(plan&&plan.id===d.dataset.del)plan=null;drawSaved();drawPlan();toast('Plan deleted')}});
root.addEventListener('change',e=>{const c=e.target.closest('[data-t]');if(!c)return;plan.tasks.find(x=>x.id===c.dataset.t).done=c.checked;
 const i=saved.findIndex(p=>p.id===plan.id);if(i>=0){saved[i]=plan;persist();drawSaved()}drawPlan()});
drawPlan();drawSaved();
})();
