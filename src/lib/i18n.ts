import { getCollection, type CollectionEntry, type CollectionKey } from 'astro:content';

export const locales = ['en', 'it'] as const;
export type Lang = (typeof locales)[number];
export const defaultLocale: Lang = 'en';

// Content entries live at `<collection>/<locale>/<file>`, so the locale is
// always the first segment of the loader-generated id.
export async function getLocalizedCollection<C extends CollectionKey>(
  collection: C,
  lang: Lang,
): Promise<CollectionEntry<C>[]> {
  return getCollection(collection, (entry) => entry.id.startsWith(`${lang}/`));
}

export async function getLocalizedEntry<C extends CollectionKey>(collection: C, lang: Lang) {
  const [entry] = await getLocalizedCollection(collection, lang);
  return entry;
}

export const ui = {
  en: {
    nav: { about: 'About', playing: 'Playing', scoring: 'Scoring', contact: 'Contact' },
    hero: { scroll: 'Scroll' },
    skipLink: 'Skip to content',
    sections: {
      bio: { eyebrow: '01 — About' },
      playing: {
        eyebrow: '02 — Playing',
        title: 'Playing',
        description: 'Live performances, sessions, and stage work.',
        empty: 'No videos yet — add one from the CMS panel.',
      },
      scoring: {
        eyebrow: '03 — Scoring',
        title: 'Scoring',
        description: 'Original music for film, documentary, and picture.',
        empty: 'No videos yet — add one from the CMS panel.',
      },
      contact: { eyebrow: '04 — Contact' },
    },
    marquee: ['Composition', 'Live Performance', 'Scoring', 'Arrangement', 'Production'],
    footer: (year: number) => `© ${year} — All rights reserved.`,
    videoPlayLabel: (title: string) => `Play: ${title} on YouTube`,
    langSwitchLabel: (lang: Lang) => `Switch to ${lang === 'en' ? 'English' : 'Italian'}`,
  },
  it: {
    nav: { about: 'Chi Sono', playing: 'Dal Vivo', scoring: 'Colonne Sonore', contact: 'Contatti' },
    hero: { scroll: 'Scorri' },
    skipLink: 'Vai al contenuto',
    sections: {
      bio: { eyebrow: '01 — Chi Sono' },
      playing: {
        eyebrow: '02 — Dal Vivo',
        title: 'Dal Vivo',
        description: 'Esibizioni dal vivo, session e lavoro sul palco.',
        empty: 'Ancora nessun video — aggiungine uno dal pannello CMS.',
      },
      scoring: {
        eyebrow: '03 — Colonne Sonore',
        title: 'Colonne Sonore',
        description: 'Musica originale per film, documentari e immagini.',
        empty: 'Ancora nessun video — aggiungine uno dal pannello CMS.',
      },
      contact: { eyebrow: '04 — Contatti' },
    },
    marquee: ['Composizione', 'Esibizioni dal vivo', 'Colonne Sonore', 'Arrangiamento', 'Produzione'],
    footer: (year: number) => `© ${year} — Tutti i diritti riservati.`,
    videoPlayLabel: (title: string) => `Riproduci: ${title} su YouTube`,
    langSwitchLabel: (lang: Lang) => (lang === 'en' ? 'Passa all\'italiano' : 'Passa all\'inglese'),
  },
} as const satisfies Record<Lang, unknown>;

export function useTranslations(lang: Lang) {
  return ui[lang];
}
