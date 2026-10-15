/* Chatbot UI. Conversations persisted in LocalStorage (-> /api/ai/conversations later). */
(function(){
const root=document.getElementById('app'),esc=Forms.esc;
const S={chats:Store.get('chats',[]),active:Store.get('chat:active'),busy:false};
const cur=()=>S.chats.find(c=>c.id===S.active);
const save=()=>{Store.set('chats',S.chats);Store.set('chat:active',S.active)};
root.innerHTML=AI.tabs('chat')+`<button class="btn sm ghost hist-toggle" id="ht"><i class="bi bi-clock-history"></i> History</button><div class="chat"><aside class="chat-side" id="side"><button class="btn sm" id="new"><i class="bi bi-plus-lg"></i> New conversation</button><div id="hist"></div></aside>
<section class="chat-main"><div id="msgs" aria-live="polite"></div><div class="chips" id="sugg"></div><form id="cf"><input id="ci" autocomplete="off" placeholder="Ask about your plants…" aria-label="Message"><button class="btn" id="send">Send</button></form></section></div><p class="muted" style="margin-top:10px">Tip: type /error to preview the error state.</p>`;
const $=id=>document.getElementById(id);
function newChat(){const c={id:Date.now(),title:'New conversation',messages:[]};S.chats.unshift(c);S.active=c.id;save();draw()}
function bubble(m,i){return m.error?`<div class="bubble bad" role="alert">${esc(m.text)}<br><button class="btn sm ghost" data-retry style="margin-top:8px">Try again</button></div>`
 :`<div class="bubble ${m.role==='user'?'user':'bot'}">${esc(m.text)}${m.link?`<br><a class="btn sm" href="${m.link[0]}">${esc(m.link[1])}</a>`:''}<small>${m.role==='bot'?'Demo response · ':''}${m.t}</small></div>`}
function draw(){const c=cur();
 $('hist').innerHTML=S.chats.length?S.chats.map(x=>`<div class="hist ${x.id===S.active?'on':''}"><button class="t" data-open="${x.id}">${esc(x.title)}</button><button class="icon-btn" data-del="${x.id}" aria-label="Delete conversation"><i class="bi bi-trash"></i></button></div>`).join(''):'<p class="muted">No conversations yet.</p>';
 $('msgs').innerHTML=c&&c.messages.length?c.messages.map(bubble).join(''):'<div class="empty"><i class="bi bi-chat-heart"></i><p>Ask Khadra a gardening question, or pick a suggestion below.</p></div>';
 $('sugg').innerHTML=AI.SUGGEST.map(q=>`<button type="button" data-q="${esc(q)}">${esc(q)}</button>`).join('');
 const m=$('msgs');m.scrollTop=m.scrollHeight}
async function ask(text){if(S.busy||!text.trim())return;if(!cur())newChat();const c=cur(),t=new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});
 if(c.title==='New conversation')c.title=text.slice(0,32);
 c.messages=c.messages.filter(m=>!m.error);c.messages.push({role:'user',text:text,t:t});save();draw();S.busy=true;$('send').disabled=true;
 $('msgs').insertAdjacentHTML('beforeend','<div class="bubble bot dots" id="typing" aria-label="Khadra is typing"><i></i><i></i><i></i></div>');$('msgs').scrollTop=1e9;
 try{const r=await AI.chat(text);c.messages.push({role:'bot',text:r.text,link:r.link,t:new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})})}
 catch(e){c.messages.push({role:'bot',error:1,text:'Something went wrong while getting an answer. Check your connection and try again.',retry:text})}
 S.busy=false;$('send').disabled=false;save();draw();$('ci').focus()}
$('cf').onsubmit=e=>{e.preventDefault();const v=$('ci').value;$('ci').value='';ask(v)};
$('new').onclick=()=>{newChat();$('side').classList.remove('open')};
$('ht').onclick=()=>$('side').classList.toggle('open');
root.addEventListener('click',e=>{const o=e.target.closest('[data-open]'),d=e.target.closest('[data-del]'),q=e.target.closest('[data-q]'),r=e.target.closest('[data-retry]');
 if(o){S.active=+o.dataset.open;save();draw();$('side').classList.remove('open')}
 if(d){S.chats=S.chats.filter(x=>x.id!==+d.dataset.del);if(S.active===+d.dataset.del)S.active=S.chats[0]?S.chats[0].id:null;save();draw();toast('Conversation deleted')}
 if(q)ask(q.dataset.q);
 if(r){const c=cur(),last=c.messages[c.messages.length-1];c.messages.pop();ask(last.retry)}});
if(!cur()&&S.chats.length)S.active=S.chats[0].id;draw();
})();
