import { useState } from 'react';
import { ProgressCircle } from 'antd-mobile';
import { UserOutline, RightOutline } from 'antd-mobile-icons';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/layout/BottomNav';
import { useUser } from '../context/UserContext';
import { getAllRestaurants } from '../services/restaurantService';
import { ROUTES } from '../constants/routes';
import { C } from '../constants/colors';

const GOALS = ['增肌', '減脂', '保持體重'];

// 更符合菜品特色的真實餐飲數據
const MOCK_MEALS = [
  {
    id: 1, meal: '早餐', name: '水煮蛋·牛油果吐司',
    restaurant: 'Nourish Café 活力廚房',
    kcal: 340, protein: 18, fat: 16, carbs: 32, checked: true,
  },
  {
    id: 2, meal: '午餐', name: '香煎雞胸·藜麥沙拉',
    restaurant: '綠盈健康料理',
    kcal: 480, protein: 42, fat: 12, carbs: 38, checked: true,
  },
  {
    id: 3, meal: '晚餐', name: '味噌鮭魚定食',
    restaurant: '清水屋日式料理',
    kcal: 520, protein: 34, fat: 18, carbs: 54, checked: false,
  },
];

const cardStyle = {
  borderRadius: '20px',
  padding: '18px 16px',
  boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
  background: 'rgba(255,255,255,0.88)',
  backdropFilter: 'blur(12px)',
  marginBottom: '12px',
};

// 帶左側色條的區塊標題，避免標題文字「裸露」
const SectionHeader = ({ title, right }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div style={{ width: '3px', height: '15px', borderRadius: '2px', background: C.primary, flexShrink: 0 }} />
      <span style={{ fontWeight: '600', fontSize: '15px', color: C.primaryDark }}>{title}</span>
    </div>
    {right && <span style={{ fontSize: '12px', color: C.textLight }}>{right}</span>}
  </div>
);

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, likedIds, goal, setGoal } = useUser();
  const likedRestaurants = getAllRestaurants().filter(r => likedIds.has(r.id));

  const [meals, setMeals] = useState(MOCK_MEALS);
  const [addFoodOpen, setAddFoodOpen] = useState(false);

  const displayUser = user ?? { name: '訪客', age: '--', height: '--', weight: '--' };

  const checkedMeals  = meals.filter(m => m.checked);
  const totalKcal     = checkedMeals.reduce((s, m) => s + m.kcal, 0);
  const totalProtein  = checkedMeals.reduce((s, m) => s + m.protein, 0);
  const targetKcal    = 2200;
  const targetProtein = 150;

  const toggleMeal = (id) =>
    setMeals(ms => ms.map(m => m.id === id ? { ...m, checked: !m.checked } : m));

  return (
    /* 外層隱藏原生滾動條，保持 BottomNav 位置穩定 */
    <div style={{ maxWidth: '450px', margin: '0 auto', height: '100dvh', overflow: 'hidden', background: C.bg }}>
      <div className="hide-scrollbar" style={{ height: '100%', overflowY: 'auto', padding: '20px 14px 88px' }}>

        {/* ── 1. 個人信息 ─────────────────────────────── */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', padding: '4px 0' }}>
            <div style={{
              width: 62, height: 62, borderRadius: 31, flexShrink: 0,
              background: C.bgTint,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <UserOutline style={{ fontSize: 28, color: C.primary }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: '700', fontSize: '20px', color: C.textDark, lineHeight: 1.2 }}>
                {displayUser.name}
              </div>
              <div style={{ fontSize: '13px', color: C.textLight, marginTop: '5px' }}>
                {displayUser.age !== '--'
                  ? `${displayUser.age} 歲 · ${displayUser.height} cm · ${displayUser.weight} kg`
                  : '點此設置個人資料'}
              </div>
            </div>
          </div>

          {/* 健康目標選擇器（去掉標籤文字，直接呈現） */}
          <div style={{ display: 'flex', gap: '8px', marginTop: '18px' }}>
            {GOALS.map(g => (
              <div
                key={g}
                onClick={() => setGoal(g)}
                style={{
                  flex: 1, textAlign: 'center',
                  padding: '8px 0', borderRadius: '12px',
                  background: goal === g ? C.primary : C.bgTint,
                  color: goal === g ? 'white' : C.textLight,
                  fontSize: '13px', fontWeight: goal === g ? '600' : '400',
                  cursor: 'pointer', transition: 'all 0.15s',
                  border: `1.5px solid ${goal === g ? C.primary : 'transparent'}`,
                }}
              >
                {g}
              </div>
            ))}
          </div>
        </div>

        {/* ── 2. 今日追蹤（雙環圖） ────────────────────── */}
        <div style={cardStyle}>
          <SectionHeader title="今日追蹤" right={new Date().toLocaleDateString('zh-TW', { month: 'long', day: 'numeric' })} />
          <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <ProgressCircle
                percent={Math.min(100, Math.round((totalKcal / targetKcal) * 100))}
                style={{ '--size': '104px', '--fill-color': C.primary, '--track-color': C.bgTint }}
              >
                <div>
                  <div style={{ fontSize: '18px', fontWeight: '700', color: C.primaryDark, lineHeight: 1 }}>{totalKcal}</div>
                  <div style={{ fontSize: '10px', color: C.textLight, marginTop: '2px' }}>kcal</div>
                </div>
              </ProgressCircle>
              <div style={{ fontSize: '11px', color: C.textLight, marginTop: '8px' }}>目標 {targetKcal} kcal</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <ProgressCircle
                percent={Math.min(100, Math.round((totalProtein / targetProtein) * 100))}
                style={{ '--size': '104px', '--fill-color': C.accent, '--track-color': C.bgTint }}
              >
                <div>
                  <div style={{ fontSize: '18px', fontWeight: '700', color: C.primaryDark, lineHeight: 1 }}>{totalProtein}g</div>
                  <div style={{ fontSize: '10px', color: C.textLight, marginTop: '2px' }}>蛋白質</div>
                </div>
              </ProgressCircle>
              <div style={{ fontSize: '11px', color: C.textLight, marginTop: '8px' }}>目標 {targetProtein} g</div>
            </div>
          </div>
        </div>

        {/* ── 3. 收藏餐廳 ──────────────────────────────── */}
        {likedRestaurants.length > 0 && (
          <div style={cardStyle}>
            <SectionHeader title="收藏的餐廳" right={`${likedRestaurants.length} 家`} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {likedRestaurants.map(r => (
                <div
                  key={r.id}
                  onClick={() => navigate(ROUTES.MENU_FOR(r.id))}
                  style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
                >
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '10px', flexShrink: 0,
                    background: `linear-gradient(135deg, ${C.primaryTint}, ${C.bgTint})`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '16px', fontWeight: '700', color: C.primary,
                  }}>
                    {r.name[0]}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: '600', fontSize: '14px', color: C.textDark, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {r.name}
                    </div>
                    <div style={{ fontSize: '12px', color: C.textLight, marginTop: '2px' }}>
                      {r.cuisine} · {r.priceRange}
                    </div>
                  </div>
                  <RightOutline style={{ color: C.primaryLight, fontSize: '15px', flexShrink: 0 }} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── 4 & 5. 今日飲食記錄 ──────────────────────── */}
        <div style={cardStyle}>
          <SectionHeader
            title="今日飲食記錄"
            right={`已記錄 ${checkedMeals.length} / ${meals.length}`}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
            {meals.map(meal => (
              <div
                key={meal.id}
                style={{
                  borderRadius: '14px', padding: '11px 12px',
                  background: meal.checked ? 'rgba(107,144,128,0.08)' : C.bgTint,
                  border: `1.5px solid ${meal.checked ? C.primaryTint : 'transparent'}`,
                  display: 'flex', gap: '10px', alignItems: 'flex-start',
                }}
              >
                {/* 打勾圓圈 */}
                <div onClick={() => toggleMeal(meal.id)} style={{ flexShrink: 0, cursor: 'pointer', paddingTop: '1px' }}>
                  {meal.checked ? (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" fill={C.primary} />
                      <path d="M7.5 12l3 3 5.5-5.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke={C.border} strokeWidth="1.8" />
                    </svg>
                  )}
                </div>

                {/* 食物信息 */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ fontWeight: '600', fontSize: '14px', color: C.textDark }}>{meal.name}</div>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: meal.checked ? C.primary : C.textLight, flexShrink: 0, marginLeft: '6px' }}>
                      {meal.kcal} kcal
                    </div>
                  </div>
                  <div style={{ fontSize: '11px', color: C.textLight, marginTop: '2px' }}>
                    {meal.meal} · {meal.restaurant}
                  </div>
                  <div style={{ display: 'flex', gap: '12px', marginTop: '7px' }}>
                    {[
                      { label: '蛋白質', val: meal.protein, unit: 'g' },
                      { label: '脂肪',   val: meal.fat,     unit: 'g' },
                      { label: '碳水',   val: meal.carbs,   unit: 'g' },
                    ].map(n => (
                      <div key={n.label} style={{ fontSize: '11px', color: C.textLight }}>
                        <span style={{ fontWeight: '600', color: C.textDark }}>{n.val}{n.unit}</span>
                        {' '}{n.label}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 添加食物 */}
          <div style={{ marginTop: '12px' }}>
            <div
              onClick={() => setAddFoodOpen(o => !o)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                padding: '10px', borderRadius: '12px',
                border: `1.5px dashed ${C.border}`,
                cursor: 'pointer', color: C.primary, fontWeight: '600', fontSize: '14px',
                background: addFoodOpen ? C.bgTint : 'transparent',
                transition: 'background 0.15s',
              }}
            >
              + 添加食物
            </div>
            {addFoodOpen && (
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <div
                  onClick={() => navigate(ROUTES.MAP)}
                  style={{
                    flex: 1, padding: '13px 10px', borderRadius: '12px',
                    background: C.bgTint, textAlign: 'center',
                    cursor: 'pointer', color: C.primaryDark, fontWeight: '600', fontSize: '13px',
                    border: `1px solid ${C.border}`,
                  }}
                >
                  從地圖餐廳選擇
                </div>
                <div
                  style={{
                    flex: 1, padding: '13px 10px', borderRadius: '12px',
                    background: C.bgTint, textAlign: 'center',
                    cursor: 'pointer', color: C.primaryDark, fontWeight: '600', fontSize: '13px',
                    border: `1px solid ${C.border}`,
                  }}
                >
                  手動輸入 / 拍照
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
      <BottomNav />
    </div>
  );
}
