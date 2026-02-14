# Code Citations

## License: unknown
https://github.com/marcos-vcs/alura-tracker/blob/adfcd5b2f5b1481536b9933699c0b8d2897837f3/src/components/ExportarParaCsv.vue

```
# Memisahkan Modul ke File Terpisah

Ya, tentu! Saya akan membuat struktur folder yang lebih rapi dengan memisahkan komponen-komponen ke file terpisah.

## 📁 Struktur Folder yang Disarankan

```
src/
├── App.jsx (main component)
├── components/
│   ├── Login.jsx
│   ├── Dashboard.jsx
│   ├── TransactionForm.jsx
│   ├── TransactionReport.jsx
│   └── UserInfo.jsx
├── constants/
│   ├── mockData.js
│   └── styles.js
└── utils/
    ├── auth.js
    └── export.js
```

---

## 📄 File 1: `src/constants/mockData.js`

````javascript
// filepath: c:\Users\AWAL\bank-digital\src\constants\mockData.js

export const INITIAL_USERS = [
  { id: 1, name: 'User Nasabah', role: 'user', balance: 5000000, accountNo: '123-456-789' },
  { id: 2, name: 'Nasabah Lain', role: 'user', balance: 2500000, accountNo: '987-654-321' },
  { id: 99, name: 'Admin Bank', role: 'admin', balance: 0, accountNo: 'ADMIN-001' }
];

export const INITIAL_TRANSACTIONS = [
  { id: 1, userId: 1, type: 'DEBIT', amount: 5000000, date: '2023-10-01', note: 'Setoran Awal' },
  { id: 2, userId: 1, type: 'KREDIT', amount: 200000, date: '2023-10-05', note: 'Tarik Tunai ATM' }
];

export const LOGIN_CREDENTIALS = [
  { id: 1, username: 'nasabah1', password: 'pass123', name: 'User Nasabah' },
  { id: 2, username: 'nasabah2', password: 'pass123', name: 'Nasabah Lain' },
  { id: 99, username: 'admin', password: 'admin123', name: 'Admin Bank' }
];

export const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby1BUVlVFCggCtsXIBrg_0LnIes3Beh1ddrjHEU7C1F6TLXlbxFY0wsOHeizq-z09vq/exec';
````

---

## 📄 File 2: `src/constants/styles.js`

````javascript
// filepath: c:\Users\AWAL\bank-digital\src\constants\styles.js

export const printStyles = `
  @media print {
    .no-print { display: none !important; }
    .print-only { display: block !important; }
    body { background: white; }
    .container { width: 100%; max-width: 100%; margin: 0; padding: 0; }
  }
`;
````

---

## 📄 File 3: `src/components/Login.jsx`

````jsx
// filepath: c:\Users\AWAL\bank-digital\src\components\Login.jsx

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
````

---

## 📄 File 4: `src/App.jsx` (Diperbarui)

````jsx
// filepath: c:\Users\AWAL\bank-digital\src\App.jsx

import { useState } from 'react';
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
    a.download = 'laporan-
```


## License: unknown
https://github.com/marcos-vcs/alura-tracker/blob/adfcd5b2f5b1481536b9933699c0b8d2897837f3/src/components/ExportarParaCsv.vue

```
# Memisahkan Modul ke File Terpisah

Ya, tentu! Saya akan membuat struktur folder yang lebih rapi dengan memisahkan komponen-komponen ke file terpisah.

## 📁 Struktur Folder yang Disarankan

```
src/
├── App.jsx (main component)
├── components/
│   ├── Login.jsx
│   ├── Dashboard.jsx
│   ├── TransactionForm.jsx
│   ├── TransactionReport.jsx
│   └── UserInfo.jsx
├── constants/
│   ├── mockData.js
│   └── styles.js
└── utils/
    ├── auth.js
    └── export.js
```

---

## 📄 File 1: `src/constants/mockData.js`

````javascript
// filepath: c:\Users\AWAL\bank-digital\src\constants\mockData.js

export const INITIAL_USERS = [
  { id: 1, name: 'User Nasabah', role: 'user', balance: 5000000, accountNo: '123-456-789' },
  { id: 2, name: 'Nasabah Lain', role: 'user', balance: 2500000, accountNo: '987-654-321' },
  { id: 99, name: 'Admin Bank', role: 'admin', balance: 0, accountNo: 'ADMIN-001' }
];

export const INITIAL_TRANSACTIONS = [
  { id: 1, userId: 1, type: 'DEBIT', amount: 5000000, date: '2023-10-01', note: 'Setoran Awal' },
  { id: 2, userId: 1, type: 'KREDIT', amount: 200000, date: '2023-10-05', note: 'Tarik Tunai ATM' }
];

export const LOGIN_CREDENTIALS = [
  { id: 1, username: 'nasabah1', password: 'pass123', name: 'User Nasabah' },
  { id: 2, username: 'nasabah2', password: 'pass123', name: 'Nasabah Lain' },
  { id: 99, username: 'admin', password: 'admin123', name: 'Admin Bank' }
];

export const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby1BUVlVFCggCtsXIBrg_0LnIes3Beh1ddrjHEU7C1F6TLXlbxFY0wsOHeizq-z09vq/exec';
````

---

## 📄 File 2: `src/constants/styles.js`

````javascript
// filepath: c:\Users\AWAL\bank-digital\src\constants\styles.js

export const printStyles = `
  @media print {
    .no-print { display: none !important; }
    .print-only { display: block !important; }
    body { background: white; }
    .container { width: 100%; max-width: 100%; margin: 0; padding: 0; }
  }
`;
````

---

## 📄 File 3: `src/components/Login.jsx`

````jsx
// filepath: c:\Users\AWAL\bank-digital\src\components\Login.jsx

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
````

---

## 📄 File 4: `src/App.jsx` (Diperbarui)

````jsx
// filepath: c:\Users\AWAL\bank-digital\src\App.jsx

import { useState } from 'react';
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
    a.download = 'laporan-
```


## License: Apache-2.0
https://github.com/arkime/arkime/blob/5609d4ebde6b197f019d61244d9ec8b4646121a1/viewer/vueapp/src/components/spigraph/Spigraph.vue

```
# Memisahkan Modul ke File Terpisah

Ya, tentu! Saya akan membuat struktur folder yang lebih rapi dengan memisahkan komponen-komponen ke file terpisah.

## 📁 Struktur Folder yang Disarankan

```
src/
├── App.jsx (main component)
├── components/
│   ├── Login.jsx
│   ├── Dashboard.jsx
│   ├── TransactionForm.jsx
│   ├── TransactionReport.jsx
│   └── UserInfo.jsx
├── constants/
│   ├── mockData.js
│   └── styles.js
└── utils/
    ├── auth.js
    └── export.js
```

---

## 📄 File 1: `src/constants/mockData.js`

````javascript
// filepath: c:\Users\AWAL\bank-digital\src\constants\mockData.js

export const INITIAL_USERS = [
  { id: 1, name: 'User Nasabah', role: 'user', balance: 5000000, accountNo: '123-456-789' },
  { id: 2, name: 'Nasabah Lain', role: 'user', balance: 2500000, accountNo: '987-654-321' },
  { id: 99, name: 'Admin Bank', role: 'admin', balance: 0, accountNo: 'ADMIN-001' }
];

export const INITIAL_TRANSACTIONS = [
  { id: 1, userId: 1, type: 'DEBIT', amount: 5000000, date: '2023-10-01', note: 'Setoran Awal' },
  { id: 2, userId: 1, type: 'KREDIT', amount: 200000, date: '2023-10-05', note: 'Tarik Tunai ATM' }
];

export const LOGIN_CREDENTIALS = [
  { id: 1, username: 'nasabah1', password: 'pass123', name: 'User Nasabah' },
  { id: 2, username: 'nasabah2', password: 'pass123', name: 'Nasabah Lain' },
  { id: 99, username: 'admin', password: 'admin123', name: 'Admin Bank' }
];

export const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby1BUVlVFCggCtsXIBrg_0LnIes3Beh1ddrjHEU7C1F6TLXlbxFY0wsOHeizq-z09vq/exec';
````

---

## 📄 File 2: `src/constants/styles.js`

````javascript
// filepath: c:\Users\AWAL\bank-digital\src\constants\styles.js

export const printStyles = `
  @media print {
    .no-print { display: none !important; }
    .print-only { display: block !important; }
    body { background: white; }
    .container { width: 100%; max-width: 100%; margin: 0; padding: 0; }
  }
`;
````

---

## 📄 File 3: `src/components/Login.jsx`

````jsx
// filepath: c:\Users\AWAL\bank-digital\src\components\Login.jsx

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
````

---

## 📄 File 4: `src/App.jsx` (Diperbarui)

````jsx
// filepath: c:\Users\AWAL\bank-digital\src\App.jsx

import { useState } from 'react';
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
    a.download = 'laporan-
```


## License: unknown
https://github.com/marcos-vcs/alura-tracker/blob/adfcd5b2f5b1481536b9933699c0b8d2897837f3/src/components/ExportarParaCsv.vue

```
# Memisahkan Modul ke File Terpisah

Ya, tentu! Saya akan membuat struktur folder yang lebih rapi dengan memisahkan komponen-komponen ke file terpisah.

## 📁 Struktur Folder yang Disarankan

```
src/
├── App.jsx (main component)
├── components/
│   ├── Login.jsx
│   ├── Dashboard.jsx
│   ├── TransactionForm.jsx
│   ├── TransactionReport.jsx
│   └── UserInfo.jsx
├── constants/
│   ├── mockData.js
│   └── styles.js
└── utils/
    ├── auth.js
    └── export.js
```

---

## 📄 File 1: `src/constants/mockData.js`

````javascript
// filepath: c:\Users\AWAL\bank-digital\src\constants\mockData.js

export const INITIAL_USERS = [
  { id: 1, name: 'User Nasabah', role: 'user', balance: 5000000, accountNo: '123-456-789' },
  { id: 2, name: 'Nasabah Lain', role: 'user', balance: 2500000, accountNo: '987-654-321' },
  { id: 99, name: 'Admin Bank', role: 'admin', balance: 0, accountNo: 'ADMIN-001' }
];

export const INITIAL_TRANSACTIONS = [
  { id: 1, userId: 1, type: 'DEBIT', amount: 5000000, date: '2023-10-01', note: 'Setoran Awal' },
  { id: 2, userId: 1, type: 'KREDIT', amount: 200000, date: '2023-10-05', note: 'Tarik Tunai ATM' }
];

export const LOGIN_CREDENTIALS = [
  { id: 1, username: 'nasabah1', password: 'pass123', name: 'User Nasabah' },
  { id: 2, username: 'nasabah2', password: 'pass123', name: 'Nasabah Lain' },
  { id: 99, username: 'admin', password: 'admin123', name: 'Admin Bank' }
];

export const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby1BUVlVFCggCtsXIBrg_0LnIes3Beh1ddrjHEU7C1F6TLXlbxFY0wsOHeizq-z09vq/exec';
````

---

## 📄 File 2: `src/constants/styles.js`

````javascript
// filepath: c:\Users\AWAL\bank-digital\src\constants\styles.js

export const printStyles = `
  @media print {
    .no-print { display: none !important; }
    .print-only { display: block !important; }
    body { background: white; }
    .container { width: 100%; max-width: 100%; margin: 0; padding: 0; }
  }
`;
````

---

## 📄 File 3: `src/components/Login.jsx`

````jsx
// filepath: c:\Users\AWAL\bank-digital\src\components\Login.jsx

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
````

---

## 📄 File 4: `src/App.jsx` (Diperbarui)

````jsx
// filepath: c:\Users\AWAL\bank-digital\src\App.jsx

import { useState } from 'react';
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
    a.download = 'laporan-
```


## License: Apache-2.0
https://github.com/arkime/arkime/blob/5609d4ebde6b197f019d61244d9ec8b4646121a1/viewer/vueapp/src/components/spigraph/Spigraph.vue

```
# Memisahkan Modul ke File Terpisah

Ya, tentu! Saya akan membuat struktur folder yang lebih rapi dengan memisahkan komponen-komponen ke file terpisah.

## 📁 Struktur Folder yang Disarankan

```
src/
├── App.jsx (main component)
├── components/
│   ├── Login.jsx
│   ├── Dashboard.jsx
│   ├── TransactionForm.jsx
│   ├── TransactionReport.jsx
│   └── UserInfo.jsx
├── constants/
│   ├── mockData.js
│   └── styles.js
└── utils/
    ├── auth.js
    └── export.js
```

---

## 📄 File 1: `src/constants/mockData.js`

````javascript
// filepath: c:\Users\AWAL\bank-digital\src\constants\mockData.js

export const INITIAL_USERS = [
  { id: 1, name: 'User Nasabah', role: 'user', balance: 5000000, accountNo: '123-456-789' },
  { id: 2, name: 'Nasabah Lain', role: 'user', balance: 2500000, accountNo: '987-654-321' },
  { id: 99, name: 'Admin Bank', role: 'admin', balance: 0, accountNo: 'ADMIN-001' }
];

export const INITIAL_TRANSACTIONS = [
  { id: 1, userId: 1, type: 'DEBIT', amount: 5000000, date: '2023-10-01', note: 'Setoran Awal' },
  { id: 2, userId: 1, type: 'KREDIT', amount: 200000, date: '2023-10-05', note: 'Tarik Tunai ATM' }
];

export const LOGIN_CREDENTIALS = [
  { id: 1, username: 'nasabah1', password: 'pass123', name: 'User Nasabah' },
  { id: 2, username: 'nasabah2', password: 'pass123', name: 'Nasabah Lain' },
  { id: 99, username: 'admin', password: 'admin123', name: 'Admin Bank' }
];

export const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby1BUVlVFCggCtsXIBrg_0LnIes3Beh1ddrjHEU7C1F6TLXlbxFY0wsOHeizq-z09vq/exec';
````

---

## 📄 File 2: `src/constants/styles.js`

````javascript
// filepath: c:\Users\AWAL\bank-digital\src\constants\styles.js

export const printStyles = `
  @media print {
    .no-print { display: none !important; }
    .print-only { display: block !important; }
    body { background: white; }
    .container { width: 100%; max-width: 100%; margin: 0; padding: 0; }
  }
`;
````

---

## 📄 File 3: `src/components/Login.jsx`

````jsx
// filepath: c:\Users\AWAL\bank-digital\src\components\Login.jsx

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
````

---

## 📄 File 4: `src/App.jsx` (Diperbarui)

````jsx
// filepath: c:\Users\AWAL\bank-digital\src\App.jsx

import { useState } from 'react';
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
    a.download = 'laporan-
```


## License: unknown
https://github.com/marcos-vcs/alura-tracker/blob/adfcd5b2f5b1481536b9933699c0b8d2897837f3/src/components/ExportarParaCsv.vue

```
# Memisahkan Modul ke File Terpisah

Ya, tentu! Saya akan membuat struktur folder yang lebih rapi dengan memisahkan komponen-komponen ke file terpisah.

## 📁 Struktur Folder yang Disarankan

```
src/
├── App.jsx (main component)
├── components/
│   ├── Login.jsx
│   ├── Dashboard.jsx
│   ├── TransactionForm.jsx
│   ├── TransactionReport.jsx
│   └── UserInfo.jsx
├── constants/
│   ├── mockData.js
│   └── styles.js
└── utils/
    ├── auth.js
    └── export.js
```

---

## 📄 File 1: `src/constants/mockData.js`

````javascript
// filepath: c:\Users\AWAL\bank-digital\src\constants\mockData.js

export const INITIAL_USERS = [
  { id: 1, name: 'User Nasabah', role: 'user', balance: 5000000, accountNo: '123-456-789' },
  { id: 2, name: 'Nasabah Lain', role: 'user', balance: 2500000, accountNo: '987-654-321' },
  { id: 99, name: 'Admin Bank', role: 'admin', balance: 0, accountNo: 'ADMIN-001' }
];

export const INITIAL_TRANSACTIONS = [
  { id: 1, userId: 1, type: 'DEBIT', amount: 5000000, date: '2023-10-01', note: 'Setoran Awal' },
  { id: 2, userId: 1, type: 'KREDIT', amount: 200000, date: '2023-10-05', note: 'Tarik Tunai ATM' }
];

export const LOGIN_CREDENTIALS = [
  { id: 1, username: 'nasabah1', password: 'pass123', name: 'User Nasabah' },
  { id: 2, username: 'nasabah2', password: 'pass123', name: 'Nasabah Lain' },
  { id: 99, username: 'admin', password: 'admin123', name: 'Admin Bank' }
];

export const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby1BUVlVFCggCtsXIBrg_0LnIes3Beh1ddrjHEU7C1F6TLXlbxFY0wsOHeizq-z09vq/exec';
````

---

## 📄 File 2: `src/constants/styles.js`

````javascript
// filepath: c:\Users\AWAL\bank-digital\src\constants\styles.js

export const printStyles = `
  @media print {
    .no-print { display: none !important; }
    .print-only { display: block !important; }
    body { background: white; }
    .container { width: 100%; max-width: 100%; margin: 0; padding: 0; }
  }
`;
````

---

## 📄 File 3: `src/components/Login.jsx`

````jsx
// filepath: c:\Users\AWAL\bank-digital\src\components\Login.jsx

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
````

---

## 📄 File 4: `src/App.jsx` (Diperbarui)

````jsx
// filepath: c:\Users\AWAL\bank-digital\src\App.jsx

import { useState } from 'react';
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
    a.download = 'laporan-
```


## License: Apache-2.0
https://github.com/arkime/arkime/blob/5609d4ebde6b197f019d61244d9ec8b4646121a1/viewer/vueapp/src/components/spigraph/Spigraph.vue

```
# Memisahkan Modul ke File Terpisah

Ya, tentu! Saya akan membuat struktur folder yang lebih rapi dengan memisahkan komponen-komponen ke file terpisah.

## 📁 Struktur Folder yang Disarankan

```
src/
├── App.jsx (main component)
├── components/
│   ├── Login.jsx
│   ├── Dashboard.jsx
│   ├── TransactionForm.jsx
│   ├── TransactionReport.jsx
│   └── UserInfo.jsx
├── constants/
│   ├── mockData.js
│   └── styles.js
└── utils/
    ├── auth.js
    └── export.js
```

---

## 📄 File 1: `src/constants/mockData.js`

````javascript
// filepath: c:\Users\AWAL\bank-digital\src\constants\mockData.js

export const INITIAL_USERS = [
  { id: 1, name: 'User Nasabah', role: 'user', balance: 5000000, accountNo: '123-456-789' },
  { id: 2, name: 'Nasabah Lain', role: 'user', balance: 2500000, accountNo: '987-654-321' },
  { id: 99, name: 'Admin Bank', role: 'admin', balance: 0, accountNo: 'ADMIN-001' }
];

export const INITIAL_TRANSACTIONS = [
  { id: 1, userId: 1, type: 'DEBIT', amount: 5000000, date: '2023-10-01', note: 'Setoran Awal' },
  { id: 2, userId: 1, type: 'KREDIT', amount: 200000, date: '2023-10-05', note: 'Tarik Tunai ATM' }
];

export const LOGIN_CREDENTIALS = [
  { id: 1, username: 'nasabah1', password: 'pass123', name: 'User Nasabah' },
  { id: 2, username: 'nasabah2', password: 'pass123', name: 'Nasabah Lain' },
  { id: 99, username: 'admin', password: 'admin123', name: 'Admin Bank' }
];

export const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby1BUVlVFCggCtsXIBrg_0LnIes3Beh1ddrjHEU7C1F6TLXlbxFY0wsOHeizq-z09vq/exec';
````

---

## 📄 File 2: `src/constants/styles.js`

````javascript
// filepath: c:\Users\AWAL\bank-digital\src\constants\styles.js

export const printStyles = `
  @media print {
    .no-print { display: none !important; }
    .print-only { display: block !important; }
    body { background: white; }
    .container { width: 100%; max-width: 100%; margin: 0; padding: 0; }
  }
`;
````

---

## 📄 File 3: `src/components/Login.jsx`

````jsx
// filepath: c:\Users\AWAL\bank-digital\src\components\Login.jsx

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
````

---

## 📄 File 4: `src/App.jsx` (Diperbarui)

````jsx
// filepath: c:\Users\AWAL\bank-digital\src\App.jsx

import { useState } from 'react';
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
    a.download = 'laporan-
```


## License: unknown
https://github.com/marcos-vcs/alura-tracker/blob/adfcd5b2f5b1481536b9933699c0b8d2897837f3/src/components/ExportarParaCsv.vue

```
# Memisahkan Modul ke File Terpisah

Ya, tentu! Saya akan membuat struktur folder yang lebih rapi dengan memisahkan komponen-komponen ke file terpisah.

## 📁 Struktur Folder yang Disarankan

```
src/
├── App.jsx (main component)
├── components/
│   ├── Login.jsx
│   ├── Dashboard.jsx
│   ├── TransactionForm.jsx
│   ├── TransactionReport.jsx
│   └── UserInfo.jsx
├── constants/
│   ├── mockData.js
│   └── styles.js
└── utils/
    ├── auth.js
    └── export.js
```

---

## 📄 File 1: `src/constants/mockData.js`

````javascript
// filepath: c:\Users\AWAL\bank-digital\src\constants\mockData.js

export const INITIAL_USERS = [
  { id: 1, name: 'User Nasabah', role: 'user', balance: 5000000, accountNo: '123-456-789' },
  { id: 2, name: 'Nasabah Lain', role: 'user', balance: 2500000, accountNo: '987-654-321' },
  { id: 99, name: 'Admin Bank', role: 'admin', balance: 0, accountNo: 'ADMIN-001' }
];

export const INITIAL_TRANSACTIONS = [
  { id: 1, userId: 1, type: 'DEBIT', amount: 5000000, date: '2023-10-01', note: 'Setoran Awal' },
  { id: 2, userId: 1, type: 'KREDIT', amount: 200000, date: '2023-10-05', note: 'Tarik Tunai ATM' }
];

export const LOGIN_CREDENTIALS = [
  { id: 1, username: 'nasabah1', password: 'pass123', name: 'User Nasabah' },
  { id: 2, username: 'nasabah2', password: 'pass123', name: 'Nasabah Lain' },
  { id: 99, username: 'admin', password: 'admin123', name: 'Admin Bank' }
];

export const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby1BUVlVFCggCtsXIBrg_0LnIes3Beh1ddrjHEU7C1F6TLXlbxFY0wsOHeizq-z09vq/exec';
````

---

## 📄 File 2: `src/constants/styles.js`

````javascript
// filepath: c:\Users\AWAL\bank-digital\src\constants\styles.js

export const printStyles = `
  @media print {
    .no-print { display: none !important; }
    .print-only { display: block !important; }
    body { background: white; }
    .container { width: 100%; max-width: 100%; margin: 0; padding: 0; }
  }
`;
````

---

## 📄 File 3: `src/components/Login.jsx`

````jsx
// filepath: c:\Users\AWAL\bank-digital\src\components\Login.jsx

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
````

---

## 📄 File 4: `src/App.jsx` (Diperbarui)

````jsx
// filepath: c:\Users\AWAL\bank-digital\src\App.jsx

import { useState } from 'react';
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
    a.download = 'laporan-
```


## License: Apache-2.0
https://github.com/arkime/arkime/blob/5609d4ebde6b197f019d61244d9ec8b4646121a1/viewer/vueapp/src/components/spigraph/Spigraph.vue

```
# Memisahkan Modul ke File Terpisah

Ya, tentu! Saya akan membuat struktur folder yang lebih rapi dengan memisahkan komponen-komponen ke file terpisah.

## 📁 Struktur Folder yang Disarankan

```
src/
├── App.jsx (main component)
├── components/
│   ├── Login.jsx
│   ├── Dashboard.jsx
│   ├── TransactionForm.jsx
│   ├── TransactionReport.jsx
│   └── UserInfo.jsx
├── constants/
│   ├── mockData.js
│   └── styles.js
└── utils/
    ├── auth.js
    └── export.js
```

---

## 📄 File 1: `src/constants/mockData.js`

````javascript
// filepath: c:\Users\AWAL\bank-digital\src\constants\mockData.js

export const INITIAL_USERS = [
  { id: 1, name: 'User Nasabah', role: 'user', balance: 5000000, accountNo: '123-456-789' },
  { id: 2, name: 'Nasabah Lain', role: 'user', balance: 2500000, accountNo: '987-654-321' },
  { id: 99, name: 'Admin Bank', role: 'admin', balance: 0, accountNo: 'ADMIN-001' }
];

export const INITIAL_TRANSACTIONS = [
  { id: 1, userId: 1, type: 'DEBIT', amount: 5000000, date: '2023-10-01', note: 'Setoran Awal' },
  { id: 2, userId: 1, type: 'KREDIT', amount: 200000, date: '2023-10-05', note: 'Tarik Tunai ATM' }
];

export const LOGIN_CREDENTIALS = [
  { id: 1, username: 'nasabah1', password: 'pass123', name: 'User Nasabah' },
  { id: 2, username: 'nasabah2', password: 'pass123', name: 'Nasabah Lain' },
  { id: 99, username: 'admin', password: 'admin123', name: 'Admin Bank' }
];

export const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby1BUVlVFCggCtsXIBrg_0LnIes3Beh1ddrjHEU7C1F6TLXlbxFY0wsOHeizq-z09vq/exec';
````

---

## 📄 File 2: `src/constants/styles.js`

````javascript
// filepath: c:\Users\AWAL\bank-digital\src\constants\styles.js

export const printStyles = `
  @media print {
    .no-print { display: none !important; }
    .print-only { display: block !important; }
    body { background: white; }
    .container { width: 100%; max-width: 100%; margin: 0; padding: 0; }
  }
`;
````

---

## 📄 File 3: `src/components/Login.jsx`

````jsx
// filepath: c:\Users\AWAL\bank-digital\src\components\Login.jsx

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
````

---

## 📄 File 4: `src/App.jsx` (Diperbarui)

````jsx
// filepath: c:\Users\AWAL\bank-digital\src\App.jsx

import { useState } from 'react';
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
    a.download = 'laporan-
```


## License: unknown
https://github.com/marcos-vcs/alura-tracker/blob/adfcd5b2f5b1481536b9933699c0b8d2897837f3/src/components/ExportarParaCsv.vue

```
# Memisahkan Modul ke File Terpisah

Ya, tentu! Saya akan membuat struktur folder yang lebih rapi dengan memisahkan komponen-komponen ke file terpisah.

## 📁 Struktur Folder yang Disarankan

```
src/
├── App.jsx (main component)
├── components/
│   ├── Login.jsx
│   ├── Dashboard.jsx
│   ├── TransactionForm.jsx
│   ├── TransactionReport.jsx
│   └── UserInfo.jsx
├── constants/
│   ├── mockData.js
│   └── styles.js
└── utils/
    ├── auth.js
    └── export.js
```

---

## 📄 File 1: `src/constants/mockData.js`

````javascript
// filepath: c:\Users\AWAL\bank-digital\src\constants\mockData.js

export const INITIAL_USERS = [
  { id: 1, name: 'User Nasabah', role: 'user', balance: 5000000, accountNo: '123-456-789' },
  { id: 2, name: 'Nasabah Lain', role: 'user', balance: 2500000, accountNo: '987-654-321' },
  { id: 99, name: 'Admin Bank', role: 'admin', balance: 0, accountNo: 'ADMIN-001' }
];

export const INITIAL_TRANSACTIONS = [
  { id: 1, userId: 1, type: 'DEBIT', amount: 5000000, date: '2023-10-01', note: 'Setoran Awal' },
  { id: 2, userId: 1, type: 'KREDIT', amount: 200000, date: '2023-10-05', note: 'Tarik Tunai ATM' }
];

export const LOGIN_CREDENTIALS = [
  { id: 1, username: 'nasabah1', password: 'pass123', name: 'User Nasabah' },
  { id: 2, username: 'nasabah2', password: 'pass123', name: 'Nasabah Lain' },
  { id: 99, username: 'admin', password: 'admin123', name: 'Admin Bank' }
];

export const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby1BUVlVFCggCtsXIBrg_0LnIes3Beh1ddrjHEU7C1F6TLXlbxFY0wsOHeizq-z09vq/exec';
````

---

## 📄 File 2: `src/constants/styles.js`

````javascript
// filepath: c:\Users\AWAL\bank-digital\src\constants\styles.js

export const printStyles = `
  @media print {
    .no-print { display: none !important; }
    .print-only { display: block !important; }
    body { background: white; }
    .container { width: 100%; max-width: 100%; margin: 0; padding: 0; }
  }
`;
````

---

## 📄 File 3: `src/components/Login.jsx`

````jsx
// filepath: c:\Users\AWAL\bank-digital\src\components\Login.jsx

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
````

---

## 📄 File 4: `src/App.jsx` (Diperbarui)

````jsx
// filepath: c:\Users\AWAL\bank-digital\src\App.jsx

import { useState } from 'react';
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
    a.download = 'laporan-
```


## License: Apache-2.0
https://github.com/arkime/arkime/blob/5609d4ebde6b197f019d61244d9ec8b4646121a1/viewer/vueapp/src/components/spigraph/Spigraph.vue

```
# Memisahkan Modul ke File Terpisah

Ya, tentu! Saya akan membuat struktur folder yang lebih rapi dengan memisahkan komponen-komponen ke file terpisah.

## 📁 Struktur Folder yang Disarankan

```
src/
├── App.jsx (main component)
├── components/
│   ├── Login.jsx
│   ├── Dashboard.jsx
│   ├── TransactionForm.jsx
│   ├── TransactionReport.jsx
│   └── UserInfo.jsx
├── constants/
│   ├── mockData.js
│   └── styles.js
└── utils/
    ├── auth.js
    └── export.js
```

---

## 📄 File 1: `src/constants/mockData.js`

````javascript
// filepath: c:\Users\AWAL\bank-digital\src\constants\mockData.js

export const INITIAL_USERS = [
  { id: 1, name: 'User Nasabah', role: 'user', balance: 5000000, accountNo: '123-456-789' },
  { id: 2, name: 'Nasabah Lain', role: 'user', balance: 2500000, accountNo: '987-654-321' },
  { id: 99, name: 'Admin Bank', role: 'admin', balance: 0, accountNo: 'ADMIN-001' }
];

export const INITIAL_TRANSACTIONS = [
  { id: 1, userId: 1, type: 'DEBIT', amount: 5000000, date: '2023-10-01', note: 'Setoran Awal' },
  { id: 2, userId: 1, type: 'KREDIT', amount: 200000, date: '2023-10-05', note: 'Tarik Tunai ATM' }
];

export const LOGIN_CREDENTIALS = [
  { id: 1, username: 'nasabah1', password: 'pass123', name: 'User Nasabah' },
  { id: 2, username: 'nasabah2', password: 'pass123', name: 'Nasabah Lain' },
  { id: 99, username: 'admin', password: 'admin123', name: 'Admin Bank' }
];

export const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby1BUVlVFCggCtsXIBrg_0LnIes3Beh1ddrjHEU7C1F6TLXlbxFY0wsOHeizq-z09vq/exec';
````

---

## 📄 File 2: `src/constants/styles.js`

````javascript
// filepath: c:\Users\AWAL\bank-digital\src\constants\styles.js

export const printStyles = `
  @media print {
    .no-print { display: none !important; }
    .print-only { display: block !important; }
    body { background: white; }
    .container { width: 100%; max-width: 100%; margin: 0; padding: 0; }
  }
`;
````

---

## 📄 File 3: `src/components/Login.jsx`

````jsx
// filepath: c:\Users\AWAL\bank-digital\src\components\Login.jsx

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
````

---

## 📄 File 4: `src/App.jsx` (Diperbarui)

````jsx
// filepath: c:\Users\AWAL\bank-digital\src\App.jsx

import { useState } from 'react';
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
    a.download = 'laporan-
```


## License: unknown
https://github.com/marcos-vcs/alura-tracker/blob/adfcd5b2f5b1481536b9933699c0b8d2897837f3/src/components/ExportarParaCsv.vue

```
# Memisahkan Modul ke File Terpisah

Ya, tentu! Saya akan membuat struktur folder yang lebih rapi dengan memisahkan komponen-komponen ke file terpisah.

## 📁 Struktur Folder yang Disarankan

```
src/
├── App.jsx (main component)
├── components/
│   ├── Login.jsx
│   ├── Dashboard.jsx
│   ├── TransactionForm.jsx
│   ├── TransactionReport.jsx
│   └── UserInfo.jsx
├── constants/
│   ├── mockData.js
│   └── styles.js
└── utils/
    ├── auth.js
    └── export.js
```

---

## 📄 File 1: `src/constants/mockData.js`

````javascript
// filepath: c:\Users\AWAL\bank-digital\src\constants\mockData.js

export const INITIAL_USERS = [
  { id: 1, name: 'User Nasabah', role: 'user', balance: 5000000, accountNo: '123-456-789' },
  { id: 2, name: 'Nasabah Lain', role: 'user', balance: 2500000, accountNo: '987-654-321' },
  { id: 99, name: 'Admin Bank', role: 'admin', balance: 0, accountNo: 'ADMIN-001' }
];

export const INITIAL_TRANSACTIONS = [
  { id: 1, userId: 1, type: 'DEBIT', amount: 5000000, date: '2023-10-01', note: 'Setoran Awal' },
  { id: 2, userId: 1, type: 'KREDIT', amount: 200000, date: '2023-10-05', note: 'Tarik Tunai ATM' }
];

export const LOGIN_CREDENTIALS = [
  { id: 1, username: 'nasabah1', password: 'pass123', name: 'User Nasabah' },
  { id: 2, username: 'nasabah2', password: 'pass123', name: 'Nasabah Lain' },
  { id: 99, username: 'admin', password: 'admin123', name: 'Admin Bank' }
];

export const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby1BUVlVFCggCtsXIBrg_0LnIes3Beh1ddrjHEU7C1F6TLXlbxFY0wsOHeizq-z09vq/exec';
````

---

## 📄 File 2: `src/constants/styles.js`

````javascript
// filepath: c:\Users\AWAL\bank-digital\src\constants\styles.js

export const printStyles = `
  @media print {
    .no-print { display: none !important; }
    .print-only { display: block !important; }
    body { background: white; }
    .container { width: 100%; max-width: 100%; margin: 0; padding: 0; }
  }
`;
````

---

## 📄 File 3: `src/components/Login.jsx`

````jsx
// filepath: c:\Users\AWAL\bank-digital\src\components\Login.jsx

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
````

---

## 📄 File 4: `src/App.jsx` (Diperbarui)

````jsx
// filepath: c:\Users\AWAL\bank-digital\src\App.jsx

import { useState } from 'react';
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
    a.download = 'laporan-
```


## License: Apache-2.0
https://github.com/arkime/arkime/blob/5609d4ebde6b197f019d61244d9ec8b4646121a1/viewer/vueapp/src/components/spigraph/Spigraph.vue

```
# Memisahkan Modul ke File Terpisah

Ya, tentu! Saya akan membuat struktur folder yang lebih rapi dengan memisahkan komponen-komponen ke file terpisah.

## 📁 Struktur Folder yang Disarankan

```
src/
├── App.jsx (main component)
├── components/
│   ├── Login.jsx
│   ├── Dashboard.jsx
│   ├── TransactionForm.jsx
│   ├── TransactionReport.jsx
│   └── UserInfo.jsx
├── constants/
│   ├── mockData.js
│   └── styles.js
└── utils/
    ├── auth.js
    └── export.js
```

---

## 📄 File 1: `src/constants/mockData.js`

````javascript
// filepath: c:\Users\AWAL\bank-digital\src\constants\mockData.js

export const INITIAL_USERS = [
  { id: 1, name: 'User Nasabah', role: 'user', balance: 5000000, accountNo: '123-456-789' },
  { id: 2, name: 'Nasabah Lain', role: 'user', balance: 2500000, accountNo: '987-654-321' },
  { id: 99, name: 'Admin Bank', role: 'admin', balance: 0, accountNo: 'ADMIN-001' }
];

export const INITIAL_TRANSACTIONS = [
  { id: 1, userId: 1, type: 'DEBIT', amount: 5000000, date: '2023-10-01', note: 'Setoran Awal' },
  { id: 2, userId: 1, type: 'KREDIT', amount: 200000, date: '2023-10-05', note: 'Tarik Tunai ATM' }
];

export const LOGIN_CREDENTIALS = [
  { id: 1, username: 'nasabah1', password: 'pass123', name: 'User Nasabah' },
  { id: 2, username: 'nasabah2', password: 'pass123', name: 'Nasabah Lain' },
  { id: 99, username: 'admin', password: 'admin123', name: 'Admin Bank' }
];

export const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby1BUVlVFCggCtsXIBrg_0LnIes3Beh1ddrjHEU7C1F6TLXlbxFY0wsOHeizq-z09vq/exec';
````

---

## 📄 File 2: `src/constants/styles.js`

````javascript
// filepath: c:\Users\AWAL\bank-digital\src\constants\styles.js

export const printStyles = `
  @media print {
    .no-print { display: none !important; }
    .print-only { display: block !important; }
    body { background: white; }
    .container { width: 100%; max-width: 100%; margin: 0; padding: 0; }
  }
`;
````

---

## 📄 File 3: `src/components/Login.jsx`

````jsx
// filepath: c:\Users\AWAL\bank-digital\src\components\Login.jsx

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
````

---

## 📄 File 4: `src/App.jsx` (Diperbarui)

````jsx
// filepath: c:\Users\AWAL\bank-digital\src\App.jsx

import { useState } from 'react';
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
    a.download = 'laporan-
```


## License: unknown
https://github.com/marcos-vcs/alura-tracker/blob/adfcd5b2f5b1481536b9933699c0b8d2897837f3/src/components/ExportarParaCsv.vue

```
# Memisahkan Modul ke File Terpisah

Ya, tentu! Saya akan membuat struktur folder yang lebih rapi dengan memisahkan komponen-komponen ke file terpisah.

## 📁 Struktur Folder yang Disarankan

```
src/
├── App.jsx (main component)
├── components/
│   ├── Login.jsx
│   ├── Dashboard.jsx
│   ├── TransactionForm.jsx
│   ├── TransactionReport.jsx
│   └── UserInfo.jsx
├── constants/
│   ├── mockData.js
│   └── styles.js
└── utils/
    ├── auth.js
    └── export.js
```

---

## 📄 File 1: `src/constants/mockData.js`

````javascript
// filepath: c:\Users\AWAL\bank-digital\src\constants\mockData.js

export const INITIAL_USERS = [
  { id: 1, name: 'User Nasabah', role: 'user', balance: 5000000, accountNo: '123-456-789' },
  { id: 2, name: 'Nasabah Lain', role: 'user', balance: 2500000, accountNo: '987-654-321' },
  { id: 99, name: 'Admin Bank', role: 'admin', balance: 0, accountNo: 'ADMIN-001' }
];

export const INITIAL_TRANSACTIONS = [
  { id: 1, userId: 1, type: 'DEBIT', amount: 5000000, date: '2023-10-01', note: 'Setoran Awal' },
  { id: 2, userId: 1, type: 'KREDIT', amount: 200000, date: '2023-10-05', note: 'Tarik Tunai ATM' }
];

export const LOGIN_CREDENTIALS = [
  { id: 1, username: 'nasabah1', password: 'pass123', name: 'User Nasabah' },
  { id: 2, username: 'nasabah2', password: 'pass123', name: 'Nasabah Lain' },
  { id: 99, username: 'admin', password: 'admin123', name: 'Admin Bank' }
];

export const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby1BUVlVFCggCtsXIBrg_0LnIes3Beh1ddrjHEU7C1F6TLXlbxFY0wsOHeizq-z09vq/exec';
````

---

## 📄 File 2: `src/constants/styles.js`

````javascript
// filepath: c:\Users\AWAL\bank-digital\src\constants\styles.js

export const printStyles = `
  @media print {
    .no-print { display: none !important; }
    .print-only { display: block !important; }
    body { background: white; }
    .container { width: 100%; max-width: 100%; margin: 0; padding: 0; }
  }
`;
````

---

## 📄 File 3: `src/components/Login.jsx`

````jsx
// filepath: c:\Users\AWAL\bank-digital\src\components\Login.jsx

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
````

---

## 📄 File 4: `src/App.jsx` (Diperbarui)

````jsx
// filepath: c:\Users\AWAL\bank-digital\src\App.jsx

import { useState } from 'react';
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
    a.download = 'laporan-
```


## License: Apache-2.0
https://github.com/arkime/arkime/blob/5609d4ebde6b197f019d61244d9ec8b4646121a1/viewer/vueapp/src/components/spigraph/Spigraph.vue

```
# Memisahkan Modul ke File Terpisah

Ya, tentu! Saya akan membuat struktur folder yang lebih rapi dengan memisahkan komponen-komponen ke file terpisah.

## 📁 Struktur Folder yang Disarankan

```
src/
├── App.jsx (main component)
├── components/
│   ├── Login.jsx
│   ├── Dashboard.jsx
│   ├── TransactionForm.jsx
│   ├── TransactionReport.jsx
│   └── UserInfo.jsx
├── constants/
│   ├── mockData.js
│   └── styles.js
└── utils/
    ├── auth.js
    └── export.js
```

---

## 📄 File 1: `src/constants/mockData.js`

````javascript
// filepath: c:\Users\AWAL\bank-digital\src\constants\mockData.js

export const INITIAL_USERS = [
  { id: 1, name: 'User Nasabah', role: 'user', balance: 5000000, accountNo: '123-456-789' },
  { id: 2, name: 'Nasabah Lain', role: 'user', balance: 2500000, accountNo: '987-654-321' },
  { id: 99, name: 'Admin Bank', role: 'admin', balance: 0, accountNo: 'ADMIN-001' }
];

export const INITIAL_TRANSACTIONS = [
  { id: 1, userId: 1, type: 'DEBIT', amount: 5000000, date: '2023-10-01', note: 'Setoran Awal' },
  { id: 2, userId: 1, type: 'KREDIT', amount: 200000, date: '2023-10-05', note: 'Tarik Tunai ATM' }
];

export const LOGIN_CREDENTIALS = [
  { id: 1, username: 'nasabah1', password: 'pass123', name: 'User Nasabah' },
  { id: 2, username: 'nasabah2', password: 'pass123', name: 'Nasabah Lain' },
  { id: 99, username: 'admin', password: 'admin123', name: 'Admin Bank' }
];

export const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby1BUVlVFCggCtsXIBrg_0LnIes3Beh1ddrjHEU7C1F6TLXlbxFY0wsOHeizq-z09vq/exec';
````

---

## 📄 File 2: `src/constants/styles.js`

````javascript
// filepath: c:\Users\AWAL\bank-digital\src\constants\styles.js

export const printStyles = `
  @media print {
    .no-print { display: none !important; }
    .print-only { display: block !important; }
    body { background: white; }
    .container { width: 100%; max-width: 100%; margin: 0; padding: 0; }
  }
`;
````

---

## 📄 File 3: `src/components/Login.jsx`

````jsx
// filepath: c:\Users\AWAL\bank-digital\src\components\Login.jsx

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
````

---

## 📄 File 4: `src/App.jsx` (Diperbarui)

````jsx
// filepath: c:\Users\AWAL\bank-digital\src\App.jsx

import { useState } from 'react';
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
    a.download = 'laporan-
```


## License: Apache-2.0
https://github.com/arkime/arkime/blob/5609d4ebde6b197f019d61244d9ec8b4646121a1/viewer/vueapp/src/components/spigraph/Spigraph.vue

```
# Memisahkan Modul ke File Terpisah

Ya, tentu! Saya akan membuat struktur folder yang lebih rapi dengan memisahkan komponen-komponen ke file terpisah.

## 📁 Struktur Folder yang Disarankan

```
src/
├── App.jsx (main component)
├── components/
│   ├── Login.jsx
│   ├── Dashboard.jsx
│   ├── TransactionForm.jsx
│   ├── TransactionReport.jsx
│   └── UserInfo.jsx
├── constants/
│   ├── mockData.js
│   └── styles.js
└── utils/
    ├── auth.js
    └── export.js
```

---

## 📄 File 1: `src/constants/mockData.js`

````javascript
// filepath: c:\Users\AWAL\bank-digital\src\constants\mockData.js

export const INITIAL_USERS = [
  { id: 1, name: 'User Nasabah', role: 'user', balance: 5000000, accountNo: '123-456-789' },
  { id: 2, name: 'Nasabah Lain', role: 'user', balance: 2500000, accountNo: '987-654-321' },
  { id: 99, name: 'Admin Bank', role: 'admin', balance: 0, accountNo: 'ADMIN-001' }
];

export const INITIAL_TRANSACTIONS = [
  { id: 1, userId: 1, type: 'DEBIT', amount: 5000000, date: '2023-10-01', note: 'Setoran Awal' },
  { id: 2, userId: 1, type: 'KREDIT', amount: 200000, date: '2023-10-05', note: 'Tarik Tunai ATM' }
];

export const LOGIN_CREDENTIALS = [
  { id: 1, username: 'nasabah1', password: 'pass123', name: 'User Nasabah' },
  { id: 2, username: 'nasabah2', password: 'pass123', name: 'Nasabah Lain' },
  { id: 99, username: 'admin', password: 'admin123', name: 'Admin Bank' }
];

export const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby1BUVlVFCggCtsXIBrg_0LnIes3Beh1ddrjHEU7C1F6TLXlbxFY0wsOHeizq-z09vq/exec';
````

---

## 📄 File 2: `src/constants/styles.js`

````javascript
// filepath: c:\Users\AWAL\bank-digital\src\constants\styles.js

export const printStyles = `
  @media print {
    .no-print { display: none !important; }
    .print-only { display: block !important; }
    body { background: white; }
    .container { width: 100%; max-width: 100%; margin: 0; padding: 0; }
  }
`;
````

---

## 📄 File 3: `src/components/Login.jsx`

````jsx
// filepath: c:\Users\AWAL\bank-digital\src\components\Login.jsx

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
````

---

## 📄 File 4: `src/App.jsx` (Diperbarui)

````jsx
// filepath: c:\Users\AWAL\bank-digital\src\App.jsx

import { useState } from 'react';
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
    a.download = 'laporan-
```


## License: unknown
https://github.com/marcos-vcs/alura-tracker/blob/adfcd5b2f5b1481536b9933699c0b8d2897837f3/src/components/ExportarParaCsv.vue

```
# Memisahkan Modul ke File Terpisah

Ya, tentu! Saya akan membuat struktur folder yang lebih rapi dengan memisahkan komponen-komponen ke file terpisah.

## 📁 Struktur Folder yang Disarankan

```
src/
├── App.jsx (main component)
├── components/
│   ├── Login.jsx
│   ├── Dashboard.jsx
│   ├── TransactionForm.jsx
│   ├── TransactionReport.jsx
│   └── UserInfo.jsx
├── constants/
│   ├── mockData.js
│   └── styles.js
└── utils/
    ├── auth.js
    └── export.js
```

---

## 📄 File 1: `src/constants/mockData.js`

````javascript
// filepath: c:\Users\AWAL\bank-digital\src\constants\mockData.js

export const INITIAL_USERS = [
  { id: 1, name: 'User Nasabah', role: 'user', balance: 5000000, accountNo: '123-456-789' },
  { id: 2, name: 'Nasabah Lain', role: 'user', balance: 2500000, accountNo: '987-654-321' },
  { id: 99, name: 'Admin Bank', role: 'admin', balance: 0, accountNo: 'ADMIN-001' }
];

export const INITIAL_TRANSACTIONS = [
  { id: 1, userId: 1, type: 'DEBIT', amount: 5000000, date: '2023-10-01', note: 'Setoran Awal' },
  { id: 2, userId: 1, type: 'KREDIT', amount: 200000, date: '2023-10-05', note: 'Tarik Tunai ATM' }
];

export const LOGIN_CREDENTIALS = [
  { id: 1, username: 'nasabah1', password: 'pass123', name: 'User Nasabah' },
  { id: 2, username: 'nasabah2', password: 'pass123', name: 'Nasabah Lain' },
  { id: 99, username: 'admin', password: 'admin123', name: 'Admin Bank' }
];

export const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby1BUVlVFCggCtsXIBrg_0LnIes3Beh1ddrjHEU7C1F6TLXlbxFY0wsOHeizq-z09vq/exec';
````

---

## 📄 File 2: `src/constants/styles.js`

````javascript
// filepath: c:\Users\AWAL\bank-digital\src\constants\styles.js

export const printStyles = `
  @media print {
    .no-print { display: none !important; }
    .print-only { display: block !important; }
    body { background: white; }
    .container { width: 100%; max-width: 100%; margin: 0; padding: 0; }
  }
`;
````

---

## 📄 File 3: `src/components/Login.jsx`

````jsx
// filepath: c:\Users\AWAL\bank-digital\src\components\Login.jsx

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
````

---

## 📄 File 4: `src/App.jsx` (Diperbarui)

````jsx
// filepath: c:\Users\AWAL\bank-digital\src\App.jsx

import { useState } from 'react';
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
    a.download = 'laporan-
```


## License: Apache-2.0
https://github.com/arkime/arkime/blob/5609d4ebde6b197f019d61244d9ec8b4646121a1/viewer/vueapp/src/components/spigraph/Spigraph.vue

```
# Memisahkan Modul ke File Terpisah

Ya, tentu! Saya akan membuat struktur folder yang lebih rapi dengan memisahkan komponen-komponen ke file terpisah.

## 📁 Struktur Folder yang Disarankan

```
src/
├── App.jsx (main component)
├── components/
│   ├── Login.jsx
│   ├── Dashboard.jsx
│   ├── TransactionForm.jsx
│   ├── TransactionReport.jsx
│   └── UserInfo.jsx
├── constants/
│   ├── mockData.js
│   └── styles.js
└── utils/
    ├── auth.js
    └── export.js
```

---

## 📄 File 1: `src/constants/mockData.js`

````javascript
// filepath: c:\Users\AWAL\bank-digital\src\constants\mockData.js

export const INITIAL_USERS = [
  { id: 1, name: 'User Nasabah', role: 'user', balance: 5000000, accountNo: '123-456-789' },
  { id: 2, name: 'Nasabah Lain', role: 'user', balance: 2500000, accountNo: '987-654-321' },
  { id: 99, name: 'Admin Bank', role: 'admin', balance: 0, accountNo: 'ADMIN-001' }
];

export const INITIAL_TRANSACTIONS = [
  { id: 1, userId: 1, type: 'DEBIT', amount: 5000000, date: '2023-10-01', note: 'Setoran Awal' },
  { id: 2, userId: 1, type: 'KREDIT', amount: 200000, date: '2023-10-05', note: 'Tarik Tunai ATM' }
];

export const LOGIN_CREDENTIALS = [
  { id: 1, username: 'nasabah1', password: 'pass123', name: 'User Nasabah' },
  { id: 2, username: 'nasabah2', password: 'pass123', name: 'Nasabah Lain' },
  { id: 99, username: 'admin', password: 'admin123', name: 'Admin Bank' }
];

export const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby1BUVlVFCggCtsXIBrg_0LnIes3Beh1ddrjHEU7C1F6TLXlbxFY0wsOHeizq-z09vq/exec';
````

---

## 📄 File 2: `src/constants/styles.js`

````javascript
// filepath: c:\Users\AWAL\bank-digital\src\constants\styles.js

export const printStyles = `
  @media print {
    .no-print { display: none !important; }
    .print-only { display: block !important; }
    body { background: white; }
    .container { width: 100%; max-width: 100%; margin: 0; padding: 0; }
  }
`;
````

---

## 📄 File 3: `src/components/Login.jsx`

````jsx
// filepath: c:\Users\AWAL\bank-digital\src\components\Login.jsx

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
````

---

## 📄 File 4: `src/App.jsx` (Diperbarui)

````jsx
// filepath: c:\Users\AWAL\bank-digital\src\App.jsx

import { useState } from 'react';
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
    a.download = 'laporan-
```


## License: unknown
https://github.com/marcos-vcs/alura-tracker/blob/adfcd5b2f5b1481536b9933699c0b8d2897837f3/src/components/ExportarParaCsv.vue

```
# Memisahkan Modul ke File Terpisah

Ya, tentu! Saya akan membuat struktur folder yang lebih rapi dengan memisahkan komponen-komponen ke file terpisah.

## 📁 Struktur Folder yang Disarankan

```
src/
├── App.jsx (main component)
├── components/
│   ├── Login.jsx
│   ├── Dashboard.jsx
│   ├── TransactionForm.jsx
│   ├── TransactionReport.jsx
│   └── UserInfo.jsx
├── constants/
│   ├── mockData.js
│   └── styles.js
└── utils/
    ├── auth.js
    └── export.js
```

---

## 📄 File 1: `src/constants/mockData.js`

````javascript
// filepath: c:\Users\AWAL\bank-digital\src\constants\mockData.js

export const INITIAL_USERS = [
  { id: 1, name: 'User Nasabah', role: 'user', balance: 5000000, accountNo: '123-456-789' },
  { id: 2, name: 'Nasabah Lain', role: 'user', balance: 2500000, accountNo: '987-654-321' },
  { id: 99, name: 'Admin Bank', role: 'admin', balance: 0, accountNo: 'ADMIN-001' }
];

export const INITIAL_TRANSACTIONS = [
  { id: 1, userId: 1, type: 'DEBIT', amount: 5000000, date: '2023-10-01', note: 'Setoran Awal' },
  { id: 2, userId: 1, type: 'KREDIT', amount: 200000, date: '2023-10-05', note: 'Tarik Tunai ATM' }
];

export const LOGIN_CREDENTIALS = [
  { id: 1, username: 'nasabah1', password: 'pass123', name: 'User Nasabah' },
  { id: 2, username: 'nasabah2', password: 'pass123', name: 'Nasabah Lain' },
  { id: 99, username: 'admin', password: 'admin123', name: 'Admin Bank' }
];

export const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby1BUVlVFCggCtsXIBrg_0LnIes3Beh1ddrjHEU7C1F6TLXlbxFY0wsOHeizq-z09vq/exec';
````

---

## 📄 File 2: `src/constants/styles.js`

````javascript
// filepath: c:\Users\AWAL\bank-digital\src\constants\styles.js

export const printStyles = `
  @media print {
    .no-print { display: none !important; }
    .print-only { display: block !important; }
    body { background: white; }
    .container { width: 100%; max-width: 100%; margin: 0; padding: 0; }
  }
`;
````

---

## 📄 File 3: `src/components/Login.jsx`

````jsx
// filepath: c:\Users\AWAL\bank-digital\src\components\Login.jsx

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
````

---

## 📄 File 4: `src/App.jsx` (Diperbarui)

````jsx
// filepath: c:\Users\AWAL\bank-digital\src\App.jsx

import { useState } from 'react';
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
    a.download = 'laporan-
```

