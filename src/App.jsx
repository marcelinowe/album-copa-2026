import { useState, useCallback, useRef } from "react";

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
    { id:"FWC", name:"FIFA World Cup",  code:"FWC", flag:"🏆", stickers:mkStickers("FWC",0,19) },
    { id:"CC",  name:"Coca-Cola",       code:"CC",  flag:"🥤", stickers:mkStickers("CC",1,14)  },
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
    { id:"FRA", name:"França",   code:"FRA", flag:"🇫🇷", stickers:mkStickers("FRA",1,20) },
    { id:"SEN", name:"Senegal",  code:"SEN", flag:"🇸🇳", stickers:mkStickers("SEN",1,20) },
    { id:"IRQ", name:"Iraque",   code:"IRQ", flag:"🇮🇶", stickers:mkStickers("IRQ",1,20) },
    { id:"NOR", name:"Noruega",  code:"NOR", flag:"🇳🇴", stickers:mkStickers("NOR",1,20) },
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

const ALL_TEAMS = GROUPS.flatMap(g => g.teams);
const TOTAL     = ALL_TEAMS.reduce((a,t) => a + t.stickers.length, 0);
const KEY       = "copa2026_col";

function loadCol()    { try { return JSON.parse(localStorage.getItem(KEY)||"{}"); } catch { return {}; } }
function persistCol(c){ try { localStorage.setItem(KEY, JSON.stringify(c)); } catch {} }

// ─── TOKENS ──────────────────────────────────────────────────────────────────
const gold  = "#FFD700";
const gold2 = "#FFA500";
const dark  = "#07070e";
const card  = "#14142a";
const bdr   = "rgba(255,215,0,0.13)";
const muted = "#666";
const green = "#00c853";

const font = { title:"'Bebas Neue', sans-serif", body:"'Nunito', sans-serif" };

// ─── TOAST ───────────────────────────────────────────────────────────────────
function Toast({ msg, type }) {
  if (!msg) return null;
  const ok = type !== "err";
  return (
    <div style={{
      position:"fixed", bottom:72, left:"50%", transform:"translateX(-50%)",
      background: ok ? "rgba(0,200,83,0.12)" : "rgba(255,23,68,0.12)",
      border:`1px solid ${ok?"rgba(0,200,83,0.4)":"rgba(255,23,68,0.4)"}`,
      borderRadius:9, padding:"9px 16px", fontSize:".8rem", fontWeight:800,
      color: ok ? "#69ff94" : "#ff6b6b",
      zIndex:999, whiteSpace:"nowrap", pointerEvents:"none",
    }}>{msg}</div>
  );
}

// ─── STICKER CELL ─────────────────────────────────────────────────────────────
function StickerCell({ s, qty, onInc, onDec }) {
  const st = qty === 0 ? "empty" : qty === 1 ? "have" : "dbl";
  const ico = qty === 0 ? "✦" : qty === 1 ? "✅" : "⭐";
  const bc  = st==="have" ? green : st==="dbl" ? gold : bdr;
  const bg  = st==="have"
    ? "linear-gradient(135deg,rgba(0,200,83,.13),rgba(0,200,83,.03))"
    : st==="dbl"
    ? "linear-gradient(135deg,rgba(255,215,0,.15),rgba(255,165,0,.05))"
    : "rgba(255,255,255,0.02)";
  const lc = st==="have" ? "#69ff94" : st==="dbl" ? gold : muted;

  return (
    <div onClick={onInc} style={{
      aspectRatio:"3/4", borderRadius:9, border:`2px solid ${bc}`, background:bg,
      display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
      cursor:"pointer", position:"relative", userSelect:"none",
      WebkitTapHighlightColor:"transparent", overflow:"hidden",
    }}>
      {qty > 1 && (
        <div style={{
          position:"absolute", top:2, right:2, width:15, height:15,
          background:gold, color:"#000", borderRadius:"50%",
          fontSize:".5rem", fontWeight:900, display:"flex", alignItems:"center", justifyContent:"center",
        }}>{qty}</div>
      )}
      <div style={{ fontSize:13, marginBottom:1 }}>{ico}</div>
      <div style={{ fontSize:".5rem", fontWeight:800, color:lc, textTransform:"uppercase", letterSpacing:".2px", textAlign:"center", lineHeight:1.2 }}>{s.label}</div>
      {qty > 0 && (
        <div style={{ display:"flex", alignItems:"center", gap:1, marginTop:2 }} onClick={e=>e.stopPropagation()}>
          <button onClick={onDec} style={qbStyle}>−</button>
          <span style={{ fontSize:".58rem", fontWeight:800, minWidth:11, textAlign:"center" }}>{qty}</span>
          <button onClick={onInc} style={qbStyle}>+</button>
        </div>
      )}
    </div>
  );
}

const qbStyle = {
  width:17, height:17, border:"1px solid rgba(255,255,255,0.1)",
  background:"rgba(255,255,255,0.07)", color:"#efefef", borderRadius:4,
  fontSize:13, fontWeight:900, cursor:"pointer", display:"flex",
  alignItems:"center", justifyContent:"center", padding:0, lineHeight:1,
  WebkitTapHighlightColor:"transparent",
};

// ─── STICKER PANEL ───────────────────────────────────────────────────────────
function StickerPanel({ team, col, onUpdate, onClose }) {
  const owned = team.stickers.filter(s=>(col[s.id]||0)>0).length;
  return (
    <div style={{
      gridColumn:"1 / -1",
      background:"rgba(255,215,0,0.03)",
      border:"1.5px solid rgba(255,215,0,.2)",
      borderRadius:13, overflow:"hidden",
      animation:"slideDown .18s ease",
    }}>
      <div style={{ display:"flex", alignItems:"center", gap:8, padding:"9px 12px", borderBottom:"1px solid rgba(255,215,0,.1)", background:"rgba(255,215,0,0.04)" }}>
        <span style={{ fontSize:18 }}>{team.flag}</span>
        <span style={{ fontFamily:font.title, fontSize:".95rem", letterSpacing:1 }}>{team.name}</span>
        <span style={{ fontFamily:font.body, fontSize:".62rem", color:muted, fontWeight:800 }}>{owned}/{team.stickers.length}</span>
        <button onClick={onClose} style={{ marginLeft:"auto", background:"none", border:`1px solid ${bdr}`, borderRadius:6, color:muted, fontSize:".68rem", fontWeight:800, fontFamily:font.body, cursor:"pointer", padding:"3px 9px", WebkitTapHighlightColor:"transparent" }}>
          ✕ Fechar
        </button>
      </div>
      {/* 4 stickers per row */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:5, padding:8 }}>
        {team.stickers.map(s => (
          <StickerCell
            key={s.id} s={s} qty={col[s.id]||0}
            onInc={e=>{ if(e) e.stopPropagation(); onUpdate(s.id,(col[s.id]||0)+1); }}
            onDec={e=>{ if(e) e.stopPropagation(); onUpdate(s.id,Math.max(0,(col[s.id]||0)-1)); }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── TEAM CARD ───────────────────────────────────────────────────────────────
function TeamCard({ team, col, isOpen, onToggle }) {
  const owned  = team.stickers.filter(s=>(col[s.id]||0)>0).length;
  const total  = team.stickers.length;
  const pct    = Math.round((owned/total)*100);
  const isFull = owned === total;
  const bc = isOpen ? "rgba(255,215,0,.6)" : isFull ? "rgba(0,200,83,.45)" : bdr;

  return (
    <div onClick={onToggle} style={{ background: isOpen ? "rgba(255,215,0,0.05)" : card, border:`1.5px solid ${bc}`, borderRadius:13, cursor:"pointer", WebkitTapHighlightColor:"transparent", userSelect:"none", overflow:"hidden", transition:"border-color .15s" }}>
      <div style={{ padding:"10px 6px 8px", display:"flex", flexDirection:"column", alignItems:"center", gap:1 }}>
        <span style={{ fontSize:24, lineHeight:1 }}>{team.flag}</span>
        <span style={{ fontFamily:font.title, fontSize:".72rem", letterSpacing:1, color:muted, marginTop:2 }}>{team.code}</span>
        <span style={{ fontFamily:font.body, fontSize:".6rem", fontWeight:800, textAlign:"center", lineHeight:1.2 }}>{team.name}</span>
        <span style={{ fontSize:".56rem", fontWeight:800, color:isFull?green:muted, marginTop:2 }}>{owned}/{total}</span>
        <div style={{ width:"100%", height:3, background:"rgba(255,255,255,0.07)", borderRadius:99, overflow:"hidden", marginTop:4 }}>
          <div style={{ height:"100%", width:pct+"%", background:isFull?green:`linear-gradient(90deg,${gold},${gold2})`, borderRadius:99, transition:"width .3s" }} />
        </div>
      </div>
    </div>
  );
}

// ─── GROUP SECTION ────────────────────────────────────────────────────────────
function GroupSection({ grp, col, openTeamId, onToggle, onUpdate }) {
  const grpOwned = grp.teams.reduce((a,t)=>a+t.stickers.filter(s=>(col[s.id]||0)>0).length,0);
  const grpTotal = grp.teams.reduce((a,t)=>a+t.stickers.length,0);

  // Build grid children: team cards + panel injected after its row end
  const COLS = 3;
  const children = [];
  grp.teams.forEach((team, idx) => {
    children.push(
      <TeamCard key={team.id} team={team} col={col} isOpen={openTeamId===team.id} onToggle={()=>onToggle(team.id)} />
    );
    if (team.id === openTeamId) {
      // fill remaining cells in row with invisible placeholders so panel starts on next row
      const remaining = COLS - 1 - (idx % COLS);
      for (let r = 0; r < remaining; r++) {
        children.push(<div key={`ph-${team.id}-${r}`} />);
      }
      children.push(
        <StickerPanel key={"panel-"+team.id} team={team} col={col} onUpdate={onUpdate} onClose={()=>onToggle(team.id)} />
      );
    }
  });

  return (
    <div style={{ marginBottom:4 }}>
      <div style={{ display:"flex", alignItems:"center", gap:8, padding:"12px 12px 5px", fontFamily:font.title, fontSize:"1rem", letterSpacing:"2px" }}>
        <span style={{ background:`linear-gradient(135deg,${gold},${gold2})`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>{grp.name}</span>
        <div style={{ flex:1, height:1, background:bdr }} />
        <span style={{ fontFamily:font.body, fontSize:".62rem", color:muted, fontWeight:800 }}>{grpOwned}/{grpTotal}</span>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:7, padding:"0 12px 6px" }}>
        {children}
      </div>
    </div>
  );
}

// ─── ALBUM PAGE ───────────────────────────────────────────────────────────────
function AlbumPage({ col, onUpdate }) {
  const [search,     setSearch]     = useState("");
  const [openTeamId, setOpenTeamId] = useState(null);

  const toggle = useCallback((teamId) => {
    setOpenTeamId(prev => prev === teamId ? null : teamId);
  }, []);

  const vals = Object.values(col);
  const have = vals.filter(v=>v>0).length;
  const dbl  = vals.filter(v=>v>1).length;
  const miss = TOTAL - have;
  const pct  = Math.round((have/TOTAL)*100);

  const filtered = search.trim()
    ? GROUPS.map(g=>({...g, teams:g.teams.filter(t=>
        t.name.toLowerCase().includes(search.toLowerCase())||
        t.code.toLowerCase().includes(search.toLowerCase())||
        g.name.toLowerCase().includes(search.toLowerCase())||
        t.stickers.some(s=>s.label.toLowerCase().includes(search.toLowerCase()))
      )})).filter(g=>g.teams.length>0)
    : GROUPS;

  return (
    <>
      {/* stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:6, padding:"10px 12px 6px" }}>
        {[["Tenho",have],["Faltam",miss],["Repetidas",dbl],["Completo",pct+"%"]].map(([l,v])=>(
          <div key={l} style={{ background:card, border:`1px solid ${bdr}`, borderRadius:13, padding:"10px 4px", textAlign:"center" }}>
            <div style={{ fontFamily:font.title, fontSize:"1.5rem", background:`linear-gradient(135deg,${gold},${gold2})`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", lineHeight:1 }}>{v}</div>
            <div style={{ fontSize:".55rem", color:muted, fontWeight:800, textTransform:"uppercase", letterSpacing:".3px", marginTop:2 }}>{l}</div>
          </div>
        ))}
      </div>

      {/* progress */}
      <div style={{ padding:"2px 12px 8px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", fontSize:".68rem", color:muted, fontWeight:800, marginBottom:4 }}>
          <span>Progresso geral</span><span>{have} / {TOTAL}</span>
        </div>
        <div style={{ height:6, background:"rgba(255,255,255,0.05)", borderRadius:99, overflow:"hidden" }}>
          <div style={{ height:"100%", width:pct+"%", background:`linear-gradient(90deg,${gold},${gold2})`, borderRadius:99, transition:"width .5s ease" }} />
        </div>
      </div>

      {/* search */}
      <div style={{ padding:"2px 12px 8px" }}>
        <input value={search} onChange={e=>setSearch(e.target.value)}
          placeholder="🔍 Buscar (ex: BRA 7, Brasil, Grupo C...)"
          autoComplete="off" autoCorrect="off" spellCheck={false}
          style={{ width:"100%", padding:"10px 14px", background:card, border:`1.5px solid ${bdr}`, borderRadius:10, color:"#efefef", fontFamily:font.body, fontSize:".9rem", outline:"none", WebkitAppearance:"none" }}
        />
      </div>

      {/* groups */}
      {filtered.map(grp=>(
        <GroupSection key={grp.id} grp={grp} col={col} openTeamId={openTeamId} onToggle={toggle} onUpdate={onUpdate} />
      ))}
      <div style={{ height:14 }} />
    </>
  );
}

// ─── DOUBLES PAGE ─────────────────────────────────────────────────────────────
function DoublesPage({ col }) {
  let totalExtra = 0;
  const sections = [];
  for (const grp of GROUPS) {
    const teamItems = [];
    for (const team of grp.teams) {
      const items = team.stickers.filter(s=>(col[s.id]||0)>1);
      if (items.length) { totalExtra += items.reduce((a,s)=>a+(col[s.id]-1),0); teamItems.push({team,items}); }
    }
    if (teamItems.length) sections.push({grp,teamItems});
  }
  return (
    <div>
      <div style={{ padding:"16px 12px 8px" }}>
        <h2 style={{ fontFamily:font.title, fontSize:"1.5rem", letterSpacing:"2px" }}>⭐ REPETIDAS</h2>
        <p style={{ color:muted, fontSize:".8rem", fontWeight:700, marginTop:2 }}>
          {totalExtra>0 ? `${totalExtra} figurinha${totalExtra!==1?"s":""} para trocar` : "Nenhuma repetida ainda"}
        </p>
      </div>
      {sections.length===0 ? (
        <div style={{ textAlign:"center", padding:"50px 20px", color:muted }}>
          <div style={{ fontSize:46, marginBottom:10 }}>🎉</div>
          <p style={{ fontSize:".88rem", fontWeight:700, lineHeight:1.6 }}>Nenhuma repetida ainda!<br/>Continue colando suas figurinhas.</p>
        </div>
      ) : sections.map(({grp,teamItems})=>(
        <div key={grp.id}>
          <div style={{ padding:"8px 12px", fontFamily:font.title, fontSize:".85rem", letterSpacing:1, color:gold, background:card, borderTop:`1px solid ${bdr}`, borderBottom:`1px solid ${bdr}`, margin:"5px 0 0" }}>⚽ {grp.name}</div>
          {teamItems.map(({team,items})=>(
            <div key={team.id}>
              <div style={{ display:"flex", alignItems:"center", gap:6, padding:"6px 12px 3px", fontFamily:font.body, fontSize:".75rem", fontWeight:800 }}>{team.flag} <strong>{team.name}</strong></div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:5, padding:"0 12px 6px" }}>
                {items.map(s=>(
                  <div key={s.id} style={{ background:"linear-gradient(135deg,rgba(255,215,0,.12),rgba(255,165,0,.05))", border:"1.5px solid rgba(255,215,0,.28)", borderRadius:7, padding:"4px 9px", fontSize:".7rem", fontWeight:800, display:"flex", alignItems:"center", gap:4, color:gold }}>
                    {s.label}
                    <span style={{ background:gold, color:"#000", borderRadius:20, padding:"1px 6px", fontSize:".6rem" }}>×{col[s.id]-1} extra</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
      <div style={{ height:14 }} />
    </div>
  );
}

// ─── REPORTS PAGE ─────────────────────────────────────────────────────────────
function ReportsPage({ col, onToast }) {
  const vals = Object.values(col);
  const have = vals.filter(v=>v>0).length;
  const dbl  = vals.filter(v=>v>1).length;
  const miss = TOTAL-have;
  const pct  = Math.round((have/TOTAL)*100);

  function dl(content, filename) {
    const a = Object.assign(document.createElement("a"),{
      href:URL.createObjectURL(new Blob([content],{type:"text/plain;charset=utf-8"})),
      download:filename,
    });
    document.body.appendChild(a);a.click();document.body.removeChild(a);
  }

  function build(type) {
    const now = new Date().toLocaleString("pt-BR");
    const lines = ["═══════════════════════════════════════","       ÁLBUM COPA DO MUNDO 2026","═══════════════════════════════════════",`Gerado em: ${now}`,`Total: ${have}/${TOTAL} (${pct}%) | Faltam: ${miss} | Repetidas: ${dbl}`,""];
    const add = (label,filter,fmt) => {
      lines.push("───────────────────────────────────────",`  ${label}`,"───────────────────────────────────────");
      for (const grp of GROUPS) {
        const gl=[];
        for (const team of grp.teams) {
          const items=team.stickers.filter(filter(team));
          if(items.length) gl.push(`  ${team.flag} ${team.name}: ${items.map(fmt).join(", ")}`);
        }
        if(gl.length){lines.push("","▸ "+grp.name,...gl);}
      }
      lines.push("");
    };
    if(type==="have"||type==="all") add(`✅ FIGURINHAS CONSEGUIDAS (${have})`,()=>s=>(col[s.id]||0)>0,s=>s.label);
    if(type==="miss"||type==="all") add(`❌ FIGURINHAS FALTANDO (${miss})`,()=>s=>(col[s.id]||0)===0,s=>s.label);
    if(type==="dbl"||type==="all")  add(`⭐ FIGURINHAS REPETIDAS (${dbl} tipos)`,()=>s=>(col[s.id]||0)>1,s=>`${s.label} (×${col[s.id]-1} extra)`);
    lines.push("═══════════════════════════════════════");
    return lines.join("\n");
  }

  const cards=[
    {label:"✅ Conseguidas",desc:"Todas que você já tem.",type:"have",g:["#00c853","#009640"],dark:false},
    {label:"❌ Faltando",desc:"Tudo que falta para completar.",type:"miss",g:["#448aff","#1565c0"],dark:false},
    {label:"⭐ Repetidas",desc:"Suas repetidas com quantidade extra.",type:"dbl",g:[gold,gold2],dark:true},
    {label:"📋 Completo",desc:"Conseguidas, faltando e repetidas.",type:"all",g:["#ff6f00","#e65100"],dark:false},
  ];

  return (
    <div style={{ padding:"16px 12px" }}>
      <h2 style={{ fontFamily:font.title, fontSize:"1.5rem", letterSpacing:"2px" }}>📊 RELATÓRIOS</h2>
      <p style={{ color:muted, fontSize:".78rem", fontWeight:700, marginTop:2, marginBottom:16, lineHeight:1.5 }}>Exporte listas em .txt fáceis de compartilhar.</p>
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {cards.map(c=>(
          <div key={c.type} style={{ background:card, border:`1px solid ${bdr}`, borderRadius:13, padding:"14px 12px" }}>
            <h3 style={{ fontFamily:font.title, fontSize:".95rem", letterSpacing:1, marginBottom:4 }}>{c.label}</h3>
            <p style={{ color:muted, fontSize:".7rem", fontWeight:700, lineHeight:1.45, marginBottom:10 }}>{c.desc}</p>
            <button onClick={()=>{dl(build(c.type),`copa2026-${c.type}.txt`);onToast("✅ Relatório exportado!","ok");}}
              style={{ width:"100%", padding:12, border:"none", borderRadius:9, fontFamily:font.title, fontSize:".9rem", letterSpacing:"1.5px", cursor:"pointer", background:`linear-gradient(135deg,${c.g[0]},${c.g[1]})`, color:c.dark?"#000":"#fff", WebkitTapHighlightColor:"transparent" }}>
              ⬇ EXPORTAR
            </button>
          </div>
        ))}
      </div>
      <div style={{ height:14 }} />
    </div>
  );
}

// ─── BACKUP PAGE ──────────────────────────────────────────────────────────────
function BackupPage({ col, onImport, onToast }) {
  function exportBackup() {
    const a = Object.assign(document.createElement("a"),{
      href:URL.createObjectURL(new Blob([JSON.stringify({version:2,exportedAt:new Date().toISOString(),collection:col},null,2)],{type:"application/json"})),
      download:"album-copa-backup.json",
    });
    document.body.appendChild(a);a.click();document.body.removeChild(a);
    onToast("✅ Backup exportado!","ok");
  }
  function importBackup(e) {
    const file=e.target.files[0]; if(!file) return;
    const reader=new FileReader();
    reader.onload=ev=>{
      try {
        const parsed=JSON.parse(ev.target.result);
        const data=parsed.collection||parsed;
        if(typeof data!=="object"||Array.isArray(data)) throw new Error();
        onImport(data); onToast("✅ Backup restaurado!","ok");
      } catch { onToast("❌ Arquivo inválido","err"); }
      e.target.value="";
    };
    reader.readAsText(file);
  }
  const cs={background:card,border:`1px solid ${bdr}`,borderRadius:13,padding:16,marginBottom:10};
  const bs=(g1,g2,dk)=>({width:"100%",padding:13,border:"none",borderRadius:10,fontFamily:font.title,fontSize:"1rem",letterSpacing:"2px",cursor:"pointer",background:`linear-gradient(135deg,${g1},${g2})`,color:dk?"#000":"#fff",WebkitTapHighlightColor:"transparent"});
  return (
    <div style={{ padding:"16px 12px" }}>
      <h2 style={{ fontFamily:font.title, fontSize:"1.5rem", letterSpacing:"2px", marginBottom:4 }}>💾 BACKUP</h2>
      <p style={{ color:muted, fontSize:".75rem", fontWeight:700, marginBottom:18, lineHeight:1.5 }}>Salve seus dados antes de atualizar o app.</p>
      <div style={cs}>
        <h3 style={{ fontFamily:font.title, fontSize:"1rem", letterSpacing:1, marginBottom:4 }}>📤 Exportar dados</h3>
        <p style={{ color:muted, fontSize:".72rem", fontWeight:700, lineHeight:1.45, marginBottom:10 }}>Baixa <strong style={{color:gold}}>album-copa-backup.json</strong> com todas as suas figurinhas.</p>
        <button onClick={exportBackup} style={bs(gold,gold2,true)}>⬇ BAIXAR BACKUP</button>
      </div>
      <div style={cs}>
        <h3 style={{ fontFamily:font.title, fontSize:"1rem", letterSpacing:1, marginBottom:4 }}>📥 Importar dados</h3>
        <p style={{ color:muted, fontSize:".72rem", fontWeight:700, lineHeight:1.45, marginBottom:10 }}>Restaura a partir de um arquivo de backup.</p>
        <label style={{display:"block"}}>
          <div style={bs(green,"#009640",false)}>⬆ CARREGAR BACKUP</div>
          <input type="file" accept=".json,application/json" onChange={importBackup} style={{display:"none"}} />
        </label>
      </div>
      <div style={{ background:"rgba(255,215,0,0.05)", border:`1px solid rgba(255,215,0,.12)`, borderRadius:9, padding:"11px 13px", fontSize:".71rem", color:muted, fontWeight:700, lineHeight:1.55 }}>
        <strong style={{color:gold}}>💡 Dica:</strong> Antes de atualizar o app, exporte o backup. Depois importe para restaurar seus dados.
      </div>
      <div style={{ height:14 }} />
    </div>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
const TABS = [
  {id:"album",   ico:"📋", label:"Álbum"},
  {id:"doubles", ico:"⭐", label:"Repetidas"},
  {id:"reports", ico:"📊", label:"Relatórios"},
  {id:"backup",  ico:"💾", label:"Backup"},
];

export default function App() {
  const [col,    setCol]   = useState(loadCol);
  const [page,   setPage]  = useState("album");
  const [toast,  setToast] = useState(null);
  const ttRef = useRef(null);

  function showToast(msg, type="ok") {
    setToast({msg,type});
    clearTimeout(ttRef.current);
    ttRef.current = setTimeout(()=>setToast(null),2500);
  }

  const update = useCallback((id, qty) => {
    setCol(prev=>{
      const next={...prev};
      if(qty<=0) delete next[id]; else next[id]=qty;
      persistCol(next);
      return next;
    });
  },[]);

  const importCol = useCallback(data=>{ setCol(data); persistCol(data); },[]);

  const have   = Object.values(col).filter(v=>v>0).length;
  const dblCnt = Object.values(col).filter(v=>v>1).length;
  const pct    = Math.round((have/TOTAL)*100);

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

      <div style={{ display:"flex", flexDirection:"column", height:"100dvh", background:dark, color:"#efefef", fontFamily:font.body, overflow:"hidden", backgroundImage:"radial-gradient(ellipse at 10% 0%,rgba(255,215,0,0.07) 0%,transparent 50%),radial-gradient(ellipse at 90% 100%,rgba(68,138,255,0.05) 0%,transparent 55%)" }}>

        {/* header */}
        <div style={{ flexShrink:0, background:"rgba(7,7,14,0.97)", backdropFilter:"blur(20px)", borderBottom:`1px solid ${bdr}`, padding:"12px 14px 10px", display:"flex", alignItems:"center", gap:10, zIndex:100 }}>
          <span style={{ fontSize:24, filter:"drop-shadow(0 0 14px rgba(255,215,0,.65))" }}>🏆</span>
          <div style={{ flex:1 }}>
            <div style={{ fontFamily:font.title, fontSize:"1.3rem", letterSpacing:"2.5px", background:`linear-gradient(135deg,${gold},${gold2})`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", lineHeight:1 }}>COPA 2026</div>
            <div style={{ fontSize:".6rem", color:muted, fontWeight:800, letterSpacing:".5px", textTransform:"uppercase", marginTop:1 }}>{have} de {TOTAL} figurinhas · {pct}% completo</div>
          </div>
        </div>

        {/* scroll area */}
        <div style={{ flex:1, overflowY:"auto", WebkitOverflowScrolling:"touch" }}>
          {page==="album"   && <AlbumPage   col={col} onUpdate={update} />}
          {page==="doubles" && <DoublesPage col={col} />}
          {page==="reports" && <ReportsPage col={col} onToast={showToast} />}
          {page==="backup"  && <BackupPage  col={col} onImport={importCol} onToast={showToast} />}
        </div>

        {/* bottom nav */}
        <div style={{ flexShrink:0, display:"flex", background:"rgba(7,7,14,0.98)", borderTop:`1px solid ${bdr}` }}>
          {TABS.map(t=>(
            <button key={t.id} onClick={()=>setPage(t.id)} style={{ flex:1, padding:"10px 4px", border:"none", background:"transparent", color:page===t.id?gold:muted, fontFamily:font.body, fontSize:".58rem", fontWeight:800, cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:2, textTransform:"uppercase", letterSpacing:".4px", WebkitTapHighlightColor:"transparent" }}>
              <span style={{ fontSize:19 }}>{t.ico}</span>
              {t.id==="doubles"&&dblCnt>0 ? `Rep.(${dblCnt})` : t.label}
            </button>
          ))}
        </div>

        {toast && <Toast msg={toast.msg} type={toast.type} />}
      </div>
    </>
  );
}
