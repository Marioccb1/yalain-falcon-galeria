window.IMG = {
  // Retrato del artista (mismo retrato en varios formatos)
  artistHero:   'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=1200&q=80',
  artistWide:   'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=80',
  artistPreview:'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=1000&q=80',

  // Obras de la serie «Infinito» — imágenes abstractas de prueba
  inf01: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&q=80',
  inf03: 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=800&q=80',
  inf07: 'https://images.unsplash.com/photo-1550859492-d5da9d8e45f3?w=800&q=80',
  inf12: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=800&q=80',
  inf18: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=80',
  inf24: 'https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?w=800&q=80',
  inf31: 'https://images.unsplash.com/photo-1579965342575-16428a7c8881?w=800&q=80',
  inf40: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&q=80'
};
const IMG = window.IMG;

/* ============================================================
   DATOS DE OBRA
   ============================================================ */
window.works = [
  {
    id:'inf-01', titulo:'Infinito I', numero:'01', anio:2016,
    medidas:'100 × 80 cm', tecnica:'Óleo sobre lienzo',
    color:'#A6482A', color2:'#7C3018', fg:'#F6EFE6',
    frase:'Todo comienza en uno',
    img: IMG.inf01,
    desc:'La primera pieza de la serie. Un número que abre el relato y establece su lógica: contar para no perderse. La superficie, trabajada por capas sucesivas, deja ver el paso del tiempo sobre el color y convierte el gesto de numerar en una forma de memoria.'
  },
  {
    id:'inf-03', titulo:'Infinito III', numero:'03', anio:2017,
    medidas:'90 × 70 cm', tecnica:'Óleo sobre lienzo',
    color:'#2C3E5C', color2:'#182742', fg:'#EDF0F5',
    frase:'El tiempo también pinta',
    img: IMG.inf03,
    desc:'Sobre un azul profundo, el número aparece como una señal mínima en medio de la materia. El artista interviene la superficie en distintas sesiones, permitiendo que las capas inferiores asomen y dialoguen con las superiores.'
  },
  {
    id:'inf-07', titulo:'Infinito VII', numero:'07', anio:2018,
    medidas:'120 × 90 cm', tecnica:'Óleo y acrílico sobre lienzo',
    color:'#C08A2E', color2:'#8F6416', fg:'#FFF8EC',
    frase:'Capas de lo que fui',
    img: IMG.inf07,
    desc:'El ocre domina la composición y aporta una temperatura cálida, casi mineral. La cifra funciona como un ancla: en medio de la acumulación de materia, el número ordena y da sentido al caos del proceso.'
  },
  {
    id:'inf-12', titulo:'Infinito XII', numero:'12', anio:2019,
    medidas:'100 × 100 cm', tecnica:'Óleo sobre lienzo',
    color:'#E6DFD1', color2:'#CCC1AC', fg:'#17140F',
    frase:'Repetir para avanzar',
    img: IMG.inf12,
    desc:'Una de las piezas de fondo claro de la serie. Aquí el color se retira y deja que la superficie respire: el número se dibuja con una economía extrema, casi como una nota escrita al margen de un cuaderno de trabajo.'
  },
  {
    id:'inf-18', titulo:'Infinito XVIII', numero:'18', anio:2020,
    medidas:'130 × 97 cm', tecnica:'Óleo sobre lienzo',
    color:'#5C6B4A', color2:'#3C4832', fg:'#F0F3E9',
    frase:'Crecer es cambiar de forma',
    img: IMG.inf18,
    desc:'El verde oliva, trabajado en veladuras, genera una profundidad que parece orgánica. La obra pertenece al momento en que la serie empieza a pensar el crecimiento no como suma, sino como transformación de la forma.'
  },
  {
    id:'inf-24', titulo:'Infinito XXIV', numero:'24', anio:2021,
    medidas:'80 × 60 cm', tecnica:'Técnica mixta sobre lienzo',
    color:'#C0938C', color2:'#966A64', fg:'#FFF4F1',
    frase:'Lo que permanece',
    img: IMG.inf24,
    desc:'Formato íntimo y paleta suave para una reflexión sobre la permanencia. Los materiales se alternan sin jerarquía, dejando que la superficie conserve las huellas del trabajo y del tiempo.'
  },
  {
    id:'inf-31', titulo:'Infinito XXXI', numero:'31', anio:2023,
    medidas:'150 × 110 cm', tecnica:'Óleo sobre lienzo',
    color:'#2F5D5B', color2:'#1B3E3D', fg:'#E9F2F0',
    frase:'Contar hasta el infinito',
    img: IMG.inf31,
    desc:'Una de las piezas de mayor formato de la serie. El verde azulado profundo envuelve la cifra y la convierte en presencia. El espectador se enfrenta a un número que ya no cuenta objetos, sino estados.'
  },
  {
    id:'inf-40', titulo:'Infinito XL', numero:'40', anio:2024,
    medidas:'100 × 80 cm', tecnica:'Óleo sobre lienzo',
    color:'#2A2723', color2:'#141210', fg:'#F1EDE6',
    frase:'Cada número, un día',
    img: IMG.inf40,
    desc:'Casi monocroma, esta obra cierra por ahora la serie con una sobriedad absoluta. La cifra emerge apenas de la penumbra y propone una lectura serena: el proceso continúa, y con él, la cuenta.'
  }
];
window.WHATSAPP = '5352932396';
window.IG = 'https://instagram.com/infinitecubanartist';
window.artistProfile = {
  hero_eyebrow: 'Pintura contemporánea · Cuba',
  hero_title: 'Yalain\nFalcón\nYanes',
  hero_intro: 'La Habana, 1972. Una pintura construida por capas, donde el proceso importa tanto como el resultado. Serie Infinito, 2016 – presente.',
  hero_image_url: '',
  hero_image_alt: 'Obra de la serie Infinito',
  header_logo_url: '',
  header_brand_mode: 'text',
  contact_phone: '+53 52932396',
  contact_phone_secondary: '',
  contact_email: 'yalainfalcon@gmail.com',
  whatsapp_number: '5352932396',
  instagram_url: 'https://instagram.com/infinitecubanartist',
  facebook_url: 'https://www.facebook.com/search/top?q=Yalain%20Falc%C3%B3n',
  threads_url: 'https://www.threads.com/@infinitecubanartist',
  birth_place: 'La Habana, Cuba',
  birth_year: 1972,
  summary: 'Diseñador industrial de formación, pintor por necesidad de expresión. Su obra se construye por capas: una superficie que habla de proceso, cambio y permanencia.',
  quote: 'Trabajo por capas. Dejo que la pintura decida cuándo está terminada: a veces tarda meses, a veces años.',
  quote_attribution: 'Yalain Falcón Yanes · La Habana',
  portrait_url: window.IMG.artistWide,
  biography: 'Nacido en La Habana, Cuba, en 1972, Yalain Falcón Yanes se formó como diseñador industrial en el Instituto Superior Politécnico de Diseño Industrial (1995). Su formación técnica marcó una base estructural que más adelante evolucionó hacia la pintura, donde encontró un medio más directo de expresión y comunicación.\n\nLa práctica artística de Yalain se basa en la experimentación por capas. Utiliza diversos materiales y técnicas, permitiendo que cada pieza evolucione con el tiempo. El resultado es una superficie que habla de proceso, cambio y permanencia.',
  artistic_vision: 'En la década de los noventa, el arte abstracto cubano vivió una revitalización significativa. Nuevas generaciones retomaron esta tradición aportando perspectivas contemporáneas.\n\nLa obra de Yalain se inserta en ese diálogo: respeta la raíz abstracta, pero la adapta a una mirada actual, donde el mensaje y la experiencia emocional del espectador son fundamentales.',
  series_description: '«Infinito» nace como resultado de una investigación sobre las actitudes y las relaciones humanas. En esta serie, el artista pinta números consecutivos sobre fondos de color —y ocasionalmente blancos— acompañados de frases motivacionales.\n\nCada obra representa un momento del proceso personal del artista, convirtiéndose en un testimonio visual de crecimiento y transformación.'
};
window.exhibitions = [
  { year: 2016, title: 'Inicio de la serie «Infinito»', place: 'La Habana, Cuba' },
  { year: 2019, title: 'Exposición colectiva de arte abstracto', place: 'La Habana, Cuba' },
  { year: 2021, title: 'Selección de arte cubano contemporáneo', place: 'Miami, EE. UU.' },
  { year: 2022, title: 'Feria internacional de arte', place: 'Madrid, España' },
  { year: 2024, title: '«Infinito», exposición individual', place: 'Ciudad de México, México' },
  { year: 2025, title: 'Obra en colecciones privadas', place: 'EE. UU. · España · México' }
];
