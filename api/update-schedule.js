import { supabase } from '../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { userId, dateStr, shiftCode } = req.body;

  const { data, error } = await supabase
    .from('schedules')
    .upsert({ user_id: userId, date: dateStr, shift: shiftCode });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({ message: 'Berhasil diperbarui', data });
}