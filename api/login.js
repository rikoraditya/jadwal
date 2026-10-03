// api/login.js
import { supabase } from '../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { nip, password } = req.body;

  // 1. Pastikan input tidak kosong
  if (!nip || !password) {
    return res.status(400).json({ message: 'NIP dan Password wajib diisi' });
  }

  // 2. Cari user berdasarkan NIP dan Password
  const { data: users, error } = await supabase
    .from('users')
    .select('*')
    .eq('nip', String(nip))
    .eq('password', String(password));

  // 3. Cek apakah ada error atau data tidak ditemukan (array kosong)
  if (error || !users || users.length === 0) {
    return res.status(401).json({ message: 'NIP atau Password salah' });
  }

  // Jika cocok, ambil user pertama
  const user = users[0];

  return res.status(200).json({ success: true, user });
}