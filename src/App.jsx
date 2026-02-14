import React, { useState } from 'react';
import { Wallet, LogOut, ArrowUpCircle, ArrowDownCircle, Send, Shield, Calendar, Download, Printer } from 'lucide-react';
import Login from './components/Login';
import { INITIAL_USERS, INITIAL_TRANSACTIONS, GOOGLE_SCRIPT_URL } from './constants/mockData';
import { printStyles } from './constants/styles';

export default function App() {
  const [auth, setAuth] = useState(null); 
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [transferTo, setTransferTo] = useState('');
  const [dateFilter, setDateFilter] = useState({ start: '', end: '' });
  const [transactionType, setTransactionType] = useState('DEBIT');

  const handleLogin = (id) => {
    const user = INITIAL_USERS.find(u => u.id === id);
    setAuth({ userId: id, data: user });
  };

  const handleLogout = () => {
    setAuth(null);
  };

  const filteredTransactions = auth ? transactions.filter(t => {
    const isOwnTransaction = auth.data.role === 'admin' || t.userId === auth.userId;
    const isInDateRange = 
      (!dateFilter.start || t.date >= dateFilter.start) && 
      (!dateFilter.end || t.date <= dateFilter.end);
    return isOwnTransaction && isInDateRange;
  }) : [];

  const handleTransaction = async (type, targetAcc = null) => {
    const val = parseInt(amount);
    if (!val || val <= 0) return alert("Masukkan jumlah yang valid");
    if ((type === 'KREDIT' || type === 'TRANSFER') && auth.data.balance < val) return alert("Saldo tidak mencukupi!");

    const newTrx = {
      id: Date.now(),
      userId: auth.data.id,
      type: type === 'TRANSFER' ? 'KREDIT' : type,
      amount: val,
      date: new Date().toISOString().split('T')[0],
      note: note || (type === 'DEBIT' ? 'Setoran' : type === 'TRANSFER' ? `Transfer ke ${targetAcc}` : 'Penarikan')
    };

    setTransactions([newTrx, ...transactions]);
    setAuth(prev => ({
      ...prev,
      data: {
        ...prev.data,
        balance: (type === 'DEBIT') ? prev.data.balance + val : prev.data.balance - val
      }
    }));

    setAmount('');
    setNote('');
    setTransferTo('');
    alert("Transaksi Berhasil!");
  };

  const exportToCSV = () => {
    const headers = ['ID', 'User ID', 'Tipe', 'Jumlah', 'Tanggal', 'Catatan'];
    const csv = [headers.join(','), ...filteredTransactions.map(t => 
      [t.id, t.userId, t.type, t.amount, t.date, t.note].join(',')
    )].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'laporan-transaksi.csv';
    a.click();
  };

  if (!auth) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <style>{printStyles}</style>
      {/* NAVBAR */}
      <nav className="bg-blue-800 text-white p-4 shadow-xl no-print flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-2 font-bold text-xl">
          <Wallet className="text-blue-300" /> BankApp 
          <span className="text-[10px] bg-blue-500 px-2 py-0.5 rounded ml-2 uppercase tracking-widest">{auth.data.role}</span>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className="hidden sm:inline font-medium text-blue-100">Halo, {auth.data.name}</span>
          <button onClick={handleLogout} className="flex items-center gap-1 bg-rose-600 px-3 py-1.5 rounded-lg hover:bg-rose-700 transition font-bold">
            <LogOut size={16} /> Keluar
          </button>
        </div>
      </nav>

      <div className="container mx-auto p-4 sm:p-6">
        {/* DASHBOARD NASABAH */}
        {auth.data.role === 'user' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 no-print">
            <div className="lg:col-span-1 bg-gradient-to-br from-blue-700 to-blue-900 p-6 rounded-2xl shadow-lg text-white">
              {/* Profile Photo */}
              <div className="flex justify-center mb-6">
                <img 
                  src={auth.data.photo} 
                  alt={auth.data.name}
                  className="w-24 h-24 rounded-full border-4 border-blue-300 shadow-lg object-cover"
                />
              </div>
              <h3 className="text-center text-lg font-bold mb-4">{auth.data.name}</h3>
              <h3 className="text-blue-200 text-xs font-bold uppercase tracking-widest">Saldo Anda</h3>
              <p className="text-3xl font-extrabold mt-2">Rp {auth.data.balance.toLocaleString()}</p>
              <div className="mt-4 pt-4 border-t border-blue-600/50">
                <p className="text-[10px] text-blue-300">NOMOR REKENING</p>
                <p className="text-sm font-mono tracking-tighter">{auth.data.accountNo}</p>
              </div>
            </div>

            <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold mb-5 text-gray-800">Lakukan Transaksi</h2>
              
              {/* Pilihan Tipe Transaksi */}
              <div className="flex gap-3 mb-5">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" value="DEBIT" checked={transactionType === 'DEBIT'} onChange={(e) => { setTransactionType(e.target.value); setAmount(''); setTransferTo(''); }} className="w-4 h-4" />
                  <span className="text-sm font-medium text-emerald-600 flex items-center gap-1"><ArrowUpCircle size={16} /> Setoran</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" value="KREDIT" checked={transactionType === 'KREDIT'} onChange={(e) => { setTransactionType(e.target.value); setAmount(''); setTransferTo(''); }} className="w-4 h-4" />
                  <span className="text-sm font-medium text-rose-600 flex items-center gap-1"><ArrowDownCircle size={16} /> Penarikan</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" value="TRANSFER" checked={transactionType === 'TRANSFER'} onChange={(e) => { setTransactionType(e.target.value); setAmount(''); setTransferTo(''); }} className="w-4 h-4" />
                  <span className="text-sm font-medium text-indigo-600 flex items-center gap-1"><Send size={16} /> Transfer</span>
                </label>
              </div>

              {/* Form Input */}
              <div className="space-y-4">
                {transactionType === 'TRANSFER' && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Nomor Rekening Tujuan</label>
                    <input 
                      type="text" 
                      placeholder="Masukkan nomor rekening tujuan" 
                      className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                      value={transferTo} 
                      onChange={e => setTransferTo(e.target.value)} 
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Jumlah (Rp)</label>
                  <input 
                    type="number" 
                    placeholder="Rp 0" 
                    className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    value={amount} 
                    onChange={e => setAmount(e.target.value)} 
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Catatan/Keterangan</label>
                  <input 
                    type="text" 
                    placeholder="Opsional" 
                    className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500" 
                    value={note} 
                    onChange={e => setNote(e.target.value)} 
                  />
                </div>
              </div>

              {/* Button Proses */}
              <button 
                onClick={() => {
                  if (transactionType === 'TRANSFER') {
                    handleTransaction('TRANSFER', transferTo);
                  } else {
                    handleTransaction(transactionType);
                  }
                }}
                className={`w-full mt-6 text-white py-3 rounded-lg font-bold transition-all ${
                  transactionType === 'DEBIT' ? 'bg-emerald-500 hover:bg-emerald-600' :
                  transactionType === 'KREDIT' ? 'bg-rose-500 hover:bg-rose-600' :
                  'bg-indigo-500 hover:bg-indigo-600'
                }`}
              >
                {transactionType === 'DEBIT' ? 'Proses Setoran' : transactionType === 'KREDIT' ? 'Proses Penarikan' : 'Kirim Transfer'}
              </button>
            </div>
          </div>
        )}

        {/* DASHBOARD ADMIN INFO */}
        {auth.data.role === 'admin' && (
          <div className="bg-amber-50 p-6 rounded-2xl border border-amber-200 mb-8 flex items-center gap-4 no-print shadow-sm">
             <div className="bg-amber-100 p-3 rounded-full text-amber-600"><Shield size={24}/></div>
             <div>
               <h2 className="font-bold text-amber-900">Mode Monitoring Admin</h2>
               <p className="text-sm text-amber-700">Menampilkan seluruh riwayat transaksi dari semua nasabah terdaftar.</p>
             </div>
          </div>
        )}

        {/* MUTASI REKENING */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="p-5 border-b flex flex-col md:flex-row justify-between items-center gap-4 no-print bg-white">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Calendar size={22} className="text-blue-600" /> Mutasi & Laporan
            </h2>
            
            <div className="flex flex-wrap gap-2 items-center justify-center">
              <div className="flex items-center bg-gray-100 rounded-lg px-2 border">
                <input type="date" className="bg-transparent p-2 text-xs focus:outline-none" onChange={(e) => setDateFilter({...dateFilter, start: e.target.value})} />
                <span className="text-gray-400 mx-1">-</span>
                <input type="date" className="bg-transparent p-2 text-xs focus:outline-none" onChange={(e) => setDateFilter({...dateFilter, end: e.target.value})} />
              </div>
              <button onClick={exportToCSV} className="bg-emerald-600 text-white px-3 py-2 rounded-lg flex items-center gap-2 hover:bg-emerald-700 transition shadow-sm text-xs font-bold">
                <Download size={14} /> CSV
              </button>
              <button onClick={() => window.print()} className="bg-gray-800 text-white px-3 py-2 rounded-lg flex items-center gap-2 hover:bg-black transition shadow-sm text-xs font-bold">
                <Printer size={14} /> Cetak
              </button>
            </div>
          </div>

          <div className="p-4 sm:p-8">
            {/* Header Laporan Print */}
            <div className="hidden print:block text-center border-b-2 border-gray-800 pb-6 mb-8">
              <h1 className="text-4xl font-black uppercase tracking-tighter text-blue-800">Bank Digital</h1>
              <p className="text-gray-500 text-sm">Laporan Mutasi - {new Date().toLocaleDateString()}</p>
              <div className="grid grid-cols-2 mt-8 text-left text-sm p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="text-gray-400 uppercase text-[10px] font-bold">Pemilik Rekening</p>
                  <p className="font-bold text-lg">{auth.data.name}</p>
                  <p className="font-mono">{auth.data.accountNo}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-400 uppercase text-[10px] font-bold">Periode Laporan</p>
                  <p className="font-bold">{dateFilter.start || 'Awal'} s/d {dateFilter.end || 'Sekarang'}</p>
                  <p className="text-blue-600 font-bold">Saldo Akhir: Rp {auth.data.balance.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-gray-400 uppercase text-[10px] tracking-widest border-b">
                  <th className="p-4">Tanggal</th>
                  <th className="p-4">Deskripsi</th>
                  {auth.data.role === 'admin' && <th className="p-4 text-center">UID</th>}
                  <th className="p-4 text-right">Mutasi (IDR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredTransactions.length > 0 ? filteredTransactions.map((trx) => (
                  <tr key={trx.id} className="hover:bg-gray-50/80 transition-all">
                    <td className="p-4 text-xs font-medium text-gray-500 italic">{trx.date}</td>
                    <td className="p-4">
                      <div className="font-bold text-gray-800 text-sm">{trx.note}</div>
                      <div className={`text-[10px] inline-block px-2 py-0.5 rounded-full mt-1 ${trx.type === 'DEBIT' ? 'bg-green-100 text-green-700' : 'bg-rose-100 text-rose-700'}`}>
                        {trx.type === 'DEBIT' ? 'Masuk' : 'Keluar'}
                      </div>
                    </td>
                    {auth.data.role === 'admin' && <td className="p-4 text-center font-mono text-xs text-blue-600">{trx.userId}</td>}
                    <td className={`p-4 text-right font-black text-sm ${trx.type === 'DEBIT' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {trx.type === 'DEBIT' ? '+' : '-'} {trx.amount.toLocaleString()}
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="4" className="p-16 text-center text-gray-400 text-sm italic">Belum ada aktivitas transaksi.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}