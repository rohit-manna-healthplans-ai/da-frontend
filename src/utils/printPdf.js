// src/utils/printPdf.js

function escapeHtml(s) {
  return String(s ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function printLogsAsPdf({ title, range, items }) {
  const rows = (items || [])
    .map(
      (r) => `
      <tr>
        <td>${escapeHtml(r.ts)}</td>
        <td>${escapeHtml(r.company_username)}</td>
        <td>${escapeHtml(r.department)}</td>
        <td>${escapeHtml(r.user_mac_id)}</td>
        <td>${escapeHtml(r.application)}</td>
        <td>${escapeHtml(r.category)}</td>
        <td>${escapeHtml(r.operation)}</td>
        <td>${escapeHtml(r.detail)}</td>
      </tr>`
    )
    .join("");

  const html = `
<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(title)}</title>
  <style>
    :root{
      --bg:#050810;
      --text:#111827;
      --muted:#6b7280;
      --border:#e5e7eb;
      --accent:#4fd1c4;
    }
    body{
      font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
      margin: 24px;
      color: var(--text);
    }
    .header{
      display:flex;
      justify-content:space-between;
      align-items:flex-end;
      margin-bottom: 14px;
      padding-bottom: 10px;
      border-bottom: 2px solid var(--border);
    }
    h1{
      font-size: 18px;
      margin:0;
      font-weight: 900;
    }
    .sub{
      color: var(--muted);
      font-size: 12px;
      margin-top: 4px;
    }
    .badge{
      border:1px solid var(--border);
      padding:6px 10px;
      border-radius:999px;
      font-size:12px;
      font-weight:800;
    }
    table{
      width:100%;
      border-collapse: collapse;
      font-size: 11px;
    }
    thead th{
      text-align:left;
      padding:8px;
      border-bottom: 2px solid var(--border);
      background: #f8fafc;
      font-weight: 900;
    }
    tbody td{
      padding:8px;
      border-bottom: 1px solid var(--border);
      vertical-align: top;
      word-break: break-word;
    }
    .accent{
      height:3px;
      width:100%;
      background: var(--accent);
      margin-top: 10px;
    }
    @page { margin: 12mm; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <h1>${escapeHtml(title)}</h1>
      <div class="sub">Range: ${escapeHtml(range?.from)} → ${escapeHtml(range?.to)} • Rows: ${items?.length || 0}</div>
    </div>
    <div class="badge">Innerwall Export</div>
  </div>
  <div class="accent"></div>

  <table>
    <thead>
      <tr>
        <th>TS</th>
        <th>Email</th>
        <th>Dept</th>
        <th>MAC</th>
        <th>App</th>
        <th>Category</th>
        <th>Op</th>
        <th>Detail</th>
      </tr>
    </thead>
    <tbody>
      ${rows}
    </tbody>
  </table>

  <script>
    window.onload = () => {
      window.focus();
      window.print();
    };
  </script>
</body>
</html>`;

  const w = window.open("", "_blank");
  if (!w) return;
  w.document.open();
  w.document.write(html);
  w.document.close();
}
