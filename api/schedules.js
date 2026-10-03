import { supabase } from '../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { year, month } = req.query;

  // Mengambil data dari tabel 'schedules' di Supabase
  const { data, error } = await supabase
    .from('schedules')
    .select('*')
    .eq('year', year)
    .eq('month', month);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json(data);
}