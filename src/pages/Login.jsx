import { Button, Form, Input } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import { MailOutline, LockOutline } from 'antd-mobile-icons';

export default function Login() {
  const navigate = useNavigate();

  return (
    <div style={{ 
      padding: '60px 24px',  // 增加上下 padding，让整体更舒展
      maxWidth: '400px', 
      margin: '0 auto',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '50px' }}>
        <h1 style={{ fontSize: '36px', color: '#7b68aa', marginBottom: '8px' }}>ProteinMap</h1>
        <p style={{ color: '#8a9bb5', fontSize: '16px' }}>Track. Fuel. Perform.</p>
      </div>

      <Form layout='vertical'>
        <Form.Item style={{ marginBottom: '24px' }}>  {/* 增加底部间距 */}
          <Input
            placeholder='電郵'
            prefix={<MailOutline style={{ fontSize: '18px', color: '#9b8bc6', marginRight: '8px' }} />}
            style={{ 
              background: '#f0f2f8', 
              border: 'none', 
              borderRadius: '40px',  // 更大圆角
              padding: '16px 20px',  // 增加高度
              fontSize: '16px',
              '--prefix-width': 'auto'
            }} 
          />
        </Form.Item>

        <Form.Item style={{ marginBottom: '32px' }}>
          <Input
            type='password'
            placeholder='密碼'
            prefix={<LockOutline style={{ fontSize: '18px', color: '#9b8bc6', marginRight: '8px' }} />}
            style={{ 
              background: '#f0f2f8', 
              border: 'none', 
              borderRadius: '40px',
              padding: '16px 20px',
              fontSize: '16px',
              '--prefix-width': 'auto'
            }} 
          />
        </Form.Item>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            size='large'
            style={{ 
              background: '#7b68aa', 
              color: 'white', 
              borderRadius: '40px',
              height: '50px',
              fontSize: '16px',
              border: 'none',
              marginBottom: '20px',
              width: '200px'
            }}
          >
            登入
          </Button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            size='large'
            onClick={() => navigate('/map')}
            style={{ 
              background: 'transparent', 
              color: '#7b68aa', 
              borderRadius: '40px',
              height: '50px',
              fontSize: '16px',
              border: '2px solid #7b68aa',
              marginBottom: '30px',
              width: '200px'
            }}
          >
            🚶 訪客瀏覽
          </Button>
        </div>

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
              cursor: 'pointer',
              padding: 0,
              marginLeft: '4px'
            }}
          >
            註冊
          </button>
          <span> 以開啟你的香港營養地圖</span>
        </div>
      </Form>
    </div>
  );
}