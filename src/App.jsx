import { useState, useCallback, useRef, useEffect } from "react";

// ─── DATA ────────────────────────────────────────────────────────────────────
function mkStickers(prefix, start, end) {
  const arr = [];
  for (let i = start; i <= end; i++) {
    const n = prefix === "FWC" && i < 10 ? "0" + i : String(i);
    arr.push({ id: `${prefix}-${n}`, label: `${prefix} ${n}` });
  }
  return arr;
}

const GROUPS = [
  { id:"special", name:"Especiais", teams:[
    { id:"FWC", name:"FIFA World Cup", code:"FWC", flag:"🏆", stickers:mkStickers("FWC",0,19) },
    { id:"CC",  name:"Coca-Cola",      code:"CC",  flag:"🥤", stickers:mkStickers("CC",1,14)  },
  ]},
  { id:"A", name:"Grupo A", teams:[
    { id:"MEX", name:"México",        code:"MEX", flag:"🇲🇽", stickers:mkStickers("MEX",1,20) },
    { id:"RSA", name:"África do Sul", code:"RSA", flag:"🇿🇦", stickers:mkStickers("RSA",1,20) },
    { id:"KOR", name:"Coreia do Sul", code:"KOR", flag:"🇰🇷", stickers:mkStickers("KOR",1,20) },
    { id:"CZE", name:"Rep. Tcheca",   code:"CZE", flag:"🇨🇿", stickers:mkStickers("CZE",1,20) },
  ]},
  { id:"B", name:"Grupo B", teams:[
    { id:"CAN", name:"Canadá", code:"CAN", flag:"🇨🇦", stickers:mkStickers("CAN",1,20) },
    { id:"BIH", name:"Bósnia", code:"BIH", flag:"🇧🇦", stickers:mkStickers("BIH",1,20) },
    { id:"QAT", name:"Catar",  code:"QAT", flag:"🇶🇦", stickers:mkStickers("QAT",1,20) },
    { id:"SUI", name:"Suíça",  code:"SUI", flag:"🇨🇭", stickers:mkStickers("SUI",1,20) },
  ]},
  { id:"C", name:"Grupo C", teams:[
    { id:"BRA", name:"Brasil",   code:"BRA", flag:"🇧🇷", stickers:mkStickers("BRA",1,20) },
    { id:"MAR", name:"Marrocos", code:"MAR", flag:"🇲🇦", stickers:mkStickers("MAR",1,20) },
    { id:"HAI", name:"Haiti",    code:"HAI", flag:"🇭🇹", stickers:mkStickers("HAI",1,20) },
    { id:"SCO", name:"Escócia",  code:"SCO", flag:"🏴󠁧󠁢󠁳󠁣󠁴󠁿", stickers:mkStickers("SCO",1,20) },
  ]},
  { id:"D", name:"Grupo D", teams:[
    { id:"USA", name:"Estados Unidos", code:"USA", flag:"🇺🇸", stickers:mkStickers("USA",1,20) },
    { id:"PAR", name:"Paraguai",       code:"PAR", flag:"🇵🇾", stickers:mkStickers("PAR",1,20) },
    { id:"AUS", name:"Austrália",      code:"AUS", flag:"🇦🇺", stickers:mkStickers("AUS",1,20) },
    { id:"TUR", name:"Turquia",        code:"TUR", flag:"🇹🇷", stickers:mkStickers("TUR",1,20) },
  ]},
  { id:"E", name:"Grupo E", teams:[
    { id:"GER", name:"Alemanha",        code:"GER", flag:"🇩🇪", stickers:mkStickers("GER",1,20) },
    { id:"CUW", name:"Curaçau",         code:"CUW", flag:"🇨🇼", stickers:mkStickers("CUW",1,20) },
    { id:"CIV", name:"Costa do Marfim", code:"CIV", flag:"🇨🇮", stickers:mkStickers("CIV",1,20) },
    { id:"ECU", name:"Equador",         code:"ECU", flag:"🇪🇨", stickers:mkStickers("ECU",1,20) },
  ]},
  { id:"F", name:"Grupo F", teams:[
    { id:"NED", name:"Holanda", code:"NED", flag:"🇳🇱", stickers:mkStickers("NED",1,20) },
    { id:"JPN", name:"Japão",   code:"JPN", flag:"🇯🇵", stickers:mkStickers("JPN",1,20) },
    { id:"SWE", name:"Suécia",  code:"SWE", flag:"🇸🇪", stickers:mkStickers("SWE",1,20) },
    { id:"TUN", name:"Tunísia", code:"TUN", flag:"🇹🇳", stickers:mkStickers("TUN",1,20) },
  ]},
  { id:"G", name:"Grupo G", teams:[
    { id:"BEL", name:"Bélgica",       code:"BEL", flag:"🇧🇪", stickers:mkStickers("BEL",1,20) },
    { id:"EGY", name:"Egito",         code:"EGY", flag:"🇪🇬", stickers:mkStickers("EGY",1,20) },
    { id:"IRN", name:"Irã",           code:"IRN", flag:"🇮🇷", stickers:mkStickers("IRN",1,20) },
    { id:"NZL", name:"Nova Zelândia", code:"NZL", flag:"🇳🇿", stickers:mkStickers("NZL",1,20) },
  ]},
  { id:"H", name:"Grupo H", teams:[
    { id:"ESP", name:"Espanha",        code:"ESP", flag:"🇪🇸", stickers:mkStickers("ESP",1,20) },
    { id:"CPV", name:"Cabo Verde",     code:"CPV", flag:"🇨🇻", stickers:mkStickers("CPV",1,20) },
    { id:"KSA", name:"Arábia Saudita", code:"KSA", flag:"🇸🇦", stickers:mkStickers("KSA",1,20) },
    { id:"URU", name:"Uruguai",        code:"URU", flag:"🇺🇾", stickers:mkStickers("URU",1,20) },
  ]},
  { id:"I", name:"Grupo I", teams:[
    { id:"FRA", name:"França",  code:"FRA", flag:"🇫🇷", stickers:mkStickers("FRA",1,20) },
    { id:"SEN", name:"Senegal", code:"SEN", flag:"🇸🇳", stickers:mkStickers("SEN",1,20) },
    { id:"IRQ", name:"Iraque",  code:"IRQ", flag:"🇮🇶", stickers:mkStickers("IRQ",1,20) },
    { id:"NOR", name:"Noruega", code:"NOR", flag:"🇳🇴", stickers:mkStickers("NOR",1,20) },
  ]},
  { id:"J", name:"Grupo J", teams:[
    { id:"ARG", name:"Argentina", code:"ARG", flag:"🇦🇷", stickers:mkStickers("ARG",1,20) },
    { id:"ALG", name:"Argélia",   code:"ALG", flag:"🇩🇿", stickers:mkStickers("ALG",1,20) },
    { id:"AUT", name:"Áustria",   code:"AUT", flag:"🇦🇹", stickers:mkStickers("AUT",1,20) },
    { id:"JOR", name:"Jordânia",  code:"JOR", flag:"🇯🇴", stickers:mkStickers("JOR",1,20) },
  ]},
  { id:"K", name:"Grupo K", teams:[
    { id:"POR", name:"Portugal",    code:"POR", flag:"🇵🇹", stickers:mkStickers("POR",1,20) },
    { id:"COD", name:"RD Congo",    code:"COD", flag:"🇨🇩", stickers:mkStickers("COD",1,20) },
    { id:"UZB", name:"Uzbequistão", code:"UZB", flag:"🇺🇿", stickers:mkStickers("UZB",1,20) },
    { id:"COL", name:"Colômbia",    code:"COL", flag:"🇨🇴", stickers:mkStickers("COL",1,20) },
  ]},
  { id:"L", name:"Grupo L", teams:[
    { id:"ENG", name:"Inglaterra", code:"ENG", flag:"🏴󠁧󠁢󠁥󠁮󠁧󠁿", stickers:mkStickers("ENG",1,20) },
    { id:"CRO", name:"Croácia",    code:"CRO", flag:"🇭🇷",     stickers:mkStickers("CRO",1,20) },
    { id:"GHA", name:"Gana",       code:"GHA", flag:"🇬🇭",     stickers:mkStickers("GHA",1,20) },
    { id:"PAN", name:"Panamá",     code:"PAN", flag:"🇵🇦",     stickers:mkStickers("PAN",1,20) },
  ]},
];

// country code → team id mapping for world map
const COUNTRY_TO_TEAM = {
  "MX":"MEX","ZA":"RSA","KR":"KOR","CZ":"CZE",
  "CA":"CAN","BA":"BIH","QA":"QAT","CH":"SUI",
  "BR":"BRA","MA":"MAR","HT":"HAI","GB-SCT":"SCO",
  "US":"USA","PY":"PAR","AU":"AUS","TR":"TUR",
  "DE":"GER","CW":"CUW","CI":"CIV","EC":"ECU",
  "NL":"NED","JP":"JPN","SE":"SWE","TN":"TUN",
  "BE":"BEL","EG":"EGY","IR":"IRN","NZ":"NZL",
  "ES":"ESP","CV":"CPV","SA":"KSA","UY":"URU",
  "FR":"FRA","SN":"SEN","IQ":"IRQ","NO":"NOR",
  "AR":"ARG","DZ":"ALG","AT":"AUT","JO":"JOR",
  "PT":"POR","CD":"COD","UZ":"UZB","CO":"COL",
  "GB-ENG":"ENG","HR":"CRO","GH":"GHA","PA":"PAN",
};

const ALL_TEAMS = GROUPS.flatMap(g => g.teams);
const TOTAL     = ALL_TEAMS.reduce((a,t) => a + t.stickers.length, 0);
const KEY       = "copa2026_col";
const PKT_KEY   = "copa2026_pkt";
const PRICE     = 7;

function loadCol() { try { return JSON.parse(localStorage.getItem(KEY)||"{}"); } catch { return {}; } }
function persistCol(c) { try { localStorage.setItem(KEY, JSON.stringify(c)); } catch {} }
function loadPkt() { try { return parseInt(localStorage.getItem(PKT_KEY)||"0"); } catch { return 0; } }
function persistPkt(n) { try { localStorage.setItem(PKT_KEY, String(n)); } catch {} }

// ─── TOKENS ──────────────────────────────────────────────────────────────────
const gold  = "#FFD700";
const gold2 = "#FFA500";
const dark  = "#07070e";
const card  = "#14142a";
const bdr   = "rgba(255,215,0,0.13)";
const muted = "#666";
const green = "#00c853";
const red   = "#ff4444";
const font  = { title:"'Bebas Neue', sans-serif", body:"'Nunito', sans-serif" };

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function teamProgress(team, col) {
  const owned = team.stickers.filter(s=>(col[s.id]||0)>0).length;
  return { owned, total:team.stickers.length, pct:Math.round((owned/team.stickers.length)*100), full:owned===team.stickers.length };
}

// ─── CLEARABLE INPUT ─────────────────────────────────────────────────────────
function ClearableInput({ value, onChange, placeholder, autoFocus, style }) {
  return (
    <div style={{ position:"relative", display:"flex", alignItems:"center" }}>
      <input
        value={value}
        onChange={e=>onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete="off" autoCorrect="off" spellCheck={false}
        autoFocus={autoFocus}
        style={{ width:"100%", paddingRight: value ? "36px" : "14px", ...style }}
      />
      {value && (
        <button
          onClick={()=>onChange("")}
          style={{
            position:"absolute", right:10,
            width:20, height:20,
            border:"none", borderRadius:"50%",
            background:"rgba(255,255,255,0.12)",
            color:"#aaa", fontSize:12, fontWeight:900,
            cursor:"pointer", display:"flex",
            alignItems:"center", justifyContent:"center",
            lineHeight:1, padding:0,
            WebkitTapHighlightColor:"transparent",
            flexShrink:0,
          }}
        >✕</button>
      )}
    </div>
  );
}


function Toast({ msg, type }) {
  if (!msg) return null;
  const ok = type !== "err";
  return (
    <div style={{ position:"fixed", bottom:20, left:"50%", transform:"translateX(-50%)", background:ok?"rgba(0,200,83,0.12)":"rgba(255,23,68,0.12)", border:`1px solid ${ok?"rgba(0,200,83,0.4)":"rgba(255,23,68,0.4)"}`, borderRadius:9, padding:"9px 16px", fontSize:".8rem", fontWeight:800, color:ok?"#69ff94":"#ff6b6b", zIndex:999, whiteSpace:"nowrap", pointerEvents:"none" }}>{msg}</div>
  );
}

// ─── CONFETTI ────────────────────────────────────────────────────────────────
function Confetti({ onDone }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const pieces = Array.from({length:60}, (_,i) => {
      const d = document.createElement("div");
      const colors = [gold,"#ff6b6b","#69ff94","#82b1ff","#ff80ab","#fff"];
      d.style.cssText = `position:absolute;width:${6+Math.random()*6}px;height:${6+Math.random()*6}px;background:${colors[i%colors.length]};border-radius:${Math.random()>0.5?"50%":"2px"};left:${Math.random()*100}%;top:-10px;opacity:1;transform:rotate(${Math.random()*360}deg);`;
      el.appendChild(d);
      const dur = 1200+Math.random()*800;
      d.animate([{top:"-10px",opacity:1,transform:`rotate(${Math.random()*360}deg) translateX(0)`},{top:"110%",opacity:0,transform:`rotate(${Math.random()*720}deg) translateX(${(Math.random()-0.5)*120}px)`}],{duration:dur,easing:"cubic-bezier(0.25,0.46,0.45,0.94)"}).onfinish=()=>d.remove();
      return d;
    });
    const t = setTimeout(onDone, 2200);
    return () => { clearTimeout(t); pieces.forEach(d=>d.remove()); };
  }, []);
  return <div ref={ref} style={{ position:"fixed",inset:0,pointerEvents:"none",zIndex:1000,overflow:"hidden" }} />;
}

// ─── GROUP COMPLETE BANNER ────────────────────────────────────────────────────
function GroupBanner({ grp, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 2500); return ()=>clearTimeout(t); }, []);
  return (
    <div style={{ position:"fixed",inset:0,display:"flex",alignItems:"center",justifyContent:"center",zIndex:998,background:"rgba(0,0,0,0.6)",backdropFilter:"blur(4px)" }}>
      <div style={{ background:card,border:`2px solid ${gold}`,borderRadius:20,padding:"32px 40px",textAlign:"center",animation:"slideDown .3s ease",boxShadow:`0 0 40px rgba(255,215,0,0.3)` }}>
        <div style={{ fontSize:52, marginBottom:8 }}>🏆</div>
        <div style={{ fontFamily:font.title,fontSize:"1.6rem",letterSpacing:"2px",background:`linear-gradient(135deg,${gold},${gold2})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent" }}>GRUPO COMPLETO!</div>
        <div style={{ color:"#efefef",fontWeight:800,marginTop:6,fontSize:".9rem" }}>{grp.name}</div>
        <div style={{ color:muted,fontSize:".75rem",marginTop:4 }}>Parabéns! 🎉</div>
      </div>
    </div>
  );
}

// ─── STICKER CELL ─────────────────────────────────────────────────────────────
function StickerCell({ s, qty, onInc, onDec, locked }) {
  const st  = qty===0?"empty":qty===1?"have":"dbl";
  const ico = qty===0?"✦":qty===1?"✅":"⭐";
  const bc  = st==="have"?green:st==="dbl"?gold:bdr;
  const bg  = st==="have"?"linear-gradient(135deg,rgba(0,200,83,.13),rgba(0,200,83,.03))":st==="dbl"?"linear-gradient(135deg,rgba(255,215,0,.15),rgba(255,165,0,.05))":"rgba(255,255,255,0.02)";
  const lc  = st==="have"?"#69ff94":st==="dbl"?gold:muted;
  return (
    <div onClick={locked?undefined:onInc} style={{ aspectRatio:"3/4",borderRadius:9,border:`2px solid ${bc}`,background:bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",cursor:locked?"default":"pointer",position:"relative",userSelect:"none",WebkitTapHighlightColor:"transparent",overflow:"hidden",opacity:locked?0.75:1 }}>
      {qty>1&&<div style={{ position:"absolute",top:2,right:2,width:15,height:15,background:gold,color:"#000",borderRadius:"50%",fontSize:".5rem",fontWeight:900,display:"flex",alignItems:"center",justifyContent:"center" }}>{qty}</div>}
      <div style={{ fontSize:13,marginBottom:1 }}>{ico}</div>
      <div style={{ fontSize:".5rem",fontWeight:800,color:lc,textTransform:"uppercase",letterSpacing:".2px",textAlign:"center",lineHeight:1.2 }}>{s.label}</div>
      {qty>0&&!locked&&(
        <div style={{ display:"flex",alignItems:"center",gap:1,marginTop:2 }} onClick={e=>e.stopPropagation()}>
          <button onClick={onDec} style={qbSt}>−</button>
          <span style={{ fontSize:".58rem",fontWeight:800,minWidth:11,textAlign:"center" }}>{qty}</span>
          <button onClick={onInc} style={qbSt}>+</button>
        </div>
      )}
      {qty>0&&locked&&(
        <div style={{ fontSize:".58rem",fontWeight:800,minWidth:11,textAlign:"center",marginTop:2,color:lc }}>{qty}x</div>
      )}
    </div>
  );
}
const qbSt={ width:17,height:17,border:"1px solid rgba(255,255,255,0.1)",background:"rgba(255,255,255,0.07)",color:"#efefef",borderRadius:4,fontSize:13,fontWeight:900,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",padding:0,lineHeight:1,WebkitTapHighlightColor:"transparent" };

// ─── STICKER PANEL ────────────────────────────────────────────────────────────
function StickerPanel({ team, col, onUpdate, onClose, locked }) {
  const { owned, total } = teamProgress(team, col);
  return (
    <div style={{ gridColumn:"1/-1",background:"rgba(255,215,0,0.03)",border:`1.5px solid ${locked?"rgba(255,68,68,.3)":"rgba(255,215,0,.2)"}`,borderRadius:13,overflow:"hidden",animation:"slideDown .18s ease" }}>
      <div style={{ display:"flex",alignItems:"center",gap:8,padding:"9px 12px",borderBottom:`1px solid ${locked?"rgba(255,68,68,.1)":"rgba(255,215,0,.1)"}`,background:locked?"rgba(255,68,68,0.04)":"rgba(255,215,0,0.04)" }}>
        <span style={{ fontSize:18 }}>{team.flag}</span>
        <span style={{ fontFamily:font.title,fontSize:".95rem",letterSpacing:1 }}>{team.name}</span>
        <span style={{ fontFamily:font.body,fontSize:".62rem",color:muted,fontWeight:800 }}>{owned}/{total}</span>
        {locked && <span style={{ fontSize:".65rem",fontWeight:800,color:"#ff6b6b",background:"rgba(255,68,68,0.12)",border:"1px solid rgba(255,68,68,.3)",borderRadius:6,padding:"2px 7px" }}>🔒 Bloqueado</span>}
        <button onClick={onClose} style={{ marginLeft:"auto",background:"none",border:`1px solid ${bdr}`,borderRadius:6,color:muted,fontSize:".68rem",fontWeight:800,fontFamily:font.body,cursor:"pointer",padding:"3px 9px",WebkitTapHighlightColor:"transparent" }}>✕ Fechar</button>
      </div>
      <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:5,padding:8 }}>
        {team.stickers.map(s=>(
          <StickerCell key={s.id} s={s} qty={col[s.id]||0} locked={locked}
            onInc={e=>{ if(e)e.stopPropagation(); onUpdate(s.id,(col[s.id]||0)+1); }}
            onDec={e=>{ if(e)e.stopPropagation(); onUpdate(s.id,Math.max(0,(col[s.id]||0)-1)); }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── TEAM CARD ────────────────────────────────────────────────────────────────
function TeamCard({ team, col, isOpen, onToggle }) {
  const { owned, total, pct, full } = teamProgress(team, col);
  const bc = isOpen?"rgba(255,215,0,.6)":full?"rgba(0,200,83,.45)":bdr;
  return (
    <div onClick={onToggle} style={{ background:isOpen?"rgba(255,215,0,0.05)":card,border:`1.5px solid ${bc}`,borderRadius:13,cursor:"pointer",WebkitTapHighlightColor:"transparent",userSelect:"none",overflow:"hidden",transition:"border-color .15s" }}>
      <div style={{ padding:"10px 6px 8px",display:"flex",flexDirection:"column",alignItems:"center",gap:1 }}>
        <span style={{ fontSize:24,lineHeight:1 }}>{team.flag}</span>
        <span style={{ fontFamily:font.title,fontSize:".72rem",letterSpacing:1,color:muted,marginTop:2 }}>{team.code}</span>
        <span style={{ fontFamily:font.body,fontSize:".6rem",fontWeight:800,textAlign:"center",lineHeight:1.2 }}>{team.name}</span>
        <span style={{ fontSize:".56rem",fontWeight:800,color:full?green:muted,marginTop:2 }}>{owned}/{total}</span>
        <div style={{ width:"100%",height:3,background:"rgba(255,255,255,0.07)",borderRadius:99,overflow:"hidden",marginTop:4 }}>
          <div style={{ height:"100%",width:pct+"%",background:full?green:`linear-gradient(90deg,${gold},${gold2})`,borderRadius:99,transition:"width .3s" }} />
        </div>
      </div>
    </div>
  );
}

// ─── GROUP SECTION ────────────────────────────────────────────────────────────
function GroupSection({ grp, col, openTeamId, onToggle, onUpdate, locked }) {
  const grpOwned = grp.teams.reduce((a,t)=>a+teamProgress(t,col).owned,0);
  const grpTotal = grp.teams.reduce((a,t)=>a+t.stickers.length,0);
  const COLS=2;
  const children=[];
  grp.teams.forEach((team,idx)=>{
    children.push(<TeamCard key={team.id} team={team} col={col} isOpen={openTeamId===team.id} onToggle={()=>onToggle(team.id)} />);
    if(team.id===openTeamId){
      const rem=COLS-1-(idx%COLS);
      for(let r=0;r<rem;r++) children.push(<div key={`ph-${team.id}-${r}`} />);
      children.push(<StickerPanel key={"panel-"+team.id} team={team} col={col} onUpdate={onUpdate} onClose={()=>onToggle(team.id)} locked={locked} />);
    }
  });
  return (
    <div style={{ marginBottom:4 }}>
      <div style={{ display:"flex",alignItems:"center",gap:8,padding:"12px 12px 5px",fontFamily:font.title,fontSize:"1rem",letterSpacing:"2px" }}>
        <span style={{ background:`linear-gradient(135deg,${gold},${gold2})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent" }}>{grp.name}</span>
        <div style={{ flex:1,height:1,background:bdr }} />
        <span style={{ fontFamily:font.body,fontSize:".62rem",color:muted,fontWeight:800 }}>{grpOwned}/{grpTotal}</span>
      </div>
      <div style={{ display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:7,padding:"0 12px 6px" }}>
        {children}
      </div>
    </div>
  );
}

// ─── ALBUM PAGE ───────────────────────────────────────────────────────────────
function AlbumPage({ col, onUpdate, onNavigate, onGroupComplete, locked }) {
  const [search,setSearch]         = useState("");
  const [openTeamId,setOpenTeamId] = useState(null);
  const prevCompletedRef           = useRef(new Set());

  const toggle = useCallback((teamId) => setOpenTeamId(p=>p===teamId?null:teamId),[]);

  // detect group completion
  useEffect(()=>{
    GROUPS.forEach(grp=>{
      if(grp.id==="special") return;
      const allFull = grp.teams.every(t=>teamProgress(t,col).full);
      if(allFull && !prevCompletedRef.current.has(grp.id)){
        prevCompletedRef.current.add(grp.id);
        onGroupComplete(grp);
      }
    });
  },[col]);

  const vals=Object.values(col);
  const have=vals.filter(v=>v>0).length;
  const dbl=vals.filter(v=>v>1).length;
  const miss=TOTAL-have;
  const pct=Math.round((have/TOTAL)*100);

  const filtered=search.trim()
    ?GROUPS.map(g=>({...g,teams:g.teams.filter(t=>t.name.toLowerCase().includes(search.toLowerCase())||t.code.toLowerCase().includes(search.toLowerCase())||g.name.toLowerCase().includes(search.toLowerCase())||t.stickers.some(s=>s.label.toLowerCase().includes(search.toLowerCase())))})).filter(g=>g.teams.length>0)
    :GROUPS;

  const statCards=[
    {label:"Tenho",value:have,nav:"have"},
    {label:"Faltam",value:miss,nav:"miss"},
    {label:"Repetidas",value:dbl,nav:"doubles"},
    {label:"Completo",value:pct+"%",nav:null},
  ];

  return (
    <>
      <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6,padding:"10px 12px 6px" }}>
        {statCards.map(({label,value,nav})=>(
          <div key={label} onClick={()=>nav&&onNavigate(nav)} style={{ background:card,border:`1px solid ${nav?"rgba(255,215,0,0.3)":bdr}`,borderRadius:13,padding:"10px 4px",textAlign:"center",cursor:nav?"pointer":"default",WebkitTapHighlightColor:"transparent",position:"relative",transition:"border-color .15s" }}>
            <div style={{ fontFamily:font.title,fontSize:"1.5rem",background:`linear-gradient(135deg,${gold},${gold2})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",lineHeight:1 }}>{value}</div>
            <div style={{ fontSize:".55rem",color:nav?gold:muted,fontWeight:800,textTransform:"uppercase",letterSpacing:".3px",marginTop:2 }}>{label}</div>
            {nav&&<div style={{ position:"absolute",bottom:4,left:"50%",transform:"translateX(-50%)",width:16,height:2,background:`linear-gradient(90deg,${gold},${gold2})`,borderRadius:99,opacity:.6 }} />}
          </div>
        ))}
      </div>
      <div style={{ padding:"2px 12px 8px" }}>
        <div style={{ display:"flex",justifyContent:"space-between",fontSize:".68rem",color:muted,fontWeight:800,marginBottom:4 }}>
          <span>Progresso geral</span><span>{have} / {TOTAL}</span>
        </div>
        <div style={{ height:6,background:"rgba(255,255,255,0.05)",borderRadius:99,overflow:"hidden" }}>
          <div style={{ height:"100%",width:pct+"%",background:`linear-gradient(90deg,${gold},${gold2})`,borderRadius:99,transition:"width .5s ease" }} />
        </div>
      </div>
      <div style={{ padding:"2px 12px 8px" }}>
        <ClearableInput
          value={search}
          onChange={setSearch}
          placeholder="🔍 Buscar (ex: BRA 7, Brasil, Grupo C...)"
          style={{ padding:"10px 14px", background:card, border:`1.5px solid ${bdr}`, borderRadius:10, color:"#efefef", fontFamily:font.body, fontSize:".9rem", outline:"none", WebkitAppearance:"none" }}
        />
      </div>
      {filtered.map(grp=>(
        <GroupSection key={grp.id} grp={grp} col={col} openTeamId={openTeamId} onToggle={toggle} onUpdate={onUpdate} locked={locked} />
      ))}
      <div style={{ height:14 }} />
    </>
  );
}

// ─── HAVE PAGE ────────────────────────────────────────────────────────────────
function HavePage({ col }) {
  const sections=[];
  for(const grp of GROUPS){
    const ti=[];
    for(const team of grp.teams){ const items=team.stickers.filter(s=>(col[s.id]||0)>0); if(items.length) ti.push({team,items}); }
    if(ti.length) sections.push({grp,ti});
  }
  const total=sections.reduce((a,s)=>a+s.ti.reduce((b,t)=>b+t.items.length,0),0);
  return (
    <div>
      <div style={{ padding:"16px 12px 8px" }}>
        <h2 style={{ fontFamily:font.title,fontSize:"1.5rem",letterSpacing:"2px" }}>✅ TENHO</h2>
        <p style={{ color:muted,fontSize:".8rem",fontWeight:700,marginTop:2 }}>{total} figurinha{total!==1?"s":""} na sua coleção</p>
      </div>
      {sections.length===0?(<div style={{ textAlign:"center",padding:"50px 20px",color:muted }}><div style={{ fontSize:46,marginBottom:10 }}>📦</div><p style={{ fontSize:".88rem",fontWeight:700,lineHeight:1.6 }}>Nenhuma figurinha ainda!</p></div>)
      :sections.map(({grp,ti})=>(
        <div key={grp.id}>
          <div style={{ padding:"8px 12px",fontFamily:font.title,fontSize:".85rem",letterSpacing:1,color:gold,background:card,borderTop:`1px solid ${bdr}`,borderBottom:`1px solid ${bdr}`,margin:"5px 0 0" }}>⚽ {grp.name}</div>
          {ti.map(({team,items})=>(
            <div key={team.id}>
              <div style={{ display:"flex",alignItems:"center",gap:6,padding:"6px 12px 3px",fontFamily:font.body,fontSize:".75rem",fontWeight:800 }}>{team.flag} <strong>{team.name}</strong> <span style={{color:muted,fontWeight:700}}>({items.length}/{team.stickers.length})</span></div>
              <div style={{ display:"flex",flexWrap:"wrap",gap:5,padding:"0 12px 6px" }}>
                {items.map(s=><div key={s.id} style={{ background:"linear-gradient(135deg,rgba(0,200,83,.12),rgba(0,200,83,.03))",border:"1.5px solid rgba(0,200,83,.3)",borderRadius:7,padding:"4px 9px",fontSize:".7rem",fontWeight:800,color:green }}>{s.label}</div>)}
              </div>
            </div>
          ))}
        </div>
      ))}
      <div style={{ height:14 }} />
    </div>
  );
}

// ─── MISS PAGE ────────────────────────────────────────────────────────────────
function MissPage({ col }) {
  const sections=[];
  for(const grp of GROUPS){
    const ti=[];
    for(const team of grp.teams){ const items=team.stickers.filter(s=>(col[s.id]||0)===0); if(items.length) ti.push({team,items}); }
    if(ti.length) sections.push({grp,ti});
  }
  const total=sections.reduce((a,s)=>a+s.ti.reduce((b,t)=>b+t.items.length,0),0);
  return (
    <div>
      <div style={{ padding:"16px 12px 8px" }}>
        <h2 style={{ fontFamily:font.title,fontSize:"1.5rem",letterSpacing:"2px" }}>❌ FALTAM</h2>
        <p style={{ color:muted,fontSize:".8rem",fontWeight:700,marginTop:2 }}>{total} figurinha{total!==1?"s":""} faltando</p>
      </div>
      {sections.length===0?(<div style={{ textAlign:"center",padding:"50px 20px",color:muted }}><div style={{ fontSize:46,marginBottom:10 }}>🏆</div><p style={{ fontSize:".88rem",fontWeight:700,lineHeight:1.6 }}>Álbum completo! Parabéns!</p></div>)
      :sections.map(({grp,ti})=>(
        <div key={grp.id}>
          <div style={{ padding:"8px 12px",fontFamily:font.title,fontSize:".85rem",letterSpacing:1,color:gold,background:card,borderTop:`1px solid ${bdr}`,borderBottom:`1px solid ${bdr}`,margin:"5px 0 0" }}>⚽ {grp.name}</div>
          {ti.map(({team,items})=>(
            <div key={team.id}>
              <div style={{ display:"flex",alignItems:"center",gap:6,padding:"6px 12px 3px",fontFamily:font.body,fontSize:".75rem",fontWeight:800 }}>{team.flag} <strong>{team.name}</strong> <span style={{color:muted,fontWeight:700}}>({items.length} faltando)</span></div>
              <div style={{ display:"flex",flexWrap:"wrap",gap:5,padding:"0 12px 6px" }}>
                {items.map(s=><div key={s.id} style={{ background:"rgba(255,68,68,0.08)",border:"1.5px solid rgba(255,68,68,.25)",borderRadius:7,padding:"4px 9px",fontSize:".7rem",fontWeight:800,color:"#ff6b6b" }}>{s.label}</div>)}
              </div>
            </div>
          ))}
        </div>
      ))}
      <div style={{ height:14 }} />
    </div>
  );
}

// ─── DOUBLES PAGE ─────────────────────────────────────────────────────────────
function DoublesPage({ col }) {
  let totalExtra=0;
  const sections=[];
  for(const grp of GROUPS){
    const ti=[];
    for(const team of grp.teams){ const items=team.stickers.filter(s=>(col[s.id]||0)>1); if(items.length){totalExtra+=items.reduce((a,s)=>a+(col[s.id]-1),0);ti.push({team,items});} }
    if(ti.length) sections.push({grp,ti});
  }
  return (
    <div>
      <div style={{ padding:"16px 12px 8px" }}>
        <h2 style={{ fontFamily:font.title,fontSize:"1.5rem",letterSpacing:"2px" }}>⭐ REPETIDAS</h2>
        <p style={{ color:muted,fontSize:".8rem",fontWeight:700,marginTop:2 }}>{totalExtra>0?`${totalExtra} figurinha${totalExtra!==1?"s":""} para trocar`:"Nenhuma repetida ainda"}</p>
      </div>
      {sections.length===0?(<div style={{ textAlign:"center",padding:"50px 20px",color:muted }}><div style={{ fontSize:46,marginBottom:10 }}>🎉</div><p style={{ fontSize:".88rem",fontWeight:700,lineHeight:1.6 }}>Nenhuma repetida ainda!</p></div>)
      :sections.map(({grp,ti})=>(
        <div key={grp.id}>
          <div style={{ padding:"8px 12px",fontFamily:font.title,fontSize:".85rem",letterSpacing:1,color:gold,background:card,borderTop:`1px solid ${bdr}`,borderBottom:`1px solid ${bdr}`,margin:"5px 0 0" }}>⚽ {grp.name}</div>
          {ti.map(({team,items})=>(
            <div key={team.id}>
              <div style={{ display:"flex",alignItems:"center",gap:6,padding:"6px 12px 3px",fontFamily:font.body,fontSize:".75rem",fontWeight:800 }}>{team.flag} <strong>{team.name}</strong></div>
              <div style={{ display:"flex",flexWrap:"wrap",gap:5,padding:"0 12px 6px" }}>
                {items.map(s=><div key={s.id} style={{ background:"linear-gradient(135deg,rgba(255,215,0,.12),rgba(255,165,0,.05))",border:"1.5px solid rgba(255,215,0,.28)",borderRadius:7,padding:"4px 9px",fontSize:".7rem",fontWeight:800,display:"flex",alignItems:"center",gap:4,color:gold }}>{s.label}<span style={{ background:gold,color:"#000",borderRadius:20,padding:"1px 6px",fontSize:".6rem" }}>×{col[s.id]-1}</span></div>)}
              </div>
            </div>
          ))}
        </div>
      ))}
      <div style={{ height:14 }} />
    </div>
  );
}

// ─── TRADE PAGE ───────────────────────────────────────────────────────────────
function TradePage({ col, onToast }) {
  const [selected, setSelected] = useState(new Set());

  const allDoubles = [];
  for(const grp of GROUPS)
    for(const team of grp.teams)
      for(const s of team.stickers)
        if((col[s.id]||0)>1) allDoubles.push({...s, team, extra:col[s.id]-1});

  function toggleAll() {
    if(selected.size===allDoubles.length) setSelected(new Set());
    else setSelected(new Set(allDoubles.map(s=>s.id)));
  }

  function shareWhatsApp() {
    const items = allDoubles.filter(s=>selected.has(s.id));
    if(!items.length){onToast("Selecione figurinhas para trocar","err");return;}
    const lines=["🏆 *FIGURINHAS PARA TROCAR - Copa 2026*",""];
    const byTeam={};
    items.forEach(s=>{ (byTeam[s.team.id]=byTeam[s.team.id]||{team:s.team,items:[]}).items.push(s); });
    Object.values(byTeam).forEach(({team,items})=>{
      lines.push(`${team.flag} *${team.name}*`);
      lines.push(items.map(s=>`${s.label}${s.extra>1?" (×"+s.extra+"x)":""}`).join(", "));
      lines.push("");
    });
    lines.push(`📦 Total: ${items.length} figurinha${items.length!==1?"s":""} para trocar`);
    lines.push("_Álbum Copa 2026_");
    const text=encodeURIComponent(lines.join("\n"));
    window.open(`https://api.whatsapp.com/send?text=${text}`,"_blank");
  }

  return (
    <div>
      <div style={{ padding:"16px 12px 8px" }}>
        <h2 style={{ fontFamily:font.title,fontSize:"1.5rem",letterSpacing:"2px" }}>🔄 MODO TROCA</h2>
        <p style={{ color:muted,fontSize:".8rem",fontWeight:700,marginTop:2 }}>Selecione as repetidas e compartilhe no WhatsApp</p>
      </div>

      {allDoubles.length===0?(
        <div style={{ textAlign:"center",padding:"50px 20px",color:muted }}><div style={{ fontSize:46,marginBottom:10 }}>🔄</div><p style={{ fontSize:".88rem",fontWeight:700,lineHeight:1.6 }}>Nenhuma repetida para trocar ainda!</p></div>
      ):(
        <>
          <div style={{ display:"flex",gap:8,padding:"0 12px 10px",alignItems:"center" }}>
            <button onClick={toggleAll} style={{ flex:1,padding:"10px",border:`1px solid ${bdr}`,borderRadius:10,background:card,color:"#efefef",fontFamily:font.body,fontSize:".8rem",fontWeight:800,cursor:"pointer",WebkitTapHighlightColor:"transparent" }}>
              {selected.size===allDoubles.length?"Desmarcar tudo":"Selecionar tudo"}
            </button>
            <button onClick={shareWhatsApp} style={{ flex:1,padding:"10px",border:"none",borderRadius:10,background:"linear-gradient(135deg,#25D366,#128C7E)",color:"#fff",fontFamily:font.title,fontSize:"1rem",letterSpacing:"1.5px",cursor:"pointer",WebkitTapHighlightColor:"transparent" }}>
              📲 WHATSAPP
            </button>
          </div>
          <div style={{ padding:"0 12px",marginBottom:6,fontSize:".72rem",color:muted,fontWeight:800 }}>
            {selected.size} de {allDoubles.length} selecionadas
          </div>
          <div style={{ display:"flex",flexWrap:"wrap",gap:6,padding:"0 12px 12px" }}>
            {allDoubles.map(s=>{
              const sel=selected.has(s.id);
              return (
                <div key={s.id} onClick={()=>setSelected(p=>{ const n=new Set(p); sel?n.delete(s.id):n.add(s.id); return n; })}
                  style={{ background:sel?"linear-gradient(135deg,rgba(37,211,102,.18),rgba(18,140,126,.1))":"rgba(255,255,255,0.03)",border:`1.5px solid ${sel?"#25D366":bdr}`,borderRadius:8,padding:"5px 10px",fontSize:".72rem",fontWeight:800,cursor:"pointer",display:"flex",alignItems:"center",gap:5,color:sel?"#69ff94":"#efefef",WebkitTapHighlightColor:"transparent",transition:"all .15s" }}>
                  {s.team.flag} {s.label}
                  <span style={{ background:sel?"#25D366":gold,color:"#000",borderRadius:20,padding:"1px 6px",fontSize:".6rem" }}>×{s.extra}</span>
                </div>
              );
            })}
          </div>
        </>
      )}
      <div style={{ height:14 }} />
    </div>
  );
}

// ─── SEARCH PAGE ──────────────────────────────────────────────────────────────
function SearchPage({ col }) {
  const [q,setQ] = useState("");

  const result = q.trim().length>=2 ? (() => {
    const ql=q.trim().toLowerCase();
    const found=[];
    for(const grp of GROUPS)
      for(const team of grp.teams)
        for(const s of team.stickers)
          if(s.label.toLowerCase().includes(ql)||team.name.toLowerCase().includes(ql)||team.code.toLowerCase().includes(ql))
            found.push({s,team,grp,qty:col[s.id]||0});
    return found;
  })() : [];

  const statusIcon = (qty) => qty===0?"❌ Faltando":qty===1?"✅ Tenho":"⭐ Repetida";
  const statusColor = (qty) => qty===0?"#ff6b6b":qty===1?green:gold;

  return (
    <div>
      <div style={{ padding:"16px 12px 10px" }}>
        <h2 style={{ fontFamily:font.title,fontSize:"1.5rem",letterSpacing:"2px" }}>🔍 BUSCA RÁPIDA</h2>
        <p style={{ color:muted,fontSize:".8rem",fontWeight:700,marginTop:2 }}>Digite o código ou nome para verificar status</p>
      </div>
      <div style={{ padding:"0 12px 12px" }}>
        <ClearableInput
          value={q}
          onChange={setQ}
          placeholder="Ex: BRA 7, ARG 15, Brasil..."
          autoFocus
          style={{ padding:"12px 16px", background:card, border:`1.5px solid rgba(255,215,0,0.3)`, borderRadius:12, color:"#efefef", fontFamily:font.body, fontSize:"1rem", outline:"none", WebkitAppearance:"none" }}
        />
      </div>
      {q.trim().length>0&&q.trim().length<2&&(
        <div style={{ textAlign:"center",padding:"20px",color:muted,fontSize:".8rem",fontWeight:700 }}>Digite ao menos 2 caracteres...</div>
      )}
      {result.length>0&&(
        <div style={{ padding:"0 12px" }}>
          <div style={{ fontSize:".7rem",color:muted,fontWeight:800,marginBottom:8 }}>{result.length} resultado{result.length!==1?"s":""}</div>
          {result.map(({s,team,grp,qty})=>(
            <div key={s.id} style={{ background:card,border:`1px solid ${bdr}`,borderRadius:12,padding:"12px 14px",marginBottom:8,display:"flex",alignItems:"center",gap:10 }}>
              <span style={{ fontSize:24 }}>{team.flag}</span>
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:font.title,fontSize:"1rem",letterSpacing:"1px" }}>{s.label}</div>
                <div style={{ fontSize:".7rem",color:muted,fontWeight:700,marginTop:1 }}>{team.name} · {grp.name}</div>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontSize:".72rem",fontWeight:800,color:statusColor(qty) }}>{statusIcon(qty)}</div>
                {qty>1&&<div style={{ fontSize:".65rem",color:gold,fontWeight:800,marginTop:2 }}>{qty-1} extra{qty-1>1?"s":""}</div>}
              </div>
            </div>
          ))}
        </div>
      )}
      {result.length===0&&q.trim().length>=2&&(
        <div style={{ textAlign:"center",padding:"30px 20px",color:muted }}><div style={{ fontSize:36,marginBottom:8 }}>🤷</div><p style={{ fontSize:".85rem",fontWeight:700 }}>Nenhuma figurinha encontrada.</p></div>
      )}
      <div style={{ height:14 }} />
    </div>
  );
}

// ─── PACKETS PAGE ─────────────────────────────────────────────────────────────
function PacketsPage({ packets, onAdd, onRemove, onReset, onToast }) {
  const total = packets * PRICE;
  const [confirm,setConfirm] = useState(false);

  return (
    <div>
      <div style={{ padding:"16px 12px 8px" }}>
        <h2 style={{ fontFamily:font.title,fontSize:"1.5rem",letterSpacing:"2px" }}>📦 PACOTES</h2>
        <p style={{ color:muted,fontSize:".8rem",fontWeight:700,marginTop:2 }}>Controle quantos pacotes você abriu e o gasto total</p>
      </div>

      {/* big counter */}
      <div style={{ margin:"12px",background:card,border:`1px solid ${bdr}`,borderRadius:16,padding:"24px 20px",textAlign:"center" }}>
        <div style={{ fontSize:".7rem",color:muted,fontWeight:800,textTransform:"uppercase",letterSpacing:1,marginBottom:8 }}>Pacotes Abertos</div>
        <div style={{ fontFamily:font.title,fontSize:"5rem",lineHeight:1,background:`linear-gradient(135deg,${gold},${gold2})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent" }}>{packets}</div>
        <div style={{ display:"flex",alignItems:"center",justifyContent:"center",gap:20,marginTop:16 }}>
          <button onClick={onRemove} style={{ width:52,height:52,borderRadius:"50%",border:`2px solid ${bdr}`,background:"rgba(255,255,255,0.04)",color:"#efefef",fontSize:28,fontWeight:900,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",WebkitTapHighlightColor:"transparent" }}>−</button>
          <button onClick={onAdd} style={{ width:64,height:64,borderRadius:"50%",border:"none",background:`linear-gradient(135deg,${gold},${gold2})`,color:"#000",fontSize:32,fontWeight:900,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",WebkitTapHighlightColor:"transparent",boxShadow:`0 0 20px rgba(255,215,0,0.3)` }}>+</button>
        </div>
      </div>

      {/* stats */}
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,padding:"0 12px 12px" }}>
        <div style={{ background:card,border:`1px solid ${bdr}`,borderRadius:13,padding:"14px 12px",textAlign:"center" }}>
          <div style={{ fontFamily:font.title,fontSize:"1.8rem",color:green,lineHeight:1 }}>R${total.toFixed(2).replace(".",",")}</div>
          <div style={{ fontSize:".6rem",color:muted,fontWeight:800,textTransform:"uppercase",marginTop:4 }}>Total Gasto</div>
        </div>
        <div style={{ background:card,border:`1px solid ${bdr}`,borderRadius:13,padding:"14px 12px",textAlign:"center" }}>
          <div style={{ fontFamily:font.title,fontSize:"1.8rem",color:"#82b1ff",lineHeight:1 }}>R${PRICE},00</div>
          <div style={{ fontSize:".6rem",color:muted,fontWeight:800,textTransform:"uppercase",marginTop:4 }}>Por Pacote</div>
        </div>
        <div style={{ background:card,border:`1px solid ${bdr}`,borderRadius:13,padding:"14px 12px",textAlign:"center" }}>
          <div style={{ fontFamily:font.title,fontSize:"1.8rem",color:gold,lineHeight:1 }}>{packets*7}</div>
          <div style={{ fontSize:".6rem",color:muted,fontWeight:800,textTransform:"uppercase",marginTop:4 }}>Figurinhas Recebidas</div>
        </div>
        <div style={{ background:card,border:`1px solid ${bdr}`,borderRadius:13,padding:"14px 12px",textAlign:"center" }}>
          <div style={{ fontFamily:font.title,fontSize:"1.8rem",color:"#ff80ab",lineHeight:1 }}>{packets>0?(PRICE/7).toFixed(2).replace(".",","):"0,00"}</div>
          <div style={{ fontSize:".6rem",color:muted,fontWeight:800,textTransform:"uppercase",marginTop:4 }}>R$/Figurinha</div>
        </div>
      </div>

      {/* reset */}
      {!confirm?(
        <div style={{ padding:"0 12px 12px" }}>
          <button onClick={()=>setConfirm(true)} style={{ width:"100%",padding:12,border:`1px solid rgba(255,68,68,.3)`,borderRadius:10,background:"rgba(255,68,68,0.06)",color:"#ff6b6b",fontFamily:font.body,fontSize:".8rem",fontWeight:800,cursor:"pointer",WebkitTapHighlightColor:"transparent" }}>
            Resetar contador
          </button>
        </div>
      ):(
        <div style={{ padding:"0 12px 12px" }}>
          <p style={{ color:muted,fontSize:".75rem",fontWeight:700,marginBottom:8,textAlign:"center" }}>Tem certeza que quer zerar o contador?</p>
          <div style={{ display:"flex",gap:8 }}>
            <button onClick={()=>setConfirm(false)} style={{ flex:1,padding:12,border:`1px solid ${bdr}`,borderRadius:10,background:card,color:"#efefef",fontFamily:font.body,fontSize:".8rem",fontWeight:800,cursor:"pointer" }}>Cancelar</button>
            <button onClick={()=>{onReset();setConfirm(false);onToast("Contador zerado","ok");}} style={{ flex:1,padding:12,border:"none",borderRadius:10,background:"rgba(255,68,68,0.8)",color:"#fff",fontFamily:font.body,fontSize:".8rem",fontWeight:800,cursor:"pointer" }}>Zerar</button>
          </div>
        </div>
      )}
      <div style={{ height:14 }} />
    </div>
  );
}

// ─── PROGRESS PAGE ────────────────────────────────────────────────────────────
function ProgressPage({ col }) {
  const groups = GROUPS.filter(g=>g.id!=="special");
  return (
    <div>
      <div style={{ padding:"16px 12px 8px" }}>
        <h2 style={{ fontFamily:font.title,fontSize:"1.5rem",letterSpacing:"2px" }}>📊 PROGRESSO POR GRUPO</h2>
        <p style={{ color:muted,fontSize:".8rem",fontWeight:700,marginTop:2 }}>Comparativo de completude entre os grupos</p>
      </div>
      <div style={{ padding:"8px 12px 12px" }}>
        {groups.map(grp=>{
          const owned=grp.teams.reduce((a,t)=>a+teamProgress(t,col).owned,0);
          const total=grp.teams.reduce((a,t)=>a+t.stickers.length,0);
          const pct=Math.round((owned/total)*100);
          const full=owned===total;
          return (
            <div key={grp.id} style={{ marginBottom:10 }}>
              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4 }}>
                <div style={{ display:"flex",alignItems:"center",gap:6 }}>
                  <span style={{ fontFamily:font.title,fontSize:".9rem",letterSpacing:"1px",color:full?green:"#efefef" }}>{grp.name}</span>
                  <div style={{ display:"flex",gap:3 }}>
                    {grp.teams.map(t=>{ const {full:tf}=teamProgress(t,col); return <span key={t.id} style={{ fontSize:12 }}>{tf?"✅":t.flag}</span>; })}
                  </div>
                </div>
                <span style={{ fontFamily:font.title,fontSize:".85rem",color:full?green:pct>50?"#FFD700":muted }}>{pct}%</span>
              </div>
              <div style={{ height:10,background:"rgba(255,255,255,0.06)",borderRadius:99,overflow:"hidden",position:"relative" }}>
                <div style={{ height:"100%",width:pct+"%",background:full?`linear-gradient(90deg,${green},#009640)`:pct>50?`linear-gradient(90deg,${gold},${gold2})`:`linear-gradient(90deg,#448aff,#1565c0)`,borderRadius:99,transition:"width .5s ease" }} />
                <span style={{ position:"absolute",right:6,top:"50%",transform:"translateY(-50%)",fontSize:".5rem",fontWeight:900,color:"rgba(255,255,255,0.5)" }}>{owned}/{total}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* team breakdown */}
      <div style={{ padding:"0 12px 8px" }}>
        <div style={{ fontFamily:font.title,fontSize:".9rem",letterSpacing:"1px",color:muted,marginBottom:10 }}>DETALHE POR SELEÇÃO</div>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:6 }}>
          {GROUPS.flatMap(g=>g.teams).map(team=>{
            const {owned,total,pct,full}=teamProgress(team,col);
            return (
              <div key={team.id} style={{ background:card,border:`1px solid ${full?"rgba(0,200,83,.35)":bdr}`,borderRadius:10,padding:"8px 10px" }}>
                <div style={{ display:"flex",alignItems:"center",gap:6,marginBottom:4 }}>
                  <span style={{ fontSize:16 }}>{team.flag}</span>
                  <span style={{ fontFamily:font.title,fontSize:".75rem",letterSpacing:".8px",flex:1 }}>{team.code}</span>
                  <span style={{ fontSize:".6rem",fontWeight:800,color:full?green:muted }}>{owned}/{total}</span>
                </div>
                <div style={{ height:4,background:"rgba(255,255,255,0.06)",borderRadius:99,overflow:"hidden" }}>
                  <div style={{ height:"100%",width:pct+"%",background:full?green:`linear-gradient(90deg,${gold},${gold2})`,borderRadius:99 }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ height:14 }} />
    </div>
  );
}

// ─── WORLD MAP PAGE ───────────────────────────────────────────────────────────
function WorldMapPage({ col }) {
  const getTeamColor = (teamId) => {
    if(!teamId) return "#1a1a2e";
    const team = ALL_TEAMS.find(t=>t.id===teamId);
    if(!team) return "#1a1a2e";
    const {pct,full} = teamProgress(team,col);
    if(full) return "#00c853";
    if(pct>0) return "#FFD700";
    return "#2a2a4a";
  };

  const legend=[
    {color:green,label:"Completo"},
    {color:gold,label:"Parcial"},
    {color:"#2a2a4a",label:"Vazio"},
    {color:"#1a1a2e",label:"Não participa"},
  ];

  // Simplified world map using country rectangles positioned on a grid
  const regions = [
    // North America
    {iso:"CA",x:8,y:12,w:16,h:10},{iso:"US",x:8,y:22,w:16,h:8},{iso:"MX",x:6,y:30,w:10,h:6},
    // Central America & Caribbean
    {iso:"PA",x:12,y:36,w:4,h:3},{iso:"HT",x:16,y:30,w:4,h:4},
    // South America
    {iso:"CO",x:12,y:39,w:6,h:6},{iso:"EC",x:10,y:45,w:5,h:5},
    {iso:"BR",x:16,y:39,w:12,h:16},{iso:"PY",x:16,y:55,w:5,h:5},
    {iso:"AR",x:14,y:60,w:7,h:12},{iso:"UY",x:18,y:56,w:4,h:4},
    // Europe
    {iso:"GB-SCT",x:34,y:10,w:3,h:3},{iso:"GB-ENG",x:34,y:13,w:3,h:4},
    {iso:"NO",x:36,y:8,w:4,h:5},{iso:"SE",x:38,y:10,w:3,h:6},
    {iso:"FR",x:34,y:18,w:5,h:5},{iso:"ES",x:32,y:23,w:6,h:5},
    {iso:"PT",x:30,y:23,w:3,h:4},{iso:"DE",x:38,y:15,w:5,h:5},
    {iso:"NL",x:36,y:15,w:3,h:3},{iso:"BE",x:36,y:17,w:3,h:3},
    {iso:"CH",x:38,y:19,w:3,h:3},{iso:"AT",x:40,y:18,w:4,h:3},
    {iso:"HR",x:40,y:22,w:4,h:3},{iso:"CZ",x:40,y:15,w:4,h:3},
    {iso:"BA",x:40,y:20,w:3,h:3},
    // Africa
    {iso:"MA",x:32,y:28,w:5,h:5},{iso:"DZ",x:34,y:28,w:7,h:6},
    {iso:"TN",x:37,y:26,w:3,h:4},{iso:"EG",x:42,y:26,w:6,h:5},
    {iso:"SN",x:28,y:34,w:4,h:4},{iso:"CI",x:30,y:38,w:4,h:4},
    {iso:"GH",x:32,y:38,w:3,h:4},{iso:"NG",x:35,y:36,w:5,h:5},
    {iso:"CD",x:40,y:40,w:7,h:7},{iso:"ZA",x:40,y:50,w:7,h:7},
    // Middle East & Central Asia
    {iso:"TR",x:46,y:22,w:6,h:4},{iso:"IQ",x:50,y:26,w:5,h:5},
    {iso:"SA",x:48,y:30,w:6,h:6},{iso:"IR",x:52,y:24,w:7,h:6},
    {iso:"JO",x:48,y:27,w:4,h:4},{iso:"QA",x:52,y:30,w:3,h:3},
    {iso:"UZ",x:56,y:20,w:6,h:5},
    // Asia Pacific
    {iso:"JP",x:76,y:22,w:4,h:6},{iso:"KR",x:72,y:24,w:4,h:4},
    {iso:"AU",x:68,y:50,w:12,h:10},{iso:"NZ",x:78,y:56,w:5,h:5},
    // Special
    {iso:"CV",x:26,y:30,w:3,h:3},{iso:"CW",x:16,y:34,w:3,h:3},
  ];

  return (
    <div>
      <div style={{ padding:"16px 12px 8px" }}>
        <h2 style={{ fontFamily:font.title,fontSize:"1.5rem",letterSpacing:"2px" }}>🗺️ MAPA-MÚNDI</h2>
        <p style={{ color:muted,fontSize:".8rem",fontWeight:700,marginTop:2 }}>Progresso das seleções no mundo</p>
      </div>

      {/* legend */}
      <div style={{ display:"flex",gap:12,padding:"0 12px 10px",flexWrap:"wrap" }}>
        {legend.map(l=>(
          <div key={l.label} style={{ display:"flex",alignItems:"center",gap:5 }}>
            <div style={{ width:12,height:12,borderRadius:3,background:l.color,border:"1px solid rgba(255,255,255,0.1)" }} />
            <span style={{ fontSize:".65rem",color:muted,fontWeight:700 }}>{l.label}</span>
          </div>
        ))}
      </div>

      {/* map */}
      <div style={{ margin:"0 12px 12px",background:"#0d1117",borderRadius:16,overflow:"hidden",border:`1px solid ${bdr}`,position:"relative" }}>
        <svg viewBox="0 0 88 72" style={{ width:"100%",display:"block" }}>
          {/* ocean background */}
          <rect width="88" height="72" fill="#0d1117" />
          {/* grid lines subtle */}
          {[18,36,54,72].map(x=><line key={x} x1={x} y1={0} x2={x} y2={72} stroke="rgba(255,255,255,0.03)" strokeWidth=".3" />)}
          {[18,36,54].map(y=><line key={y} x1={0} y1={y} x2={88} y2={y} stroke="rgba(255,255,255,0.03)" strokeWidth=".3" />)}

          {regions.map(({iso,x,y,w,h})=>{
            const teamId = COUNTRY_TO_TEAM[iso];
            const color  = getTeamColor(teamId);
            const team   = teamId ? ALL_TEAMS.find(t=>t.id===teamId) : null;
            const {pct}  = team ? teamProgress(team,col) : {pct:0};
            return (
              <g key={iso}>
                <rect x={x} y={y} width={w} height={h} fill={color} rx=".8" stroke="rgba(255,255,255,0.08)" strokeWidth=".3" />
                {team && pct>0 && (
                  <text x={x+w/2} y={y+h/2+1} textAnchor="middle" fontSize="1.8" fill="rgba(0,0,0,0.7)" fontWeight="bold">{pct}%</text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* country list */}
      <div style={{ padding:"0 12px 8px" }}>
        <div style={{ fontFamily:font.title,fontSize:".9rem",letterSpacing:"1px",color:muted,marginBottom:8 }}>SELEÇÕES PARTICIPANTES</div>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:5 }}>
          {ALL_TEAMS.map(team=>{
            const {pct,full,owned,total}=teamProgress(team,col);
            return (
              <div key={team.id} style={{ background:card,border:`1px solid ${full?"rgba(0,200,83,.35)":pct>0?"rgba(255,215,0,.2)":bdr}`,borderRadius:9,padding:"7px 8px",display:"flex",alignItems:"center",gap:5 }}>
                <span style={{ fontSize:16 }}>{team.flag}</span>
                <div style={{ flex:1,minWidth:0 }}>
                  <div style={{ fontFamily:font.title,fontSize:".65rem",letterSpacing:".5px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{team.code}</div>
                  <div style={{ height:2,background:"rgba(255,255,255,0.07)",borderRadius:99,overflow:"hidden",marginTop:2 }}>
                    <div style={{ height:"100%",width:pct+"%",background:full?green:`linear-gradient(90deg,${gold},${gold2})`,borderRadius:99 }} />
                  </div>
                </div>
                <span style={{ fontSize:".5rem",fontWeight:800,color:full?green:muted,flexShrink:0 }}>{owned}/{total}</span>
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ height:14 }} />
    </div>
  );
}

// ─── REPORTS PAGE ─────────────────────────────────────────────────────────────
function ReportsPage({ col, onToast }) {
  const vals=Object.values(col);
  const have=vals.filter(v=>v>0).length;
  const dbl=vals.filter(v=>v>1).length;
  const miss=TOTAL-have;
  const pct=Math.round((have/TOTAL)*100);

  function dl(content,filename){ const a=Object.assign(document.createElement("a"),{href:URL.createObjectURL(new Blob([content],{type:"text/plain;charset=utf-8"})),download:filename});document.body.appendChild(a);a.click();document.body.removeChild(a); }
  function build(type){
    const now=new Date().toLocaleString("pt-BR");
    const lines=["═══════════════════════════════════════","       ÁLBUM COPA DO MUNDO 2026","═══════════════════════════════════════",`Gerado em: ${now}`,`Total: ${have}/${TOTAL} (${pct}%) | Faltam: ${miss} | Repetidas: ${dbl}`,""];
    const add=(label,filter,fmt)=>{
      lines.push("───────────────────────────────────────",`  ${label}`,"───────────────────────────────────────");
      for(const grp of GROUPS){ const gl=[];for(const team of grp.teams){const items=team.stickers.filter(filter(team));if(items.length)gl.push(`  ${team.flag} ${team.name}: ${items.map(fmt).join(", ")}`);} if(gl.length){lines.push("","▸ "+grp.name,...gl);} }
      lines.push("");
    };
    if(type==="have"||type==="all") add(`✅ FIGURINHAS CONSEGUIDAS (${have})`,()=>s=>(col[s.id]||0)>0,s=>s.label);
    if(type==="miss"||type==="all") add(`❌ FIGURINHAS FALTANDO (${miss})`,()=>s=>(col[s.id]||0)===0,s=>s.label);
    if(type==="dbl"||type==="all")  add(`⭐ FIGURINHAS REPETIDAS (${dbl} tipos)`,()=>s=>(col[s.id]||0)>1,s=>`${s.label} (×${col[s.id]-1} extra)`);
    lines.push("═══════════════════════════════════════");
    return lines.join("\n");
  }
  const cards=[{label:"✅ Conseguidas",desc:"Todas que você já tem.",type:"have",g:["#00c853","#009640"],dark:false},{label:"❌ Faltando",desc:"Tudo que falta para completar.",type:"miss",g:["#448aff","#1565c0"],dark:false},{label:"⭐ Repetidas",desc:"Suas repetidas com quantidade extra.",type:"dbl",g:[gold,gold2],dark:true},{label:"📋 Completo",desc:"Conseguidas, faltando e repetidas.",type:"all",g:["#ff6f00","#e65100"],dark:false}];
  return (
    <div style={{ padding:"16px 12px" }}>
      <h2 style={{ fontFamily:font.title,fontSize:"1.5rem",letterSpacing:"2px" }}>📊 RELATÓRIOS</h2>
      <p style={{ color:muted,fontSize:".78rem",fontWeight:700,marginTop:2,marginBottom:16,lineHeight:1.5 }}>Exporte listas em .txt fáceis de compartilhar.</p>
      <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
        {cards.map(c=>(
          <div key={c.type} style={{ background:card,border:`1px solid ${bdr}`,borderRadius:13,padding:"14px 12px" }}>
            <h3 style={{ fontFamily:font.title,fontSize:".95rem",letterSpacing:1,marginBottom:4 }}>{c.label}</h3>
            <p style={{ color:muted,fontSize:".7rem",fontWeight:700,lineHeight:1.45,marginBottom:10 }}>{c.desc}</p>
            <button onClick={()=>{dl(build(c.type),`copa2026-${c.type}.txt`);onToast("✅ Relatório exportado!","ok");}} style={{ width:"100%",padding:12,border:"none",borderRadius:9,fontFamily:font.title,fontSize:".9rem",letterSpacing:"1.5px",cursor:"pointer",background:`linear-gradient(135deg,${c.g[0]},${c.g[1]})`,color:c.dark?"#000":"#fff",WebkitTapHighlightColor:"transparent" }}>⬇ EXPORTAR</button>
          </div>
        ))}
      </div>
      <div style={{ height:14 }} />
    </div>
  );
}

// ─── BACKUP PAGE ──────────────────────────────────────────────────────────────
function BackupPage({ col, onImport, onToast }) {
  function exportBackup(){ const a=Object.assign(document.createElement("a"),{href:URL.createObjectURL(new Blob([JSON.stringify({version:2,exportedAt:new Date().toISOString(),collection:col},null,2)],{type:"application/json"})),download:"album-copa-backup.json"});document.body.appendChild(a);a.click();document.body.removeChild(a);onToast("✅ Backup exportado!","ok"); }
  function importBackup(e){ const file=e.target.files[0];if(!file)return;const reader=new FileReader();reader.onload=ev=>{try{const parsed=JSON.parse(ev.target.result);const data=parsed.collection||parsed;if(typeof data!=="object"||Array.isArray(data))throw new Error();onImport(data);onToast("✅ Backup restaurado!","ok");}catch{onToast("❌ Arquivo inválido","err");}e.target.value="";};reader.readAsText(file); }
  const cs={background:card,border:`1px solid ${bdr}`,borderRadius:13,padding:16,marginBottom:10};
  const bs=(g1,g2,dk)=>({width:"100%",padding:13,border:"none",borderRadius:10,fontFamily:font.title,fontSize:"1rem",letterSpacing:"2px",cursor:"pointer",background:`linear-gradient(135deg,${g1},${g2})`,color:dk?"#000":"#fff",WebkitTapHighlightColor:"transparent"});
  return (
    <div style={{ padding:"16px 12px" }}>
      <h2 style={{ fontFamily:font.title,fontSize:"1.5rem",letterSpacing:"2px",marginBottom:4 }}>💾 BACKUP</h2>
      <p style={{ color:muted,fontSize:".75rem",fontWeight:700,marginBottom:18,lineHeight:1.5 }}>Salve seus dados antes de atualizar o app.</p>
      <div style={cs}><h3 style={{ fontFamily:font.title,fontSize:"1rem",letterSpacing:1,marginBottom:4 }}>📤 Exportar dados</h3><p style={{ color:muted,fontSize:".72rem",fontWeight:700,lineHeight:1.45,marginBottom:10 }}>Baixa <strong style={{color:gold}}>album-copa-backup.json</strong>.</p><button onClick={exportBackup} style={bs(gold,gold2,true)}>⬇ BAIXAR BACKUP</button></div>
      <div style={cs}><h3 style={{ fontFamily:font.title,fontSize:"1rem",letterSpacing:1,marginBottom:4 }}>📥 Importar dados</h3><p style={{ color:muted,fontSize:".72rem",fontWeight:700,lineHeight:1.45,marginBottom:10 }}>Restaura a partir de um arquivo de backup.</p><label style={{display:"block"}}><div style={bs(green,"#009640",false)}>⬆ CARREGAR BACKUP</div><input type="file" accept=".json,application/json" onChange={importBackup} style={{display:"none"}} /></label></div>
      <div style={{ background:"rgba(255,215,0,0.05)",border:`1px solid rgba(255,215,0,.12)`,borderRadius:9,padding:"11px 13px",fontSize:".71rem",color:muted,fontWeight:700,lineHeight:1.55 }}><strong style={{color:gold}}>💡 Dica:</strong> Antes de atualizar o app, exporte o backup. Depois importe para restaurar seus dados.</div>
      <div style={{ height:14 }} />
    </div>
  );
}

const APP_VERSION = "1.0.0";

// ─── SOBRE PAGE ───────────────────────────────────────────────────────────────
function SobrePage() {
  const features = [
    "Álbum completo com Grupos A–L, FWC e Coca-Cola",
    "Marcação de figurinhas com controle de repetidas",
    "Modo Troca com compartilhamento via WhatsApp",
    "Busca rápida por figurinha ou seleção",
    "Contador de pacotes e gastos",
    "Progresso por grupo e por seleção",
    "Mapa-múndi interativo",
    "Relatórios exportáveis em .txt",
    "Backup e restauração em JSON",
    "Bloqueio de edição para evitar toques acidentais",
  ];

  return (
    <div style={{ padding:"16px 12px" }}>

      {/* hero */}
      <div style={{ textAlign:"center", padding:"24px 0 20px", borderBottom:`1px solid ${bdr}`, marginBottom:20 }}>
        <div style={{ fontSize:52, marginBottom:8, filter:"drop-shadow(0 0 20px rgba(255,215,0,0.5))" }}>🏆</div>
        <div style={{ fontFamily:font.title, fontSize:"1.8rem", letterSpacing:"3px", background:`linear-gradient(135deg,${gold},${gold2})`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
          ÁLBUM COPA 2026
        </div>
        <div style={{ marginTop:6, display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
          <span style={{ background:`linear-gradient(135deg,${gold},${gold2})`, color:"#000", fontFamily:font.title, fontSize:".8rem", letterSpacing:"1px", padding:"3px 12px", borderRadius:20, fontWeight:900 }}>
            v{APP_VERSION}
          </span>
        </div>
      </div>

      {/* sobre */}
      <div style={{ background:card, border:`1px solid ${bdr}`, borderRadius:16, padding:"18px 16px", marginBottom:14 }}>
        <h3 style={{ fontFamily:font.title, fontSize:"1.1rem", letterSpacing:"1.5px", marginBottom:12, display:"flex", alignItems:"center", gap:8 }}>
          <span>📖</span> SOBRE O APP
        </h3>
        <p style={{ fontSize:".82rem", color:"#ccc", fontWeight:700, lineHeight:1.7, marginBottom:12 }}>
          Este aplicativo foi desenvolvido <strong style={{color:gold}}>100% pelo Claude</strong> (IA da Anthropic), como um experimento pessoal de <strong style={{color:"#efefef"}}>Marcel Inowe</strong>.
        </p>
        <p style={{ fontSize:".82rem", color:"#ccc", fontWeight:700, lineHeight:1.7, marginBottom:12 }}>
          O projeto nasceu da necessidade: nenhuma outra aplicação disponível atendia às necessidades de recursos e usabilidade que eu precisava para controlar meu álbum da Copa 2026.
        </p>
        <p style={{ fontSize:".82rem", color:"#ccc", fontWeight:700, lineHeight:1.7 }}>
          Do zero à versão publicada, todo o código — front-end, lógica, design e infraestrutura AWS — foi gerado em conversas com o Claude, na versão gratuita.
        </p>
      </div>

      {/* features */}
      <div style={{ background:card, border:`1px solid ${bdr}`, borderRadius:16, padding:"18px 16px", marginBottom:14 }}>
        <h3 style={{ fontFamily:font.title, fontSize:"1.1rem", letterSpacing:"1.5px", marginBottom:12, display:"flex", alignItems:"center", gap:8 }}>
          <span>⚡</span> RECURSOS
        </h3>
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {features.map((f,i)=>(
            <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:10 }}>
              <span style={{ color:green, fontSize:".8rem", flexShrink:0, marginTop:1 }}>✓</span>
              <span style={{ fontSize:".8rem", color:"#ccc", fontWeight:700, lineHeight:1.5 }}>{f}</span>
            </div>
          ))}
        </div>
      </div>

      {/* feedback */}
      <div style={{ background:"rgba(255,215,0,0.05)", border:`1.5px solid rgba(255,215,0,0.2)`, borderRadius:16, padding:"18px 16px", marginBottom:14 }}>
        <h3 style={{ fontFamily:font.title, fontSize:"1.1rem", letterSpacing:"1.5px", marginBottom:8, display:"flex", alignItems:"center", gap:8 }}>
          <span>💬</span> FEEDBACK
        </h3>
        <p style={{ fontSize:".82rem", color:"#ccc", fontWeight:700, lineHeight:1.6, marginBottom:14 }}>
          Encontrou um bug? Tem uma sugestão? Adoraria saber! Manda um email:
        </p>
        <a
          href={`mailto:marcel.inowe@gmail.com?subject=Feedback - Álbum Copa 2026 v${APP_VERSION}&body=Olá Marcel,%0D%0A%0D%0A[Descreva seu feedback aqui]%0D%0A%0D%0AApp: Álbum Copa 2026 v${APP_VERSION}`}
          style={{ display:"block", textAlign:"center", padding:"13px 16px", background:`linear-gradient(135deg,${gold},${gold2})`, borderRadius:12, fontFamily:font.title, fontSize:"1rem", letterSpacing:"2px", color:"#000", textDecoration:"none", fontWeight:900 }}
        >
          ✉️ ENVIAR FEEDBACK
        </a>
        <div style={{ textAlign:"center", marginTop:10, fontSize:".72rem", color:muted, fontWeight:700 }}>
          marcel.inowe@gmail.com
        </div>
      </div>

      {/* rodapé */}
      <div style={{ textAlign:"center", padding:"12px 0", color:muted, fontSize:".68rem", fontWeight:700, lineHeight:1.8 }}>
        <div>Álbum Copa 2026 · v{APP_VERSION}</div>
        <div>Desenvolvido com 🤖 Claude (Anthropic)</div>
        <div>© 2026 Marcel Inowe</div>
      </div>

      <div style={{ height:14 }} />
    </div>
  );
}

// ─── HAMBURGER MENU ───────────────────────────────────────────────────────────
function HamburgerMenu({ onSelect }) {
  const [open,setOpen]=useState(false);
  const items=[
    {id:"search",  ico:"🔍", label:"Busca Rápida"},
    {id:"trade",   ico:"🔄", label:"Modo Troca"},
    {id:"packets", ico:"📦", label:"Pacotes"},
    {id:"progress",ico:"📊", label:"Progresso"},
    {id:"map",     ico:"🗺️", label:"Mapa-Múndi"},
    {id:"reports", ico:"📋", label:"Relatórios"},
    {id:"backup",  ico:"💾", label:"Backup"},
    {id:"sobre",   ico:"ℹ️", label:"Sobre"},
  ];
  return (
    <div style={{ position:"relative" }}>
      {open&&<div onClick={()=>setOpen(false)} style={{ position:"fixed",inset:0,zIndex:150 }} />}
      <button onClick={()=>setOpen(o=>!o)} style={{ background:"none",border:`1px solid ${bdr}`,borderRadius:8,color:open?gold:muted,padding:"6px 9px",cursor:"pointer",display:"flex",flexDirection:"column",gap:4,WebkitTapHighlightColor:"transparent",zIndex:160,position:"relative" }}>
        {open?<span style={{ fontSize:16,lineHeight:1,color:gold }}>✕</span>:<>{[0,1,2].map(i=><span key={i} style={{ display:"block",width:18,height:2,background:muted,borderRadius:2 }} />)}</>}
      </button>
      {open&&(
        <div style={{ position:"absolute",top:"calc(100% + 8px)",right:0,background:"rgba(14,14,28,0.98)",border:`1px solid ${bdr}`,borderRadius:12,overflow:"hidden",minWidth:180,zIndex:200,boxShadow:"0 8px 32px rgba(0,0,0,0.5)",animation:"slideDown .15s ease" }}>
          {items.map((item,i)=>(
            <button key={item.id} onClick={()=>{onSelect(item.id);setOpen(false);}} style={{ display:"flex",alignItems:"center",gap:10,width:"100%",padding:"13px 16px",background:"transparent",border:"none",borderBottom:i<items.length-1?`1px solid ${bdr}`:"none",color:"#efefef",fontFamily:font.body,fontSize:".85rem",fontWeight:800,cursor:"pointer",textAlign:"left",WebkitTapHighlightColor:"transparent" }}>
              <span style={{ fontSize:18 }}>{item.ico}</span>{item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── PAGE TITLES ──────────────────────────────────────────────────────────────
const PAGE_TITLES = {
  album:"COPA 2026", doubles:"REPETIDAS", have:"TENHO", miss:"FALTAM",
  search:"BUSCA RÁPIDA", trade:"MODO TROCA", packets:"PACOTES",
  progress:"PROGRESSO", map:"MAPA-MÚNDI", reports:"RELATÓRIOS",
  backup:"BACKUP", sobre:"SOBRE",
};

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function App() {
  const [col,     setCol]     = useState(loadCol);
  const [packets, setPackets] = useState(loadPkt);
  const [page,    setPage]    = useState("album");
  const [toast,   setToast]   = useState(null);
  const [confetti,setConfetti]= useState(false);
  const [banner,  setBanner]  = useState(null);
  const ttRef = useRef(null);

  function showToast(msg,type="ok"){
    setToast({msg,type});
    clearTimeout(ttRef.current);
    ttRef.current=setTimeout(()=>setToast(null),2500);
  }

  const update = useCallback((id,qty)=>{
    setCol(prev=>{ const next={...prev}; if(qty<=0) delete next[id]; else next[id]=qty; persistCol(next); return next; });
  },[]);

  const importCol = useCallback(data=>{ setCol(data); persistCol(data); },[]);

  function addPacket(){ const n=packets+1; setPackets(n); persistPkt(n); }
  function removePacket(){ const n=Math.max(0,packets-1); setPackets(n); persistPkt(n); }
  function resetPackets(){ setPackets(0); persistPkt(0); }

  const [locked,  setLocked]  = useState(false);

  function handleGroupComplete(grp){
    setConfetti(true);
    setBanner(grp);
  }

  const have=Object.values(col).filter(v=>v>0).length;
  const pct=Math.round((have/TOTAL)*100);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Nunito:wght@400;600;700;800;900&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        body{background:#07070e;}
        @keyframes slideDown{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:none}}
        input::placeholder{color:#555;}
        ::-webkit-scrollbar{width:0;}
      `}</style>

      <div style={{ display:"flex",flexDirection:"column",height:"100dvh",background:dark,color:"#efefef",fontFamily:font.body,overflow:"hidden",backgroundImage:"radial-gradient(ellipse at 10% 0%,rgba(255,215,0,0.07) 0%,transparent 50%),radial-gradient(ellipse at 90% 100%,rgba(68,138,255,0.05) 0%,transparent 55%)" }}>

        {/* header */}
        <div style={{ flexShrink:0,background:"rgba(7,7,14,0.97)",backdropFilter:"blur(20px)",borderBottom:`1px solid ${bdr}`,padding:"12px 14px 10px",display:"flex",alignItems:"center",gap:10,zIndex:100 }}>
          {page!=="album"?(
            <button onClick={()=>setPage("album")} style={{ background:"none",border:`1px solid ${bdr}`,borderRadius:8,color:gold,fontSize:".75rem",fontWeight:800,fontFamily:font.body,padding:"5px 10px",cursor:"pointer",WebkitTapHighlightColor:"transparent" }}>← Álbum</button>
          ):(
            <span style={{ fontSize:24,filter:"drop-shadow(0 0 14px rgba(255,215,0,.65))" }}>🏆</span>
          )}
          <div style={{ flex:1 }}>
            <div style={{ fontFamily:font.title,fontSize:"1.3rem",letterSpacing:"2.5px",background:`linear-gradient(135deg,${gold},${gold2})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",lineHeight:1 }}>
              {PAGE_TITLES[page]||"COPA 2026"}
            </div>
            {page==="album"&&<div style={{ fontSize:".6rem",color:muted,fontWeight:800,letterSpacing:".5px",textTransform:"uppercase",marginTop:1 }}>{have} de {TOTAL} figurinhas · {pct}% completo</div>}
          </div>
          <button
            onClick={()=>setLocked(l=>!l)}
            title={locked?"Desbloquear edição":"Bloquear edição"}
            style={{ background:locked?"rgba(255,68,68,0.12)":"rgba(255,215,0,0.06)", border:`1.5px solid ${locked?"rgba(255,68,68,0.5)":"rgba(255,215,0,0.2)"}`, borderRadius:8, padding:"5px 8px", cursor:"pointer", fontSize:16, lineHeight:1, WebkitTapHighlightColor:"transparent", display:"flex", alignItems:"center", justifyContent:"center", transition:"all .2s" }}>
            {locked ? "🔒" : "🔓"}
          </button>
          <HamburgerMenu onSelect={setPage} />
        </div>

        {/* scroll area */}
        <div style={{ flex:1,overflowY:"auto",WebkitOverflowScrolling:"touch" }}>
          {page==="album"   && <AlbumPage    col={col} onUpdate={update} onNavigate={setPage} onGroupComplete={handleGroupComplete} locked={locked} />}
          {page==="doubles" && <DoublesPage  col={col} />}
          {page==="have"    && <HavePage     col={col} />}
          {page==="miss"    && <MissPage     col={col} />}
          {page==="search"  && <SearchPage   col={col} />}
          {page==="trade"   && <TradePage    col={col} onToast={showToast} />}
          {page==="packets" && <PacketsPage  packets={packets} onAdd={addPacket} onRemove={removePacket} onReset={resetPackets} onToast={showToast} />}
          {page==="progress"&& <ProgressPage col={col} />}
          {page==="map"     && <WorldMapPage col={col} />}
          {page==="reports" && <ReportsPage  col={col} onToast={showToast} />}
          {page==="backup"  && <BackupPage   col={col} onImport={importCol} onToast={showToast} />}
          {page==="sobre"   && <SobrePage />}
        </div>

        {toast && <Toast msg={toast.msg} type={toast.type} />}
        {confetti && <Confetti onDone={()=>setConfetti(false)} />}
        {banner && <GroupBanner grp={banner} onDone={()=>setBanner(null)} />}
      </div>
    </>
  );
}
