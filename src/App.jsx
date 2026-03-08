import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from './constants/routes';
import { useUser } from './context/UserContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import MapPage from './pages/MapPage';
import MenuPage from './pages/MenuPage';
import ProfilePage from './pages/ProfilePage';
import FriendsPage from './pages/FriendsPage';

function RequireAuth({ children }) {
  const { isLoggedIn } = useUser();
  return isLoggedIn ? children : <Navigate to={ROUTES.LOGIN} replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.HOME}    element={<Navigate to={ROUTES.LOGIN} />} />
        <Route path={ROUTES.LOGIN}   element={<Login />} />
        <Route path={ROUTES.SIGNUP}  element={<Signup />} />
        <Route path={ROUTES.MAP}     element={<RequireAuth><MapPage /></RequireAuth>} />
        <Route path={ROUTES.MENU}    element={<RequireAuth><MenuPage /></RequireAuth>} />
        <Route path={ROUTES.FRIENDS} element={<RequireAuth><FriendsPage /></RequireAuth>} />
        <Route path={ROUTES.PROFILE} element={<RequireAuth><ProfilePage /></RequireAuth>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
