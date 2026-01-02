import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import './i18n';
import HomePage from './pages/HomePage';
import NewsDetailPage from './pages/NewsDetailPage';
import CategoryPage from './pages/CategoryPage';
import PhotosPage from './pages/PhotosPage';
import VideosPage from './pages/VideosPage';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/admin/Dashboard';
import AdminNews from './pages/admin/NewsManagement';
import AdminCategories from './pages/admin/CategoryManagement';
import AdminPhotos from './pages/admin/PhotoManagement';
import AdminVideos from './pages/admin/VideoManagement';
import AdminAds from './pages/admin/AdManagement';
import AdminSettings from './pages/admin/SettingsManagement';
import AdminMenus from './pages/admin/MenuManagement';
import AdminUsers from './pages/admin/UserManagement';
import AdminRoles from './pages/admin/RoleManagement';
import AdminDistricts from './pages/admin/DistrictManagement';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/news/:id" element={<NewsDetailPage />} />
        <Route path="/category/:slug" element={<CategoryPage />} />
        <Route path="/photos" element={<PhotosPage />} />
        <Route path="/videos" element={<VideosPage />} />
        <Route path="/login" element={<LoginPage />} />
        
        {/* Protected Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/news" element={<ProtectedRoute><AdminNews /></ProtectedRoute>} />
        <Route path="/admin/categories" element={<ProtectedRoute><AdminCategories /></ProtectedRoute>} />
        <Route path="/admin/photos" element={<ProtectedRoute><AdminPhotos /></ProtectedRoute>} />
        <Route path="/admin/videos" element={<ProtectedRoute><AdminVideos /></ProtectedRoute>} />
        <Route path="/admin/ads" element={<ProtectedRoute><AdminAds /></ProtectedRoute>} />
        <Route path="/admin/settings" element={<ProtectedRoute><AdminSettings /></ProtectedRoute>} />
        <Route path="/admin/menus" element={<ProtectedRoute><AdminMenus /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute><AdminUsers /></ProtectedRoute>} />
        <Route path="/admin/roles" element={<ProtectedRoute><AdminRoles /></ProtectedRoute>} />
        <Route path="/admin/districts" element={<ProtectedRoute><AdminDistricts /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
