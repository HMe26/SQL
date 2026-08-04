/* ============================================================
   SAMPLE DATA GENERATOR
   ------------------------------------------------------------
   Produces realistic, schema-aware example rows for every table,
   purely from the actual column definitions in SCHEMA (name,
   type, nullable, enum values, FK targets) — nothing hardcoded
   per table. Deterministic (seeded RNG keyed by table name) so
   the same table always shows the same sample rows.
   ============================================================ */

const SAMPLE_ROWS_PER_TABLE = 6;
const sampleDataCache = {};

/* ---- seeded RNG (mulberry32) ---- */
function hashSeed(str){
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++){
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  };
}
function mulberry32(seed){
  let a = seed >>> 0;
  return function(){
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function makeRng(seedStr){
  const seedFn = hashSeed(seedStr);
  return mulberry32(Math.floor(seedFn() * 4294967296));
}
function rngPick(rng, arr){ return arr[Math.floor(rng() * arr.length)]; }
function rngInt(rng, min, max){ return Math.floor(rng() * (max - min + 1)) + min; }
function rngBool(rng, pTrue){ return rng() < (pTrue == null ? 0.5 : pTrue); }

/* ---- word banks (small, self-contained — no external dependency) ---- */
const WB = {
  firstNames: ["Amira","Youssef","Laila","Omar","Sara","Karim","Nour","Hassan","Mona","Tarek","Dina","Ziad","Farah","Adam","Salma","Khaled","Rana","Fady","Heba","Marwan"],
  lastNames: ["Hassan","El-Sayed","Ibrahim","Mostafa","Abdel-Rahman","Kamal","Farouk","Nasser","Aziz","Sherif","Fahmy","Rashad","Gaber","Younes","Adel"],
  companySuffix: ["Labs","Technologies","Systems","Analytics","Ventures","Group","Solutions","Networks","Dynamics","Studio"],
  companyRoot: ["Nile","Horizon","Delta","Pyramid","Quantum","Vertex","Cairo","Falcon","Orbit","Atlas","Lotus","Beacon","Summit","Nova","Sphinx"],
  projectRoot: ["Smart","Neural","EcoTrack","AgriSense","MedAssist","EduFlow","GreenGrid","UrbanPulse","AquaGuard","FinSight","CropAI","SolarNet","HealthLink","TransitIQ","WastelessAI"],
  projectSuffix: ["Platform","Engine","Toolkit","Dashboard","Network","Framework","Assistant","Hub","System","Portal"],
  university: ["Cairo University","Ain Shams University","Alexandria University","Beni Suef University","Assiut University","Mansoura University","Helwan University","Zagazig University"],
  faculty: ["Faculty of Engineering","Faculty of Computers & AI","Faculty of Science","Faculty of Commerce","Faculty of Medicine","Faculty of Agriculture","Faculty of Pharmacy","Faculty of Arts"],
  department: ["Computer Science","Software Engineering","Electrical Engineering","Business Administration","Biomedical Engineering","Mechatronics","Information Systems","Data Science"],
  words: ["innovation","research","student","platform","insight","growth","impact","review","cycle","record","module","report","score","status","update","access","session","metric","summary","policy"],
  adjectives: ["automated","initial","verified","pending","archived","active","draft","reviewed","flagged","optimized"],
  statuses: ["pending","active","approved","rejected","completed","in_progress","cancelled","draft"],
  domains: ["uip.edu.eg","gmail.com","outlook.com","students.cu.edu.eg","research.org"],
};
function titleCase(s){ return s.replace(/(^|\s)\S/g, c => c.toUpperCase()); }
function slugify(s){ return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""); }
/* word-boundary-safe token check for snake_case column names — avoids false
   positives like "description".includes("ip") matching on "descrIPtion" */
function hasToken(name, token){
  return name.split(/[^a-z0-9]+/i).includes(token);
}

function genUuid(rng){
  const hex = () => Math.floor(rng() * 16).toString(16);
  const seg = n => Array.from({ length: n }, hex).join("");
  return `${seg(8)}-${seg(4)}-4${seg(3)}-${rngPick(rng,["8","9","a","b"])}${seg(3)}-${seg(12)}`;
}
function genHexToken(rng, len){
  return Array.from({ length: len }, () => Math.floor(rng() * 16).toString(16)).join("");
}
function genIp(rng){ return `${rngInt(rng,10,223)}.${rngInt(rng,0,255)}.${rngInt(rng,0,255)}.${rngInt(rng,1,254)}`; }
function genPersonName(rng){ return `${rngPick(rng, WB.firstNames)} ${rngPick(rng, WB.lastNames)}`; }
function genEmail(rng, name){
  const base = (name || genPersonName(rng)).toLowerCase().replace(/[^a-z\s]/g, "").trim().split(/\s+/).join(".");
  return `${base}${rngInt(rng,1,99)}@${rngPick(rng, WB.domains)}`;
}
function genCompanyName(rng){ return `${rngPick(rng, WB.companyRoot)} ${rngPick(rng, WB.companySuffix)}`; }
function genProjectTitle(rng){ return `${rngPick(rng, WB.projectRoot)} ${rngPick(rng, WB.projectSuffix)}`; }
function genSentence(rng, minWords, maxWords){
  const n = rngInt(rng, minWords, maxWords);
  const arr = Array.from({ length: n }, () => rngPick(rng, WB.words));
  return titleCase(arr.join(" ")) + ".";
}
function genDateTime(rng, daysBack){
  const now = Date.UTC(2026, 6, 1); // fixed anchor so output is stable regardless of "today"
  const past = now - rngInt(rng, 0, daysBack || 540) * 86400000 - rngInt(rng, 0, 86399) * 1000;
  return new Date(past).toISOString().slice(0, 19).replace("T", " ");
}
function genDate(rng, daysBack){ return genDateTime(rng, daysBack).slice(0, 10); }
function genUrl(rng, path){ return `https://uip.edu.eg/${path || "files"}/${genHexToken(rng, 10)}`; }
function genDecimal(rng, min, max, decimals){
  return (rng() * (max - min) + min).toFixed(decimals == null ? 2 : decimals);
}
function genPhone(rng){ return `+20 1${rngInt(rng,0,2)} ${rngInt(rng,1000,9999)} ${rngInt(rng,1000,9999)}`; }

/* Parse ENUM('a','b','c') -> ['a','b','c'] */
function parseEnumValues(type){
  const m = /ENUM\(([^)]*)\)/i.exec(type || "");
  if (!m) return null;
  return m[1].split(",").map(s => s.trim().replace(/^'|'$/g, ""));
}

/* Parse DECIMAL(precision,scale) -> a realistic max value that actually fits the column */
function parseDecimalBounds(type){
  const m = /DECIMAL\((\d+)\s*,\s*(\d+)\)/i.exec(type || "");
  if (!m) return null;
  const precision = parseInt(m[1], 10), scale = parseInt(m[2], 10);
  const max = Math.pow(10, precision - scale) - Math.pow(10, -scale);
  return { max: Math.max(0, max), scale };
}

/* Decide a value for one column, given the row index and the table's own PK values already assigned (for self-consistency). */
function genColumnValue(rng, table, col, rowIndex, pkValuesForTable){
  const name = col.name.toLowerCase();
  const type = (col.type || "").toUpperCase();

  // Nullable columns: sometimes emit null (never for the PK)
  const isPk = table.pk.includes(col.name);
  if (!isPk && col.nullable && rngBool(rng, 0.16)) return null;

  // Primary key / plain auto-increment id
  if (isPk && table.pk.length === 1 && /INT/.test(type)) return rowIndex + 1;

  // Foreign keys: point at a plausible id in the referenced table (1..N range)
  const fk = table.fks.find(f => f.column === col.name);
  if (fk){
    const refTable = SCHEMA.tables[fk.ref_table];
    const refIsIntPk = refTable && refTable.pk.length === 1 && /INT/.test((refTable.columns.find(c => c.name === refTable.pk[0]) || {}).type || "");
    if (refIsIntPk) return rngInt(rng, 1, SAMPLE_ROWS_PER_TABLE);
    return genUuid(rng);
  }

  // ENUM columns
  const enumVals = parseEnumValues(type);
  if (enumVals && enumVals.length) return rngPick(rng, enumVals);

  // JSON columns — shape depends on the column name, but always valid JSON
  if (/JSON/.test(type)){
    if (name.includes("skill")) return JSON.stringify(Array.from({ length: rngInt(rng, 2, 4) }, () => rngPick(rng, WB.words)));
    if (name.includes("link") || name.includes("social")) return JSON.stringify({ linkedin: genUrl(rng, "u"), github: genUrl(rng, "gh") });
    if (name.includes("meta") || name.includes("payload") || name.includes("data")) return JSON.stringify({ [rngPick(rng, WB.words)]: rngPick(rng, WB.words) });
    return JSON.stringify({ [rngPick(rng, WB.words)]: rngPick(rng, WB.words) });
  }

  // Heuristics by column name.
  // NB: hasToken() splits on underscores and compares whole tokens, so a
  // check like hasToken(name,"ip") matches "source_ip" but NOT "description"
  // — using name.includes("ip") here would wrongly match "descr-IP-tion".
  if (hasToken(name, "number") && /VARCHAR|CHAR/.test(type)) return `${table.name.slice(0,3).toUpperCase()}-${rngInt(rng,2022,2026)}-${String(rngInt(rng,1,9999)).padStart(4,"0")}`;
  if (/^id$/.test(name)) return rowIndex + 1;
  if (name === "uuid" || name === "batch_id" || /_uuid$/.test(name)) return genUuid(rng);
  if (hasToken(name, "token")) return genHexToken(rng, 40);
  if (hasToken(name, "password") || hasToken(name, "hash")) return "$2y$10$" + genHexToken(rng, 40);
  if (hasToken(name, "email")) return genEmail(rng);
  if (hasToken(name, "phone") || hasToken(name, "mobile")) return genPhone(rng);
  if (hasToken(name, "ip") || name === "ip_address") return genIp(rng);
  if (hasToken(name, "avatar") || hasToken(name, "logo") || hasToken(name, "photo") || hasToken(name, "image")) return genUrl(rng, "media");
  if (hasToken(name, "url") || hasToken(name, "link") || hasToken(name, "website")) return genUrl(rng, "repos");
  if (hasToken(name, "slug")) return slugify(genSentence(rng, 2, 4).replace(".", ""));
  if (hasToken(name, "company") && hasToken(name, "name")) return genCompanyName(rng);
  if (hasToken(name, "university") && (hasToken(name, "name") || name === "university")) return rngPick(rng, WB.university);
  if (name === "faculty") return rngPick(rng, WB.faculty);
  if (name === "department" || name === "major") return rngPick(rng, WB.department);
  if (name === "country" || hasToken(name, "country")) return rngPick(rng, WB.university).includes("University") ? "Egypt" : rngPick(rng, ["Egypt","Saudi Arabia","UAE","Jordan","Morocco","Qatar"]);
  if (name === "gpa" || name.includes("grade_point")) {
    const bounds = parseDecimalBounds(type);
    const max = bounds ? Math.min(bounds.max, 4) : 4;
    return genDecimal(rng, 0, max, (bounds && bounds.scale) || 2);
  }
  if (name === "academic_year" || name === "class_year" || name === "study_year" || name === "year_of_study") return rngInt(rng, 1, 5);
  if (name === "title" || name.includes("project_title") || (hasToken(name, "title") && !hasToken(name, "job"))) return genProjectTitle(rng);
  if (name.includes("full_name") || (name === "name" && table.name.match(/user|student|researcher|investor|supervisor/))) return genPersonName(rng);
  if (name.includes("first_name")) return rngPick(rng, WB.firstNames);
  if (name.includes("last_name")) return rngPick(rng, WB.lastNames);
  if (name === "name" || name.endsWith("_name") || name.endsWith("name")) return titleCase(rngPick(rng, WB.words)) + " " + titleCase(rngPick(rng, WB.words));
  if (hasToken(name, "status") || hasToken(name, "state")) return rngPick(rng, WB.statuses);
  if (hasToken(name, "label") || hasToken(name, "key")) return slugify(rngPick(rng, WB.words) + "_" + rngPick(rng, WB.adjectives));
  if (name.startsWith("is_") || name.startsWith("has_") || /BOOL|TINYINT\(1\)/.test(type)) return rngBool(rng, 0.6) ? 1 : 0;
  if (hasToken(name, "percentage") || hasToken(name, "percent") || hasToken(name, "score") || hasToken(name, "readiness")) return genDecimal(rng, 0, 100, 1);
  if (hasToken(name, "rating")) return genDecimal(rng, 1, 5, 1);
  if (hasToken(name, "amount") || hasToken(name, "price") || hasToken(name, "budget") || hasToken(name, "salary") || hasToken(name, "cost") || hasToken(name, "estimate")) return genDecimal(rng, 100, 50000, 2);
  if (hasToken(name, "count") || hasToken(name, "num")) return rngInt(rng, 0, 250);
  if (hasToken(name, "year")) return rngInt(rng, 2021, 2026);
  if (hasToken(name, "code")) return genHexToken(rng, 8).toUpperCase();
  if (hasToken(name, "version")) return `${rngInt(rng,1,4)}.${rngInt(rng,0,9)}.${rngInt(rng,0,9)}`;
  if (name.includes("finished_at") || name.includes("resolved_at") || name.includes("closed_at")) return rngBool(rng, 0.7) ? genDateTime(rng, 300) : null;
  if (name.endsWith("_at") || name === "timestamp") return genDateTime(rng, 540);
  if (name.endsWith("_date") || name === "date") return genDate(rng, 540);
  if (hasToken(name, "description") || hasToken(name, "notes") || hasToken(name, "summary") || hasToken(name, "bio") || hasToken(name, "content") || hasToken(name, "body") || hasToken(name, "message")) return genSentence(rng, 8, 18);
  if (hasToken(name, "reason") || hasToken(name, "comment")) return genSentence(rng, 4, 10);

  // Fall back to SQL type
  if (/TINYINT/.test(type)) return rngInt(rng, 0, 127);
  if (/BIGINT|^INT|SMALLINT|MEDIUMINT/.test(type)) return rngInt(rng, 1, 999);
  if (/DECIMAL/.test(type)){
    const bounds = parseDecimalBounds(type);
    if (bounds) return genDecimal(rng, 0, bounds.max, bounds.scale);
    return genDecimal(rng, 0, 1000, 2);
  }
  if (/FLOAT|DOUBLE/.test(type)) return genDecimal(rng, 0, 1000, 2);
  if (/DATETIME|TIMESTAMP/.test(type)) return genDateTime(rng, 540);
  if (/^DATE/.test(type)) return genDate(rng, 540);
  if (/CHAR\(36\)/.test(type)) return genUuid(rng);
  if (/CHAR|VARCHAR/.test(type)) return titleCase(rngPick(rng, WB.words) + " " + rngPick(rng, WB.words));
  if (/JSON/.test(type)) return `{"${rngPick(rng, WB.words)}":"${rngPick(rng, WB.words)}"}`;
  if (/TEXT/.test(type)) return genSentence(rng, 10, 20);
  return rngPick(rng, WB.words);
}

/* Generate (and cache) sample rows for a table. */
function getSampleRows(tableName){
  if (sampleDataCache[tableName]) return sampleDataCache[tableName];
  const table = SCHEMA.tables[tableName];
  if (!table) return [];
  const rng = makeRng("uip-sample::" + tableName);
  const rows = [];
  for (let i = 0; i < SAMPLE_ROWS_PER_TABLE; i++){
    const row = {};
    table.columns.forEach(col => { row[col.name] = genColumnValue(rng, table, col, i, null); });
    rows.push(row);
  }
  sampleDataCache[tableName] = rows;
  return rows;
}

function formatSampleCell(v){
  if (v === null || v === undefined) return `<span class="sd-null">NULL</span>`;
  if (typeof v === "number") return String(v);
  const s = String(v);
  return s.length > 34 ? escapeHtml(s.slice(0, 32)) + "…" : escapeHtml(s);
}
function escapeHtml(s){
  return String(s).replace(/[&<>"']/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]));
}

/* Build the HTML for the "Sample Data" details-panel tab. */
function buildSampleDataHTML(tableName){
  const table = SCHEMA.tables[tableName];
  const rows = getSampleRows(tableName);
  const cols = table.columns.map(c => c.name);
  const thead = cols.map(c => {
    const isPk = table.pk.includes(c);
    const fk = table.fks.find(f => f.column === c);
    const cls = isPk ? "pk" : (fk ? "fk" : "");
    return `<th class="${cls}">${c}</th>`;
  }).join("");
  const tbody = rows.map((row, i) => {
    const tds = cols.map(c => `<td>${formatSampleCell(row[c])}</td>`).join("");
    return `<tr><td class="sd-rownum">${i + 1}</td>${tds}</tr>`;
  }).join("");
  return `
    <div class="dp-field" style="margin-bottom:12px;">
      <div class="lbl">Synthetic preview data</div>
      <div class="val" style="color:var(--text-2);font-size:11.5px;">
        ${SAMPLE_ROWS_PER_TABLE} rows generated deterministically from this table's actual column
        names, types, ENUM values and foreign keys — for illustration only, not real records.
      </div>
    </div>
    <div class="sd-table-scroll">
      <table class="sd-table">
        <thead><tr><th class="sd-rownum">#</th>${thead}</tr></thead>
        <tbody>${tbody}</tbody>
      </table>
    </div>
  `;
}
