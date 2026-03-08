// src/components/ui/AddFoodSheet.jsx

import { useState, useRef } from 'react';
import { getAllRestaurants, searchRestaurants } from '../../services/restaurantService';
import { C } from '../../constants/colors';

// ── "點心" → "加餐" ──────────────────────────────────────────
const MEAL_TIMES = ['早餐', '午餐', '晚餐', '加餐'];

const autoMealTime = () => {
  const h = new Date().getHours();
  if (h < 10) return '早餐';
  if (h < 15) return '午餐';
  if (h < 18) return '加餐';
  return '晚餐';
};

const calcKcal = (p, f, c) =>
  Math.round(Number(p || 0) * 4 + Number(f || 0) * 9 + Number(c || 0) * 4);

// ── AI 估算（DashScope / Qwen，name 必填，photoSrc 可選）────
async function analyzeFood(name, photoSrc) {
  const prompt = `估算「${name}」每份（約一人份）的蛋白質、脂肪、碳水化合物。${photoSrc ? '請結合圖片中的食物判斷份量。' : ''}只返回 JSON，不含其他文字，格式：{"protein":整數,"fat":整數,"carbs":整數}`;

  // 有圖片：用 qwen3-vl-plus（視覺模型），需數組格式
  // 無圖片：用 qwen-turbo（純文字），接受字符串
  const model   = photoSrc ? 'qwen3-vl-plus' : 'qwen-turbo';
  const content = photoSrc
    ? [{ type: 'image_url', image_url: { url: photoSrc } }, { type: 'text', text: prompt }]
    : prompt;

  const res = await fetch('/api/qwen/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      max_tokens: 128,
      messages: [{ role: 'user', content }],
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `HTTP ${res.status}`);
  }
  const data = await res.json();
  const messageContent = data.choices?.[0]?.message?.content;
  const text = Array.isArray(messageContent)
    ? messageContent.map(p => (typeof p === 'string' ? p : p?.text || '')).join('\n')
    : String(messageContent ?? '');
  // 提取 JSON（模型可能用 markdown 代碼塊包裹）
  const match = text.match(/\{[\s\S]*?\}/);
  if (!match) throw new Error(`回應格式異常：${text.slice(0, 80)}`);
  return JSON.parse(match[0]);
}

// ── 共用樣式 ─────────────────────────────────────────────────
const pill = {
  background: 'rgba(255,255,255,0.93)',
  backdropFilter: 'blur(12px)',
  borderRadius: '16px',
  boxShadow: '0 2px 10px rgba(62,104,84,0.10)',
  border: `1.5px solid rgba(107,144,128,0.18)`,
};

// ── SVG Icons ─────────────────────────────────────────────────
const IconRestaurant = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
    stroke={C.primary} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8h1a4 4 0 0 1 0 8h-1"/>
    <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
    <line x1="6" y1="1" x2="6" y2="4"/>
    <line x1="10" y1="1" x2="10" y2="4"/>
    <line x1="14" y1="1" x2="14" y2="4"/>
  </svg>
);

const IconCamera = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
    stroke={C.accent} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
    <circle cx="12" cy="13" r="4"/>
  </svg>
);

const IconCameraUpload = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none"
    stroke={C.textLight} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
    <circle cx="12" cy="13" r="4"/>
  </svg>
);

// ── NInput ────────────────────────────────────────────────────
const NInput = ({ label, value, onChange, type = 'text', placeholder = '' }) => (
  <div style={{ flex: 1 }}>
    <div style={{ fontSize: '11px', fontWeight: '600', color: C.textLight, marginBottom: '5px', letterSpacing: '0.03em' }}>
      {label}
    </div>
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width: '100%', boxSizing: 'border-box',
        background: C.bgTint, border: 'none', outline: 'none',
        borderRadius: '12px', padding: '11px 12px',
        fontSize: '15px', color: C.textDark, fontFamily: 'inherit',
      }}
    />
  </div>
);

// ── 主組件 ───────────────────────────────────────────────────
export default function AddFoodSheet({ onAdd, onClose }) {
  const [screen,      setScreen]      = useState('main');
  const [mealTime,    setMealTime]    = useState(autoMealTime());
  const [query,       setQuery]       = useState('');
  const [selectedRest, setSelectedRest] = useState(null);
  const [photoSrc,    setPhotoSrc]    = useState(null);
  const [analyzing,   setAnalyzing]   = useState(false);
  const [analyzed,    setAnalyzed]    = useState(false);
  const [aiError,     setAiError]     = useState('');
  const [form,        setForm]        = useState({ name: '', protein: '', fat: '', carbs: '' });
  const fileRef = useRef(null);

  const setF = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  // ── Meal-time selector（只在 dishes / photo 顯示，為必選）──
  const MealTimeRow = () => (
    <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
      {MEAL_TIMES.map(t => (
        <div key={t} onClick={() => setMealTime(t)}
          style={{
            flex: 1, textAlign: 'center', padding: '7px 0', borderRadius: '12px',
            fontSize: '13px', fontWeight: mealTime === t ? '600' : '400',
            background: mealTime === t ? C.primary : C.bgTint,
            color: mealTime === t ? 'white' : C.textLight,
            cursor: 'pointer', transition: 'all 0.15s',
          }}
        >{t}</div>
      ))}
    </div>
  );

  // ── Macro summary ─────────────────────────────────────────
  const MacroRow = ({ protein, fat, carbs }) => {
    const kcal = calcKcal(protein, fat, carbs);
    return (
      <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
        {[
          { label: '熱量',   val: `${kcal} kcal`, color: C.primaryDark },
          { label: '蛋白質', val: `${protein}g`,  color: C.primary },
          { label: '脂肪',   val: `${fat}g`,      color: C.accent },
          { label: '碳水',   val: `${carbs}g`,    color: C.textLight },
        ].map(({ label, val, color }) => (
          <div key={label} style={{ flex: 1, textAlign: 'center', background: C.bgTint, borderRadius: '10px', padding: '8px 4px' }}>
            <div style={{ fontSize: '13px', fontWeight: '700', color }}>{val}</div>
            <div style={{ fontSize: '10px', color: C.textLight, marginTop: '2px' }}>{label}</div>
          </div>
        ))}
      </div>
    );
  };

  // ── Add action ────────────────────────────────────────────
  const handleAdd = ({ name, restaurant, protein, fat, carbs }) => {
    onAdd({
      id: Date.now(),
      meal: mealTime,
      name,
      restaurant: restaurant || '手動輸入',
      kcal: calcKcal(protein, fat, carbs),
      protein: Number(protein),
      fat: Number(fat),
      carbs: Number(carbs),
      checked: true,
    });
    onClose();
  };

  // ── Photo: file select ────────────────────────────────────
  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      setPhotoSrc(ev.target.result);
      setAiError('');
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!form.name.trim()) return;
    setAnalyzing(true);
    setAiError('');
    try {
      const result = await analyzeFood(form.name, photoSrc);
      setForm(prev => ({
        ...prev,
        protein: String(result.protein ?? ''),
        fat:     String(result.fat     ?? ''),
        carbs:   String(result.carbs   ?? ''),
      }));
      setAnalyzed(true);
    } catch (err) {
      const msg = String(err?.message || '');
      if (msg.includes('Incorrect API key provided')) {
        setAiError('估算失敗：DashScope API Key 無效，請檢查 Key 與 DASHSCOPE_BASE_URL 區域是否一致');
      } else {
        setAiError(`估算失敗：${msg}`);
      }
    } finally {
      setAnalyzing(false);
    }
  };

  const restaurants = query ? searchRestaurants(query) : getAllRestaurants();

  // ═════════════════════════════════════════════════════════
  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 3000,
      background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(4px)',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        position: 'absolute', bottom: 0, left: '50%',
        transform: 'translateX(-50%)',
        width: '100%', maxWidth: '450px', maxHeight: '90dvh',
        background: C.bg, borderRadius: '24px 24px 0 0',
        boxShadow: '0 -4px 32px rgba(0,0,0,0.15)',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}>

        {/* ── Header ── */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: '12px 14px 10px',
          background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(12px)',
          borderBottom: `1px solid ${C.border}`, flexShrink: 0,
        }}>
          {screen !== 'main' && (
            <div
              onClick={() => {
                if (screen === 'dishes') { setScreen('restaurants'); setSelectedRest(null); }
                else { setScreen('main'); setPhotoSrc(null); setAiError(''); setAnalyzed(false); setForm({ name: '', protein: '', fat: '', carbs: '' }); }
              }}
              style={{
                width: '32px', height: '32px', borderRadius: '50%',
                background: C.bgTint, border: `1px solid ${C.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', flexShrink: 0,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke={C.primaryDark} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </div>
          )}
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: '700', fontSize: '16px', color: C.primaryDark }}>
              {screen === 'main'        && '添加食物'}
              {screen === 'restaurants' && '選擇餐廳'}
              {screen === 'dishes'      && (selectedRest?.name || '選擇菜式')}
              {screen === 'photo'       && '手動輸入 / 拍照'}
            </div>
          </div>
          <div onClick={onClose} style={{
            width: '32px', height: '32px', borderRadius: '50%',
            background: C.bgTint, border: `1px solid ${C.border}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', fontSize: '16px', color: C.textLight, flexShrink: 0,
          }}>✕</div>
        </div>

        {/* ── Content ── */}
        <div className="hide-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '12px 14px' }}>

          {/* ── MAIN ── */}
          {screen === 'main' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingTop: '4px' }}>
              <div onClick={() => setScreen('restaurants')} style={{
                ...pill, padding: '20px 18px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '16px',
              }}>
                <div style={{
                  width: '46px', height: '46px', borderRadius: '14px', flexShrink: 0,
                  background: `rgba(107,144,128,0.12)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <IconRestaurant />
                </div>
                <div>
                  <div style={{ fontWeight: '700', fontSize: '15px', color: C.primaryDark }}>從餐廳選擇</div>
                  <div style={{ fontSize: '12px', color: C.textLight, marginTop: '3px' }}>
                    先選擇餐廳，再選擇菜式
                  </div>
                </div>
              </div>

              <div onClick={() => setScreen('photo')} style={{
                ...pill, padding: '20px 18px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '16px',
              }}>
                <div style={{
                  width: '46px', height: '46px', borderRadius: '14px', flexShrink: 0,
                  background: `rgba(184,92,74,0.10)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <IconCamera />
                </div>
                <div>
                  <div style={{ fontWeight: '700', fontSize: '15px', color: C.primaryDark }}>手動輸入 / 拍照</div>
                  <div style={{ fontSize: '12px', color: C.textLight, marginTop: '3px' }}>
                    上傳照片由 AI 識別，或直接填寫
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── RESTAURANTS（不顯示用餐時段）── */}
          {screen === 'restaurants' && (
            <>
              <input
                placeholder="搜尋餐廳名稱或菜系⋯"
                value={query}
                onChange={e => setQuery(e.target.value)}
                style={{
                  width: '100%', boxSizing: 'border-box',
                  background: 'rgba(255,255,255,0.93)', border: 'none', outline: 'none',
                  borderRadius: '14px', padding: '11px 14px',
                  fontSize: '14px', color: C.textDark, fontFamily: 'inherit',
                  boxShadow: '0 2px 10px rgba(62,104,84,0.10)',
                  marginBottom: '12px',
                }}
              />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {restaurants.map(r => (
                  <div key={r.id}
                    onClick={() => { setSelectedRest(r); setScreen('dishes'); }}
                    style={{ ...pill, padding: '12px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}
                  >
                    <div style={{
                      width: '40px', height: '40px', borderRadius: '10px', flexShrink: 0,
                      background: `linear-gradient(135deg, ${C.primaryTint}, ${C.bgTint})`,
                      overflow: 'hidden',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {r.image
                        ? <img src={r.image} alt={r.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : <span style={{ fontSize: '16px', fontWeight: '700', color: C.primary }}>{r.name[0]}</span>
                      }
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: '600', fontSize: '14px', color: C.primaryDark, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {r.name}
                      </div>
                      <div style={{ fontSize: '12px', color: C.textLight, marginTop: '2px' }}>
                        {r.dishes.length} 道菜
                      </div>
                    </div>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                      stroke={C.textLight} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ── DISHES（用餐時段必選）── */}
          {screen === 'dishes' && selectedRest && (
            <>
              <MealTimeRow />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {selectedRest.dishes.map(dish => {
                  const kcal = calcKcal(dish.protein, dish.fat, dish.carbs);
                  return (
                    <div key={dish.id} style={{ ...pill, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: '600', fontSize: '14px', color: C.primaryDark }}>
                          {dish.name}
                        </div>
                        <div style={{ display: 'flex', gap: '10px', marginTop: '5px', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '11px', color: C.textLight }}>
                            <span style={{ fontWeight: '600', color: C.primaryDark }}>{kcal}</span> kcal
                          </span>
                          <span style={{ fontSize: '11px', color: C.textLight }}>
                            <span style={{ fontWeight: '600', color: C.primary }}>{dish.protein}g</span> 蛋白質
                          </span>
                          <span style={{ fontSize: '11px', color: C.textLight }}>
                            <span style={{ fontWeight: '600', color: C.accent }}>{dish.fat}g</span> 脂肪
                          </span>
                          <span style={{ fontSize: '11px', color: C.textLight }}>
                            <span style={{ fontWeight: '600', color: C.textLight }}>{dish.carbs}g</span> 碳水
                          </span>
                        </div>
                      </div>
                      <div style={{ fontSize: '12px', color: C.textLight, flexShrink: 0, marginRight: '4px' }}>
                        ${dish.price}
                      </div>
                      <div
                        onClick={() => handleAdd({ name: dish.name, restaurant: selectedRest.name, protein: dish.protein, fat: dish.fat, carbs: dish.carbs })}
                        style={{
                          flexShrink: 0, padding: '6px 14px', borderRadius: '20px',
                          background: C.primary, color: 'white',
                          fontSize: '13px', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap',
                        }}
                      >
                        + 添加
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* ── PHOTO / MANUAL ── */}
          {screen === 'photo' && (
            <>
              <MealTimeRow />

              {/* 食物名稱 — 必填 */}
              <NInput
                label="食物名稱（必填）"
                value={form.name}
                onChange={v => { setF('name', v); setAnalyzed(false); }}
                placeholder="例如：雞胸肉飯"
              />

              {/* 照片 — 選填 */}
              <div style={{ marginTop: '12px' }}>
                <div style={{ fontSize: '11px', fontWeight: '600', color: C.textLight, marginBottom: '6px', letterSpacing: '0.03em' }}>
                  食物照片（選填）
                  <span style={{ fontWeight: '400', marginLeft: '6px', color: C.primary }}>添加照片可提高估算精度</span>
                </div>
                <div onClick={() => fileRef.current?.click()} style={{
                  borderRadius: '14px', border: `1.5px dashed ${C.border}`,
                  padding: photoSrc ? '8px 12px' : '14px 12px',
                  cursor: 'pointer', background: C.bgTint, overflow: 'hidden',
                  display: 'flex', alignItems: 'center', gap: '10px',
                }}>
                  {photoSrc ? (
                    <>
                      <img src={photoSrc} alt="食物照片"
                        style={{ width: '52px', height: '52px', borderRadius: '10px', objectFit: 'cover', flexShrink: 0 }} />
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: '600', color: C.primaryDark }}>已選擇照片</div>
                        <div style={{ fontSize: '11px', color: C.textLight, marginTop: '2px' }}>點此重新選擇</div>
                      </div>
                    </>
                  ) : (
                    <>
                      <IconCameraUpload />
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: '600', color: C.textLight }}>點此上傳照片</div>
                        <div style={{ fontSize: '11px', color: C.textLight, marginTop: '2px' }}>支持 JPG / PNG</div>
                      </div>
                    </>
                  )}
                </div>
                <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
              </div>

              {/* AI 估算按鈕 */}
              <div
                onClick={form.name.trim() && !analyzing ? handleAnalyze : undefined}
                style={{
                  marginTop: '12px', padding: '11px', borderRadius: '14px', textAlign: 'center',
                  background: form.name.trim() && !analyzing ? C.primaryDark : C.bgTint,
                  color: form.name.trim() && !analyzing ? 'white' : C.textLight,
                  fontSize: '14px', fontWeight: '600',
                  cursor: form.name.trim() && !analyzing ? 'pointer' : 'not-allowed',
                  transition: 'background 0.2s, color 0.2s',
                }}
              >
                {analyzing ? 'AI 估算中⋯' : photoSrc ? 'AI 估算營養（名稱 + 照片）' : 'AI 估算營養（根據名稱）'}
              </div>

              {aiError && (
                <div style={{ background: '#FDF0EE', borderRadius: '10px', padding: '10px 14px', fontSize: '12px', color: '#B85C4A', marginTop: '10px', lineHeight: 1.6 }}>
                  {aiError}
                </div>
              )}

              {/* 估算結果 / 手動填寫 */}
              <div style={{ marginTop: '12px' }}>
                {!analyzed && (
                  <div style={{ fontSize: '11px', fontWeight: '600', color: C.textLight, marginBottom: '6px' }}>
                    或手動填寫營養數據
                  </div>
                )}
                {analyzed && (
                  <>
                    <MacroRow protein={form.protein || 0} fat={form.fat || 0} carbs={form.carbs || 0} />
                    <div style={{ fontSize: '11px', color: C.textLight, margin: '8px 0 6px' }}>以下數據可手動調整</div>
                  </>
                )}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <NInput label="蛋白質 (g)" type="number" value={form.protein} onChange={v => setF('protein', v)} placeholder="0" />
                  <NInput label="脂肪 (g)"   type="number" value={form.fat}     onChange={v => setF('fat',     v)} placeholder="0" />
                  <NInput label="碳水 (g)"   type="number" value={form.carbs}   onChange={v => setF('carbs',   v)} placeholder="0" />
                </div>
                {!analyzed && (form.protein || form.fat || form.carbs) && (
                  <MacroRow protein={form.protein || 0} fat={form.fat || 0} carbs={form.carbs || 0} />
                )}
              </div>

              <div
                onClick={() => {
                  if (!form.name.trim()) return;
                  handleAdd({ name: form.name, restaurant: '手動輸入', protein: form.protein || 0, fat: form.fat || 0, carbs: form.carbs || 0 });
                }}
                style={{
                  marginTop: '16px', padding: '14px', borderRadius: '16px', textAlign: 'center',
                  background: form.name.trim() ? C.primary : C.bgTint,
                  color: form.name.trim() ? 'white' : C.textLight,
                  fontSize: '15px', fontWeight: '600',
                  cursor: form.name.trim() ? 'pointer' : 'not-allowed',
                  transition: 'background 0.2s, color 0.2s',
                  boxShadow: form.name.trim() ? `0 4px 16px rgba(107,144,128,0.30)` : 'none',
                  marginBottom: '8px',
                }}
              >
                確認添加到{mealTime}記錄
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
