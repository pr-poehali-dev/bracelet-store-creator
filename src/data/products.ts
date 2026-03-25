export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  stones: string[];
  description: string;
  image: string;
  badge?: string;
  inStock: boolean;
}

export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Браслет «Аметистовый туман»",
    price: 2800,
    category: "bracelet",
    stones: ["Аметист", "Горный хрусталь"],
    description: "Нежный браслет из натурального аметиста для гармонии и спокойствия",
    image: "https://cdn.poehali.dev/projects/c1d32ac7-1d0a-4ede-9952-f86391eda1c4/files/5531d923-45f0-4e8d-865e-0ffe21bf097f.jpg",
    badge: "Хит",
    inStock: true,
  },
  {
    id: 2,
    name: "Браслет «Тигровый глаз»",
    price: 3200,
    category: "bracelet",
    stones: ["Тигровый глаз", "Гематит"],
    description: "Сильный браслет-оберег из тигрового глаза для уверенности",
    image: "https://cdn.poehali.dev/projects/c1d32ac7-1d0a-4ede-9952-f86391eda1c4/files/2e63867b-30e0-48ae-83b0-bd07c4373652.jpg",
    inStock: true,
  },
  {
    id: 3,
    name: "Браслет «Розовый кварц»",
    price: 2400,
    category: "bracelet",
    stones: ["Розовый кварц", "Жемчуг"],
    description: "Нежный браслет из розового кварца — символ любви и нежности",
    image: "https://cdn.poehali.dev/projects/c1d32ac7-1d0a-4ede-9952-f86391eda1c4/files/d6e8dc2c-c80c-4cd1-a2b2-cc5547019fa0.jpg",
    badge: "Новинка",
    inStock: true,
  },
  {
    id: 4,
    name: "Браслет «Лазурит»",
    price: 4100,
    category: "bracelet",
    stones: ["Лазурит", "Серебро"],
    description: "Роскошный браслет с натуральным лазуритом для мудрости",
    image: "https://cdn.poehali.dev/projects/c1d32ac7-1d0a-4ede-9952-f86391eda1c4/files/5531d923-45f0-4e8d-865e-0ffe21bf097f.jpg",
    inStock: true,
  },
  {
    id: 5,
    name: "Ожерелье «Малахит»",
    price: 5600,
    category: "necklace",
    stones: ["Малахит", "Медь"],
    description: "Изящное ожерелье из натурального малахита в медной оправе",
    image: "https://cdn.poehali.dev/projects/c1d32ac7-1d0a-4ede-9952-f86391eda1c4/files/2e63867b-30e0-48ae-83b0-bd07c4373652.jpg",
    badge: "Хит",
    inStock: true,
  },
  {
    id: 6,
    name: "Серьги «Лабрадорит»",
    price: 3800,
    category: "earrings",
    stones: ["Лабрадорит"],
    description: "Мистические серьги с переливающимся лабрадоритом",
    image: "https://cdn.poehali.dev/projects/c1d32ac7-1d0a-4ede-9952-f86391eda1c4/files/d6e8dc2c-c80c-4cd1-a2b2-cc5547019fa0.jpg",
    inStock: true,
  },
  {
    id: 7,
    name: "Браслет «Бирюза»",
    price: 3500,
    category: "bracelet",
    stones: ["Бирюза", "Коралл"],
    description: "Яркий браслет с натуральной бирюзой в этническом стиле",
    image: "https://cdn.poehali.dev/projects/c1d32ac7-1d0a-4ede-9952-f86391eda1c4/files/5531d923-45f0-4e8d-865e-0ffe21bf097f.jpg",
    inStock: false,
  },
  {
    id: 8,
    name: "Кольцо «Опал»",
    price: 4900,
    category: "ring",
    stones: ["Опал"],
    description: "Нежное кольцо с радужным опалом ручной работы",
    image: "https://cdn.poehali.dev/projects/c1d32ac7-1d0a-4ede-9952-f86391eda1c4/files/2e63867b-30e0-48ae-83b0-bd07c4373652.jpg",
    badge: "Новинка",
    inStock: true,
  },
];

export const CATEGORIES = [
  { id: "all", label: "Все украшения" },
  { id: "bracelet", label: "Браслеты" },
  { id: "necklace", label: "Ожерелья" },
  { id: "earrings", label: "Серьги" },
  { id: "ring", label: "Кольца" },
];

export const STONES_CATALOG = [
  { id: "amethyst", name: "Аметист", color: "#9b59b6", meaning: "Гармония, спокойствие, интуиция" },
  { id: "rose_quartz", name: "Розовый кварц", color: "#f4a7b9", meaning: "Любовь, нежность, сострадание" },
  { id: "tiger_eye", name: "Тигровый глаз", color: "#b8860b", meaning: "Уверенность, защита, воля" },
  { id: "lapis", name: "Лазурит", color: "#1a5276", meaning: "Мудрость, правда, ясность" },
  { id: "turquoise", name: "Бирюза", color: "#48c9b0", meaning: "Успех, удача, коммуникация" },
  { id: "malachite", name: "Малахит", color: "#27ae60", meaning: "Трансформация, рост, защита" },
  { id: "obsidian", name: "Обсидиан", color: "#2c2c2c", meaning: "Защита, очищение, сила" },
  { id: "citrine", name: "Цитрин", color: "#f39c12", meaning: "Радость, процветание, творчество" },
  { id: "labradorite", name: "Лабрадорит", color: "#5d6d7e", meaning: "Магия, интуиция, трансформация" },
  { id: "carnelian", name: "Сердолик", color: "#e74c3c", meaning: "Энергия, мотивация, смелость" },
  { id: "jade", name: "Нефрит", color: "#45b39d", meaning: "Удача, мир, долголетие" },
  { id: "hematite", name: "Гематит", color: "#616161", meaning: "Заземление, баланс, стабильность" },
  { id: "moonstone", name: "Лунный камень", color: "#d5d8dc", meaning: "Интуиция, женственность, цикличность" },
  { id: "amber", name: "Янтарь", color: "#d4ac0d", meaning: "Тепло, очищение, радость" },
  { id: "coral", name: "Коралл", color: "#e8825a", meaning: "Жизненная сила, защита, радость" },
  { id: "pearl", name: "Жемчуг", color: "#f0ead6", meaning: "Чистота, мудрость, женственность" },
];
