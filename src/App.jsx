import { useState, useMemo, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Search,
  MapPin,
  ArrowRight,
  ArrowLeft,
  Check,
  Bookmark,
  UserSearch,
  Clock,
  Gauge,
  Compass,
  UtensilsCrossed,
  Palette,
  BookOpen,
  Sparkles,
  Trees,
  Users,
} from 'lucide-react'
import { CITIES, COUNTRIES, INTERESTS, ROUTES } from './data'
import RouteMap from './components/RouteMap'
import BackgroundMap from './components/BackgroundMap'

// Резолвер иконок lucide по имени из data.js
const ICONS = { UtensilsCrossed, Palette, BookOpen, Sparkles, Trees, Users }

// ——— Анимации переходов между экранами ———
const variants = {
  enter: { opacity: 0, x: 40 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -40 },
}
const transition = { type: 'spring', stiffness: 320, damping: 32 }

// Картинка с градиентным фолбэком (если фото не загрузилось — красивый градиент).
function Photo({ src, gradient, className, children }) {
  const [ok, setOk] = useState(true)
  return (
    <div className={`relative overflow-hidden bg-gradient-to-br ${gradient} ${className}`}>
      {ok && (
        <img
          src={src}
          alt=""
          loading="lazy"
          onError={() => setOk(false)}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      {children}
    </div>
  )
}

// Обёртка экрана с анимацией
function Screen({ children, className = '' }) {
  return (
    <motion.div
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={transition}
      className={`absolute inset-0 flex flex-col ${className}`}
    >
      {children}
    </motion.div>
  )
}

// ======================= ЭКРАН 0: СПЛЭШ =======================
function SplashScreen({ onStart }) {
  return (
    <Screen>
      {/* Карта на фоне (см. референс) */}
      <div className="absolute inset-0">
        <BackgroundMap center={[41.6938, 44.8015]} />
        <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/40 to-white/95" />
      </div>

      <div className="relative z-10 flex h-full flex-col justify-between p-7 pb-10">
        <div className="flex items-center gap-2 pt-2 text-rose-600">
          <Compass className="h-6 w-6" />
          <span className="font-display text-sm font-extrabold uppercase tracking-widest">
            MeetMates
          </span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6 }}
        >
          <h1 className="font-display text-4xl font-black uppercase leading-[1.05] tracking-tight text-slate-900">
            Путешествуй
            <br />
            вместе с
          </h1>
          <h1 className="mt-2 font-display text-6xl font-black uppercase leading-none tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-orange-500">
            MeetMates
          </h1>
          <p className="mt-5 max-w-xs text-base font-medium text-slate-600">
            Находи локальных людей, маршруты и гидов в новом городе. Без туристических ловушек —
            только настоящие места.
          </p>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileTap={{ scale: 0.97 }}
          onClick={onStart}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-rose-600 to-orange-500 py-4 font-display text-lg font-extrabold uppercase tracking-wide text-white shadow-lg shadow-rose-500/30"
        >
          Погнали
          <ArrowRight className="h-5 w-5" />
        </motion.button>
      </div>
    </Screen>
  )
}

// ======================= ЭКРАН 1: ВЫБОР ГОРОДА =======================
function CityScreen({ onSelect }) {
  const [tab, setTab] = useState('city') // 'country' | 'city'
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return CITIES
    return CITIES.filter(
      (c) => c.name.toLowerCase().includes(q) || c.country.toLowerCase().includes(q),
    )
  }, [query])

  return (
    <Screen className="bg-slate-50">
      <div className="flex-1 overflow-y-auto px-6 pb-8 pt-10">
        <p className="font-display text-sm font-bold uppercase tracking-widest text-rose-500">
          Шаг 1
        </p>
        <h1 className="mt-1 font-display text-4xl font-black uppercase leading-none tracking-tight text-slate-900">
          Куда едем?
        </h1>
        <p className="mt-3 text-base text-slate-500">Где начнётся наше путешествие?</p>

        {/* Табы страна / город */}
        <div className="mt-5 flex rounded-2xl bg-slate-200/70 p-1">
          {[
            { id: 'city', label: 'Выбор города' },
            { id: 'country', label: 'Выбор страны' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="relative flex-1 rounded-xl py-2.5 text-sm font-bold transition-colors"
            >
              {tab === t.id && (
                <motion.div
                  layoutId="tabBg"
                  className="absolute inset-0 rounded-xl bg-white shadow"
                  transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                />
              )}
              <span className={`relative ${tab === t.id ? 'text-slate-900' : 'text-slate-500'}`}>
                {t.label}
              </span>
            </button>
          ))}
        </div>

        {tab === 'city' ? (
          <>
            {/* Поиск */}
            <div className="mt-5 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3.5 shadow-sm focus-within:border-rose-400">
              <Search className="h-5 w-5 shrink-0 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Введите город (напр. Тбилиси)..."
                className="w-full bg-transparent text-base text-slate-900 placeholder:text-slate-400 focus:outline-none"
              />
            </div>

            <h2 className="mt-7 font-display text-lg font-extrabold uppercase tracking-wide text-slate-800">
              Популярные направления
            </h2>

            <div className="mt-4 space-y-4">
              {filtered.map((city, i) => (
                <motion.button
                  key={city.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onSelect(city)}
                  className="block w-full overflow-hidden rounded-3xl text-left shadow-md shadow-slate-200"
                >
                  <Photo src={city.image} gradient={city.gradient} className="h-40">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4">
                      <div>
                        <div className="flex items-center gap-1.5 text-white/80">
                          <MapPin className="h-3.5 w-3.5" />
                          <span className="text-xs font-semibold">{city.country}</span>
                        </div>
                        <h3 className="font-display text-2xl font-extrabold text-white">
                          {city.name}
                        </h3>
                      </div>
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-slate-900">
                        <ArrowRight className="h-5 w-5" />
                      </div>
                    </div>
                  </Photo>
                </motion.button>
              ))}
              {filtered.length === 0 && (
                <p className="py-8 text-center text-slate-400">
                  Ничего не нашлось. Попробуйте другой город.
                </p>
              )}
            </div>
          </>
        ) : (
          <div className="mt-6 space-y-3">
            {COUNTRIES.map((country, i) => {
              const city = CITIES.find((c) => c.id === country.cityId)
              return (
                <motion.button
                  key={country.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onSelect(city)}
                  className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-4 text-left shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{country.emoji}</span>
                    <div>
                      <div className="font-display text-lg font-extrabold text-slate-900">
                        {country.name}
                      </div>
                      <div className="text-sm text-slate-500">{city.name}</div>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-slate-400" />
                </motion.button>
              )
            })}
          </div>
        )}
      </div>
    </Screen>
  )
}

// ======================= ЭКРАН 2: ВЫБОР ИНТЕРЕСОВ =======================
function InterestsScreen({ city, selected, setSelected, onNext, onBack }) {
  const toggle = (id) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))

  const canContinue = selected.length >= 1

  return (
    <Screen className="bg-slate-50">
      <TopBar onBack={onBack} title="Интересы" />
      <div className="flex-1 overflow-y-auto px-6 pb-32 pt-2">
        <p className="font-display text-sm font-bold uppercase tracking-widest text-rose-500">
          Шаг 2 · {city?.name}
        </p>
        <h1 className="mt-1 font-display text-4xl font-black uppercase leading-none tracking-tight text-slate-900">
          Что вас
          <br />
          интересует?
        </h1>
        <p className="mt-3 text-base text-slate-500">Выберите хотя бы один вариант.</p>

        <div className="mt-6 grid grid-cols-2 gap-4">
          {INTERESTS.map((it, i) => {
            const Icon = ICONS[it.icon]
            const active = selected.includes(it.id)
            return (
              <motion.button
                key={it.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggle(it.id)}
                className={`relative flex aspect-square flex-col justify-between overflow-hidden rounded-3xl bg-gradient-to-br p-4 text-left text-white shadow-lg transition-all ${it.color} ${
                  active ? 'ring-4 ring-slate-900 ring-offset-2' : 'opacity-90'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Icon className="h-8 w-8" strokeWidth={2.2} />
                  {active && (
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-slate-900">
                      <Check className="h-4 w-4" strokeWidth={3} />
                    </span>
                  )}
                </div>
                <span className="font-display text-lg font-extrabold leading-tight">
                  {it.label}
                </span>
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Нижняя кнопка */}
      <div className="absolute inset-x-0 bottom-0 border-t border-slate-100 bg-slate-50/90 p-5 backdrop-blur">
        <button
          disabled={!canContinue}
          onClick={onNext}
          className={`flex w-full items-center justify-center gap-2 rounded-2xl py-4 font-display text-lg font-extrabold uppercase tracking-wide transition-all ${
            canContinue
              ? 'bg-gradient-to-r from-rose-600 to-orange-500 text-white shadow-lg shadow-rose-500/30'
              : 'bg-slate-200 text-slate-400'
          }`}
        >
          Найти маршруты
          {canContinue && <ArrowRight className="h-5 w-5" />}
        </button>
      </div>
    </Screen>
  )
}

// ======================= ЭКРАН 3a: ЗАГРУЗКА =======================
function LoadingScreen() {
  return (
    <Screen className="items-center justify-center bg-slate-50 px-8 text-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.1, ease: 'linear' }}
        className="mb-8 h-16 w-16 rounded-full border-4 border-slate-200 border-t-rose-500"
      />
      <p className="font-display text-sm font-bold uppercase tracking-widest text-rose-500">
        Экран загрузки
      </p>
      <h1 className="mt-2 font-display text-4xl font-black uppercase leading-none tracking-tight text-slate-900">
        Подбор
        <br />
        маршрутов
      </h1>
      <motion.p
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ repeat: Infinity, duration: 1.6 }}
        className="mt-5 text-base font-medium text-slate-500"
      >
        Подбираем лучшие локальные вайбы...
      </motion.p>
    </Screen>
  )
}

// ======================= ЭКРАН 3b: СПИСОК МАРШРУТОВ =======================
function RoutesScreen({ city, selected, onSelect, onBack }) {
  const routes = ROUTES[city?.id] || []
  const interestLabel = (id) => INTERESTS.find((x) => x.id === id)?.label

  // Сортируем так, чтобы маршруты с совпадающими интересами были выше.
  const sorted = useMemo(() => {
    return [...routes].sort((a, b) => {
      const score = (r) => r.interests.filter((x) => selected.includes(x)).length
      return score(b) - score(a)
    })
  }, [routes, selected])

  return (
    <Screen className="bg-slate-50">
      <TopBar onBack={onBack} title="Маршруты" />
      <div className="flex-1 overflow-y-auto px-6 pb-8 pt-2">
        <p className="font-display text-sm font-bold uppercase tracking-widest text-rose-500">
          {city?.name}
        </p>
        <h1 className="mt-1 font-display text-4xl font-black uppercase leading-none tracking-tight text-slate-900">
          Рекомендованные маршруты
        </h1>

        <div className="mt-5 space-y-5">
          {sorted.map((route, i) => (
            <motion.button
              key={route.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(route)}
              className="block w-full overflow-hidden rounded-3xl bg-white text-left shadow-md shadow-slate-200"
            >
              <Photo src={route.image} gradient={route.gradient} className="h-44">
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent" />
                <h3 className="absolute bottom-3 left-4 right-4 font-display text-2xl font-extrabold text-white">
                  {route.title}
                </h3>
              </Photo>
              <div className="p-4">
                <div className="flex flex-wrap gap-2">
                  {route.interests.map((id) => (
                    <span
                      key={id}
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        selected.includes(id)
                          ? 'bg-rose-100 text-rose-600'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {interestLabel(id)}
                    </span>
                  ))}
                </div>
                <div className="mt-3 flex items-center gap-4 text-sm font-semibold text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" /> {route.duration}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Gauge className="h-4 w-4" /> {route.difficulty}
                  </span>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </Screen>
  )
}

// ======================= ЭКРАН 4: ДЕТАЛИ + КАРТА =======================
function DetailScreen({ city, route, onSave, onBack }) {
  return (
    <Screen className="bg-white">
      <TopBar onBack={onBack} title="Детали маршрута" />
      <div className="flex-1 overflow-y-auto pb-28">
        {/* Карта ~40% высоты экрана */}
        <div className="h-[40vh] w-full">
          <RouteMap center={city.center} points={route.points} />
        </div>

        <div className="px-6 pt-5">
          <div className="flex flex-wrap gap-2">
            {route.interests.map((id) => (
              <span
                key={id}
                className="rounded-full bg-rose-100 px-3 py-1 text-xs font-bold text-rose-600"
              >
                {INTERESTS.find((x) => x.id === id)?.label}
              </span>
            ))}
          </div>

          <h1 className="mt-3 font-display text-3xl font-black uppercase leading-none tracking-tight text-slate-900">
            {route.title}
          </h1>

          <div className="mt-3 flex items-center gap-4 text-sm font-semibold text-slate-500">
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" /> {route.duration}
            </span>
            <span className="flex items-center gap-1.5">
              <Gauge className="h-4 w-4" /> {route.difficulty}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" /> {city.name}
            </span>
          </div>

          <p className="mt-4 text-base leading-relaxed text-slate-600">{route.description}</p>

          {/* Таймлайн точек */}
          <h2 className="mt-7 font-display text-xl font-extrabold uppercase tracking-wide text-slate-900">
            Точки маршрута
          </h2>
          <div className="mt-4">
            {route.points.map((p, i) => (
              <div key={i} className="relative flex gap-4 pb-6 last:pb-0">
                {/* линия */}
                {i < route.points.length - 1 && (
                  <span className="absolute left-[18px] top-9 h-full w-0.5 bg-rose-200" />
                )}
                <div className="z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-rose-600 to-orange-500 font-display text-sm font-extrabold text-white shadow">
                  {i + 1}
                </div>
                <div className="pt-1">
                  <div className="font-display text-base font-extrabold text-slate-900">
                    {p.name}
                  </div>
                  {p.note && <div className="text-sm text-slate-500">{p.note}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Кнопка сохранить */}
      <div className="absolute inset-x-0 bottom-0 border-t border-slate-100 bg-white/90 p-5 backdrop-blur">
        <button
          onClick={onSave}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-rose-600 to-orange-500 py-4 font-display text-lg font-extrabold uppercase tracking-wide text-white shadow-lg shadow-rose-500/30"
        >
          <Bookmark className="h-5 w-5" />
          Сохранить маршрут
        </button>
      </div>
    </Screen>
  )
}

// ======================= ЭКРАН 5: УСПЕХ =======================
function SuccessScreen({ onRestart, onGuide }) {
  return (
    <Screen className="items-center justify-center bg-slate-50 px-8 text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.15, 1] }}
        transition={{ duration: 0.5, times: [0, 0.6, 1] }}
        className="relative mb-8"
      >
        <motion.div
          animate={{ scale: [1, 1.25, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.8 }}
          className="absolute inset-0 rounded-full bg-emerald-400"
        />
        <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-green-600 shadow-xl shadow-emerald-500/40">
          <Check className="h-14 w-14 text-white" strokeWidth={3} />
        </div>
      </motion.div>

      <h1 className="font-display text-3xl font-black uppercase leading-tight tracking-tight text-slate-900">
        Ура! Маршрут
        <br />
        сохранён!
      </h1>
      <p className="mt-3 max-w-xs text-base text-slate-500">
        Вы всегда можете найти его в разделе «Профиль».
      </p>

      <div className="mt-9 w-full max-w-sm space-y-3">
        <button
          onClick={onRestart}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-rose-600 to-orange-500 py-4 font-display text-base font-extrabold uppercase tracking-wide text-white shadow-lg shadow-rose-500/30"
        >
          <Bookmark className="h-5 w-5" />
          Показать сохранённые
        </button>
        <button
          onClick={onGuide}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-slate-200 bg-white py-4 font-display text-base font-extrabold uppercase tracking-wide text-slate-800"
        >
          <UserSearch className="h-5 w-5" />
          Найти локального гида
        </button>
      </div>
    </Screen>
  )
}

// ——— Верхняя панель с кнопкой «назад» ———
function TopBar({ onBack, title }) {
  return (
    <div className="flex items-center gap-3 px-4 py-4">
      <button
        onClick={onBack}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-700 shadow-sm active:scale-95"
      >
        <ArrowLeft className="h-5 w-5" />
      </button>
      <span className="font-display text-base font-extrabold uppercase tracking-wide text-slate-900">
        {title}
      </span>
    </div>
  )
}

// ======================= КОРНЕВОЙ КОМПОНЕНТ =======================
export default function App() {
  const [screen, setScreen] = useState('splash')
  const [city, setCity] = useState(null)
  const [interests, setInterests] = useState([])
  const [route, setRoute] = useState(null)

  // Имитация подбора маршрутов: 2 секунды загрузки.
  useEffect(() => {
    if (screen !== 'loading') return
    const t = setTimeout(() => setScreen('routes'), 2000)
    return () => clearTimeout(t)
  }, [screen])

  const restart = () => {
    setCity(null)
    setInterests([])
    setRoute(null)
    setScreen('city')
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-slate-900 p-0 sm:p-6">
      {/* Каркас мобильного экрана */}
      <div className="relative h-screen w-full max-w-md overflow-hidden bg-slate-50 shadow-2xl sm:h-[860px] sm:rounded-[2.5rem] sm:ring-8 sm:ring-slate-800">
        <AnimatePresence mode="wait" initial={false}>
          {screen === 'splash' && (
            <SplashScreen key="splash" onStart={() => setScreen('city')} />
          )}

          {screen === 'city' && (
            <CityScreen
              key="city"
              onSelect={(c) => {
                setCity(c)
                setScreen('interests')
              }}
            />
          )}

          {screen === 'interests' && (
            <InterestsScreen
              key="interests"
              city={city}
              selected={interests}
              setSelected={setInterests}
              onBack={() => setScreen('city')}
              onNext={() => setScreen('loading')}
            />
          )}

          {screen === 'loading' && <LoadingScreen key="loading" />}

          {screen === 'routes' && (
            <RoutesScreen
              key="routes"
              city={city}
              selected={interests}
              onBack={() => setScreen('interests')}
              onSelect={(r) => {
                setRoute(r)
                setScreen('detail')
              }}
            />
          )}

          {screen === 'detail' && route && city && (
            <DetailScreen
              key="detail"
              city={city}
              route={route}
              onBack={() => setScreen('routes')}
              onSave={() => setScreen('success')}
            />
          )}

          {screen === 'success' && (
            <SuccessScreen
              key="success"
              onRestart={restart}
              onGuide={() =>
                alert('Скоро здесь появятся проверенные локальные гиды MeetMates! 🧭')
              }
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
