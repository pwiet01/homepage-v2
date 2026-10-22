import { ageOn } from '../lib/age';
import { loadWeather, weatherIcon, type Weather } from './weather';
import type { Command, SectionId, TerminalStrings } from '../i18n/content';

interface TerminalData extends TerminalStrings {
  sections: { id: SectionId; cmd: string }[];
  nav: Record<SectionId, string>;
  otherPath: string;
  otherLang: string;
}

const ALIASES: Record<string, SectionId> = {
  whoami: 'about', about: 'about', 'über': 'about', ueber: 'about',
  experience: 'experience', erfahrung: 'experience', jobs: 'experience', cv: 'experience', lebenslauf: 'experience',
  education: 'education', ausbildung: 'education', studium: 'education',
  skills: 'skills', kenntnisse: 'skills', stack: 'skills',
  links: 'links', github: 'links', linkedin: 'links',
};

const FERRIS = [
  '    _~^~^~_',
  '\\) /  o o  \\ (/',
  "  '_   -   _'",
  "  / '-----' \\",
].join('\n');

const esc = (s: string) =>
  s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);
let promptWeather = '';
const prompt = (c: string) =>
  `<span class="p-user">patrice@hamburg</span><span class="p-weather">${promptWeather}</span> <span class="p-path">~</span> <span class="dim">❯</span> ${c}`;

export function initTerminal() {
  const dataEl = document.getElementById('terminal-data');
  const input = document.getElementById('cmd') as HTMLInputElement | null;
  const output = document.getElementById('output');
  if (!dataEl || !input || !output) return;

  const t: TerminalData = JSON.parse(dataEl.textContent ?? '{}');
  document.getElementById('window')?.classList.remove('no-js');

  // Alter aktualisieren, falls seit dem Build ein Geburtstag war
  document.querySelectorAll('[data-age]').forEach((el) => (el.textContent = String(ageOn(new Date()))));

  // Hamburger Wetter im Prompt; ohne Antwort der API bleibt der Prompt einfach wie bisher
  function showWeather(w: Weather) {
    promptWeather = ` ${w.temperature}°C ${weatherIcon(w)}`;
    document.querySelectorAll('.p-weather').forEach((el) => {
      el.textContent = promptWeather;
      el.setAttribute('title', t.weather.source);
    });
  }
  loadWeather().then((w) => w && showWeather(w));

  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const sleep = (ms: number) => new Promise((r) => setTimeout(r, reduceMotion ? 0 : ms));
  // gen steigt bei clear, damit laufende Ausgaben abbrechen
  let gen = 0;

  function out(html: string) {
    const d = document.createElement('div');
    d.className = 'out';
    d.innerHTML = html;
    output!.appendChild(d);
    window.scrollTo({ top: document.documentElement.scrollHeight });
  }

  async function stream(lines: (string | number)[], delay = 180) {
    const g = gen;
    for (const l of lines) {
      if (g !== gen) return;
      if (typeof l === 'number') await sleep(l);
      else {
        out(l);
        await sleep(delay);
      }
    }
  }

  function jump(id: SectionId) {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ block: 'start' });
    el.classList.remove('flash');
    void el.offsetWidth;
    el.classList.add('flash');
  }

  function helpText(commands: Command[]) {
    const width = Math.max(...commands.map((c) => c.cmd.length)) + 2;
    const rows = commands.map((c) => `  <span class="acc">${esc(c.cmd)}</span>${' '.repeat(width - c.cmd.length)}${esc(c.desc)}`);
    return [t.help, ...rows].join('\n');
  }

  function ferrisRun() {
    if (reduceMotion) return;
    const lane = document.createElement('div');
    lane.className = 'ferris-lane';
    lane.setAttribute('aria-hidden', 'true');
    lane.innerHTML = `<pre>${esc(FERRIS)}</pre>`;
    document.body.appendChild(lane);
    lane.firstElementChild!.addEventListener('animationend', () => lane.remove());
  }

  let lambdaWarm = false;
  const requestId = () => (crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(16).slice(2));

  const eggs: Record<string, () => void | Promise<void>> = {
    kafka: () =>
      stream([
        '<span class="dim">$ kafka-console-consumer --topic die-verwandlung --from-beginning</span>',
        400,
        '<span class="dim">partition=0 offset=0 key=gregor.samsa timestamp=1915-10-01</span>',
        esc(t.kafkaMsg),
        600,
        `<span class="dim">${esc(t.kafkaDone)}</span>`,
      ]),
    'cargo run': () =>
      stream([
        `   <span class="ok">Compiling</span> patrice v${ageOn(new Date())}.0.0 (~/hamburg)`,
        900,
        '    <span class="ok">Finished</span> `release` profile [optimized] target(s) in 0.42s',
        '     <span class="ok">Running</span> `target/release/patrice`',
        300,
        `<span class="ferris">${esc(FERRIS)}</span>`,
      ]).then(ferrisRun),
    cargo: () => out(`<span class="dim">${esc(t.cargoHint)} <span class="acc">cargo run</span>?</span>`),
    lambda: () => {
      const id = requestId();
      const cold = !lambdaWarm;
      lambdaWarm = true;
      return stream([
        `<span class="dim">START RequestId: ${id} Version: $LATEST</span>`,
        ...(cold ? [`<span class="warn">${esc(t.lambdaCold)}</span>`, 2000] : [120]),
        `{ "statusCode": 200, "body": "${esc(t.lambdaBody)}" }`,
        `<span class="dim">END RequestId: ${id}</span>`,
        `<span class="dim">REPORT Duration: ${cold ? '2001.00' : '3.14'} ms  Billed Duration: ${cold ? 2001 : 4} ms  Memory Size: 128 MB  Max Memory Used: 18 MB${cold ? '  Init Duration: 418.00 ms' : ''}</span>`,
      ]);
    },
    moin: () => out(esc(t.moin)),
    [t.weather.cmd]: async () => {
      const g = gen;
      const w = await loadWeather();
      if (g !== gen) return;
      if (!w) return out(`<span class="dim">${esc(t.weather.unavailable)}</span>`);
      showWeather(w);
      out(
        `Hamburg · ${w.temperature} °C · ${weatherIcon(w)} ${esc(t.weather.conditions[w.condition])} · ${esc(t.weather.wind)} ${w.windSpeed} km/h\n` +
          `<span class="dim">${esc(t.weather.source)}</span>`,
      );
    },
    sudo: () => out(`<span class="err">${esc(t.sudo)}</span>`),
  };

  const history: string[] = [];
  let hIdx = 0;

  function run(raw: string) {
    const c = raw.trim();
    out(prompt(esc(c)));
    if (!c) return;
    history.push(c);
    hIdx = history.length;
    const [name, arg] = c.toLowerCase().split(/\s+/);

    if (name === 'wetter' || name === 'weather') return void eggs[t.weather.cmd]();
    if (name === 'help' || name === 'hilfe' || name === '?') return out(helpText(t.commands));
    if (name === 'clear') {
      gen++;
      output!.innerHTML = '';
      return;
    }
    if (name === 'lang' || name === 'sprache') {
      if (arg === t.otherLang) window.location.href = t.otherPath;
      else out('<span class="dim">lang de | lang en</span>');
      return;
    }
    const egg = eggs[`${name} ${arg}`] ?? eggs[name];
    if (egg) return void egg();

    const id = ALIASES[name];
    if (id) {
      out(`<span class="dim">→ ${esc(t.jumped)} „${esc(t.nav[id])}“</span>`);
      jump(id);
      return;
    }
    out(`<span class="err">${esc(t.notFound)} ${esc(name)}</span>  <span class="dim">→ ${esc(t.tryHelp)} <span class="acc">help</span></span>`);
  }

  const completions = ['help', 'clear', ...t.commands.map((c) => c.cmd)];
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const v = input.value;
      input.value = '';
      run(v);
    } else if (e.key === 'ArrowUp') {
      if (hIdx > 0) input.value = history[--hIdx];
      e.preventDefault();
    } else if (e.key === 'ArrowDown') {
      hIdx = Math.min(history.length, hIdx + 1);
      input.value = history[hIdx] ?? '';
      e.preventDefault();
    } else if (e.key === 'Tab' && input.value) {
      const m = [...new Set(completions)].filter((w) => w.startsWith(input.value.toLowerCase()));
      if (m.length) {
        e.preventDefault();
        if (m.length === 1) input.value = m[0];
        else out(`<span class="dim">${m.map(esc).join('  ')}</span>`);
      }
    }
  });

  // Aktiven Navigationspunkt beim Scrollen markieren
  const navLinks = document.querySelectorAll<HTMLAnchorElement>('nav a[data-id]');
  const io = new IntersectionObserver(
    (entries) => {
      for (const en of entries) {
        if (en.isIntersecting) navLinks.forEach((a) => a.classList.toggle('active', a.dataset.id === en.target.id));
      }
    },
    { rootMargin: '-30% 0px -60% 0px' },
  );
  document.querySelectorAll('.term section').forEach((s) => io.observe(s));
}
