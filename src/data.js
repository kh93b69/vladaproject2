// Все данные мокаются здесь. Весь текст — на русском.

// Города (популярные направления). center — координаты для карты Leaflet.
export const CITIES = [
  {
    id: 'tbilisi',
    name: 'Тбилиси',
    country: 'Грузия',
    center: [41.6938, 44.8015],
    image:
      'https://images.unsplash.com/photo-1565008576549-57569a49371d?auto=format&fit=crop&w=800&q=70',
    gradient: 'from-rose-500 to-orange-400',
  },
  {
    id: 'yerevan',
    name: 'Ереван',
    country: 'Армения',
    center: [40.1792, 44.4991],
    image:
      'https://images.unsplash.com/photo-1604762512526-b7068fe9b4f0?auto=format&fit=crop&w=800&q=70',
    gradient: 'from-violet-500 to-fuchsia-500',
  },
  {
    id: 'almaty',
    name: 'Алматы',
    country: 'Казахстан',
    center: [43.222, 76.8512],
    image:
      'https://images.unsplash.com/photo-1601370690183-1c7796ecec61?auto=format&fit=crop&w=800&q=70',
    gradient: 'from-sky-500 to-emerald-400',
  },
]

// Страны для таба «выбор страны»
export const COUNTRIES = [
  { id: 'georgia', name: 'Грузия', emoji: '🇬🇪', cityId: 'tbilisi' },
  { id: 'armenia', name: 'Армения', emoji: '🇦🇲', cityId: 'yerevan' },
  { id: 'kazakhstan', name: 'Казахстан', emoji: '🇰🇿', cityId: 'almaty' },
]

// Интересы. icon — имя иконки из lucide-react (резолвится в компоненте).
export const INTERESTS = [
  { id: 'food', label: 'Гастрономия', icon: 'UtensilsCrossed', color: 'from-amber-400 to-orange-500' },
  { id: 'art', label: 'Искусство', icon: 'Palette', color: 'from-pink-500 to-fuchsia-500' },
  { id: 'history', label: 'История', icon: 'BookOpen', color: 'from-blue-500 to-indigo-500' },
  { id: 'nightlife', label: 'Ночная жизнь', icon: 'Sparkles', color: 'from-violet-500 to-purple-600' },
  { id: 'nature', label: 'Природа', icon: 'Trees', color: 'from-emerald-400 to-green-600' },
  { id: 'culture', label: 'Локальная культура', icon: 'Users', color: 'from-cyan-400 to-teal-500' },
]

// Маршруты по городам. Точки (points) содержат координаты для маркеров на карте.
export const ROUTES = {
  tbilisi: [
    {
      id: 'tb-bars',
      title: 'По барам Тбилиси',
      interests: ['nightlife', 'food'],
      duration: '3 часа',
      difficulty: 'Лёгкий',
      image:
        'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=800&q=70',
      gradient: 'from-violet-600 to-fuchsia-500',
      description:
        'Вечерний забег по самым атмосферным барам старого города. Натуральное вино, локальные настойки и живая музыка до утра — в компании тех, кто знает город изнутри.',
      points: [
        { name: "Секретный бар «Нигде»", note: 'Стартуем с бокала квеври', coords: [41.6915, 44.8075] },
        { name: 'Винный дворик в Сололаки', note: 'Грузинское вино и тосты', coords: [41.6948, 44.7995] },
        { name: 'Видовой ресторан', note: 'Финал с панорамой города', coords: [41.6975, 44.8088] },
      ],
    },
    {
      id: 'tb-culture',
      title: 'Культурный Тбилиси',
      interests: ['art', 'history', 'culture'],
      duration: '4 часа',
      difficulty: 'Средний',
      image:
        'https://images.unsplash.com/photo-1596392301391-76d44c2e3b0b?auto=format&fit=crop&w=800&q=70',
      gradient: 'from-blue-600 to-cyan-500',
      description:
        'Прогулка сквозь века: древние храмы, серные бани Абанотубани и современные галереи. Почувствуй, как старина и арт-сцена живут на одних улицах.',
      points: [
        { name: 'Крепость Нарикала', note: 'Виды на весь город', coords: [41.6877, 44.8092] },
        { name: 'Галерея современного искусства', note: 'Местные художники', coords: [41.6952, 44.8025] },
        { name: 'Бани Абанотубани', note: 'Серные источники', coords: [41.6889, 44.8112] },
      ],
    },
    {
      id: 'tb-food',
      title: 'Вкусы Тбилиси',
      interests: ['food', 'culture'],
      duration: '2,5 часа',
      difficulty: 'Лёгкий',
      image:
        'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=70',
      gradient: 'from-amber-500 to-orange-500',
      description:
        'Хинкали, хачапури по-аджарски и свежий тонис пури прямо из печи. Гастро-маршрут по семейным заведениям, куда водят только своих.',
      points: [
        { name: 'Хинкальная у моста', note: 'Те самые хинкали', coords: [41.6905, 44.8068] },
        { name: 'Пекарня тонис пури', note: 'Хлеб из глиняной печи', coords: [41.6962, 44.8009] },
        { name: 'Рынок Дезертирка', note: 'Сыры, специи, чурчхела', coords: [41.7115, 44.7898] },
      ],
    },
  ],
  yerevan: [
    {
      id: 'er-culture',
      title: 'Культурный Ереван',
      interests: ['art', 'history', 'culture'],
      duration: '3,5 часа',
      difficulty: 'Средний',
      image:
        'https://images.unsplash.com/photo-1604762512526-b7068fe9b4f0?auto=format&fit=crop&w=800&q=70',
      gradient: 'from-blue-600 to-indigo-500',
      description:
        'Каскад, рукописи Матенадарана и розовый туф старого города. Маршрут для тех, кто хочет понять душу армянской столицы.',
      points: [
        { name: 'Каскад', note: 'Лестница и арт-объекты', coords: [40.1893, 44.5152] },
        { name: 'Матенадаран', note: 'Древние рукописи', coords: [40.1916, 44.5219] },
        { name: 'Площадь Республики', note: 'Поющие фонтаны', coords: [40.1772, 44.5152] },
      ],
    },
    {
      id: 'er-food',
      title: 'Гастро-Ереван',
      interests: ['food', 'nightlife'],
      duration: '3 часа',
      difficulty: 'Лёгкий',
      image:
        'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=70',
      gradient: 'from-amber-500 to-rose-500',
      description:
        'Долма, кебаб и армянский коньяк. Вечерний маршрут по местам, где едят и отдыхают сами ереванцы.',
      points: [
        { name: 'Таверна на Сарьяна', note: 'Долма и хоровац', coords: [40.1853, 44.5098] },
        { name: 'Винный бар', note: 'Армянские вина', coords: [40.1828, 44.5132] },
        { name: 'Коньячный завод', note: 'Дегустация', coords: [40.1645, 44.4889] },
      ],
    },
  ],
  almaty: [
    {
      id: 'al-nature',
      title: 'Горы над Алматы',
      interests: ['nature', 'history'],
      duration: '5 часов',
      difficulty: 'Средний',
      image:
        'https://images.unsplash.com/photo-1601370690183-1c7796ecec61?auto=format&fit=crop&w=800&q=70',
      gradient: 'from-emerald-500 to-teal-500',
      description:
        'Медеу, канатка на Шымбулак и горный воздух Заилийского Алатау. Идеально, чтобы сбежать из города к снежным вершинам.',
      points: [
        { name: 'Каток Медеу', note: 'Высокогорный комплекс', coords: [43.1575, 77.0578] },
        { name: 'Шымбулак', note: 'Подъём на канатке', coords: [43.1289, 77.0858] },
        { name: 'Кок-Тобе', note: 'Виды на город', coords: [43.2316, 76.9712] },
      ],
    },
    {
      id: 'al-city',
      title: 'Душа Алматы',
      interests: ['art', 'food', 'culture'],
      duration: '3 часа',
      difficulty: 'Лёгкий',
      image:
        'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=800&q=70',
      gradient: 'from-orange-500 to-pink-500',
      description:
        'Зелёный базар, арт-кварталы и кофейни третьей волны. Городской маршрут по самым живым местам столицы юга.',
      points: [
        { name: 'Зелёный базар', note: 'Местные продукты и специи', coords: [43.2624, 76.9595] },
        { name: 'Арт-квартал', note: 'Стрит-арт и галереи', coords: [43.2551, 76.9426] },
        { name: 'Вознесенский собор', note: 'Деревянная архитектура', coords: [43.2585, 76.9525] },
      ],
    },
  ],
}
