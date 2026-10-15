/* Shared layout, placeholder loader, toasts. Pages declare <body data-root="" data-page="home">.
   Blade later: move the nav/footer markup below into layouts/app.blade.php. */
const ROOT=document.body.dataset.root||'',PAGE=document.body.dataset.page||'';
const IMG_ROOT=ROOT+'assets/images/';
const NAV=[['index.html','Home','home'],['about.html','About','about'],['services.html','Services','services'],['shop.html','Shop','shop'],['public-planting.html','Public Planting','public'],['ai/chatbot.html','AI Assistant','ai'],['contact.html','Contact','contact']];
/* Placeholder: shows icon+label; swaps in the real image only if the file exists. */
const phHTML=(src,label,icon='bi-image',ar='4/3')=>`<div class="ph" style="--ar:${ar}" data-src="${src?IMG_ROOT+src:''}" role="img" aria-label="${label}"><div><i class="bi ${icon}"></i><span>${label}</span></div></div>`;
function toast(msg){let b=document.getElementById('toasts');if(!b){b=document.createElement('div');b.id='toasts';b.setAttribute('aria-live','polite');document.body.append(b)}
  const t=document.createElement('div');t.className='toast';t.textContent=msg;b.append(t);setTimeout(()=>t.remove(),3000)}
function loadImages(scope){(scope||document).querySelectorAll('.ph[data-src]:not(.has-img)').forEach(el=>{if(!el.dataset.src)return;
  const i=new Image();i.onload=()=>{el.style.backgroundImage='url("'+el.dataset.src+'")';el.classList.add('has-img')};i.src=el.dataset.src})}
function layout(){
  const lang=Store.get('lang','en');document.documentElement.dir=lang==='ar'?'rtl':'ltr';if(!document.getElementById('site-nav'))return;
  document.getElementById('site-nav').innerHTML=`<nav class="nav"><div class="container">
   <a class="logo" href="${ROOT}index.html" aria-label="Khadra home"><i class="bi bi-flower1"></i>Khadra <span lang="ar" style="font-weight:500;color:var(--natural)">خضرا</span></a>
   <div class="links" id="links">${NAV.map(n=>`<a href="${ROOT}${n[0]}" class="${n[2]===PAGE?'active':''}">${n[1]}</a>`).join('')}</div>
   <div class="tools"><button class="icon-btn" id="lang" aria-label="Switch language" style="font:600 .85rem var(--font)">${lang==='ar'?'EN':'عربي'}</button>
   <a class="icon-btn" href="${ROOT}cart.html" aria-label="Cart"><i class="bi bi-bag"></i><span class="badge" id="cart-count">0</span></a>
   ${(Store.get('session')?`<a class="btn sm" href="${ROOT}dashboard/index.html">Dashboard</a><a class="btn sm ghost" href="${ROOT}index.html" id="out">Log out</a>`:`<a class="btn sm" href="${ROOT}login.html">Login</a><a class="btn sm ghost" href="${ROOT}register.html">Register</a>`)}
   <button class="icon-btn burger" id="burger" aria-label="Menu" aria-expanded="false"><i class="bi bi-list"></i></button></div></div></nav>`;
  document.getElementById('site-footer').innerHTML=`<footer><div class="container"><div class="fgrid">
   <div><a class="logo" href="${ROOT}index.html"><i class="bi bi-flower1"></i>Khadra</a><p style="color:#a9c7b5;margin-top:12px">Grow a Greener Future.</p></div>
   <div><h3>Explore</h3>${NAV.slice(0,4).map(n=>`<a href="${ROOT}${n[0]}">${n[1]}</a>`).join('')}</div>
   <div><h3>Services</h3>${SERVICES.slice(0,4).map(s=>`<a href="${ROOT}${s.page}">${s.title}</a>`).join('')}</div>
   <div><h3>Newsletter</h3><form id="news" style="display:flex;gap:8px"><input type="email" required placeholder="Your email" aria-label="Email" style="flex:1"><button class="btn sm light">Join</button></form></div>
  </div><div class="copy">© 2026 Khadra. Frontend demo with sample content.</div></div></footer>`;
  document.getElementById('burger').onclick=e=>{const o=document.getElementById('links').classList.toggle('open');e.currentTarget.setAttribute('aria-expanded',o)};
  document.getElementById('lang').onclick=()=>{Store.set('lang',lang==='ar'?'en':'ar');location.reload()};
  document.getElementById('news').onsubmit=e=>{e.preventDefault();toast('Subscribed (demo: backend pending)');e.target.reset()};
  const o=document.getElementById('out');if(o)o.onclick=()=>Store.set('session',null);
  const upd=()=>{document.getElementById('cart-count').textContent=Cart.count()};upd();document.addEventListener('cart:change',upd);
}
function productCard(p){return `<article class="card">${phHTML(p.img,p.name,'bi-box-seam','1/1')}<div class="body"><span class="tag">${p.cat}</span><h3><a href="${ROOT}product-details.html?id=${p.id}">${p.name}</a></h3>
  <div class="price">$${p.price}</div><button class="btn sm" data-add="${p.id}" ${p.stock?'':'disabled style="opacity:.5"'}>${p.stock?'Add to cart':'Out of stock'}</button></div></article>`}
document.addEventListener('click',e=>{const b=e.target.closest('[data-add]');if(b){Cart.add(+b.dataset.add);toast('Added to cart')}});
document.addEventListener('DOMContentLoaded',()=>{layout();document.dispatchEvent(new Event('page:ready'));loadImages()});
