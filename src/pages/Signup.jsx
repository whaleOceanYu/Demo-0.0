import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from 'antd-mobile';
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

const Label = ({ children }) => (
  <div style={{ fontSize: '12px', fontWeight: '500', color: C.textLight,
    letterSpacing: '0.04em', marginBottom: '7px', marginTop: '12px' }}>
    {children}
  </div>
);

const inputStyle = {
  '--background': C.bgTint,
  '--border-radius': '12px',
  '--height': '44px',
  '--font-size': '15px',
  '--color': C.textDark,
  '--placeholder-color': C.textLight,
  '--border-bottom': 'none',
  padding: '0 14px',
  borderRadius: '12px',
  background: C.bgTint,
  border: 'none',
  outline: 'none',
};

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
    <div style={{
      maxWidth: '450px', margin: '0 auto', minHeight: '100dvh',
      background: `linear-gradient(160deg, ${C.bg} 0%, ${C.bgTint} 100%)`,
      padding: '32px 20px 48px',
    }}>

      {/* 標題 */}
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <div style={{ fontSize: '26px', fontWeight: '700', color: C.primaryDark, lineHeight: 1.2 }}>
          建立你的檔案
        </div>
        <div style={{ fontSize: '14px', color: C.textLight, marginTop: '6px' }}>
          幫助我們為你推薦最適合的餐廳
        </div>
      </div>

      {/* 卡片 */}
      <div style={{
        background: 'rgba(255,255,255,0.9)', borderRadius: '24px',
        padding: '24px 20px', backdropFilter: 'blur(12px)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
      }}>

        {/* ── 帳戶信息 ── */}
        <div style={{ fontSize: '11px', fontWeight: '600', color: C.primary,
          letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '14px' }}>
          帳戶信息
        </div>

        <Label>姓名</Label>
        <Input placeholder="請輸入姓名" value={form.name}
          onChange={v => set('name', v)} style={inputStyle} />

        <Label>電郵</Label>
        <Input placeholder="請輸入電郵" value={form.email}
          onChange={v => set('email', v)} style={inputStyle} />

        <Label>密碼</Label>
        <Input type="password" placeholder="至少 6 位字符" value={form.password}
          onChange={v => set('password', v)} style={inputStyle} />

        {/* ── 健身目標 ── */}
        <div style={{ width: '100%', height: '1px', background: C.border, margin: '22px 0 18px' }} />
        <div style={{ fontSize: '11px', fontWeight: '600', color: C.primary,
          letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '14px' }}>
          健身目標
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          {HEALTH_GOALS.map(g => (
            <div
              key={g}
              onClick={() => set('goal', g)}
              style={{
                flex: 1, textAlign: 'center', padding: '11px 6px',
                borderRadius: '14px', cursor: 'pointer',
                background: form.goal === g ? C.primary : C.bgTint,
                color: form.goal === g ? 'white' : C.textLight,
                fontSize: '14px', fontWeight: form.goal === g ? '600' : '400',
                border: `1.5px solid ${form.goal === g ? C.primary : 'transparent'}`,
                transition: 'all 0.15s',
              }}
            >
              {g}
            </div>
          ))}
        </div>

        <Label>目標體重 (kg)（可選）</Label>
        <Input type="number" placeholder="例如 70" value={form.targetWeight}
          onChange={v => set('targetWeight', v)} style={inputStyle} />

        {/* ── 身體數據 ── */}
        <div style={{ width: '100%', height: '1px', background: C.border, margin: '22px 0 18px' }} />
        <div style={{ fontSize: '11px', fontWeight: '600', color: C.primary,
          letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '14px' }}>
          身體數據
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ flex: 1 }}>
            <Label>年齡</Label>
            <Input type="number" placeholder="25" value={form.age}
              onChange={v => set('age', v)} style={inputStyle} />
          </div>
          <div style={{ flex: 1 }}>
            <Label>身高 (cm)</Label>
            <Input type="number" placeholder="168" value={form.height}
              onChange={v => set('height', v)} style={inputStyle} />
          </div>
          <div style={{ flex: 1 }}>
            <Label>體重 (kg)</Label>
            <Input type="number" placeholder="65" value={form.weight}
              onChange={v => set('weight', v)} style={inputStyle} />
          </div>
        </div>

        {/* ── 飲食需求 ── */}
        <div style={{ width: '100%', height: '1px', background: C.border, margin: '22px 0 18px' }} />
        <div style={{ fontSize: '11px', fontWeight: '600', color: C.primary,
          letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px' }}>
          特定飲食需求
        </div>
        <div style={{ fontSize: '12px', color: C.textLight, marginBottom: '14px' }}>
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
                  padding: '7px 15px', borderRadius: '20px', cursor: 'pointer',
                  fontSize: '13px', fontWeight: active ? '600' : '400',
                  background: active ? C.primary : C.bgTint,
                  color: active ? 'white' : C.textLight,
                  border: `1.5px solid ${active ? C.primary : 'transparent'}`,
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
            marginTop: '16px', padding: '10px', background: '#FDF0EE', borderRadius: '10px' }}>
            {error}
          </div>
        )}

        {/* 提交按鈕 */}
        <div
          onClick={handleSignup}
          style={{
            marginTop: '24px', width: '100%', padding: '14px',
            background: C.primary, color: 'white', borderRadius: '14px',
            textAlign: 'center', fontSize: '16px', fontWeight: '600',
            cursor: 'pointer', letterSpacing: '0.02em',
            boxShadow: `0 4px 16px rgba(107,144,128,0.35)`,
          }}
        >
          完成設置，開始使用
        </div>

        <div style={{ marginTop: '16px', textAlign: 'center' }}>
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
