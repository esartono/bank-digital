import React, { useState } from 'react';
import { Wallet, LogOut, ArrowUpCircle, ArrowDownCircle, Printer, Calendar, User, Shield, Send, Download } from 'lucide-react';

// --- MOCK DATA ---
const INITIAL_USERS = [
  { id: 1, name: 'User Nasabah', role: 'user', balance: 5000000, accountNo: '123-456-789' },
  { id: 2, name: 'Nasabah Lain', role: 'user', balance: 2500000, accountNo: '987-654-321' },
  { id: 99, name: 'Admin Bank', role: 'admin', balance: 0, accountNo: 'ADMIN-001' }
];

const INITIAL_TRANSACTIONS = [
  { id: 1, userId: 1, type: 'DEBIT', amount: 5000000, date: '2023-10-01', note: 'Setoran Awal' },
  { id: 2, userId: 1, type: 'KREDIT', amount: 200000, date: '2023-10-05', note: 'Tarik Tunai ATM' }
];

// --- STYLES ---
const printStyles = `
  @media print {
    .no-print { display: none !important; }
    .print-only { display: block !important; }
    body { background: white; }
    .container { width: 100%; max-width: 100%; margin: 0; padding: 0; }
  }
`;

// --- COMPONENTS ---

const Login = ({ onLogin }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
    <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center border border-gray-200">
      <h2 className="text-3xl font-extrabold mb-8 text-blue-700 flex justify-center items-center gap-3">
        <Wallet size={32} /> Bank Syariah Digital
      </h2>
      <div className="space-y-4">
        <button onClick={() => onLogin(1)} className="w-full bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-xl flex justify-center items-center gap-3 transition-all font-semibold">
          <User size={22} /> Login sebagai Nasabah 1
        </button>
        <button onClick={() => onLogin(2)} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-xl flex justify-center items-center gap-3 transition-all font-semibold">
          <User size={22} /> Login sebagai Nasabah 2
        </button>
        <button onClick={() => onLogin(99)} className="w-full bg-gray-800 hover:bg-gray-900 text-white p-4 rounded-xl flex justify-center items-center gap-3 transition-all font-semibold">
          <Shield size={22} /> Login sebagai Admin
        </button>
      </div>
    </div>
  </div>
);

export default function App() {
  const [auth, setAuth] = useState(null); 
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [transferTo, setTransferTo] = useState('');
  const [dateFilter, setDateFilter] = useState({ start: '', end: '' });

  const handleLogin = (id) => {
    const found = INITIAL_USERS.find(u => u.id === id);
    setAuth({ role: found.role, data: { ...found } });
  };

  // Logic Transaksi Utama
  const handleTransaction = (type, targetAcc = null) => {
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
    setAuth({
      ...auth,
      data: {
        ...auth.data,
        balance: (type === 'DEBIT') ? auth.data.balance + val : auth.data.balance - val
      }
    });

    setAmount('');
    setNote('');
    setTransferTo('');
    alert("Transaksi Berhasil!");
  };

  // Fitur Ekspor CSV
  const exportToCSV = () => {
    const headers = ["Tanggal", "Keterangan", "User ID", "Tipe", "Jumlah"];
    const rows = filteredTransactions.map(t => [
      t.date, t.note, t.userId, t.type, t.amount
    ]);

    let csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n"
      + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Mutasi_Bank_${auth.data.name}.csv`);
    document.body.appendChild(link);
    link.click();
  };

  const filteredTransactions = transactions.filter(t => {
    if (auth.role === 'user' && t.userId !== auth.data.id) return false;
    if (dateFilter.start && t.date < dateFilter.start) return false;
    if (dateFilter.end && t.date > dateFilter.end) return false;
    return true;
  });

  if (!auth) return <Login onLogin={handleLogin} />;

  return (
    <div className="min-h-screen bg-slate-50 text-gray-800 pb-12">
      <style>{printStyles}</style>

      {/* NAVBAR */}
      <nav className="bg-blue-800 text-white p-4 shadow-xl no-print flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-2 font-bold text-xl">
          <Wallet className="text-blue-300" /> BankApp <span className="text-[10px] bg-blue-500 px-2 py-0.5 rounded ml-2 uppercase tracking-widest">{auth.role}</span>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className="hidden sm:inline font-medium">Halo, {auth.data.name}</span>
          <button onClick={() => setAuth(null)} className="flex items-center gap-1 bg-rose-600 px-3 py-1.5 rounded-lg hover:bg-rose-700 transition font-bold">
            <LogOut size={16} /> Keluar
          </button>
        </div>
      </nav>

      <div className="container mx-auto p-4 sm:p-6">
        {/* DASHBOARD NASABAH */}
        {auth.role === 'user' && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8 no-print">
              <div className="lg:col-span-1 bg-gradient-to-br from-blue-700 to-blue-900 p-6 rounded-2xl shadow-lg text-white">
                <h3 className="text-blue-200 text-xs font-bold uppercase tracking-widest">Saldo Anda</h3>
                <p className="text-3xl font-extrabold mt-2">Rp {auth.data.balance.toLocaleString()}</p>
                <div className="mt-4 pt-4 border-t border-blue-600/50">
                  <p className="text-[10px] text-blue-300">NOMOR REKENING</p>
                  <p className="text-sm font-mono tracking-tighter">{auth.data.accountNo}</p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="font-bold flex items-center gap-2 mb-3 text-emerald-600 text-sm"><ArrowUpCircle size={18}/> Setoran</h3>
                <input type="number" placeholder="Rp 0" className="w-full border p-2 rounded-lg mb-2" value={amount} onChange={e => setAmount(e.target.value)} />
                <button onClick={() => handleTransaction('DEBIT')} className="w-full bg-emerald-500 text-white py-2 rounded-lg font-bold hover:bg-emerald-600 transition text-sm">Proses</button>
              </div>

              <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="font-bold flex items-center gap-2 mb-3 text-rose-600 text-sm"><ArrowDownCircle size={18}/> Penarikan</h3>
                <input type="number" placeholder="Rp 0" className="w-full border p-2 rounded-lg mb-2" value={amount} onChange={e => setAmount(e.target.value)} />
                <button onClick={() => handleTransaction('KREDIT')} className="w-full bg-rose-500 text-white py-2 rounded-lg font-bold hover:bg-rose-600 transition text-sm">Proses</button>
              </div>

              <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="font-bold flex items-center gap-2 mb-3 text-indigo-600 text-sm"><Send size={18}/> Transfer</h3>
                <input type="text" placeholder="No. Rekening Tujuan" className="w-full border p-2 rounded-lg mb-2 text-xs" value={transferTo} onChange={e => setTransferTo(e.target.value)} />
                <input type="number" placeholder="Jumlah Rp" className="w-full border p-2 rounded-lg mb-2 text-xs" value={amount} onChange={e => setAmount(e.target.value)} />
                <button onClick={() => handleTransaction('TRANSFER', transferTo)} className="w-full bg-indigo-500 text-white py-2 rounded-lg font-bold hover:bg-indigo-600 transition text-sm">Kirim</button>
              </div>
            </div>
          </>
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
              <h1 className="text-4xl font-black uppercase tracking-tighter text-blue-800">Bank Syariah Digital</h1>
              <p className="text-gray-500 text-sm">Official Bank Statement - {new Date().toLocaleDateString()}</p>
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
                  {auth.role === 'admin' && <th className="p-4 text-center">UID</th>}
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
                        {trx.type === 'DEBIT' ? 'Kredit (Masuk)' : 'Debit (Keluar)'}
                      </div>
                    </td>
                    {auth.role === 'admin' && <td className="p-4 text-center font-mono text-xs text-blue-600">{trx.userId}</td>}
                    <td className={`p-4 text-right font-black text-sm ${trx.type === 'DEBIT' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {trx.type === 'DEBIT' ? '+' : '-'} {trx.amount.toLocaleString()}
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="4" className="p-16 text-center text-gray-400 text-sm italic">Belum ada aktivitas transaksi pada periode ini.</td>
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
