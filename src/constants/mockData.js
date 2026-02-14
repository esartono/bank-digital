export const INITIAL_USERS = [
  { id: 1, name: 'User Nasabah', role: 'user', balance: 5000000, accountNo: '123-456-789', photo: 'https://ui-avatars.com/api/?name=User+Nasabah&background=3b82f6&color=fff&size=128' },
  { id: 2, name: 'Nasabah Lain', role: 'user', balance: 2500000, accountNo: '987-654-321', photo: 'https://ui-avatars.com/api/?name=Nasabah+Lain&background=8b5cf6&color=fff&size=128' },
  { id: 99, name: 'Admin Bank', role: 'admin', balance: 0, accountNo: 'ADMIN-001', photo: 'https://ui-avatars.com/api/?name=Admin+Bank&background=f59e0b&color=fff&size=128' }
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