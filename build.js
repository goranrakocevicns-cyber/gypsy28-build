const fs=require('fs');
const path=require('path');

const dir=path.join(__dirname,'content','posts');
const out=path.join(dir,'index.json');

function parseFrontMatter(text){
  const m=text.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/);
  if(!m)return null;
  const data={};
  for(const line of m[1].split(/\r?\n/)){
    const i=line.indexOf(':');
    if(i<0)continue;
    const key=line.slice(0,i).trim();
    let value=line.slice(i+1).trim();
    if((value.startsWith('"')&&value.endsWith('"'))||(value.startsWith("'")&&value.endsWith("'"))) value=value.slice(1,-1);
    data[key]=value;
  }
  data.body=m[2].trim();
  return data;
}

const posts=fs.readdirSync(dir)
  .filter(f=>f.endsWith('.md'))
  .map(f=>parseFrontMatter(fs.readFileSync(path.join(dir,f),'utf8')))
  .filter(Boolean)
  .map(p=>({
    title:p.title||'',
    date:p.date||'',
    category:p.category||'',
    image:p.image||'',
    body:p.body||'',
    summary:(p.body||'').replace(/[#>*_`\[\]]/g,'').replace(/\([^)]*\)/g,'').replace(/\s+/g,' ').trim().slice(0,220)
  }))
  .sort((a,b)=>new Date(b.date)-new Date(a.date));

fs.writeFileSync(out,JSON.stringify(posts,null,2));
console.log(`Built ${posts.length} post(s).`);
