import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { mockSignup } from '../services/userService';
import { ROUTES } from '../constants/routes';
import { C } from '../constants/colors';

const HEALTH_GOALS = ['增肌', '減脂', '保持體重'];

const DIETARY_OPTIONS = [
  { label: '素食',     value: '素食'     },
  { label: '純素',     value: '純素'     },
  { label: '無麩質',   value: '無麩質'   },
  { label: '無乳糖',   value: '無乳糖'   },
  { label: '低鈉',     value: '低鈉'     },
  { label: '低糖',     value: '低糖'     },
  { label: '高纖維',   value: '高纖維'   },
  { label: '堅果過敏', value: '堅果過敏' },
];

// Section header with left accent bar
const SectionLabel = ({ children }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '9px', marginBottom: '18px', marginTop: '28px' }}>
    <div style={{ width: '3px', height: '18px', borderRadius: '2px', background: C.primary, flexShrink: 0 }} />
    <span style={{ fontSize: '13px', fontWeight: '700', color: C.primaryDark, letterSpacing: '0.04em' }}>
      {children}
    </span>
  </div>
);

// Field label sitting above input
const FieldLabel = ({ children }) => (
  <div style={{ fontSize: '12px', fontWeight: '600', color: C.textLight, letterSpacing: '0.03em', marginBottom: '7px', marginTop: '14px' }}>
    {children}
  </div>
);

// Rounded pill input
const PillInput = ({ type = 'text', placeholder, value, onChange }) => (
  <input
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={e => onChange(e.target.value)}
    style={{
      width: '100%', boxSizing: 'border-box',
      background: C.bgTint, border: 'none', outline: 'none',
      borderRadius: '14px', padding: '13px 16px',
      fontSize: '15px', color: C.textDark,
      fontFamily: 'inherit',
    }}
  />
);

export default function Signup() {
  const navigate = useNavigate();
  const { login } = useUser();

  const [form, setForm] = useState({
    name: '', email: '', password: '', goal: '增肌',
    targetWeight: '', age: '', height: '', weight: '',
    dietary: [],
  });
  const [error, setError] = useState('');

  const set = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const toggleDietary = (val) => {
    setForm(prev => ({
      ...prev,
      dietary: prev.dietary.includes(val)
        ? prev.dietary.filter(v => v !== val)
        : [...prev.dietary, val],
    }));
  };

  const handleSignup = () => {
    const result = mockSignup(form);
    if (result.success) { login(result.user); navigate(ROUTES.MAP); }
    else setError(result.error);
  };

  return (
    <div className="hide-scrollbar" style={{
      maxWidth: '450px', margin: '0 auto', height: '100dvh', overflowY: 'auto',
      background: `linear-gradient(160deg, ${C.bg} 0%, ${C.bgTint} 100%)`,
      padding: '40px 20px 56px',
    }}>

      {/* 標題 */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{ fontSize: '28px', fontWeight: '700', color: C.primaryDark, lineHeight: 1.15 }}>
          建立你的檔案
        </div>
        <div style={{ fontSize: '14px', color: C.textLight, marginTop: '8px', lineHeight: 1.6 }}>
          幫助我們為你推薦最適合的餐廳
        </div>
      </div>

      {/* 卡片 */}
      <div style={{
        background: 'rgba(255,255,255,0.92)', borderRadius: '28px',
        padding: '24px 20px 28px', backdropFilter: 'blur(12px)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
      }}>

        {/* ── 帳戶信息 ── */}
        <SectionLabel>帳戶信息</SectionLabel>

        <FieldLabel>姓名</FieldLabel>
        <PillInput placeholder="請輸入姓名" value={form.name} onChange={v => set('name', v)} />

        <FieldLabel>電郵</FieldLabel>
        <PillInput type="email" placeholder="請輸入電郵" value={form.email} onChange={v => set('email', v)} />

        <FieldLabel>密碼</FieldLabel>
        <PillInput type="password" placeholder="至少 6 位字符" value={form.password} onChange={v => set('password', v)} />

        {/* ── 健身目標 ── */}
        <SectionLabel>健身目標</SectionLabel>

        <div style={{ display: 'flex', gap: '10px' }}>
          {HEALTH_GOALS.map(g => (
            <div
              key={g}
              onClick={() => set('goal', g)}
              style={{
                flex: 1, textAlign: 'center', padding: '12px 6px',
                borderRadius: '14px', cursor: 'pointer',
                background: form.goal === g ? C.primary : C.bgTint,
                color: form.goal === g ? 'white' : C.textLight,
                fontSize: '14px', fontWeight: form.goal === g ? '600' : '400',
                transition: 'all 0.15s',
              }}
            >
              {g}
            </div>
          ))}
        </div>

        <FieldLabel>目標體重 (kg)（可選）</FieldLabel>
        <PillInput type="number" placeholder="例如 70" value={form.targetWeight} onChange={v => set('targetWeight', v)} />

        {/* ── 身體數據 ── */}
        <SectionLabel>身體數據</SectionLabel>

        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ flex: 1 }}>
            <FieldLabel>年齡</FieldLabel>
            <PillInput type="number" placeholder="25" value={form.age} onChange={v => set('age', v)} />
          </div>
          <div style={{ flex: 1 }}>
            <FieldLabel>身高 (cm)</FieldLabel>
            <PillInput type="number" placeholder="168" value={form.height} onChange={v => set('height', v)} />
          </div>
          <div style={{ flex: 1 }}>
            <FieldLabel>體重 (kg)</FieldLabel>
            <PillInput type="number" placeholder="65" value={form.weight} onChange={v => set('weight', v)} />
          </div>
        </div>

        {/* ── 飲食需求 ── */}
        <SectionLabel>特定飲食需求</SectionLabel>
        <div style={{ fontSize: '12px', color: C.textLight, marginTop: '-10px', marginBottom: '14px' }}>
          可多選，我們會優先推薦符合你需求的餐廳
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {DIETARY_OPTIONS.map(opt => {
            const active = form.dietary.includes(opt.value);
            return (
              <div
                key={opt.value}
                onClick={() => toggleDietary(opt.value)}
                style={{
                  padding: '7px 16px', borderRadius: '20px', cursor: 'pointer',
                  fontSize: '13px', fontWeight: active ? '600' : '400',
                  background: active ? C.primary : C.bgTint,
                  color: active ? 'white' : C.textLight,
                  transition: 'all 0.15s',
                }}
              >
                {opt.label}
              </div>
            );
          })}
        </div>

        {/* 錯誤提示 */}
        {error && (
          <div style={{ color: '#B85C4A', fontSize: '13px', textAlign: 'center',
            marginTop: '18px', padding: '10px 14px', background: '#FDF0EE', borderRadius: '12px' }}>
            {error}
          </div>
        )}

        {/* 提交按鈕 */}
        <div
          onClick={handleSignup}
          style={{
            marginTop: '28px', width: '100%', padding: '15px',
            background: C.primary, color: 'white', borderRadius: '16px',
            textAlign: 'center', fontSize: '16px', fontWeight: '600',
            cursor: 'pointer', letterSpacing: '0.02em',
            boxShadow: `0 4px 18px rgba(107,144,128,0.35)`,
          }}
        >
          完成設置，開始使用
        </div>

        <div style={{ marginTop: '18px', textAlign: 'center' }}>
          <span style={{ fontSize: '13px', color: C.textLight }}>已有帳戶？</span>
          <span
            onClick={() => navigate(ROUTES.LOGIN)}
            style={{ fontSize: '13px', color: C.primary, fontWeight: '600', cursor: 'pointer', marginLeft: '4px' }}
          >
            登入
          </span>
        </div>
      </div>
    </div>
  );
}
