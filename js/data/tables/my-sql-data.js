/* ============================================================
   بياناتي الخاصة — SQL
   ------------------------------------------------------------
   ده الملف الوحيد اللي المفروض تلمسه عشان تضيف جداولك الجديدة.
   مفيش أي حاجة في الملفات الأصلية (schema-meta.js أو tables/*.js
   أو أي ملف تاني) اتلمست أو هتتلمس. اتمسح الملف ده بالكامل =
   يرجع المشروع بالظبط زي ما كان.

   إزاي تستخدمه:
   ------------
   اكتب كود SQL عادي (CREATE TABLE) جوه المتغيّر SQL_INPUT تحت،
   بين ` `  (template literal / backticks) — مش JSON خالص.

   قواعد بسيطة:

   1) جدول واحد = CREATE TABLE واحد، بالشكل التقليدي:

        CREATE TABLE orders (
          id INT UNSIGNED NOT NULL AUTO_INCREMENT,
          user_id INT UNSIGNED NOT NULL,
          status VARCHAR(30) NOT NULL DEFAULT 'pending',
          total DECIMAL(10,2) NULL,
          created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (id),
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE RESTRICT,
          UNIQUE KEY (user_id, status)
        ) COMMENT='طلبات الشراء';

   2) لو الجدول ده بيرتبط بجدول موجود بالفعل في السكيما الأصلية
      (زي users هنا)، اكتب REFERENCES على اسمه عادي بالظبط زي أي
      FK — العلاقة هتتظهر تلقائيًا في الـ ERD وفي "Referenced by"
      حتى لو الجدول التاني (users) موجود في ملف تاني خالص.

   3) لو عايز تتحكم في الموديول (المجموعة اللي الجدول هيتلوّن
      ويتحط جواها) أو الأيقونة أو الوصف، حط تعليق قبل CREATE TABLE
      مباشرة بالشكل ده (اختياري، لو مكتبتوش هياخد قيم افتراضية):

        -- module: My Custom Data
        -- icon: database
        -- desc: وصف مختصر للجدول
        CREATE TABLE orders ( ... );

      لو نفس اسم الموديول اتكرر في أكتر من جدول، كلهم هيتحطوا مع
      بعض في نفس المجموعة تلقائيًا. لو مكتبتش module خالص، هياخد
      "بياناتي الخاصة" كموديول افتراضي واحد لكل الجداول الجديدة.

   4) تقدر تكتب أكتر من CREATE TABLE فوق بعض في نفس المتغير،
      كل جدول لوحده وخلصه بـ ; زي أي سكريبت SQL عادي.

   5) الأيقونات المتاحة هي نفسها Lucide icons المستخدمة في باقي
      المشروع (زي: database, users, briefcase, brain-circuit,
      message-circle, bar-chart-2, shield, shield-alert, settings,
      folder, tag, file-text ... إلخ). لو الأيقونة مش موجودة
      هيظهر شكل افتراضي بسيط، مفيش كسر في الصفحة.

   الملف ده بيتحمّل بعد كل جداول السكيما الأصلية (tables/*.js)
   وقبل core/state-and-helpers.js، فالعلاقات (incomingRefs) بتتحسب
   صح من أول تحميل للصفحة، من غير أي إعادة رسم إضافية.
   ============================================================ */

const SQL_INPUT = `

-- اكتب الـ SQL بتاعك هنا. مثال (امسحه واكتب بتاعك مكانه):

-- module: بياناتي الخاصة
-- icon: database
-- desc: مثال لجدول جديد مرتبط بجدول users الأصلي
CREATE TABLE example_notes (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id INT UNSIGNED NOT NULL,
  title VARCHAR(150) NOT NULL,
  body TEXT NULL,
  is_pinned TINYINT(1) NOT NULL DEFAULT '0',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE RESTRICT
) COMMENT='ملاحظات تجريبية — امسح الجدول ده واكتب جداولك الحقيقية بدلاً منه';

`;

/* ============================================================
   من هنا لتحت: منطق التحويل والدمج. مفيش داعي تعدّل فيه —
   بس لو حابب تفهم أو تطوّره، اتفضل.
   ============================================================ */
(function () {

  const DEFAULT_MODULE = "بياناتي الخاصة";
  const DEFAULT_ICON = "database";

  function customModuleHue(mod) {
    let h = 0;
    for (let i = 0; i < mod.length; i++) h = (h * 31 + mod.charCodeAt(i)) % 360;
    return h;
  }

  // بيشيل تعليقات /* ... */ بس بيحافظ على عدد الأسطر (يبدّلها بمسافات)
  // عشان الـ index بتاع أي كلام تاني ميتزحزحش.
  function stripBlockComments(sql) {
    return sql.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "));
  }

  // بيقسّم أي نص على فاصل (فاصلة أو فاصلة منقوطة) بس في المستوى
  // الأعلى بس (يعني مش جوه أقواس () ولا جوه '...' / "...' / `...`).
  function splitTopLevel(str, delimiterChar) {
    const parts = [];
    let depth = 0, current = "", quote = null;
    for (let i = 0; i < str.length; i++) {
      const ch = str[i];
      if (quote) {
        current += ch;
        if (ch === quote && str[i - 1] !== "\\") quote = null;
        continue;
      }
      if (ch === "'" || ch === '"' || ch === "`") { quote = ch; current += ch; continue; }
      if (ch === "(") { depth++; current += ch; continue; }
      if (ch === ")") { depth--; current += ch; continue; }
      if (ch === delimiterChar && depth === 0) { parts.push(current); current = ""; continue; }
      current += ch;
    }
    if (current.trim()) parts.push(current);
    return parts;
  }

  function stripQuotes(s) {
    if (s == null) return s;
    s = s.trim();
    if ((s.startsWith("'") && s.endsWith("'")) || (s.startsWith('"') && s.endsWith('"'))) {
      return s.slice(1, -1);
    }
    return s;
  }

  function unbacktick(name) {
    return (name || "").trim().replace(/^`|`$/g, "").replace(/^\[|\]$/g, "");
  }

  // بيلاقي التعليقات (-- module: / -- icon: / -- desc:) اللي قبل
  // أول CREATE TABLE في القطعة النصية المدخّلة مباشرة (preamble).
  function extractMeta(preambleText) {
    const meta = { module: null, icon: null, desc: null };
    const lines = preambleText.split(/\r?\n/);
    for (const raw of lines) {
      const line = raw.trim();
      if (!line.startsWith("--") && !line.startsWith("#")) continue;
      const clean = line.replace(/^--\s*|^#\s*/, "");
      const mMod = clean.match(/^module\s*:\s*(.+)$/i);
      const mIcon = clean.match(/^icon\s*:\s*(.+)$/i);
      const mDesc = clean.match(/^desc(?:ription)?\s*:\s*(.+)$/i);
      if (mMod) meta.module = mMod[1].trim();
      if (mIcon) meta.icon = mIcon[1].trim();
      if (mDesc) meta.desc = mDesc[1].trim();
    }
    return meta;
  }

  function parseColumnDef(defText) {
    // name  TYPE(...)  [UNSIGNED]  [NOT NULL|NULL]  [DEFAULT ...]
    // [AUTO_INCREMENT]  [UNIQUE]  [PRIMARY KEY]  [COMMENT '...']
    let text = defText.trim();

    const nameMatch = text.match(/^`?([A-Za-z_][A-Za-z0-9_]*)`?\s+(.+)$/s);
    if (!nameMatch) return null;
    const colName = nameMatch[1];
    let rest = nameMatch[2].trim();

    // النوع: كلمة، ممكن يتبعها (...) ، وممكن تتبعه UNSIGNED/ZEROFILL
    const typeMatch = rest.match(/^([A-Za-z][A-Za-z0-9]*(?:\s*\([^)]*\))?(?:\s+UNSIGNED)?(?:\s+ZEROFILL)?)/i);
    let colType = typeMatch ? typeMatch[1].replace(/\s+/g, " ").trim() : "VARCHAR(255)";
    rest = rest.slice(typeMatch ? typeMatch[0].length : 0).trim();

    let nullable = true;
    if (/\bNOT\s+NULL\b/i.test(rest)) nullable = false;
    else if (/\bNULL\b/i.test(rest)) nullable = true;

    let def = null;
    const defMatch = rest.match(/\bDEFAULT\s+('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|CURRENT_TIMESTAMP(?:\(\))?|NULL|[+-]?\d+(?:\.\d+)?|\S+)/i);
    if (defMatch) {
      def = stripQuotes(defMatch[1]);
      if (/^NULL$/i.test(def)) def = null;
    }

    const unique = /\bUNIQUE\b/i.test(rest);
    const isInlinePk = /\bPRIMARY\s+KEY\b/i.test(rest);

    return {
      column: {
        name: colName,
        type: colType.toUpperCase(),
        nullable: nullable,
        default: def,
        unique: unique
      },
      isInlinePk: isInlinePk
    };
  }

  function parseCreateTable(stmt, meta) {
    const headerMatch = stmt.match(/CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?`?\[?([A-Za-z_][A-Za-z0-9_]*)\]?`?\s*\(/i);
    if (!headerMatch) return null;
    const tableName = unbacktick(headerMatch[1]);

    const openIdx = stmt.indexOf("(", headerMatch.index);
    if (openIdx === -1) return null;

    // نلاقي القوس القافل المقابل بعدّ الأقواس
    let depth = 0, closeIdx = -1;
    for (let i = openIdx; i < stmt.length; i++) {
      if (stmt[i] === "(") depth++;
      else if (stmt[i] === ")") { depth--; if (depth === 0) { closeIdx = i; break; } }
    }
    if (closeIdx === -1) return null;

    const body = stmt.slice(openIdx + 1, closeIdx);
    const tail = stmt.slice(closeIdx + 1); // اللي بعد القوس القافل (فيه COMMENT='...' غالبًا)

    const tableCommentMatch = tail.match(/COMMENT\s*=?\s*('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*")/i);
    const tableComment = tableCommentMatch ? stripQuotes(tableCommentMatch[1]) : null;

    const parts = splitTopLevel(body, ",").map((p) => p.trim()).filter(Boolean);

    const columns = [];
    const pk = [];
    const fks = [];
    const indexes = [];
    const uniques = [];

    parts.forEach((part) => {
      const p = part.trim();

      let m;
      if ((m = p.match(/^(?:CONSTRAINT\s+`?\w+`?\s+)?PRIMARY\s+KEY\s*\(([^)]+)\)/i))) {
        m[1].split(",").forEach((c) => pk.push(unbacktick(c.trim())));
        return;
      }
      if ((m = p.match(/^(?:CONSTRAINT\s+`?\w+`?\s+)?FOREIGN\s+KEY\s*\(([^)]+)\)\s*REFERENCES\s+`?\[?([A-Za-z_][A-Za-z0-9_]*)\]?`?\s*\(([^)]+)\)(.*)$/i))) {
        const cols = m[1].split(",").map((c) => unbacktick(c.trim()));
        const refTable = unbacktick(m[2]);
        const refCols = m[3].split(",").map((c) => unbacktick(c.trim()));
        const extra = m[4] || "";
        const onDeleteMatch = extra.match(/ON\s+DELETE\s+(CASCADE|RESTRICT|SET\s+NULL|NO\s+ACTION|SET\s+DEFAULT)/i);
        const onUpdateMatch = extra.match(/ON\s+UPDATE\s+(CASCADE|RESTRICT|SET\s+NULL|NO\s+ACTION|SET\s+DEFAULT)/i);
        cols.forEach((c, i) => {
          fks.push({
            column: c,
            ref_table: refTable,
            ref_column: refCols[i] || refCols[0],
            on_delete: onDeleteMatch ? onDeleteMatch[1].toUpperCase().replace(/\s+/g, " ") : "RESTRICT",
            on_update: onUpdateMatch ? onUpdateMatch[1].toUpperCase().replace(/\s+/g, " ") : "RESTRICT"
          });
        });
        return;
      }
      if ((m = p.match(/^UNIQUE\s*(?:KEY|INDEX)?\s*`?\w*`?\s*\(([^)]+)\)/i))) {
        uniques.push(m[1].split(",").map((c) => unbacktick(c.trim())));
        return;
      }
      if ((m = p.match(/^(?:KEY|INDEX)\s*`?\w*`?\s*\(([^)]+)\)/i))) {
        indexes.push({ cols: m[1].split(",").map((c) => unbacktick(c.trim())) });
        return;
      }

      // مش سطر PRIMARY/FOREIGN/UNIQUE/INDEX = عمود عادي
      const parsedCol = parseColumnDef(p);
      if (parsedCol) {
        columns.push(parsedCol.column);
        if (parsedCol.isInlinePk) pk.push(parsedCol.column.name);
      } else {
        console.warn(`[my-sql-data] سطر مش مفهوم في جدول "${tableName}"، اتجاهل: ${p}`);
      }
    });

    return {
      name: tableName,
      columns: columns,
      pk: [...new Set(pk)],
      fks: fks,
      indexes: indexes,
      uniques: uniques,
      description: meta.desc || tableComment || "بيانات مخصّصة أضيفت عبر SQL.",
      module: meta.module || DEFAULT_MODULE,
      icon: meta.icon || DEFAULT_ICON
    };
  }

  function parseSqlToTables(sqlRaw) {
    const sql = stripBlockComments(sqlRaw);
    const results = [];

    // نلف على كل ظهور لـ CREATE TABLE، وناخد الـ preamble بتاعه
    // (اللي بين آخر ; وقبله وبين أول CREATE TABLE) لقراءة التعليقات.
    const createRegex = /CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?`?\[?[A-Za-z_][A-Za-z0-9_]*\]?`?\s*\(/gi;
    let match;
    const starts = [];
    while ((match = createRegex.exec(sql)) !== null) starts.push(match.index);

    if (starts.length === 0) return results;

    starts.forEach((startIdx, i) => {
      // preamble: من أقرب ; قبل الجدول ده (أو بداية النص) لحد بداية الجدول
      const searchFrom = i === 0 ? 0 : starts[i - 1];
      const chunkBefore = sql.slice(searchFrom, startIdx);
      const lastSemi = chunkBefore.lastIndexOf(";");
      const preamble = lastSemi === -1 ? chunkBefore : chunkBefore.slice(lastSemi + 1);
      const meta = extractMeta(preamble);

      // الجسم: من بداية الجدول لحد أول ; بعد القوس القافل، أو أول
      // CREATE TABLE تاني لو معملش ; (تسامح مع أخطاء بسيطة)
      const nextStart = i + 1 < starts.length ? starts[i + 1] : sql.length;
      let stmtSlice = sql.slice(startIdx, nextStart);
      const semiIdx = stmtSlice.search(/;\s*$/m);
      // مش لازم نقص عليه، parseCreateTable بيوقف عند القوس القافل أصلاً

      try {
        const def = parseCreateTable(stmtSlice, meta);
        if (def && def.name) results.push(def);
      } catch (e) {
        console.warn("[my-sql-data] فشل تفسير جدول:", e);
      }
    });

    return results;
  }

  function mergeParsedTables(defs) {
    defs.forEach((def) => {
      if (SCHEMA.tables[def.name]) {
        console.warn(`[my-sql-data] اسم جدول "${def.name}" موجود بالفعل — اتم تجاهله. غيّر اسمه لو عايز تضيفه.`);
        return;
      }
      if (!SCHEMA.modules.includes(def.module)) {
        SCHEMA.modules.push(def.module);
        SCHEMA.moduleColors[def.module] = { h: customModuleHue(def.module) };
        SCHEMA.moduleIcons[def.module] = def.icon || DEFAULT_ICON;
      }
      SCHEMA.tables[def.name] = def;
      SCHEMA.order.push(def.name);
    });
    if (defs.length) {
      console.log(`[my-sql-data] اتضاف ${defs.length} جدول من SQL_INPUT:`, defs.map((d) => d.name));
    }
  }

  try {
    const parsedTables = parseSqlToTables(SQL_INPUT);
    mergeParsedTables(parsedTables);
  } catch (err) {
    console.error("[my-sql-data] حصل خطأ عام أثناء تفسير SQL_INPUT، البيانات الأصلية لسه شغالة عادي:", err);
  }

})();
