import { Card, ProgressCircle, Button, Grid, Tag } from 'antd-mobile';
import { UserOutline, RightOutline } from 'antd-mobile-icons';
import BottomNav from '../components/BottomNav';

export default function ProfilePage() {
  return (
    <div style={{
      maxWidth: '450px',
      margin: '0 auto',
      padding: '16px 16px 70px',
      background: '#f8f9ff'
    }}>
      {/* 個人檔案卡片 */}
      <Card
        style={{
          borderRadius: '24px',
          padding: '20px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          background: 'rgba(255,255,255,0.8)',
          backdropFilter: 'blur(10px)',
          marginBottom: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{
              width: '70px',
              height: '70px',
              borderRadius: '35px',
              background: '#e6e3f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '16px'
            }}>
              <UserOutline style={{ fontSize: '36px', color: '#7b68aa' }} />
            </div>
            <div>
              <div style={{ fontWeight: '700', fontSize: '22px', color: '#2d3a4b' }}>Ocean</div>
              <div style={{ fontSize: '15px', color: '#8a9bb5', marginTop: '2px' }}>25歲 · 168 cm · 68 kg</div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ color: '#7b68aa', fontWeight: '700', fontSize: '18px' }}>🎯 增肌</div>
            <div style={{ fontSize: '14px', color: '#8a9bb5' }}>目標 75 kg</div>
          </div>
        </div>
      </Card>

      {/* 本週進度卡片 */}
      <Card
        style={{
          borderRadius: '24px',
          padding: '20px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          background: 'rgba(255,255,255,0.8)',
          backdropFilter: 'blur(10px)',
          marginBottom: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <span style={{ fontWeight: '700', color: '#5b4b8a', fontSize: '18px' }}>本週高蛋白打卡</span>
          <Button
            color='primary'
            fill='outline'
            style={{
              borderColor: '#9b8bc6',
              color: '#7b68aa',
              borderRadius: '30px',
              fontSize: '14px',
              padding: '6px 16px'
            }}
          >分享證書</Button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
          <ProgressCircle
            percent={80}
            style={{
              '--size': '100px',
              '--fill-color': '#9b8bc6',
              '--track-color': '#e6e3f0'
            }}
          >
            <span style={{ fontSize: '24px', fontWeight: '700', color: '#5b4b8a' }}>8/10</span>
          </ProgressCircle>
          <div style={{ fontSize: '16px', color: '#8a9bb5' }}>繼續加油！</div>
        </div>
      </Card>

      {/* 好友與社群卡片 */}
      <Card
        style={{
          borderRadius: '24px',
          padding: '20px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          background: 'rgba(255,255,255,0.8)',
          backdropFilter: 'blur(10px)',
          marginBottom: '12px'
        }}
      >
        <div style={{ fontWeight: '700', color: '#5b4b8a', fontSize: '18px', marginBottom: '16px' }}>好友與社群</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[
            { name: 'Cathy', goal: '增肌', color: '#d4c4fb' },
            { name: 'Ryan', goal: '減脂', color: '#c4d4fb' },
            { name: 'Bohdan', goal: '保持體重', color: '#fbc4d4' }
          ].map((friend, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '22px', background: friend.color }}></div>
                <span style={{ fontWeight: '600', fontSize: '16px', color: '#2d3a4b' }}>{friend.name}</span>
                <Tag color='#e6e3f0' style={{ color: '#5b4b8a', borderRadius: '20px', fontSize: '12px' }}>{friend.goal}</Tag>
              </div>
              <RightOutline style={{ color: '#9b8bc6', fontSize: '18px' }} />
            </div>
          ))}
        </div>
        <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
          {/* 修改后的「與朋友一起找餐廳」按钮：去掉图标，变宽 */}
          <Button
            block
            style={{
              background: '#9b8bc6',
              color: 'white',
              borderRadius: '30px',
              border: 'none',
              padding: '12px 20px', // 增加内边距，使按钮更宽
              fontSize: '16px',
              fontWeight: '500'
            }}
          >
            與朋友一起找餐廳
          </Button>
          {/* 修改后的「邀請朋友」按钮：圆形中间带加号 */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Button
              style={{
                background: 'transparent',
                color: '#7b68aa',
                borderRadius: '50%', // 圆形
                border: '2px solid #9b8bc6',
                width: '48px',
                height: '48px',
                padding: 0,
                fontSize: '24px',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              +
            </Button>
          </div>
        </div>
      </Card>

      {/* 月度報告卡片 */}
      <Card
        style={{
          borderRadius: '24px',
          padding: '20px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          background: 'rgba(255,255,255,0.8)',
          backdropFilter: 'blur(10px)',
          marginBottom: '12px'
        }}
      >
        <div style={{ fontWeight: '700', color: '#5b4b8a', fontSize: '18px', marginBottom: '8px' }}>月度報告</div>
        <div style={{ fontSize: '15px', color: '#2d3a4b', marginBottom: '12px' }}>
          上月你打卡 28 次，蛋白質攝入達標率 85%
        </div>
        <Button
          fill='none'
          style={{ color: '#7b68aa', padding: 0, fontSize: '15px' }}
        >生成月報 →</Button>
      </Card>

      {/* 飲食記錄卡片 */}
      <Card
        style={{
          borderRadius: '24px',
          padding: '20px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          background: 'rgba(255,255,255,0.8)',
          backdropFilter: 'blur(10px)',
          marginBottom: '12px'
        }}
      >
        <div style={{ fontWeight: '700', color: '#5b4b8a', fontSize: '18px', marginBottom: '8px' }}>今日飲食記錄</div>
        <div style={{ fontSize: '15px', color: '#2d3a4b', marginBottom: '12px' }}>
          早餐 320 kcal · 午餐 550 kcal · 晚餐 280 kcal
        </div>
        <Button
          fill='none'
          style={{ color: '#7b68aa', padding: 0, fontSize: '15px' }}
        >➕ 添加手動記錄</Button>
      </Card>

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