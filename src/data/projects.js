/**
 * Real project imagery, keyed by slug. Text (name, tag, summary, hero copy)
 * lives in translations.js under workPage.recent.projects.<slug> — this file
 * only holds the language-independent asset paths.
 */
export const PROJECTS = {
  singula: {
    slug: 'singula',
    cover: '/assets/work/singula/01-principal.jpg',
    url: 'https://singula.pt/',
    gallery: [
      '/assets/work/singula/01-principal.jpg',
      '/assets/work/singula/02-portatil.jpg',
      '/assets/work/singula/03-desktop-mobile.jpg',
      '/assets/work/singula/04-mobile-tipografia.jpg',
      '/assets/work/singula/05-componentes.jpg',
    ],
  },
  amPrestige: {
    slug: 'amPrestige',
    cover: '/assets/work/am-prestige/00-cover.png',
    hoverCover: '/assets/work/am-prestige/00-hover.png',
    url: 'https://amprestige.pt/',
    gallery: [
      '/assets/work/am-prestige/01-principal.png',
      '/assets/work/am-prestige/02-viatura.png',
      '/assets/work/am-prestige/03-galeria.png',
      '/assets/work/am-prestige/04-reserva.png',
      '/assets/work/am-prestige/05-eventos.png',
      '/assets/work/am-prestige/06-contacto.png',
      '/assets/work/am-prestige/07-mobile-home.png',
      '/assets/work/am-prestige/08-mobile-lightbox.png',
      '/assets/work/am-prestige/09-mobile-menu.png',
    ],
  },
}
