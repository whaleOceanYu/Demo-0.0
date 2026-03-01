import { TabBar } from 'antd-mobile';
import { useNavigate, useLocation } from 'react-router-dom';

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { key: '/map', title: '地圖' },
    { key: '/profile', title: '個人' },
  ];

  const currentPath = location.pathname;

  return (
    <TabBar
      activeKey={currentPath}
      onChange={key => navigate(key)}
      style={{ 
        borderTop: '1px solid #f0eef5',
        backgroundColor: 'transparent',
        '--adm-color-primary': '#7b68aa',
      }}
    >
      {tabs.map(item => (
        <TabBar.Item 
          key={item.key} 
          title={item.title}
          style={{ 
            color: currentPath === item.key ? '#7b68aa' : '#8a9bb5',
            fontSize: '16px', // 增大字体
            fontWeight: currentPath === item.key ? '600' : '400',
            padding: '12px 0' // 增加垂直内边距，使触控区域更大
          }}
        />
      ))}
    </TabBar>
  );
}