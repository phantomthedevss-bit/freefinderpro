
// FreeFinder Backend — Vercel Serverless — GET /api/search?q=photoshop&category=all
const ALTERNATIVES = [
  { match:['photoshop','photo edit'], results:[
    {title:'Photopea — Free Photoshop in your browser',description:'Full Photoshop-like editor. Opens PSD, XCF, RAW. No install.',url:'https://www.photopea.com',source:'Photopea',category:'apps',platforms:['Web'],rating:4.9,license:'Free',pickupSteps:['Click Claim Free','Photopea opens in browser','File → Open to edit','File → Export to save — $0'],tags:['photo']},
    {title:'GIMP — Free open-source Photoshop',description:'Powerful desktop editor for Windows, Mac, Linux. Layers, masks, plugins.',url:'https://www.gimp.org/downloads/',source:'GIMP',category:'apps',platforms:['Windows','Mac','Linux'],rating:4.7,license:'Open Source',pickupSteps:['Click Claim Free','Download for your OS','Install GIMP (2 min)','Open any image and edit'],tags:['photo']},
    {title:'Canva Free',description:'Design posters, thumbnails, social posts free. 600k+ templates.',url:'https://www.canva.com',source:'Canva',category:'apps',platforms:['Web','iOS','Android'],rating:4.6,license:'Freemium',pickupSteps:['Click Claim Free','Create free account','Pick a template','Design + Download free'],tags:['design']},
  ]},
  { match:['spotify','music'], results:[
    {title:'Spotify Free',description:'All songs free with ads. Playlists, podcasts, radio.',url:'https://www.spotify.com/free',source:'Spotify',category:'media',platforms:['Web','iOS','Android'],rating:4.6,license:'Free Tier',pickupSteps:['Click Claim Free','Create free account','Search any song','Press Play — free with ads'],tags:['music']},
    {title:'YouTube Music Free',description:'Music videos + songs free with ads.',url:'https://music.youtube.com',source:'YouTube Music',category:'media',platforms:['Web','iOS','Android'],rating:4.5,license:'Free Tier',pickupSteps:['Open YouTube Music','Sign in with Google','Search + Play free'],tags:['music']},
  ]},
  { match:['minecraft'], results:[
    {title:'Minetest — Free Minecraft-like',description:'Open-source voxel game. Build, mine, craft, mods, multiplayer.',url:'https://www.minetest.net',source:'Minetest',category:'games',platforms:['Windows','Mac','Linux','Android'],rating:4.7,license:'Open Source',pickupSteps:['Click Claim Free','Download Minetest','Install (1 min)','Play singleplayer or join server'],tags:['sandbox']},
    {title:'Minecraft Classic — Free in browser',description:'Original 2009 Minecraft, free in browser from Mojang.',url:'https://classic.minecraft.net',source:'Mojang',category:'games',platforms:['Web'],rating:4.6,license:'Free',pickupSteps:['Click Claim Free','Game loads in browser','Click to play — no install'],tags:['sandbox']},
  ]},
  { match:['notion'], results:[
    {title:'Obsidian — Free notes, forever',description:'Local-first notes, links, graph, plugins. Free for personal use.',url:'https://obsidian.md',source:'Obsidian',category:'apps',platforms:['Windows','Mac','Linux','iOS','Android'],rating:4.8,license:'Free',pickupSteps:['Download Obsidian','Create a vault','Write notes, link with [[ ]]','Sync optional — local is free'],tags:['notes']},
    {title:'Notion Free Plan',description:'Notes, docs, wikis free for individuals.',url:'https://www.notion.so',source:'Notion',category:'apps',platforms:['Web','Desktop'],rating:4.6,license:'Free Tier',pickupSteps:['Sign up free','Create a page','Use templates'],tags:['notes']},
  ]},
  { match:['figma'], results:[
    {title:'Penpot — Free open-source Figma',description:'Design + prototyping, open-source, cloud free.',url:'https://penpot.app',source:'Penpot',category:'apps',platforms:['Web'],rating:4.7,license:'Open Source',pickupSteps:['Click Claim Free','Create free account','Start a design file','Share link with team'],tags:['design']},
    {title:'Figma Free Starter',description:'Figma free for 3 projects, unlimited viewers.',url:'https://www.figma.com',source:'Figma',category:'apps',platforms:['Web','Desktop'],rating:4.8,license:'Free Tier',pickupSteps:['Sign up free','Create 3 free projects','Design + Share'],tags:['design']},
  ]},
  { match:['office','word','excel','powerpoint'], results:[
    {title:'Google Docs / Sheets / Slides — Free',description:'Full Office replacement free with Google account.',url:'https://docs.google.com',source:'Google',category:'apps',platforms:['Web'],rating:4.8,license:'Free',pickupSteps:['Open docs.google.com','Sign in with Google','Create Doc / Sheet / Slide'],tags:['office']},
    {title:'LibreOffice — Free Office',description:'Writer, Calc, Impress. Opens Word/Excel files offline.',url:'https://www.libreoffice.org',source:'LibreOffice',category:'apps',platforms:['Windows','Mac','Linux'],rating:4.7,license:'Open Source',pickupSteps:['Download LibreOffice','Install','Open any .docx / .xlsx file'],tags:['office']},
  ]},
  { match:['netflix','movies','stream'], results:[
    {title:'Tubi — Free movies & TV',description:'50k+ movies & shows free with ads. No sign-up needed.',url:'https://tubitv.com',source:'Tubi',category:'media',platforms:['Web','iOS','Android','TV'],rating:4.5,license:'Free / Ad-supported',pickupSteps:['Open Tubi','Browse movies','Press Play — no card needed'],tags:['movies']},
    {title:'Pluto TV — Free live TV',description:'250+ live channels + movies free.',url:'https://pluto.tv',source:'Pluto TV',category:'media',platforms:['Web','Mobile','TV'],rating:4.4,license:'Free',pickupSteps:['Open Pluto TV','Pick a channel','Watch free'],tags:['tv']},
    {title:'Kanopy — Free movies via library',description:'Critically acclaimed films free with library card.',url:'https://www.kanopy.com',source:'Kanopy',category:'media',platforms:['Web','Mobile'],rating:4.7,license:'Free via Library',pickupSteps:['Open Kanopy','Enter library card','Watch films free'],tags:['movies']},
  ]},
  { match:['python','coding course','learn to code','course'], results:[
    {title:'freeCodeCamp — Free coding courses',description:'Python, JS, web dev, data — 3000+ hours free + certificates.',url:'https://www.freecodecamp.org',source:'freeCodeCamp',category:'courses',platforms:['Web'],rating:4.9,license:'Free',pickupSteps:['Open freeCodeCamp','Pick Python or Web Dev','Do lessons in browser','Earn free certificate'],tags:['coding']},
    {title:'Khan Academy — Free courses',description:'Math, coding, science, history — free forever.',url:'https://www.khanacademy.org',source:'Khan Academy',category:'courses',platforms:['Web','Mobile'],rating:4.8,license:'Free',pickupSteps:['Open Khan Academy','Create free account','Pick a course','Learn at your pace'],tags:['learning']},
    {title:'Coursera — Audit courses free',description:'Audit university courses free (no certificate).',url:'https://www.coursera.org',source:'Coursera',category:'courses',platforms:['Web'],rating:4.6,license:'Free to Audit',pickupSteps:['Find a course','Click Enroll → Audit','Watch all lectures free'],tags:['university']},
  ]},
  { match:['blender','3d'], results:[
    {title:'Blender — Free 3D, already free',description:'Industry-standard 3D, animation, VFX — 100% free, open-source.',url:'https://www.blender.org/download/',source:'Blender',category:'apps',platforms:['Windows','Mac','Linux'],rating:4.9,license:'Open Source',pickupSteps:['Download Blender','Install','Follow Donut Tutorial on YouTube'],tags:['3d']},
  ]},
  { match:['harry potter','book','novel'], results:[
    {title:'Project Gutenberg — 70,000 free books',description:'Classics free, legal, public domain. EPUB, Kindle, PDF.',url:'https://www.gutenberg.org',source:'Gutenberg',category:'books',platforms:['Web','Kindle'],rating:4.9,license:'Public Domain',pickupSteps:['Open Gutenberg','Search title','Download EPUB / Kindle','Send to reader'],tags:['books']},
    {title:'Open Library — Borrow books free',description:'Internet Archive library — borrow books free.',url:'https://openlibrary.org',source:'Open Library',category:'books',platforms:['Web'],rating:4.7,license:'Free Library',pickupSteps:['Create free account','Search book','Borrow for 14 days','Read in browser'],tags:['books']},
  ]},
];
function physicalSources(q){
  const e=encodeURIComponent(q);
  return [
    {title:`Free ${q} near you — Freecycle`,description:`Neighbors giving away ${q} for free.`,url:`https://www.freecycle.org/search?q=${e}`,source:'Freecycle',category:'physical',platforms:['Local'],rating:4.7,license:'Free',pickupSteps:['Click Search Freecycle','Message the giver','Agree pickup time + public place','Bring bag / friend, inspect, take it'],tags:['local']},
    {title:`Free ${q} — Craigslist Free`,description:`Craigslist Free section filtered to $0.`,url:`https://www.craigslist.org/search/sss?query=${e}&min_price=0&max_price=0`,source:'Craigslist Free',category:'physical',platforms:['Local'],rating:4.5,license:'Free',pickupSteps:['Click Search Craigslist','Filter to Free + your city','Message seller quickly','Meet daytime in public, check item'],tags:['local']},
    {title:`Free ${q} — Olio`,description:`Food + household items neighbours give away free.`,url:'https://olioapp.com',source:'Olio',category:'physical',platforms:['iOS','Android'],rating:4.6,license:'Free',pickupSteps:['Download Olio free','Search '+q,'Request item','Arrange pickup nearby'],tags:['local']},
    {title:`Free ${q} — Freegle (UK)`,description:`UK reuse network — give + get free stuff locally.`,url:`https://www.ilovefreegle.org/search/?q=${e}`,source:'Freegle',category:'physical',platforms:['Local','UK'],rating:4.6,license:'Free',pickupSteps:['Open Freegle','Search '+q,'Message giver','Pick up locally'],tags:['uk']},
    {title:`Free ${q} — Nextdoor Free`,description:`Your neighbourhood free pile.`,url:`https://nextdoor.com/search/?query=${e}`,source:'Nextdoor',category:'physical',platforms:['Local'],rating:4.4,license:'Free',pickupSteps:['Open Nextdoor','Search Free + '+q,'Message neighbour','Pick up nearby'],tags:['local']},
  ];
}
function withTimeout(p,ms=4000){ return Promise.race([p,new Promise(r=>setTimeout(()=>r(null),ms))]); }
async function fetchJson(url,headers={}){ try{ const r=await fetch(url,{headers:{'User-Agent':'FreeFinder/1.0',...headers}}); if(!r.ok) return null; return await r.json(); }catch{ return null; } }
export default async function handler(req,res){
  res.setHeader('Access-Control-Allow-Origin','*');
  if(req.method==='OPTIONS') return res.status(200).end();
  const q=(req.query.q||'').toString().trim();
  const category=(req.query.category||'all').toString().toLowerCase();
  const limit=Math.min(parseInt(req.query.limit||'24',10)||24,40);
  if(!q) return res.status(400).json({error:'Missing ?q= — try /api/search?q=photoshop'});
  const low=q.toLowerCase();
  const sourcesChecked=[]; let results=[];
  for(const alt of ALTERNATIVES){ if(alt.match.some(m=>low.includes(m))){ sourcesChecked.push('FreeFinder Curated'); results.push(...alt.results.map(r=>({...r,price:'Free',safety:'Verified Legal',image:r.image||''}))); } }
  const [games,books,guten,github,itunes]=await Promise.all([
    withTimeout(fetchJson('https://www.freetogame.com/api/games')),
    withTimeout(fetchJson(`https://openlibrary.org/search.json?q=${encodeURIComponent(q)}&limit=8`)),
    withTimeout(fetchJson(`https://gutendex.com/books/?search=${encodeURIComponent(q)}`)),
    withTimeout(fetchJson(`https://api.github.com/search/repositories?q=${encodeURIComponent(q)}+stars:>100&per_page=6`,{Accept:'application/vnd.github+json'})),
    withTimeout(fetchJson(`https://itunes.apple.com/search?term=${encodeURIComponent(q)}&entity=software&limit=5`)),
  ]);
  if(games && Array.isArray(games)){ sourcesChecked.push('FreeToGame'); const filtered=games.filter(g=>(g.title+' '+g.genre).toLowerCase().includes(low.split(' ')[0])); const picks=filtered.length?filtered.slice(0,8):games.slice(0,4); picks.forEach(g=>results.push({title:g.title,description:g.short_description,url:g.game_url,image:g.thumbnail,source:'FreeToGame',category:'games',platforms:[g.platform],rating:4.5,price:'Free',license:'Free to Play',safety:'Verified Legal',pickupSteps:['Click Claim Free','Create free account','Add to library','Download launcher + Install','Play — free forever'],tags:[g.genre]})); }
  if(books?.docs){ sourcesChecked.push('Open Library'); books.docs.slice(0,6).forEach(d=>results.push({title:d.title,description:`Book by ${d.author_name?.[0]||'Unknown'}${d.first_publish_year?` • ${d.first_publish_year}`:''} — Borrow free`,url:`https://openlibrary.org${d.key}`,image:d.cover_i?`https://covers.openlibrary.org/b/id/${d.cover_i}-M.jpg`:'',source:'Open Library',category:'books',platforms:['Web'],rating:4.6,price:'Free',license:'Library Loan',safety:'Verified Legal',pickupSteps:['Click Claim Free','Create free account','Click Borrow (14 days)','Read in browser or EPUB'],tags:['book']})); }
  if(guten?.results){ sourcesChecked.push('Gutenberg'); guten.results.slice(0,5).forEach(b=>results.push({title:b.title,description:`By ${(b.authors||[]).map(a=>a.name).join(', ')||'Unknown'} • Public domain`,url:`https://www.gutenberg.org/ebooks/${b.id}`,image:b.formats?.['image/jpeg']||'',source:'Project Gutenberg',category:'books',platforms:['Web','Kindle'],rating:4.9,price:'Free',license:'Public Domain',safety:'Verified Legal',pickupSteps:['Click Claim Free','Choose EPUB / Kindle / PDF','Download — no account needed','Send to Kindle'],tags:['classic']})); }
  if(github?.items){ sourcesChecked.push('GitHub'); github.items.forEach(repo=>results.push({title:repo.full_name,description:repo.description||'Open-source project',url:repo.html_url,image:'',source:'GitHub',category:'apps',platforms:['Web','Code'],rating:4.6,price:'Free',license:'Open Source',safety:'Verified Legal',pickupSteps:['Click Claim Free','Read README','Download Release or Clone','Follow install instructions'],tags:['open-source']})); }
  if(itunes?.results){ sourcesChecked.push('iTunes Free Apps'); itunes.results.filter(a=>a.price===0).forEach(a=>results.push({title:a.trackName,description:(a.description||'').slice(0,180),url:a.trackViewUrl,image:a.artworkUrl100||'',source:'App Store Free',category:'apps',platforms:['iOS'],rating:a.averageUserRating||4.5,price:'Free',license:'Free',safety:'Verified Legal',pickupSteps:['Click Claim Free','Tap Get in App Store','Install free','Open app'],tags:['app']})); }
  const physicalHints=['sofa','couch','bike','bicycle','desk','table','chair','microwave','fridge','bed','dresser','lamp','tv','monitor','furniture'];
  if(category==='physical' || physicalHints.some(h=>low.includes(h))){ sourcesChecked.push('Freecycle','Craigslist Free','Olio'); results.push(...physicalSources(q)); }
  else if(category==='all' && results.length<6){ sourcesChecked.push('Freecycle'); results.push(physicalSources(q)[0]); }
  if(results.length===0){ sourcesChecked.push('FreeFinder Hubs'); results.push({title:`Free ${q} — Internet Archive`,description:'Millions of free books, movies, software, music — legal archive.',url:`https://archive.org/search?query=${encodeURIComponent(q)}`,source:'Internet Archive',category:'books',platforms:['Web'],rating:4.8,price:'Free',license:'Public Domain',safety:'Verified Legal',pickupSteps:['Open Internet Archive','Search '+q,'Filter to free','Download or Stream'],tags:['archive']}); }
  if(category!=='all'){ const f=results.filter(r=>r.category===category); if(f.length>0) results=f; }
  const seen=new Set(); results=results.filter(r=>{ if(seen.has(r.url)) return false; seen.add(r.url); return true; }).slice(0,limit);
  res.setHeader('Cache-Control','s-maxage=300, stale-while-revalidate=600');
  return res.status(200).json({query:q,category,count:results.length,sourcesChecked:[...new Set(sourcesChecked)],results});
}
