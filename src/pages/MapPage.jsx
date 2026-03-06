// src/pages/MapPage.jsx

import { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { SearchBar } from 'antd-mobile';
import BottomNav from '../components/layout/BottomNav';
import { getAllRestaurants, searchRestaurants, getRestaurantById } from '../services/restaurantService';
import { useUser } from '../context/UserContext';
import { C } from '../constants/colors';

const BOTTOM_NAV_H = 58;

const RESTAURANT_COORDS = {
  1:  [22.2783, 114.1747], 2:  [22.2795, 114.1730],
  3:  [22.2810, 114.1762], 4:  [22.2770, 114.1742],
  5:  [22.2825, 114.1720], 6:  [22.2760, 114.1780],
  7:  [22.2800, 114.1700], 8:  [22.2815, 114.1770],
  9:  [22.2790, 114.1690], 10: [22.2775, 114.1758],
  11: [22.2830, 114.1742], 12: [22.2765, 114.1722],
  13: [22.2805, 114.1712], 14: [22.2785, 114.1782],
  15: [22.2820, 114.1752], 16: [22.2755, 114.1732],
};

const getMatchCount = (restaurant, goal) => {
  if (goal === '增肌') return restaurant.dishes.filter(d => d.protein > 20).length;
  if (goal === '減脂') return restaurant.dishes.filter(d => d.fat < 10).length;
  return restaurant.dishes.length;
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
const createMarkerIcon = (restaurant, isSelected, matchCount, zoom, showName) => {
  const fill = isSelected ? C.primaryDark : C.primary;

  if (zoom < 15) {
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
      <div style="display:inline-flex;align-items:flex-start;gap:5px;pointer-events:none;animation:markerGrow 0.25s ease-out both;">
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

// ── Inline restaurant detail panel ──────────────────────────
function RestaurantDetail({ restaurant, onBack }) {
  const [activeTab, setActiveTab] = useState('增肌');
  const isGain = activeTab === '增肌';
  const sortedDishes = [...restaurant.dishes].sort((a, b) =>
    isGain ? b.protein - a.protein : a.fat - b.fat
  );

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: C.bg, overflow: 'hidden' }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '12px',
        padding: '12px 16px 10px', flexShrink: 0,
        background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${C.border}`,
      }}>
        <div
          onClick={onBack}
          style={{
            width: '32px', height: '32px', borderRadius: '50%',
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
          <div style={{ fontWeight: '700', fontSize: '16px', color: C.primaryDark, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {restaurant.name}
          </div>
          <div style={{ fontSize: '12px', color: C.textLight, marginTop: '1px' }}>
            {restaurant.cuisine} · {restaurant.priceRange}
          </div>
        </div>
      </div>

      {/* Tab selector */}
      <div style={{ display: 'flex', gap: '8px', padding: '10px 14px 8px', flexShrink: 0, background: 'rgba(255,255,255,0.85)' }}>
        {['增肌', '減脂'].map(tab => (
          <div
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              flex: 1, textAlign: 'center', padding: '8px 0', borderRadius: '12px',
              cursor: 'pointer', fontSize: '13px',
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

      {/* Dish list */}
      <div className="hide-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '8px 12px 12px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {sortedDishes.map(dish => {
            const highlight = isGain ? dish.protein > 20 : dish.fat < 10;
            return (
              <div
                key={dish.id}
                style={{
                  borderRadius: '14px', padding: '10px 12px',
                  background: highlight ? 'rgba(107,144,128,0.09)' : 'rgba(255,255,255,0.9)',
                  border: `1.5px solid ${highlight ? C.primaryTint : 'transparent'}`,
                  backdropFilter: 'blur(8px)',
                  display: 'flex', gap: '10px', alignItems: 'center',
                }}
              >
                {/* Dish image placeholder */}
                <div style={{
                  width: '48px', height: '48px', borderRadius: '10px', flexShrink: 0,
                  background: `linear-gradient(135deg, ${C.primaryTint}, ${C.bgTint})`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '18px', fontWeight: '700', color: C.primary,
                }}>
                  {dish.name[0]}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: '600', fontSize: '13px', color: C.textDark, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '58%' }}>
                      {dish.name}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexShrink: 0 }}>
                      {highlight && (
                        <span style={{ fontSize: '10px', fontWeight: '600', color: 'white', background: C.accent, borderRadius: '8px', padding: '2px 6px' }}>
                          {isGain ? '高蛋白' : '低脂'}
                        </span>
                      )}
                      <span style={{ fontSize: '13px', fontWeight: '600', color: C.accent }}>${dish.price}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
                    {[['蛋白', dish.protein + 'g', C.primary], ['脂肪', dish.fat + 'g', C.accent], ['碳水', dish.carbs + 'g', C.textLight]].map(([l, v, c]) => (
                      <span key={l} style={{ fontSize: '11px', color: C.textLight }}>
                        <span style={{ fontWeight: '600', color: c }}>{v}</span> {l}
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
  const [detailId,     setDetailId]     = useState(null);  // controls slide transform
  const [displayId,    setDisplayId]    = useState(null);  // keeps content during slide-out

  const panelRef    = useRef(null);
  const dragStartY  = useRef(null);
  const dragStartH  = useRef(null);
  const isDragging  = useRef(false);
  const mapRef      = useRef(null);
  const detailTimer = useRef(null);

  const handleScroll = () => {
    const el = panelRef.current;
    if (!el) return;
    const { scrollHeight, clientHeight, scrollTop } = el;
    if (scrollHeight <= clientHeight) { setScrollThumb(s => ({ ...s, visible: false })); return; }
    const thumbH = Math.max(32, (clientHeight / scrollHeight) * clientHeight);
    const thumbT = (scrollTop / (scrollHeight - clientHeight)) * (clientHeight - thumbH);
    setScrollThumb({ top: thumbT, height: thumbH, visible: true });
  };

  const rawList     = searchQuery ? searchRestaurants(searchQuery) : getAllRestaurants();
  const restaurants = sortRestaurants(rawList, activeFilter, userGoal);

  // Progressive name display: more names appear as zoom increases, ordered by match count
  const allByMatch  = [...getAllRestaurants()].sort((a, b) => getMatchCount(b, userGoal) - getMatchCount(a, userGoal));
  const nameLimit   = mapZoom >= 16 ? allByMatch.length : mapZoom >= 15 ? 3 : 0;
  const showNameIds = new Set(allByMatch.slice(0, nameLimit).map(r => r.id));

  const flyToRestaurant = (id) => {
    const coords = RESTAURANT_COORDS[id];
    if (coords && mapRef.current) {
      mapRef.current.flyTo(coords, Math.max(mapRef.current.getZoom(), 16), { duration: 0.8 });
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
    const maxH  = window.innerHeight - BOTTOM_NAV_H - 16;
    setPanelHeight(Math.max(120, Math.min(maxH, dragStartH.current + delta)));
  };
  const handleDragEnd = () => {
    isDragging.current = false;
    const minH = window.innerHeight * 0.45;
    const maxH = window.innerHeight - BOTTOM_NAV_H - 16;
    setPanelHeight(panelHeight > (minH + maxH) / 2 ? maxH : minH);
    dragStartY.current = null;
  };

  const handleMarkerClick = (id) => {
    setSelectedId(id);
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
    setDisplayId(id);
    setDetailId(id);
    flyToRestaurant(id);
  };

  const handleBackFromDetail = () => {
    setDetailId(null);
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
              icon={createMarkerIcon(r, selectedId === r.id, getMatchCount(r, userGoal), mapZoom, showNameIds.has(r.id))}
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

                            {/* Image placeholder */}
                            <div style={{
                              width: '64px', height: '64px', borderRadius: '12px', flexShrink: 0,
                              background: `linear-gradient(135deg, ${C.primaryTint}, ${C.bgTint})`,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: '22px', fontWeight: '700', color: C.primary,
                            }}>
                              {r.name[0]}
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

                              {/* Row 2: cuisine · price */}
                              <div style={{ fontSize: '12px', color: C.textLight, marginTop: '3px' }}>
                                {r.cuisine} · {r.priceRange}
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
