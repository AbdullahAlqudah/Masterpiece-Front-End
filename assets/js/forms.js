/* Form engine: renders a config into a validated form. Submissions go to Store now; POST to Laravel later. */
const Forms={
  esc:s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])),
  field(f){const n=f[0],l=f[1],t=f[2]||'text',o=f[3]||{},id='f-'+n,req=o.opt?'':' required';let c;
    if(t==='textarea')c=`<textarea id="${id}" name="${n}"${req}></textarea>`;
    else if(t==='select')c=`<select id="${id}" name="${n}"${req}><option value="">Select…</option>${o.options.map(x=>`<option value="${x[0]}">${x[1]}</option>`).join('')}</select>`;
    else if(t==='file')c=`<input id="${id}" name="${n}" type="file" accept="image/*" data-preview><div id="pv-${n}"></div>`;
    else if(t==='password')c=`<div class="eye-wrap"><input id="${id}" name="${n}" type="password"${req}><button type="button" class="icon-btn eye" data-eye="${id}" aria-label="Show password"><i class="bi bi-eye"></i></button></div>`;
    else c=`<input id="${id}" name="${n}" type="${t}"${req}${o.min!=null?` min="${o.min}"`:''}${o.value!=null?` value="${o.value}"`:''}>`;
    return `<div class="fld ${o.full?'full':''}"><label for="${id}">${l}${o.opt?' (optional)':''}</label>${c}<div class="err" id="e-${n}" role="alert"></div></div>`},
  data(form){const d={};new FormData(form).forEach((v,k)=>{d[k]=v instanceof File?v.name:v});return d},
  validate(form){let ok=true;form.querySelectorAll('input,select,textarea').forEach(el=>{
    const e=document.getElementById('e-'+el.name);if(!e)return;let m='';const v=el.value.trim();
    if(el.required&&!v)m='This field is required.';
    else if(el.type==='email'&&v&&!/^\S+@\S+\.\S+$/.test(v))m='Enter a valid email address.';
    else if(el.type==='password'&&el.name==='password'&&v&&v.length<8&&form.dataset.rules==='strong')m='Use at least 8 characters.';
    else if(el.name==='confirm'&&v!==form.elements.password.value)m='Passwords do not match.';
    else if(el.type==='number'&&v&&+v<+(el.min||0))m='Value must be at least '+el.min+'.';
    e.textContent=m;el.setAttribute('aria-invalid',!!m);if(m)ok=false});
    if(!ok){const b=form.querySelector('[aria-invalid=true]');b&&b.focus()}return ok},
  render(cfg,root){
    const form=document.createElement('form');form.noValidate=true;form.className='card form';form.dataset.rules=cfg.rules||'';
    form.innerHTML=`<div class="body"><div class="fgrid2">${cfg.fields.map(Forms.field).join('')}</div><button class="btn" style="align-self:flex-start">${cfg.submit}</button></div>`;
    root.innerHTML=(cfg.title?`<div class="head"><h2>${cfg.title}</h2><p class="lead">${cfg.lead||''}</p></div>`:'')+(cfg.top||'')+`<div class="${cfg.side?'split top':'narrow'}" id="w"></div>`;
    const w=root.querySelector('#w');w.append(form);
    new URLSearchParams(location.search).forEach((v,k)=>{if(form.elements[k])form.elements[k].value=v});
    if(cfg.side){const s=document.createElement('div');w.append(s);const u=()=>{s.innerHTML=cfg.side(Forms.data(form))};form.addEventListener('input',u);u();form.addEventListener('submit',()=>setTimeout(u,0))}
    form.addEventListener('click',e=>{const b=e.target.closest('[data-eye]');if(b){const i=document.getElementById(b.dataset.eye);i.type=i.type==='password'?'text':'password'}});
    form.addEventListener('change',e=>{if(e.target.dataset.preview){const f=e.target.files[0],p=document.getElementById('pv-'+e.target.name);p.innerHTML=f?`<img class="pv" alt="Selected image preview" src="${URL.createObjectURL(f)}">`:''}});
    form.addEventListener('submit',e=>{e.preventDefault();if(!Forms.validate(form))return;const d=Forms.data(form);delete d.password;delete d.confirm;
      if(cfg.key){const all=Store.get('sub:'+cfg.key,[]);all.push(Object.assign({id:Date.now(),status:'pending',created:new Date().toISOString()},d));Store.set('sub:'+cfg.key,all)}
      toast(cfg.success+' (demo: saved locally, backend pending)');if(cfg.done)cfg.done(d);else form.reset()})}
};
