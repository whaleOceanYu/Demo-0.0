import { useNavigate } from 'react-router-dom';
import { MailOutline, LockOutline } from 'antd-mobile-icons';

export default function Login() {
  const navigate = useNavigate();

  return (
    <div style={{ 
      padding: '48px 24px', 
      maxWidth: '400px', 
      margin: '0 auto',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      background: 'transparent'
    }}>
      {/* Logo 和标语 */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h1 style={{ 
          fontSize: '36px', 
          color: '#7b68aa', 
          marginBottom: '8px',
          fontWeight: 700,
          letterSpacing: '-0.5px'
        }}>
          ProteinMap
        </h1>
        <p style={{ color: '#8a9bb5', fontSize: '16px', fontWeight: 400 }}>
          Track. Fuel. Perform.
        </p>
      </div>

      {/* 白色卡片 */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '32px',
        padding: '32px 24px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
        marginBottom: '16px'
      }}>
        {/* 邮箱输入框 */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: '#f8f9ff',
            borderRadius: '40px',
            padding: '0 20px'
          }}>
            <MailOutline style={{ fontSize: '20px', color: '#9b8bc6', marginRight: '8px' }} />
            <input
              type="email"
              placeholder="電郵"
              style={{
                background: 'transparent',
                border: 'none',
                padding: '16px 0',
                fontSize: '16px',
                width: '100%',
                outline: 'none'
              }}
            />
          </div>
        </div>

        {/* 密码输入框 */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: '#f8f9ff',
            borderRadius: '40px',
            padding: '0 20px'
          }}>
            <LockOutline style={{ fontSize: '20px', color: '#9b8bc6', marginRight: '8px' }} />
            <input
              type="password"
              placeholder="密碼"
              style={{
                background: 'transparent',
                border: 'none',
                padding: '16px 0',
                fontSize: '16px',
                width: '100%',
                outline: 'none'
              }}
            />
          </div>
        </div>

        {/* 登录按钮 */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
          <button
            style={{
              background: '#7b68aa',
              color: 'white',
              borderRadius: '40px',
              height: '52px',
              fontSize: '16px',
              fontWeight: 600,
              border: 'none',
              width: '200px',
              boxShadow: '0 4px 12px rgba(123, 104, 170, 0.3)',
              cursor: 'pointer'
            }}
          >
            登入
          </button>
        </div>

        {/* 访客浏览按钮 */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button
            onClick={() => navigate('/map')}
            style={{
              background: 'transparent',
              color: '#7b68aa',
              borderRadius: '40px',
              height: '52px',
              fontSize: '16px',
              fontWeight: 600,
              border: '2px solid #7b68aa',
              width: '200px',
              cursor: 'pointer'
            }}
          >
            🚶 訪客瀏覽
          </button>
        </div>
      </div>

      {/* 注册引导 */}
      <div style={{ textAlign: 'center', color: '#8a9bb5', fontSize: '15px' }}>
        <span>新用戶？</span>
        <button
          onClick={() => navigate('/signup')}
          style={{ 
            background: 'none', 
            border: 'none', 
            color: '#7b68aa', 
            textDecoration: 'underline',
            fontSize: '15px',
            fontWeight: 500,
            cursor: 'pointer',
            padding: '0 4px'
          }}
        >
          註冊
        </button>
        <span> 以開啟你的香港營養地圖</span>
      </div>
    </div>
  );
}