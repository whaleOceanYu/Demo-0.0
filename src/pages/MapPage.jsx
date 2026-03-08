// src/pages/MapPage.jsx

import { useState, useRef, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { SearchBar } from 'antd-mobile';
import BottomNav from '../components/layout/BottomNav';
import { getAllRestaurants, searchRestaurants, getRestaurantById } from '../services/restaurantService';
import { useUser } from '../context/UserContext';
import { C } from '../constants/colors';

const BOTTOM_NAV_H = 58;
const SEARCH_BAR_H = 72; // top:16 + height:48 + gap:8

// 真實經緯度（來源：RestaurantInfo 3.8 updated.xlsx）
const RESTAURANT_COORDS = {
  1:  [22.2811627786248, 114.17288748889],   // 港灣茶餐廳
  2:  [22.2817723990418, 114.173920192124],  // 中庭
  3:  [22.2845424998463, 114.176973617901],  // 意日閣
  4:  [22.281623030676,  114.174014269771],  // 港灣道 Café
  5:  [22.280442821998,  114.172028529175],  // Giá Trattoria Italiana
  6:  [22.2777342789581, 114.175488888331],  // 甘牌燒鵝
  7:  [22.2765205259857, 114.172001636671],  // Sophia Loren Pizzeria
  8:  [22.2763103857287, 114.173256736671],  // ULURU.HK
  9:  [22.2779499556311, 114.179787053866],  // 陳家廚房
  10: [22.2798101091246, 114.179058823179],  // 阿仔廚房
  11: [22.2760350468236, 114.173454797207],  // The Pasta Shack
  12: [22.2771144811465, 114.171939752015],  // Feather & Bone
  13: [22.2793211260718, 114.177827990107],  // TANGRAM Bistro & Bar
  14: [22.2804192691747, 114.177087984553],  // DiVino Patio
  15: [22.2790693497488, 114.177058738522],  // Pepino意大利餐廳
  16: [22.2764962698038, 114.176346973394],  // 新嚐泰泰國餐廳
};

const getMatchCount = (restaurant, goal) => {
  return restaurant.dishes.filter(d => {
    const k = d.protein * 4 + d.fat * 9 + d.carbs * 4;
    const pct = d.protein * 4 / k;
    const gainOk = d.protein >= 28 && pct >= 0.22;
    const loseOk = pct >= 0.18 && d.fat < 22 && k < 550;
    if (goal === '增肌') return gainOk;
    if (goal === '減脂') return loseOk;
    return gainOk || loseOk; // 保持體重 = 兩者取並集
  }).length;
};

const sortRestaurants = (list, filter, userGoal) => {
  const copy = [...list];
  if (filter === '價格') return copy.sort((a, b) => a.priceRange.length - b.priceRange.length);
  if (filter === '營養') return copy.sort((a, b) => getMatchCount(b, userGoal) - getMatchCount(a, userGoal));
  return copy;
};

const FILTERS = ['營養', '距離', '價格'];

const floatPill = {
  background: 'rgba(255,255,255,0.93)',
  backdropFilter: 'blur(12px)',
  borderRadius: '20px',
  boxShadow: '0 2px 12px rgba(62,104,84,0.13)',
  border: '1.5px solid rgba(107,144,128,0.28)',
};

// ── Marker icon factory ──────────────────────────────────────
// zoomTier: 0 = dots (<15), 1 = partial names (15-16), 2 = all names (≥16)
const createMarkerIcon = (restaurant, isSelected, matchCount, zoomTier, showName) => {
  const fill = isSelected ? C.primaryDark : C.primary;

  if (zoomTier === 0) {
    const size = isSelected ? 13 : 8;
    return L.divIcon({
      className: '',
      html: `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${fill};box-shadow:0 1px 5px rgba(0,0,0,0.28);border:2px solid rgba(255,255,255,0.9);"></div>`,
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
    });
  }

  const nameHtml = showName
    ? `<div style="margin-top:4px;background:rgba(255,255,255,0.93);backdrop-filter:blur(10px);border-radius:12px;padding:3px 9px;font-size:11px;font-weight:600;color:${C.primaryDark};white-space:nowrap;box-shadow:0 2px 10px rgba(62,104,84,0.18);border:1px solid rgba(107,144,128,0.22);pointer-events:auto;">${restaurant.name}</div>`
    : '';

  return L.divIcon({
    className: '',
    html: `
      <div style="display:inline-flex;align-items:flex-start;gap:5px;pointer-events:none;">
        <div style="position:relative;width:32px;height:42px;flex-shrink:0;filter:drop-shadow(0 3px 6px rgba(62,104,84,0.3));">
          <svg width="32" height="42" viewBox="0 0 32 42" fill="none">
            <path d="M16 0C7.16 0 0 7.16 0 16C0 25.5 16 42 16 42C16 42 32 25.5 32 16C32 7.16 24.84 0 16 0Z" fill="${fill}"/>
            <circle cx="16" cy="16" r="10.5" fill="white" fill-opacity="0.95"/>
          </svg>
          <div style="position:absolute;top:0;left:0;width:32px;height:32px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:${fill};font-family:'DM Sans',sans-serif;">${matchCount}</div>
        </div>
        ${nameHtml}
      </div>
    `,
    iconSize: [220, 42],
    iconAnchor: [16, 42],
  });
};

// ── Map controller: zoom tracking + flyTo ───────────────────
function MapController({ setZoom, mapRef }) {
  const map = useMap();
  useEffect(() => {
    mapRef.current = map;
    setZoom(map.getZoom());
  }, [map]); // eslint-disable-line
  useMapEvents({ zoomend: () => setZoom(map.getZoom()) });
  return null;
}

// ── 推薦等級計算（增肌／減脂）────────────────────────────────
// tier 2 = 高度推薦，tier 1 = 較推薦，tier 0 = 不推薦
function getDishTier(dish, isGain) {
  const k = dish.protein * 4 + dish.fat * 9 + dish.carbs * 4;
  const proteinPct = dish.protein * 4 / k; // 蛋白質佔熱量比例
  if (isGain) {
    // 增肌：優先蛋白質絕對量 + 蛋白佔比（避免高脂高蛋白混淆）
    if (dish.protein >= 35 && proteinPct >= 0.28) return 2;
    if (dish.protein >= 28 && proteinPct >= 0.22) return 1;
  } else {
    // 減脂：需同時滿足「足夠蛋白護肌」+「低脂」+「總熱量合理」
    // 純低卡但缺乏蛋白（甜品、麵食）不應推薦
    if (proteinPct >= 0.26 && dish.fat <= 18 && k < 480) return 2;
    if (proteinPct >= 0.18 && dish.fat < 22 && k < 550) return 1;
  }
  return 0;
}

// ── Inline restaurant detail panel ──────────────────────────
function RestaurantDetail({ restaurant, onBack, userGoal }) {
  const initTab = userGoal === '減脂' ? '減脂' : '增肌';
  const [activeTab, setActiveTab] = useState(initTab);
  const isGain = activeTab === '增肌';
  const kcal = d => d.protein * 4 + d.fat * 9 + d.carbs * 4;

  // 先按推薦等級降序，同等級內再按主要指標排序
  const sortedDishes = [...restaurant.dishes].sort((a, b) => {
    const ta = getDishTier(a, isGain), tb = getDishTier(b, isGain);
    if (tb !== ta) return tb - ta;
    return isGain ? b.protein - a.protein : kcal(a) - kcal(b);
  });

  const distLabel = restaurant.distance != null
    ? (restaurant.distance < 1000 ? restaurant.distance + 'm' : (restaurant.distance / 1000).toFixed(1) + 'km')
    : null;

  const isUserPlanTab = (tab) =>
    (userGoal === '增肌' && tab === '增肌') ||
    (userGoal === '減脂' && tab === '減脂');

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: C.bg, overflow: 'hidden', borderRadius: '24px' }}>

      {/* ── Header ── */}
      <div style={{
        flexShrink: 0,
        background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${C.border}`,
        borderRadius: '24px 24px 0 0',
        padding: '10px 14px 10px',
      }}>
        {/* Back button left, all info to its right */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            onClick={onBack}
            style={{
              width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
              background: C.bgTint, border: `1px solid ${C.border}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
              stroke={C.primaryDark} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </div>

          {/* Info block */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Name + cuisine/price/dist + Maps button */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ fontWeight: '700', fontSize: '15px', color: C.primaryDark, lineHeight: 1.3, flexShrink: 0 }}>
                {restaurant.name}
              </div>
              <div style={{ fontSize: '11px', color: C.textLight, flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {restaurant.cuisine} · {restaurant.priceRange}{distLabel && ` · ${distLabel}`}
              </div>
              {restaurant.googleMapsUrl && (
                <a href={restaurant.googleMapsUrl} target="_blank" rel="noopener noreferrer"
                  style={{
                    flexShrink: 0, width: '26px', height: '26px', borderRadius: '50%',
                    background: C.bgTint, border: `1px solid ${C.border}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    textDecoration: 'none',
                  }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                    stroke={C.primaryDark} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                  </svg>
                </a>
              )}
            </div>

            {/* Phone + address pills */}
            {(restaurant.phone || restaurant.address) && (
              <div style={{ display: 'flex', gap: '5px', marginTop: '6px', overflow: 'hidden' }}>
                {restaurant.phone && (
                  <a href={`tel:${restaurant.phone}`} style={{
                    display: 'inline-flex', alignItems: 'center', gap: '3px',
                    background: C.bgTint, borderRadius: '20px', padding: '3px 8px',
                    fontSize: '10px', color: C.primaryDark, textDecoration: 'none', flexShrink: 0,
                    border: `1px solid ${C.border}`,
                  }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.42 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.5a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16z"/>
                    </svg>
                    {restaurant.phone}
                  </a>
                )}
                {restaurant.address && (
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: '3px',
                    background: C.bgTint, borderRadius: '20px', padding: '3px 8px',
                    fontSize: '10px', color: C.textLight, minWidth: 0, flex: 1,
                    border: `1px solid ${C.border}`,
                  }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                    </svg>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {restaurant.address}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Tab selector ── */}
      <div style={{ display: 'flex', gap: '8px', padding: '8px 12px 6px', flexShrink: 0, background: 'rgba(255,255,255,0.85)' }}>
        {['增肌', '減脂'].map(tab => (
          <div
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              flex: 1, textAlign: 'center', padding: '7px 0', borderRadius: '999px',
              cursor: 'pointer',
              fontWeight: activeTab === tab ? '600' : '400',
              background: activeTab === tab ? C.primary : C.bgTint,
              color: activeTab === tab ? 'white' : C.textLight,
              transition: 'all 0.15s',
            }}
          >
            {tab === '增肌' ? (
              <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6.5 6.5h11M6.5 17.5h11M4 9.5H2m20 0h-2M4 14.5H2m20 0h-2M4 9.5v5M20 9.5v5"/>
                  </svg>
                  增肌推薦
                </span>
                {isUserPlanTab('增肌') && <span style={{ position: 'absolute', left: '100%', marginLeft: '3px', fontSize: '9px', opacity: 0.85, whiteSpace: 'nowrap' }}>(你的方案)</span>}
              </span>
            ) : (
              <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2a9 9 0 0 1 9 9c0 4.17-2.84 7.67-6.7 8.66C13.55 21.1 12.8 22 12 22s-1.55-.9-2.3-2.34A9 9 0 0 1 12 2z"/>
                    <path d="M12 2c-2 4-2 8 0 14"/>
                  </svg>
                  減脂推薦
                </span>
                {isUserPlanTab('減脂') && <span style={{ position: 'absolute', left: '100%', marginLeft: '3px', fontSize: '9px', opacity: 0.85, whiteSpace: 'nowrap' }}>(你的方案)</span>}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* ── Dish list ── */}
      <div className="hide-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '8px 12px 12px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {sortedDishes.map(dish => {
            const dishKcal = kcal(dish);
            const tier = getDishTier(dish, isGain);
            return (
              <div
                key={dish.id}
                style={{
                  borderRadius: '14px', padding: '10px 12px',
                  background: tier === 2 ? 'rgba(107,144,128,0.10)' : tier === 1 ? 'rgba(107,144,128,0.04)' : 'rgba(255,255,255,0.9)',
                  border: `1.5px solid ${tier > 0 ? C.primaryTint : 'transparent'}`,
                  backdropFilter: 'blur(8px)',
                  display: 'flex', gap: '10px', alignItems: 'flex-start',
                }}
              >
                {/* Dish image */}
                <div style={{
                  width: '48px', height: '48px', borderRadius: '10px', flexShrink: 0,
                  background: `linear-gradient(135deg, ${C.primaryTint}, ${C.bgTint})`,
                  overflow: 'hidden',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {dish.image
                    ? <img src={dish.image} alt={dish.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <span style={{ fontSize: '18px', fontWeight: '700', color: C.primary }}>{dish.name[0]}</span>
                  }
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '6px' }}>
                    <span style={{ fontWeight: '600', fontSize: '13px', color: C.textDark, lineHeight: 1.3, flex: 1, minWidth: 0 }}>
                      {dish.name}
                    </span>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: C.accent, flexShrink: 0 }}>${dish.price}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '3px' }}>
                    <span style={{ fontSize: '11px', color: C.textLight }}>{dishKcal} kcal</span>
                    {tier === 2 && (
                      <span style={{ fontSize: '9px', fontWeight: '700', color: 'white', background: C.primary, borderRadius: '8px', padding: '2px 6px', letterSpacing: '0.02em' }}>
                        高度推薦
                      </span>
                    )}
                    {tier === 1 && (
                      <span style={{ fontSize: '9px', fontWeight: '600', color: C.primary, background: C.primaryTint, borderRadius: '8px', padding: '2px 6px' }}>
                        較推薦
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
                    {[['蛋白', dish.protein, C.primary], ['脂肪', dish.fat, C.accent], ['碳水', dish.carbs, C.textLight]].map(([l, v, c]) => (
                      <span key={l} style={{ fontSize: '11px', color: C.textLight }}>
                        <span style={{ fontWeight: '600', color: c }}>{v}g</span> {l}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: '10px', textAlign: 'center', color: C.textLight, fontSize: '11px' }}>
          ⚡ 營養數據為 AI 估算，僅供參考
        </div>
      </div>
    </div>
  );
}

export default function MapPage() {
  const { likedIds, toggleLike, goal: userGoal } = useUser();

  const [searchQuery,  setSearchQuery]  = useState('');
  const [selectedId,   setSelectedId]   = useState(null);
  const [showPanel,    setShowPanel]    = useState(true);
  const [activeFilter, setActiveFilter] = useState('距離');
  const [panelHeight,  setPanelHeight]  = useState(null);
  const [scrollThumb,  setScrollThumb]  = useState({ top: 0, height: 0, visible: false });
  const [mapZoom,      setMapZoom]      = useState(14);
  const [detailId,     setDetailId]     = useState(null);
  const [displayId,    setDisplayId]    = useState(null);

  const panelRef         = useRef(null);
  const dragStartY       = useRef(null);
  const dragStartH       = useRef(null);
  const isDragging       = useRef(false);
  const mapRef           = useRef(null);
  const detailTimer      = useRef(null);
  const prevPanelHRef    = useRef(undefined); // saves height before opening detail (undefined = not saved)

  // Zoom tier: 0 = dots, 1 = partial names, 2 = all names
  // Only changes at boundaries 15 and 16, preventing unnecessary marker redraws
  const zoomTier = mapZoom < 15 ? 0 : mapZoom < 16 ? 1 : 2;

  const handleScroll = () => {
    const el = panelRef.current;
    if (!el) return;
    const { scrollHeight, clientHeight, scrollTop } = el;
    if (scrollHeight <= clientHeight) { setScrollThumb(s => ({ ...s, visible: false })); return; }
    const thumbH = Math.max(32, (clientHeight / scrollHeight) * clientHeight);
    const thumbT = (scrollTop / (scrollHeight - clientHeight)) * (clientHeight - thumbH);
    setScrollThumb({ top: thumbT, height: thumbH, visible: true });
  };

  const restaurants = useMemo(() =>
    sortRestaurants(
      searchQuery ? searchRestaurants(searchQuery) : getAllRestaurants(),
      activeFilter,
      userGoal
    ),
    [searchQuery, activeFilter, userGoal]
  );

  const allByMatch = useMemo(() =>
    [...getAllRestaurants()].sort((a, b) => getMatchCount(b, userGoal) - getMatchCount(a, userGoal)),
    [userGoal]
  );

  const showNameIds = useMemo(() => {
    const limit = zoomTier === 2 ? allByMatch.length : zoomTier === 1 ? 3 : 0;
    return new Set(allByMatch.slice(0, limit).map(r => r.id));
  }, [zoomTier, allByMatch]);

  // Memoized marker icons — only rebuilt when zoom tier, selection, or restaurant data changes.
  // This prevents the markerGrow animation from firing during panel drag or unrelated re-renders.
  const markerIcons = useMemo(() => {
    const icons = {};
    restaurants.forEach(r => {
      icons[r.id] = createMarkerIcon(r, selectedId === r.id, getMatchCount(r, userGoal), zoomTier, showNameIds.has(r.id));
    });
    return icons;
  }, [restaurants, selectedId, userGoal, zoomTier, showNameIds]);

  const getMaxPanelH = () => window.innerHeight - BOTTOM_NAV_H - 8 - SEARCH_BAR_H;

  // Center the pin in the visible map area when the panel is at LOW position
  // (between bottom of search bar and top of the default-height panel).
  // This offset is constant regardless of whether list or detail is shown.
  const getStableOffsetPx = () => {
    const defaultPanelH = window.innerHeight * 0.45;
    const visibleTop    = SEARCH_BAR_H;
    const visibleBottom = window.innerHeight - defaultPanelH - BOTTOM_NAV_H - 8;
    const targetY       = (visibleTop + visibleBottom) / 2;
    // Positive offset shifts the map center southward so the pin appears above center
    return window.innerHeight / 2 - targetY;
  };

  const flyToRestaurant = (id) => {
    const coords = RESTAURANT_COORDS[id];
    if (coords && mapRef.current) {
      const map = mapRef.current;
      const targetZoom = Math.max(map.getZoom(), 16);
      const offsetPx = getStableOffsetPx();
      const targetPoint = map.project(coords, targetZoom);
      const adjustedPoint = L.point(targetPoint.x, targetPoint.y + offsetPx);
      const adjustedCoords = map.unproject(adjustedPoint, targetZoom);
      map.flyTo(adjustedCoords, targetZoom, { duration: 0.8 });
    }
  };

  const handleDragStart = (e) => {
    dragStartY.current = e.touches[0].clientY;
    dragStartH.current = panelHeight ?? (window.innerHeight * 0.45);
    isDragging.current = true;
  };
  const handleDragMove = (e) => {
    if (!isDragging.current) return;
    const delta = dragStartY.current - e.touches[0].clientY;
    const maxH  = getMaxPanelH();
    setPanelHeight(Math.max(120, Math.min(maxH, dragStartH.current + delta)));
  };
  const handleDragEnd = () => {
    isDragging.current = false;
    const minH = window.innerHeight * 0.45;
    const maxH = getMaxPanelH();
    setPanelHeight(panelHeight > (minH + maxH) / 2 ? maxH : minH);
    dragStartY.current = null;
  };

  const handleMarkerClick = (id) => {
    setSelectedId(id);
    if (!showPanel) setPanelHeight(null); // reset to LOW position when revealing from hidden
    setShowPanel(true);
    flyToRestaurant(id);
    setTimeout(() => {
      const card      = document.getElementById(`r-card-${id}`);
      const container = panelRef.current;
      if (card && container) {
        const scrollTarget = container.scrollTop
          + (card.getBoundingClientRect().top - container.getBoundingClientRect().top) - 8;
        container.scrollTo({ top: scrollTarget, behavior: 'smooth' });
      }
    }, 80);
  };

  const handleViewDetail = (e, id) => {
    e.stopPropagation();
    clearTimeout(detailTimer.current);
    prevPanelHRef.current = panelHeight; // save (may be null = default 45vh)
    setDisplayId(id);
    setDetailId(id);
    setPanelHeight(getMaxPanelH());
    flyToRestaurant(id);
  };

  const handleBackFromDetail = () => {
    setDetailId(null);
    // restore whatever height was saved (undefined means nothing was saved)
    if (prevPanelHRef.current !== undefined) {
      setPanelHeight(prevPanelHRef.current); // null restores default 45vh
      prevPanelHRef.current = undefined;
    }
    detailTimer.current = setTimeout(() => setDisplayId(null), 400);
  };

  const handleSelectCard = (id) => {
    setSelectedId(id);
    flyToRestaurant(id);
  };

  const detailRestaurant = displayId ? getRestaurantById(displayId) : null;

  return (
    <div style={{ maxWidth: '450px', margin: '0 auto', height: '100dvh', position: 'relative', overflow: 'hidden' }}>

      {/* ── 全屏地圖 */}
      <MapContainer
        center={[22.2800, 114.1730]} zoom={14}
        style={{ width: '100%', height: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
        />
        <MapController setZoom={setMapZoom} mapRef={mapRef} />
        {restaurants.map(r => {
          const coords = RESTAURANT_COORDS[r.id];
          if (!coords) return null;
          return (
            <Marker
              key={r.id}
              position={coords}
              icon={markerIcons[r.id]}
              eventHandlers={{ click: () => handleMarkerClick(r.id) }}
            />
          );
        })}
      </MapContainer>

      {/* ── 懸浮搜索欄 */}
      <div style={{ position: 'absolute', top: 16, left: 16, right: 16, zIndex: 1000 }}>
        <div style={{ ...floatPill, overflow: 'hidden' }}>
          <SearchBar
            placeholder='搜尋餐廳或菜系⋯'
            showCancelButton={() => false}
            value={searchQuery}
            onChange={setSearchQuery}
            onClear={() => setSearchQuery('')}
            style={{ '--background': 'transparent', '--border-radius': '0', '--height': '48px', '--font-size': '15px' }}
          />
        </div>
      </div>

      {/* ── 底部面板（含列表與詳情的 iOS 式 slide 容器）*/}
      {showPanel && (
        <div style={{
          position: 'absolute',
          bottom: BOTTOM_NAV_H + 8,
          left: 0, right: 0,
          height: panelHeight ?? '45vh',
          zIndex: 1000,
          overflow: 'hidden',
          borderRadius: '24px',
          transition: isDragging.current ? 'none' : 'height 0.28s cubic-bezier(0.4,0,0.2,1)',
          pointerEvents: 'none',
        }}>

          {/* Slide container: list left, detail right */}
          <div style={{
            display: 'flex',
            width: '200%',
            height: '100%',
            transform: detailId ? 'translateX(-50%)' : 'translateX(0)',
            transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1)',
          }}>

            {/* ── Left: restaurant list ──────────────────────────── */}
            <div style={{
              width: '50%', height: '100%',
              display: 'flex', flexDirection: 'column',
              pointerEvents: 'none',
            }}>
              {/* Drag handle */}
              <div
                onTouchStart={handleDragStart}
                onTouchMove={handleDragMove}
                onTouchEnd={handleDragEnd}
                style={{
                  display: 'flex', justifyContent: 'center',
                  paddingTop: '10px', paddingBottom: '8px',
                  flexShrink: 0, cursor: 'ns-resize', touchAction: 'none',
                  pointerEvents: 'auto',
                }}
              >
                <div style={{
                  width: '36px', height: '4px', borderRadius: '2px',
                  background: 'rgba(255,255,255,0.85)',
                  boxShadow: '0 1px 6px rgba(0,0,0,0.18)',
                }} />
              </div>

              {/* Title + filters row */}
              <div style={{
                display: 'flex', alignItems: 'center',
                padding: '0 12px 10px', gap: '8px', flexShrink: 0,
                pointerEvents: 'none',
              }}>
                <div style={{
                  padding: '6px 12px', whiteSpace: 'nowrap', pointerEvents: 'auto',
                  background: 'rgba(235,231,224,0.92)', borderRadius: '20px',
                  backdropFilter: 'blur(8px)', flexShrink: 0,
                }}>
                  <span style={{ fontWeight: '500', fontSize: '13px', color: C.textLight, letterSpacing: '0.02em' }}>
                    附近餐廳{searchQuery ? ` · ${restaurants.length} 家` : ''}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '6px', flex: 1, pointerEvents: 'none' }}>
                  {FILTERS.map(label => (
                    <div
                      key={label}
                      onClick={() => setActiveFilter(label)}
                      style={{
                        ...floatPill,
                        pointerEvents: 'auto',
                        padding: '5px 11px', fontSize: '12px', fontWeight: '600',
                        color: activeFilter === label ? 'white' : C.primaryDark,
                        background: activeFilter === label ? C.primary : 'rgba(255,255,255,0.93)',
                        cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap',
                        transition: 'background 0.15s, color 0.15s',
                      }}
                    >
                      {label}
                    </div>
                  ))}
                </div>
                <div
                  onClick={() => setShowPanel(false)}
                  style={{
                    ...floatPill, pointerEvents: 'auto',
                    width: '28px', height: '28px', borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', color: C.textLight, fontSize: '13px', flexShrink: 0,
                  }}
                >✕</div>
              </div>

              {/* Scrollable card list */}
              <div style={{ flex: 1, position: 'relative' }}>
                <div style={{
                  position: 'absolute', inset: 0,
                  clipPath: 'inset(0px 12px 0px 12px round 16px)',
                  pointerEvents: 'none',
                }}>
                  <div
                    ref={panelRef}
                    className="hide-scrollbar"
                    onScroll={handleScroll}
                    style={{
                      height: '100%', overflowY: 'auto',
                      padding: '4px 12px 12px',
                      display: 'flex', flexDirection: 'column', gap: '8px',
                      pointerEvents: 'auto',
                    }}
                  >
                    {restaurants.length === 0 && (
                      <div style={{ ...floatPill, padding: '14px 20px', textAlign: 'center', color: C.textLight, fontSize: '14px' }}>
                        找不到相關餐廳
                      </div>
                    )}

                    {restaurants.map(r => {
                      const matchCount = getMatchCount(r, userGoal);
                      const isSelected = selectedId === r.id;
                      const isLiked    = likedIds.has(r.id);
                      return (
                        <div
                          id={`r-card-${r.id}`}
                          key={r.id}
                          onClick={() => handleSelectCard(r.id)}
                          style={{
                            background: isSelected ? 'rgba(200,218,210,0.97)' : 'rgba(255,254,252,0.95)',
                            backdropFilter: 'blur(14px)',
                            borderRadius: '16px',
                            padding: '10px 12px',
                            border: `1.5px solid ${isSelected ? C.primary : 'rgba(255,255,255,0.75)'}`,
                            boxShadow: isSelected ? `0 6px 20px rgba(62,104,84,0.18)` : 'none',
                            cursor: 'pointer', flexShrink: 0,
                            transition: 'box-shadow 0.2s, border-color 0.2s, background 0.2s',
                          }}
                        >
                          <div style={{ display: 'flex', gap: '11px', alignItems: 'center' }}>

                            {/* Restaurant image */}
                            <div style={{
                              width: '64px', height: '64px', borderRadius: '12px', flexShrink: 0,
                              background: `linear-gradient(135deg, ${C.primaryTint}, ${C.bgTint})`,
                              overflow: 'hidden',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                              {r.image
                                ? <img src={r.image} alt={r.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                : <span style={{ fontSize: '22px', fontWeight: '700', color: C.primary }}>{r.name[0]}</span>
                              }
                            </div>

                            {/* Info area */}
                            <div style={{ flex: 1, minWidth: 0 }}>
                              {/* Row 1: name + heart */}
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ fontWeight: '600', fontSize: '15px', color: C.primaryDark, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, marginRight: '6px' }}>
                                  {r.name}
                                </div>
                                <div
                                  onClick={e => { e.stopPropagation(); toggleLike(r.id); }}
                                  style={{ flexShrink: 0, cursor: 'pointer', lineHeight: 1, padding: '2px' }}
                                >
                                  <svg width="19" height="19" viewBox="0 0 24 24" fill={isLiked ? C.accent : 'none'}
                                    stroke={isLiked ? C.accent : C.textLight} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                                  </svg>
                                </div>
                              </div>

                              {/* Row 2: cuisine · price · distance */}
                              <div style={{ fontSize: '12px', color: C.textLight, marginTop: '3px' }}>
                                {r.cuisine} · {r.priceRange}
                                {r.distance != null && ` · ${r.distance < 1000 ? r.distance + 'm' : (r.distance / 1000).toFixed(1) + 'km'}`}
                              </div>

                              {/* Row 3: match count + 查看詳情 button */}
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                                <div style={{
                                  display: 'inline-flex', alignItems: 'center', gap: '3px',
                                  background: isSelected ? 'rgba(62,104,84,0.12)' : C.bgTint,
                                  borderRadius: '8px', padding: '3px 8px',
                                }}>
                                  <span style={{ fontSize: '12px', fontWeight: '600', color: C.primary }}>{matchCount}</span>
                                  <span style={{ fontSize: '11px', color: C.textLight }}>道符合你的健康目標</span>
                                </div>
                                <div
                                  onClick={e => handleViewDetail(e, r.id)}
                                  style={{
                                    fontSize: '11px', fontWeight: '600', color: C.primaryDark,
                                    cursor: 'pointer', whiteSpace: 'nowrap',
                                    background: isSelected ? 'rgba(62,104,84,0.14)' : C.bgTint,
                                    border: `1px solid ${isSelected ? C.primaryTint : C.border}`,
                                    borderRadius: '10px', padding: '4px 10px',
                                    transition: 'background 0.15s',
                                  }}
                                >
                                  查看詳情
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Scrollbar indicator */}
                {scrollThumb.visible && (
                  <div style={{
                    position: 'absolute', right: 6, top: 4, bottom: 20, width: 3, zIndex: 2,
                    borderRadius: '2px', background: 'rgba(107,144,128,0.12)',
                    pointerEvents: 'none',
                  }}>
                    <div style={{
                      position: 'absolute', top: scrollThumb.top, height: scrollThumb.height,
                      width: '100%', background: 'rgba(107,144,128,0.45)', borderRadius: '2px',
                    }} />
                  </div>
                )}
              </div>
            </div>{/* /list panel */}

            {/* ── Right: restaurant detail ─────────────────────── */}
            <div style={{ width: '50%', height: '100%', pointerEvents: detailId ? 'auto' : 'none' }}>
              {detailRestaurant && (
                <RestaurantDetail
                  restaurant={detailRestaurant}
                  onBack={handleBackFromDetail}
                  userGoal={userGoal}
                />
              )}
            </div>

          </div>{/* /slide container */}
        </div>
      )}

      <BottomNav />
    </div>
  );
}
