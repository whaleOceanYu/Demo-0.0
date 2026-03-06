import { TabBar } from 'antd-mobile';
import { useNavigate, useLocation } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { C } from '../../constants/colors';

const TABS = [
  {
    key: ROUTES.MAP,
    title: '地圖',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" style={{ display: 'block' }}>
        <path
          d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
          fill={active ? C.primary : 'none'}
          stroke={active ? C.primary : C.textLight}
          strokeWidth="1.8"
        />
        <circle cx="12" cy="9" r="2.5" fill={active ? 'white' : C.textLight} />
      </svg>
    ),
  },
  {
    key: ROUTES.FRIENDS,
    title: '好友',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" style={{ display: 'block' }}>
        <circle cx="9" cy="8" r="3.2"
          fill={active ? C.primary : 'none'}
          stroke={active ? C.primary : C.textLight}
          strokeWidth="1.8"
        />
        <path d="M2 20c0-3.5 3.13-6 7-6s7 2.5 7 6"
          stroke={active ? C.primary : C.textLight}
          strokeWidth="1.8" strokeLinecap="round"
        />
        <path d="M16 6c1.66 0 3 1.34 3 3s-1.34 3-3 3"
          stroke={active ? C.primary : C.textLight}
          strokeWidth="1.8" strokeLinecap="round"
        />
        <path d="M19 20c0-2.5 1.5-4.5 3-5.5"
          stroke={active ? C.primary : C.textLight}
          strokeWidth="1.8" strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    key: ROUTES.PROFILE,
    title: '個人檔案',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" style={{ display: 'block' }}>
        <circle
          cx="12" cy="8" r="4"
          fill={active ? C.primary : 'none'}
          stroke={active ? C.primary : C.textLight}
          strokeWidth="1.8"
        />
        <path
          d="M4 20c0-4 3.58-7 8-7s8 3 8 7"
          stroke={active ? C.primary : C.textLight}
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];

// BottomNav 自帶定位與樣式，兩個頁面直接使用，確保視覺完全一致
export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div style={{
      position: 'fixed',
      bottom: 0, left: 0, right: 0,
      maxWidth: '450px',
      margin: '0 auto',
      zIndex: 2000,
      background: 'rgba(255,255,255,0.92)',
      backdropFilter: 'blur(14px)',
      borderTop: `1px solid ${C.border}`,
      borderRadius: '20px 20px 0 0',
      boxShadow: '0 -2px 16px rgba(74,88,130,0.08)',
    }}>
      <TabBar
        activeKey={location.pathname}
        onChange={key => navigate(key)}
        style={{ '--adm-color-primary': C.primary, backgroundColor: 'transparent' }}
      >
        {TABS.map(tab => {
          const active = location.pathname === tab.key;
          return (
            <TabBar.Item
              key={tab.key}
              icon={tab.icon(active)}
              title={
                <span style={{
                  fontSize: '12px',
                  fontWeight: active ? '600' : '400',
                  color: active ? C.primary : C.textLight,
                }}>
                  {tab.title}
                </span>
              }
            />
          );
        })}
      </TabBar>
    </div>
  );
}
