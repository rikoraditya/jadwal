import React, { useState, useEffect, useRef } from 'react';
import { 
  Bell, BellOff, Clock, User, Shield, LogOut,
  Edit3, Search, ChevronLeft, ChevronRight,
  LayoutGrid, Table, X, Check, Volume2,
  FileText, Calendar, AlertCircle, CheckCircle2,
  TrendingUp, Sun, Moon, Zap, Coffee, Sparkles, HeartHandshake, RefreshCw, Info
} from 'lucide-react';
import { supabase } from './supabaseClient';

// =========================================================================
// DATABASE HARI RAYA & TANGGAL MERAH RESMI
// =========================================================================
const HOLIDAYS_DATABASE = {
  "2026-01-01": "Tahun Baru 2026 Masehi",
  "2026-01-03": "Tumpek Krulut, Purnama",
  "2026-01-07": "Buda Wage Merakih",
  "2026-01-09": "Hari Bhatara Sri",
  "2026-01-13": "Anggar Kasih Tambir, Kajeng Kliwon",
  "2026-01-16": "Isra Mikraj Nabi Muhammad SAW",
  "2026-01-17": "Siwa Ratri",
  "2026-01-18": "Tilem",
  "2026-01-28": "Kajeng Kliwon, Buda Kliwon Matal",
  "2026-02-02": "Purnama",
  "2026-02-07": "Tumpek Kandang",
  "2026-02-11": "Buda Wage Menail",
  "2026-02-12": "Kajeng Kliwon",
  "2026-02-13": "Hari Bhatara Sri",
  "2026-02-16": "Tilem",
  "2026-02-17": "Tahun Baru Imlek 2577 Kongzili",
  "2026-02-27": "Kajeng Kliwon",
  "2026-03-03": "Purnama",
  "2026-03-04": "Buda Kliwon Ugu",
  "2026-03-14": "Kajeng Kliwon, Tumpek Wayang",
  "2026-03-18": "Buda Wage Kulawu, Tilem",
  "2026-03-19": "Nyepi / Tahun Baru Saka 1948",
  "2026-03-20": "Ngembak Geni, Hari Bhatara Sri, Idul Fitri 1447 H",
  "2026-03-21": "Hari Raya Idul Fitri 1447 Hijriah",
  "2026-03-29": "Kajeng Kliwon Pamelastali",
  "2026-04-02": "Purnama, Patetegan",
  "2026-04-03": "Wafat Yesus Kristus",
  "2026-04-04": "Saraswati",
  "2026-04-05": "Banyu Pinaruh",
  "2026-04-06": "Soma Ribek",
  "2026-04-07": "Sabuh Mas",
  "2026-04-08": "Pagerwesi",
  "2026-04-18": "Tumpek Landep",
  "2026-04-24": "Hari Bhatara Sri",
  "2026-05-01": "Purnama, Hari Buruh Internasional",
  "2026-05-13": "Kajeng Kliwon, Buda Kliwon Gumbreg",
  "2026-05-14": "Kenaikan Yesus Kristus",
  "2026-05-16": "Tilem",
  "2026-05-23": "Tumpek Uduh/Pengatag/Pengarah/Bubuh",
  "2026-05-27": "Hari Raya Idul Adha 1447 Hijriah",
  "2026-05-29": "Hari Bhatara Sri",
  "2026-05-31": "Purnama, Hari Raya Waisak 2570 BE",
  "2026-06-01": "Hari Lahir Pancasila",
  "2026-06-11": "Sugihan Jawa",
  "2026-06-12": "Sugihan Bali, Kajeng Kliwon",
  "2026-06-14": "Penyekeban, Tilem",
  "2026-06-15": "Penyajaan Galungan",
  "2026-06-16": "Penampahan Galungan, Tahun Baru Islam 1448 H",
  "2026-06-17": "GALUNGAN",
  "2026-06-18": "Manis Galungan",
  "2026-06-20": "Pemaridan Guru",
  "2026-06-21": "Ulihan",
  "2026-06-22": "Pemacekan Agung",
  "2026-06-26": "Penampahan Kuningan",
  "2026-06-27": "KUNINGAN",
  "2026-06-29": "Purnama",
  "2026-07-03": "Hari Bhatara Sri",
  "2026-07-07": "Anggar Kasih Medangsia",
  "2026-07-14": "Tilem",
  "2026-07-29": "Purnama",
  "2026-08-01": "Tumpek Krulut",
  "2026-08-05": "Buda Wage Merakih",
  "2026-08-07": "Hari Bhatara Sri",
  "2026-08-11": "Anggar Kasih Tambir, Kajeng Kliwon",
  "2026-08-12": "Tilem",
  "2026-08-17": "Proklamasi Kemerdekaan RI",
  "2026-08-25": "Maulid Nabi Muhammad SAW",
  "2026-08-27": "Purnama",
  "2026-09-05": "Tumpek Kandang",
  "2026-09-10": "Kajeng Kliwon",
  "2026-09-11": "Tilem, Hari Bhatara Sri",
  "2026-09-26": "Purnama",
  "2026-09-30": "Buda Kliwon Ugu",
  "2026-10-10": "Kajeng Kliwon, Tumpek Wayang",
  "2026-10-11": "Tilem",
  "2026-10-14": "Buda Wage Kulawu",
  "2026-10-16": "Hari Bhatara Sri",
  "2026-10-20": "Anggar Kasih Dukut",
  "2026-10-25": "Purnama, Watugunung Runtuh",
  "2026-10-27": "Paid-Paidan",
  "2026-10-28": "Hari Urip",
  "2026-10-29": "Patetegan",
  "2026-10-30": "Pangredanaan",
  "2026-10-31": "SARASWATI",
  "2026-11-01": "Banyu Pinaruh",
  "2026-11-02": "Soma Ribek",
  "2026-11-03": "Sabuh Mas",
  "2026-11-04": "PAGERWESI",
  "2026-11-09": "Tilem",
  "2026-11-14": "Tumpek Landep",
  "2026-11-15": "Pujawali Hyang Guru",
  "2026-11-18": "Buda Wage Ukir",
  "2026-11-20": "Hari Bhatara Sri",
  "2026-11-24": "Purnama, Anggar Kasih Kulantir",
  "2026-12-09": "Buda Kliwon Gumbreg, Tilem",
  "2026-12-19": "Tumpek Uduh/Pengatag/Pengarah/Bubuh",
  "2026-12-23": "Purnama",
  "2026-12-24": "Kajeng Kliwon",
  "2026-12-25": "Hari Bhatara Sri, Hari Raya Natal",
  "2026-12-29": "Anggar Kasih Julungwangi"
};

// =========================================================================
// HELPER PERHITUNGAN TANGGAL LOKAL AMAN
// =========================================================================
const parseLocalDate = (dateStr) => {
  if (!dateStr) return new Date();
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day, 0, 0, 0, 0);
};

const formatLocalDateStr = (dateObj) => {
  const y = dateObj.getFullYear();
  const m = String(dateObj.getMonth() + 1).padStart(2, '0');
  const d = String(dateObj.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

// =========================================================================
// ALGORITMA WARIGA & KALENDER BALI TERKALIBRASI (PRESISI 2026)
// =========================================================================
const WUKU_LIST = [
  "Sinta", "Landep", "Ukir", "Kulantir", "Tolu", "Gumbreg", "Wariga", "Warigadean",
  "Julungwangi", "Sungsang", "Dungulan", "Kuningan", "Langkir", "Medangsia", "Pujut",
  "Pahang", "Krulut", "Merakih", "Tambir", "Medangkungan", "Matal", "Uye",
  "Menail", "Prangbakat", "Bala", "Ugu", "Wayang", "Klawu", "Dukut", "Watugunung"
];

const TRIWARA_LIST = ["Pasah", "Beteng", "Kajeng"];
const PANCAWARA_LIST = ["Umanis", "Paing", "Pon", "Wage", "Kliwon"];
const SAPTAWARA_LIST = ["Redite", "Soma", "Anggara", "Buda", "Wraspati", "Sukra", "Saniscara"];

const ANCHOR_2026 = new Date(2026, 0, 4, 0, 0, 0, 0); 
const ANCHOR_WUKU_INDEX = 0;
const ANCHOR_PANCAWARA_INDEX = 0;
const ANCHOR_TRIWARA_INDEX = 0;

const getBaliCalendarDetails = (dateObj) => {
  const target = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate(), 0, 0, 0, 0);
  const anchor = new Date(ANCHOR_2026.getFullYear(), ANCHOR_2026.getMonth(), ANCHOR_2026.getDate(), 0, 0, 0, 0);
  
  const diffDays = Math.round((target.getTime() - anchor.getTime()) / (1000 * 60 * 60 * 24));
  
  const pancaIndex = ((diffDays + ANCHOR_PANCAWARA_INDEX) % 5 + 5) % 5; 
  const triIndex = ((diffDays + ANCHOR_TRIWARA_INDEX) % 3 + 3) % 3;
  const saptaIndex = ((diffDays % 7) + 7) % 7;
  
  const totalWeeks = Math.floor(diffDays / 7);
  let wukuIndex = ((ANCHOR_WUKU_INDEX + totalWeeks) % 30 + 30) % 30;

  const wukuName = WUKU_LIST[wukuIndex];
  const triwara = TRIWARA_LIST[triIndex];
  const pancawara = PANCAWARA_LIST[pancaIndex];
  const saptawara = SAPTAWARA_LIST[saptaIndex];

  const dateStr = formatLocalDateStr(dateObj);
  const hariRayaBali = HOLIDAYS_DATABASE[dateStr] ? [HOLIDAYS_DATABASE[dateStr]] : [];

  const isPurnamaStr = HOLIDAYS_DATABASE[dateStr] && HOLIDAYS_DATABASE[dateStr].toUpperCase().includes('PURNAMA');
  const isTilemStr = HOLIDAYS_DATABASE[dateStr] && HOLIDAYS_DATABASE[dateStr].toUpperCase().includes('TILEM');

  return {
    wuku: wukuName,
    triwara,
    pancawara,
    saptawara,
    hariRayaBali,
    lunar: {
      isPurnama: isPurnamaStr,
      isTilem: isTilemStr,
      label: isPurnamaStr ? 'Purnama' : (isTilemStr ? 'Tilem' : null)
    }
  };
};

// Jenis shift dasar
const BASE_SHIFT_TYPES = {
  P: { 
    label: 'Pagi', 
    code: 'P', 
    time: '07:00 - 14:00', 
    duration: 7, 
    icon: Sun,
    color: 'bg-cyan-950/70 text-cyan-300 border-cyan-600/60 hover:bg-cyan-900/80',
    badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
  },
  S: { 
    label: 'Siang', 
    code: 'S', 
    time: '14:00 - 22:00', 
    duration: 8, 
    icon: Moon,
    color: 'bg-indigo-950/70 text-indigo-300 border-indigo-600/60 hover:bg-indigo-900/80',
    badge: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
  },
  PS: { 
    label: 'Pagi Siang', 
    code: 'PS', 
    time: '07:00 - 22:00', 
    duration: 15, 
    icon: Zap,
    color: 'bg-amber-950/70 text-amber-300 border-amber-600/60 hover:bg-amber-900/80',
    badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
  },
  L: { 
    label: 'Libur', 
    code: 'L', 
    time: 'Rest / Off', 
    duration: 0, 
    icon: Coffee,
    color: 'bg-slate-900/80 text-slate-400 border-slate-700/80 hover:bg-slate-800',
    badge: 'bg-slate-800 text-slate-400 border-slate-700',
  }
};

const HOLIDAY_SHIFT_STYLES = {
  P: {
    color: 'bg-red-950/90 text-red-200 border-red-500/80 hover:bg-red-900/90 ring-1 ring-red-500/50 shadow-red-900/40 shadow-lg',
    badge: 'bg-red-500/30 text-red-200 border-red-500/60'
  },
  S: {
    color: 'bg-rose-950/90 text-rose-200 border-rose-500/80 hover:bg-rose-900/90 ring-1 ring-rose-500/50 shadow-rose-900/40 shadow-lg',
    badge: 'bg-rose-500/30 text-rose-200 border-rose-500/60'
  },
  PS: {
    color: 'bg-red-900/90 text-orange-200 border-orange-500/80 hover:bg-red-800/90 ring-1 ring-orange-500/50 shadow-red-900/40 shadow-lg',
    badge: 'bg-red-500/30 text-orange-200 border-orange-500/60'
  }
};

// Staf Rekam Medis
const REKAM_MEDIS_STAFF = [
  { id: 'rm_riko', name: 'Riko', fullTitle: 'Riko Raditya, S.MIK', role: 'Staf Koding & Filing Rekam Medis', nip: '199204122020121001', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
  { id: 'rm_sukarma', name: 'Sukarma', fullTitle: 'Made Sukarmayasa, A.Md.PK', role: 'Staf Pendaftaran Poliklinik & RJ', nip: '198908152019031002', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
  { id: 'rm_dona', name: 'Dona', fullTitle: 'Dona Rahayu, A.Md.RMIK', role: 'Staf Assembling & Reporting', nip: '199501222021042003', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80' },
  { id: 'rm_niko', name: 'Niko', fullTitle: 'Niko Ariana, A.Md.RMIK', role: 'Staf Distribusi Berkas Medis IGD', nip: '199411052021021004', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80' }
];

const getDaysInMonth = (year, month) => {
  const days = [];
  const date = new Date(year, month, 1, 0, 0, 0, 0);
  while (date.getMonth() === month) {
    days.push(new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0));
    date.setDate(date.getDate() + 1);
  }
  return days;
};

const shuffleArray = (array, seed) => {
  const shuffled = [...array];
  let m = shuffled.length, t, i;
  let s = seed || Math.random();

  const pseudoRandom = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };

  while (m) {
    i = Math.floor(pseudoRandom() * m--);
    t = shuffled[m];
    shuffled[m] = shuffled[i];
    shuffled[i] = t;
  }
  return shuffled;
};

export default function App() {
  // Minta izin Notifikasi saat aplikasi dibuka
  useEffect(() => {
    if ('Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }, []);

  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('rm_user_session');
    return savedUser ? JSON.parse(savedUser) : null;
  }); 
  const [loginAccountType, setLoginAccountType] = useState('employee');
  const [selectedStaffId, setSelectedStaffId] = useState('rm_riko');
  const [inputPassword, setInputPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [selectedDateStr, setSelectedDateStr] = useState(formatLocalDateStr(today));

  const [viewMode, setViewMode] = useState('card');
  const [searchQuery, setSearchQuery] = useState('');
  const [shiftFilter, setShiftFilter] = useState('ALL');

  const [calendarDetailModalDate, setCalendarDetailModalDate] = useState(null);

  const [schedules, setSchedules] = useState(() => {
    const savedSchedules = localStorage.getItem('rm_schedules_cache');
    return savedSchedules ? JSON.parse(savedSchedules) : {};
  });

  const [filledRecords, setFilledRecords] = useState(() => {
    const savedFilled = localStorage.getItem('rm_filled_records_cache');
    return savedFilled ? JSON.parse(savedFilled) : {};
  });

  const [selectedCell, setSelectedCell] = useState(null);
  const [editingFilledCell, setEditingFilledCell] = useState(null);
  const [filledInput, setFilledInput] = useState('');

  const [alarmEnabled, setAlarmEnabled] = useState(true);
  const [activeAlarmModal, setActiveAlarmModal] = useState(null);
  const [liveTime, setLiveTime] = useState(new Date());

  const alarmAudioContextRef = useRef(null);
  const alarmIntervalRef = useRef(null);

  const checkHolidayStatus = (dateStr) => {
    if (!dateStr) return { isHoliday: false, label: '' };
    const date = parseLocalDate(dateStr);
    const isSunday = date.getDay() === 0;

    const nationalHolidayLabel = HOLIDAYS_DATABASE[dateStr];
    const baliInfo = getBaliCalendarDetails(date);

    const isHoliday = isSunday || Boolean(nationalHolidayLabel);

    let labelParts = [];
    if (isSunday) labelParts.push('Hari Minggu');
    if (nationalHolidayLabel) labelParts.push(nationalHolidayLabel);

    return {
      isHoliday,
      isPurnama: baliInfo.lunar.isPurnama,
      isTilem: baliInfo.lunar.isTilem,
      label: [...new Set(labelParts)].join(' | '),
      baliInfo
    };
  };

  const getShiftDisplayInfo = (shiftCode, dateStr) => {
    const base = BASE_SHIFT_TYPES[shiftCode] || BASE_SHIFT_TYPES.L;
    const status = checkHolidayStatus(dateStr);

    if (status.isHoliday && shiftCode !== 'L' && HOLIDAY_SHIFT_STYLES[shiftCode]) {
      return {
        ...base,
        label: `${base.label} (${status.label || 'Tanggal Merah'})`,
        color: HOLIDAY_SHIFT_STYLES[shiftCode].color,
        badge: HOLIDAY_SHIFT_STYLES[shiftCode].badge,
        isHolidayVariant: true
      };
    }

    return base;
  };

  const playHospitalAlarmSound = () => {
    try {
      stopHospitalAlarmSound();
      
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      
      const ctx = new AudioContext();
      alarmAudioContextRef.current = ctx;

      const playEmergencySirenPattern = () => {
        if (!alarmAudioContextRef.current) return;

        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        osc1.type = 'sawtooth';
        osc2.type = 'square';

        const now = ctx.currentTime;

        osc1.frequency.setValueAtTime(880, now);
        osc1.frequency.exponentialRampToValueAtTime(1760, now + 0.25);
        osc1.frequency.exponentialRampToValueAtTime(880, now + 0.5);

        osc2.frequency.setValueAtTime(1174.66, now);
        osc2.frequency.exponentialRampToValueAtTime(2349.32, now + 0.25);
        osc2.frequency.exponentialRampToValueAtTime(1174.66, now + 0.5);

        gain.gain.setValueAtTime(0.4, now);
        gain.gain.linearRampToValueAtTime(0.5, now + 0.25);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.55);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.55);
        osc2.stop(now + 0.55);
      };

      playEmergencySirenPattern();
      alarmIntervalRef.current = setInterval(playEmergencySirenPattern, 650);
    } catch (err) {
      console.warn("Audio Context Alarm Error:", err);
    }
  };

  const stopHospitalAlarmSound = () => {
    if (alarmIntervalRef.current) {
      clearInterval(alarmIntervalRef.current);
      alarmIntervalRef.current = null;
    }
    if (alarmAudioContextRef.current) {
      try {
        alarmAudioContextRef.current.close();
      } catch (e) {}
      alarmAudioContextRef.current = null;
    }
  };

  const closeAlarmModal = () => {
    stopHospitalAlarmSound();
    setActiveAlarmModal(null);
  };

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('rm_user_session', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('rm_user_session');
    }
  }, [currentUser]);

  useEffect(() => {
    if (Object.keys(schedules).length > 0) {
      localStorage.setItem('rm_schedules_cache', JSON.stringify(schedules));
    }
  }, [schedules]);

  useEffect(() => {
    localStorage.setItem('rm_filled_records_cache', JSON.stringify(filledRecords));
  }, [filledRecords]);

  // Sync Data dari Supabase saat Bulan / Tahun Berubah
  useEffect(() => {
    fetchSchedulesFromDB();
    fetchFilledRecordsFromDB();
  }, [currentYear, currentMonth]);

  // FUNGSI SUPABASE: AMBIL JADWAL (MENGGUNAKAN KOLOM date_str)
  const fetchSchedulesFromDB = async () => {
    try {
      const startDate = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-01`;
      const lastDay = new Date(currentYear, currentMonth + 1, 0).getDate();
      const endDate = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;

      const { data, error } = await supabase
        .from('schedules')
        .select('*')
        .gte('date_str', startDate)
        .lte('date_str', endDate);

      if (error) throw error;

      if (data && data.length > 0) {
        const fetchedMap = {};
        data.forEach(item => {
          fetchedMap[`${item.user_id}_${item.date_str}`] = item.shift_code;
        });
        setSchedules(prev => ({ ...prev, ...fetchedMap }));
      } else {
        generateAutoMonthSchedules();
      }
    } catch (error) {
      console.error('Gagal mengambil data dari Supabase:', error);
      generateAutoMonthSchedules();
    }
  };

  // FUNGSI SUPABASE: AMBIL DATA DIISI (JIKA TABEL DUKUNGAN TERSEDIA)
  const fetchFilledRecordsFromDB = async () => {
    try {
      const startDate = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-01`;
      const lastDay = new Date(currentYear, currentMonth + 1, 0).getDate();
      const endDate = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;

      const { data, error } = await supabase
        .from('filled_records')
        .select('*')
        .gte('date_str', startDate)
        .lte('date_str', endDate);

      if (error) throw error;

      if (data && data.length > 0) {
        const fetchedFilled = {};
        data.forEach(item => {
          fetchedFilled[`${item.user_id}_${item.date_str}`] = item.filled_value;
        });
        setFilledRecords(prev => ({ ...prev, ...fetchedFilled }));
      }
    } catch (error) {
      // Menggunakan fallback data dari penyimpanan lokal jika tabel tidak ada di Supabase
      console.warn('Gagal mengambil data filled_records dari Supabase (menggunakan cache lokal):', error);
    }
  };

  // FUNGSI SUPABASE: SIMPAN ROTASI JADWAL OTOMATIS (MENYESUAIKAN KOLOM date_str)
  const generateAutoMonthSchedules = async () => {
    const days = getDaysInMonth(currentYear, currentMonth);
    const newSchedules = { ...schedules };
    const staffIds = REKAM_MEDIS_STAFF.map(s => s.id);

    const weeks = [];
    let currentWeek = [];

    days.forEach(day => {
      currentWeek.push(day);
      if (day.getDay() === 0) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    });
    if (currentWeek.length > 0) weeks.push(currentWeek);

    const baseSeed = currentYear * 100 + currentMonth + Date.now();
    const recordsToInsert = [];

    weeks.forEach((weekDays, weekIdx) => {
      const weekSeed = baseSeed + weekIdx * 17;
      const offOrder = shuffleArray(staffIds, weekSeed);

      const monTueShuffles = shuffleArray([
        ['P', 'S', 'P', 'S'],
        ['S', 'P', 'S', 'P'],
        ['P', 'P', 'S', 'S'],
        ['S', 'S', 'P', 'P']
      ], weekSeed + 3);

      weekDays.forEach((day, dayInWeekIdx) => {
        const dateStr = formatLocalDateStr(day);
        const dayOfWeek = day.getDay();

        if (dayOfWeek === 1 || dayOfWeek === 2) {
          const pattern = monTueShuffles[(dayOfWeek + dayInWeekIdx) % monTueShuffles.length];
          staffIds.forEach((sId, sIdx) => {
            newSchedules[`${sId}_${dateStr}`] = pattern[sIdx];
            recordsToInsert.push({ user_id: sId, date_str: dateStr, shift_code: pattern[sIdx] });
          });
        }
        else if (dayOfWeek === 0) {
          const sunPattern = shuffleArray(['P', 'S', 'P', 'S'], weekSeed + dayInWeekIdx);
          staffIds.forEach((sId, sIdx) => {
            newSchedules[`${sId}_${dateStr}`] = sunPattern[sIdx];
            recordsToInsert.push({ user_id: sId, date_str: dateStr, shift_code: sunPattern[sIdx] });
          });
        }
        else {
          let offStaffId, psStaffId;
          if (dayOfWeek === 3) { offStaffId = offOrder[0]; psStaffId = offOrder[3]; }
          else if (dayOfWeek === 4) { offStaffId = offOrder[1]; psStaffId = offOrder[0]; }
          else if (dayOfWeek === 5) { offStaffId = offOrder[2]; psStaffId = offOrder[1]; }
          else if (dayOfWeek === 6) { offStaffId = offOrder[3]; psStaffId = offOrder[2]; }

          const remainingStaff = staffIds.filter(id => id !== offStaffId && id !== psStaffId);
          const pOrS = shuffleArray(['P', 'S'], weekSeed + dayOfWeek);

          newSchedules[`${offStaffId}_${dateStr}`] = 'L';
          newSchedules[`${psStaffId}_${dateStr}`] = 'PS';
          newSchedules[`${remainingStaff[0]}_${dateStr}`] = pOrS[0];
          newSchedules[`${remainingStaff[1]}_${dateStr}`] = pOrS[1];

          recordsToInsert.push({ user_id: offStaffId, date_str: dateStr, shift_code: 'L' });
          recordsToInsert.push({ user_id: psStaffId, date_str: dateStr, shift_code: 'PS' });
          recordsToInsert.push({ user_id: remainingStaff[0], date_str: dateStr, shift_code: pOrS[0] });
          recordsToInsert.push({ user_id: remainingStaff[1], date_str: dateStr, shift_code: pOrS[1] });
        }
      });
    });

    setSchedules(newSchedules);

    // Upsert hasil rotasi ke Supabase menggunakan constraint unique_user_per_date (user_id, date_str)
    try {
      await supabase.from('schedules').upsert(recordsToInsert, { onConflict: 'user_id,date_str' });
    } catch (err) {
      console.error('Gagal menyimpan jadwal tergenerasi ke Supabase:', err);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setLiveTime(now);

      if (currentUser && alarmEnabled) {
        checkPersonalShiftAlarm(now);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [currentUser, alarmEnabled, schedules]);

  const checkPersonalShiftAlarm = (now) => {
    if (currentUser.role === 'admin') return;

    const todayStr = formatLocalDateStr(now);
    const shiftCode = schedules[`${currentUser.id}_${todayStr}`];

    if (!shiftCode || shiftCode === 'L') return;

    const startHours = { P: 7, S: 14, PS: 7 };
    const startHour = startHours[shiftCode];
    if (startHour === undefined) return;

    const currentHour = now.getHours();
    const currentMin = now.getMinutes();
    const currentSec = now.getSeconds();

    const alertHour = startHour === 7 ? 6 : 13;
    if (currentHour === alertHour && currentMin === 30 && currentSec === 0) {
      const info = getShiftDisplayInfo(shiftCode, todayStr);
      triggerAlarmModal({
        title: `Peringatan Shift Kerja ${currentUser.name}!`,
        message: `Halo ${currentUser.fullTitle}, jadwal Shift ${info.label} Anda akan dimulai dalam 30 menit. Mohon bersiap menuju Ruang Rekam Medis.`,
        shiftCode,
        staffName: currentUser.name
      });
    }
  };

  // FUNGSI SUPABASE: LOGIN (DENGAN MAYBESINGLE MENGHINDARI ERROR 406)
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);

    const selectedStaff = REKAM_MEDIS_STAFF.find(s => s.id === selectedStaffId);
    const targetNip = loginAccountType === 'admin' ? '100000000000000000' : (selectedStaff?.nip || '');

    try {
      const { data: dbUser, error } = await supabase
        .from('users')
        .select('*')
        .eq('nip', targetNip)
        .maybeSingle();

      if (error) {
        throw error;
      }

      if (dbUser) {
        if (dbUser.password === inputPassword) {
          const fullStaffData = REKAM_MEDIS_STAFF.find(s => s.id === dbUser.id) || {};
          setCurrentUser({ ...fullStaffData, ...dbUser });
        } else {
          alert('Password/PIN yang Anda masukkan salah!');
        }
      } else {
        // Fallback jika pengguna belum/tidak ada di database Supabase
        if (loginAccountType === 'admin') {
          if (inputPassword === 'admin123' || inputPassword === '123456') {
            setCurrentUser({ id: 'admin_rm', name: 'Kepala Rekam Medis', role: 'admin' });
          } else {
            alert('Password/PIN Kepala Ruangan salah!');
          }
        } else {
          if (inputPassword === '123456') {
            const fullStaffData = REKAM_MEDIS_STAFF.find(s => s.id === selectedStaffId);
            setCurrentUser({ ...fullStaffData, role: 'employee' });
          } else {
            alert('Password/PIN Staf salah! (Default: 123456)');
          }
        }
      }

    } catch (error) {
      console.error('Error saat login:', error);
      if (loginAccountType === 'admin') {
        setCurrentUser({ id: 'admin_rm', name: 'Kepala Rekam Medis', role: 'admin' });
      } else {
        const fullStaffData = REKAM_MEDIS_STAFF.find(s => s.id === selectedStaffId);
        setCurrentUser({ ...fullStaffData, role: 'employee' });
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    stopHospitalAlarmSound();
    setCurrentUser(null);
    setInputPassword('');
    setIsLogoutModalOpen(false);
    localStorage.removeItem('rm_user_session');
  };

  // FUNGSI SUPABASE: UPDATE SHIFT PER CELL (MENGGUNAKAN KOLOM date_str)
  const handleAssignShift = async (staffId, dateStr, shiftCode) => {
    try {
      const { error } = await supabase
        .from('schedules')
        .upsert(
          { user_id: staffId, date_str: dateStr, shift_code: shiftCode },
          { onConflict: 'user_id,date_str' }
        );

      if (error) console.error('Gagal memperbarui ke Supabase:', error);
    } catch (err) {
      console.warn('Operasi offline / lokal disimpan.', err);
    }

    setSchedules(prev => ({
      ...prev,
      [`${staffId}_${dateStr}`]: shiftCode
    }));
    setSelectedCell(null);
  };

  // FUNGSI SIMPAN DIISI (REKAM MEDIS)
  const handleSaveFilledRecord = async (staffId, dateStr, value) => {
    const key = `${staffId}_${dateStr}`;
    setFilledRecords(prev => ({
      ...prev,
      [key]: value
    }));

    try {
      const { error } = await supabase
        .from('filled_records')
        .upsert(
          { user_id: staffId, date_str: dateStr, filled_value: value },
          { onConflict: 'user_id,date_str' }
        );
      if (error) console.error('Gagal menyimpan nilai DIISI ke Supabase:', error);
    } catch (err) {
      console.warn('Simpan DIISI secara lokal.', err);
    }

    setEditingFilledCell(null);
    setFilledInput('');
  };

  const handleTestAlarm = () => {
    triggerAlarmModal({
      title: 'Tes Alarm Darurat Shift',
      message: `Alarm melengking terus-menerus diaktifkan! Anda akan menerima peringatan suara berulang ini 30 menit sebelum shift dimulai.`,
      shiftCode: 'P',
      staffName: currentUser ? currentUser.name : 'Staf Rekam Medis'
    });
  };

  const triggerAlarmModal = (alarmData) => {
    playHospitalAlarmSound();
    setActiveAlarmModal(alarmData);
  };

  const daysInMonthList = getDaysInMonth(currentYear, currentMonth);

  const filteredStaffList = REKAM_MEDIS_STAFF.filter(staff => {
    if (currentUser && currentUser.role === 'employee') {
      if (viewMode === 'card') return staff.id === currentUser.id;
    }
    return staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           staff.role.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const calculateStaffStats = (staffId) => {
    let totalWorkDays = 0;
    let totalOffDays = 0;
    let totalHours = 0;
    let totalFilled = 0;

    daysInMonthList.forEach(day => {
      const dateStr = formatLocalDateStr(day);
      const shift = schedules[`${staffId}_${dateStr}`] || 'L';
      if (shift === 'L') {
        totalOffDays++;
      } else {
        totalWorkDays++;
        totalHours += BASE_SHIFT_TYPES[shift]?.duration || 0;
      }

      const filledVal = filledRecords[`${staffId}_${dateStr}`];
      if (filledVal) {
        const parsedNum = parseInt(filledVal, 10);
        if (!isNaN(parsedNum)) {
          totalFilled += parsedNum;
        }
      }
    });

    return { totalWorkDays, totalOffDays, totalHours, totalFilled };
  };

  // HALAMAN LOGIN
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur relative z-10">
          
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-tr from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-emerald-500/20">
              <FileText className="w-9 h-9 text-white" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Sistem Jadwal Shift
            </h1>
            <p className="text-xs text-emerald-400 font-semibold mt-1 uppercase tracking-wider">
              Divisi Rekam Medis RS
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-950 rounded-2xl mb-6 border border-slate-800">
            <button
              onClick={() => setLoginAccountType('employee')}
              className={`py-2.5 text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 min-h-[44px] ${
                loginAccountType === 'employee' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <User className="w-4 h-4" /> Staf Rekam Medis
            </button>
            <button
              onClick={() => setLoginAccountType('admin')}
              className={`py-2.5 text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 min-h-[44px] ${
                loginAccountType === 'admin' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Shield className="w-4 h-4" /> Ka. Rekam Medis
            </button>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {loginAccountType === 'employee' ? (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Pilih Staf Rekam Medis
                </label>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  {REKAM_MEDIS_STAFF.map(staff => (
                    <button
                      key={staff.id}
                      type="button"
                      onClick={() => setSelectedStaffId(staff.id)}
                      className={`p-3 rounded-xl border text-left flex items-center gap-2 transition ${
                        selectedStaffId === staff.id 
                          ? 'bg-emerald-950/80 border-emerald-500 text-white ring-1 ring-emerald-500' 
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      <img src={staff.avatar} alt={staff.name} className="w-7 h-7 rounded-full object-cover" />
                      <span className="text-xs font-bold">{staff.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-3 bg-indigo-950/40 border border-indigo-800/50 rounded-xl text-xs text-indigo-300">
                Akses Ka. Ruang Rekam Medis: Kelola jadwal & atur rotasi otomatis.
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Password / PIN
              </label>
              <input
                type="password"
                value={inputPassword}
                onChange={(e) => setInputPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 min-h-[48px]"
                placeholder="Masukkan password Anda..."
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className={`w-full mt-3 font-bold py-3.5 rounded-xl transition shadow-lg text-white text-sm flex items-center justify-center gap-2 min-h-[48px] ${
                loginAccountType === 'admin' 
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500' 
                  : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500'
              }`}
            >
              {isLoggingIn ? 'Memverifikasi...' : `Masuk Sebagai ${loginAccountType === 'employee' ? REKAM_MEDIS_STAFF.find(s => s.id === selectedStaffId)?.name : 'Kepala Ruangan'}`}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const loggedInStaff = currentUser.role === 'employee' ? currentUser : null;
  const todayStr = formatLocalDateStr(today);
  const todayShiftCode = loggedInStaff ? schedules[`${loggedInStaff.id}_${todayStr}`] : null;
  const todayShiftInfo = todayShiftCode ? getShiftDisplayInfo(todayShiftCode, todayStr) : null;
  const todayFilledVal = loggedInStaff ? filledRecords[`${loggedInStaff.id}_${todayStr}`] : null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans pb-24 md:pb-10">
      
      {/* Header Utama */}
      <header className="bg-slate-900/90 backdrop-blur sticky top-0 z-30 border-b border-slate-800 px-4 lg:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-600/30">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-base md:text-lg leading-tight text-white flex items-center gap-2">
              Shift Rekam Medis
            </h1>
            <p className="text-[11px] text-slate-400">
              Akses: <strong className="text-emerald-400">{currentUser.name}</strong> {currentUser.role === 'admin' ? '(Ka. RM)' : `(${currentUser.role})`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden sm:flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
            <Clock className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span className="font-mono text-slate-200">
              {liveTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          </div>

          <button
            onClick={handleTestAlarm}
            className="flex items-center gap-1.5 px-3 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-xl text-xs font-semibold transition min-h-[38px]"
          >
            <Volume2 className="w-4 h-4" />
            <span className="hidden sm:inline">Tes Alarm</span>
          </button>

          <button
            onClick={() => setAlarmEnabled(!alarmEnabled)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition min-h-[38px] ${
              alarmEnabled ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            {alarmEnabled ? <Bell className="w-4 h-4 text-emerald-400" /> : <BellOff className="w-4 h-4 text-slate-400" />}
            <span className="hidden md:inline">{alarmEnabled ? 'Alarm Aktif' : 'Alarm Mati'}</span>
          </button>

          <button
            onClick={() => setIsLogoutModalOpen(true)}
            className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition min-h-[38px] min-w-[38px] flex items-center justify-center border border-transparent hover:border-red-500/20"
            title="Keluar"
          >
            <LogOut className="w-5 h-5 text-red-400" />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto space-y-5">

        {/* Banner Pegawai Aktif */}
        {loggedInStaff && (
          <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-slate-900 border border-emerald-800/50 rounded-3xl p-5 shadow-xl relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
              
              <div className="flex items-center gap-4">
                <img src={loggedInStaff.avatar} alt={loggedInStaff.name} className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-500 shadow-md" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                      NIP: {loggedInStaff.nip}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-white mt-0.5">{loggedInStaff.fullTitle || loggedInStaff.name}</h2>
                  <p className="text-xs text-slate-300">{loggedInStaff.role}</p>
                </div>
              </div>

              <div className="w-full sm:w-auto bg-slate-950/80 border border-slate-800 rounded-2xl p-3 flex items-center justify-between sm:justify-end gap-4">
                <div className="text-left">
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">Shift Hari Ini</div>
                  <div className="text-xs text-slate-200">
                    {todayShiftInfo ? todayShiftInfo.time : '-'}
                  </div>
                  <div className="text-[10px] text-teal-400 font-semibold mt-1">
                    Diisi Hari Ini: <span className="font-bold text-white">{todayFilledVal || '-'}</span>
                  </div>
                </div>
                {todayShiftCode && todayShiftInfo && (
                  <div className={`px-4 py-2 rounded-xl font-black text-sm border shadow ${todayShiftInfo.color}`}>
                    Shift {todayShiftCode} ({todayShiftInfo.label})
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* Navigasi Bulan & Tombol Generasi Rotasi */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 sm:p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          
          <div className="flex items-center justify-between sm:justify-start gap-3">
            <button
              onClick={() => {
                if (currentMonth === 0) {
                  setCurrentMonth(11);
                  setCurrentYear(currentYear - 1);
                } else {
                  setCurrentMonth(currentMonth - 1);
                }
              }}
              className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 hover:bg-slate-800 transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="text-center px-2">
              <span className="font-bold text-sm sm:text-base text-slate-100">
                {new Date(currentYear, currentMonth, 1).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
              </span>
            </div>
            <button
              onClick={() => {
                if (currentMonth === 11) {
                  setCurrentMonth(0);
                  setCurrentYear(currentYear + 1);
                } else {
                  setCurrentMonth(currentMonth + 1);
                }
              }}
              className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 hover:bg-slate-800 transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            {currentUser.role === 'admin' && (
              <button
                onClick={generateAutoMonthSchedules}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-600/20 transition min-h-[42px]"
              >
                <Sparkles className="w-4 h-4" /> Acak & Rotasi Jadwal
              </button>
            )}

            <div className="grid grid-cols-2 p-1 bg-slate-950 rounded-xl border border-slate-800 w-full sm:w-auto">
              <button
                onClick={() => setViewMode('card')}
                className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition ${
                  viewMode === 'card' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" /> Kartu
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition ${
                  viewMode === 'table' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Table className="w-3.5 h-3.5" /> Tabel Matriks
              </button>
            </div>
          </div>

        </div>

        {/* Legend Indikator Warna Shift */}
        <div className="space-y-2">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between flex-wrap gap-1">
            <span className="flex items-center gap-1.5">
              <span>Status Penanggalan:</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-400" /> Terkalibrasi Khusus Daftar Hari Raya 2026</span>
            </span>
            <span className="text-red-400 font-bold">* Shift di Hari Raya Terdaftar / Hari Minggu Otomatis BERWARNA MERAH</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            <div className={`p-2.5 rounded-xl border ${BASE_SHIFT_TYPES.P.color} flex flex-col justify-between shadow-sm`}>
              <div className="font-bold text-xs flex items-center gap-1"><Sun className="w-3.5 h-3.5" /> Shift P</div>
              <span className="text-[10px] opacity-80">Pagi (Hari Biasa)</span>
            </div>

            <div className={`p-2.5 rounded-xl border ${HOLIDAY_SHIFT_STYLES.P.color} flex flex-col justify-between shadow-sm`}>
              <div className="font-bold text-xs flex items-center justify-between">
                <span className="flex items-center gap-1"><Sun className="w-3.5 h-3.5 text-red-300" /> Shift P</span>
                <span className="text-[8px] bg-red-500 text-white px-1 rounded font-black">RED</span>
              </div>
              <span className="text-[10px] opacity-90">Pagi (Libur/Raya)</span>
            </div>

            <div className={`p-2.5 rounded-xl border ${BASE_SHIFT_TYPES.S.color} flex flex-col justify-between shadow-sm`}>
              <div className="font-bold text-xs flex items-center gap-1"><Moon className="w-3.5 h-3.5" /> Shift S</div>
              <span className="text-[10px] opacity-80">Siang (Hari Biasa)</span>
            </div>

            <div className={`p-2.5 rounded-xl border ${HOLIDAY_SHIFT_STYLES.S.color} flex flex-col justify-between shadow-sm`}>
              <div className="font-bold text-xs flex items-center justify-between">
                <span className="flex items-center gap-1"><Moon className="w-3.5 h-3.5 text-rose-300" /> Shift S</span>
                <span className="text-[8px] bg-rose-500 text-white px-1 rounded font-black">RED</span>
              </div>
              <span className="text-[10px] opacity-90">Siang (Libur/Raya)</span>
            </div>

            <div className={`p-2.5 rounded-xl border ${BASE_SHIFT_TYPES.PS.color} flex flex-col justify-between shadow-sm`}>
              <div className="font-bold text-xs flex items-center gap-1"><Zap className="w-3.5 h-3.5" /> Shift PS</div>
              <span className="text-[10px] opacity-80">Pagi-Siang (Biasa)</span>
            </div>

            <div className={`p-2.5 rounded-xl border ${HOLIDAY_SHIFT_STYLES.PS.color} flex flex-col justify-between shadow-sm`}>
              <div className="font-bold text-xs flex items-center justify-between">
                <span className="flex items-center gap-1"><Zap className="w-3.5 h-3.5 text-orange-300" /> Shift PS</span>
                <span className="text-[8px] bg-red-500 text-white px-1 rounded font-black">RED</span>
              </div>
              <span className="text-[10px] opacity-90">Pagi-Siang (Raya)</span>
            </div>

            <div className={`p-2.5 rounded-xl border ${BASE_SHIFT_TYPES.L.color} flex flex-col justify-between shadow-sm col-span-2 sm:col-span-1`}>
              <div className="font-bold text-xs flex items-center gap-1"><Coffee className="w-3.5 h-3.5" /> Shift L</div>
              <span className="text-[10px] opacity-80">Rest / Off</span>
            </div>
          </div>
        </div>

        {/* Kontrol Filter & Pencarian */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Cari nama staf..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 min-h-[42px]"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium whitespace-nowrap">Tanggal:</span>
            <input
              type="date"
              value={selectedDateStr}
              onChange={(e) => setSelectedDateStr(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500 min-h-[42px]"
            />
          </div>

          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <button
              onClick={() => setShiftFilter('ALL')}
              className={`px-3 py-2 text-xs rounded-xl font-semibold transition whitespace-nowrap ${
                shiftFilter === 'ALL' ? 'bg-emerald-600 text-white' : 'bg-slate-950 text-slate-400 border border-slate-800'
              }`}
            >
              Semua
            </button>
            {['P', 'S', 'PS', 'L'].map(code => (
              <button
                key={code}
                onClick={() => setShiftFilter(code)}
                className={`px-3 py-2 text-xs rounded-xl font-semibold transition whitespace-nowrap ${
                  shiftFilter === code ? 'bg-emerald-600 text-white' : 'bg-slate-950 text-slate-400 border border-slate-800'
                }`}
              >
                Shift {code}
              </button>
            ))}
          </div>

        </div>

        {/* VIEW 1: KARTU HARIAN */}
        {viewMode === 'card' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-400 px-1">
              <button 
                onClick={() => setCalendarDetailModalDate(selectedDateStr)}
                className="flex items-center gap-2 flex-wrap text-left hover:opacity-80 transition group cursor-pointer"
              >
                <span>Tanggal:</span>
                <strong className={checkHolidayStatus(selectedDateStr).isHoliday ? 'text-red-400 font-bold group-hover:underline' : 'text-emerald-400 group-hover:underline'}>
                  {parseLocalDate(selectedDateStr).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </strong>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full flex items-center gap-1 font-bold">
                  <Calendar className="w-3 h-3" /> Info Rerainan Bali
                </span>
                {checkHolidayStatus(selectedDateStr).isHoliday && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/40 font-bold">
                    {checkHolidayStatus(selectedDateStr).label}
                  </span>
                )}
              </button>
              <span>{filteredStaffList.length} Staf Rekam Medis</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredStaffList.map(staff => {
                const rawShiftCode = schedules[`${staff.id}_${selectedDateStr}`] || 'L';
                const shiftInfo = getShiftDisplayInfo(rawShiftCode, selectedDateStr);

                if (shiftFilter !== 'ALL' && shiftFilter !== rawShiftCode) return null;

                const stats = calculateStaffStats(staff.id);
                const ShiftIcon = shiftInfo.icon;
                const filledValue = filledRecords[`${staff.id}_${selectedDateStr}`] || '-';

                return (
                  <div key={staff.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg hover:border-slate-700 transition space-y-3">
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img src={staff.avatar} alt={staff.name} className="w-12 h-12 rounded-2xl object-cover border border-slate-700" />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                              Rekam Medis
                            </span>
                          </div>
                          <h3 className="font-bold text-slate-100 text-base mt-0.5">{staff.fullTitle}</h3>
                          <p className="text-[11px] text-slate-400">{staff.role}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          if (currentUser.role === 'admin') {
                            setSelectedCell({
                              staffId: staff.id,
                              staffName: staff.name,
                              dateStr: selectedDateStr,
                              currentShift: rawShiftCode
                            });
                          }
                        }}
                        disabled={currentUser.role !== 'admin'}
                        className={`px-3.5 py-2.5 rounded-2xl border text-xs font-bold transition flex flex-col items-center min-w-[90px] ${shiftInfo.color} ${
                          currentUser.role === 'admin' ? 'hover:scale-105 active:scale-95 cursor-pointer' : ''
                        }`}
                      >
                        <span className="text-lg font-black">{rawShiftCode}</span>
                        <span className="text-[9px] text-center opacity-90 leading-tight">
                          {shiftInfo.label}
                        </span>
                      </button>
                    </div>

                    <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5">
                        <ShiftIcon className={`w-4 h-4 ${checkHolidayStatus(selectedDateStr).isHoliday && rawShiftCode !== 'L' ? 'text-red-400 animate-pulse' : 'text-emerald-400'}`} />
                        <div>
                          <div className="text-[10px] uppercase font-semibold text-slate-500">Jam Operasional</div>
                          <div className="font-mono text-slate-200 font-medium">{shiftInfo.time}</div>
                        </div>
                      </div>
                      
                      {/* INFORMASI DIISI DI VIEW KARTU */}
                      <div 
                        onClick={() => {
                          if (currentUser.role === 'admin' || currentUser.id === staff.id) {
                            setEditingFilledCell({ staffId: staff.id, staffName: staff.name, dateStr: selectedDateStr });
                            setFilledInput(filledValue === '-' ? '' : filledValue);
                          }
                        }}
                        className="text-right cursor-pointer hover:opacity-80 transition bg-teal-950/50 border border-teal-800/40 px-2.5 py-1 rounded-lg"
                        title="Klik untuk mengubah catatan DIISI"
                      >
                        <div className="text-[10px] uppercase font-semibold text-teal-400 flex items-center gap-1 justify-end">
                          DIISI <Edit3 className="w-2.5 h-2.5" />
                        </div>
                        <div className="font-mono text-teal-200 font-bold text-xs">{filledValue}</div>
                      </div>

                      <div className="text-right">
                        <div className="text-[10px] uppercase font-semibold text-slate-500">Durasi Kerja</div>
                        <div className="font-mono text-emerald-400 font-bold">{shiftInfo.duration} Jam</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                      <span>Akumulasi Bulan Ini: <strong className="text-slate-200">{stats.totalHours} Jam ({stats.totalWorkDays} Kerja)</strong> | Total Diisi: <strong className="text-teal-300">{stats.totalFilled}</strong></span>
                      {currentUser.role === 'admin' && (
                        <span 
                          className="text-emerald-400 font-medium flex items-center gap-1 cursor-pointer hover:underline"
                          onClick={() => {
                            setSelectedCell({
                              staffId: staff.id,
                              staffName: staff.name,
                              dateStr: selectedDateStr,
                              currentShift: rawShiftCode
                            });
                          }}
                        >
                          <Edit3 className="w-3 h-3" /> Edit Shift
                        </span>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* VIEW 2: TABEL MATRIKS BULANAN */}
        {viewMode === 'table' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-3 bg-slate-950 border-b border-slate-800 text-xs text-slate-400 flex items-center justify-between flex-wrap gap-2">
              <span>Tabel Matriks Shift - {new Date(currentYear, currentMonth, 1).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}</span>
              <span className="text-amber-400 font-semibold">* Klik header tanggal untuk detail Kalender Bali & Hari Raya. Klik sel "DIISI" untuk mengedit.</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[1080px]">
                <thead>
                  <tr className="bg-slate-950/90 border-b border-slate-800 text-xs font-semibold text-slate-400">
                    <th className="p-4 sticky left-0 bg-slate-950 z-10 w-56 border-r border-slate-800">
                      Staf Rekam Medis
                    </th>
                    <th className="p-4 text-center w-28 border-r border-slate-800">Total Jam</th>
                    <th className="p-4 text-center w-24 border-r border-slate-800 text-teal-400 bg-teal-950/30">
                      DIISI (Total)
                    </th>
                    {daysInMonthList.map(day => {
                      const dateStr = formatLocalDateStr(day);
                      const isToday = dateStr === formatLocalDateStr(today);
                      const dayNum = day.getDate();
                      const dayName = day.toLocaleDateString('id-ID', { weekday: 'short' });
                      const status = checkHolidayStatus(dateStr);

                      return (
                        <th
                          key={dateStr}
                          onClick={() => setCalendarDetailModalDate(dateStr)}
                          className={`p-2 text-center min-w-[64px] cursor-pointer hover:bg-amber-500/10 transition border-r border-slate-800/50 ${
                            isToday ? 'bg-emerald-950/80 text-emerald-300 font-bold' : ''
                          } ${status.isHoliday ? 'bg-red-950/50 text-red-300 border-b-2 border-b-red-500' : ''}`}
                          title="Klik untuk melihat Detail Kalender Bali & Hari Raya"
                        >
                          <div className={`text-[10px] uppercase ${status.isHoliday ? 'text-red-400 font-black' : ''}`}>{dayName}</div>
                          <div className={`text-sm font-semibold ${status.isHoliday ? 'text-red-200 font-extrabold' : ''}`}>{dayNum}</div>
                          {status.isPurnama && <div className="text-[8px] text-amber-300 font-bold">PUR</div>}
                          {status.isTilem && <div className="text-[8px] text-purple-300 font-bold">TIL</div>}
                          {HOLIDAYS_DATABASE[dateStr] && !status.isPurnama && !status.isTilem && (
                            <div className="text-[8px] text-red-300 font-bold">RAYA</div>
                          )}
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-sm">
                  {filteredStaffList.map(staff => {
                    const stats = calculateStaffStats(staff.id);

                    return (
                      <tr key={staff.id} className="hover:bg-slate-800/30 transition">
                        
                        <td className="p-3 sticky left-0 bg-slate-900 z-10 border-r border-slate-800">
                          <div className="flex items-center gap-3">
                            <img src={staff.avatar} alt={staff.name} className="w-8 h-8 rounded-lg object-cover border border-slate-700" />
                            <div>
                              <div className="font-bold text-slate-100 text-xs sm:text-sm">{staff.name}</div>
                              <div className="text-[10px] text-emerald-400 font-medium">Rekam Medis</div>
                            </div>
                          </div>
                        </td>

                        <td className="p-2 text-center border-r border-slate-800">
                          <div className="text-xs font-mono font-bold text-emerald-400">
                            {stats.totalHours} Jam
                          </div>
                          <div className="text-[10px] text-slate-500">
                            {stats.totalWorkDays} Kerja / {stats.totalOffDays} Libur
                          </div>
                        </td>

                        <td className="p-2 text-center border-r border-slate-800 bg-teal-950/20 font-mono font-bold text-teal-300 text-xs">
                          {stats.totalFilled}
                        </td>

                        {daysInMonthList.map(day => {
                          const dateStr = formatLocalDateStr(day);
                          const rawShiftCode = schedules[`${staff.id}_${dateStr}`] || 'L';
                          const shiftInfo = getShiftDisplayInfo(rawShiftCode, dateStr);
                          const isDimmed = shiftFilter !== 'ALL' && shiftFilter !== rawShiftCode;
                          const filledVal = filledRecords[`${staff.id}_${dateStr}`] || '';

                          return (
                            <td
                              key={dateStr}
                              className={`p-1 text-center border-r border-slate-800/40 ${isDimmed ? 'opacity-30' : ''}`}
                            >
                              <div className="flex flex-col gap-1">
                                <button
                                  onClick={() => {
                                    if (currentUser.role === 'admin') {
                                      setSelectedCell({
                                        staffId: staff.id,
                                        staffName: staff.name,
                                        dateStr,
                                        currentShift: rawShiftCode
                                      });
                                    }
                                  }}
                                  disabled={currentUser.role !== 'admin'}
                                  className={`w-full py-1 px-1 rounded-lg border text-xs font-bold transition flex items-center justify-center ${
                                    shiftInfo.color
                                  } ${currentUser.role === 'admin' ? 'hover:scale-105 active:scale-95 cursor-pointer' : 'cursor-default'}`}
                                >
                                  {rawShiftCode}
                                </button>

                                <button
                                  onClick={() => {
                                    if (currentUser.role === 'admin' || currentUser.id === staff.id) {
                                      setEditingFilledCell({ staffId: staff.id, staffName: staff.name, dateStr });
                                      setFilledInput(filledVal);
                                    }
                                  }}
                                  className={`w-full text-[10px] py-0.5 px-1 rounded font-mono border transition ${
                                    filledVal 
                                      ? 'bg-teal-950/80 text-teal-200 border-teal-600/50 hover:bg-teal-900' 
                                      : 'bg-slate-950/60 text-slate-500 border-slate-800 hover:text-slate-300'
                                  }`}
                                  title="Klik untuk mengisi/mengedit status Rekam Medis Diisi"
                                >
                                  {filledVal ? `D: ${filledVal}` : '+ Diisi'}
                                </button>
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>

      {/* POP-UP MODAL EDIT DIISI */}
      {editingFilledCell && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-teal-500/40 rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-300 border border-teal-500/30 flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Update Catatan DIISI</h3>
                  <p className="text-[11px] text-slate-400">{editingFilledCell.staffName} ({editingFilledCell.dateStr})</p>
                </div>
              </div>
              <button onClick={() => setEditingFilledCell(null)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              handleSaveFilledRecord(editingFilledCell.staffId, editingFilledCell.dateStr, filledInput);
            }} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">
                  Jumlah / Keterangan Berkas Diisi
                </label>
                <input
                  type="text"
                  value={filledInput}
                  onChange={(e) => setFilledInput(e.target.value)}
                  placeholder="Contoh: 15 / Selesai / 10 Berkas..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setEditingFilledCell(null)}
                  className="py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl text-xs transition shadow-lg shadow-teal-600/30"
                >
                  Simpan Diisi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* POP-UP MODAL KONFIRMASI LOGOUT */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-6 shadow-2xl text-center space-y-4">
            <div className="w-14 h-14 bg-red-500/10 text-red-400 border border-red-500/20 rounded-2xl flex items-center justify-center mx-auto">
              <LogOut className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-white">Konfirmasi Keluar</h3>
              <p className="text-xs text-slate-400 mt-1">
                Apakah Anda yakin ingin keluar dari akun <strong className="text-slate-200">{currentUser.name}</strong>?
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setIsLogoutModalOpen(false)}
                className="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs transition min-h-[44px]"
              >
                Batal
              </button>
              <button
                onClick={handleLogout}
                className="py-3 px-4 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-xs transition shadow-lg shadow-red-600/30 min-h-[44px]"
              >
                Ya, Keluar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POP-UP MODAL DETAIL KALENDER BALI & HARI RAYA */}
      {calendarDetailModalDate && (() => {
        const detailDate = parseLocalDate(calendarDetailModalDate);
        const bali = getBaliCalendarDetails(detailDate);
        const nationalHoliday = HOLIDAYS_DATABASE[calendarDetailModalDate];

        return (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-amber-500/40 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
              
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">Detail Rerainan Bali</h3>
                    <p className="text-[11px] text-slate-400">Wariga & Penanggalan Terdaftar</p>
                  </div>
                </div>
                <button onClick={() => setCalendarDetailModalDate(null)} className="text-slate-400 hover:text-white p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
                <div className="text-xs text-emerald-400 font-bold uppercase tracking-wider">
                  {detailDate.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">Wuku</span>
                    <span className="font-bold text-amber-300">{bali.wuku}</span>
                  </div>
                  <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">Saptawara</span>
                    <span className="font-bold text-slate-200">{bali.saptawara}</span>
                  </div>
                  <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">Pancawara</span>
                    <span className="font-bold text-teal-300">{bali.pancawara}</span>
                  </div>
                  <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">Triwara</span>
                    <span className="font-bold text-indigo-300">{bali.triwara}</span>
                  </div>
                </div>

                {nationalHoliday ? (
                  <div className="p-3 bg-red-950/40 border border-red-800/50 rounded-xl text-xs text-red-300 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-red-200">Hari Raya / Tanggal Merah:</strong>
                      {nationalHoliday}
                    </div>
                  </div>
                ) : (
                  <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-400">
                    Tidak ada hari raya Bali / tanggal merah khusus pada tanggal ini.
                  </div>
                )}
              </div>

              <button
                onClick={() => setCalendarDetailModalDate(null)}
                className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs transition"
              >
                Tutup Info Tanggal
              </button>

            </div>
          </div>
        );
      })()}

      {/* MODAL EDIT SHIFT */}
      {selectedCell && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-white">Ubah Shift Staf</h3>
              <button onClick={() => setSelectedCell(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-400 mb-5">
              Staf: <strong className="text-emerald-400">{selectedCell.staffName}</strong> <br/>
              Tanggal: <strong className="text-slate-200">{selectedCell.dateStr}</strong> 
              {checkHolidayStatus(selectedCell.dateStr).isHoliday && (
                <span className="ml-2 text-red-400 font-bold block mt-1">
                  ({checkHolidayStatus(selectedCell.dateStr).label})
                </span>
              )}
            </p>

            <div className="space-y-2.5 mb-6">
              {['P', 'S', 'PS', 'L'].map((code) => {
                const type = getShiftDisplayInfo(code, selectedCell.dateStr);
                const Icon = type.icon;
                return (
                  <button
                    key={code}
                    onClick={() => handleAssignShift(selectedCell.staffId, selectedCell.dateStr, code)}
                    className={`w-full p-3.5 rounded-xl border flex items-center justify-between transition min-h-[52px] ${type.color} ${
                      selectedCell.currentShift === code ? 'ring-2 ring-emerald-500 font-bold' : 'opacity-80 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-9 h-9 rounded-lg bg-black/30 flex items-center justify-center font-extrabold text-sm">
                        <Icon className="w-4 h-4" />
                      </span>
                      <div className="text-left">
                        <div className="text-sm font-bold">
                          {type.label} ({code})
                        </div>
                        <div className="text-xs opacity-80">{type.time}</div>
                      </div>
                    </div>
                    {selectedCell.currentShift === code && <Check className="w-5 h-5 text-emerald-400" />}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setSelectedCell(null)}
              className="w-full py-3 bg-slate-800 text-slate-300 font-semibold rounded-xl text-xs"
            >
              Batal
            </button>
          </div>
        </div>
      )}

      {/* MODAL ALARM SHIFT */}
      {activeAlarmModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-amber-500/60 rounded-3xl max-w-sm w-full p-6 shadow-2xl shadow-amber-500/20 text-center relative overflow-hidden">
            
            <button 
              onClick={closeAlarmModal}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-xl bg-slate-800/50 transition"
              title="Tutup"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 bg-amber-500/20 text-amber-400 border border-amber-500/40 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-bounce">
              <Bell className="w-8 h-8 text-amber-400 animate-pulse" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{activeAlarmModal.title}</h3>
            <p className="text-xs sm:text-sm text-slate-300 mb-6 leading-relaxed">{activeAlarmModal.message}</p>
            
            <button
              onClick={closeAlarmModal}
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3.5 rounded-xl transition shadow-lg text-sm flex items-center justify-center gap-2"
            >
              <BellOff className="w-4 h-4" /> Matikan Alarm
            </button>
          </div>
        </div>
      )}

    </div>
  );
}