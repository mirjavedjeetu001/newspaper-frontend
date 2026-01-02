import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import '../styles/Login.css';

const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/admin/login`, {
        username,
        password,
      });

      if (response.data.success) {
        // Store admin data in localStorage
        localStorage.setItem('admin', JSON.stringify(response.data.admin));
        localStorage.setItem('isAuthenticated', 'true');
        navigate('/admin');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-box">
          <h1 className="login-title">{t('adminLogin')}</h1>
          
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label htmlFor="username">{t('username')}</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder={t('enterUsername')}
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">{t('password')}</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder={t('enterPassword')}
                disabled={loading}
              />
            </div>

            <button 
              type="submit" 
              className="login-btn"
              disabled={loading}
            >
              {loading ? t('loading') : t('login')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
