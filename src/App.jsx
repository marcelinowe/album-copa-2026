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
const AVU_KEY   = "copa2026_avu";
const LOCK_KEY   = "copa2026_lock";
const CELE_KEY   = "copa2026_celebrated";
const THEME_KEY  = "copa2026_theme";
const ACCENT_KEY = "copa2026_accent";
const PRICE      = 7;

function loadCol() { try { return JSON.parse(localStorage.getItem(KEY)||"{}"); } catch { return {}; } }
function persistCol(c) { try { localStorage.setItem(KEY, JSON.stringify(c)); } catch {} }
function loadPkt() { try { return parseInt(localStorage.getItem(PKT_KEY)||"0"); } catch { return 0; } }
function persistPkt(n) { try { localStorage.setItem(PKT_KEY, String(n)); } catch {} }
function loadAvu() { try { return JSON.parse(localStorage.getItem(AVU_KEY)||"[]"); } catch { return []; } }
function persistAvu(a) { try { localStorage.setItem(AVU_KEY, JSON.stringify(a)); } catch {} }
function loadLock() { return localStorage.getItem(LOCK_KEY) === "1"; }
function persistLock(v) { localStorage.setItem(LOCK_KEY, v ? "1" : "0"); }
function loadCelebrated() { try { return new Set(JSON.parse(localStorage.getItem(CELE_KEY)||"[]")); } catch { return new Set(); } }
function persistCelebrated(s) { localStorage.setItem(CELE_KEY, JSON.stringify([...s])); }
function loadTheme()  { return localStorage.getItem(THEME_KEY)  || "dark"; }
function persistTheme(v)  { localStorage.setItem(THEME_KEY, v); }
function loadAccent() { return localStorage.getItem(ACCENT_KEY) || "gold"; }
function persistAccent(v) { localStorage.setItem(ACCENT_KEY, v); }

// ─── SYNC COMPRESSION ────────────────────────────────────────────────────────
// Compact format: encode all stickers as a positional string
// Each sticker gets a single char: '0'=none, '1'=have 1, '2'=have 2, etc.
// Then RLE compress: "000011100" -> "4z1z3z" type scheme
// Then base64 encode

// Build ordered sticker list once
const ORDERED_STICKERS = GROUPS.flatMap(g => g.teams.flatMap(t => t.stickers));

function encodeCollection(col) {
  try {
    // Build value string: one char per sticker (0-9, capped at 9)
    const raw = ORDERED_STICKERS.map(s => Math.min(col[s.id]||0, 9).toString()).join("");

    // RLE compress: consecutive same chars -> count+char (if count>1)
    let rle = "";
    let i = 0;
    while(i < raw.length) {
      const ch = raw[i];
      let count = 1;
      while(i + count < raw.length && raw[i+count] === ch && count < 99) count++;
      rle += count > 1 ? count + ch : ch;
      i += count;
    }

    return btoa(unescape(encodeURIComponent(rle)));
  } catch { return ""; }
}

function decodeCollection(str) {
  try {
    const rle = decodeURIComponent(escape(atob(str)));

    // Decompress RLE
    let raw = "";
    let i = 0;
    while(i < rle.length) {
      // Check if current chars form a number prefix
      let numStr = "";
      while(i < rle.length && rle[i] >= "0" && rle[i] <= "9" && numStr.length < 2) {
        numStr += rle[i++];
      }
      if(i >= rle.length) break;
      const ch    = rle[i++];
      const count = numStr ? parseInt(numStr) : 1;
      raw += ch.repeat(count);
    }

    // Rebuild collection
    const col = {};
    ORDERED_STICKERS.forEach((s, idx) => {
      const qty = parseInt(raw[idx]||"0");
      if(qty > 0) col[s.id] = qty;
    });
    return col;
  } catch { return null; }
}

// ─── TOKENS ──────────────────────────────────────────────────────────────────
const green = "#00c853";
const red   = "#ff4444";
const font  = { title:"'Bebas Neue', sans-serif", body:"'Nunito', sans-serif" };

// ── ACCENT PALETTES ──────────────────────────────────────────────────────────
const ACCENTS = [
  { id:"gold",   label:"Dourado",  color:"#FFD700", color2:"#FFA500" },
  { id:"blue",   label:"Azul",     color:"#448aff", color2:"#1565c0" },
  { id:"green",  label:"Verde",    color:"#00c853", color2:"#009640" },
  { id:"purple", label:"Roxo",     color:"#ce93d8", color2:"#9c27b0" },
  { id:"red",    label:"Vermelho", color:"#ff5252", color2:"#c62828" },
  { id:"cyan",   label:"Ciano",    color:"#18ffff", color2:"#00b8d4" },
  { id:"orange", label:"Laranja",  color:"#ff6d00", color2:"#e65100" },
  { id:"pink",   label:"Rosa",     color:"#f48fb1", color2:"#c2185b" },
];

// ── BASE THEMES (backgrounds only — accent applied separately) ───────────────
const THEMES = {
  dark: {
    name:"🌑 Escuro", isDark:true,
    "--bg":"#07070e","--card":"#14142a","--card2":"#1a1a35",
    "--text":"#efefef","--muted":"#666","--hdr":"rgba(7,7,14,0.97)",
    "--input-bg":"#14142a","--ph":"#555",
  },
  light: {
    name:"☀️ Claro", isDark:false,
    "--bg":"#f0f2f5","--card":"#ffffff","--card2":"#e8eaed",
    "--text":"#111111","--muted":"#888","--hdr":"rgba(240,242,245,0.97)",
    "--input-bg":"#e8eaed","--ph":"#aaa",
  },
  amoled: {
    name:"⚫ AMOLED", isDark:true,
    "--bg":"#000000","--card":"#0d0d0d","--card2":"#141414",
    "--text":"#efefef","--muted":"#555","--hdr":"rgba(0,0,0,0.98)",
    "--input-bg":"#0d0d0d","--ph":"#444",
  },
  ocean: {
    name:"🌊 Oceano", isDark:true,
    "--bg":"#020c18","--card":"#0a1f35","--card2":"#0d2845",
    "--text":"#e0f0ff","--muted":"#5588aa","--hdr":"rgba(2,12,24,0.97)",
    "--input-bg":"#0a1f35","--ph":"#446688",
  },
  forest: {
    name:"🌲 Floresta", isDark:true,
    "--bg":"#021008","--card":"#0a2010","--card2":"#0d2a14",
    "--text":"#e0ffe8","--muted":"#4a8a5a","--hdr":"rgba(2,16,8,0.97)",
    "--input-bg":"#0a2010","--ph":"#336644",
  },
  sunset: {
    name:"🌅 Pôr do Sol", isDark:true,
    "--bg":"#120818","--card":"#1e0a28","--card2":"#280e35",
    "--text":"#ffe8d0","--muted":"#8a5a6a","--hdr":"rgba(18,8,24,0.97)",
    "--input-bg":"#1e0a28","--ph":"#664455",
  },
  grape: {
    name:"🍇 Uva", isDark:true,
    "--bg":"#0e0518","--card":"#1a0a28","--card2":"#220d35",
    "--text":"#f0e0ff","--muted":"#7755aa","--hdr":"rgba(14,5,24,0.97)",
    "--input-bg":"#1a0a28","--ph":"#5533aa",
  },
  brasil: {
    name:"🇧🇷 Brasil", isDark:true,
    "--bg":"#011a06","--card":"#042210","--card2":"#052d14",
    "--text":"#fefde8","--muted":"#6a8840","--hdr":"rgba(1,26,6,0.97)",
    "--input-bg":"#042210","--ph":"#4a6630",
  },
};

function themeCSS(themeKey, accentId) {
  const t = THEMES[themeKey] || THEMES.dark;
  const a = ACCENTS.find(x=>x.id===accentId) || ACCENTS[0];
  const isDark = t.isDark !== false;

  // border uses accent color at low opacity
  const bdrAlpha = isDark ? "0.18" : "0.25";
  const bdrVal   = `${hexToRgb(a.color)},${bdrAlpha}`;

  const bgImg = isDark
    ? `radial-gradient(ellipse at 10% 0%,${hexToRgba(a.color, 0.07)} 0%,transparent 50%),radial-gradient(ellipse at 90% 100%,${hexToRgba(a.color2, 0.05)} 0%,transparent 55%)`
    : `radial-gradient(ellipse at 10% 0%,${hexToRgba(a.color, 0.05)} 0%,transparent 50%),radial-gradient(ellipse at 90% 100%,${hexToRgba(a.color2, 0.04)} 0%,transparent 55%)`;

  const vars = {
    ...t,
    "--accent":   a.color,
    "--accent2":  a.color2,
    "--bdr":      `rgba(${bdrVal})`,
    "--bg-img":   bgImg,
  };
  // remove non-CSS keys
  const { name, isDark: _d, ...cssVars } = vars;
  return Object.entries(cssVars).map(([k,v]) => `${k}:${v};`).join("");
}

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return `${r},${g},${b}`;
}
function hexToRgba(hex, alpha) {
  return `rgba(${hexToRgb(hex)},${alpha})`;
}

// Bare variable aliases
const bdr     = "var(--bdr)";
const text    = "var(--text)";
const muted   = "var(--muted)";
const card    = "var(--card)";
const card2   = "var(--card2)";
const bg      = "var(--bg)";
const inputBg = "var(--input-bg)";
const hdr     = "var(--hdr)";
const C = {
  bg:"var(--bg)", card:"var(--card)", card2:"var(--card2)",
  bdr:"var(--bdr)", text:"var(--text)", muted:"var(--muted)",
  hdr:"var(--hdr)", inputBg:"var(--input-bg)",
};

// accent aliases — always use var(--accent) so theme switching works live
const gold  = "var(--accent)";
const gold2 = "var(--accent2)";
function teamProgress(team, col) {
  const owned = team.stickers.filter(s=>(col[s.id]||0)>0).length;
  return { owned, total:team.stickers.length, pct:Math.round((owned/team.stickers.length)*100), full:owned===team.stickers.length };
}

// ─── CLEARABLE INPUT ─────────────────────────────────────────────────────────
function ClearableInput({ value, onChange, placeholder, autoFocus, style}) {
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
function GroupBanner({ grp, onDone}) {
  useEffect(() => { const t = setTimeout(onDone, 2500); return ()=>clearTimeout(t); }, []);
  return (
    <div style={{ position:"fixed",inset:0,display:"flex",alignItems:"center",justifyContent:"center",zIndex:998,background:"rgba(0,0,0,0.6)",backdropFilter:"blur(4px)" }}>
      <div style={{ background:"var(--card)",border:`2px solid ${gold}`,borderRadius:20,padding:"32px 40px",textAlign:"center",animation:"slideDown .3s ease",boxShadow:`0 0 40px rgba(255,215,0,0.3)` }}>
        <div style={{ fontSize:52, marginBottom:8 }}>🏆</div>
        <div style={{ fontFamily:font.title,fontSize:"1.6rem",letterSpacing:"2px",background:`linear-gradient(135deg,${gold},${gold2})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent" }}>GRUPO COMPLETO!</div>
        <div style={{ color:"var(--text)",fontWeight:800,marginTop:6,fontSize:".9rem" }}>{grp.name}</div>
        <div style={{ color:"var(--muted)",fontSize:".75rem",marginTop:4 }}>Parabéns! 🎉</div>
      </div>
    </div>
  );
}

// ─── STICKER CELL ─────────────────────────────────────────────────────────────
function StickerCell({ s, qty, onInc, onDec, locked}) {
  const st    = qty===0?"empty":qty===1?"have":"dbl";
  const ico   = qty===0?"✦":qty===1?"✅":"⭐";
  const bc    = st==="have"?green:st==="dbl"?gold:bdr;
  const stkBg = st==="have"?"linear-gradient(135deg,rgba(0,200,83,.13),rgba(0,200,83,.03))":st==="dbl"?"linear-gradient(135deg,rgba(255,215,0,.15),rgba(255,165,0,.05))":"rgba(255,255,255,0.02)";
  const lc    = st==="have"?"#69ff94":st==="dbl"?gold:muted;
  const qb    = { width:17,height:17,border:"1px solid rgba(255,255,255,0.1)",background:"rgba(255,255,255,0.07)",color:"var(--text)",borderRadius:4,fontSize:13,fontWeight:900,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",padding:0,lineHeight:1,WebkitTapHighlightColor:"transparent" };
  return (
    <div onClick={locked?undefined:onInc} style={{ aspectRatio:"3/4",borderRadius:9,border:`2px solid ${bc}`,background:stkBg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",cursor:locked?"default":"pointer",position:"relative",userSelect:"none",WebkitTapHighlightColor:"transparent",overflow:"hidden",opacity:locked?0.75:1 }}>
      {qty>1&&<div style={{ position:"absolute",top:2,right:2,width:15,height:15,background:gold,color:"#000",borderRadius:"50%",fontSize:".5rem",fontWeight:900,display:"flex",alignItems:"center",justifyContent:"center" }}>{qty}</div>}
      <div style={{ fontSize:17,marginBottom:1 }}>{ico}</div>
      <div style={{ fontSize:".65rem",fontWeight:800,color:lc,textTransform:"uppercase",letterSpacing:".2px",textAlign:"center",lineHeight:1.2 }}>{s.label}</div>
      {qty>0&&!locked&&(
        <div style={{ display:"flex",alignItems:"center",gap:1,marginTop:2 }} onClick={e=>e.stopPropagation()}>
          <button onClick={onDec} style={qb}>−</button>
          <span style={{ fontSize:".58rem",fontWeight:800,minWidth:11,textAlign:"center" }}>{qty}</span>
          <button onClick={onInc} style={qb}>+</button>
        </div>
      )}
      {qty>0&&locked&&(
        <div style={{ fontSize:".58rem",fontWeight:800,minWidth:11,textAlign:"center",marginTop:2,color:lc }}>{qty}x</div>
      )}
    </div>
  );
}

// ─── STICKER PANEL ────────────────────────────────────────────────────────────
function StickerPanel({ team, col, onUpdate, onClose, locked}) {
  const { owned, total } = teamProgress(team, col);
  return (
    <div style={{ gridColumn:"1/-1",background:"rgba(255,215,0,0.03)",border:`1.5px solid ${locked?"rgba(255,68,68,.3)":"rgba(255,215,0,.2)"}`,borderRadius:13,overflow:"hidden",animation:"slideDown .18s ease" }}>
      <div style={{ display:"flex",alignItems:"center",gap:8,padding:"9px 12px",borderBottom:`1px solid ${locked?"rgba(255,68,68,.1)":"rgba(255,215,0,.1)"}`,background:locked?"rgba(255,68,68,0.04)":"rgba(255,215,0,0.04)" }}>
        <span style={{ fontSize:18 }}>{team.flag}</span>
        <span style={{ fontFamily:font.title,fontSize:".95rem",letterSpacing:1 }}>{team.name}</span>
        <span style={{ fontFamily:font.body,fontSize:".62rem",color:"var(--muted)",fontWeight:800 }}>{owned}/{total}</span>
        {locked && <span style={{ fontSize:".65rem",fontWeight:800,color:"#ff6b6b",background:"rgba(255,68,68,0.12)",border:"1px solid rgba(255,68,68,.3)",borderRadius:6,padding:"2px 7px" }}>🔒 Bloqueado</span>}
        <button onClick={onClose} style={{ marginLeft:"auto",background:"none",border:"1px solid var(--bdr)",borderRadius:6,color:"var(--muted)",fontSize:".68rem",fontWeight:800,fontFamily:font.body,cursor:"pointer",padding:"3px 9px",WebkitTapHighlightColor:"transparent" }}>✕ Fechar</button>
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
function TeamCard({ team, col, isOpen, onToggle}) {
  const { owned, total, pct, full } = teamProgress(team, col);
  const bc = isOpen?"rgba(255,215,0,.6)":full?"rgba(0,200,83,.45)":bdr;
  return (
    <div onClick={onToggle} style={{ background:isOpen?"rgba(255,215,0,0.05)":card,border:`1.5px solid ${bc}`,borderRadius:13,cursor:"pointer",WebkitTapHighlightColor:"transparent",userSelect:"none",overflow:"hidden",transition:"border-color .15s" }}>
      <div style={{ padding:"10px 6px 8px",display:"flex",flexDirection:"column",alignItems:"center",gap:1 }}>
        <span style={{ fontSize:31,lineHeight:1 }}>{team.flag}</span>
        <span style={{ fontFamily:font.title,fontSize:".94rem",letterSpacing:1,color:"var(--muted)",marginTop:2 }}>{team.code}</span>
        <span style={{ fontFamily:font.body,fontSize:".78rem",fontWeight:800,textAlign:"center",lineHeight:1.2 }}>{team.name}</span>
        <span style={{ fontSize:".73rem",fontWeight:800,color:full?green:muted,marginTop:2 }}>{owned}/{total}</span>
        <div style={{ width:"100%",height:3,background:"rgba(255,255,255,0.07)",borderRadius:99,overflow:"hidden",marginTop:4 }}>
          <div style={{ height:"100%",width:pct+"%",background:full?green:`linear-gradient(90deg,${gold},${gold2})`,borderRadius:99,transition:"width .3s" }} />
        </div>
      </div>
    </div>
  );
}

// ─── GROUP SECTION ────────────────────────────────────────────────────────────
function GroupSection({ grp, col, openTeamId, onToggle, onUpdate, locked}) {
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
        <span style={{ fontFamily:font.body,fontSize:".62rem",color:"var(--muted)",fontWeight:800 }}>{grpOwned}/{grpTotal}</span>
      </div>
      <div style={{ display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:7,padding:"0 12px 6px" }}>
        {children}
      </div>
    </div>
  );
}

// ─── ALBUM PAGE ───────────────────────────────────────────────────────────────
function AlbumPage({ col, onUpdate, onNavigate, onGroupComplete, locked}) {
  const [search,setSearch]         = useState("");
  const [openTeamId,setOpenTeamId] = useState(null);

  const toggle = useCallback((teamId) => setOpenTeamId(p=>p===teamId?null:teamId),[]);

  // detect group completion — only fire once per device
  useEffect(()=>{
    const celebrated = loadCelebrated();
    let changed = false;
    GROUPS.forEach(grp=>{
      if(grp.id==="special") return;
      const allFull = grp.teams.every(t=>teamProgress(t,col).full);
      if(allFull && !celebrated.has(grp.id)){
        celebrated.add(grp.id);
        changed = true;
        onGroupComplete(grp);
      }
    });
    if(changed) persistCelebrated(celebrated);
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
          <div key={label} onClick={()=>nav&&onNavigate(nav)} style={{ background:"var(--card)",border:`1px solid ${nav?"rgba(255,215,0,0.3)":bdr}`,borderRadius:13,padding:"10px 4px",textAlign:"center",cursor:nav?"pointer":"default",WebkitTapHighlightColor:"transparent",position:"relative",transition:"border-color .15s" }}>
            <div style={{ fontFamily:font.title,fontSize:"1.5rem",background:`linear-gradient(135deg,${gold},${gold2})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",lineHeight:1 }}>{value}</div>
            <div style={{ fontSize:".55rem",color:nav?gold:muted,fontWeight:800,textTransform:"uppercase",letterSpacing:".3px",marginTop:2 }}>{label}</div>
            {nav&&<div style={{ position:"absolute",bottom:4,left:"50%",transform:"translateX(-50%)",width:16,height:2,background:`linear-gradient(90deg,${gold},${gold2})`,borderRadius:99,opacity:.6 }} />}
          </div>
        ))}
      </div>
      <div style={{ padding:"2px 12px 8px" }}>
        <div style={{ display:"flex",justifyContent:"space-between",fontSize:".68rem",color:"var(--muted)",fontWeight:800,marginBottom:4 }}>
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
          
          style={{ padding:"10px 14px", background:"var(--card)", border:"1.5px solid var(--bdr)", borderRadius:10, color:"var(--text)", fontFamily:font.body, fontSize:".9rem", outline:"none", WebkitAppearance:"none" }}
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
function HavePage({ col}) {
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
        <p style={{ color:"var(--muted)",fontSize:".8rem",fontWeight:700,marginTop:2 }}>{total} figurinha{total!==1?"s":""} na sua coleção</p>
      </div>
      {sections.length===0?(<div style={{ textAlign:"center",padding:"50px 20px",color:"var(--muted)" }}><div style={{ fontSize:46,marginBottom:10 }}>📦</div><p style={{ fontSize:".88rem",fontWeight:700,lineHeight:1.6 }}>Nenhuma figurinha ainda!</p></div>)
      :sections.map(({grp,ti})=>(
        <div key={grp.id}>
          <div style={{ padding:"8px 12px",fontFamily:font.title,fontSize:".85rem",letterSpacing:1,color:gold,background:"var(--card)",borderTop:"1px solid var(--bdr)",borderBottom:"1px solid var(--bdr)",margin:"5px 0 0" }}>⚽ {grp.name}</div>
          {ti.map(({team,items})=>(
            <div key={team.id}>
              <div style={{ display:"flex",alignItems:"center",gap:6,padding:"6px 12px 3px",fontFamily:font.body,fontSize:".75rem",fontWeight:800 }}>{team.flag} <strong>{team.name}</strong> <span style={{color:"var(--muted)",fontWeight:700}}>({items.length}/{team.stickers.length})</span></div>
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
function MissPage({ col}) {
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
        <p style={{ color:"var(--muted)",fontSize:".8rem",fontWeight:700,marginTop:2 }}>{total} figurinha{total!==1?"s":""} faltando</p>
      </div>
      {sections.length===0?(<div style={{ textAlign:"center",padding:"50px 20px",color:"var(--muted)" }}><div style={{ fontSize:46,marginBottom:10 }}>🏆</div><p style={{ fontSize:".88rem",fontWeight:700,lineHeight:1.6 }}>Álbum completo! Parabéns!</p></div>)
      :sections.map(({grp,ti})=>(
        <div key={grp.id}>
          <div style={{ padding:"8px 12px",fontFamily:font.title,fontSize:".85rem",letterSpacing:1,color:gold,background:"var(--card)",borderTop:"1px solid var(--bdr)",borderBottom:"1px solid var(--bdr)",margin:"5px 0 0" }}>⚽ {grp.name}</div>
          {ti.map(({team,items})=>(
            <div key={team.id}>
              <div style={{ display:"flex",alignItems:"center",gap:6,padding:"6px 12px 3px",fontFamily:font.body,fontSize:".75rem",fontWeight:800 }}>{team.flag} <strong>{team.name}</strong> <span style={{color:"var(--muted)",fontWeight:700}}>({items.length} faltando)</span></div>
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
function DoublesPage({ col}) {
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
        <p style={{ color:"var(--muted)",fontSize:".8rem",fontWeight:700,marginTop:2 }}>{totalExtra>0?`${totalExtra} figurinha${totalExtra!==1?"s":""} para trocar`:"Nenhuma repetida ainda"}</p>
      </div>
      {sections.length===0?(<div style={{ textAlign:"center",padding:"50px 20px",color:"var(--muted)" }}><div style={{ fontSize:46,marginBottom:10 }}>🎉</div><p style={{ fontSize:".88rem",fontWeight:700,lineHeight:1.6 }}>Nenhuma repetida ainda!</p></div>)
      :sections.map(({grp,ti})=>(
        <div key={grp.id}>
          <div style={{ padding:"8px 12px",fontFamily:font.title,fontSize:".85rem",letterSpacing:1,color:gold,background:"var(--card)",borderTop:"1px solid var(--bdr)",borderBottom:"1px solid var(--bdr)",margin:"5px 0 0" }}>⚽ {grp.name}</div>
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
function TradePage({ col, onToast}) {
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
    const encoded=encodeURIComponent(lines.join("\n"));
    window.open(`https://api.whatsapp.com/send?text=${encoded}`,"_blank");
  }

  return (
    <div>
      <div style={{ padding:"16px 12px 8px" }}>
        <h2 style={{ fontFamily:font.title,fontSize:"1.5rem",letterSpacing:"2px" }}>🔄 MODO TROCA</h2>
        <p style={{ color:"var(--muted)",fontSize:".8rem",fontWeight:700,marginTop:2 }}>Selecione as repetidas e compartilhe no WhatsApp</p>
      </div>

      {allDoubles.length===0?(
        <div style={{ textAlign:"center",padding:"50px 20px",color:"var(--muted)" }}><div style={{ fontSize:46,marginBottom:10 }}>🔄</div><p style={{ fontSize:".88rem",fontWeight:700,lineHeight:1.6 }}>Nenhuma repetida para trocar ainda!</p></div>
      ):(
        <>
          <div style={{ display:"flex",gap:8,padding:"0 12px 10px",alignItems:"center" }}>
            <button onClick={toggleAll} style={{ flex:1,padding:"10px",border:"1px solid var(--bdr)",borderRadius:10,background:"var(--card)",color:"var(--text)",fontFamily:font.body,fontSize:".8rem",fontWeight:800,cursor:"pointer",WebkitTapHighlightColor:"transparent" }}>
              {selected.size===allDoubles.length?"Desmarcar tudo":"Selecionar tudo"}
            </button>
            <button onClick={shareWhatsApp} style={{ flex:1,padding:"10px",border:"none",borderRadius:10,background:"linear-gradient(135deg,#25D366,#128C7E)",color:"#fff",fontFamily:font.title,fontSize:"1rem",letterSpacing:"1.5px",cursor:"pointer",WebkitTapHighlightColor:"transparent" }}>
              📲 WHATSAPP
            </button>
          </div>
          <div style={{ padding:"0 12px",marginBottom:6,fontSize:".72rem",color:"var(--muted)",fontWeight:800 }}>
            {selected.size} de {allDoubles.length} selecionadas
          </div>
          <div style={{ display:"flex",flexWrap:"wrap",gap:6,padding:"0 12px 12px" }}>
            {allDoubles.map(s=>{
              const sel=selected.has(s.id);
              return (
                <div key={s.id} onClick={()=>setSelected(p=>{ const n=new Set(p); sel?n.delete(s.id):n.add(s.id); return n; })}
                  style={{ background:sel?"linear-gradient(135deg,rgba(37,211,102,.18),rgba(18,140,126,.1))":"rgba(255,255,255,0.03)",border:`1.5px solid ${sel?"#25D366":bdr}`,borderRadius:8,padding:"5px 10px",fontSize:".72rem",fontWeight:800,cursor:"pointer",display:"flex",alignItems:"center",gap:5,color:sel?"#69ff94":"var(--text)",WebkitTapHighlightColor:"transparent",transition:"all .15s" }}>
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
function SearchPage({ col}) {
  const [q,setQ] = useState("");

  // Group results by team
  const grouped = q.trim().length >= 1 ? (() => {
    const ql = q.trim().toLowerCase();
    const map = []; // [{grp, team, stickers:[{s,qty}]}]
    for(const grp of GROUPS) {
      for(const team of grp.teams) {
        const matchTeam = team.name.toLowerCase().includes(ql) || team.code.toLowerCase().includes(ql) || grp.name.toLowerCase().includes(ql);
        const stickers = team.stickers.filter(s =>
          matchTeam || s.label.toLowerCase().includes(ql)
        ).map(s => ({ s, qty: col[s.id]||0 }));
        if(stickers.length) map.push({ grp, team, stickers });
      }
    }
    return map;
  })() : [];

  const totalFound = grouped.reduce((a,g) => a + g.stickers.length, 0);

  return (
    <div>
      <div style={{ padding:"16px 12px 10px" }}>
        <h2 style={{ fontFamily:font.title,fontSize:"1.5rem",letterSpacing:"2px" }}>🔍 BUSCA RÁPIDA</h2>
        <p style={{ color:"var(--muted)",fontSize:".8rem",fontWeight:700,marginTop:2 }}>Digite o código, nome ou grupo — veja tudo de uma vez</p>
      </div>

      <div style={{ padding:"0 12px 10px" }}>
        <ClearableInput
          value={q} onChange={setQ}
          placeholder="Ex: BRA, Brasil, Grupo C..."
          autoFocus
          style={{ padding:"12px 16px", background:"var(--card)", border:"1.5px solid rgba(255,215,0,0.3)", borderRadius:12, color:"var(--text)", fontFamily:font.body, fontSize:"1rem", outline:"none", WebkitAppearance:"none" }}
        />
      </div>

      {/* legend */}
      {q.trim().length >= 1 && grouped.length > 0 && (
        <div style={{ display:"flex", gap:12, padding:"0 12px 10px", alignItems:"center" }}>
          <div style={{ display:"flex", alignItems:"center", gap:5 }}>
            <div style={{ width:12,height:12,borderRadius:3,background:"rgba(0,200,83,0.15)",border:"1.5px solid rgba(0,200,83,0.4)" }} />
            <span style={{ fontSize:".68rem",color:"var(--muted)",fontWeight:700 }}>Tenho</span>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:5 }}>
            <div style={{ width:12,height:12,borderRadius:3,background:"rgba(255,68,68,0.12)",border:"1.5px solid rgba(255,68,68,0.35)" }} />
            <span style={{ fontSize:".68rem",color:"var(--muted)",fontWeight:700 }}>Faltando</span>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:5 }}>
            <div style={{ width:12,height:12,borderRadius:3,background:"rgba(255,215,0,0.15)",border:"1.5px solid rgba(255,215,0,0.4)" }} />
            <span style={{ fontSize:".68rem",color:"var(--muted)",fontWeight:700 }}>Repetida</span>
          </div>
          <span style={{ marginLeft:"auto", fontSize:".68rem",color:"var(--muted)",fontWeight:800 }}>{totalFound} figurinha{totalFound!==1?"s":""}</span>
        </div>
      )}

      {/* results grouped by team */}
      {grouped.map(({ grp, team, stickers }) => (
        <div key={team.id} style={{ marginBottom:12 }}>
          {/* team header */}
          <div style={{ display:"flex", alignItems:"center", gap:8, padding:"6px 12px 6px", background:"var(--card)", borderTop:"1px solid var(--bdr)", borderBottom:"1px solid var(--bdr)", marginBottom:8 }}>
            <span style={{ fontSize:20 }}>{team.flag}</span>
            <div>
              <span style={{ fontFamily:font.title, fontSize:".95rem", letterSpacing:"1px" }}>{team.name}</span>
              <span style={{ fontFamily:font.body, fontSize:".65rem", color:"var(--muted)", fontWeight:700, marginLeft:6 }}>{grp.name}</span>
            </div>
            {/* mini summary */}
            <div style={{ marginLeft:"auto", display:"flex", gap:6, fontSize:".65rem", fontWeight:800 }}>
              <span style={{ color:green }}>{stickers.filter(x=>x.qty===1).length}✅</span>
              <span style={{ color:gold }}>{stickers.filter(x=>x.qty>1).length}⭐</span>
              <span style={{ color:"#ff6b6b" }}>{stickers.filter(x=>x.qty===0).length}❌</span>
            </div>
          </div>

          {/* chips side by side */}
          <div style={{ display:"flex", flexWrap:"wrap", gap:5, padding:"0 12px" }}>
            {stickers.map(({ s, qty }) => {
              const hasDbl  = qty > 1;
              const hasOne  = qty === 1;
              const missing = qty === 0;
              const bg      = hasDbl  ? "rgba(255,215,0,0.14)"  : hasOne ? "rgba(0,200,83,0.13)"  : "rgba(255,68,68,0.1)";
              const border  = hasDbl  ? "rgba(255,215,0,0.45)"  : hasOne ? "rgba(0,200,83,0.4)"   : "rgba(255,68,68,0.35)";
              const color   = hasDbl  ? gold                     : hasOne ? "#69ff94"               : "#ff6b6b";
              return (
                <div key={s.id} style={{ background:bg, border:`1.5px solid ${border}`, borderRadius:7, padding:"4px 9px", fontSize:".72rem", fontWeight:800, color, display:"flex", alignItems:"center", gap:4 }}>
                  {s.label}
                  {hasDbl && <span style={{ background:gold, color:"#000", borderRadius:20, padding:"1px 5px", fontSize:".58rem" }}>×{qty}</span>}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {q.trim().length === 0 && (
        <div style={{ textAlign:"center", padding:"40px 20px", color:"var(--muted)" }}>
          <div style={{ fontSize:40, marginBottom:10 }}>🔍</div>
          <p style={{ fontSize:".85rem", fontWeight:700, lineHeight:1.6 }}>Digite o nome ou código de uma seleção<br/>para ver todas as figurinhas de uma vez.</p>
        </div>
      )}
      {q.trim().length >= 1 && grouped.length === 0 && (
        <div style={{ textAlign:"center", padding:"30px 20px", color:"var(--muted)" }}>
          <div style={{ fontSize:36, marginBottom:8 }}>🤷</div>
          <p style={{ fontSize:".85rem", fontWeight:700 }}>Nenhuma figurinha encontrada.</p>
        </div>
      )}
      <div style={{ height:14 }} />
    </div>
  );
}

// ─── PACKETS PAGE ─────────────────────────────────────────────────────────────
function PacketsPage({ packets, onAdd, onRemove, onReset, avulsas, onAddAvu, onRemoveAvu, onResetAvu, onToast}) {
  const [confirm, setConfirm]   = useState(false);
  const [confAvu, setConfAvu]   = useState(false);
  const [label,   setLabel]     = useState("");
  const [price,   setPrice]     = useState("");
  const [qty,     setQty]       = useState("1");

  const pktTotal  = packets * PRICE;
  const avuTotal  = avulsas.reduce((a,i) => a + (i.price * (i.qty||1)), 0);
  const grandTotal = pktTotal + avuTotal;
  const pktFigs   = packets * 7;
  const avuFigs   = avulsas.reduce((a,i) => a + (i.qty||1), 0);
  const totalFigs  = pktFigs + avuFigs;
  const costPerFig = totalFigs > 0 ? (grandTotal / totalFigs).toFixed(2).replace(".",",") : "0,00";

  function addAvulsa() {
    const p = parseFloat(price.replace(",","."));
    const q = parseInt(qty) || 1;
    if (!label.trim())       { onToast("Digite uma descrição","err"); return; }
    if (isNaN(p) || p <= 0)  { onToast("Digite um valor válido","err"); return; }
    if (q < 1)               { onToast("Quantidade inválida","err"); return; }
    onAddAvu({ id: Date.now(), label: label.trim(), price: p, qty: q });
    setLabel(""); setPrice(""); setQty("1");
    onToast("✅ Figurinha avulsa adicionada","ok");
  }

  const inputSt = { flex:1, padding:"10px 12px", background:"var(--input-bg)", border:"1.5px solid var(--bdr)", borderRadius:10, color:"var(--text)", fontFamily:font.body, fontSize:".88rem", outline:"none", WebkitAppearance:"none", minWidth:0 };

  return (
    <div>
      <div style={{ padding:"16px 12px 8px" }}>
        <h2 style={{ fontFamily:font.title, fontSize:"1.5rem", letterSpacing:"2px" }}>📦 PACOTES</h2>
        <p style={{ color:"var(--muted)", fontSize:".8rem", fontWeight:700, marginTop:2 }}>Controle pacotes, figurinhas avulsas e gastos</p>
      </div>

      {/* ── GRAND TOTAL BANNER ── */}
      <div style={{ margin:"0 12px 10px", background:`linear-gradient(135deg,rgba(255,215,0,0.1),rgba(255,165,0,0.05))`, border:`1.5px solid rgba(255,215,0,0.3)`, borderRadius:16, padding:"16px", display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8, textAlign:"center" }}>
        <div>
          <div style={{ fontFamily:font.title, fontSize:"1.6rem", background:`linear-gradient(135deg,${gold},${gold2})`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", lineHeight:1 }}>R${grandTotal.toFixed(2).replace(".",",")}</div>
          <div style={{ fontSize:".58rem", color:"var(--muted)", fontWeight:800, textTransform:"uppercase", marginTop:3 }}>Total Gasto</div>
        </div>
        <div>
          <div style={{ fontFamily:font.title, fontSize:"1.6rem", color:green, lineHeight:1 }}>{totalFigs}</div>
          <div style={{ fontSize:".58rem", color:"var(--muted)", fontWeight:800, textTransform:"uppercase", marginTop:3 }}>Figurinhas</div>
        </div>
        <div>
          <div style={{ fontFamily:font.title, fontSize:"1.6rem", color:"#ff80ab", lineHeight:1 }}>R${costPerFig}</div>
          <div style={{ fontSize:".58rem", color:"var(--muted)", fontWeight:800, textTransform:"uppercase", marginTop:3 }}>R$/Figurinha</div>
        </div>
      </div>

      {/* ── PACOTES SECTION ── */}
      <div style={{ margin:"0 12px 10px", background:"var(--card)", border:"1px solid var(--bdr)", borderRadius:16, padding:"16px 16px 12px" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
          <div style={{ fontFamily:font.title, fontSize:"1rem", letterSpacing:"1.5px" }}>📦 PACOTES (R${PRICE},00 cada)</div>
          <div style={{ fontFamily:font.title, fontSize:".85rem", color:gold }}>R${pktTotal.toFixed(2).replace(".",",")} · {pktFigs} fig.</div>
        </div>

        {/* counter */}
        <div style={{ textAlign:"center" }}>
          <div style={{ fontFamily:font.title, fontSize:"4rem", lineHeight:1, background:`linear-gradient(135deg,${gold},${gold2})`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>{packets}</div>
          <div style={{ fontSize:".65rem", color:"var(--muted)", fontWeight:800, textTransform:"uppercase", marginTop:4, marginBottom:14 }}>Pacotes abertos</div>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:16 }}>
            <button onClick={onRemove} style={{ width:48, height:48, borderRadius:"50%", border:"2px solid var(--bdr)", background:"rgba(255,255,255,0.04)", color:"var(--text)", fontSize:26, fontWeight:900, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", WebkitTapHighlightColor:"transparent" }}>−</button>
            <button onClick={onAdd} style={{ width:58, height:58, borderRadius:"50%", border:"none", background:`linear-gradient(135deg,${gold},${gold2})`, color:"#000", fontSize:28, fontWeight:900, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", WebkitTapHighlightColor:"transparent", boxShadow:`0 0 16px rgba(255,215,0,0.3)` }}>+</button>
          </div>
        </div>

        {/* reset pacotes */}
        <div style={{ marginTop:14 }}>
          {!confirm ? (
            <button onClick={()=>setConfirm(true)} style={{ width:"100%", padding:"9px", border:`1px solid rgba(255,68,68,.3)`, borderRadius:9, background:"rgba(255,68,68,0.06)", color:"#ff6b6b", fontFamily:font.body, fontSize:".75rem", fontWeight:800, cursor:"pointer", WebkitTapHighlightColor:"transparent" }}>
              Resetar pacotes
            </button>
          ) : (
            <>
              <p style={{ color:"var(--muted)", fontSize:".72rem", fontWeight:700, marginBottom:7, textAlign:"center" }}>Zerar contador de pacotes?</p>
              <div style={{ display:"flex", gap:7 }}>
                <button onClick={()=>setConfirm(false)} style={{ flex:1, padding:9, border:"1px solid var(--bdr)", borderRadius:9, background:"var(--card)", color:"var(--text)", fontFamily:font.body, fontSize:".75rem", fontWeight:800, cursor:"pointer" }}>Cancelar</button>
                <button onClick={()=>{onReset();setConfirm(false);onToast("Pacotes zerados","ok");}} style={{ flex:1, padding:9, border:"none", borderRadius:9, background:"rgba(255,68,68,0.8)", color:"#fff", fontFamily:font.body, fontSize:".75rem", fontWeight:800, cursor:"pointer" }}>Zerar</button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── AVULSAS SECTION ── */}
      <div style={{ margin:"0 12px 10px", background:"var(--card)", border:"1px solid var(--bdr)", borderRadius:16, padding:"16px" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
          <div style={{ fontFamily:font.title, fontSize:"1rem", letterSpacing:"1.5px" }}>🃏 FIGURINHAS AVULSAS</div>
          <div style={{ fontFamily:font.title, fontSize:".85rem", color:green }}>R${avuTotal.toFixed(2).replace(".",",")} · {avuFigs} fig.</div>
        </div>

        {/* add form — two rows */}
        <div style={{ display:"flex", flexDirection:"column", gap:6, marginBottom:10 }}>
          <input
            value={label} onChange={e=>setLabel(e.target.value)}
            placeholder="Descrição (ex: BRA 7, Messi)"
            onKeyDown={e=>e.key==="Enter"&&addAvulsa()}
            style={{ ...inputSt, flex:"none" }}
          />
          <div style={{ display:"flex", gap:6 }}>
            {/* qty */}
            <div style={{ position:"relative", flex:1, display:"flex", alignItems:"center" }}>
              <span style={{ position:"absolute", left:10, color:"var(--muted)", fontSize:".75rem", fontWeight:800, pointerEvents:"none" }}>Qtd</span>
              <input
                value={qty} onChange={e=>setQty(e.target.value)}
                placeholder="1"
                inputMode="numeric"
                onKeyDown={e=>e.key==="Enter"&&addAvulsa()}
                style={{ ...inputSt, paddingLeft:34, width:"100%" }}
              />
            </div>
            {/* unit price */}
            <div style={{ position:"relative", flex:1, display:"flex", alignItems:"center" }}>
              <span style={{ position:"absolute", left:10, color:"var(--muted)", fontSize:".75rem", fontWeight:800, pointerEvents:"none" }}>R$</span>
              <input
                value={price} onChange={e=>setPrice(e.target.value)}
                placeholder="0,00 unit."
                inputMode="decimal"
                onKeyDown={e=>e.key==="Enter"&&addAvulsa()}
                style={{ ...inputSt, paddingLeft:28, width:"100%" }}
              />
            </div>
            <button onClick={addAvulsa} style={{ flexShrink:0, width:44, height:44, border:"none", borderRadius:10, background:`linear-gradient(135deg,${green},#009640)`, color:"#fff", fontSize:22, fontWeight:900, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", WebkitTapHighlightColor:"transparent" }}>+</button>
          </div>
        </div>

        {/* list */}
        {avulsas.length === 0 ? (
          <div style={{ textAlign:"center", padding:"16px 0", color:"var(--muted)", fontSize:".78rem", fontWeight:700 }}>
            Nenhuma figurinha avulsa ainda.
          </div>
        ) : (
          <>
            <div style={{ display:"flex", flexDirection:"column", gap:6, maxHeight:260, overflowY:"auto", WebkitOverflowScrolling:"touch", marginBottom:10 }}>
              {avulsas.map((item) => {
                const q = item.qty || 1;
                const total = item.price * q;
                return (
                  <div key={item.id} style={{ display:"flex", alignItems:"center", gap:8, background:"var(--card2)", border:"1px solid var(--bdr)", borderRadius:9, padding:"8px 10px" }}>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:".75rem", fontWeight:800, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{item.label}</div>
                      <div style={{ fontSize:".62rem", color:"var(--muted)", fontWeight:700, marginTop:1 }}>
                        {q > 1 ? `${q} × R$${item.price.toFixed(2).replace(".",",")}` : `R$${item.price.toFixed(2).replace(".",",")} unit.`}
                      </div>
                    </div>
                    <span style={{ fontFamily:font.title, fontSize:".95rem", color:green, flexShrink:0 }}>R${total.toFixed(2).replace(".",",")}</span>
                    <button onClick={()=>onRemoveAvu(item.id)} style={{ width:22, height:22, borderRadius:"50%", border:"none", background:"rgba(255,68,68,0.15)", color:"#ff6b6b", fontSize:13, fontWeight:900, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", WebkitTapHighlightColor:"transparent", flexShrink:0, padding:0 }}>✕</button>
                  </div>
                );
              })}
            </div>

            {/* reset avulsas */}
            {!confAvu ? (
              <button onClick={()=>setConfAvu(true)} style={{ width:"100%", padding:"9px", border:`1px solid rgba(255,68,68,.3)`, borderRadius:9, background:"rgba(255,68,68,0.06)", color:"#ff6b6b", fontFamily:font.body, fontSize:".75rem", fontWeight:800, cursor:"pointer", WebkitTapHighlightColor:"transparent" }}>
                Limpar avulsas
              </button>
            ) : (
              <>
                <p style={{ color:"var(--muted)", fontSize:".72rem", fontWeight:700, marginBottom:7, textAlign:"center" }}>Remover todas as figurinhas avulsas?</p>
                <div style={{ display:"flex", gap:7 }}>
                  <button onClick={()=>setConfAvu(false)} style={{ flex:1, padding:9, border:"1px solid var(--bdr)", borderRadius:9, background:"var(--card)", color:"var(--text)", fontFamily:font.body, fontSize:".75rem", fontWeight:800, cursor:"pointer" }}>Cancelar</button>
                  <button onClick={()=>{onResetAvu();setConfAvu(false);onToast("Avulsas removidas","ok");}} style={{ flex:1, padding:9, border:"none", borderRadius:9, background:"rgba(255,68,68,0.8)", color:"#fff", fontFamily:font.body, fontSize:".75rem", fontWeight:800, cursor:"pointer" }}>Limpar</button>
                </div>
              </>
            )}
          </>
        )}
      </div>

      <div style={{ height:14 }} />
    </div>
  );
}

// ─── PROGRESS PAGE ────────────────────────────────────────────────────────────
function ProgressPage({ col}) {
  const groups = GROUPS.filter(g=>g.id!=="special");
  return (
    <div>
      <div style={{ padding:"16px 12px 8px" }}>
        <h2 style={{ fontFamily:font.title,fontSize:"1.5rem",letterSpacing:"2px" }}>📊 PROGRESSO POR GRUPO</h2>
        <p style={{ color:"var(--muted)",fontSize:".8rem",fontWeight:700,marginTop:2 }}>Comparativo de completude entre os grupos</p>
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
                  <span style={{ fontFamily:font.title,fontSize:".9rem",letterSpacing:"1px",color:full?green:"var(--text)" }}>{grp.name}</span>
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
        <div style={{ fontFamily:font.title,fontSize:".9rem",letterSpacing:"1px",color:"var(--muted)",marginBottom:10 }}>DETALHE POR SELEÇÃO</div>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:6 }}>
          {GROUPS.flatMap(g=>g.teams).map(team=>{
            const {owned,total,pct,full}=teamProgress(team,col);
            return (
              <div key={team.id} style={{ background:"var(--card)",border:`1px solid ${full?"rgba(0,200,83,.35)":bdr}`,borderRadius:10,padding:"8px 10px" }}>
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
function WorldMapPage({ col}) {
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
        <p style={{ color:"var(--muted)",fontSize:".8rem",fontWeight:700,marginTop:2 }}>Progresso das seleções no mundo</p>
      </div>

      {/* legend */}
      <div style={{ display:"flex",gap:12,padding:"0 12px 10px",flexWrap:"wrap" }}>
        {legend.map(l=>(
          <div key={l.label} style={{ display:"flex",alignItems:"center",gap:5 }}>
            <div style={{ width:12,height:12,borderRadius:3,background:l.color,border:"1px solid rgba(255,255,255,0.1)" }} />
            <span style={{ fontSize:".65rem",color:"var(--muted)",fontWeight:700 }}>{l.label}</span>
          </div>
        ))}
      </div>

      {/* map */}
      <div style={{ margin:"0 12px 12px",background:"#0d1117",borderRadius:16,overflow:"hidden",border:"1px solid var(--bdr)",position:"relative" }}>
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
        <div style={{ fontFamily:font.title,fontSize:".9rem",letterSpacing:"1px",color:"var(--muted)",marginBottom:8 }}>SELEÇÕES PARTICIPANTES</div>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:5 }}>
          {ALL_TEAMS.map(team=>{
            const {pct,full,owned,total}=teamProgress(team,col);
            return (
              <div key={team.id} style={{ background:"var(--card)",border:`1px solid ${full?"rgba(0,200,83,.35)":pct>0?"rgba(255,215,0,.2)":bdr}`,borderRadius:9,padding:"7px 8px",display:"flex",alignItems:"center",gap:5 }}>
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
function ReportsPage({ col, onToast}) {
  const vals=Object.values(col);
  const have=vals.filter(v=>v>0).length;
  const dbl=vals.filter(v=>v>1).length;
  const miss=TOTAL-have;
  const pct=Math.round((have/TOTAL)*100);

  // ── TXT export ──────────────────────────────────────────────────────────────
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
    if(type==="dbl"||type==="all")  add(`⭐ FIGURINHAS REPETIDAS (${dbl} tipos)`,()=>s=>(col[s.id]||0)>1,s=>`${s.label} (×${col[s.id]-1})`);
    lines.push("═══════════════════════════════════════");
    return lines.join("\n");
  }

  // ── PDF print ────────────────────────────────────────────────────────────────
  function printPDF(type) {
    const now = new Date().toLocaleString("pt-BR");
    const accentColor = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || "#FFD700";

    // Special handling for "all" type — unified grid layout
    if(type==="all") {
      let sections = "";
      for(const grp of GROUPS) {
        let grpHtml = "";
        for(const team of grp.teams) {
          if(!team.stickers.length) continue;
          // First chip = team code (sigla), rest = sticker numbers only
          const stickerChips = team.stickers.map(s => {
            const qty   = col[s.id] || 0;
            // Extract just the number part: "BRA 7" -> "07", "FWC 00" -> "00"
            const num   = s.label.split(" ")[1].padStart(2,"0");
            const extra = qty > 1 ? `<sup style="font-size:6px">×${qty}</sup>` : "";
            if(qty > 0) {
              return `<span class="chip chip-have">${num}${extra}</span>`;
            } else {
              return `<span class="chip chip-miss">${num}</span>`;
            }
          }).join("");
          grpHtml += `<div class="team-row">
            <span class="chip chip-code">${team.code}</span>${stickerChips}
          </div>`;
        }
        if(grpHtml) sections += `<div class="group-block"><div class="group-label">${grp.name}</div>${grpHtml}</div>`;
      }

      const html = `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8">
<title>Álbum Copa 2026 — Relatório Completo</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0;}
  body{font-family:Arial,sans-serif;font-size:10px;color:#111;background:#fff;padding:12px;}
  .header{border-bottom:3px solid ${accentColor};padding-bottom:8px;margin-bottom:10px;display:flex;justify-content:space-between;align-items:flex-end;}
  .header h1{font-size:16px;letter-spacing:1px;color:#111;}
  .header .meta{font-size:8px;color:#666;text-align:right;line-height:1.6;}
  .stats{display:flex;gap:8px;margin-bottom:10px;}
  .stat{flex:1;border:1px solid #ddd;border-radius:5px;padding:5px 6px;text-align:center;}
  .stat-val{font-size:15px;font-weight:900;color:${accentColor};}
  .stat-lbl{font-size:7px;color:#888;text-transform:uppercase;letter-spacing:.5px;margin-top:1px;}
  .progress-bar{height:5px;background:#eee;border-radius:99px;overflow:hidden;margin-bottom:5px;}
  .progress-fill{height:100%;background:${accentColor};border-radius:99px;}
  .legend{display:flex;gap:14px;margin-bottom:10px;font-size:8px;color:#666;align-items:center;}
  .group-block{margin-bottom:8px;page-break-inside:avoid;}
  .group-label{font-size:8px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#888;
    margin-bottom:4px;padding:2px 6px;background:#f5f5f5;border-left:3px solid ${accentColor};}
  .team-row{display:flex;flex-wrap:wrap;gap:2px;margin-bottom:3px;align-items:center;}
  /* ALL chips same fixed size — perfectly aligned grid */
  .chip{
    display:inline-flex;align-items:center;justify-content:center;
    width:24px;height:20px;
    border-radius:3px;border:1px solid;
    font-size:8px;font-weight:700;
    flex-shrink:0;
    line-height:1;
    text-align:center;
  }
  /* Sigla chip — team code, same size, accent color */
  .chip-code{
    color:${accentColor};
    border-color:${accentColor};
    background:${accentColor}18;
    font-size:7px;
    font-weight:900;
    letter-spacing:.3px;
  }
  /* Have — strikethrough, grey */
  .chip-have{
    text-decoration:line-through;
    color:#aaa;
    border-color:#ddd;
    background:#f5f5f5;
  }
  /* Missing — red */
  .chip-miss{
    color:#c0392b;
    border-color:#e8a0a0;
    background:#fdecea;
  }
  .footer{margin-top:12px;padding-top:6px;border-top:1px solid #ddd;font-size:7px;color:#bbb;text-align:center;}
  @media print{body{padding:6px;}@page{margin:8mm;size:A4;}}
</style></head><body>
<div class="header">
  <h1>🏆 ÁLBUM COPA 2026 — COMPLETO</h1>
  <div class="meta">Gerado em: ${now}<br>Total: ${have}/${TOTAL} (${pct}% completo)</div>
</div>
<div class="stats">
  <div class="stat"><div class="stat-val">${have}</div><div class="stat-lbl">Tenho</div></div>
  <div class="stat"><div class="stat-val">${miss}</div><div class="stat-lbl">Faltam</div></div>
  <div class="stat"><div class="stat-val">${dbl}</div><div class="stat-lbl">Repetidas</div></div>
  <div class="stat"><div class="stat-val">${pct}%</div><div class="stat-lbl">Completo</div></div>
</div>
<div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
<div class="legend">
  <span class="chip chip-code" style="width:24px;height:20px;font-size:7px">BRA</span> Seleção &nbsp;
  <span class="chip chip-have" style="width:24px;height:20px">01</span> Tenho &nbsp;
  <span class="chip chip-miss" style="width:24px;height:20px">02</span> Faltando
</div>
${sections}
<div class="footer">Álbum Copa 2026 — app pessoal de Marcel Inowe</div>
</body></html>`;
      const win = window.open("","_blank","width=900,height=1000");
      win.document.write(html);
      win.document.close();
      win.onload = () => { win.focus(); win.print(); };
      onToast("✅ PDF aberto para impressão!","ok");
      return;
    }

    // Build HTML sections for have/miss/dbl types
    function buildSection(title, icon, filterFn, fmtFn, chipColor, chipBg) {
      let html = `<div class="section"><h2>${icon} ${title}</h2>`;
      for(const grp of GROUPS) {
        let grpHtml = "";
        for(const team of grp.teams) {
          const items = team.stickers.filter(filterFn(team));
          if(!items.length) continue;
          grpHtml += `<div class="team-row">
            <span class="team-name">${team.flag} <strong>${team.name}</strong></span>
            <div class="chips">${items.map(s=>`<span class="chip" style="color:${chipColor};background:${chipBg};border-color:${chipColor}40">${fmtFn(s)}</span>`).join("")}</div>
          </div>`;
        }
        if(grpHtml) html += `<div class="group-block"><div class="group-label">${grp.name}</div>${grpHtml}</div>`;
      }
      return html + "</div>";
    }

    let sections = "";
    if(type==="have"||type==="all") sections += buildSection(`Figurinhas Conseguidas (${have})`, "✅", ()=>s=>(col[s.id]||0)>0, s=>s.label, "#007a30", "#e6f9ee");
    if(type==="miss"||type==="all") sections += buildSection(`Figurinhas Faltando (${miss})`,    "❌", ()=>s=>(col[s.id]||0)===0, s=>s.label, "#c0392b", "#fdecea");
    if(type==="dbl" ||type==="all") sections += buildSection(`Figurinhas Repetidas (${dbl})`,   "⭐", ()=>s=>(col[s.id]||0)>1,  s=>`${s.label} ×${col[s.id]-1}`, "#7d5a00", "#fff8e1");

    const html = `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8">
<title>Álbum Copa 2026 — Relatório</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0;}
  body{font-family:Arial,sans-serif;font-size:11px;color:#111;background:#fff;padding:16px;}
  .header{border-bottom:3px solid ${accentColor};padding-bottom:10px;margin-bottom:14px;display:flex;justify-content:space-between;align-items:flex-end;}
  .header h1{font-size:20px;letter-spacing:1px;color:#111;}
  .header .meta{font-size:9px;color:#666;text-align:right;line-height:1.6;}
  .stats{display:flex;gap:10px;margin-bottom:14px;}
  .stat{flex:1;border:1px solid #ddd;border-radius:6px;padding:6px 8px;text-align:center;}
  .stat-val{font-size:18px;font-weight:900;color:${accentColor};}
  .stat-lbl{font-size:8px;color:#888;text-transform:uppercase;letter-spacing:.5px;margin-top:2px;}
  .progress-bar{height:6px;background:#eee;border-radius:99px;overflow:hidden;margin-bottom:14px;}
  .progress-fill{height:100%;background:${accentColor};border-radius:99px;}
  .section{margin-bottom:18px;page-break-inside:avoid;}
  .section h2{font-size:13px;margin-bottom:8px;padding:5px 8px;background:#f5f5f5;border-left:3px solid ${accentColor};border-radius:0 4px 4px 0;}
  .group-block{margin-bottom:8px;}
  .group-label{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#888;margin-bottom:4px;margin-top:6px;}
  .team-row{display:flex;align-items:flex-start;gap:8px;margin-bottom:4px;}
  .team-name{font-size:10px;font-weight:700;min-width:110px;flex-shrink:0;padding-top:2px;}
  .chips{display:flex;flex-wrap:wrap;gap:3px;}
  .chip{display:inline-block;padding:2px 6px;border-radius:4px;border:1px solid;font-size:9px;font-weight:700;}
  .footer{margin-top:16px;padding-top:8px;border-top:1px solid #ddd;font-size:8px;color:#aaa;text-align:center;}
  @media print{body{padding:8px;}@page{margin:10mm;}}
</style></head><body>
<div class="header">
  <h1>🏆 ÁLBUM COPA 2026</h1>
  <div class="meta">Gerado em: ${now}<br>Total: ${have}/${TOTAL} (${pct}% completo)</div>
</div>
<div class="stats">
  <div class="stat"><div class="stat-val">${have}</div><div class="stat-lbl">Tenho</div></div>
  <div class="stat"><div class="stat-val">${miss}</div><div class="stat-lbl">Faltam</div></div>
  <div class="stat"><div class="stat-val">${dbl}</div><div class="stat-lbl">Repetidas</div></div>
  <div class="stat"><div class="stat-val">${pct}%</div><div class="stat-lbl">Completo</div></div>
</div>
<div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
${sections}
<div class="footer">Álbum Copa 2026 — Gerado pelo app pessoal de Marcel Inowe</div>
</body></html>`;

    // Open in new window and trigger print
    const win = window.open("", "_blank", "width=800,height=900");
    win.document.write(html);
    win.document.close();
    win.onload = () => { win.focus(); win.print(); };
    onToast("✅ PDF aberto para impressão!", "ok");
  }

  // ── RENDER ───────────────────────────────────────────────────────────────────
  const txtCards=[
    {label:"✅ Conseguidas (.txt)", desc:"Lista de texto para compartilhar.", type:"have", g:["#00c853","#009640"], dark:false},
    {label:"❌ Faltando (.txt)",    desc:"Tudo que falta, em texto.",          type:"miss", g:["#448aff","#1565c0"], dark:false},
    {label:"⭐ Repetidas (.txt)",   desc:"Suas repetidas com extras.",          type:"dbl",  g:["var(--accent)","var(--accent2)"], dark:true},
    {label:"📋 Completo (.txt)",    desc:"Tudo em um único arquivo.",           type:"all",  g:["#ff6f00","#e65100"], dark:false},
  ];
  const pdfCards=[
    {label:"🖨️ PDF — Tenho",       desc:"Figurinhas conseguidas. Ideal para mostrar nas trocas.", type:"have", g:["#00c853","#009640"], dark:false},
    {label:"🖨️ PDF — Faltam",      desc:"O que você ainda precisa conseguir.",                    type:"miss", g:["#448aff","#1565c0"], dark:false},
    {label:"🖨️ PDF — Completo",    desc:"Tenho + Faltam + Repetidas em um PDF só.",               type:"all",  g:["#ff6f00","#e65100"], dark:false},
  ];

  return (
    <div style={{ padding:"16px 12px" }}>
      <h2 style={{ fontFamily:font.title,fontSize:"1.5rem",letterSpacing:"2px" }}>📊 RELATÓRIOS</h2>
      <p style={{ color:"var(--muted)",fontSize:".78rem",fontWeight:700,marginTop:2,marginBottom:16,lineHeight:1.5 }}>Exporte em .txt para compartilhar ou gere um PDF para imprimir.</p>

      {/* PDF section */}
      <div style={{ fontFamily:font.title,fontSize:".85rem",letterSpacing:"1.5px",color:"var(--muted)",marginBottom:10 }}>📄 IMPRIMIR / SALVAR PDF</div>
      <div style={{ display:"flex",flexDirection:"column",gap:8,marginBottom:20 }}>
        {pdfCards.map(c=>(
          <div key={c.type} style={{ background:"var(--card)",border:"1px solid var(--bdr)",borderRadius:13,padding:"12px" }}>
            <h3 style={{ fontFamily:font.title,fontSize:".95rem",letterSpacing:1,marginBottom:3 }}>{c.label}</h3>
            <p style={{ color:"var(--muted)",fontSize:".7rem",fontWeight:700,lineHeight:1.45,marginBottom:10 }}>{c.desc}</p>
            <button onClick={()=>printPDF(c.type)} style={{ width:"100%",padding:11,border:"none",borderRadius:9,fontFamily:font.title,fontSize:".9rem",letterSpacing:"1.5px",cursor:"pointer",background:`linear-gradient(135deg,${c.g[0]},${c.g[1]})`,color:c.dark?"#000":"#fff",WebkitTapHighlightColor:"transparent" }}>
              🖨️ GERAR PDF
            </button>
          </div>
        ))}
        <div style={{ background:"rgba(255,215,0,0.05)",border:"1px solid rgba(255,215,0,0.15)",borderRadius:10,padding:"10px 12px",fontSize:".7rem",color:"var(--muted)",fontWeight:700,lineHeight:1.55 }}>
          💡 O PDF abre em uma nova aba. Use <strong style={{color:"var(--text)"}}>Ctrl+P</strong> (desktop) ou <strong style={{color:"var(--text)"}}>Compartilhar → Imprimir</strong> (iPhone) para salvar ou imprimir.
        </div>
      </div>

      {/* TXT section */}
      <div style={{ fontFamily:font.title,fontSize:".85rem",letterSpacing:"1.5px",color:"var(--muted)",marginBottom:10 }}>📝 EXPORTAR TEXTO (.TXT)</div>
      <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
        {txtCards.map(c=>(
          <div key={c.type} style={{ background:"var(--card)",border:"1px solid var(--bdr)",borderRadius:13,padding:"12px" }}>
            <h3 style={{ fontFamily:font.title,fontSize:".95rem",letterSpacing:1,marginBottom:3 }}>{c.label}</h3>
            <p style={{ color:"var(--muted)",fontSize:".7rem",fontWeight:700,lineHeight:1.45,marginBottom:10 }}>{c.desc}</p>
            <button onClick={()=>{dl(build(c.type),`copa2026-${c.type}.txt`);onToast("✅ Relatório exportado!","ok");}} style={{ width:"100%",padding:11,border:"none",borderRadius:9,fontFamily:font.title,fontSize:".9rem",letterSpacing:"1.5px",cursor:"pointer",background:`linear-gradient(135deg,${c.g[0]},${c.g[1]})`,color:c.dark?"#000":"#fff",WebkitTapHighlightColor:"transparent" }}>
              ⬇ EXPORTAR .TXT
            </button>
          </div>
        ))}
      </div>
      <div style={{ height:14 }} />
    </div>
  );
}

// ─── SYNC PAGE ────────────────────────────────────────────────────────────────
function SyncPage({ col, onImport, onToast }) {
  const [imported, setImported] = useState(false);
  const [preview,  setPreview]  = useState(null); // decoded col before confirming

  // Check if arriving with ?sync= in URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const data   = params.get("sync");
    if(data) {
      const decoded = decodeCollection(data);
      if(decoded && Object.keys(decoded).length > 0) {
        setPreview(decoded);
      } else {
        onToast("❌ Link inválido ou expirado", "err");
      }
      // Clean URL without reloading
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  function generateLink() {
    const encoded = encodeCollection(col);
    if(!encoded) { onToast("Nenhuma figurinha para compartilhar","err"); return; }
    return `${window.location.origin}${window.location.pathname}?sync=${encoded}`;
  }

  function shareWhatsApp() {
    const link = generateLink();
    if(!link) return;
    const msg  = `🏆 *Álbum Copa 2026 — Minha Coleção*\n\nToque no link para importar minhas figurinhas:\n${link}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, "_blank");
    onToast("✅ Link gerado!", "ok");
  }

  function copyLink() {
    const link = generateLink();
    if(!link) return;
    navigator.clipboard?.writeText(link).then(() => onToast("✅ Link copiado!", "ok"))
      .catch(() => onToast("❌ Não foi possível copiar", "err"));
  }

  function confirmImport() {
    onImport(preview);
    setPreview(null);
    setImported(true);
    onToast("✅ Coleção importada com sucesso!", "ok");
  }

  const have  = Object.values(col).filter(v=>v>0).length;
  const pct   = Math.round((have/TOTAL)*100);

  // preview stats
  const prevHave = preview ? Object.values(preview).filter(v=>v>0).length : 0;
  const prevPct  = preview ? Math.round((prevHave/TOTAL)*100) : 0;

  return (
    <div>
      <div style={{ padding:"16px 12px 8px" }}>
        <h2 style={{ fontFamily:font.title,fontSize:"1.5rem",letterSpacing:"2px" }}>🔗 SINCRONIZAR</h2>
        <p style={{ color:"var(--muted)",fontSize:".8rem",fontWeight:700,marginTop:2,lineHeight:1.5 }}>
          Compartilhe sua coleção via link. Quem abrir o link pode importar suas figurinhas.
        </p>
      </div>

      {/* Import preview — shown when arriving via sync link */}
      {preview && (
        <div style={{ margin:"0 12px 14px",background:"rgba(0,200,83,0.08)",border:"1.5px solid rgba(0,200,83,0.35)",borderRadius:16,padding:"16px" }}>
          <div style={{ fontFamily:font.title,fontSize:"1rem",letterSpacing:"1px",color:green,marginBottom:8 }}>📥 COLEÇÃO RECEBIDA</div>
          <p style={{ fontSize:".78rem",color:"var(--muted)",fontWeight:700,marginBottom:12,lineHeight:1.5 }}>
            Um link de sincronização foi detectado. Deseja importar essa coleção?
          </p>
          <div style={{ display:"flex",gap:8,marginBottom:12 }}>
            <div style={{ flex:1,background:"var(--card)",borderRadius:10,padding:"10px",textAlign:"center" }}>
              <div style={{ fontFamily:font.title,fontSize:"1.4rem",color:green }}>{prevHave}</div>
              <div style={{ fontSize:".6rem",color:"var(--muted)",fontWeight:800,textTransform:"uppercase" }}>Figurinhas</div>
            </div>
            <div style={{ flex:1,background:"var(--card)",borderRadius:10,padding:"10px",textAlign:"center" }}>
              <div style={{ fontFamily:font.title,fontSize:"1.4rem",color:green }}>{prevPct}%</div>
              <div style={{ fontSize:".6rem",color:"var(--muted)",fontWeight:800,textTransform:"uppercase" }}>Completo</div>
            </div>
          </div>
          <div style={{ background:"rgba(255,68,68,0.08)",border:"1px solid rgba(255,68,68,0.25)",borderRadius:9,padding:"8px 12px",fontSize:".72rem",color:"#ff6b6b",fontWeight:700,marginBottom:12,lineHeight:1.5 }}>
            ⚠️ Isso vai <strong>substituir</strong> sua coleção atual ({have} figurinhas, {pct}%). Faça um backup antes se necessário.
          </div>
          <div style={{ display:"flex",gap:8 }}>
            <button onClick={()=>setPreview(null)} style={{ flex:1,padding:11,border:"1px solid var(--bdr)",borderRadius:10,background:"var(--card)",color:"var(--text)",fontFamily:font.body,fontSize:".8rem",fontWeight:800,cursor:"pointer" }}>Cancelar</button>
            <button onClick={confirmImport} style={{ flex:2,padding:11,border:"none",borderRadius:10,background:`linear-gradient(135deg,${green},#009640)`,color:"#fff",fontFamily:font.title,fontSize:".95rem",letterSpacing:"1.5px",cursor:"pointer",WebkitTapHighlightColor:"transparent" }}>✅ IMPORTAR</button>
          </div>
        </div>
      )}

      {/* Export / Share */}
      <div style={{ margin:"0 12px 12px",background:"var(--card)",border:"1px solid var(--bdr)",borderRadius:16,padding:"16px" }}>
        <div style={{ fontFamily:font.title,fontSize:"1rem",letterSpacing:"1px",marginBottom:4 }}>📤 COMPARTILHAR MINHA COLEÇÃO</div>
        <p style={{ fontSize:".75rem",color:"var(--muted)",fontWeight:700,lineHeight:1.5,marginBottom:14 }}>
          Gera um link com toda a sua coleção atual ({have} figurinhas). Quem abrir o link poderá importar seus dados.
        </p>

        {/* current stats */}
        <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:6,marginBottom:14 }}>
          {[["Tenho",have],["Faltam",TOTAL-have],["Completo",pct+"%"]].map(([l,v])=>(
            <div key={l} style={{ background:"var(--card2)",borderRadius:10,padding:"8px 6px",textAlign:"center" }}>
              <div style={{ fontFamily:font.title,fontSize:"1.2rem",color:gold }}>{v}</div>
              <div style={{ fontSize:".58rem",color:"var(--muted)",fontWeight:800,textTransform:"uppercase",marginTop:2 }}>{l}</div>
            </div>
          ))}
        </div>

        <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
          <button onClick={shareWhatsApp} style={{ width:"100%",padding:13,border:"none",borderRadius:11,fontFamily:font.title,fontSize:"1rem",letterSpacing:"2px",cursor:"pointer",background:"linear-gradient(135deg,#25D366,#128C7E)",color:"#fff",WebkitTapHighlightColor:"transparent",display:"flex",alignItems:"center",justifyContent:"center",gap:8 }}>
            📲 COMPARTILHAR NO WHATSAPP
          </button>
          <button onClick={copyLink} style={{ width:"100%",padding:13,border:"1px solid var(--bdr)",borderRadius:11,fontFamily:font.title,fontSize:"1rem",letterSpacing:"2px",cursor:"pointer",background:"var(--card2)",color:"var(--text)",WebkitTapHighlightColor:"transparent",display:"flex",alignItems:"center",justifyContent:"center",gap:8 }}>
            🔗 COPIAR LINK
          </button>
        </div>
      </div>

      {/* How it works */}
      <div style={{ margin:"0 12px 12px",background:"rgba(255,215,0,0.05)",border:"1px solid rgba(255,215,0,0.15)",borderRadius:12,padding:"12px 14px" }}>
        <div style={{ fontFamily:font.title,fontSize:".85rem",letterSpacing:"1px",marginBottom:8 }}>💡 COMO FUNCIONA</div>
        <div style={{ display:"flex",flexDirection:"column",gap:6 }}>
          {[
            ["1️⃣","Toque em Compartilhar no WhatsApp ou Copiar Link"],
            ["2️⃣","Envie o link para o outro dispositivo"],
            ["3️⃣","No outro aparelho, abra o link no navegador"],
            ["4️⃣","O app detecta o link e oferece importar a coleção"],
          ].map(([n,t])=>(
            <div key={n} style={{ display:"flex",gap:8,alignItems:"flex-start" }}>
              <span style={{ fontSize:14,flexShrink:0 }}>{n}</span>
              <span style={{ fontSize:".75rem",color:"var(--muted)",fontWeight:700,lineHeight:1.5 }}>{t}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop:10,fontSize:".68rem",color:"var(--muted)",fontWeight:700,lineHeight:1.5,borderTop:"1px solid var(--bdr)",paddingTop:8 }}>
          ⚠️ O link contém toda a sua coleção. Não o compartilhe publicamente. Funciona somente com a URL do app hospedado.
        </div>
      </div>

      <div style={{ height:14 }} />
    </div>
  );
}

// ─── BACKUP PAGE ──────────────────────────────────────────────────────────────
function BackupPage({ col, onImport, onToast}) {
  function exportBackup(){ const a=Object.assign(document.createElement("a"),{href:URL.createObjectURL(new Blob([JSON.stringify({version:2,exportedAt:new Date().toISOString(),collection:col},null,2)],{type:"application/json"})),download:"album-copa-backup.json"});document.body.appendChild(a);a.click();document.body.removeChild(a);onToast("✅ Backup exportado!","ok"); }
  function importBackup(e){ const file=e.target.files[0];if(!file)return;const reader=new FileReader();reader.onload=ev=>{try{const parsed=JSON.parse(ev.target.result);const data=parsed.collection||parsed;if(typeof data!=="object"||Array.isArray(data))throw new Error();onImport(data);onToast("✅ Backup restaurado!","ok");}catch{onToast("❌ Arquivo inválido","err");}e.target.value="";};reader.readAsText(file); }
  const cs={background:"var(--card)",border:"1px solid var(--bdr)",borderRadius:13,padding:16,marginBottom:10};
  const bs=(g1,g2,dk)=>({width:"100%",padding:13,border:"none",borderRadius:10,fontFamily:font.title,fontSize:"1rem",letterSpacing:"2px",cursor:"pointer",background:`linear-gradient(135deg,${g1},${g2})`,color:dk?"#000":"#fff",WebkitTapHighlightColor:"transparent"});
  return (
    <div style={{ padding:"16px 12px" }}>
      <h2 style={{ fontFamily:font.title,fontSize:"1.5rem",letterSpacing:"2px",marginBottom:4 }}>💾 BACKUP</h2>
      <p style={{ color:"var(--muted)",fontSize:".75rem",fontWeight:700,marginBottom:18,lineHeight:1.5 }}>Salve seus dados antes de atualizar o app.</p>
      <div style={cs}><h3 style={{ fontFamily:font.title,fontSize:"1rem",letterSpacing:1,marginBottom:4 }}>📤 Exportar dados</h3><p style={{ color:"var(--muted)",fontSize:".72rem",fontWeight:700,lineHeight:1.45,marginBottom:10 }}>Baixa <strong style={{color:gold}}>album-copa-backup.json</strong>.</p><button onClick={exportBackup} style={bs(gold,gold2,true)}>⬇ BAIXAR BACKUP</button></div>
      <div style={cs}><h3 style={{ fontFamily:font.title,fontSize:"1rem",letterSpacing:1,marginBottom:4 }}>📥 Importar dados</h3><p style={{ color:"var(--muted)",fontSize:".72rem",fontWeight:700,lineHeight:1.45,marginBottom:10 }}>Restaura a partir de um arquivo de backup.</p><label style={{display:"block"}}><div style={bs(green,"#009640",false)}>⬆ CARREGAR BACKUP</div><input type="file" accept=".json,application/json" onChange={importBackup} style={{display:"none"}} /></label></div>
      <div style={{ background:"rgba(255,215,0,0.05)",border:`1px solid rgba(255,215,0,.12)`,borderRadius:9,padding:"11px 13px",fontSize:".71rem",color:"var(--muted)",fontWeight:700,lineHeight:1.55 }}><strong style={{color:gold}}>💡 Dica:</strong> Antes de atualizar o app, exporte o backup. Depois importe para restaurar seus dados.</div>
      <div style={{ height:14 }} />
    </div>
  );
}

const APP_VERSION = "1.4.0";

// ─── SOBRE PAGE ───────────────────────────────────────────────────────────────
function SobrePage({}) {
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
      <div style={{ textAlign:"center", padding:"24px 0 20px", borderBottom:"1px solid var(--bdr)", marginBottom:20 }}>
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
      <div style={{ background:"var(--card)", border:"1px solid var(--bdr)", borderRadius:16, padding:"18px 16px", marginBottom:14 }}>
        <h3 style={{ fontFamily:font.title, fontSize:"1.1rem", letterSpacing:"1.5px", marginBottom:12, display:"flex", alignItems:"center", gap:8 }}>
          <span>📖</span> SOBRE O APP
        </h3>
        <p style={{ fontSize:".82rem", color:"#ccc", fontWeight:700, lineHeight:1.7, marginBottom:12 }}>
          Este aplicativo foi desenvolvido <strong style={{color:gold}}>100% pelo Claude</strong> (IA da Anthropic), como um experimento pessoal de <strong style={{color:"var(--text)"}}>Marcel Inowe</strong>.
        </p>
        <p style={{ fontSize:".82rem", color:"#ccc", fontWeight:700, lineHeight:1.7, marginBottom:12 }}>
          O projeto nasceu da necessidade: nenhuma outra aplicação disponível atendia às necessidades de recursos e usabilidade que eu precisava para controlar meu álbum da Copa 2026.
        </p>
        <p style={{ fontSize:".82rem", color:"#ccc", fontWeight:700, lineHeight:1.7 }}>
          Do zero à versão publicada, todo o código — front-end, lógica, design e infraestrutura AWS — foi gerado em conversas com o Claude, na versão gratuita.
        </p>
      </div>

      {/* features */}
      <div style={{ background:"var(--card)", border:"1px solid var(--bdr)", borderRadius:16, padding:"18px 16px", marginBottom:14 }}>
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
        <div style={{ textAlign:"center", marginTop:10, fontSize:".72rem", color:"var(--muted)", fontWeight:700 }}>
          marcel.inowe@gmail.com
        </div>
      </div>

      {/* rodapé */}
      <div style={{ textAlign:"center", padding:"12px 0", color:"var(--muted)", fontSize:".68rem", fontWeight:700, lineHeight:1.8 }}>
        <div>Álbum Copa 2026 · v{APP_VERSION}</div>
        <div>Desenvolvido com 🤖 Claude (Anthropic)</div>
        <div>© 2026 Marcel Inowe</div>
      </div>

      <div style={{ height:14 }} />
    </div>
  );
}

// ─── THEME PAGE ───────────────────────────────────────────────────────────────
function ThemePage({ theme, accent, onTheme, onAccent }) {
  return (
    <div style={{ padding:"16px 12px" }}>
      <h2 style={{ fontFamily:font.title,fontSize:"1.5rem",letterSpacing:"2px",marginBottom:4 }}>🎨 APARÊNCIA</h2>
      <p style={{ color:"var(--muted)",fontSize:".78rem",fontWeight:700,marginBottom:20,lineHeight:1.5 }}>
        Escolha o tema de fundo e a cor de destaque do app.
      </p>

      {/* ── BASE THEMES ── */}
      <div style={{ fontFamily:font.title,fontSize:".9rem",letterSpacing:"1.5px",color:"var(--muted)",marginBottom:10 }}>TEMA DE FUNDO</div>
      <div style={{ display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:8,marginBottom:24 }}>
        {Object.entries(THEMES).map(([key,t])=>{
          const active = theme === key;
          return (
            <button key={key} onClick={()=>onTheme(key)}
              style={{ background:t["--card"],border:`2px solid ${active?"var(--accent)":"var(--bdr)"}`,borderRadius:12,padding:"12px 10px",cursor:"pointer",WebkitTapHighlightColor:"transparent",display:"flex",alignItems:"center",gap:10,transition:"border-color .2s",textAlign:"left" }}>
              {/* mini preview */}
              <div style={{ width:32,height:32,borderRadius:8,background:t["--bg"],border:`1px solid ${t["--card2"]}`,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14 }}>
                {active ? "✓" : ""}
              </div>
              <div>
                <div style={{ fontFamily:font.body,fontSize:".78rem",fontWeight:800,color:t["--text"] }}>{t.name}</div>
                <div style={{ display:"flex",gap:3,marginTop:4 }}>
                  <div style={{ width:10,height:10,borderRadius:"50%",background:t["--bg"] }} />
                  <div style={{ width:10,height:10,borderRadius:"50%",background:t["--card"] }} />
                  <div style={{ width:10,height:10,borderRadius:"50%",background:t["--text"] }} />
                </div>
              </div>
              {active && <div style={{ marginLeft:"auto",width:8,height:8,borderRadius:"50%",background:"var(--accent)",flexShrink:0 }} />}
            </button>
          );
        })}
      </div>

      {/* ── ACCENT COLORS ── */}
      <div style={{ fontFamily:font.title,fontSize:".9rem",letterSpacing:"1.5px",color:"var(--muted)",marginBottom:10 }}>COR DE DESTAQUE</div>
      <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:16 }}>
        {ACCENTS.map(a=>{
          const active = accent === a.id;
          return (
            <button key={a.id} onClick={()=>onAccent(a.id)}
              style={{ border:`2px solid ${active?a.color:"var(--bdr)"}`,borderRadius:12,padding:"12px 6px",cursor:"pointer",WebkitTapHighlightColor:"transparent",background:active?`${a.color}18`:"var(--card)",display:"flex",flexDirection:"column",alignItems:"center",gap:6,transition:"all .2s" }}>
              <div style={{ width:28,height:28,borderRadius:"50%",background:`linear-gradient(135deg,${a.color},${a.color2})`,boxShadow:active?`0 0 12px ${a.color}60`:""}} />
              <span style={{ fontFamily:font.body,fontSize:".6rem",fontWeight:800,color:active?a.color:"var(--muted)" }}>{a.label}</span>
            </button>
          );
        })}
      </div>

      {/* preview strip */}
      <div style={{ background:"var(--card)",border:"1px solid var(--bdr)",borderRadius:12,padding:"14px",marginTop:8 }}>
        <div style={{ fontSize:".7rem",color:"var(--muted)",fontWeight:800,marginBottom:10,textTransform:"uppercase",letterSpacing:1 }}>Prévia</div>
        <div style={{ display:"flex",gap:8,marginBottom:8 }}>
          <div style={{ flex:1,padding:"8px",background:`linear-gradient(135deg,var(--accent),var(--accent2))`,borderRadius:8,textAlign:"center",fontFamily:font.title,fontSize:".9rem",letterSpacing:1,color:"#000" }}>BOTÃO</div>
          <div style={{ flex:1,padding:"8px",border:"1.5px solid var(--accent)",borderRadius:8,textAlign:"center",fontFamily:font.body,fontSize:".78rem",fontWeight:800,color:"var(--accent)" }}>BORDA</div>
        </div>
        <div style={{ height:6,background:"var(--card2)",borderRadius:99,overflow:"hidden" }}>
          <div style={{ height:"100%",width:"65%",background:`linear-gradient(90deg,var(--accent),var(--accent2))`,borderRadius:99 }} />
        </div>
        <div style={{ fontSize:".65rem",color:"var(--muted)",fontWeight:700,marginTop:6 }}>Barra de progresso — 65%</div>
      </div>

      <div style={{ height:14 }} />
    </div>
  );
}

// ─── HAMBURGER MENU ───────────────────────────────────────────────────────────
function HamburgerMenu({ onSelect}) {
  const [open,setOpen]=useState(false);
  const items=[
    {id:"search",   ico:"🔍", label:"Busca Rápida"},
    {id:"trade",    ico:"🔄", label:"Modo Troca"},
    {id:"packets",  ico:"📦", label:"Pacotes"},
    {id:"progress", ico:"📊", label:"Progresso"},
    {id:"map",      ico:"🗺️", label:"Mapa-Múndi"},
    {id:"reports",  ico:"📋", label:"Relatórios"},
    {id:"sync",     ico:"🔗", label:"Sincronizar"},
    {id:"backup",   ico:"💾", label:"Backup"},
    {id:"theme",    ico:"🎨", label:"Aparência"},
    {id:"sobre",    ico:"ℹ️", label:"Sobre"},
  ];
  return (
    <div style={{ position:"relative" }}>
      {open&&<div onClick={()=>setOpen(false)} style={{ position:"fixed",inset:0,zIndex:150 }} />}
      <button onClick={()=>setOpen(o=>!o)} style={{ background:"none",border:"1px solid var(--bdr)",borderRadius:8,color:open?gold:muted,padding:"6px 9px",cursor:"pointer",display:"flex",flexDirection:"column",gap:4,WebkitTapHighlightColor:"transparent",zIndex:160,position:"relative" }}>
        {open?<span style={{ fontSize:16,lineHeight:1,color:gold }}>✕</span>:<>{[0,1,2].map(i=><span key={i} style={{ display:"block",width:18,height:2,background:muted,borderRadius:2 }} />)}</>}
      </button>
      {open&&(
        <div style={{ position:"absolute",top:"calc(100% + 8px)",right:0,background:"rgba(14,14,28,0.98)",border:"1px solid var(--bdr)",borderRadius:12,overflow:"hidden",minWidth:180,zIndex:200,boxShadow:"0 8px 32px rgba(0,0,0,0.5)",animation:"slideDown .15s ease" }}>
          {items.map((item,i)=>(
            <button key={item.id} onClick={()=>{onSelect(item.id);setOpen(false);}} style={{ display:"flex",alignItems:"center",gap:10,width:"100%",padding:"13px 16px",background:"transparent",border:"none",borderBottom:i<items.length-1?"1px solid var(--bdr)":"none",color:"var(--text)",fontFamily:font.body,fontSize:".85rem",fontWeight:800,cursor:"pointer",textAlign:"left",WebkitTapHighlightColor:"transparent" }}>
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
  sync:"SINCRONIZAR", backup:"BACKUP", theme:"APARÊNCIA", sobre:"SOBRE",
};

export default function App() {
  const [col,     setCol]     = useState(loadCol);
  const [packets, setPackets] = useState(loadPkt);
  const [avulsas, setAvulsas] = useState(loadAvu);
  const [page,    setPage]    = useState("album");
  const [toast,   setToast]   = useState(null);
  const [confetti,setConfetti]= useState(false);
  const [banner,  setBanner]  = useState(null);
  const [locked,  setLocked]  = useState(loadLock);
  const [theme,   setTheme]   = useState(loadTheme);
  const [accent,  setAccent]  = useState(loadAccent);
  const ttRef = useRef(null);

  function toggleLocked() {
    setLocked(l => { const next = !l; persistLock(next); return next; });
  }
  function toggleTheme() {
    const keys = Object.keys(THEMES);
    setTheme(t => { const next = keys[(keys.indexOf(t)+1)%keys.length]; persistTheme(next); return next; });
  }
  function handleTheme(t)  { setTheme(t);  persistTheme(t);  }
  function handleAccent(a) { setAccent(a); persistAccent(a); }

  // Check for ?sync= in URL on first load — navigate to sync page
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if(params.get("sync")) setPage("sync");
  }, []);
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

  function addAvulsa(item){ const a=[...avulsas,item]; setAvulsas(a); persistAvu(a); }
  function removeAvulsa(id){ const a=avulsas.filter(i=>i.id!==id); setAvulsas(a); persistAvu(a); }
  function resetAvulsas(){ setAvulsas([]); persistAvu([]); }

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
        :root{${themeCSS(theme, accent)}}
        body{background:var(--bg);}
        @keyframes slideDown{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:none}}
        input::placeholder{color:var(--ph);}
        ::-webkit-scrollbar{width:0;}
      `}</style>

      <div style={{ display:"flex",flexDirection:"column",height:"100dvh",background:"var(--bg)",color:"var(--text)",fontFamily:font.body,overflow:"hidden",backgroundImage:"var(--bg-img)",transition:"background .3s,color .3s" }}>

        {/* header */}
        <div style={{ flexShrink:0,background:"var(--hdr)",backdropFilter:"blur(20px)",borderBottom:"1px solid var(--bdr)",padding:"12px 14px 10px",display:"flex",alignItems:"center",gap:10,zIndex:100,transition:"background .3s" }}>
          {page!=="album"?(
            <button onClick={()=>setPage("album")} style={{ background:"none",border:"1px solid var(--bdr)",borderRadius:8,color:gold,fontSize:".75rem",fontWeight:800,fontFamily:font.body,padding:"5px 10px",cursor:"pointer",WebkitTapHighlightColor:"transparent" }}>← Álbum</button>
          ):(
            <span style={{ fontSize:24,filter:"drop-shadow(0 0 14px rgba(255,215,0,.65))" }}>🏆</span>
          )}
          <div style={{ flex:1 }}>
            <div style={{ fontFamily:font.title,fontSize:"1.3rem",letterSpacing:"2.5px",background:`linear-gradient(135deg,${gold},${gold2})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",lineHeight:1 }}>
              {PAGE_TITLES[page]||"COPA 2026"}
            </div>
            {page==="album"&&<div style={{ fontSize:".6rem",color:"var(--muted)",fontWeight:800,letterSpacing:".5px",textTransform:"uppercase",marginTop:1 }}>{have} de {TOTAL} figurinhas · {pct}% completo</div>}
          </div>

          {/* theme toggle — cycles through themes */}
          <button onClick={toggleTheme} title="Mudar tema"
            style={{ background:"none",border:"1px solid var(--bdr)",borderRadius:8,padding:"5px 8px",cursor:"pointer",fontSize:16,lineHeight:1,WebkitTapHighlightColor:"transparent",display:"flex",alignItems:"center",justifyContent:"center" }}>
            🎨
          </button>

          {/* lock */}
          <button onClick={toggleLocked} title={locked?"Desbloquear edição":"Bloquear edição"}
            style={{ background:locked?"rgba(255,68,68,0.12)":"rgba(255,215,0,0.06)",border:`1.5px solid ${locked?"rgba(255,68,68,0.5)":"rgba(255,215,0,0.2)"}`,borderRadius:8,padding:"5px 8px",cursor:"pointer",fontSize:16,lineHeight:1,WebkitTapHighlightColor:"transparent",display:"flex",alignItems:"center",justifyContent:"center",transition:"all .2s" }}>
            {locked ? "🔒" : "🔓"}
          </button>

          <HamburgerMenu onSelect={setPage} />
        </div>

        {/* scroll area */}
        <div style={{ flex:1,overflowY:"auto",WebkitOverflowScrolling:"touch" }}>
          {page==="album"   && <AlbumPage    col={col} onUpdate={update} onNavigate={setPage} onGroupComplete={handleGroupComplete} locked={locked}  />}
          {page==="doubles" && <DoublesPage  col={col}  />}
          {page==="have"    && <HavePage     col={col}  />}
          {page==="miss"    && <MissPage     col={col}  />}
          {page==="search"  && <SearchPage   col={col}  />}
          {page==="trade"   && <TradePage    col={col} onToast={showToast}  />}
          {page==="packets" && <PacketsPage  packets={packets} onAdd={addPacket} onRemove={removePacket} onReset={resetPackets} avulsas={avulsas} onAddAvu={addAvulsa} onRemoveAvu={removeAvulsa} onResetAvu={resetAvulsas} onToast={showToast}  />}
          {page==="progress"&& <ProgressPage col={col}  />}
          {page==="map"     && <WorldMapPage col={col}  />}
          {page==="reports" && <ReportsPage  col={col} onToast={showToast}  />}
          {page==="backup"  && <BackupPage   col={col} onImport={importCol} onToast={showToast}  />}
          {page==="sync"    && <SyncPage     col={col} onImport={importCol} onToast={showToast}  />}
          {page==="theme"   && <ThemePage    theme={theme} accent={accent} onTheme={handleTheme} onAccent={handleAccent} />}
          {page==="sobre"   && <SobrePage     />}
        </div>

        {toast && <Toast msg={toast.msg} type={toast.type} />}
        {confetti && <Confetti onDone={()=>setConfetti(false)} />}
        {banner && <GroupBanner grp={banner} onDone={()=>setBanner(null)}  />}
      </div>
    </>
  );
}
