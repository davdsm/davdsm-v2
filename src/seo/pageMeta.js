import { PROJECTS } from '../data/projects'

const SITE = 'https://davdsm.pt'
const DEFAULT_OG = `${SITE}/og-image.jpg`

const BASE = {
  siteName: 'DAVDSM',
  locale: 'en_GB',
  localeAlt: 'pt_PT',
  twitterCard: 'summary_large_image',
  ogImage: DEFAULT_OG,
  ogImageAlt: 'DAVDSM studio: a studio grown, not built.',
}

const PAGES = {
  home: {
    en: {
      title: 'DAVDSM · Design & code studio, Portugal',
      description:
        'We grow digital gardens. A Portuguese studio of design and code: colour, form and craft, presented in full season.',
    },
    pt: {
      title: 'DAVDSM · Estúdio de design e código, Portugal',
      description:
        'Cultivamos jardins digitais. Um estúdio português de design e código: cor, forma e ofício, apresentados em plena estação.',
    },
    path: '/',
  },
  studio: {
    en: {
      title: 'Studio · DAVDSM',
      description:
        'A studio grown, not built. The DAVDSM story in seasons, since 2019, from Portugal.',
    },
    pt: {
      title: 'Estúdio · DAVDSM',
      description:
        'Um estúdio que cresce, não se constrói. A história da DAVDSM em estações, desde 2019, em Portugal.',
    },
    path: '/studio',
  },
  work: {
    en: {
      title: 'Work · DAVDSM',
      description:
        'Selected work grown season by season: websites, identities and digital products from DAVDSM.',
    },
    pt: {
      title: 'Portfolio · DAVDSM',
      description:
        'Portfolio cultivado estação após estação: websites, identidades e produtos digitais da DAVDSM.',
    },
    path: '/work',
  },
  solutions: {
    en: {
      title: 'Solutions · Studio by DAVDSM',
      description:
        'Studio is a DAVDSM platform for dance studios, pilates spaces and gyms: messages, invoices and owner-to-student communication.',
    },
    pt: {
      title: 'Soluções · Studio by DAVDSM',
      description:
        'O Studio é uma plataforma DAVDSM para estúdios de dança, pilates e ginásios: mensagens, faturas e comunicação entre dono e alunos.',
    },
    path: '/solutions',
  },
  terms: {
    en: {
      title: 'Terms & Conditions · DAVDSM',
      description: 'Terms and conditions for using davdsm.pt.',
    },
    pt: {
      title: 'Termos e Condições · DAVDSM',
      description: 'Termos e condições de utilização de davdsm.pt.',
    },
    path: '/terms',
  },
  privacy: {
    en: {
      title: 'Privacy Policy · DAVDSM',
      description: 'How DAVDSM processes personal data on davdsm.pt (GDPR).',
    },
    pt: {
      title: 'Política de Privacidade · DAVDSM',
      description: 'Como a DAVDSM trata dados pessoais em davdsm.pt (RGPD).',
    },
    path: '/privacy',
  },
}

function projectMeta(slug, lang) {
  const project = PROJECTS[slug]
  if (!project) {
    return {
      title: lang === 'pt' ? 'Projeto · DAVDSM' : 'Project · DAVDSM',
      description:
        lang === 'pt'
          ? 'Case study do portefólio DAVDSM.'
          : 'Case study from the DAVDSM portfolio.',
      path: `/work/${slug || ''}`,
      image: DEFAULT_OG,
    }
  }

  // Titles/descriptions are mirrored lightly; full copy lives in translations.
  const names = {
    forezguima: 'Forezguima',
    frebrico: 'Frebrico',
    phfConcept: 'PHF Concept',
    amPrestige: 'AM Prestige',
    agraWines: 'AgraWines',
    tramaArquitetos: 'Trama Arquitetos',
    imperoVictoria: 'Impero Victoria',
    singula: 'Singula',
  }
  const blurbs = {
    en: {
      forezguima: 'Precision cutting tools catalogue: UX, frontend and motion for FOREZIENNE’s national representative in Portugal.',
      frebrico: 'Catalogue e-commerce for nets, wire and fencing — live pricing, search and one-page checkout, by DAVDSM.',
      phfConcept: 'Industrial ventilation website and multilingual backoffice by DAVDSM.',
      amPrestige: 'Classic car collection identity, website and CMS by DAVDSM.',
      agraWines: 'Organic-wine e-commerce experience designed and coded by DAVDSM.',
      tramaArquitetos: 'Film-first architecture portfolio, bilingual PT/EN, by DAVDSM.',
      imperoVictoria: 'Fashion-assets showroom for Portuguese mills, by DAVDSM.',
      singula: 'Brand and product site for a metal-furniture atelier, by DAVDSM.',
    },
    pt: {
      forezguima: 'Catálogo de ferramentas de corte de precisão: UX, frontend e motion para o representante nacional da FOREZIENNE em Portugal.',
      frebrico: 'E-commerce de catálogo para redes, arames e vedações — preços ao vivo, pesquisa e checkout numa página, pela DAVDSM.',
      phfConcept: 'Website de ventilação industrial e backoffice multilingue pela DAVDSM.',
      amPrestige: 'Identidade, website e CMS para uma coleção de clássicos, pela DAVDSM.',
      agraWines: 'Experiência de e-commerce de vinhos biológicos, design e código pela DAVDSM.',
      tramaArquitetos: 'Portefólio de arquitetura film-first, bilingue PT/EN, pela DAVDSM.',
      imperoVictoria: 'Showroom de assets de moda para fábricas portuguesas, pela DAVDSM.',
      singula: 'Marca e site de produto para um atelier de mobiliário metálico, pela DAVDSM.',
    },
  }

  const name = names[slug] || slug
  return {
    title: `${name} · DAVDSM`,
    description: (blurbs[lang] && blurbs[lang][slug]) || blurbs.en[slug] || BASE.ogImageAlt,
    path: `/work/${slug}`,
    image: project.cover ? `${SITE}${project.cover}` : DEFAULT_OG,
  }
}

export function resolvePageMeta({ route, slug, lang = 'en' }) {
  const language = lang === 'pt' ? 'pt' : 'en'
  if (route === 'project') {
    const meta = projectMeta(slug, language)
    return {
      ...BASE,
      ...meta,
      canonical: `${SITE}${meta.path}`,
      url: `${SITE}${meta.path}`,
      ogImage: meta.image || DEFAULT_OG,
      lang: language,
    }
  }

  const page = PAGES[route] || PAGES.home
  const copy = page[language] || page.en
  return {
    ...BASE,
    title: copy.title,
    description: copy.description,
    path: page.path,
    canonical: `${SITE}${page.path}`,
    url: `${SITE}${page.path}`,
    ogImage: DEFAULT_OG,
    lang: language,
  }
}

export { SITE, DEFAULT_OG }
