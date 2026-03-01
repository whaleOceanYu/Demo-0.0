// src/data.js - 餐廳與菜品數據（基於Excel真實餐廳）
export const restaurants = [
  {
    id: 1,
    name: '港灣茶餐廳',
    cuisine: '港式',
    priceRange: '$',
    matchScore: 78,
    image: 'https://picsum.photos/200/150?random=1',
    dishes: [
      { id: 101, name: '乾炒牛河', price: 48, protein: 18, fat: 12, carbs: 55 },
      { id: 102, name: '揚州炒飯', price: 45, protein: 15, fat: 10, carbs: 60 },
      { id: 103, name: '福建炒飯', price: 48, protein: 16, fat: 11, carbs: 58 },
      { id: 104, name: '星洲炒米', price: 46, protein: 14, fat: 9, carbs: 52 },
      { id: 105, name: '香煎雞扒飯', price: 52, protein: 28, fat: 15, carbs: 45 },
      { id: 106, name: '叉燒油鷄飯', price: 50, protein: 25, fat: 14, carbs: 48 },
      { id: 107, name: '叉燒燒肉飯', price: 52, protein: 26, fat: 16, carbs: 47 },
      { id: 108, name: '焗鮮茄豬扒飯', price: 55, protein: 22, fat: 13, carbs: 50 },
      { id: 109, name: '豉油皇炒麵', price: 44, protein: 12, fat: 8, carbs: 54 },
      { id: 110, name: '茄子素肉炆伊麵', price: 48, protein: 10, fat: 7, carbs: 42 },
      { id: 111, name: '魚片魚蛋河', price: 42, protein: 16, fat: 6, carbs: 35 },
      { id: 112, name: '餐肉公仔麵', price: 36, protein: 12, fat: 10, carbs: 40 },
      { id: 113, name: '香茅豬扒炒公仔麵', price: 48, protein: 24, fat: 14, carbs: 48 },
      { id: 114, name: '鮮蝦餛飩麵', price: 46, protein: 18, fat: 8, carbs: 38 },
      { id: 115, name: '韭黃鷄絲炒麵', price: 50, protein: 22, fat: 11, carbs: 50 },
      { id: 116, name: '番茄炒蛋飯', price: 42, protein: 12, fat: 9, carbs: 42 },
      { id: 117, name: '時菜珍菌湯米粉', price: 40, protein: 8, fat: 4, carbs: 30 }
    ]
  },
  {
    id: 2,
    name: '中庭',
    cuisine: '中式',
    priceRange: '$$$',
    matchScore: 82,
    image: 'https://picsum.photos/200/150?random=2',
    dishes: [
      { id: 201, name: '片皮鴨', price: 188, protein: 35, fat: 25, carbs: 10 },
      { id: 202, name: '炸子雞', price: 168, protein: 40, fat: 22, carbs: 5 },
      { id: 203, name: '酸菜魚', price: 158, protein: 32, fat: 18, carbs: 15 }
    ]
  },
  {
    id: 3,
    name: '意日閣',
    cuisine: '日本菜/意大利菜',
    priceRange: '$$',
    matchScore: 71,
    image: 'https://picsum.photos/200/150?random=3',
    dishes: [
      { id: 301, name: '蕃茄芝士忌廉及菠菜貓耳朵意大利麵', price: 98, protein: 14, fat: 16, carbs: 52 },
      { id: 302, name: '瑪格麗特披薩', price: 88, protein: 16, fat: 12, carbs: 48 }
    ]
  },
  {
    id: 4,
    name: '港灣道 Café',
    cuisine: '咖啡店',
    priceRange: '$',
    matchScore: 65,
    image: 'https://picsum.photos/200/150?random=4',
    dishes: [
      { id: 401, name: '蕃茄火腿佛卡夏', price: 42, protein: 12, fat: 8, carbs: 35 },
      { id: 402, name: '巴斯克芝士蛋糕', price: 38, protein: 6, fat: 15, carbs: 30 },
      { id: 403, name: '招牌鴛鴦葡式蛋撻', price: 18, protein: 3, fat: 8, carbs: 22 },
      { id: 404, name: '芝士吞拿魚Bagel', price: 45, protein: 18, fat: 10, carbs: 40 },
      { id: 405, name: '泰式烤鷄意大利包', price: 48, protein: 22, fat: 9, carbs: 38 },
      { id: 406, name: '藍莓鬆餅', price: 22, protein: 4, fat: 7, carbs: 28 }
    ]
  },
  {
    id: 5,
    name: 'Giá Trattoria Italiana',
    cuisine: '意大利菜',
    priceRange: '$$$',
    matchScore: 88,
    image: 'https://picsum.photos/200/150?random=5',
    dishes: [
      { id: 501, name: '波隆那肉醬寬麵', price: 128, protein: 24, fat: 18, carbs: 50 },
      { id: 502, name: '奶油蘑菇煎小牛肉配馬鈴薯', price: 168, protein: 35, fat: 22, carbs: 30 },
      { id: 503, name: '米蘭炸牛排', price: 158, protein: 40, fat: 25, carbs: 20 },
      { id: 504, name: '鷄胸肉檸檬chapter醬配薯蓉', price: 138, protein: 32, fat: 14, carbs: 28 },
      { id: 505, name: '羅勒香蒜醬芝士青豆意粉', price: 118, protein: 16, fat: 15, carbs: 48 },
      { id: 506, name: '鱈魚番茄橄欖 酸豆醬意粉', price: 148, protein: 28, fat: 12, carbs: 42 },
      { id: 507, name: '番茄乳酪鮮羅勒長通粉', price: 108, protein: 14, fat: 13, carbs: 46 }
    ]
  },
  {
    id: 6,
    name: '甘牌燒鵝',
    cuisine: '粵菜',
    priceRange: '$$',
    matchScore: 94,
    image: 'https://picsum.photos/200/150?random=6',
    dishes: [
      { id: 601, name: '燒鵝瀨粉', price: 78, protein: 25, fat: 20, carbs: 40 },
      { id: 602, name: '燒鵝飯', price: 68, protein: 24, fat: 19, carbs: 45 },
      { id: 603, name: '太子撈麵(鵝油撈麵)', price: 58, protein: 12, fat: 15, carbs: 50 },
      { id: 604, name: '燒鵝燒肉飯', price: 75, protein: 28, fat: 22, carbs: 42 },
      { id: 605, name: '燒鵝叉燒飯', price: 72, protein: 26, fat: 20, carbs: 44 },
      { id: 606, name: '叉燒飯', price: 58, protein: 20, fat: 14, carbs: 46 }
    ]
  },
  {
    id: 7,
    name: 'Sophia Loren Pizzeria',
    cuisine: '意大利菜',
    priceRange: '$$',
    matchScore: 79,
    image: 'https://picsum.photos/200/150?random=7',
    dishes: [
      { id: 701, name: '波隆那肉醬寬麵', price: 98, protein: 22, fat: 16, carbs: 48 },
      { id: 702, name: '提拉米蘇', price: 48, protein: 5, fat: 12, carbs: 30 },
      { id: 703, name: '傳統卡邦尼意粉', price: 88, protein: 18, fat: 20, carbs: 42 },
      { id: 704, name: '番茄羅勒水牛芝士薄餅', price: 108, protein: 16, fat: 14, carbs: 45 },
      { id: 705, name: '開心果青醬火腿芝士薄餅', price: 118, protein: 20, fat: 18, carbs: 44 },
      { id: 706, name: '八爪魚薄片配意大利橄欖', price: 98, protein: 15, fat: 8, carbs: 12 },
      { id: 707, name: '西西里鯷魚歐芹油封車厘茄沙律薄餅', price: 128, protein: 18, fat: 16, carbs: 46 },
      { id: 708, name: '意大利熟火腿薄餅', price: 112, protein: 20, fat: 17, carbs: 43 },
      { id: 709, name: '五重芝士風味薄餅', price: 122, protein: 24, fat: 22, carbs: 40 },
      { id: 710, name: '焗千層芝士茄子配蕃茄醬', price: 88, protein: 10, fat: 12, carbs: 22 }
    ]
  },
  {
    id: 8,
    name: 'ULURU.HK',
    cuisine: '西餐',
    priceRange: '$$$',
    matchScore: 72,
    image: 'https://picsum.photos/200/150?random=8',
    dishes: [
      { id: 801, name: '炸香脆粗直薯條配黑松露醬', price: 58, protein: 5, fat: 18, carbs: 40 },
      { id: 802, name: '香煎美國有骨豬鞍扒伴蘋果燒汁', price: 168, protein: 38, fat: 20, carbs: 15 },
      { id: 803, name: '煎帶子龍蝦汁蟹籽意大利飯', price: 148, protein: 22, fat: 12, carbs: 48 },
      { id: 804, name: '澳洲肉眼扒配紅酒燒汁', price: 188, protein: 42, fat: 28, carbs: 10 },
      { id: 805, name: '紅燒蜜汁豬腩肉片五香肉丁燴意大利飯', price: 138, protein: 28, fat: 24, carbs: 50 },
      { id: 806, name: '香煎石斑扒配珠江橋牌豆豉鯪魚炒意粉', price: 158, protein: 34, fat: 16, carbs: 52 },
      { id: 807, name: '特濃腐乳白汁鷄柳粗管意粉', price: 128, protein: 26, fat: 18, carbs: 48 }
    ]
  },
  {
    id: 9,
    name: '陳家廚房',
    cuisine: '中式',
    priceRange: '$$',
    matchScore: 67,
    image: 'https://picsum.photos/200/150?random=9',
    dishes: [
      { id: 901, name: '賽螃蟹', price: 78, protein: 18, fat: 12, carbs: 8 },
      { id: 902, name: '咕嚕肉', price: 72, protein: 20, fat: 16, carbs: 35 },
      { id: 903, name: '清湯蘿蔔牛腩配紅米飯', price: 68, protein: 24, fat: 14, carbs: 40 }
    ]
  },
  {
    id: 10,
    name: '阿仔廚房',
    cuisine: '港式',
    priceRange: '$$',
    matchScore: 70,
    image: 'https://picsum.photos/200/150?random=10',
    dishes: [
      { id: 1001, name: '乳鴿', price: 68, protein: 22, fat: 12, carbs: 5 },
      { id: 1002, name: '椒鹽豬扒飯', price: 58, protein: 24, fat: 14, carbs: 48 },
      { id: 1003, name: '鮮茄焗豬扒飯', price: 62, protein: 26, fat: 15, carbs: 50 }
    ]
  },
  {
    id: 11,
    name: 'The Pasta Shack',
    cuisine: '意大利菜',
    priceRange: '$$',
    matchScore: 81,
    image: 'https://picsum.photos/200/150?random=11',
    dishes: [
      { id: 1101, name: '意式奶油蘑菇意粉', price: 88, protein: 14, fat: 18, carbs: 50 },
      { id: 1102, name: '普羅旺斯燉菜意粉', price: 82, protein: 10, fat: 12, carbs: 48 },
      { id: 1103, name: '肉丸意粉', price: 92, protein: 24, fat: 16, carbs: 46 }
    ]
  },
  {
    id: 12,
    name: 'Feather & Bone (Wan Chai)',
    cuisine: '西餐',
    priceRange: '$$$',
    matchScore: 89,
    image: 'https://picsum.photos/200/150?random=12',
    dishes: [
      { id: 1201, name: 'T骨牛扒', price: 288, protein: 55, fat: 35, carbs: 5 },
      { id: 1202, name: '炸魚薯條配豌豆泥', price: 128, protein: 22, fat: 18, carbs: 45 },
      { id: 1203, name: '和牛牛臀牛扒配烤大啡菇及黛安蘑菇醬', price: 268, protein: 48, fat: 30, carbs: 12 }
    ]
  },
  {
    id: 13,
    name: 'TANGRAM Bistro & Bar',
    cuisine: '法式',
    priceRange: '$$$',
    matchScore: 74,
    image: 'https://picsum.photos/200/150?random=13',
    dishes: [
      { id: 1301, name: '牛肉他他', price: 128, protein: 22, fat: 14, carbs: 8 },
      { id: 1302, name: '法式洋蔥湯配麵包', price: 68, protein: 8, fat: 6, carbs: 18 },
      { id: 1303, name: '香煎鱸魚排配薯仔', price: 158, protein: 30, fat: 12, carbs: 25 }
    ]
  },
  {
    id: 14,
    name: 'DiVino Patio',
    cuisine: '意大利菜',
    priceRange: '$$$',
    matchScore: 76,
    image: 'https://picsum.photos/200/150?random=14',
    dishes: [
      { id: 1401, name: '義大利沙拉米披薩', price: 138, protein: 18, fat: 16, carbs: 44 },
      { id: 1402, name: '烤春雞', price: 158, protein: 35, fat: 18, carbs: 10 },
      { id: 1403, name: '水牛芝士蕃茄披薩', price: 128, protein: 16, fat: 14, carbs: 42 }
    ]
  },
  {
    id: 15,
    name: 'Pepino意大利餐廳',
    cuisine: '意大利菜',
    priceRange: '$$$',
    matchScore: 83,
    image: 'https://picsum.photos/200/150?random=15',
    dishes: [
      { id: 1501, name: '黑松露牛肝菌蘑菇意大利飯', price: 148, protein: 12, fat: 18, carbs: 48 },
      { id: 1502, name: '蜆肉扁意粉', price: 128, protein: 20, fat: 10, carbs: 46 },
      { id: 1503, name: '提拉米蘇', price: 58, protein: 5, fat: 12, carbs: 30 }
    ]
  },
  {
    id: 16,
    name: '新嚐泰泰國餐廳',
    cuisine: '泰式',
    priceRange: '$$',
    matchScore: 77,
    image: 'https://picsum.photos/200/150?random=16',
    dishes: [
      { id: 1601, name: '串燒沙爹', price: 68, protein: 18, fat: 14, carbs: 12 },
      { id: 1602, name: '曼谷海南雞', price: 72, protein: 28, fat: 10, carbs: 8 },
      { id: 1603, name: '冬蔭公豬頸肉金邊粉', price: 78, protein: 22, fat: 12, carbs: 42 }
    ]
  }
];