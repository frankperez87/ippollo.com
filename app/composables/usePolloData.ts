// Static content tables for IP Pollo — ported verbatim from the Claude Design prototype.
// Two locales throughout: 'en' and 'es'.

export type Lang = 'en' | 'es'

export interface Strings {
  tagline: string
  yourIp: string
  clucking: string
  copy: string
  copied: string
  demoNote: string
  location: string
  isp: string
  device: string
  rating: string
  freeRange: string
  factTitle: string
  cluckAgain: string
  brag: string
  copyBrag: string
  bragged: string
  footer1: string
  footer2: string
  speedTitle: string
  speedHint: string
  speedBtn: string
  speedAgain: string
  dl: string
  ul: string
  pingL: string
  loadedL: string
  jitterL: string
  speedMsgs: string[]
  consentText: string
  consentLearn: string
  consentYes: string
  consentNo: string
  privLink: string
  cookieLink: string
  privTitle: string
  privUpdated: string
  privClose: string
  toNextEgg: string
  maxPollo: string
  levelUp: string
  saveCard: string
  cluckHint: string
  speedWait: string
  cliTitle: string
  cliHint: string
  ipv6Label: string
  region: string
  coords: string
  timezone: string
  dossierTitle: string
}

export interface CliCmd {
  host?: string // overrides the base host (e.g. force a family)
  path: string
  en: string
  es: string
}

// Documented CLI endpoints, rendered as copyable `curl` examples.
export const CLI: CliCmd[] = [
  { path: '', en: 'Your IP address', es: 'Tu dirección IP' },
  { path: '/json', en: 'Everything, as JSON', es: 'Todo, en JSON' },
  { path: '/ip', en: 'IP only', es: 'Solo la IP' },
  { path: '/country', en: 'Country', es: 'País' },
  { path: '/country-iso', en: 'Country code', es: 'Código de país' },
  { path: '/city', en: 'City', es: 'Ciudad' },
  { path: '/region', en: 'Region', es: 'Región' },
  { path: '/timezone', en: 'Time zone', es: 'Zona horaria' },
  { path: '/coords', en: 'Latitude, longitude', es: 'Latitud, longitud' },
  { path: '/asn', en: 'Network (ASN)', es: 'Red (ASN)' },
  { path: '/asn-org', en: 'Network operator', es: 'Operador de red' },
  { path: '/isp', en: 'ISP', es: 'ISP' },
  { path: '/ua', en: 'Your user agent', es: 'Tu user agent' },
  { host: 'v4.ippollo.com', path: '', en: 'Force IPv4', es: 'Forzar IPv4' },
]

export const STR: Record<Lang, Strings> = {
  en: {
    tagline: "What's your IP, pollo? 🐔",
    yourIp: 'Your IP, pollo',
    clucking: 'clucking…',
    copy: '📋 COPY IP',
    copied: 'COPIED! 🎉',
    demoNote: '// demo IP — deploy ippollo.com to reveal the real bird',
    location: 'Roost Location',
    isp: 'Your Coop (ISP)',
    device: 'Pecking Device',
    rating: 'Chicken Rating',
    freeRange: '✓ Free Range',
    factTitle: 'Pollo Fortune',
    cluckAgain: '🔄 Cluck again',
    brag: 'Flex your bird',
    copyBrag: '📋 Copy brag text',
    bragged: 'COPIED! 🐔',
    footer1:
      'ippollo.com is a parody. Not affiliated with any chicken, rooster, or poultry-adjacent website. No pollos were fried in the making of this site.',
    footer2:
      "Your IP is fetched live and never stored — we forget it faster than a chicken forgets… okay chickens have great memories. We still don't store it. Made with 🐔 & questionable judgment.",
    speedTitle: 'Pollo Speed Test',
    speedHint: 'How fast does your pollo run? One tap — real download & upload speeds.',
    speedBtn: '🏁 RUN, POLLO!',
    speedAgain: '🔄 Race again',
    dl: 'Mbps down',
    ul: 'Mbps up',
    pingL: 'ms ping',
    loadedL: 'ms loaded',
    jitterL: 'ms jitter',
    speedMsgs: [
      'Warming up the coop…',
      'Flapping at full speed…',
      'Counting the eggs…',
      'Chasing the packets…',
      'Almost there, keep clucking…',
    ],
    consentText:
      'We use cookies for Google Analytics (just counting visits) — only if you say yes.',
    consentLearn: 'Details',
    consentYes: '🍪 Accept',
    consentNo: 'Decline',
    privLink: 'Privacy & the Pollo',
    cookieLink: 'Cookie settings',
    privTitle: 'Privacy & the Pollo',
    privUpdated: '// the honest version, no lawyer-speak',
    privClose: 'Got it, cluck cluck',
    toNextEgg: 'clucks to next 🥚',
    maxPollo: '🏆 MAX POLLO!',
    levelUp: 'LEVEL UP! 🥚',
    saveCard: '📸 Save card',
    cluckHint: '👆 Cluck the chicken to level up your eggs',
    speedWait: '⏳ Race again in',
    cliTitle: 'Pollo from the terminal',
    cliHint: 'Prefer the command line? curl any of these. Tap to copy.',
    ipv6Label: 'IPv6',
    region: 'Pollo Province',
    coords: 'Coop Coordinates',
    timezone: 'Pollo Time Zone',
    dossierTitle: 'Your Pollo Dossier',
  },
  es: {
    tagline: '¿Cuál es tu IP, pollo? 🐔',
    yourIp: 'Tu IP, pollo',
    clucking: 'cacareando…',
    copy: '📋 COPIAR IP',
    copied: '¡COPIADA! 🎉',
    demoNote: '// IP de demo — publica ippollo.com para ver el pollo real',
    location: 'Ubicación del Gallinero',
    isp: 'Tu Corral (ISP)',
    device: 'Dispositivo Picoteador',
    rating: 'Calificación Pollo',
    freeRange: '✓ De Corral',
    factTitle: 'Fortuna Pollo',
    cluckAgain: '🔄 Cacarear otra vez',
    brag: 'Presume tu ave',
    copyBrag: '📋 Copiar presumido',
    bragged: '¡COPIADO! 🐔',
    footer1:
      'ippollo.com es una parodia. Sin afiliación con ningún pollo, gallo o sitio web avícola. Ningún pollo fue frito en la creación de este sitio.',
    footer2:
      'Tu IP se consulta en vivo y nunca se guarda — la olvidamos más rápido que un pollo… bueno, los pollos tienen buena memoria. Igual no la guardamos. Hecho con 🐔 y dudoso criterio.',
    speedTitle: 'Prueba de Velocidad Pollo',
    speedHint:
      '¿Qué tan rápido corre tu pollo? Un toque — velocidad real de bajada y subida.',
    speedBtn: '🏁 ¡CORRE, POLLO!',
    speedAgain: '🔄 Correr otra vez',
    dl: 'Mbps bajada',
    ul: 'Mbps subida',
    pingL: 'ms ping',
    loadedL: 'ms con carga',
    jitterL: 'ms jitter',
    speedMsgs: [
      'Calentando el gallinero…',
      'Aleteando a toda velocidad…',
      'Contando los huevos…',
      'Persiguiendo los paquetes…',
      'Ya casi, sigue cacareando…',
    ],
    consentText:
      'Usamos cookies para Google Analytics (solo contar visitas) — solo si aceptas.',
    consentLearn: 'Detalles',
    consentYes: '🍪 Aceptar',
    consentNo: 'Rechazar',
    privLink: 'Privacidad y el Pollo',
    cookieLink: 'Ajustes de cookies',
    privTitle: 'Privacidad y el Pollo',
    privUpdated: '// la versión honesta, sin lenguaje de abogados',
    privClose: 'Entendido, cacareo cacareo',
    toNextEgg: 'cacareos para el siguiente 🥚',
    maxPollo: '🏆 ¡POLLO MÁXIMO!',
    levelUp: '¡SUBISTE DE NIVEL! 🥚',
    saveCard: '📸 Guardar tarjeta',
    cluckHint: '👆 Cacarea al pollo para subir tus huevos',
    speedWait: '⏳ Otra vez en',
    cliTitle: 'Pollo desde la terminal',
    cliHint: '¿Prefieres la línea de comandos? Haz curl a cualquiera. Toca para copiar.',
    ipv6Label: 'IPv6',
    region: 'Provincia Pollo',
    coords: 'Coordenadas del Corral',
    timezone: 'Zona Horaria Pollo',
    dossierTitle: 'Tu Expediente Pollo',
  },
}

export const SOUNDS = [
  'BOK!',
  'CLUCK!',
  'BAWK!',
  '¡PADAK!',
  '¡POLLO!',
  'BGAWK!',
  'COCK-A-DOODLE-IP!',
  '🥚',
  '¡COCOROCÓ!',
]

export const BREEDS: Record<Lang, string[]> = {
  en: [
    'Free-Range Rhode Island Red',
    'Bantam Bandwidth Hen',
    'Silkie of the Subnet',
    'Leghorn Localhost',
    'Cluckmore Premium',
    'Orpington Open-Port',
    'Wyandotte Wi-Fi',
    'Australorp of the Aether',
    'Plymouth Rocksolid',
    'Brahma Broadband',
  ],
  es: [
    'Pollo de Corral Rojo',
    'Gallina Ancho de Banda',
    'Sedosa del Subred',
    'Leghorn Localhost',
    'Cacareño Premium',
    'Orpington Puerto-Abierto',
    'Wyandotte Wifi',
    'Australorp del Éter',
    'Plymouth Rocasólida',
    'Brahma Banda Ancha',
  ],
}

export const TITLES: Record<Lang, string[]> = {
  en: [
    'Certified Cluck',
    'Egg-cellent Specimen',
    'Suspiciously Crispy',
    'Grade A Pollo',
    'Extra Spicy Wings',
    'Mild but Mighty',
    'Probably a Rooster',
    'Definitely Fried',
    'Organic & Confused',
    'Galaxy-Brained Bird',
  ],
  es: [
    'Cacareo Certificado',
    'Espécimen Huevísimo',
    'Sospechosamente Crujiente',
    'Pollo Grado A',
    'Alitas Extra Picantes',
    'Suave pero Poderoso',
    'Probablemente un Gallo',
    'Definitivamente Frito',
    'Orgánico y Confundido',
    'Ave Cerebro-Galáctico',
  ],
}

export const FACTS: Record<Lang, string[]> = {
  en: [
    'Chickens can remember over 100 different faces. Your IP remembers all of them too. 👁️',
    "A chicken's heart beats up to 400 times a minute — about how fast yours went when you saw your IP exposed.",
    'There are more chickens on Earth than any other bird. There are even more IP addresses. Coincidence? Yes.',
    'Fortune: a great download speed approaches. Do not trust the upload.',
    'The longest a chicken has ever flown is 13 seconds. Your packets are faster. Marginally.',
    'Fortune: someone is connected to your Wi-Fi. It is probably the chicken.',
    'Chickens dream. Tonight, they will dream of your subnet mask.',
    "A rooster's crow hits 130 decibels. Your router blinks silently, but it is judging you.",
    'Fortune: today you will refresh this page for no reason. You already did.',
    'Roosters tilt their heads to see clouds. Your IP can see your approximate city. We’re even.',
    'Fortune: your true IP was inside you all along. Also it’s right up there. ☝️',
    'Chickens have full-color vision. So does the ad network that just got your IP.',
  ],
  es: [
    'Los pollos recuerdan más de 100 caras distintas. Tu IP también las recuerda todas. 👁️',
    'El corazón de un pollo late hasta 400 veces por minuto — más o menos como el tuyo al ver tu IP expuesta.',
    'Hay más pollos en la Tierra que cualquier otra ave. Hay aún más direcciones IP. ¿Coincidencia? Sí.',
    'Fortuna: se acerca una gran velocidad de descarga. No confíes en la subida.',
    'Lo máximo que ha volado un pollo son 13 segundos. Tus paquetes son más rápidos. Apenas.',
    'Fortuna: alguien está conectado a tu Wi-Fi. Probablemente sea el pollo.',
    'Los pollos sueñan. Esta noche soñarán con tu máscara de subred.',
    'El canto de un gallo llega a 130 decibelios. Tu router parpadea en silencio, pero te juzga.',
    'Fortuna: hoy recargarás esta página sin motivo. Ya lo hiciste.',
    'Los gallos inclinan la cabeza para ver las nubes. Tu IP ve tu ciudad aproximada. Estamos a mano.',
    'Fortuna: tu verdadera IP estuvo dentro de ti todo el tiempo. También está ahí arriba. ☝️',
    'Los pollos ven a todo color. La red de anuncios que acaba de recibir tu IP también.',
  ],
}

export interface SpeedTier {
  emoji: string
  en: string
  es: string
  sub_en: string
  sub_es: string
}

export const SPEED_TIERS: SpeedTier[] = [
  {
    emoji: '🐔',
    en: 'No signal, pollo',
    es: 'Sin señal, pollo',
    sub_en: "Couldn't reach the test. Check your connection and try again.",
    sub_es: 'No se pudo hacer la prueba. Revisa tu conexión e intenta otra vez.',
  },
  {
    emoji: '🐌',
    en: 'Dial-up Dodo',
    es: 'Dodo de Marcación',
    sub_en: 'This pollo walks. Buffering is a lifestyle.',
    sub_es: 'Este pollo camina. El buffering es un estilo de vida.',
  },
  {
    emoji: '🚶',
    en: 'Sunday Stroll Hen',
    es: 'Gallina Dominguera',
    sub_en: 'Gets there eventually. Bring snacks.',
    sub_es: 'Llega… eventualmente. Trae botana.',
  },
  {
    emoji: '🏃',
    en: 'Sprinting Spring Chicken',
    es: 'Pollito Veloz',
    sub_en: 'Respectable cluck. Streams without drama.',
    sub_es: 'Cacareo respetable. Transmite sin dramas.',
  },
  {
    emoji: '🚀',
    en: 'Turbo Rooster',
    es: 'Gallo Turbo',
    sub_en: "Now we're flying. Downloads fear you.",
    sub_es: 'Ahora sí volamos. Las descargas te temen.',
  },
  {
    emoji: '⚡',
    en: 'Galaxy-Brained Fiber Phoenix',
    es: 'Fénix de Fibra Galáctico',
    sub_en: 'Ludicrous speed. Are you a data center?',
    sub_es: 'Velocidad absurda. ¿Eres un centro de datos?',
  },
]

export interface PrivacySection {
  h: string
  b: string
}

export const PRIV: Record<Lang, PrivacySection[]> = {
  en: [
    {
      h: 'The short version',
      b: "ippollo.com shows you your own IP address, approximate location (city, region, postal area and rough coordinates), network/ISP and a silly chicken rating. It runs on a small edge endpoint that reads your IP on the fly to answer your request — and stores none of it.",
    },
    {
      h: 'What leaves your browser',
      b: "Your browser asks ippollo.com's own endpoint for your IP and approximate location; Netlify's edge sees your IP to answer the request (that's just how the web works) and we don't keep it. The location (city/region/coordinates) is estimated from your IP by Netlify and is approximate, not GPS. To name your network (ASN/ISP) we look it up server-side via ipwho.is, and the speed test transfers test data with Cloudflare (speed.cloudflare.com). Those providers receive your IP to do their job — see their own privacy policies.",
    },
    {
      h: 'The terminal / API',
      b: "The same details are available as a small public API for command-line fans (e.g. curl https://ippollo.com/json). It only ever returns information about your own connection — there's no database to query, no logins, and no way to look up anyone else. It's free and best-effort: please don't hammer it, and it's provided as-is with no uptime promise.",
    },
    {
      h: 'Cookies & Google Analytics',
      b: 'If you tap Accept, we load Google Analytics to count visits and basic usage. It uses cookies and your IP is anonymized. Until you accept, analytics stays off (Google Consent Mode). Tap Decline and nothing analytics-related loads. Change your mind anytime via “Cookie settings” in the footer.',
    },
    {
      h: 'What we store',
      b: "On our side: nothing. In your browser only: your language, light/dark choice, cluck count and your cookie choice (localStorage). Clear your browser data and it's gone.",
    },
    {
      h: 'Your choices',
      b: 'Because an IP address can be personal data (GDPR / UK GDPR / CCPA), you can decline analytics at any time, and you can contact the third-party services above about data they process. There is no account and no database on our end to delete.',
    },
    {
      h: 'This is a parody',
      b: 'ippollo.com is an independent, for-fun project and is not affiliated with any other website. Provided as-is, for entertainment. Questions? Contact the owner of ippollo.com.',
    },
  ],
  es: [
    {
      h: 'La versión corta',
      b: 'ippollo.com te muestra tu propia dirección IP, ubicación aproximada (ciudad, región, zona postal y coordenadas aproximadas), red/ISP y una calificación pollo absurda. Funciona con un pequeño endpoint en el edge que lee tu IP al momento para responder tu solicitud — y no guarda nada de eso.',
    },
    {
      h: 'Qué sale de tu navegador',
      b: 'Tu navegador le pide a un endpoint propio de ippollo.com tu IP y ubicación aproximada; el edge de Netlify ve tu IP para responder (así funciona la web) y no la guardamos. La ubicación (ciudad/región/coordenadas) la estima Netlify a partir de tu IP y es aproximada, no GPS. Para identificar tu red (ASN/ISP) la consultamos del lado del servidor vía ipwho.is, y la prueba de velocidad transfiere datos de prueba con Cloudflare (speed.cloudflare.com). Esos proveedores reciben tu IP para funcionar — consulta sus propias políticas de privacidad.',
    },
    {
      h: 'La terminal / API',
      b: 'Los mismos datos están disponibles como una pequeña API pública para fans de la línea de comandos (p. ej. curl https://ippollo.com/json). Solo devuelve información de tu propia conexión — no hay base de datos que consultar, ni inicios de sesión, ni forma de buscar a nadie más. Es gratis y de mejor esfuerzo: por favor no la satures, y se ofrece tal cual, sin garantía de disponibilidad.',
    },
    {
      h: 'Cookies y Google Analytics',
      b: 'Si tocas Aceptar, cargamos Google Analytics para contar visitas y uso básico. Usa cookies y tu IP se anonimiza. Hasta que aceptes, la analítica está apagada (Modo de Consentimiento de Google). Si tocas Rechazar, no se carga nada de analítica. Cambia de opinión cuando quieras desde “Ajustes de cookies” en el pie.',
    },
    {
      h: 'Qué guardamos',
      b: 'De nuestro lado: nada. En tu navegador solo: tu idioma, modo claro/oscuro, número de cacareos y tu elección de cookies (localStorage). Borra los datos de tu navegador y desaparece.',
    },
    {
      h: 'Tus opciones',
      b: 'Como una IP puede ser dato personal (GDPR / RGPD del Reino Unido / CCPA), puedes rechazar la analítica cuando quieras y contactar a los servicios de terceros sobre los datos que procesan. No hay cuenta ni base de datos de nuestro lado que borrar.',
    },
    {
      h: 'Esto es una parodia',
      b: 'ippollo.com es un proyecto independiente y por diversión, sin afiliación con ningún otro sitio web. Se ofrece tal cual, con fines de entretenimiento. ¿Dudas? Contacta al dueño de ippollo.com.',
    },
  ],
}
