import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from './constants/routes';
import Login from './pages/Login';
import Signup from './pages/Signup';
import MapPage from './pages/MapPage';
import MenuPage from './pages/MenuPage';
import ProfilePage from './pages/ProfilePage';
import FriendsPage from './pages/FriendsPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.HOME}    element={<Navigate to={ROUTES.LOGIN} />} />
        <Route path={ROUTES.LOGIN}   element={<Login />} />
        <Route path={ROUTES.SIGNUP}  element={<Signup />} />
        <Route path={ROUTES.MAP}     element={<MapPage />} />
        <Route path={ROUTES.MENU}    element={<MenuPage />} />
        <Route path={ROUTES.FRIENDS} element={<FriendsPage />} />
        <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;