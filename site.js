function esc(s=''){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
const SUPA_URL='https://kfpdzqwtninhdkwtjruc.supabase.co',SUPA_KEY='sb_publishable_a-kAHWFg9Kv3GFVGvxIjTg_c6QlqZbB';
let currentLang=localStorage.getItem('gypsy-lang')||'sr';
let allPosts=[];
let commentCounts={};
function setLang(lang){currentLang=lang;localStorage.setItem('gypsy-lang',lang);document.documentElement.lang=lang;document.querySelectorAll('[data-sr][data-en]').forEach(el=>{el.textContent=el.dataset[lang]||el.dataset.sr});document.querySelectorAll('.lang-switch button').forEach(b=>b.classList.toggle('active',b.dataset.lang===lang));document.title=lang==='en'?'Gypsy 28 Catamaran — Build Journal':'Gypsy 28 Катамаран — Дневник изградње';renderPosts();}
document.querySelectorAll('.lang-switch button').forEach(b=>b.addEventListener('click',()=>setLang(b.dataset.lang)));
function collage(p,url,title){const imgs=[p.image,...(Array.isArray(p.gallery)?p.gallery:[])].filter(Boolean).filter((v,i,a)=>a.indexOf(v)===i);if(!imgs.length)return '';const shown=imgs.slice(0,3);const cls=`post-collage count-${shown.length}`;return `<a class="${cls}" href="${url}" aria-label="${esc(title)}">${shown.map((src,i)=>`<span class="collage-photo"><img src="${esc(src)}" alt="${esc(title)}" loading="lazy">${i===2&&imgs.length>3?`<b class="more-photos">+${imgs.length-3}</b>`:''}</span>`).join('')}</a>`;}
function renderPosts(){const box=document.getElementById('posts');if(!box||!allPosts.length)return;box.innerHTML=allPosts.map(p=>{const en=currentLang==='en',title=en?(p.title_en||p.title):p.title,summary=en?(p.summary_en||p.summary):p.summary,url=`/post.html?post=${encodeURIComponent(p.slug)}`,n=commentCounts[p.slug]||0,comments=n?` <span class="comment-count">· ${en?'Comments':'Коментари'} (${n})</span>`:'';return `<article class="card post-card">${collage(p,url,title)}<span>${en?'JOURNAL':'DNEVNIK'}</span><h3><a href="${url}">${esc(title)}</a></h3><p>${esc(summary||'')}</p><div class="post-links"><a class="read-more" href="${url}">${en?'Read more →':'Прочитај више →'}</a>${comments}</div></article>`}).join('');}
async function loadCommentCounts(){try{const r=await fetch(SUPA_URL+'/rest/v1/comments?approved=eq.true&select=post_slug',{headers:{apikey:SUPA_KEY,Authorization:'Bearer '+SUPA_KEY},cache:'no-store'});if(!r.ok)return;const rows=await r.json();commentCounts=rows.reduce((a,c)=>{if(c.post_slug)a[c.post_slug]=(a[c.post_slug]||0)+1;return a},{});renderPosts()}catch(e){console.error(e)}}
async function loadPosts(){const box=document.getElementById('posts');if(!box)return;try{const r=await fetch('/content/posts/index.json',{cache:'no-store'});if(!r.ok)return;allPosts=await r.json();renderPosts();loadCommentCounts();}catch(e){console.error(e)}}
setLang(currentLang);loadPosts();

// OneSignal Web Push — loaded dynamically so the existing HTML remains untouched.
window.OneSignalDeferred=window.OneSignalDeferred||[];
const oneSignalScript=document.createElement('script');
oneSignalScript.src='https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js';
oneSignalScript.defer=true;
document.head.appendChild(oneSignalScript);
window.OneSignalDeferred.push(async function(OneSignal){
  await OneSignal.init({appId:'5eacf8d9-60db-4f36-aaad-fa68997c5094'});
});