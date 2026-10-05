import { supabase } from '../lib/supabase'

// 1. Ambil daftar semua user (Staf / Ka. Rekam Medis)
export const getUsers = async () => {
  const { data, error } = await supabase
    .from('users')
    .select('id, nip, name, full_title, role, avatar_url')
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching users:', error.message)
    return []
  }
  return data
}

// 2. Ambil user berdasarkan NIP (Aman dari error 406 jika data kosong)
export const getUserByNip = async (nip) => {
  if (!nip) return null

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('nip', String(nip))
    .maybeSingle()

  if (error) {
    console.error('Error fetching user by NIP:', error.message)
    return null
  }
  return data
}

// 3. Ambil jadwal rentang tanggal (Tanpa nested join untuk cegah Error 400)
export const getSchedulesByDateRange = async (startDateStr, endDateStr) => {
  if (!startDateStr || !endDateStr) return []

  const { data, error } = await supabase
    .from('schedules')
    .select('id, user_id, date_str, shift_code, created_at, updated_at')
    .gte('date_str', String(startDateStr))
    .lte('date_str', String(endDateStr))
    .order('date_str', { ascending: true })

  if (error) {
    console.error('Error fetching schedules:', error.message)
    return []
  }
  return data
}

// 4. Save / Update Jadwal (Menggunakan Insert/Update eksplisit)
export const saveSchedule = async ({ userId, dateStr, shiftCode }) => {
  if (!userId || !dateStr || !shiftCode) {
    throw new Error('Data userId, dateStr, dan shiftCode wajib diisi.')
  }

  // Cek apakah jadwal untuk user pada tanggal tersebut sudah ada
  const { data: existing } = await supabase
    .from('schedules')
    .select('id')
    .eq('user_id', String(userId))
    .eq('date_str', String(dateStr))
    .maybeSingle()

  if (existing) {
    // Jika sudah ada, lakukan UPDATE
    const { data, error } = await supabase
      .from('schedules')
      .update({
        shift_code: String(shiftCode),
        updated_at: new Date().toISOString()
      })
      .eq('id', existing.id)
      .select()

    if (error) throw error
    return data
  } else {
    // Jika belum ada, lakukan INSERT
    const { data, error } = await supabase
      .from('schedules')
      .insert([
        {
          user_id: String(userId),
          date_str: String(dateStr),
          shift_code: String(shiftCode),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ])
      .select()

    if (error) throw error
    return data
  }
}