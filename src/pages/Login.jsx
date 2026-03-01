import { Button, Form, Input } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import { MailOutline, LockOutline } from 'antd-mobile-icons';

export default function Login() {
  const navigate = useNavigate();

  return (
    <>
      {/* 终极覆盖：所有可能产生线条的地方全部抹杀 */}
      <style>{`
        /* 表单容器 */
        .adm-form, .adm-form-item, .adm-list, .adm-list-item,
        .adm-list-item-content, .adm-input-wrapper, .adm-input {
          border: none !important;
          border-top: none !important;
          border-bottom: none !important;
          border-left: none !important;
          border-right: none !important;
          outline: none !important;
          box-shadow: none !important;
          background: transparent !important;
        }
        /* 所有伪元素线条 */
        .adm-form-item::before, .adm-form-item::after,
        .adm-list-item::before, .adm-list-item::after,
        .adm-list-item-content::before, .adm-list-item-content::after {
          display: none !important;
          content: none !important;
          height: 0 !important;
          width: 0 !important;
          background: transparent !important;
          border: none !important;
        }
        /* 特别针对可能藏在更深处的 */
        .adm-list-item .adm-list-item-content .adm-list-item-content-main {
          border: none !important;
        }
        /* 输入框本身背景保留，但边框去掉 */
        .adm-input-wrapper {
          background: transparent !important;
        }
        .adm-input {
          background: #f8f9ff !important;
        }
        /* 强制移除任何可能从父级继承的线条 */
        body .adm-form-item, body .adm-list-item {
          border-bottom: none !important;
        }
      `}</style>
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

        <div style={{
          backgroundColor: 'white',
          borderRadius: '32px',
          padding: '32px 24px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
          marginBottom: '16px'
        }}>
          <Form layout='vertical' style={{ border: 'none' }}>
            <Form.Item style={{ marginBottom: '24px', border: 'none' }}>
              <Input
                placeholder='電郵'
                prefix={<MailOutline style={{ fontSize: '20px', color: '#9b8bc6', marginRight: '8px' }} />}
                style={{ 
                  background: '#f8f9ff',
                  border: 'none', 
                  borderRadius: '40px',
                  padding: '16px 20px',
                  fontSize: '16px',
                  '--prefix-width': 'auto'
                }} 
              />
            </Form.Item>

            <Form.Item style={{ marginBottom: '32px', border: 'none' }}>
              <Input
                type='password'
                placeholder='密碼'
                prefix={<LockOutline style={{ fontSize: '20px', color: '#9b8bc6', marginRight: '8px' }} />}
                style={{ 
                  background: '#f8f9ff',
                  border: 'none', 
                  borderRadius: '40px',
                  padding: '16px 20px',
                  fontSize: '16px',
                  '--prefix-width': 'auto'
                }} 
              />
            </Form.Item>

            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
              <Button
                size='large'
                style={{ 
                  background: '#7b68aa', 
                  color: 'white', 
                  borderRadius: '40px',
                  height: '52px',
                  fontSize: '16px',
                  fontWeight: 600,
                  border: 'none',
                  width: '200px',
                  boxShadow: '0 4px 12px rgba(123, 104, 170, 0.3)'
                }}
              >
                登入
              </Button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0' }}>
              <Button
                size='large'
                onClick={() => navigate('/map')}
                style={{ 
                  background: 'transparent', 
                  color: '#7b68aa', 
                  borderRadius: '40px',
                  height: '52px',
                  fontSize: '16px',
                  fontWeight: 600,
                  border: '2px solid #7b68aa',
                  width: '200px'
                }}
              >
                🚶 訪客瀏覽
              </Button>
            </div>
          </Form>
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
    </>
  );
}