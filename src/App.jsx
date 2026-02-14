import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, collection, doc, setDoc, getDoc, 
  onSnapshot, updateDoc, addDoc, serverTimestamp, 
} from 'firebase/firestore';
import { 
  getAuth, signInAnonymously, onAuthStateChanged 
} from 'firebase/auth';
import { 
  Camera, LogOut, Printer, Shield, User, ArrowUpCircle, 
  ArrowDownCircle, Lock, UserPlus, FileText, 
  Users, Landmark, Activity, ShieldCheck, 
  TrendingUp, BarChart3, AlertCircle, CreditCard, RefreshCw
} from 'lucide-react';

// --- KONFIGURASI FIREBASE ---
// Mengambil kunci rahasia dari Environment Variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = 'bank-digital-pro-v2'; 

export default function App() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [allTransactions, setAllTransactions] = useState([]); 
  const [view, setView] = useState('login'); 
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  // States untuk Form
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [regForm, setRegForm] = useState({ nama: '', username: '', password: '' });
  const [authError, setAuthError] = useState('');

  // 1. Inisialisasi Auth
  useEffect(() => {
    const initAuth = async () => {
      try {
        await signInAnonymously(auth);
      } catch (err) {
        console.error("Auth Error:", err);
      }
    };
    initAuth();

    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      const savedSession = localStorage.getItem('bank_session');
      if (!savedSession) {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // 2. Real-time Sync Data User & Transaksi Pribadi
  useEffect(() => {
    const savedSession = localStorage.getItem('bank_session');
    if (!user || !savedSession) return;

    // Listener Data User
    const userDocRef = doc(db, 'artifacts', appId, 'public', 'data', 'users', savedSession);
    const unsubUser = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setUserData(data);
        
        // Cek Status Blokir secara Real-time
        if (data.status === 'diblokir') {
          handleLogout();
          alert("Akun Anda telah dinonaktifkan oleh administrator.");
        } else {
          // Arahkan ke view yang sesuai jika baru login
          if (view === 'login' || view === 'register') {
            setView(data.role === 'admin' ? 'admin' : 'dashboard');
          }
        }
      } else {
        // Jika data di DB dihapus, logout paksa
        localStorage.removeItem('bank_session');
        setView('login');
      }
      setLoading(false);
    }, (error) => {
      console.error("User Snapshot Error:", error);
      setLoading(false);
    });

    // Listener Transaksi User (Filter by Username)
    const transRef = collection(db, 'artifacts', appId, 'public', 'data', 'transactions');
    const unsubTrans = onSnapshot(transRef, (snap) => {
      const list = snap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter(t => t.username === savedSession)
        .sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0));
      setTransactions(list);
    }, (err) => console.error("Trans Sync Error:", err));

    return () => { unsubUser(); unsubTrans(); };
  }, [user, view === 'login']);

  // 3. Listener Khusus Admin (Monitoring Seluruh Sistem)
  useEffect(() => {
    if (!user || userData?.role !== 'admin') return;

    // Sync Semua User
    const usersRef = collection(db, 'artifacts', appId, 'public', 'data', 'users');
    const unsubAllUsers = onSnapshot(usersRef, (snap) => {
      setAllUsers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (err) => console.error("Admin Users Sync Error:", err));

    // Sync Semua Transaksi
    const allTransRef = collection(db, 'artifacts', appId, 'public', 'data', 'transactions');
    const unsubAllTrans = onSnapshot(allTransRef, (snap) => {
      const allT = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setAllTransactions(allT.sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0)));
    }, (err) => console.error("Admin Trans Sync Error:", err));

    return () => { unsubAllUsers(); unsubAllTrans(); };
  }, [user, userData]);

  // --- LOGIKA FUNGSIONAL ---

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    setIsProcessing(true);
    try {
      // Logic Login Admin Default
      if (isAdminLogin && loginForm.username === 'admin' && loginForm.password === 'admin123') {
        const adminRef = doc(db, 'artifacts', appId, 'public', 'data', 'users', 'admin');
        const adminSnap = await getDoc(adminRef);
        if (!adminSnap.exists()) {
          await setDoc(adminRef, {
            nama: 'Super Admin',
            username: 'admin',
            password: 'admin123',
            saldo: 0,
            role: 'admin',
            status: 'aktif',
            photoUrl: `https://ui-avatars.com/api/?name=Admin&background=000&color=fff`
          });
        }
        localStorage.setItem('bank_session', 'admin');
        setView('admin');
        setIsProcessing(false);
        return;
      }

      // Login User Biasa / Admin Terdaftar
      const userRef = doc(db, 'artifacts', appId, 'public', 'data', 'users', loginForm.username);
      const snap = await getDoc(userRef);
      
      if (snap.exists()) {
        const data = snap.data();
        if (data.password === loginForm.password) {
          if (isAdminLogin && data.role !== 'admin') {
            setAuthError("Maaf, akun Anda tidak terdaftar sebagai Administrator.");
          } else if (data.status === 'diblokir') {
            setAuthError("Akses ditolak. Akun Anda sedang dalam status blokir.");
          } else {
            localStorage.setItem('bank_session', data.username);
            setUserData(data);
            setView(data.role === 'admin' ? 'admin' : 'dashboard');
          }
        } else {
          setAuthError("Password yang Anda masukkan salah.");
        }
      } else {
        setAuthError("Username tidak ditemukan di database kami.");
      }
    } catch (err) {
      setAuthError("Terjadi kendala pada koneksi server.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setAuthError('');
    setIsProcessing(true);
    try {
      const targetUsername = regForm.username.toLowerCase().trim().replace(/\s/g, '');
      const userRef = doc(db, 'artifacts', appId, 'public', 'data', 'users', targetUsername);
      const snap = await getDoc(userRef);
      
      if (snap.exists()) {
        setAuthError("Username ini sudah digunakan oleh orang lain.");
      } else {
        const newUser = {
          nama: regForm.nama,
          username: targetUsername,
          password: regForm.password,
          saldo: 500000, // Saldo awal promosi
          role: 'user',
          status: 'aktif',
          photoUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(regForm.nama)}&background=random`
        };
        await setDoc(userRef, newUser);
        
        // Log transaksi saldo awal
        await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'transactions'), {
          username: targetUsername,
          nama: regForm.nama,
          type: 'simpan',
          amount: 500000,
          timestamp: serverTimestamp(),
          note: 'Bonus Registrasi Akun Baru'
        });

        localStorage.setItem('bank_session', targetUsername);
        setUserData(newUser);
        setView('dashboard');
      }
    } catch (err) {
      setAuthError("Gagal memproses pendaftaran. Coba lagi.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTransaction = async (type) => {
    if (!amount || amount <= 0 || isProcessing) return;
    const nominal = parseInt(amount);
    
    if (type === 'tarik' && userData.saldo < nominal) {
      alert("Saldo tidak mencukupi untuk melakukan penarikan.");
      return;
    }

    setIsProcessing(true);
    try {
      const newSaldo = type === 'simpan' ? userData.saldo + nominal : userData.saldo - nominal;
      
      // Update Saldo
      await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'users', userData.username), { 
        saldo: newSaldo 
      });
      
      // Catat Mutasi
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'transactions'), {
        username: userData.username,
        nama: userData.nama,
        type: type,
        amount: nominal,
        timestamp: serverTimestamp()
      });
      
      setAmount('');
    } catch (err) {
      alert("Gagal memproses transaksi. Periksa koneksi Anda.");
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleUserStatus = async (targetUser, currentStatus) => {
    if (isProcessing) return;
    const nextStatus = currentStatus === 'aktif' ? 'diblokir' : 'aktif';
    try {
      await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'users', targetUser), { 
        status: nextStatus 
      });
    } catch (err) {
      console.error(err);
    }
  };

  const promoteToAdmin = async (targetUser) => {
    if (!confirm(`Promosikan @${targetUser} menjadi Administrator?`)) return;
    try {
      await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'users', targetUser), { 
        role: 'admin' 
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('bank_session');
    setUserData(null);
    setView('login');
    setIsAdminLogin(false);
    setLoginForm({ username: '', password: '' });
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    const dateStr = new Date().toLocaleDateString('id-ID', { dateStyle: 'full' });
    const html = `
      <html>
        <head>
          <title>Mutasi Rekening - ${userData.nama}</title>
          <style>
            body { font-family: sans-serif; padding: 40px; color: #334155; }
            .header { text-align: center; border-bottom: 2px solid #3b82f6; padding-bottom: 20px; margin-bottom: 30px; }
            .info { margin-bottom: 30px; display: flex; justify-content: space-between; }
            table { width: 100%; border-collapse: collapse; }
            th { text-align: left; padding: 12px; border-bottom: 2px solid #e2e8f0; font-size: 14px; text-transform: uppercase; }
            td { padding: 12px; border-bottom: 1px solid #f1f5f9; font-size: 13px; }
            .amount { font-weight: bold; }
            .plus { color: #10b981; }
            .minus { color: #ef4444; }
            .footer { margin-top: 50px; text-align: center; font-size: 10px; color: #94a3b8; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 style="margin:0; color:#1d4ed8;">BANK DIGITAL PRO</h1>
            <p style="margin:5px 0 0 0;">Laporan Mutasi Rekening Elektronik</p>
          </div>
          <div class="info">
            <div>
              <strong>Nama Nasabah:</strong> ${userData.nama}<br>
              <strong>ID User:</strong> @${userData.username}
            </div>
            <div style="text-align:right;">
              <strong>Tanggal Cetak:</strong> ${dateStr}<br>
              <strong>Saldo Saat Ini:</strong> Rp ${userData.saldo.toLocaleString('id-ID')}
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Tanggal & Waktu</th>
                <th>Keterangan</th>
                <th>Nominal (IDR)</th>
              </tr>
            </thead>
            <tbody>
              ${transactions.map(t => `
                <tr>
                  <td>${t.timestamp?.toDate().toLocaleString('id-ID')}</td>
                  <td>${t.type === 'simpan' ? 'SETORAN TUNAI' : 'PENARIKAN TUNAI'}</td>
                  <td class="amount ${t.type === 'simpan' ? 'plus' : 'minus'}">
                    ${t.type === 'simpan' ? '+' : '-'} ${t.amount.toLocaleString('id-ID')}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="footer">Dokumen ini dihasilkan secara otomatis oleh sistem Bank Digital Pro dan sah sebagai bukti mutasi.</div>
          <script>window.onload = () => { window.print(); window.close(); }</script>
        </body>
      </html>
    `;
    printWindow.document.write(html);
    printWindow.document.close();
  };

  if (loading && !userData) {
    return (
      <div className="flex flex-col h-screen items-center justify-center bg-blue-50">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="font-black text-blue-800 animate-pulse uppercase tracking-[0.2em] text-xs">Menghubungkan ke Server...</p>
      </div>
    );
  }

  // View: Login / Register
  if (view === 'login' || view === 'register') {
    return (
      <div className={`flex min-h-screen items-center justify-center p-6 transition-colors duration-700 ${isAdminLogin ? 'bg-slate-950' : 'bg-blue-600'}`}>
        <div className="w-full max-w-md bg-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
          <div className="text-center mb-10">
            <div className={`mx-auto w-20 h-20 rounded-[2rem] flex items-center justify-center mb-6 shadow-xl transform rotate-3 transition-colors ${isAdminLogin ? 'bg-slate-900 text-white' : 'bg-blue-600 text-white'}`}>
              {isAdminLogin ? <Shield size={40} /> : <Landmark size={40} />}
            </div>
            <h1 className="text-4xl font-black text-slate-800 tracking-tighter">BANK DIGITAL</h1>
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em] mt-1">{isAdminLogin ? 'Administrator Access' : 'Secure Banking Service'}</p>
          </div>

          <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-8">
            <button onClick={() => {setIsAdminLogin(false); setAuthError('');}} className={`flex-1 py-3 text-[10px] font-black rounded-xl transition-all ${!isAdminLogin ? 'bg-white text-blue-600 shadow-lg' : 'text-slate-400'}`}>NASABAH</button>
            <button onClick={() => {setIsAdminLogin(true); setAuthError('');}} className={`flex-1 py-3 text-[10px] font-black rounded-xl transition-all ${isAdminLogin ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400'}`}>ADMIN</button>
          </div>

          {authError && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-[11px] font-bold border border-red-100 flex items-center gap-2"><AlertCircle size={16}/> {authError}</div>}

          {view === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 ml-4 uppercase tracking-widest">Username</label>
                <div className="relative group">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500" size={18} />
                  <input type="text" placeholder="ID Akun" required className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-500 transition-all font-bold outline-none" value={loginForm.username} onChange={e => setLoginForm({...loginForm, username: e.target.value})} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 ml-4 uppercase tracking-widest">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500" size={18} />
                  <input type="password" placeholder="••••••••" required className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-500 transition-all font-bold outline-none" value={loginForm.password} onChange={e => setLoginForm({...loginForm, password: e.target.value})} />
                </div>
              </div>
              <button disabled={isProcessing} type="submit" className={`w-full py-5 rounded-2xl font-black text-white shadow-xl transform active:scale-95 transition-all mt-4 flex items-center justify-center gap-3 ${isAdminLogin ? 'bg-slate-900 hover:bg-black' : 'bg-blue-600 hover:bg-blue-700'}`}>
                {isProcessing ? <RefreshCw className="animate-spin" size={20}/> : (isAdminLogin ? 'OTENTIKASI ADMIN' : 'MASUK SEKARANG')}
              </button>
              {!isAdminLogin && (
                <p className="text-center text-xs text-slate-400 mt-6 font-bold uppercase tracking-widest">Nasabah Baru? <button type="button" onClick={() => setView('register')} className="text-blue-600 font-black">Buat Akun</button></p>
              )}
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <input type="text" placeholder="Nama Lengkap Sesuai KTP" required className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-500 transition-all font-bold outline-none" value={regForm.nama} onChange={e => setRegForm({...regForm, nama: e.target.value})} />
              <input type="text" placeholder="Username Pilihan" required className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-500 transition-all font-bold outline-none" value={regForm.username} onChange={e => setRegForm({...regForm, username: e.target.value})} />
              <input type="password" placeholder="Password Kuat" required className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-500 transition-all font-bold outline-none" value={regForm.password} onChange={e => setRegForm({...regForm, password: e.target.value})} />
              <button disabled={isProcessing} type="submit" className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black shadow-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-3">
                {isProcessing ? <RefreshCw className="animate-spin" size={20}/> : <><UserPlus size={20} /> DAFTAR NASABAH</>}
              </button>
              <p className="text-center text-xs text-slate-400 mt-6 font-bold uppercase tracking-widest">Sudah Punya Akun? <button type="button" onClick={() => setView('login')} className="text-blue-600 font-black">Login</button></p>
            </form>
          )}
        </div>
      </div>
    );
  }

  // --- DASHBOARD UI ---
  return (
    <div className="min-h-screen bg-[#f1f5f9] pb-32">
      {/* Dynamic Header */}
      <div className={`${view === 'admin' ? 'bg-slate-900' : 'bg-blue-700'} px-8 pt-12 pb-32 text-white rounded-b-[4rem] shadow-2xl relative transition-all duration-500`}>
        <div className="relative flex items-center justify-between z-10">
          <div className="flex items-center gap-5">
            <div className="relative group">
              <img src={userData?.photoUrl} className="h-16 w-16 rounded-[1.5rem] border-2 border-white/30 object-cover shadow-lg transition-transform group-hover:scale-105" alt="Profile" />
              <div className="absolute -bottom-2 -right-2 bg-white text-slate-900 p-1.5 rounded-xl shadow-lg border border-slate-100"><Camera size={12}/></div>
            </div>
            <div>
              <p className="text-[10px] font-black tracking-[0.3em] opacity-60 uppercase">Selamat Datang</p>
              <h2 className="text-2xl font-black tracking-tighter leading-none">{userData?.nama}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest ${userData?.role === 'admin' ? 'bg-amber-400 text-slate-900' : 'bg-blue-500 text-white'}`}>{userData?.role}</span>
                <span className="text-[9px] font-bold opacity-60">ID: @{userData?.username}</span>
              </div>
            </div>
          </div>
          <button onClick={handleLogout} className="w-12 h-12 flex items-center justify-center bg-white/10 rounded-2xl hover:bg-rose-500 transition-all border border-white/10 group"><LogOut size={20} className="group-hover:scale-110" /></button>
        </div>
        <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none"><Landmark size={200} /></div>
      </div>

      <div className="px-6 -mt-24 relative z-20 space-y-6">
        {view === 'dashboard' ? (
          <>
            {/* Card Saldo Digital */}
            <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl border border-white flex flex-col items-center justify-center text-center relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-indigo-600"></div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3">Total Saldo Efektif</p>
               <h3 className="text-5xl font-black text-slate-900 tracking-tighter mb-4 flex items-center gap-3">
                 <span className="text-2xl text-slate-300">Rp</span> 
                 {userData?.saldo?.toLocaleString('id-ID')}
               </h3>
               <div className="flex gap-2 items-center text-xs font-bold text-emerald-500 bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-100">
                 <ShieldCheck size={14}/> Sistem Aman & Terenkripsi
               </div>
            </div>

            {/* Panel Manajemen Dana */}
            <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-white">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl shadow-inner"><TrendingUp size={24}/></div>
                <div>
                  <h4 className="font-black text-slate-800 tracking-tight">MANAJEMEN KEUANGAN</h4>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Transaksi Setor & Tarik</p>
                </div>
              </div>
              <div className="relative group">
                <CreditCard className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={24}/>
                <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0" className="w-full bg-slate-50 border-2 border-transparent rounded-3xl pl-16 pr-8 py-6 text-3xl font-black text-slate-900 focus:bg-white focus:border-blue-500 transition-all outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4 mt-6">
                <button disabled={isProcessing} onClick={() => handleTransaction('simpan')} className="bg-emerald-500 hover:bg-emerald-600 active:scale-95 py-6 rounded-[1.5rem] font-black text-white shadow-xl shadow-emerald-100 transition-all flex items-center justify-center gap-3">
                  {isProcessing ? <RefreshCw className="animate-spin"/> : <><ArrowUpCircle size={22}/> SETOR</>}
                </button>
                <button disabled={isProcessing} onClick={() => handleTransaction('tarik')} className="bg-rose-500 hover:bg-rose-600 active:scale-95 py-6 rounded-[1.5rem] font-black text-white shadow-xl shadow-rose-100 transition-all flex items-center justify-center gap-3">
                  {isProcessing ? <RefreshCw className="animate-spin"/> : <><ArrowDownCircle size={22}/> TARIK</>}
                </button>
              </div>
            </div>

            {/* Riwayat Mutasi */}
            <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-white">
              <div className="flex items-center justify-between mb-8 border-b border-slate-50 pb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-slate-50 text-slate-600 rounded-2xl"><Activity size={22}/></div>
                  <h4 className="font-black text-slate-800 tracking-tight">RIWAYAT AKTIVITAS</h4>
                </div>
                <button onClick={handlePrint} className="flex items-center gap-2 bg-blue-50 text-blue-600 px-5 py-3 rounded-2xl font-black text-[10px] tracking-widest hover:bg-blue-100 transition-all border border-blue-100"><Printer size={16}/> CETAK MUTASI</button>
              </div>
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scroll">
                {transactions.length === 0 ? (
                  <div className="text-center py-20 flex flex-col items-center opacity-30">
                    <FileText size={60} className="mb-4 text-slate-300"/>
                    <p className="text-slate-500 font-black text-xs uppercase tracking-widest">Belum ada aktivitas tercatat</p>
                  </div>
                ) : (
                  transactions.map(t => (
                    <div key={t.id} className="flex items-center justify-between p-5 bg-slate-50 rounded-3xl hover:bg-white border-2 border-transparent hover:border-slate-100 transition-all group shadow-sm hover:shadow-md">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black shadow-inner ${t.type === 'simpan' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                          {t.type === 'simpan' ? <ArrowUpCircle size={20}/> : <ArrowDownCircle size={20}/>}
                        </div>
                        <div>
                          <p className="font-black text-slate-800 uppercase text-[10px] tracking-widest mb-1">{t.type === 'simpan' ? 'Setoran Masuk' : 'Penarikan Dana'}</p>
                          <p className="text-[10px] font-bold text-slate-400">{t.timestamp?.toDate().toLocaleString('id-ID')}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-black text-lg ${t.type === 'simpan' ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {t.type === 'simpan' ? '+' : '-'} {t.amount.toLocaleString('id-ID')}
                        </p>
                        <p className="text-[8px] font-bold text-slate-300 uppercase">BERHASIL</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        ) : (
          /* PANEL ADMIN AKTIF */
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-white group hover:bg-slate-900 transition-colors duration-500">
                <div className="p-3 bg-indigo-50 text-indigo-600 w-fit rounded-2xl mb-4 group-hover:bg-indigo-500 group-hover:text-white transition-colors"><BarChart3 size={24}/></div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">TOTAL DANA NASABAH</p>
                <p className="text-xl font-black text-slate-900 group-hover:text-white transition-colors">Rp {allUsers.reduce((s, u) => s + (u.saldo || 0), 0).toLocaleString('id-ID')}</p>
              </div>
              <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-white group hover:bg-slate-900 transition-colors duration-500">
                <div className="p-3 bg-violet-50 text-violet-600 w-fit rounded-2xl mb-4 group-hover:bg-violet-500 group-hover:text-white transition-colors"><Users size={24}/></div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">NASABAH TERDAFTAR</p>
                <p className="text-xl font-black text-slate-900 group-hover:text-white transition-colors">{allUsers.length} <span className="text-[10px] font-bold text-slate-300">JIWA</span></p>
              </div>
            </div>

            <div className="bg-slate-900 p-10 rounded-[2.5rem] shadow-2xl text-white relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none"><ShieldCheck size={120} /></div>
               <div className="flex items-center justify-between mb-6">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em]">Traffic Monitoring</p>
                    <h3 className="text-4xl font-black tracking-tighter">{allTransactions.length} Aktivitas</h3>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full animate-ping"></div>
                    <span className="text-[10px] font-black uppercase tracking-widest">Sistem Online</span>
                  </div>
               </div>
               <p className="text-slate-400 text-xs font-medium max-w-[250px] leading-relaxed">Seluruh data disinkronkan secara real-time melalui enkripsi database Bank Digital Pro.</p>
            </div>

            {/* Monitoring Nasabah */}
            <div className="bg-white rounded-[2.5rem] p-10 shadow-xl border border-white">
               <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-slate-950 text-white rounded-[1.2rem] shadow-lg shadow-slate-200"><Shield size={22}/></div>
                    <h4 className="font-black text-slate-800 tracking-tight">KONTROL KEAMANAN</h4>
                  </div>
                  <div className="flex gap-2">
                    <span className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl text-[9px] font-black border border-emerald-100">{allUsers.filter(u=>u.status==='aktif').length} AKTIF</span>
                    <span className="bg-rose-50 text-rose-600 px-4 py-2 rounded-xl text-[9px] font-black border border-rose-100">{allUsers.filter(u=>u.status!=='aktif').length} BLOKIR</span>
                  </div>
               </div>
               
               <div className="space-y-6 max-h-[600px] overflow-y-auto pr-3 custom-scroll">
                  {allUsers.map(u => (
                    <div key={u.username} className={`p-6 rounded-[2rem] border-2 transition-all ${u.status === 'diblokir' ? 'bg-rose-50/20 border-rose-100 grayscale' : 'bg-slate-50 border-transparent hover:bg-white hover:border-slate-100 hover:shadow-xl'}`}>
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                          <img src={u.photoUrl} className="h-14 w-14 rounded-2xl object-cover shadow-sm" alt="" />
                          <div>
                            <p className="font-black text-slate-800 text-lg leading-none mb-1">
                              {u.nama} {u.username === userData.username && <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg text-[8px] ml-1 uppercase">SAYA</span>}
                            </p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">@{u.username} • {u.role}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-black text-slate-900">Rp {u.saldo?.toLocaleString('id-ID')}</p>
                          <span className={`text-[8px] font-black px-2 py-1 rounded-full uppercase tracking-widest ${u.status === 'aktif' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>{u.status}</span>
                        </div>
                      </div>
                      
                      {u.username !== userData?.username && (
                        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-200/50">
                          <button 
                            disabled={isProcessing}
                            onClick={() => toggleUserStatus(u.username, u.status)} 
                            className={`py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${u.status === 'aktif' ? 'bg-rose-500 text-white shadow-lg shadow-rose-100' : 'bg-emerald-500 text-white shadow-lg shadow-emerald-100'}`}
                          >
                            {u.status === 'aktif' ? 'Nonaktifkan Akun' : 'Aktifkan Kembali'}
                          </button>
                          {u.role === 'user' && (
                            <button 
                              disabled={isProcessing}
                              onClick={() => promoteToAdmin(u.username)} 
                              className="py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-slate-100 hover:bg-black transition-all"
                            >Jadikan Admin</button>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
               </div>
            </div>

            {/* Log Global */}
            <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-white mt-8">
              <h4 className="font-black text-slate-800 tracking-tight mb-8 px-2 uppercase text-xs tracking-[0.2em] border-l-4 border-blue-600 pl-4">Audit Transaksi Terkini</h4>
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-3 custom-scroll">
                {allTransactions.slice(0, 15).map(t => (
                  <div key={t.id} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border-2 border-transparent">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-[10px] font-black shadow-sm ${t.type === 'simpan' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                        {t.type === 'simpan' ? 'IN' : 'OUT'}
                      </div>
                      <div>
                        <p className="font-black text-xs text-slate-800 uppercase leading-none mb-1">{t.nama || t.username}</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase">{t.timestamp?.toDate().toLocaleString()}</p>
                      </div>
                    </div>
                    <p className={`font-black text-sm tracking-tight ${t.type === 'simpan' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {t.type === 'simpan' ? '+' : '-'} {t.amount.toLocaleString('id-ID')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modern Floating Bottom Nav */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-3xl border border-white/40 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.15)] rounded-[3rem] px-10 py-5 flex items-center gap-16 z-50">
        <button onClick={() => setView('dashboard')} className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${view === 'dashboard' ? 'text-blue-600 scale-110' : 'text-slate-300 hover:text-slate-500'}`}>
          <div className={`p-2.5 rounded-2xl transition-all ${view === 'dashboard' ? 'bg-blue-100/50' : 'bg-transparent'}`}>
            <User size={24} strokeWidth={view === 'dashboard' ? 3 : 2} />
          </div>
          <span className={`text-[8px] font-black uppercase tracking-[0.2em] ${view === 'dashboard' ? 'opacity-100' : 'opacity-0'}`}>Dompet</span>
        </button>
        {userData?.role === 'admin' && (
          <button onClick={() => setView('admin')} className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${view === 'admin' ? 'text-slate-900 scale-110' : 'text-slate-300 hover:text-slate-500'}`}>
            <div className={`p-2.5 rounded-2xl transition-all ${view === 'admin' ? 'bg-slate-100' : 'bg-transparent'}`}>
              <ShieldCheck size={24} strokeWidth={view === 'admin' ? 3 : 2} />
            </div>
            <span className={`text-[8px] font-black uppercase tracking-[0.2em] ${view === 'admin' ? 'opacity-100' : 'opacity-0'}`}>Sistem</span>
          </button>
        )}
      </div>

      <style>{`
        .custom-scroll::-webkit-scrollbar { width: 5px; }
        .custom-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-scroll::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 20px; }
        .custom-scroll::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
        input[type=number]::-webkit-inner-spin-button, 
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
      `}</style>
    </div>
  );
}