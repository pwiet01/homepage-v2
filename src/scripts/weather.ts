import type { WeatherCondition } from '../i18n/content';

export interface Weather {
  temperature: number;
  windSpeed: number;
  condition: WeatherCondition;
  isDay: boolean;
}

const URL =
  'https://api.open-meteo.com/v1/forecast?latitude=53.55&longitude=9.99' +
  '&current=temperature_2m,weather_code,wind_speed_10m,is_day&timezone=Europe%2FBerlin';
const CACHE_KEY = 'hamburg-weather';
const CACHE_MS = 15 * 60 * 1000;

/** Ordnet die WMO-Wettercodes von Open-Meteo einer groben Kategorie zu. */
function conditionFor(code: number): WeatherCondition {
  if (code === 0) return 'clear';
  if (code <= 2) return 'partly';
  if (code === 3) return 'cloudy';
  if (code <= 48) return 'fog';
  if (code <= 57) return 'drizzle';
  if (code <= 67) return 'rain';
  if (code <= 77) return 'snow';
  if (code <= 82) return 'showers';
  if (code <= 86) return 'snow';
  return 'thunder';
}

// U+FE0E erzwingt die Textdarstellung, damit die Symbole nicht als bunte Emoji erscheinen
const ICONS: Record<WeatherCondition, string> = {
  clear: '☀︎',
  partly: '☁︎',
  cloudy: '☁︎',
  fog: '≋',
  drizzle: '☂︎',
  rain: '☂︎',
  snow: '❄︎',
  showers: '☂︎',
  thunder: '⚡︎',
};

export function weatherIcon(w: Weather): string {
  return w.condition === 'clear' && !w.isDay ? '☾︎' : ICONS[w.condition];
}

function readCache(): Weather | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { at, weather } = JSON.parse(raw);
    return Date.now() - at < CACHE_MS ? weather : null;
  } catch {
    return null;
  }
}

function writeCache(weather: Weather) {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), weather }));
  } catch {
    // Ohne Speicher wird beim nächsten Aufruf einfach neu geladen
  }
}

let pending: Promise<Weather | null> | null = null;

/** Liefert das aktuelle Wetter in Hamburg oder null, wenn die API nicht erreichbar ist. */
export function loadWeather(): Promise<Weather | null> {
  const cached = readCache();
  if (cached) return Promise.resolve(cached);
  pending ??= fetch(URL, { signal: AbortSignal.timeout(5000) })
    .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
    .then((data) => {
      const c = data.current;
      const weather: Weather = {
        temperature: Math.round(c.temperature_2m),
        windSpeed: Math.round(c.wind_speed_10m),
        condition: conditionFor(c.weather_code),
        isDay: c.is_day === 1,
      };
      writeCache(weather);
      return weather;
    })
    .catch(() => null)
    .finally(() => {
      pending = null;
    });
  return pending;
}
