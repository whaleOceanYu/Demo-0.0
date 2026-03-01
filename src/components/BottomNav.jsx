import { TabBar } from 'antd-mobile';
import { useNavigate, useLocation } from 'react-router-dom';

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { key: '/map', title: '地圖' },
    { key: '/profile', title: '個人檔案' },
  ];

  const currentPath = location.pathname;

  return (
    <TabBar
      activeKey={currentPath}
      onChange={key => navigate(key)}
      style={{ 
        borderTop: '1px solid #f0eef5',
        backgroundColor: 'rgba(255,255,255,0.8)',
        backdropFilter: 'blur(10px)',
        '--adm-color-primary': '#7b68aa',
      }}
    >
      {tabs.map(item => (
        <TabBar.Item 
          key={item.key} 
          title={item.title}
          style={{ 
            fontSize: '30px',
            fontWeight: currentPath === item.key ? '700' : '500',
            color: currentPath === item.key ? '#7b68aa' : '#8a9bb5'
          }}
        />
      ))}
    </TabBar>
  );
}