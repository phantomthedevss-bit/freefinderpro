
let currentCat='all';
let currentResults=[];
let saved=JSON.parse(localStorage.getItem('ff_saved')||'[]');
let recent=JSON.parse(localStorage.getItem('ff_recent')||'[]');

const $=s=>document.querySelector(s);
const $$=s=>document.querySelectorAll(s);
function updateSavedCount(){ $('#savedCount').textContent=saved.length; }
updateSavedCount();

const EXAMPLES=[
 {q:'Photoshop',label:'Photoshop → Photopea, GIMP, Canva Free',desc:'Edit photos free in browser'},
 {q:'Minecraft',label:'Minecraft → Minetest, Classic',desc:'Build & survive free'},
 {q:'Spotify',label:'Spotify → Spotify Free',desc:'Music free with ads'},
 {q:'Notion',label:'Notion → Obsidian, Anytype',desc:'Notes free forever'},
 {q:'Elden Ring',label:'Elden Ring → Free soulslikes',desc:'Hard games that are free'},
 {q:'Python course',label:'Python course → Free courses',desc:'Learn Python $0'},
 {q:'sofa',label:'Sofa → Freecycle near you',desc:'Real free furniture'},
 {q:'Figma',label:'Figma → Penpot, Figma Free',desc:'Design free'},
];
function renderExamples(){
  $('#exampleGrid').innerHTML=EXAMPLES.map(e=>`<div class="example-card" onclick="quickSearch('${e.q}')"><b>${e.label}</b><span>${e.desc}</span><br><span style="color:#c6ff3e">Search this →</span></div>`).join('');
}
renderExamples();

function renderPhysical(){
  const q=encodeURIComponent($('#q').value||'sofa');
  const sites=[
    {n:'Freecycle',d:'Neighbors giving away stuff free',u:`https://www.freecycle.org/search?q=${q}`},
    {n:'Craigslist Free',d:'Free section, filter by $0',u:`https://www.craigslist.org/search/sss?query=${q}&min_price=0&max_price=0`},
    {n:'Olio',d:'Food + household freebies',u:`https://olioapp.com`},
    {n:'Freegle',d:'UK reuse network',u:`https://www.ilovefreegle.org/search/?q=${q}`},
    {n:'Nextdoor Free',d:'Local neighbors, free pile',u:`https://nextdoor.com/search/?query=${q}`},
  ];
  $('#physicalCards').innerHTML=sites.map(s=>`<div class="p-card"><div><b>${s.n}</b><span>${s.d}</span></div><a href="${s.u}" target="_blank" rel="noopener">Search →</a></div>`).join('');
}
renderPhysical();

$$('#cats button').forEach(b=>b.onclick=()=>{
  $$('#cats button').forEach(x=>x.classList.remove('active')); b.classList.add('active');
  currentCat=b.dataset.cat;
  if($('#q').value.trim()) doSearch();
});
$$('[data-trend]').forEach(b=>b.onclick=()=>quickSearch(b.dataset.trend));
function quickSearch(q){ $('#q').value=q; doSearch(); }
window.quickSearch=quickSearch;

$('#surpriseBtn').onclick=()=>{
  const picks=['Photoshop','Minecraft','Python course','sofa','Spotify','Harry Potter','Figma','Elden Ring','bike','Notion','Guitar lessons','Blender'];
  quickSearch(picks[Math.floor(Math.random()*picks.length)]);
};
$('#nearMeBtn').onclick=()=>quickSearch('sofa');
$('#q').addEventListener('input',()=>renderPhysical());

$('#searchForm').addEventListener('submit',e=>{e.preventDefault(); doSearch();});
$('#onlyFree').onchange=()=>renderResults();
$('#noSignup').onchange=()=>renderResults();
$('#sortSel').onchange=()=>renderResults();

const FUN=['Hunting for freebies...','Checking 20+ sources...','Dodging paywalls...','Finding the legal loophole (free tier)...','Asking the internet nicely...'];
let funIdx=0;

async function doSearch(){
  const q=$('#q').value.trim();
  if(!q){ toast('Type something first — try "Photoshop"'); return; }
  renderPhysical();
  $('#resultsWrap').style.display='block';
  $('#resultsTitle').textContent=`Free options for "${q}"`;
  $('#loading').style.display='block';
  $('#results').innerHTML=''; $('#empty').style.display='none';
  $('#loadingFun').textContent=FUN[funIdx++ % FUN.length];
  $('#resultsMeta').textContent='Checking sources...';
  document.getElementById('resultsWrap').scrollIntoView({behavior:'smooth'});

  // Save recent
  recent=[q,...recent.filter(x=>x!==q)].slice(0,6);
  localStorage.setItem('ff_recent',JSON.stringify(recent));

  try{
    const url=`/api/search?q=${encodeURIComponent(q)}&category=${currentCat}`;
    const res=await fetch(url);
    if(!res.ok) throw new Error('backend offline');
    const data=await res.json();
    currentResults=data.results||[];
    $('#resultsMeta').textContent=`${data.count} free options • Checked: ${(data.sourcesChecked||[]).join(', ')} • Category: ${currentCat}`;
    renderResults();
    if(currentResults.length>0){ toast(`Found ${currentResults.length} free options for "${q}"! 🎉`); confettiBurst(); }
  }catch(err){
    console.warn('Backend failed, using client fallback',err);
    $('#resultsMeta').textContent='Backend offline — using direct public APIs + curated alternatives';
    currentResults=await clientFallback(q);
    renderResults();
    if(currentResults.length>0) toast(`Found ${currentResults.length} free options (offline mode)`);
  }finally{
    $('#loading').style.display='none';
  }
}

async function clientFallback(q){
  const out=[];
  const low=q.toLowerCase();
  // Curated alternatives fallback (mirrors backend)
  const map={
    photoshop:[{title:'Photopea — Free Photoshop in browser',url:'https://www.photopea.com',desc:'Full Photoshop-like editor, free, no install. Open PSD, XCF, RAW.',source:'Photopea',category:'apps'}],
    spotify:[{title:'Spotify Free',url:'https://www.spotify.com/free',desc:'Free music with ads, all songs.',source:'Spotify',category:'media'}],
    minecraft:[{title:'Minetest — Free Minecraft-like',url:'https://www.minetest.net',desc:'Open-source voxel game, mods, multiplayer.',source:'Minetest',category:'games'}],
  };
  for(const k in map){ if(low.includes(k)) out.push(...map[k].map(x=>({...x,price:'Free',platforms:['Web'],rating:4.8,pickupSteps:['Click Claim Free','Open in browser','No install needed for Photopea','Start creating'],safety:'Verified Legal'}))); }
  try{
    const r=await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(q)}&limit=5`);
    const j=await r.json();
    (j.docs||[]).forEach(d=>out.push({title:d.title,description:`Book by ${d.author_name?.[0]||'Unknown'} — ${d.first_publish_year||''} • Free via Open Library`,url:`https://openlibrary.org${d.key}`,image:d.cover_i?`https://covers.openlibrary.org/b/id/${d.cover_i}-M.jpg`:'',source:'Open Library',category:'books',platforms:['Web'],price:'Free',rating:4.6,pickupSteps:['Click Claim Free','Choose Borrow or Read','Read in browser or EPUB','No piracy — library loan'],safety:'Verified Legal'}));
  }catch(e){}
  try{
    const r=await fetch(`https://www.freetogame.com/api/games`);
    const j=await r.json();
    j.filter(g=>(g.title+' '+g.genre).toLowerCase().includes(low.split(' ')[0])).slice(0,6).forEach(g=>out.push({title:g.title,description:g.short_description,url:g.game_url,image:g.thumbnail,source:'FreeToGame',category:'games',platforms:[g.platform],price:'Free',rating:4.5,pickupSteps:['Click Claim Free','Create free account','Add to library','Download & play'],safety:'Verified Legal'}));
  }catch(e){}
  // Physical fallback
  out.push({title:`Free ${q} near you — Freecycle`,description:`Search Freecycle for free ${q} from neighbors.`,url:`https://www.freecycle.org/search?q=${encodeURIComponent(q)}`,source:'Freecycle',category:'physical',platforms:['Local'],price:'Free',rating:4.7,pickupSteps:['Click Search Freecycle','Message the giver','Agree pickup time + place','Meet in public, inspect, take it'],safety:'Verified Legal'});
  return out;
}

function renderResults(){
  let list=[...currentResults];
  if($('#onlyFree').checked) list=list.filter(r=>!r.price||r.price==='Free');
  if($('#noSignup').checked) list=list.filter(r=>!(r.pickupSteps||[]).join(' ').toLowerCase().includes('account'));
  if($('#sortSel').value==='rating') list.sort((a,b)=>(b.rating||0)-(a.rating||0));
  if($('#sortSel').value==='az') list.sort((a,b)=>a.title.localeCompare(b.title));
  if(list.length===0){ $('#empty').style.display='block'; $('#results').innerHTML=''; return; }
  $('#empty').style.display='none';
  $('#results').innerHTML=list.map((r,i)=>{
    const idx=currentResults.indexOf(r);
    const letter=r.title?.[0]?.toUpperCase()||'F';
    const isSaved=saved.some(s=>s.url===r.url);
    const img=r.image?`<img src="${r.image}" onerror="this.remove()" alt="">`:`<span>${letter}</span>`;
    const steps=(r.pickupSteps||[]).slice(0,3).map((s,j)=>`${j+1}. ${s}`).join('<br>');
    return `<article class="card">
      <div class="card-img">${img}<span class="free-badge">FREE • ${r.price||'Free'}</span><span class="source-badge">${r.source||'Free'}</span></div>
      <div class="card-body">
        <h3>${escapeHtml(r.title)}</h3>
        <p>${escapeHtml(r.description||'Free version — click Claim to get it.')}</p>
        <div class="tags">${(r.platforms||['Web']).map(p=>`<span>${p}</span>`).join('')}<span>⭐ ${r.rating||4.6}</span><span>✓ ${r.safety||'Verified Legal'}</span></div>
        <div class="pickup"><b>How to pick it up:</b><br>${steps}${(r.pickupSteps||[]).length>3?'<br><i>+ more steps inside</i>':''}</div>
        <div class="card-actions">
          <button class="btn-primary" onclick="window.open('${r.url}','_blank')">Claim Free →</button>
          <button class="btn-secondary" onclick="openPickup(${idx})">Steps</button>
          <button class="btn-secondary" onclick="toggleSave(${idx})">${isSaved?'♥ Saved':'♡ Save'}</button>
        </div>
      </div>
    </article>`;
  }).join('');
}

function escapeHtml(s){ return String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

window.openPickup=(idx)=>{
  const r=currentResults[idx]; if(!r) return;
  const steps=(r.pickupSteps||['Click Claim Free','Follow the link','Enjoy — it is free']).map((s,i)=>`<li><b>Step ${i+1}:</b> ${escapeHtml(s)}</li>`).join('');
  $('#modalContent').innerHTML=`
    <span style="background:#c6ff3e;color:#000;padding:6px 10px;border-radius:999px;font-weight:800;font-size:12px">FREE • ${escapeHtml(r.source||'Free')}</span>
    <h2 style="margin:12px 0 6px">${escapeHtml(r.title)}</h2>
    <p style="color:#a1a1b3;line-height:1.6">${escapeHtml(r.description||'')}</p>
    <p><b>⏱ Time needed:</b> 2–5 minutes &nbsp; <b>💳 Cost:</b> $0 &nbsp; <b>🛡 Safety:</b> ${escapeHtml(r.safety||'Verified Legal')}</p>
    <h3>How to pick it up — exact steps</h3>
    <ol style="line-height:1.9">${steps}</ol>
    <h3>What you need</h3>
    <ul style="line-height:1.9"><li>Email (for most free accounts)</li><li>Browser or app for this platform: ${(r.platforms||['Web']).join(', ')}</li><li>For physical items: a bag, a friend, daytime meetup</li></ul>
    <h3>⚠️ Watch out</h3>
    <p style="color:#a1a1b3;line-height:1.6">Never pay a “fee” to unlock a free item. Never download a “crack” or keygen — those are malware. If a site asks for card details for a $0 item, leave. The real free link is the Claim button.</p>
    <div style="display:flex;gap:8px;margin-top:14px"><button class="btn-primary" onclick="window.open('${r.url}','_blank')">Claim Free →</button><button class="ghost" onclick="copySteps(${idx})">Copy Steps</button></div>
  `;
  $('#modal').style.display='grid';
};
window.copySteps=(idx)=>{
  const r=currentResults[idx];
  const txt=`${r.title}\n${r.url}\n\nHow to pick it up:\n${(r.pickupSteps||[]).map((s,i)=>`${i+1}. ${s}`).join('\n')}`;
  navigator.clipboard.writeText(txt).then(()=>toast('Steps copied!'));
};
$('#closeModal').onclick=()=>$('#modal').style.display='none';
$('#modal').onclick=e=>{ if(e.target.id==='modal') $('#modal').style.display='none'; };

window.toggleSave=(idx)=>{
  const r=currentResults[idx]; if(!r) return;
  const found=saved.findIndex(s=>s.url===r.url);
  if(found>=0){ saved.splice(found,1); toast('Removed from saved'); }
  else{ saved.push(r); toast('Saved! Find it in ♥ Saved'); }
  localStorage.setItem('ff_saved',JSON.stringify(saved));
  updateSavedCount(); renderResults();
};

$('#savedBtn').onclick=()=>{
  $('#savedDrawer').style.display='flex';
  $('#savedList').innerHTML=saved.length? saved.map((s,i)=>`<div class="saved-item"><b>${escapeHtml(s.title)}</b><span>${escapeHtml(s.source)} • ${escapeHtml(s.description||'').slice(0,90)}</span><br><a href="${s.url}" target="_blank" style="color:#c6ff3e;font-weight:700">Claim Free →</a> <button class="ghost" style="padding:6px 10px;margin-top:6px" onclick="removeSaved(${i})">Remove</button></div>`).join('') : '<p style="color:#a1a1b3">No saved items yet. Search and tap ♡ Save.</p>';
};
window.removeSaved=(i)=>{ saved.splice(i,1); localStorage.setItem('ff_saved',JSON.stringify(saved)); updateSavedCount(); $('#savedBtn').click(); };
$('#closeSaved').onclick=()=>$('#savedDrawer').style.display='none';
$('#savedDrawer').onclick=e=>{ if(e.target.id==='savedDrawer') $('#savedDrawer').style.display='none'; };
$('#clearSaved').onclick=()=>{ saved=[]; localStorage.setItem('ff_saved','[]'); updateSavedCount(); $('#savedBtn').click(); };

function toast(msg){
  const t=$('#toast'); t.textContent=msg; t.style.display='block';
  setTimeout(()=>t.style.display='none',2600);
}
function confettiBurst(){
  const c=$('#confetti'); c.style.display='block'; c.width=innerWidth; c.height=innerHeight;
  const ctx=c.getContext('2d'); const colors=['#c6ff3e','#ff4d8d','#8b5cf6','#22d3ee','#fff'];
  const parts=Array.from({length:90},()=>({x:innerWidth/2,y:180,vx:(Math.random()-.5)*10,vy:Math.random()*-8-2,s:Math.random()*8+4,col:colors[Math.floor(Math.random()*colors.length)],r:Math.random()*Math.PI}));
  let frames=0;
  (function tick(){
    ctx.clearRect(0,0,c.width,c.height);
    parts.forEach(p=>{ p.x+=p.vx; p.y+=p.vy; p.vy+=.3; p.r+=.1; ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.r); ctx.fillStyle=p.col; ctx.fillRect(-p.s/2,-p.s/2,p.s,p.s); ctx.restore(); });
    if(++frames<70) requestAnimationFrame(tick); else c.style.display='none';
  })();
}
// Auto-demo: if URL has ?q=, search it
const params=new URLSearchParams(location.search);
if(params.get('q')){ $('#q').value=params.get('q'); doSearch(); }
