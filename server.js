// Мини-сервер: отдаёт собранный сайт (dist) + считает воронку по шагам.
// Дашборд /stats защищён паролем (Basic Auth). Данные пишутся в JSON-файл.
import express from 'express'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PORT = process.env.PORT || 4173
const PASSWORD = process.env.STATS_PASSWORD || 'meetmates'

// ——— Шаги воронки (порядок важен — так рисуется воронка) ———
const STEPS = [
  { key: 'splash', label: 'Сплэш (зашли)' },
  { key: 'city', label: 'Выбрали город' },
  { key: 'interests', label: 'Экран интересов' },
  { key: 'routes', label: 'Список маршрутов' },
  { key: 'detail', label: 'Открыли карту' },
  { key: 'saved', label: 'Сохранили маршрут' },
]
const STEP_KEYS = new Set(STEPS.map((s) => s.key))

// ——— Где хранить данные ———
// Если подключён Railway Volume на /data — пишем туда (переживёт перезапуски).
// Иначе — рядом с сервером (сбрасывается при редеплое, но работает).
function pickDataDir() {
  const candidates = [process.env.DATA_DIR, '/data', __dirname].filter(Boolean)
  for (const dir of candidates) {
    try {
      fs.accessSync(dir, fs.constants.W_OK)
      return dir
    } catch {
      /* пробуем следующий */
    }
  }
  return __dirname
}
const DATA_FILE = path.join(pickDataDir(), 'stats.json')

function emptyStats() {
  const steps = {}
  STEPS.forEach((s) => (steps[s.key] = 0))
  return { steps, startedAt: new Date().toISOString(), updatedAt: null }
}

let stats = emptyStats()
try {
  if (fs.existsSync(DATA_FILE)) {
    const loaded = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'))
    stats = { ...emptyStats(), ...loaded, steps: { ...emptyStats().steps, ...(loaded.steps || {}) } }
  }
} catch (e) {
  console.error('Не удалось прочитать stats.json:', e.message)
}
console.log('Файл статистики:', DATA_FILE)

let saveTimer = null
function saveSoon() {
  if (saveTimer) return
  saveTimer = setTimeout(() => {
    saveTimer = null
    fs.writeFile(DATA_FILE, JSON.stringify(stats, null, 2), (e) => {
      if (e) console.error('Ошибка записи stats.json:', e.message)
    })
  }, 400)
}

const app = express()
app.use(express.json())
app.disable('x-powered-by')

// ——— Приём событий из приложения ———
app.post('/api/track', (req, res) => {
  const step = req.body && req.body.step
  if (STEP_KEYS.has(step)) {
    stats.steps[step] = (stats.steps[step] || 0) + 1
    stats.updatedAt = new Date().toISOString()
    saveSoon()
  }
  res.status(204).end()
})

// ——— Basic Auth для дашборда и API статистики ———
function auth(req, res, next) {
  const header = req.headers.authorization || ''
  const [type, creds] = header.split(' ')
  if (type === 'Basic' && creds) {
    const pass = Buffer.from(creds, 'base64').toString().split(':').slice(1).join(':')
    if (pass === PASSWORD) return next()
  }
  res.set('WWW-Authenticate', 'Basic realm="MeetMates Stats"')
  return res.status(401).send('Требуется пароль')
}

app.get('/api/stats', auth, (req, res) => {
  res.json({ steps: STEPS.map((s) => ({ ...s, count: stats.steps[s.key] || 0 })), updatedAt: stats.updatedAt, startedAt: stats.startedAt })
})

// Сброс счётчиков (на всякий случай): /api/reset?confirm=yes
app.post('/api/reset', auth, (req, res) => {
  stats = emptyStats()
  saveSoon()
  res.json({ ok: true })
})

// ——— Страница-дашборд ———
app.get('/stats', auth, (req, res) => {
  res.set('Content-Type', 'text/html; charset=utf-8')
  res.send(DASHBOARD_HTML)
})

// ——— Статика собранного сайта ———
const distDir = path.join(__dirname, 'dist')
app.use(express.static(distDir))
// SPA-фолбэк: любой остальной GET → index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(distDir, 'index.html'))
})

app.listen(PORT, '0.0.0.0', () => console.log(`MeetMates на :${PORT}  ·  дашборд: /stats`))

// ——— HTML дашборда (отдельная переменная для читаемости) ———
const DASHBOARD_HTML = `<!doctype html>
<html lang="ru"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>MeetMates — воронка</title>
<style>
  *{box-sizing:border-box;font-family:-apple-system,Segoe UI,Roboto,sans-serif}
  body{margin:0;background:#0f172a;color:#e2e8f0;padding:24px}
  .wrap{max-width:680px;margin:0 auto}
  h1{font-size:26px;font-weight:800;margin:0 0 4px}
  .sub{color:#94a3b8;font-size:14px;margin-bottom:24px}
  .row{margin:14px 0}
  .top{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:6px}
  .label{font-weight:600}
  .nums{font-variant-numeric:tabular-nums}
  .count{font-weight:800;font-size:18px}
  .pct{color:#94a3b8;font-size:13px;margin-left:8px}
  .bar{height:34px;border-radius:10px;background:#1e293b;overflow:hidden}
  .fill{height:100%;border-radius:10px;background:linear-gradient(90deg,#e11d48,#f97316);transition:width .5s;min-width:2px}
  .drop{font-size:12px;color:#fb7185;margin-top:4px}
  .foot{margin-top:24px;color:#64748b;font-size:12px;display:flex;justify-content:space-between;align-items:center}
  button{background:#1e293b;color:#94a3b8;border:1px solid #334155;border-radius:8px;padding:6px 12px;cursor:pointer;font-size:12px}
  button:hover{color:#e2e8f0}
</style></head>
<body><div class="wrap">
  <h1>🧭 MeetMates — воронка</h1>
  <div class="sub" id="sub">загрузка…</div>
  <div id="funnel"></div>
  <div class="foot">
    <span id="upd"></span>
    <button onclick="resetStats()">Сбросить счётчики</button>
  </div>
</div>
<script>
async function load(){
  const r = await fetch('/api/stats',{cache:'no-store'});
  if(!r.ok){document.getElementById('sub').textContent='Ошибка доступа';return;}
  const d = await r.json();
  const first = d.steps[0]?.count || 0;
  document.getElementById('sub').textContent = 'Всего зашло: ' + first + ' чел.';
  const box = document.getElementById('funnel'); box.innerHTML='';
  d.steps.forEach((s,i)=>{
    const pct = first ? Math.round(s.count/first*100) : 0;
    const prev = i>0 ? d.steps[i-1].count : s.count;
    const drop = (i>0 && prev>0) ? Math.round((1 - s.count/prev)*100) : 0;
    box.insertAdjacentHTML('beforeend',
      '<div class="row"><div class="top"><span class="label">'+(i+1)+'. '+s.label+'</span>'+
      '<span class="nums"><span class="count">'+s.count+'</span><span class="pct">'+pct+'%</span></span></div>'+
      '<div class="bar"><div class="fill" style="width:'+pct+'%"></div></div>'+
      (i>0 && drop>0 ? '<div class="drop">↓ отвалилось '+drop+'% с прошлого шага</div>' : '')+
      '</div>');
  });
  document.getElementById('upd').textContent = d.updatedAt ? ('Обновлено: '+new Date(d.updatedAt).toLocaleString('ru-RU')) : 'Пока нет данных';
}
async function resetStats(){
  if(!confirm('Точно обнулить всю статистику?'))return;
  await fetch('/api/reset',{method:'POST'}); load();
}
load(); setInterval(load, 8000);
</script>
</body></html>`
