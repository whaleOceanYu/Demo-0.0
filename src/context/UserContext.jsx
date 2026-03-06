// src/context/UserContext.jsx
//
// 全局用戶狀態管理。
//
// 【React Context 是什麼】：
//   Context 是一個「全局容器」。你把數據放進去（Provider），
//   任何後代組件都可以直接取出來（useUser hook），
//   不需要一層一層通過 props 傳遞。
//
// 【這個文件提供了什麼】：
//   1. UserProvider  - 包裹整個 App，提供全局用戶狀態
//   2. useUser()     - 任何組件調用這個 hook 即可獲取用戶狀態和操作
//
// 【使用方式】（在任何頁面/組件中）：
//   import { useUser } from '../context/UserContext';
//   const { user, isLoggedIn, login, logout, loginAsGuest } = useUser();

import { createContext, useContext, useState } from 'react';
import { getMockUser } from '../services/userService';

// 1. 創建 Context 對象（相當於定義了一個「全局插槽」）
const UserContext = createContext(null);

// 2. Provider 組件：包裹整個 App，向所有後代組件提供用戶狀態
//    children 是 React 的特殊 prop，代表「被包裹的子組件」
export function UserProvider({ children }) {
  // useState：React 的狀態管理。
  // 類比 C：不是普通變量，而是「改變時會觸發界面重新渲染」的特殊變量。
  // 格式：const [值, 修改值的函數] = useState(初始值)
  const [user, setUser]           = useState(null);  // null 表示未登錄
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [likedIds, setLikedIds]   = useState(new Set());
  const [goal, setGoal]           = useState('增肌'); // 健康目標，全局共用

  // 登錄：接收從 userService 返回的用戶對象，存入狀態
  const login = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
  };

  // 登出：清空用戶狀態
  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
  };

  // 訪客登錄：使用 mock 用戶數據，無需填寫表單
  const loginAsGuest = () => {
    setUser(getMockUser());
    setIsLoggedIn(true);
  };

  const toggleLike = (id) => {
    setLikedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  // value 是放入「全局插槽」的數據和方法，所有後代組件都能拿到
  const value = { user, isLoggedIn, login, logout, loginAsGuest, likedIds, toggleLike, goal, setGoal };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

// 3. 自定義 Hook：封裝「從 Context 取數據」的操作
//    組件只需 const { user } = useUser()，不需要知道 Context 的存在
export function useUser() {
  const context = useContext(UserContext);
  // 防護措施：如果忘記在 main.jsx 裡包裹 UserProvider，給出明確錯誤提示
  if (context === null) {
    throw new Error('useUser 必須在 UserProvider 內部使用。請檢查 main.jsx 是否包裹了 <UserProvider>。');
  }
  return context;
}
