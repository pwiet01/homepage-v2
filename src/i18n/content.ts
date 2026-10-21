export { ageOn } from '../lib/age';

export type Lang = 'de' | 'en';
export type SectionId = 'about' | 'experience' | 'education' | 'skills' | 'links';

export interface Station {
  role: string;
  org: string;
  href: string;
  when: string;
  where: string;
  current?: boolean;
  items: string[];
}

export interface SkillGroup {
  key: string;
  desc: string;
  tags: string[];
}

export interface Command {
  cmd: string;
  desc: string;
}

/** Texte, die das Terminal-Script im Browser braucht. */
export interface TerminalStrings {
  help: string;
  commands: Command[];
  notFound: string;
  tryHelp: string;
  jumped: string;
  sudo: string;
  cargoHint: string;
  kafkaMsg: string;
  kafkaDone: string;
  lambdaBody: string;
  lambdaCold: string;
  moin: string;
}

export interface Content {
  lang: Lang;
  locale: string;
  path: string;
  meta: { title: string; description: string };
  nav: Record<SectionId, string>;
  greeting: (age: number) => string;
  current: string;
  experience: Station[];
  education: Station[];
  skills: SkillGroup[];
  hint: string;
  inputLabel: string;
  langLabel: string;
  terminal: TerminalStrings;
}

export const LINKS = {
  github: 'https://github.com/pwiet01',
  linkedin: 'https://www.linkedin.com/in/patrice-wietmaier',
};

export const SECTIONS: { id: SectionId; cmd: string }[] = [
  { id: 'about', cmd: 'whoami' },
  { id: 'experience', cmd: 'experience' },
  { id: 'education', cmd: 'education' },
  { id: 'skills', cmd: 'skills' },
  { id: 'links', cmd: 'links' },
];

const de: Content = {
  lang: 'de',
  locale: 'de_DE',
  path: '/',
  meta: {
    title: 'Patrice Wietmaier – Softwareentwickler aus Hamburg',
    description:
      'Patrice Wietmaier, Softwareentwickler aus Hamburg. Backend-Services, Serverless und AWS bei OTTO, M.Sc. Informatik an der HAW Hamburg.',
  },
  nav: { about: 'Über mich', experience: 'Berufserfahrung', education: 'Ausbildung', skills: 'Kenntnisse', links: 'Links' },
  greeting: (age) => `Hey! Ich bin Patrice (${age}), Softwareentwickler aus Hamburg.`,
  current: 'aktuell',
  experience: [
    {
      current: true,
      role: 'Softwareentwickler (Werkstudent)',
      org: 'OTTO',
      href: 'https://www.otto.de/',
      when: '04/2025 – heute',
      where: 'Hamburg',
      items: [
        'Entwicklung von Backend-Services mit Rust und Spring Boot',
        'Serverless-Architekturen auf AWS mit Lambda und SQS',
        'DevOps und Infrastructure as Code mit Terraform',
      ],
    },
    {
      role: 'Softwareentwickler',
      org: 'basecom',
      href: 'https://www.basecom.de/',
      when: '01/2023 – 03/2025',
      where: 'Osnabrück',
      items: [
        'Entwicklung von Softwareprojekten im Bereich E-Commerce',
        'Schwerpunkt: Symfony, Spryker, Shopify',
        'Arbeit in agilen Scrum-Projekten',
      ],
    },
  ],
  education: [
    {
      current: true,
      role: 'M.Sc. Informatik',
      org: 'HAW Hamburg',
      href: 'https://www.haw-hamburg.de/',
      when: 'seit 04/2025',
      where: 'Hamburg',
      items: ['Schwerpunkt: Künstliche Intelligenz und Agent-Based Modeling'],
    },
    {
      role: 'B.Sc. Informatik',
      org: 'Universität Osnabrück',
      href: 'https://www.uni-osnabrueck.de/',
      when: '2019 – 2022',
      where: 'Osnabrück',
      items: [
        'Praktische Abschlussarbeit in der AG Software Engineering: Entwicklung eines Prüfungskalenders auf Basis von React und Node.js',
        'Studentische Hilfskraft in den Veranstaltungen Software-Entwicklung und Technische Informatik',
      ],
    },
    {
      role: 'Abitur',
      org: 'Gymnasium Antonianum Vechta',
      href: 'https://antonianum-vechta.de/',
      when: '2011 – 2019',
      where: 'Vechta',
      items: [],
    },
  ],
  skills: [
    { key: 'backend', desc: 'Server-Anwendungen und Schnittstellen', tags: ['Rust', 'Java', 'Spring Boot', 'PHP', 'Symfony', 'Node.js'] },
    { key: 'cloud', desc: 'Cloud-Infrastruktur und Betrieb', tags: ['AWS', 'Lambda', 'SQS', 'Kafka', 'Terraform', 'Docker', 'Git'] },
    { key: 'ai-agents', desc: 'Softwareentwicklung mit KI-Agenten', tags: ['Claude Code', 'Coding Agents', 'Agentic Workflows'] },
    { key: 'e-commerce', desc: 'Onlineshops und Handelsplattformen', tags: ['Spryker', 'Shopify', 'B2B / B2C'] },
    { key: 'frontend', desc: 'Weboberflächen', tags: ['TypeScript', 'Svelte', 'Vue.js', 'React'] },
    { key: 'methoden', desc: 'Zusammenarbeit im Team', tags: ['Scrum', 'DevOps'] },
  ],
  hint: 'Tippe <span class="acc">help</span> für alle Befehle oder nutze die Navigation oben.',
  inputLabel: 'Befehl eingeben',
  langLabel: 'Sprache',
  terminal: {
    help: 'Befehle:',
    commands: [
      { cmd: 'whoami', desc: 'Über mich' },
      { cmd: 'experience', desc: 'Berufserfahrung' },
      { cmd: 'education', desc: 'Ausbildung' },
      { cmd: 'skills', desc: 'Kenntnisse' },
      { cmd: 'links', desc: 'GitHub & LinkedIn' },
      { cmd: 'lang en', desc: 'Switch to English' },
      { cmd: 'kafka', desc: 'Ein Topic lesen' },
      { cmd: 'cargo run', desc: 'Rust kompilieren' },
      { cmd: 'lambda', desc: 'Cloud-Funktion aufrufen' },
      { cmd: 'moin', desc: 'Moin!' },
      { cmd: 'clear', desc: 'Ausgabe leeren' },
    ],
    notFound: 'zsh: Befehl nicht gefunden:',
    tryHelp: 'probier',
    jumped: 'springe zu',
    sudo: 'patrice ist nicht in der sudoers-Datei. Dieser Vorfall wird gemeldet.',
    cargoHint: 'Meintest du',
    kafkaMsg:
      '„Als Gregor Samsa eines Morgens aus unruhigen Träumen erwachte, fand er sich in seinem Bett zu einem ungeheueren Ungeziefer verwandelt.“',
    kafkaDone: 'Insgesamt 1 Nachricht verarbeitet · consumer lag: 0',
    lambdaBody: 'Moin!',
    lambdaCold: 'Kaltstart … Container wird hochgefahren',
    moin: 'Moin!',
  },
};

const en: Content = {
  lang: 'en',
  locale: 'en_US',
  path: '/en/',
  meta: {
    title: 'Patrice Wietmaier – Software Developer in Hamburg',
    description:
      'Patrice Wietmaier, software developer in Hamburg. Backend services, serverless and AWS at OTTO, M.Sc. Computer Science at HAW Hamburg.',
  },
  nav: { about: 'About', experience: 'Experience', education: 'Education', skills: 'Skills', links: 'Links' },
  greeting: (age) => `Hey! I'm Patrice (${age}), a software developer based in Hamburg.`,
  current: 'current',
  experience: [
    {
      current: true,
      role: 'Software Developer (Working Student)',
      org: 'OTTO',
      href: 'https://www.otto.de/',
      when: '04/2025 – present',
      where: 'Hamburg',
      items: [
        'Building backend services with Rust and Spring Boot',
        'Serverless architectures on AWS with Lambda and SQS',
        'DevOps and infrastructure as code with Terraform',
      ],
    },
    {
      role: 'Software Developer',
      org: 'basecom',
      href: 'https://www.basecom.de/',
      when: '01/2023 – 03/2025',
      where: 'Osnabrück',
      items: ['Developing software projects in e-commerce', 'Focus: Symfony, Spryker, Shopify', 'Working in agile Scrum teams'],
    },
  ],
  education: [
    {
      current: true,
      role: 'M.Sc. Computer Science',
      org: 'HAW Hamburg',
      href: 'https://www.haw-hamburg.de/',
      when: 'since 04/2025',
      where: 'Hamburg',
      items: ['Focus: artificial intelligence and agent-based modeling'],
    },
    {
      role: 'B.Sc. Computer Science',
      org: 'Osnabrück University',
      href: 'https://www.uni-osnabrueck.de/',
      when: '2019 – 2022',
      where: 'Osnabrück',
      items: [
        'Thesis project in the Software Engineering group: an exam scheduling calendar built with React and Node.js',
        'Student assistant for the courses Software Development and Computer Engineering',
      ],
    },
    {
      role: 'Abitur (German university entrance qualification)',
      org: 'Gymnasium Antonianum Vechta',
      href: 'https://antonianum-vechta.de/',
      when: '2011 – 2019',
      where: 'Vechta',
      items: [],
    },
  ],
  skills: [
    { key: 'backend', desc: 'Server applications and APIs', tags: ['Rust', 'Java', 'Spring Boot', 'PHP', 'Symfony', 'Node.js'] },
    { key: 'cloud', desc: 'Cloud infrastructure and operations', tags: ['AWS', 'Lambda', 'SQS', 'Kafka', 'Terraform', 'Docker', 'Git'] },
    { key: 'ai-agents', desc: 'Software development with AI agents', tags: ['Claude Code', 'Coding Agents', 'Agentic Workflows'] },
    { key: 'e-commerce', desc: 'Online shops and commerce platforms', tags: ['Spryker', 'Shopify', 'B2B / B2C'] },
    { key: 'frontend', desc: 'Web interfaces', tags: ['TypeScript', 'Svelte', 'Vue.js', 'React'] },
    { key: 'ways-of-working', desc: 'How I work in teams', tags: ['Scrum', 'DevOps'] },
  ],
  hint: 'Type <span class="acc">help</span> for all commands, or use the navigation above.',
  inputLabel: 'Enter a command',
  langLabel: 'Language',
  terminal: {
    help: 'Commands:',
    commands: [
      { cmd: 'whoami', desc: 'About me' },
      { cmd: 'experience', desc: 'Work experience' },
      { cmd: 'education', desc: 'Education' },
      { cmd: 'skills', desc: 'Skills' },
      { cmd: 'links', desc: 'GitHub & LinkedIn' },
      { cmd: 'lang de', desc: 'Auf Deutsch wechseln' },
      { cmd: 'kafka', desc: 'Read a topic' },
      { cmd: 'cargo run', desc: 'Compile some Rust' },
      { cmd: 'lambda', desc: 'Invoke a cloud function' },
      { cmd: 'moin', desc: 'Moin!' },
      { cmd: 'clear', desc: 'Clear output' },
    ],
    notFound: 'zsh: command not found:',
    tryHelp: 'try',
    jumped: 'jumping to',
    sudo: 'patrice is not in the sudoers file. This incident will be reported.',
    cargoHint: 'Did you mean',
    kafkaMsg:
      '“As Gregor Samsa awoke one morning from uneasy dreams he found himself transformed in his bed into a gigantic insect.”',
    kafkaDone: 'Processed a total of 1 message · consumer lag: 0',
    lambdaBody: 'Moin!',
    lambdaCold: 'Cold start … spinning up a container',
    moin: 'Moin!',
  },
};

export const CONTENT: Record<Lang, Content> = { de, en };
