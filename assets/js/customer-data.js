/* Customer data layer. Reads the SAME LocalStorage records the public forms write.
   Each method maps to a future endpoint (GET /api/me/requests, /trees, /orders, /donations, /subscription, /care-plans). */
const KINDS={replace:'Tree replacement',planting:'Tree planting',consultation:'Consultation',pruning:'Pruning & removal',balcony:'Balcony & indoor plants',gifts:'Tree gift'};
const Data={
  session:()=>Store.get('session'),
  today:()=>new Date().toISOString().slice(0,10),
  requests(){const o=[];Object.keys(KINDS).forEach(k=>Store.get('sub:'+k,[]).forEach(r=>o.push({key:k,kind:KINDS[k],id:r.id,status:r.status||'pending',created:r.created||'',date:r.date||'',summary:r.location||r.tree||r.type||r.recipient||r.space||'',raw:r})));return o.sort((a,b)=>a.created<b.created?1:-1)},
  setStatus(key,id,st){const a=Store.get('sub:'+key,[]),r=a.find(x=>String(x.id)===String(id));if(r){r.status=st;Store.set('sub:'+key,a)}},
  appointments(){return Data.requests().filter(r=>r.date)},
  /* A tree = a planting/replacement request that is not cancelled. Completed = planted (simulated until the provider dashboard exists). */
  trees(){return Data.requests().filter(r=>(r.key==='planting'||r.key==='replace')&&r.status!=='cancelled').map(r=>({id:r.id,key:r.key,species:(r.key==='replace'?r.raw.replacement:r.raw.tree)||'Tree',location:r.raw.location||'',date:r.date,created:r.created,status:r.status,health:r.status==='completed'?'Healthy':'Awaiting planting',req:r}))},
  plantFor:sp=>(typeof AI!=='undefined'?AI.PLANTS:[]).find(p=>sp!=='Other'&&(p.tree===sp||p.name.indexOf(sp)===0)),
  planFor(sp){const p=Data.plantFor(sp);return p?Data.plans().find(x=>x.plant===p.id):null},
  treeEvents(t){const e=[{d:t.created.slice(0,10),x:'Request submitted'}];if(t.date)e.push({d:t.date,x:'Planting scheduled'});if(t.status==='completed')e.push({d:t.date||t.created.slice(0,10),x:'Planting completed'});
    Data.requests().filter(r=>r.key==='pruning'&&r.raw.tree===t.species).forEach(r=>e.push({d:(r.date||r.created.slice(0,10)),x:'Maintenance: '+(r.raw.service||'Pruning')+' ('+r.status+')'}));
    const pl=Data.planFor(t.species);if(pl)pl.tasks.filter(k=>k.done).forEach(k=>e.push({d:k.due,x:'Care task done: '+k.title}));return e.sort((a,b)=>a.d<b.d?-1:1)},
  orders:()=>Store.get('sub:orders',[]).slice().reverse(),
  orderNo:o=>'KH-'+String(o.id).slice(-6),
  finalizeOrder(items,total){const a=Store.get('sub:orders',[]),l=a[a.length-1];if(l){l.items=items;l.total=total;l.status='processing';Store.set('sub:orders',a)}},
  setOrderStatus(id,st){const a=Store.get('sub:orders',[]),o=a.find(x=>String(x.id)===String(id));if(o){o.status=st;Store.set('sub:orders',a)}},
  donations:()=>Store.get('sub:donations',[]).slice().reverse().map(d=>Object.assign({amount:(+d.trees||0)*5,cert:'KHC-'+String(d.id).slice(-6)},d)),
  subscription:()=>Store.get('subscription'),
  subHistory:()=>Store.get('subhistory',[]).slice().reverse(),
  subscribe(name){const p=PLANS.find(x=>x[0]===name),n=new Date(),r=new Date(n);r.setDate(r.getDate()+30);const h=Store.get('subhistory',[]);h.forEach(x=>{if(x.status==='active')x.status='replaced'});
    const e={id:Date.now(),plan:name,price:p[1],started:n.toISOString().slice(0,10),renewal:r.toISOString().slice(0,10),status:'active'};h.push(e);Store.set('subhistory',h);Store.set('subscription',e)},
  cancelSub(){const h=Store.get('subhistory',[]);h.forEach(x=>{if(x.status==='active')x.status='cancelled'});Store.set('subhistory',h);Store.set('subscription',null)},
  plans:()=>Store.get('careplans',[]),
  savePlans:a=>Store.set('careplans',a),
  openTasks(){const o=[];Data.plans().forEach(p=>p.tasks.forEach(t=>{if(!t.done)o.push(Object.assign({plan:p.plantName},t))}));return o.sort((a,b)=>a.due<b.due?-1:1)},
  profile(){const s=Data.session()||{};return Object.assign({name:s.name||'',email:s.email||'',phone:'',addresses:[],notify:{email:true,sms:false,reminders:true,offers:false}},Store.get('profile',{}))},
  saveProfile:p=>Store.set('profile',p),
  activity(){const a=[];Data.requests().forEach(r=>a.push({at:r.created,i:'bi-clipboard-check',x:'Requested '+r.kind.toLowerCase()}));
    Store.get('sub:orders',[]).forEach(o=>a.push({at:o.created,i:'bi-bag',x:'Placed order '+Data.orderNo(o)}));
    Data.donations().forEach(d=>a.push({at:d.created,i:'bi-heart',x:'Donated '+d.trees+' trees'}));
    Data.plans().forEach(p=>a.push({at:p.created,i:'bi-journal-check',x:'Saved care plan for '+p.plantName}));
    Data.subHistory().forEach(h=>a.push({at:h.started+'T00:00',i:'bi-award',x:h.plan+' plan '+h.status}));
    return a.filter(x=>x.at).sort((x,y)=>x.at<y.at?1:-1)}
};
