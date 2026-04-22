import { useState } from 'react';
import Login from './components/Login';
import Products from './components/Products';
import Chat from './components/Chat';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [screen, setScreen] = useState(token ? 'products' : 'login');

  function handleLogin(newToken) {
    setToken(newToken);
    setScreen('products');
  }

  function handleLogout() {
    localStorage.removeItem('token');
    setToken('');
    setScreen('login');
  }

  if (!token || screen === 'login') {
    return <Login onLogin={handleLogin} />;
  }

  if (screen === 'chat') {
    return (
      <Chat
        token={token}
        onLogout={handleLogout}
        onBackProducts={() => setScreen('products')}
      />
    );
  }

  return (
    <Products
      token={token}
      onGoChat={() => setScreen('chat')}
      onLogout={handleLogout}
    />
  );
}