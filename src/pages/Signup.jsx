import { Button, Form, Input, Checkbox } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import { UserOutline, MailOutline, LockOutline, HeartOutline } from 'antd-mobile-icons';

export default function Signup() {
  const navigate = useNavigate();

  return (
    <div style={{ 
      padding: '24px', 
      maxWidth: '450px', 
      margin: '0 auto',
      background: '#f8f9ff',
      minHeight: '100vh'
    }}>
      <h2 style={{ textAlign: 'center', color: '#5b4b8a', marginBottom: '24px' }}>建立你的個人檔案</h2>
      <div style={{ background: 'white', borderRadius: '24px', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <Form layout='vertical'>
          <Form.Item label={<span style={{ color: '#5b4b8a' }}>姓名</span>}>
            <Input
              placeholder='請輸入姓名'
              prefix={<UserOutline style={{ color: '#9b8bc6', marginRight: '8px' }} />}
              style={{ background: '#f8f9ff', border: 'none', borderRadius: '30px' }}
            />
          </Form.Item>
          <Form.Item label={<span style={{ color: '#5b4b8a' }}>電郵</span>}>
            <Input
              placeholder='請輸入電郵'
              prefix={<MailOutline style={{ color: '#9b8bc6', marginRight: '8px' }} />}
              style={{ background: '#f8f9ff', border: 'none', borderRadius: '30px' }}
            />
          </Form.Item>
          <Form.Item label={<span style={{ color: '#5b4b8a' }}>密碼</span>}>
            <Input
              type='password'
              placeholder='請輸入密碼'
              prefix={<LockOutline style={{ color: '#9b8bc6', marginRight: '8px' }} />}
              style={{ background: '#f8f9ff', border: 'none', borderRadius: '30px' }}
            />
          </Form.Item>
          <Form.Item label={<span style={{ color: '#5b4b8a' }}>健身目標</span>}>
            <select
              style={{
                width: '100%',
                padding: '12px 16px',
                background: '#f8f9ff',
                border: 'none',
                borderRadius: '30px',
                fontSize: '16px',
                color: '#2d3a4b'
              }}
            >
              <option>增肌</option>
              <option>減脂</option>
              <option>塑形</option>
              <option>保持體重</option>
            </select>
          </Form.Item>
          <Form.Item label={<span style={{ color: '#5b4b8a' }}>目標體重 (kg)（可選）</span>}>
            <Input
              type='number'
              placeholder='例如 75'
              style={{ background: '#f8f9ff', border: 'none', borderRadius: '30px' }}
            />
          </Form.Item>
          <Form.Item label={<span style={{ color: '#5b4b8a' }}>年齡</span>}>
            <Input
              type='number'
              placeholder='例如 25'
              style={{ background: '#f8f9ff', border: 'none', borderRadius: '30px' }}
            />
          </Form.Item>
          <Form.Item label={<span style={{ color: '#5b4b8a' }}>身高 (cm)</span>}>
            <Input
              type='number'
              placeholder='例如 168'
              style={{ background: '#f8f9ff', border: 'none', borderRadius: '30px' }}
            />
          </Form.Item>
          <Form.Item label={<span style={{ color: '#5b4b8a' }}>體重 (kg)</span>}>
            <Input
              type='number'
              placeholder='例如 68'
              style={{ background: '#f8f9ff', border: 'none', borderRadius: '30px' }}
            />
          </Form.Item>
          <Form.Item label={<span style={{ color: '#5b4b8a' }}>特定飲食需求（可多選）</span>}>
            <Checkbox.Group
              options={[
                { label: '低糖', value: '低糖' },
                { label: '低鈉', value: '低鈉' },
                { label: '高纖維', value: '高纖維' },
                { label: '無過敏原', value: '無過敏原' },
              ]}
            />
          </Form.Item>
          <Button
            block
            size='large'
            onClick={() => navigate('/map')}
            style={{
              background: '#7b68aa',
              color: 'white',
              borderRadius: '30px',
              border: 'none',
              marginTop: '8px'
            }}
          >
            註冊並開始使用
          </Button>
        </Form>
        <div style={{ marginTop: '16px', textAlign: 'center' }}>
          <button
            onClick={() => navigate('/login')}
            style={{ background: 'none', border: 'none', color: '#7b68aa', textDecoration: 'underline' }}
          >
            已有帳戶？登入
          </button>
        </div>
      </div>
    </div>
  );
}