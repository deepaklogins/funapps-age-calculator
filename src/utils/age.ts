export interface AgeResult {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalWeeks: number;
  totalHours: number;
  totalMinutes: number;
  nextBirthday: Date;
  daysUntilBirthday: number;
  dayOfWeek: string;
  zodiacSign: string;
  zodiacEmoji: string;
  birthstone: string;
  chineseZodiac: string;
  heartbeats: number;
  breaths: number;
  sleepYears: number;
  moonOrbits: number;
  season: string;
  generation: string;
}

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const ZODIAC_SIGNS: { sign: string; emoji: string; start: [number, number]; end: [number, number] }[] = [
  { sign: 'Capricorn', emoji: '♑', start: [12, 22], end: [1, 19] },
  { sign: 'Aquarius', emoji: '♒', start: [1, 20], end: [2, 18] },
  { sign: 'Pisces', emoji: '♓', start: [2, 19], end: [3, 20] },
  { sign: 'Aries', emoji: '♈', start: [3, 21], end: [4, 19] },
  { sign: 'Taurus', emoji: '♉', start: [4, 20], end: [5, 20] },
  { sign: 'Gemini', emoji: '♊', start: [5, 21], end: [6, 20] },
  { sign: 'Cancer', emoji: '♋', start: [6, 21], end: [7, 22] },
  { sign: 'Leo', emoji: '♌', start: [7, 23], end: [8, 22] },
  { sign: 'Virgo', emoji: '♍', start: [8, 23], end: [9, 22] },
  { sign: 'Libra', emoji: '♎', start: [9, 23], end: [10, 22] },
  { sign: 'Scorpio', emoji: '♏', start: [10, 23], end: [11, 21] },
  { sign: 'Sagittarius', emoji: '♐', start: [11, 22], end: [12, 21] },
];

const BIRTHSTONES: Record<number, string> = {
  1: '💎 Garnet',
  2: '💜 Amethyst',
  3: '🩵 Aquamarine',
  4: '💎 Diamond',
  5: '💚 Emerald',
  6: '🤍 Pearl',
  7: '❤️ Ruby',
  8: '💚 Peridot',
  9: '💙 Sapphire',
  10: '🌈 Opal',
  11: '🟡 Topaz',
  12: '💠 Tanzanite',
};

const CHINESE_ZODIAC = ['Rat 🐀', 'Ox 🐂', 'Tiger 🐯', 'Rabbit 🐇', 'Dragon 🐉', 'Snake 🐍', 'Horse 🐴', 'Goat 🐐', 'Monkey 🐵', 'Rooster 🐓', 'Dog 🐕', 'Pig 🐷'];

function getZodiac(month: number, day: number): { sign: string; emoji: string } {
  for (const z of ZODIAC_SIGNS) {
    const afterStart = month > z.start[0] || (month === z.start[0] && day >= z.start[1]);
    const beforeEnd = month < z.end[0] || (month === z.end[0] && day <= z.end[1]);

    if (z.sign === 'Capricorn') {
      if (afterStart || beforeEnd) return { sign: z.sign, emoji: z.emoji };
    } else {
      if (afterStart && beforeEnd) return { sign: z.sign, emoji: z.emoji };
    }
  }
  return { sign: 'Capricorn', emoji: '♑' };
}

function getGeneration(year: number): string {
  if (year >= 2013) return 'Gen Alpha';
  if (year >= 1997) return 'Gen Z';
  if (year >= 1981) return 'Millennial';
  if (year >= 1965) return 'Gen X';
  if (year >= 1946) return 'Baby Boomer';
  return 'Silent Generation';
}

function getSeason(month: number): string {
  if (month >= 3 && month <= 5) return '🌸 Spring';
  if (month >= 6 && month <= 8) return '☀️ Summer';
  if (month >= 9 && month <= 11) return '🍂 Autumn';
  return '❄️ Winter';
}

export function calculateAge(birthDate: Date): AgeResult {
  const now = new Date();
  const birth = new Date(birthDate);

  let years = now.getFullYear() - birth.getFullYear();
  let months = now.getMonth() - birth.getMonth();
  let days = now.getDate() - birth.getDate();

  if (days < 0) {
    months--;
    const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    days += prevMonth.getDate();
  }
  if (months < 0) {
    years--;
    months += 12;
  }

  const totalMs = now.getTime() - birth.getTime();
  const totalDays = Math.floor(totalMs / (1000 * 60 * 60 * 24));
  const totalWeeks = Math.floor(totalDays / 7);
  const totalHours = Math.floor(totalMs / (1000 * 60 * 60));
  const totalMinutes = Math.floor(totalMs / (1000 * 60));

  // Next birthday
  let nextBirthday = new Date(now.getFullYear(), birth.getMonth(), birth.getDate());
  if (nextBirthday <= now) {
    nextBirthday = new Date(now.getFullYear() + 1, birth.getMonth(), birth.getDate());
  }
  const daysUntilBirthday = Math.ceil((nextBirthday.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  const dayOfWeek = DAYS_OF_WEEK[birth.getDay()];
  const zodiac = getZodiac(birth.getMonth() + 1, birth.getDate());
  const birthstone = BIRTHSTONES[birth.getMonth() + 1];
  const chineseZodiac = CHINESE_ZODIAC[(birth.getFullYear() - 4) % 12];

  // Fun stats
  const heartbeats = Math.round(totalMinutes * 72); // avg 72 bpm
  const breaths = Math.round(totalMinutes * 16); // avg 16 breaths/min
  const sleepYears = Math.round((years * 0.33) * 10) / 10; // ~1/3 of life sleeping
  const moonOrbits = Math.round((totalDays / 27.3) * 10) / 10; // lunar orbit ~27.3 days
  const season = getSeason(birth.getMonth() + 1);
  const generation = getGeneration(birth.getFullYear());

  return {
    years, months, days, totalDays, totalWeeks, totalHours, totalMinutes,
    nextBirthday, daysUntilBirthday, dayOfWeek, zodiacSign: zodiac.sign,
    zodiacEmoji: zodiac.emoji, birthstone, chineseZodiac, heartbeats, breaths,
    sleepYears, moonOrbits, season, generation,
  };
}
