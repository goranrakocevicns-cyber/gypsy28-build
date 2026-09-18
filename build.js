const fs=require('fs');
const path=require('path');
const dir=path.join(__dirname,'content','posts');
const out=path.join(dir,'index.json');
const RAW_BASE='https://raw.githubusercontent.com/goranrakocevicns-cyber/gypsy28-build/main/';
function parseFrontMatter(text){const m=text.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/);if(!m)return null;const data={};let gallery=[];let inGallery=false;for(const line of m[1].split(/\r?\n/)){if(/^gallery:\s*$/.test(line)){inGallery=true;continue;}if(inGallery){const g=line.match(/^\s*-\s*(?:image:\s*)?["']?([^"']+?)["']?\s*$/);if(g){gallery.push(g[1].trim());continue;}if(/^\S/.test(line))inGallery=false;else continue;}const i=line.indexOf(':');if(i<0)continue;const key=line.slice(0,i).trim();let value=line.slice(i+1).trim();if((value.startsWith('"')&&value.endsWith('"'))||(value.startsWith("'")&&value.endsWith("'")))value=value.slice(1,-1);data[key]=value;}data.gallery=gallery;data.body=m[2].trim();return data;}
function clean(s=''){return s.replace(/[#>*_`\[\]]/g,'').replace(/\([^)]*\)/g,'').replace(/\s+/g,' ').trim();}
function mediaUrl(src=''){if(!src)return'';const s=String(src).trim();if(/^https?:\/\//i.test(s))return s;let p=s.replace(/^\/+/,'');if(p.startsWith('gypsy28-build/'))p=p.slice('gypsy28-build/'.length);return RAW_BASE+p;}
const posts=fs.readdirSync(dir).filter(f=>f.endsWith('.md')).map(f=>{const p=parseFrontMatter(fs.readFileSync(path.join(dir,f),'utf8'));if(!p)return null;const parts=(p.body||'').split(/\n---EN---\n/);const bodySr=(parts[0]||'').trim(),bodyEn=(parts[1]||'').trim();return {slug:path.basename(f,'.md'),title:p.title||'',title_en:p.title_en||p.title||'',date:p.date||'',category:p.category||'',category_en:p.category_en||p.category||'',image:mediaUrl(p.image||''),gallery:(p.gallery||[]).map(mediaUrl).filter(Boolean),body:bodySr,body_en:bodyEn,summary:clean(bodySr).slice(0,220),summary_en:p.summary_en||clean(bodyEn).slice(0,220)||clean(bodySr).slice(0,220)};}).filter(Boolean).sort((a,b)=>new Date(b.date)-new Date(a.date));
fs.writeFileSync(out,JSON.stringify(posts,null,2));
console.log(`Built ${posts.length} post(s).`);
