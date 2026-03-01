import { Button, Form, Input } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import { MailOutline, LockOutline } from 'antd-mobile-icons';

export default function Login() {
  const navigate = useNavigate();

  return (
    <div style={{ 
      padding: '40px 24px', 
      maxWidth: '400px', 
      margin: '0 auto',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '32px', color: '#7b68aa', marginBottom: '8px' }}>ProteinMap</h1>
        <p style={{ color: '#8a9bb5', fontSize: '16px' }}>Track. Fuel. Perform.</p>
      </div>

      <Form layout='vertical'>
        <Form.Item style={{ marginBottom: '20px' }}>
          <Input
            placeholder='電郵'
            prefix={<MailOutline style={{ fontSize: '18px', color: '#9b8bc6', marginRight: '8px' }} />}
            style={{ 
              background: '#f0f2f8', 
              border: 'none', 
              borderRadius: '30px',
              padding: '12px 16px',
              fontSize: '16px',
              '--prefix-width': 'auto'
            }} 
          />
        </Form.Item>

        <Form.Item style={{ marginBottom: '24px' }}>
          <Input
            type='password'
            placeholder='密碼'
            prefix={<LockOutline style={{ fontSize: '18px', color: '#9b8bc6', marginRight: '8px' }} />}
            style={{ 
              background: '#f0f2f8', 
              border: 'none', 
              borderRadius: '30px',
              padding: '12px 16px',
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
              borderRadius: '30px',
              height: '48px',
              fontSize: '16px',
              border: 'none',
              marginBottom: '16px',
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
              borderRadius: '30px',
              height: '48px',
              fontSize: '16px',
              border: '2px solid #7b68aa',
              marginBottom: '20px',
              width: '200px'
            }}
          >
            🚶 訪客瀏覽
          </Button>
        </div>

        <div style={{ textAlign: 'center', color: '#8a9bb5', fontSize: '14px' }}>
          <span>新用戶？</span>
          <button
            onClick={() => navigate('/signup')}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: '#7b68aa', 
              textDecoration: 'underline',
              fontSize: '14px',
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