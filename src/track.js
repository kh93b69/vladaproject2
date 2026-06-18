// Отправляет событие шага воронки на сервер. Молча игнорирует ошибки
// (например, в dev-режиме без сервера) — на UX это никак не влияет.
export function track(step) {
  try {
    const body = JSON.stringify({ step })
    // sendBeacon переживает переход/закрытие вкладки; fetch — запасной вариант.
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/track', new Blob([body], { type: 'application/json' }))
    } else {
      fetch('/api/track', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body, keepalive: true }).catch(() => {})
    }
  } catch {
    /* игнорируем */
  }
}
