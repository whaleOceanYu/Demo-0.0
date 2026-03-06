// src/services/userService.js
//
// 用戶相關的服務層。
//
// 目前全部是 mock（模擬）實現：沒有真實的數據庫或網絡請求。
// 函數的「接口」（函數名、參數、返回值結構）已按照真實後端的
// 習慣設計好，未來只需替換函數內部邏輯。
//
// 【返回值設計】：
//   成功：{ success: true,  user: {...} }
//   失敗：{ success: false, error: '錯誤信息' }
//   這與真實 API 的 JSON 響應格式一致，方便日後替換。

// Mock 用戶數據（相當於數據庫中的一條記錄）
const MOCK_USER = {
  id:           1,
  name:         'Ocean',
  email:        'ocean@example.com',
  age:          25,
  height:       168,
  weight:       68,
  goal:         '增肌',
  targetWeight: 75,
  dietary:      [],   // 特定飲食需求（如：['低糖', '低鈉']）
};

// 獲取 mock 用戶數據（用於訪客模式和測試）
export function getMockUser() {
  return { ...MOCK_USER }; // 返回副本，防止外部直接修改原始數據
}

// 模擬登錄
// 真實後端版本：return await fetch('/api/auth/login', { method: 'POST', body: ... })
export function mockLogin(email, password) {
  if (!email || !password) {
    return { success: false, error: '請填寫電郵和密碼' };
  }
  // Mock：任何非空的郵箱密碼都登錄成功
  return { success: true, user: getMockUser() };
}

// 模擬註冊
// formData 的結構與 Signup.jsx 的表單字段對應
export function mockSignup(formData) {
  if (!formData.name || !formData.email || !formData.password) {
    return { success: false, error: '請填寫必填欄位' };
  }
  const newUser = {
    ...MOCK_USER,
    name:         formData.name         || MOCK_USER.name,
    email:        formData.email        || MOCK_USER.email,
    goal:         formData.goal         || MOCK_USER.goal,
    age:          Number(formData.age)  || MOCK_USER.age,
    height:       Number(formData.height) || MOCK_USER.height,
    weight:       Number(formData.weight) || MOCK_USER.weight,
    targetWeight: Number(formData.targetWeight) || MOCK_USER.targetWeight,
    dietary:      formData.dietary      || [],
  };
  return { success: true, user: newUser };
}
