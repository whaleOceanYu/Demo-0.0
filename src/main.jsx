import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { UserProvider } from './context/UserContext'
import './index.css'

// UserProvider 包裹整個 App，使「當前登錄用戶」的狀態
// 對所有頁面和組件都可訪問，無需一層層傳遞。
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UserProvider>
      <App />
    </UserProvider>
  </React.StrictMode>,
)