import React, { useState, useEffect } from 'react';
import { Wallet, LogOut, ArrowUpCircle, ArrowDownCircle, Printer, Calendar, User, Shield } from 'lucide-react';
import { format } from 'date-fns';

// --- MOCK DATA & UTILS ---
const INITIAL_USERS = [
  { id: 1, name: 'User Nasabah', role: 'user', balance: 5000000, accountNo: '123-456-789' },
  { id: 2, name: 'Admin Bank', role: 'admin', balance: 0, accountNo: 'ADMIN-001' }
];

const INITIAL_TRANSACTIONS = [
  { id: 1, userId: 1, type: 'DEBIT', amount: 5000000, date: '2023-10-01', note: 'Setoran Awal' },
  { id: 2, userId: 1, type: 'KREDIT', amount: 200000, date: '2023-10-05', note: 'Tarik Tunai ATM' }
];

// --- COMPONENTS ---

// 1. Component Login
const Login = ({ onLogin }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <div className="bg-white p-8 rounded-lg shadow-md w-96">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Bank App Login</h2>
      <div className="space-y-4">
        <button onClick={() => onLogin('user')} className="w-full bg-blue-500 hover:bg-blue-600 text-white p-3 rounded flex justify-center items-center gap-2">
          <User size={20} /> Login sebagai Nasabah
        </button>
        <button onClick={() => onLogin('admin')} className="w-full bg-gray-800 hover:bg-gray-900 text-white p-3 rounded flex justify-center items-center gap-2">
          <Shield size={20} /> Login sebagai Admin
        </button>
      </div>
    </div>
  </div>
);

// 2. Component Receipt (Bukti Transaksi - Hidden until print)
const PrintReceipt = ({ transaction, user }) => {
  if (!transaction) return null;
  return (
    <div className="hidden print:block p-8 border border-black m-4">
      <h1 className="text-2xl font-bold text-center mb-4">BUKTI TRANSAKSI</h1>
      <p>Tanggal: {transaction.date}</p>
      <p>No. Ref: TRX-{transaction.id}</p>
      <p>Nama: {user.name}</p>
      <p>Jenis: {transaction.type === 'DEBIT' ? 'SETORAN' : 'PENARIKAN'}</p>
      <p className="text-xl font-bold mt-4">Jumlah: Rp {transaction.amount.toLocaleString()}</p>
      <p className="mt-2">Keterangan: {transaction.note}</p>
      <div className="mt-8 text-center text-sm border-t pt-4">Simpan resi ini sebagai bukti yang sah.</div>
    </div>
  );
};

// 3. Main App Logic
export default function App() {
  const [user, setUser] = useState(null); // 'user' or 'admin'
  const [currentUserData, setCurrentUserData] = useState(null);
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [dateFilter, setDateFilter] = useState({ start: '', end: '' });
  const [lastTransaction, setLastTransaction] = useState(null);

  // Fungsi Login Simulasi
  const handleLogin = (role) => {
    const loggedInUser = INITIAL_USERS.find(u => u.role === role);
    setUser(role);
    setCurrentUserData(loggedInUser);
  };

  // Fungsi Transaksi (Setor/Tarik)
  const handleTransaction = (type) => {
    if (!amount || amount <= 0) return alert("Masukkan jumlah valid");
    if (type === 'KREDIT' && currentUserData.balance < amount) return alert("Saldo tidak cukup");

    const newTrx = {
      id: Date.now(),
      userId: currentUserData.id,
      type,
      amount: parseInt(amount),
      date: new Date().toISOString().split('T')[0],
      note: note || (type === 'DEBIT' ? 'Setor Tunai' : 'Tarik Tunai')
    };

    setTransactions([newTrx, ...transactions]);
    
    // Update Saldo User
    const newBalance = type === 'DEBIT' 
      ? currentUserData.balance + parseInt(amount) 
      : currentUserData.balance - parseInt(amount);
    
    setCurrentUserData({ ...currentUserData, balance: newBalance });
    setLastTransaction(newTrx); // Untuk cetak resi terakhir
    setAmount('');
    setNote('');
    
    // Auto print prompt (optional)
    setTimeout(() => {
      if(confirm("Transaksi berhasil. Cetak struk?")) window.print();
    }, 100);
  };

  // Filter Logika
  const filteredTransactions = transactions.filter(t => {
    // Jika admin, lihat semua. Jika user, lihat punya sendiri.
    if (user === 'user' && t.userId !== currentUserData.id) return false;
    
    // Filter tanggal
    if (dateFilter.start && t.date < dateFilter.start) return false;
    if (dateFilter.end && t.date > dateFilter.end) return false;
    
    return true;
  });

  const handlePrintStatement = () => {
    window.print();
  };

  if (!user) return <Login onLogin={handleLogin} />;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Print Area: Receipt Only visible when printing specific receipt */}
      <div className="hidden print:block">
         {/* Logic print khusus bisa ditambahkan disini, saat ini print akan mencetak layar aktif */}
      </div>

      {/* Navbar (No Print) */}
      <nav className="bg-blue-700 text-white p-4 shadow-lg no-print flex justify-between items-center">
        <div className="flex items-center gap-2 font-bold text-xl">
          <Wallet /> Bank App ({user === 'admin' ? 'ADMINISTRATOR' : 'NASABAH'})
        </div>
        <button onClick={() => setUser(null)} className="flex items-center gap-1 bg-red-500 px-3 py-1 rounded hover:bg-red-600 text-sm">
          <LogOut size={16} /> Keluar
        </button>
      </nav>

      <div className="container mx-auto p-6">
        
        {/* === USER DASHBOARD === */}
        {user === 'user' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 no-print">
            {/* Card Saldo */}
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
              <h3 className="text-gray-500 text-sm font-semibold">Saldo Rekening</h3>
              <p className="text-3xl font-bold text-gray-800 mt-2">Rp {currentUserData.balance.toLocaleString()}</p>
              <p className="text-xs text-gray-400 mt-1">{currentUserData.accountNo}</p>
            </div>

            {/* Form Setor */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="font-semibold flex items-center gap-2 mb-4 text-green-600"><ArrowUpCircle /> Setor Tabungan</h3>
              <input type="number" placeholder="Jumlah (Rp)" className="w-full border p-2 rounded mb-2" value={amount} onChange={e => setAmount(e.target.value)} />
              <input type="text" placeholder="Catatan" className="w-full border p-2 rounded mb-2" value={note} onChange={e => setNote(e.target.value)} />
              <button onClick={() => handleTransaction('DEBIT')} className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600">Proses Setor</button>
            </div>

            {/* Form Tarik */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="font-semibold flex items-center gap-2 mb-4 text-red-600"><ArrowDownCircle /> Tarik Tabungan</h3>
              <input type="number" placeholder="Jumlah (Rp)" className="w-full border p-2 rounded mb-2" value={amount} onChange={e => setAmount(e.target.value)} />
              <input type="text" placeholder="Catatan" className="w-full border p-2 rounded mb-2" value={note} onChange={e => setNote(e.target.value)} />
              <button onClick={() => handleTransaction('KREDIT')} className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600">Proses Tarik</button>
            </div>
          </div>
        )}

        {/* === ADMIN DASHBOARD INFO === */}
        {user === 'admin' && (
          <div className="bg-yellow-100 p-4 rounded-lg mb-6 border border-yellow-300 no-print">
            <h3 className="font-bold text-yellow-800">Mode Administrator</h3>
            <p>Anda dapat melihat seluruh transaksi nasabah di bawah ini.</p>
          </div>
        )}

        {/* === REKENING KORAN / MUTASI === */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-4 border-b flex flex-col md:flex-row justify-between items-center gap-4 no-print">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Calendar size={20} /> Rekening Koran / Mutasi
            </h2>
            
            {/* Filter Date */}
            <div className="flex gap-2 items-center">
              <input type="date" className="border p-2 rounded" onChange={(e) => setDateFilter({...dateFilter, start: e.target.value})} />
              <span>s/d</span>
              <input type="date" className="border p-2 rounded" onChange={(e) => setDateFilter({...dateFilter, end: e.target.value})} />
              
              <button onClick={handlePrintStatement} className="bg-gray-700 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-gray-800 ml-2">
                <Printer size={16} /> Cetak Laporan
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto p-4 print:p-0">
            {/* Header Laporan (Hanya muncul saat print) */}
            <div className="hidden print:block mb-6 text-center">
              <h1 className="text-2xl font-bold">LAPORAN REKENING KORAN</h1>
              <p>Periode: {dateFilter.start || 'Awal'} s/d {dateFilter.end || 'Sekarang'}</p>
            </div>

            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 border-b print:bg-white print:border-black">
                  <th className="p-3">Tanggal</th>
                  <th className="p-3">Keterangan</th>
                  <th className="p-3 text-right">Mutasi (Masuk/Keluar)</th>
                  {user === 'admin' && <th className="p-3">User ID</th>}
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.length > 0 ? filteredTransactions.map((trx) => (
                  <tr key={trx.id} className="border-b hover:bg-gray-50 print:border-black">
                    <td className="p-3">{trx.date}</td>
                    <td className="p-3">
                      <div className="font-medium">{trx.type === 'DEBIT' ? 'Setoran' : 'Penarikan'}</div>
                      <div className="text-xs text-gray-500">{trx.note}</div>
                    </td>
                    <td className={`p-3 text-right font-bold ${trx.type === 'DEBIT' ? 'text-green-600' : 'text-red-600'} print:text-black`}>
                      {trx.type === 'DEBIT' ? '+' : '-'} Rp {trx.amount.toLocaleString()}
                    </td>
                    {user === 'admin' && <td className="p-3">{trx.userId}</td>}
                  </tr>
                )) : (
                  <tr><td colSpan="4" className="p-8 text-center text-gray-500">Tidak ada data transaksi</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Hidden Layout for Receipt Printing specifically */}
      <div className="hidden">
        <PrintReceipt transaction={lastTransaction} user={currentUserData} />
      </div>
    </div>
  );
}