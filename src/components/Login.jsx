import { useState } from 'react';
import { Wallet } from 'lucide-react';
import { LOGIN_CREDENTIALS } from '../constants/mockData';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    const user = LOGIN_CREDENTIALS.find(u => u.username === username && u.password === password);
    
    if (user) {
      onLogin(user.id);
    } else {
      setError('Username atau password salah!');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-200">
        <h2 className="text-3xl font-extrabold mb-2 text-blue-700 flex justify-center items-center gap-3">
          <Wallet size={32} /> Bank Eko
        </h2>
        <p className="text-center text-gray-500 text-sm mb-8">Masuk ke akun Anda</p>
        
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Masukkan username"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Masukkan password"
              required
            />
          </div>

          {error && (
            <div className="bg-rose-100 border border-rose-400 text-rose-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-bold transition-all"
          >
            Login
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 mb-3 text-center font-semibold">Demo Credentials:</p>
          <div className="space-y-2 text-xs text-gray-600">
            <p><strong>Nasabah 1:</strong> nasabah1 / pass123</p>
            <p><strong>Nasabah 2:</strong> nasabah2 / pass123</p>
            <p><strong>Admin:</strong> admin / admin123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;