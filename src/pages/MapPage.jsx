import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchBar, Card, Tag, ProgressBar, Grid } from 'antd-mobile';
import { HeartOutline } from 'antd-mobile-icons';
import BottomNav from '../components/BottomNav';
import { restaurants } from '../data';

export default function MapPage() {
  const navigate = useNavigate();
  const [showMarkers, setShowMarkers] = useState(true); // 控制标记显示

  // 模拟餐厅坐标（相对于地图容器的百分比位置）
  const markerPositions = [
    { top: '30%', left: '40%', id: 1 },
    { top: '50%', left: '60%', id: 2 },
    { top: '70%', left: '30%', id: 3 },
    { top: '40%', left: '70%', id: 4 },
    { top: '60%', left: '20%', id: 5 },
  ];

  return (
    <div style={{ maxWidth: '450px', margin: '0 auto', paddingBottom: '60px', background: '#f8f9ff' }}>
      {/* 顶部搜索栏 */}
      <div style={{ padding: '16px 16px 8px' }}>
        <SearchBar 
          placeholder='搜尋區域或餐廳名稱⋯' 
          showCancelButton={() => false}
          style={{ 
            '--background': 'rgba(255,255,255,0.9)',
            '--border-radius': '30px',
            '--height': '44px',
            '--font-size': '16px',
            backdropFilter: 'blur(10px)'
          }}
        />
      </div>

      {/* 筛选标签 */}
      <div style={{ padding: '0 16px 12px', display: 'flex', gap: '10px' }}>
        {['距離', '價格', '營養'].map(label => (
          <Tag 
            key={label}
            color='rgba(230, 227, 240, 0.8)' 
            style={{ 
              color: '#5b4b8a', 
              borderRadius: '20px', 
              padding: '6px 16px',
              fontSize: '14px',
              border: 'none',
              backdropFilter: 'blur(5px)'
            }}
          >{label}</Tag>
        ))}
      </div>

      {/* 地图区域（可点击） */}
      <div 
        style={{ 
          position: 'relative',
          height: '200px', 
          margin: '0 16px 16px',
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          cursor: 'pointer'
        }}
        onClick={() => setShowMarkers(!showMarkers)} // 点击切换标记显示（模拟交互）
      >
        <img
          src='/images/map-placeholder.jpg'
          alt='地圖'
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={(e) => {
            e.target.src = 'https://picsum.photos/400/200?random=99';
          }}
        />
        {/* 餐厅标记（绝对定位） */}
        {showMarkers && markerPositions.map(marker => (
          <div
            key={marker.id}
            onClick={(e) => {
              e.stopPropagation(); // 防止触发父级点击
              navigate(`/menu/${marker.id}`);
            }}
            style={{
              position: 'absolute',
              top: marker.top,
              left: marker.left,
              width: '30px',
              height: '30px',
              background: 'rgba(123, 104, 170, 0.8)',
              borderRadius: '50%',
              border: '2px solid white',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              cursor: 'pointer',
              transform: 'translate(-50%, -50%)',
              backdropFilter: 'blur(2px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '12px',
              fontWeight: 'bold'
            }}
          >
            {marker.id}
          </div>
        ))}
        {/* 轻提示 */}
        <div style={{ position: 'absolute', bottom: '8px', right: '12px', background: 'rgba(255,255,255,0.7)', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', color: '#5b4b8a', backdropFilter: 'blur(5px)' }}>
          點擊地圖切換標記
        </div>
      </div>

      {/* 餐厅列表（悬浮卡片区域） */}
      <div style={{ padding: '0 16px' }}>
        <h3 style={{ fontSize: '18px', marginBottom: '12px', color: '#5b4b8a' }}>附近餐廳</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {restaurants.map((r) => (
            <Card
              key={r.id}
              onClick={() => navigate(`/menu/${r.id}`)}
              style={{ 
                cursor: 'pointer', 
                borderRadius: '20px',
                padding: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                background: 'rgba(255,255,255,0.8)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <Grid columns={3} gap={8}>
                <Grid.Item span={1}>
                  <img
                    src={r.image}
                    alt={r.name}
                    style={{ 
                      width: '100%', 
                      height: '80px', 
                      objectFit: 'cover', 
                      borderRadius: '16px' 
                    }}
                  />
                </Grid.Item>
                <Grid.Item span={2}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ fontSize: '16px', color: '#2d3a4b' }}>{r.name}</strong>
                    <HeartOutline style={{ fontSize: '18px', color: '#d4c4fb' }} />
                  </div>
                  <div style={{ fontSize: '14px', color: '#8a9bb5', marginTop: '4px' }}>
                    {r.cuisine} · {r.priceRange}
                  </div>
                  <div style={{ marginTop: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                      <span style={{ color: '#5b4b8a' }}>匹配度</span>
                      <span style={{ color: '#5b4b8a', fontWeight: '600' }}>{r.matchScore}%</span>
                    </div>
                    <ProgressBar 
                      percent={r.matchScore} 
                      style={{ 
                        '--track-width': '6px',
                        '--fill-color': '#9b8bc6'
                      }} 
                    />
                  </div>
                </Grid.Item>
              </Grid>
            </Card>
          ))}
        </div>
      </div>

      {/* 底部导航 */}
      <div style={{ 
        position: 'fixed', 
        bottom: 0, 
        left: 0, 
        right: 0, 
        maxWidth: '450px', 
        margin: '0 auto', 
        background: 'rgba(255,255,255,0.8)',
        backdropFilter: 'blur(10px)',
        borderTop: '1px solid #f0eef5',
        borderRadius: '20px 20px 0 0',
        boxShadow: '0 -2px 10px rgba(0,0,0,0.03)'
      }}>
        <BottomNav />
      </div>
    </div>
  );
}