(()=>{
  const back=document.getElementById('back');
  if(back) back.href='/gypsy28-build/#dnevnik';
  const SUPA_URL='https://kfpdzqwtninhdkwtjruc.supabase.co';
  const SUPA_KEY='sb_publishable_a-kAHWFg9Kv3GFVGvxIjTg_c6QlqZbB';
  const slug=new URLSearchParams(location.search).get('post');
  let baseline=null,busy=false;
  async function signature(){
    const parts=[];
    try{
      const r=await fetch('/content/posts/index.json?live='+Date.now(),{cache:'no-store'});
      if(r.ok) parts.push(await r.text());
    }catch(_){ }
    try{
      let q='comments?approved=eq.true&select=id,post_slug,parent_id,image_ref,author_name,body,is_author,created_at&order=created_at.asc';
      if(slug) q='comments?post_slug=eq.'+encodeURIComponent(slug)+'&approved=eq.true&select=id,post_slug,parent_id,image_ref,author_name,body,is_author,created_at&order=created_at.asc';
      const r=await fetch(SUPA_URL+'/rest/v1/'+q,{headers:{apikey:SUPA_KEY,Authorization:'Bearer '+SUPA_KEY},cache:'no-store'});
      if(r.ok) parts.push(await r.text());
    }catch(_){ }
    return parts.join('\n---LIVE---\n');
  }
  async function check(){
    if(busy||document.visibilityState!=='visible') return;
    busy=true;
    try{
      const s=await signature();
      if(baseline===null){baseline=s;return;}
      if(s!==baseline){location.reload();return;}
    }finally{busy=false;}
  }
  check();
  setInterval(check,4000);
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')check();});
  window.addEventListener('focus',check);
})();