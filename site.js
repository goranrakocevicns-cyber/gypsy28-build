function esc(s=''){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
async function loadPosts(){
  const box=document.getElementById('posts');
  try{
    const r=await fetch('/content/posts/index.json',{cache:'no-store'});
    if(!r.ok)return;
    const posts=await r.json();
    if(!posts.length)return;
    box.innerHTML=posts.map(p=>`<article class="card">${p.image?`<img src="${esc(p.image)}" alt="${esc(p.title)}" loading="lazy">`:''}<span>${esc(p.category||'DNEVNIK')}</span><h3>${esc(p.title)}</h3><p>${esc(p.summary||'')}</p></article>`).join('');
  }catch(e){console.error(e)}
}
loadPosts();
