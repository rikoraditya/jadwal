import { supabase } from '../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { nip, password } = req.body;

  // Cek user di tabel 'users'
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('nip', nip)
    .eq('password', password)
    .single();

  if (error || !data) {
    return res.status(401).json({ message: 'NIP atau Password salah' });
  }

  return res.status(200).json({ success: true, user: data });
}