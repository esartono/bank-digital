import React, { useState } from 'react';
import { Wallet, LogOut, ArrowUpCircle, ArrowDownCircle, Printer, Calendar, User, Lock, ShieldCheck } from 'lucide-react';

// --- MOCK DATA ---
const USERS_DB = [
  { username: 'user', password: 'user123', role: 'user', name: 'Budi Santoso', balance: 5000000, accountNo: '123-456-789' },
  { username: 'admin', password: 'admin123', role: 'admin', name: 'Administrator Bank', balance: 0, accountNo: 'ADMIN-001' }
];

const INITIAL_TRANSACTIONS = [
  { id: 1, userId: 'user', type: 'DEBIT', amount: 5000000, date: '2023-10-01', note: 'Setoran Awal' },
  { id: 2, userId: 'user', type: 'KREDIT', amount: 200000, date: '2023-10-05', note: 'Tarik Tunai ATM' }
];

// --- COMPONENT: LOGIN PAGE ---
const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Cari user di database simulasi
    const foundUser = USERS_DB.find(u => u.username === username && u.password === password);
    
    if (foundUser) {
      onLogin(foundUser);
    } else {
      setError('Username atau Password salah!');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-800">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Wallet className="text-blue-600" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">E-Banking Login</h2>
          <p className="text-gray-500 text-sm mt-2">Silakan masuk untuk melanjutkan</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                className="pl-10 w-full border border-gray-300 rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Masukkan username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={18} className="text-gray-400" />
              </div>
              <input
                type="password"
                className="pl-10 w-full border border-gray-300 rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition duration-200 shadow-md"
          >
            MASUK
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-gray-400 border-t pt-4">
          <p>Demo Akun:</p>
          <p>User: <strong>user / user123</strong> | Admin: <strong>admin / admin123</strong></p>
        </div>
      </div>
    </div>
  );
};

// --- COMPONENT: RECEIPT (Only for Print) ---
const PrintReceipt = ({ transaction, user }) => {
  if (!transaction) return null;
  return (
    <div className="hidden print:block p-8 border-2 border-black m-8 max-w-2xl mx-auto">
      <div className="text-center border-b-2 border-black pb-4 mb-4">
        <h1 className="text-3xl font-bold">BANK INDONESIA MAJU</h1>
        <p>Jl. Jendral Sudirman No. 1, Jakarta</p>
      </div>
      
      <h2 className="text-xl font-bold text-center mb-6 underline">BUKTI TRANSAKSI</h2>
      
      <div className="grid grid-cols-2 gap-4 text-lg">
        <div className="font-semibold">Tanggal:</div>
        <div>{transaction.date}</div>
        
        <div className="font-semibold">No. Referensi:</div>
        <div>TRX-{transaction.id}</div>
        
        <div className="font-semibold">Nama Nasabah:</div>
        <div>{user.name}</div>
        
        <div className="font-semibold">No. Rekening:</div>
        <div>{user.accountNo}</div>

        <div className="font-semibold">Jenis Transaksi:</div>
        <div className="uppercase">{transaction.type === 'DEBIT' ? 'SETORAN TUNAI' : 'PENARIKAN TUNAI'}</div>
      </div>

      <div className="my-8 border-t border-b border-black py-4">
        <div className="flex justify-between items-center text-2xl font-bold">
          <span>TOTAL:</span>
          <span>Rp {transaction.amount.toLocaleString('id-ID')}</span>
        </div>
      </div>

      <p className="mb-8">Keterangan: {transaction.note}</p>

      <div className="flex justify-between mt-16 text-center">
        <div className="w-1/3">
          <p className="mb-16">Penyetor/Penarik</p>
          <p>({user.name})</p>
        </div>
        <div className="w-1/3">
          <p className="mb-16">Teller</p>
          <p>(.........................)</p>
        </div>
      </div>
      
      <div className="mt-8 text-center text-sm italic">
        * Harap simpan bukti ini sebagai alat bukti pembayaran yang sah.
      </div>
    </div>
  );
};

// --- MAIN APP COMPONENT ---
export default function App() {
  const [currentUser, setCurrentUser] = useState(null); 
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [dateFilter, setDateFilter] = useState({ start: '', end: '' });
  const [lastTransaction, setLastTransaction] = useState(null);

  // Fungsi Login
  const handleLogin = (userObject) => {
    setCurrentUser(userObject);
  };

  // Fungsi Logout
  const handleLogout = () => {
    if(confirm('Yakin ingin keluar?')) {
      setCurrentUser(null);
      setAmount('');
      setNote('');
      setDateFilter({ start: '', end: '' });
    }
  };

  // Fungsi Transaksi
  const handleTransaction = (type) => {
    if (!amount || amount <= 0) return alert("Masukkan jumlah valid");
    if (type === 'KREDIT' && currentUser.balance < amount) return alert("Saldo tidak cukup");

    const newTrx = {
      id: Date.now(),
      userId: currentUser.username, // Link transaksi ke username
      type,
      amount: parseInt(amount),
      date: new Date().toISOString().split('T')[0],
      note: note || (type === 'DEBIT' ? 'Setor Tunai' : 'Tarik Tunai')
    };

    setTransactions([newTrx, ...transactions]);
    
    // Update Saldo User Local State
    const newBalance = type === 'DEBIT' 
      ? currentUser.balance + parseInt(amount) 
      : currentUser.balance - parseInt(amount);
    
    setCurrentUser({ ...currentUser, balance: newBalance });
    setLastTransaction(newTrx); 
    setAmount('');
    setNote('');
    
    setTimeout(() => {
      if(confirm("Transaksi berhasil! Cetak struk sekarang?")) window.print();
    }, 200);
  };

  // Filter Logic
  const filteredTransactions = transactions.filter(t => {
    // 1. Filter Role: Admin lihat semua, User lihat punya sendiri
    if (currentUser.role === 'user' && t.userId !== currentUser.username) return false;
    
    // 2. Filter Tanggal
    if (dateFilter.start && t.date < dateFilter.start) return false;
    if (dateFilter.end && t.date > dateFilter.end) return false;
    
    return true;
  });

  // Render Login Page jika belum ada user
  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // Render Dashboard jika sudah login
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      
      {/* Navbar (Hidden on Print) */}
      <nav className="bg-white border-b border-gray-200 px-6 py-3 shadow-sm flex justify-between items-center sticky top-0 z-50 no-print">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded text-white">
            <Wallet size={20} />
          </div>
          <div>
            <h1 className="font-bold text-lg text-gray-800 leading-tight">E-Banking System</h1>
            <span className={`text-xs px-2 py-0.5 rounded-full ${currentUser.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
              {currentUser.role === 'admin' ? 'Administrator Mode' : 'Nasabah Mode'}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-semibold">{currentUser.name}</div>
            <div className="text-xs text-gray-500">{currentUser.accountNo}</div>
          </div>
          <button 
            onClick={handleLogout} 
            className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition"
          >
            <LogOut size={18} /> <span className="hidden sm:inline">Keluar</span>
          </button>
        </div>
      </nav>

      <div className="container mx-auto p-4 md:p-8 max-w-6xl">
        
        {/* === USER DASHBOARD: INFO SALDO & TRANSAKSI === */}
        {currentUser.role === 'user' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 no-print">
            {/* Card Saldo */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white p-6 rounded-2xl shadow-lg">
              <h3 className="text-blue-100 text-sm font-medium mb-1">Total Saldo Tabungan</h3>
              <p className="text-3xl font-bold">Rp {currentUser.balance.toLocaleString('id-ID')}</p>
              <div className="mt-4 pt-4 border-t border-blue-400/30 flex justify-between items-center text-sm text-blue-50">
                <span>{currentUser.accountNo}</span>
                <span className="bg-white/20 px-2 py-1 rounded">Aktif</span>
              </div>
            </div>

            {/* Card Setor */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
              <h3 className="font-bold text-gray-700 flex items-center gap-2 mb-4">
                <ArrowUpCircle className="text-green-500" /> Setor Tunai
              </h3>
              <div className="space-y-3">
                <input 
                  type="number" 
                  placeholder="Masukkan Nominal (Rp)" 
                  className="w-full bg-gray-50 border border-gray-200 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20" 
                  value={amount} 
                  onChange={e => setAmount(e.target.value)} 
                />
                <input 
                  type="text" 
                  placeholder="Catatan Transaksi" 
                  className="w-full bg-gray-50 border border-gray-200 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20" 
                  value={note} 
                  onChange={e => setNote(e.target.value)} 
                />
                <button onClick={() => handleTransaction('DEBIT')} className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2.5 rounded-lg transition">
                  Proses Setor
                </button>
              </div>
            </div>

            {/* Card Tarik */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
              <h3 className="font-bold text-gray-700 flex items-center gap-2 mb-4">
                <ArrowDownCircle className="text-red-500" /> Tarik Tunai
              </h3>
              <div className="space-y-3">
                <input 
                  type="number" 
                  placeholder="Masukkan Nominal (Rp)" 
                  className="w-full bg-gray-50 border border-gray-200 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20" 
                  value={amount} 
                  onChange={e => setAmount(e.target.value)} 
                />
                <input 
                  type="text" 
                  placeholder="Catatan Transaksi" 
                  className="w-full bg-gray-50 border border-gray-200 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20" 
                  value={note} 
                  onChange={e => setNote(e.target.value)} 
                />
                <button onClick={() => handleTransaction('KREDIT')} className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2.5 rounded-lg transition">
                  Proses Tarik
                </button>
              </div>
            </div>
          </div>
        )}

        {/* === ADMIN DASHBOARD INFO === */}
        {currentUser.role === 'admin' && (
          <div className="bg-white border-l-4 border-purple-500 p-6 rounded-r-lg shadow-sm mb-8 no-print flex items-start gap-4">
            <div className="bg-purple-100 p-3 rounded-full text-purple-600">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h3 className="font-bold text-gray-800 text-lg">Panel Administrator</h3>
              <p className="text-gray-600 mt-1">
                Selamat datang kembali, Admin. Anda memiliki akses penuh untuk melihat seluruh riwayat transaksi nasabah.
                Gunakan filter tanggal di bawah untuk mencetak laporan spesifik.
              </p>
            </div>
          </div>
        )}

        {/* === REKENING KORAN / MUTASI === */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Header & Filter */}
          <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 no-print bg-gray-50/50">
            <div>
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <Calendar className="text-blue-600" size={20} /> 
                {currentUser.role === 'admin' ? 'Laporan Seluruh Transaksi' : 'Mutasi Rekening'}
              </h2>
              <p className="text-xs text-gray-500 mt-1">Filter data berdasarkan rentang waktu</p>
            </div>
            
            <div className="flex flex-wrap gap-2 items-center bg-white p-1.5 rounded-lg border border-gray-200 shadow-sm">
              <input 
                type="date" 
                className="text-sm border-gray-200 rounded px-2 py-1 outline-none focus:text-blue-600" 
                value={dateFilter.start}
                onChange={(e) => setDateFilter({...dateFilter, start: e.target.value})} 
              />
              <span className="text-gray-400 text-xs">-</span>
              <input 
                type="date" 
                className="text-sm border-gray-200 rounded px-2 py-1 outline-none focus:text-blue-600" 
                value={dateFilter.end}
                onChange={(e) => setDateFilter({...dateFilter, end: e.target.value})} 
              />
              <div className="w-px h-6 bg-gray-200 mx-1"></div>
              <button 
                onClick={() => window.print()} 
                className="bg-gray-800 text-white px-4 py-1.5 rounded text-sm hover:bg-black transition flex items-center gap-2"
              >
                <Printer size={14} /> Cetak
              </button>
            </div>
          </div>

          {/* Table Area */}
          <div className="overflow-x-auto">
            {/* Header Laporan (Only Print) */}
            <div className="hidden print:block p-8 pb-0 text-center">
              <h1 className="text-2xl font-bold uppercase mb-2">Laporan Mutasi Rekening</h1>
              <p className="text-sm text-gray-600 mb-6">
                Periode: {dateFilter.start || 'Awal'} s/d {dateFilter.end || 'Sekarang'}
              </p>
            </div>

            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100 print:bg-white print:border-black print:text-black">
                  <th className="p-4 font-medium">Tanggal</th>
                  <th className="p-4 font-medium">Keterangan</th>
                  <th className="p-4 font-medium text-right">Nominal</th>
                  <th className="p-4 font-medium text-center">Status</th>
                  {currentUser.role === 'admin' && <th className="p-4 font-medium">User ID</th>}
                </tr>
              </thead>
              <tbody className="text-sm text-gray-700">
                {filteredTransactions.length > 0 ? filteredTransactions.map((trx) => (
                  <tr key={trx.id} className="border-b border-gray-50 hover:bg-gray-50 transition print:border-black">
                    <td className="p-4 whitespace-nowrap">{trx.date}</td>
                    <td className="p-4">
                      <div className="font-medium text-gray-900">{trx.note}</div>
                      <div className="text-xs text-gray-400 print:hidden">{trx.type === 'DEBIT' ? 'Setoran Tunai' : 'Penarikan Tunai'}</div>
                    </td>
                    <td className={`p-4 text-right font-bold ${trx.type === 'DEBIT' ? 'text-green-600' : 'text-red-600'} print:text-black`}>
                      {trx.type === 'DEBIT' ? '+' : '-'} Rp {trx.amount.toLocaleString('id-ID')}
                    </td>
                    <td className="p-4 text-center">
                       <span className={`px-2 py-1 rounded text-xs font-medium ${trx.type === 'DEBIT' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} print:hidden`}>
                         Berhasil
                       </span>
                       <span className="hidden print:inline">Sukses</span>
                    </td>
                    {currentUser.role === 'admin' && <td className="p-4 text-gray-500">{trx.userId}</td>}
                  </tr>
                )) : (
                  <tr><td colSpan="5" className="p-12 text-center text-gray-400 bg-gray-50/30">Belum ada data transaksi yang sesuai filter.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Hidden: Only used when "Cetak Struk" triggered */}
      <div className="hidden">
        <PrintReceipt transaction={lastTransaction} user={currentUser} />
      </div>
    </div>
  );
}