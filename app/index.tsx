import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Share,
  Platform,
} from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { calculateAge, AgeResult } from '../src/utils/age';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function NumberPicker({
  value,
  min,
  max,
  onChange,
  label,
  items,
}: {
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
  label: string;
  items?: string[];
}) {
  return (
    <View style={styles.pickerCol}>
      <Text style={styles.pickerLabel}>{label}</Text>
      <View style={styles.pickerRow}>
        <TouchableOpacity
          style={styles.pickerBtn}
          onPress={() => {
            if (value > min) { onChange(value - 1); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }
          }}
          accessibilityLabel={`Decrease ${label}`}
          accessibilityRole="button"
        >
          <Ionicons name="remove" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.pickerValue}>
          {items ? items[value] : value}
        </Text>
        <TouchableOpacity
          style={styles.pickerBtn}
          onPress={() => {
            if (value < max) { onChange(value + 1); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }
          }}
          accessibilityLabel={`Increase ${label}`}
          accessibilityRole="button"
        >
          <Ionicons name="add" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

function StatCard({ emoji, label, value, color }: { emoji: string; label: string; value: string; color: string }) {
  return (
    <View style={[styles.statCard, { borderColor: color + '30' }]}>
      <Text style={styles.statEmoji}>{emoji}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

export default function HomeScreen() {
  const now = new Date();
  const [day, setDay] = useState(1);
  const [month, setMonth] = useState(0); // 0-indexed
  const [year, setYear] = useState(2000);
  const [result, setResult] = useState<AgeResult | null>(null);

  const maxDay = new Date(year, month + 1, 0).getDate();

  const handleCalculate = () => {
    const birthDate = new Date(year, month, Math.min(day, maxDay));
    if (birthDate > now) return;
    const r = calculateAge(birthDate);
    setResult(r);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleShare = async () => {
    if (!result) return;
    const text = `🎂 My Age Report\n\n` +
      `📅 Born on ${MONTHS[month]} ${day}, ${year} (${result.dayOfWeek})\n` +
      `🎯 Age: ${result.years} years, ${result.months} months, ${result.days} days\n` +
      `⏰ That's ${result.totalDays.toLocaleString()} days alive!\n` +
      `💓 Heart has beaten ~${(result.heartbeats / 1e9).toFixed(1)} billion times\n` +
      `${result.zodiacEmoji} ${result.zodiacSign} | ${result.chineseZodiac}\n` +
      `🎂 Next birthday in ${result.daysUntilBirthday} days!\n\n` +
      `— Age Calculator app`;
    try { await Share.share({ message: text }); } catch {}
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Stack.Screen options={{ title: 'Age Calculator' }} />

      <Text style={styles.heroEmoji}>🎂</Text>
      <Text style={styles.title}>Age Calculator</Text>
      <Text style={styles.subtitle}>Enter your date of birth</Text>

      {/* Date picker */}
      <View style={styles.datePickerCard}>
        <View style={styles.datePickerRow}>
          <NumberPicker value={day} min={1} max={maxDay} onChange={setDay} label="Day" />
          <NumberPicker value={month} min={0} max={11} onChange={setMonth} label="Month" items={MONTHS} />
          <NumberPicker value={year} min={1900} max={now.getFullYear()} onChange={setYear} label="Year" />
        </View>
      </View>

      <TouchableOpacity
        style={styles.calcBtn}
        onPress={handleCalculate}
        accessibilityLabel="Calculate age"
        accessibilityRole="button"
      >
        <Ionicons name="calculator" size={22} color="#fff" />
        <Text style={styles.calcBtnText}>Calculate My Age</Text>
      </TouchableOpacity>

      {result && (
        <>
          {/* Main age */}
          <View style={styles.ageCard}>
            <Text style={styles.ageYears}>{result.years}</Text>
            <Text style={styles.ageLabel}>years old</Text>
            <Text style={styles.ageDetail}>
              {result.years} years, {result.months} months, {result.days} days
            </Text>
          </View>

          {/* Next birthday */}
          <View style={styles.birthdayCard}>
            <Text style={styles.birthdayEmoji}>🎉</Text>
            <View style={styles.birthdayInfo}>
              <Text style={styles.birthdayTitle}>Next Birthday</Text>
              <Text style={styles.birthdayDays}>{result.daysUntilBirthday} days away</Text>
            </View>
          </View>

          {/* Birth info */}
          <Text style={styles.sectionTitle}>About Your Birthday</Text>
          <View style={styles.statsGrid}>
            <StatCard emoji="📅" label="Born on" value={result.dayOfWeek} color="#3498db" />
            <StatCard emoji={result.zodiacEmoji} label="Zodiac" value={result.zodiacSign} color="#9b59b6" />
            <StatCard emoji="🐉" label="Chinese Zodiac" value={result.chineseZodiac.split(' ')[0]} color="#e74c3c" />
            <StatCard emoji="💎" label="Birthstone" value={result.birthstone.split(' ')[1]} color="#2ecc71" />
            <StatCard emoji={result.season.split(' ')[0]} label="Born in" value={result.season.split(' ')[1]} color="#f39c12" />
            <StatCard emoji="👤" label="Generation" value={result.generation} color="#1abc9c" />
          </View>

          {/* Fun stats */}
          <Text style={styles.sectionTitle}>Fun Facts</Text>
          <View style={styles.statsGrid}>
            <StatCard emoji="📆" label="Days alive" value={result.totalDays.toLocaleString()} color="#e94560" />
            <StatCard emoji="📅" label="Weeks alive" value={result.totalWeeks.toLocaleString()} color="#3498db" />
            <StatCard emoji="⏰" label="Hours alive" value={result.totalHours.toLocaleString()} color="#9b59b6" />
            <StatCard emoji="💓" label="Heartbeats" value={`~${(result.heartbeats / 1e9).toFixed(1)}B`} color="#e74c3c" />
            <StatCard emoji="🌬️" label="Breaths taken" value={`~${(result.breaths / 1e6).toFixed(0)}M`} color="#2ecc71" />
            <StatCard emoji="😴" label="Years sleeping" value={`~${result.sleepYears}`} color="#f39c12" />
            <StatCard emoji="🌙" label="Moon orbits" value={`${result.moonOrbits}`} color="#7f8c8d" />
            <StatCard emoji="⏱️" label="Minutes alive" value={`${(result.totalMinutes / 1e6).toFixed(1)}M`} color="#1abc9c" />
          </View>

          {/* Share */}
          <TouchableOpacity
            style={styles.shareBtn}
            onPress={handleShare}
            accessibilityLabel="Share age results"
            accessibilityRole="button"
          >
            <Ionicons name="share-outline" size={22} color="#fff" />
            <Text style={styles.shareBtnText}>Share My Age Report</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a1a' },
  content: { padding: 20, alignItems: 'center', paddingBottom: 40 },
  heroEmoji: { fontSize: 64, marginTop: 10 },
  title: { fontSize: 30, fontWeight: '900', color: '#fff', marginTop: 8 },
  subtitle: { fontSize: 14, color: '#888', marginTop: 4, marginBottom: 20 },

  datePickerCard: {
    backgroundColor: '#141428',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    marginBottom: 16,
  },
  datePickerRow: { flexDirection: 'row', justifyContent: 'space-around' },
  pickerCol: { alignItems: 'center' },
  pickerLabel: { color: '#888', fontSize: 12, marginBottom: 8 },
  pickerRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  pickerBtn: {
    backgroundColor: '#2a2a4a',
    borderRadius: 12,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    minWidth: 48,
  },
  pickerValue: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    minWidth: 50,
    textAlign: 'center',
  },

  calcBtn: {
    backgroundColor: '#e94560',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: '100%',
    marginBottom: 20,
    minHeight: 48,
  },
  calcBtnText: { color: '#fff', fontSize: 17, fontWeight: '700' },

  ageCard: {
    backgroundColor: '#e94560',
    borderRadius: 24,
    padding: 28,
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
  },
  ageYears: { fontSize: 64, fontWeight: '900', color: '#fff' },
  ageLabel: { fontSize: 18, color: 'rgba(255,255,255,0.8)', marginTop: -4 },
  ageDetail: { fontSize: 14, color: 'rgba(255,255,255,0.6)', marginTop: 8 },

  birthdayCard: {
    backgroundColor: '#141428',
    borderRadius: 18,
    padding: 18,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 20,
  },
  birthdayEmoji: { fontSize: 36 },
  birthdayInfo: { flex: 1 },
  birthdayTitle: { color: '#888', fontSize: 13 },
  birthdayDays: { color: '#fff', fontSize: 22, fontWeight: '800' },

  sectionTitle: { color: '#fff', fontSize: 18, fontWeight: '700', alignSelf: 'flex-start', marginBottom: 12, marginTop: 4 },

  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 16,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#141428',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
  statEmoji: { fontSize: 24 },
  statValue: { color: '#fff', fontSize: 16, fontWeight: '700', marginTop: 6 },
  statLabel: { color: '#888', fontSize: 11, marginTop: 2 },

  shareBtn: {
    backgroundColor: '#e94560',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: '100%',
    minHeight: 48,
  },
  shareBtnText: { color: '#fff', fontSize: 17, fontWeight: '700' },
});
