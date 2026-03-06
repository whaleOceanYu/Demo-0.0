import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NutritionBar from '../components/ui/NutritionBar';
import { getRestaurantById } from '../services/restaurantService';
import { ROUTES } from '../constants/routes';
import { C } from '../constants/colors';

export default function MenuPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('增肌');

  const restaurant = getRestaurantById(id);

  if (!restaurant) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 24px', color: C.textLight, background: C.bg, minHeight: '100dvh' }}>
        <div style={{ fontSize: '14px', marginBottom: '16px' }}>找不到此餐廳</div>
        <div
          onClick={() => navigate(ROUTES.MAP)}
          style={{ display: 'inline-block', color: C.primary, fontWeight: '600', cursor: 'pointer', fontSize: '14px' }}
        >
          ← 返回地圖
        </div>
      </div>
    );
  }

  const isGain = activeTab === '增肌';
  const sortedDishes = [...restaurant.dishes].sort((a, b) =>
    isGain ? b.protein - a.protein : a.fat - b.fat
  );

  return (
    <div style={{ maxWidth: '450px', margin: '0 auto', minHeight: '100dvh', background: C.bg }}>

      {/* Header */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(244,241,236,0.96)', backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${C.border}`,
        padding: '0 16px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', height: '56px' }}>
          <div
            onClick={() => navigate(ROUTES.MAP)}
            style={{
              width: '34px', height: '34px', borderRadius: '50%',
              background: C.bgTint, border: `1px solid ${C.border}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', flexShrink: 0,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke={C.primaryDark} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: '700', fontSize: '17px', color: C.primaryDark, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {restaurant.name}
            </div>
            <div style={{ fontSize: '12px', color: C.textLight }}>
              {restaurant.cuisine} · {restaurant.priceRange}
            </div>
          </div>
        </div>

        {/* Tab bar */}
        <div style={{ display: 'flex', gap: '8px', paddingBottom: '12px' }}>
          {['增肌', '減脂'].map(tab => (
            <div
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                flex: 1, textAlign: 'center', padding: '9px 0',
                borderRadius: '13px', cursor: 'pointer', fontSize: '13px',
                fontWeight: activeTab === tab ? '600' : '400',
                background: activeTab === tab ? C.primary : C.bgTint,
                color: activeTab === tab ? 'white' : C.textLight,
                transition: 'all 0.15s',
              }}
            >
              {tab === '增肌' ? '🍗 增肌推薦' : '🥗 減脂推薦'}
            </div>
          ))}
        </div>
      </div>

      {/* Dish list */}
      <div style={{ padding: '12px 14px 32px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {sortedDishes.map(dish => {
          const highlight = isGain ? dish.protein > 20 : dish.fat < 10;
          const highlightLabel = isGain ? '高蛋白' : '低脂';
          return (
            <div
              key={dish.id}
              style={{
                borderRadius: '20px',
                padding: '14px',
                background: highlight ? 'rgba(107,144,128,0.09)' : 'rgba(255,255,255,0.88)',
                border: `1.5px solid ${highlight ? C.primaryTint : 'transparent'}`,
                backdropFilter: 'blur(10px)',
                boxShadow: highlight ? '0 2px 12px rgba(107,144,128,0.10)' : '0 2px 8px rgba(0,0,0,0.04)',
                display: 'flex', gap: '12px', alignItems: 'flex-start',
              }}
            >
              {/* Dish image placeholder */}
              <div style={{
                width: '72px', height: '72px', borderRadius: '14px', flexShrink: 0,
                background: `linear-gradient(135deg, ${C.primaryTint}, ${C.bgTint})`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '26px', fontWeight: '700', color: C.primary,
              }}>
                {dish.name[0]}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                  <span style={{ fontWeight: '600', fontSize: '15px', color: C.textDark, lineHeight: 1.3 }}>
                    {dish.name}
                  </span>
                  <span style={{ fontSize: '14px', fontWeight: '700', color: C.accent, flexShrink: 0 }}>
                    ${dish.price}
                  </span>
                </div>

                {highlight && (
                  <span style={{
                    display: 'inline-block', marginTop: '5px',
                    fontSize: '10px', fontWeight: '600', color: 'white',
                    background: C.accent, borderRadius: '10px', padding: '2px 8px',
                  }}>
                    {highlightLabel}
                  </span>
                )}

                <NutritionBar protein={dish.protein} fat={dish.fat} carbs={dish.carbs} />
              </div>
            </div>
          );
        })}

        <div style={{ textAlign: 'center', color: C.textLight, fontSize: '12px', marginTop: '4px' }}>
          ⚡ 營養數據為 AI 估算，僅供參考
        </div>
      </div>
    </div>
  );
}
