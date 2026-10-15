/* MOCK AI SERVICE — simple keyword/scoring rules, NOT a real AI model.
   Every function below maps to a future Laravel endpoint:
     AI.chat(msg)       -> POST /api/ai/chat        {conversation_id, message}
     AI.recommend(a)    -> POST /api/ai/recommend   {city,size,sun,soil,water,purpose,maint}
     AI.carePlan(i)     -> POST /api/ai/care-plans  (then GET/PATCH/DELETE /api/care-plans/{id})
   Suggested MySQL: care_plans(id,user_id,plant_key,inputs JSON,created_at) ; care_tasks(id,plan_id,type,title,due_date,completed_at). */
const AI={
  DEMO:'Demonstration only: results come from simple rules running in your browser, not from a real AI model.',
  delay:ms=>new Promise(r=>setTimeout(r,ms)),
  tabs(a){return `<div class="tabs">${[['chat','chatbot.html','Chatbot'],['reco','recommendations.html','Plant recommendations'],['plan','care-plan.html','Care plans']].map(t=>`<a href="${t[1]}" class="${t[0]===a?'on':''}">${t[2]}</a>`).join('')}</div><div class="demo-note"><i class="bi bi-info-circle"></i>${AI.DEMO}</div>`},
  SUGGEST:['Why are my lemon tree leaves turning yellow?','How often should I water an olive tree?','What plants are suitable for my garden?','How can I book a Khadra consultation?'],
  RULES:[
   {k:['yellow'],a:{text:'Demo answer: yellow lemon leaves often point to overwatering, poor drainage or a nitrogen/iron shortage. Check that the soil is not soggy, water deeply but less often, and feed with a citrus fertilizer in spring.',link:['../consultation.html','Book a consultation']}},
   {k:['water','olive'],a:{text:'Demo answer: established olive trees need deep watering about every 2–3 weeks in summer and rarely in winter. Young trees (under 2 years) need water weekly.',link:['care-plan.html','Create an olive care plan']}},
   {k:['suitable','garden','recommend','which plant'],a:{text:'Demo answer: the best plants depend on your sun, soil and water. Answer a few questions and I will suggest matches.',link:['recommendations.html','Find plants for my garden']}},
   {k:['book','consultation','appointment'],a:{text:'Demo answer: you can book an on-site or video consultation, pick a date and attach a photo of the problem.',link:['../consultation.html','Book a consultation']}},
   {k:['prun'],a:{text:'Demo answer: most fruit trees are pruned in late winter. Remove dead or crossing branches and avoid cutting more than a quarter of the canopy.',link:['../pruning-removal.html','Book pruning']}},
   {k:['fertil','compost','feed'],a:{text:'Demo answer: apply compost around the drip line in early spring and again in early summer. Water well afterwards.',link:['../shop.html','Browse compost']}}],
  FALLBACK:{text:'Demo answer: I only know a few sample topics (watering, yellow leaves, pruning, fertilizer, booking). Try one of the suggested questions, or book an expert.',link:['../consultation.html','Book a consultation']},
  async chat(msg){await AI.delay(900);if(msg.trim()==='/error')throw new Error('Simulated network error');
    const m=msg.toLowerCase(),h=AI.RULES.find(r=>r.k.some(k=>m.includes(k)));return h?h.a:AI.FALLBACK},
  /* sun/soil: allowed values; need: water need 1-3; size: min space 1-3; maint: effort 1-3 */
  PLANTS:[
   {id:'olive',name:'Olive tree',tree:'Olive',sun:['full'],soil:['loam','sandy','rocky','clay'],need:1,size:3,purpose:['fruit','shade'],maint:1},
   {id:'lemon',name:'Lemon tree',tree:'Lemon',sun:['full','partial'],soil:['loam','sandy'],need:2,size:2,purpose:['fruit','ornamental'],maint:2},
   {id:'fig',name:'Fig tree',tree:'Fig',sun:['full'],soil:['loam','sandy','rocky'],need:1,size:3,purpose:['fruit'],maint:1},
   {id:'pomegranate',name:'Pomegranate',tree:'Pomegranate',sun:['full'],soil:['loam','sandy','clay','rocky'],need:1,size:2,purpose:['fruit','ornamental'],maint:1},
   {id:'jasmine',name:'Jasmine',tree:'Other',sun:['full','partial'],soil:['loam','sandy'],need:2,size:1,purpose:['ornamental'],maint:2},
   {id:'rosemary',name:'Rosemary',tree:'Other',sun:['full'],soil:['sandy','rocky','loam'],need:1,size:1,purpose:['herbs'],maint:1},
   {id:'pine',name:'Aleppo pine',tree:'Pine',sun:['full','partial'],soil:['sandy','rocky','clay','loam'],need:1,size:3,purpose:['shade','ornamental'],maint:1},
   {id:'snake-plant',name:'Snake plant',tree:'Other',sun:['partial','shade'],soil:['loam','sandy'],need:1,size:1,purpose:['ornamental'],maint:1},
   {id:'mint',name:'Mint',tree:'Other',sun:['partial','shade'],soil:['loam','clay'],need:3,size:1,purpose:['herbs'],maint:2}],
  LV:{1:'Low',2:'Medium',3:'High'},
  async recommend(a){await AI.delay(800);const av={limited:1,occasional:2,regular:3}[a.water],out=[];
    AI.PLANTS.forEach(p=>{let s=0;const why=[];
      if(p.sun.includes(a.sun)){s+=3;why.push('thrives in '+a.sun+' light')}
      if(p.soil.includes(a.soil)){s+=2;why.push('tolerates '+a.soil+' soil')}
      if(p.need<=av){s+=3;why.push('fits your water availability')}
      if(p.size<=+a.size){s+=2;why.push('suits your space')}
      if(p.purpose.includes(a.purpose)){s+=3;why.push('good for '+a.purpose)}
      if(p.maint<=+a.maint){s+=2;why.push('matches your maintenance preference')}
      const pct=Math.round(s/15*100);if(pct>=40)out.push(Object.assign({pct:pct,why:why},p))});
    return out.sort((x,y)=>y.pct-x.pct).slice(0,4)},
  async carePlan(i){await AI.delay(700);const p=AI.PLANTS.find(x=>x.id===i.plant),d0=new Date(),tasks=[];
    const add=(day,type,title)=>{const d=new Date(d0);d.setDate(d.getDate()+day);tasks.push({id:'t'+tasks.length,type:type,title:title,due:d.toISOString().slice(0,10),done:false})};
    let wi={1:14,2:7,3:3}[p.need];if(i.season==='summer')wi=Math.max(2,Math.round(wi*.6));if(i.season==='winter')wi=Math.round(wi*1.6);if(i.age==='young')wi=Math.max(2,Math.round(wi*.7));if(i.water==='limited')wi=Math.round(wi*1.2);
    for(let d=1,n=0;d<=60&&n<10;d+=wi,n++)add(d,'water','Water '+p.name+(i.age==='young'?' (young plant: keep soil lightly moist)':' deeply'));
    add(14,'fertilize','Apply compost around the base');add(60,'fertilize','Apply balanced fertilizer and water in');
    add(30,'prune','Prune dead and crossing branches');
    add(0,'season',i.season[0].toUpperCase()+i.season.slice(1)+' check: '+({spring:'watch for new growth and pests',summer:'add mulch to hold moisture',autumn:'good time to plant and feed roots',winter:'protect from frost and reduce watering'}[i.season]));
    add(45,'season',i.soil==='clay'?'Check drainage (clay soil holds water)':'Check soil moisture and mulch');
    tasks.sort((a,b)=>a.due<b.due?-1:1);
    return {id:'plan-'+Date.now(),plant:p.id,plantName:p.name,inputs:i,created:new Date().toISOString(),tasks:tasks}}
};
