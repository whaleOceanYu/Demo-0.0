import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { NavBar, Tabs, Card, Tag, Grid } from 'antd-mobile';
import { restaurants } from '../data';

export default function MenuPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const restaurant = restaurants.find(r => r.id === parseInt(id)) || restaurants[0];

  const [activeTab, setActiveTab] = useState('增肌');
  const isGain = activeTab === '增肌';

  // 根据目标排序菜品（增肌按蛋白质降序，减脂按脂肪升序）
  const sortedDishes = [...restaurant.dishes].sort((a, b) => {
    if (isGain) {
      return b.protein - a.protein;
    } else {
      return a.fat - b.fat;
    }
  });

  // 计算营养总量用于比例
  const getTotal = (dish) => dish.protein + dish.fat + dish.carbs;

  return (
    <div style={{ maxWidth: '450px', margin: '0 auto', paddingBottom: '20px', background: '#f8f9ff' }}>
      {/* 餐厅封面图片（模拟） */}
      <div style={{ 
        height: '150px', 
        background: 'linear-gradient(135deg, #9b8bc6, #d4c4fb)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '20px',
        fontWeight: 'bold',
        position: 'relative'
      }}>
        <span>{restaurant.name} 封面</span>
        <span style={{ position: 'absolute', bottom: '8px', right: '12px', fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>【需替换餐厅照片】</span>
      </div>

      <NavBar 
        onBack={() => navigate('/map')}
        style={{ 
          '--border-bottom': 'none',
          background: 'rgba(255,255,255,0.8)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid #f0eef5'
        }}
      >
        <span style={{ color: '#5b4b8a', fontWeight: '600' }}>{restaurant.name}</span>
      </NavBar>

      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab}
        style={{ 
          '--active-line-color': '#9b8bc6',
          '--title-active-text-color': '#5b4b8a',
          background: 'rgba(255,255,255,0.8)',
          backdropFilter: 'blur(10px)',
          paddingTop: '8px'
        }}
      >
        <Tabs.Tab title='🍗 增肌推薦' key='增肌' />
        <Tabs.Tab title='🥗 減脂推薦' key='減脂' />
      </Tabs>

      <div style={{ padding: '16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {sortedDishes.map((dish) => {
            let highlight = false;
            let highlightLabel = '';
            if (isGain && dish.protein > 20) {
              highlight = true;
              highlightLabel = '🏷️ 高蛋白';
            } else if (!isGain && dish.fat < 10) {
              highlight = true;
              highlightLabel = '🏷️ 低脂';
            }

            const total = getTotal(dish);
            const proteinPercent = (dish.protein / total * 100).toFixed(0);
            const fatPercent = (dish.fat / total * 100).toFixed(0);
            const carbsPercent = (dish.carbs / total * 100).toFixed(0);

            return (
              <Card
                key={dish.id}
                style={{
                  backgroundColor: highlight ? 'rgba(243, 235, 255, 0.9)' : 'rgba(255,255,255,0.8)',
                  border: highlight ? '1px solid #9b8bc6' : 'none',
                  borderRadius: '20px',
                  padding: '12px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <Grid columns={12} gap={8}>
                  {/* 左侧图片占位 */}
                  <Grid.Item span={4}>
                    <div style={{
                      width: '100%',
                      paddingBottom: '100%', // 正方形
                      background: '#e6e3f0',
                      borderRadius: '16px',
                      position: 'relative'
                    }}>
                      <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '12px', color: '#8a9bb5' }}>【需替换】</span>
                    </div>
                  </Grid.Item>
                  {/* 右侧信息 */}
                  <Grid.Item span={8}>
                    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontWeight: '600', color: '#2d3a4b', fontSize: '16px' }}>{dish.name}</span>
                          <span style={{ color: '#7b68aa', fontWeight: '600' }}>${dish.price}</span>
                        </div>
                        {highlight && (
                          <Tag 
                            color='#9b8bc6' 
                            style={{ 
                              marginTop: '4px', 
                              borderRadius: '20px',
                              padding: '2px 8px',
                              color: 'white',
                              border: 'none',
                              fontSize: '10px'
                            }}
                          >
                            {highlightLabel}
                          </Tag>
                        )}
                      </div>
                      {/* 营养柱状图 */}
                      <div style={{ marginTop: '8px' }}>
                        <div style={{ display: 'flex', gap: '2px', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{ flex: proteinPercent, background: '#9b8bc6' }} />
                          <div style={{ flex: fatPercent, background: '#d4c4fb' }} />
                          <div style={{ flex: carbsPercent, background: '#f0e6ff' }} />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#8a9bb5', marginTop: '4px' }}>
                          <span>蛋白 {dish.protein}g</span>
                          <span>脂肪 {dish.fat}g</span>
                          <span>碳水 {dish.carbs}g</span>
                        </div>
                      </div>
                    </div>
                  </Grid.Item>
                </Grid>
              </Card>
            );
          })}
        </div>
        <div style={{ marginTop: '20px', textAlign: 'center', color: '#8a9bb5', fontSize: '12px' }}>
          ⚡ 營養數據為 AI 估算，僅供參考
        </div>
      </div>
    </div>
  );
}