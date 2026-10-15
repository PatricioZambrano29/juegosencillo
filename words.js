/**
 * words.js — Base de palabras del Ahorcado
 * Organizada por categoría y nivel de dificultad
 */

const WORDS_DB = {
  general: {
    easy: [
      { word: "GATO",     hint: "Animal doméstico que ronronea" },
      { word: "CASA",     hint: "Lugar donde vivimos" },
      { word: "SOL",      hint: "Estrella de nuestro sistema solar" },
      { word: "LUNA",     hint: "Satélite natural de la Tierra" },
      { word: "MESA",     hint: "Mueble para comer o trabajar" },
      { word: "AGUA",     hint: "Líquido esencial para la vida" },
      { word: "LIBRO",    hint: "Objeto lleno de páginas y letras" },
      { word: "AMOR",     hint: "Sentimiento profundo de afecto" },
      { word: "NOCHE",    hint: "Cuando el sol se oculta" },
      { word: "FLOR",     hint: "Parte colorida de una planta" },
      { word: "PATO",     hint: "Ave que vive en el agua" },
      { word: "TREN",     hint: "Medio de transporte sobre rieles" },
      { word: "PERA",     hint: "Fruta de color verde o amarillo" },
      { word: "NIÑO",     hint: "Persona de poca edad" },
      { word: "ROJO",     hint: "Color de la sangre" },
    ],
    medium: [
      { word: "ESCUELA",  hint: "Lugar donde se aprende" },
      { word: "MUSICA",   hint: "Arte de combinar sonidos" },
      { word: "VERANO",   hint: "La estación más calurosa del año" },
      { word: "VENTANA",  hint: "Abertura en la pared para ver hacia afuera" },
      { word: "COCINA",   hint: "Lugar donde se prepara la comida" },
      { word: "CAMINO",   hint: "Sendero que une dos lugares" },
      { word: "BOSQUE",   hint: "Zona con muchos árboles" },
      { word: "JUGUETE",  hint: "Objeto de entretenimiento infantil" },
      { word: "CORBATA",  hint: "Accesorio de moda masculino" },
      { word: "PLANETA",  hint: "Cuerpo celeste que orbita una estrella" },
      { word: "HOSPITAL", hint: "Lugar donde atienden enfermos" },
      { word: "PINTURAS", hint: "Materiales para colorear o arte" },
      { word: "MARIPOSA", hint: "Insecto con alas coloridas" },
      { word: "CRISTAL",  hint: "Material transparente y frágil" },
      { word: "SOMBRA",   hint: "Zona sin luz detrás de un objeto" },
    ],
    hard: [
      { word: "ARQUITECTO",   hint: "Profesional que diseña edificios" },
      { word: "FERROCARRIL",  hint: "Sistema de transporte sobre vías de hierro" },
      { word: "GLOBALIZACION",hint: "Proceso de integración mundial" },
      { word: "HIPOPOTAMO",   hint: "Mamífero semiacuático muy grande" },
      { word: "CUMPLEANOS",   hint: "Celebración anual del nacimiento" },
      { word: "METEOROLOGIA", hint: "Ciencia que estudia el tiempo atmosférico" },
      { word: "QUIROFANO",    hint: "Sala de operaciones en un hospital" },
      { word: "TELESCOPIO",   hint: "Instrumento óptico para ver estrellas" },
      { word: "DICCIONARIO",  hint: "Libro con definiciones de palabras" },
      { word: "FOTOGRAFIA",   hint: "Arte de capturar imágenes con luz" },
    ],
  },

  animals: {
    easy: [
      { word: "PERRO",    hint: "El mejor amigo del hombre" },
      { word: "GATO",     hint: "Animal que ronronea" },
      { word: "LEON",     hint: "El rey de la selva" },
      { word: "PATO",     hint: "Ave que hace 'cuac'" },
      { word: "VACA",     hint: "Animal que da leche" },
      { word: "PATO",     hint: "Nada en estanques" },
      { word: "OSO",      hint: "Animal que hiberna en invierno" },
      { word: "PEZ",      hint: "Animal acuático con escamas" },
      { word: "TORO",     hint: "Bovino macho adulto" },
      { word: "LOBO",     hint: "Ancestro salvaje del perro" },
    ],
    medium: [
      { word: "JIRAFA",   hint: "Animal con el cuello más largo" },
      { word: "TIGRE",    hint: "Felino rayado" },
      { word: "DELFIN",   hint: "Mamífero marino muy inteligente" },
      { word: "COCODRILO",hint: "Reptil de río con dientes afilados" },
      { word: "AGUILA",   hint: "Ave rapaz de gran envergadura" },
      { word: "GORILA",   hint: "El primate más grande del mundo" },
      { word: "CAMELLO",  hint: "Animal del desierto con jorobas" },
      { word: "PINGÜINO", hint: "Ave que no puede volar, vive en el frío" },
      { word: "SERPIENTE",hint: "Reptil sin patas" },
      { word: "TORTUGA",  hint: "Reptil con caparazón duro" },
    ],
    hard: [
      { word: "ORNITORRINCO",  hint: "Mamífero que pone huevos y tiene pico" },
      { word: "RINOCERONTE",   hint: "Mamífero con cuerno en la nariz" },
      { word: "CHIMPANCE",     hint: "Simio africano cercano al humano" },
      { word: "ESCORPION",     hint: "Arácnido con aguijón venenoso" },
      { word: "MANATÍ",        hint: "Mamífero marino herbívoro" },
      { word: "SALAMANDRA",    hint: "Anfibio relacionado con el fuego" },
      { word: "CARACOL",       hint: "Molusco con concha en espiral" },
      { word: "MURCIÉLAGO",    hint: "Único mamífero volador" },
    ],
  },

  countries: {
    easy: [
      { word: "PERU",      hint: "País de Machu Picchu" },
      { word: "CUBA",      hint: "Isla caribeña famosa por su música" },
      { word: "CHILE",     hint: "País largo y angosto de Sudamérica" },
      { word: "IRAN",      hint: "País de Oriente Medio, antes Persia" },
      { word: "CHINA",     hint: "País con más habitantes del mundo" },
      { word: "BRASIL",    hint: "País del carnaval y el fútbol" },
      { word: "INDIA",     hint: "País del Taj Mahal y el curry" },
      { word: "JAPON",     hint: "País del sol naciente" },
      { word: "EGIPTO",    hint: "País de las pirámides" },
      { word: "RUSIA",     hint: "El país más grande del mundo" },
    ],
    medium: [
      { word: "COLOMBIA",   hint: "País del café y las esmeraldas" },
      { word: "ARGENTINA",  hint: "País del tango y el asado" },
      { word: "PORTUGAL",   hint: "País ibérico famoso por el fado" },
      { word: "AUSTRALIA",  hint: "País-continente con canguros" },
      { word: "ALEMANIA",   hint: "País europeo famoso por su cerveza" },
      { word: "TAILANDIA",  hint: "País del sudeste asiático con templos dorados" },
      { word: "MARRUECOS",  hint: "País del norte de África" },
      { word: "NORUEGA",    hint: "País nórdico con fiordos" },
      { word: "ECUADOR",    hint: "País atravesado por la línea ecuatorial" },
      { word: "VIETNAM",    hint: "País asiático famoso por sus lanterns" },
    ],
    hard: [
      { word: "MOZAMBIQUE",    hint: "País del sureste de África" },
      { word: "KAZAJISTAN",    hint: "El país sin salida al mar más grande" },
      { word: "BANGLADESH",    hint: "País asiático densamente poblado" },
      { word: "AZERBAIYAN",    hint: "País del Cáucaso famoso por el petróleo" },
      { word: "FILIPINAS",     hint: "Archipiélago del sudeste asiático" },
      { word: "ZIMBABUE",      hint: "País africano donde están las cataratas Victoria" },
      { word: "TAYIKISTAN",    hint: "País montañoso de Asia Central" },
    ],
  },

  fruits: {
    easy: [
      { word: "MANGO",    hint: "Fruta tropical de color naranja" },
      { word: "FRESA",    hint: "Fruta roja pequeña y dulce" },
      { word: "PERA",     hint: "Fruta con forma de campana" },
      { word: "UVAS",     hint: "Fruta que se usa para hacer vino" },
      { word: "KIWI",     hint: "Fruta verde por dentro con semillas negras" },
      { word: "LIMA",     hint: "Cítrico pequeño de color verde" },
      { word: "PIÑA",     hint: "Fruta tropical con espinas" },
      { word: "CIRUELA",  hint: "Fruta morada o roja pequeña" },
    ],
    medium: [
      { word: "NARANJA",    hint: "Fruta cítrica de color anaranjado" },
      { word: "PLATANO",    hint: "Fruta amarilla alargada" },
      { word: "PAPAYA",     hint: "Fruta tropical grande y anaranjada" },
      { word: "GUAYABA",    hint: "Fruta tropical de pulpa rosada" },
      { word: "SANDÍA",     hint: "Fruta grande, verde por fuera y roja por dentro" },
      { word: "MELON",      hint: "Fruta verde o amarilla muy jugosa" },
      { word: "CEREZA",     hint: "Fruta pequeña roja que crece en árbol" },
      { word: "MARACUYA",   hint: "Fruta de la pasión, sabor intenso" },
      { word: "FRAMBUESA",  hint: "Fruta roja pequeña parecida a la mora" },
      { word: "GRANADA",    hint: "Fruta con semillas rojas jugosas" },
    ],
    hard: [
      { word: "CARAMBOLA",    hint: "Fruta tropical en forma de estrella" },
      { word: "RAMBUTAN",     hint: "Fruta asiática de aspecto peludo" },
      { word: "MANGOSTEEN",   hint: "Fruta asiática llamada 'reina de las frutas'" },
      { word: "PITAHAYA",     hint: "Fruta del dragón, roja con puntos" },
      { word: "TAMARINDO",    hint: "Fruto de vaina con sabor agridulce" },
      { word: "AGUACATE",     hint: "Fruta verde cremosa para el guacamol" },
    ],
  },

  tech: {
    easy: [
      { word: "MOUSE",    hint: "Periférico de entrada para el computador" },
      { word: "WIFI",     hint: "Tecnología de conexión inalámbrica" },
      { word: "EMAIL",    hint: "Correo electrónico" },
      { word: "APP",      hint: "Aplicación móvil o de escritorio" },
      { word: "CHIP",     hint: "Pequeño componente electrónico" },
      { word: "RED",      hint: "Conjunto de computadores conectados" },
      { word: "DATOS",    hint: "Información procesada por un sistema" },
      { word: "NUBE",     hint: "Almacenamiento en servidores remotos" },
    ],
    medium: [
      { word: "SERVIDOR",   hint: "Computador que brinda servicios a otros" },
      { word: "HARDWARE",   hint: "Partes físicas de un computador" },
      { word: "SOFTWARE",   hint: "Programas y sistemas informáticos" },
      { word: "FIREWALL",   hint: "Sistema de seguridad de redes" },
      { word: "TECLADO",    hint: "Periférico para ingresar texto" },
      { word: "MONITOR",    hint: "Pantalla de visualización" },
      { word: "DOMINIO",    hint: "Nombre único de un sitio web" },
      { word: "MEMORIA",    hint: "Espacio donde se almacenan datos temporales" },
      { word: "ANTIVIRUS",  hint: "Software que protege de malware" },
      { word: "PROTOCOLO",  hint: "Conjunto de reglas de comunicación" },
    ],
    hard: [
      { word: "MICROPROCESADOR", hint: "Cerebro del computador" },
      { word: "CIBERSEGURIDAD",  hint: "Protección de sistemas informáticos" },
      { word: "CRIPTOGRAFIA",    hint: "Ciencia de cifrar mensajes" },
      { word: "INTELIGENCIA",    hint: "Capacidad de razonamiento artificial" },
      { word: "KUBERNETES",      hint: "Plataforma de orquestación de contenedores" },
      { word: "BLOCKCHAIN",      hint: "Tecnología de cadena de bloques descentralizada" },
      { word: "ALGORITMO",       hint: "Secuencia de pasos para resolver un problema" },
      { word: "COMPILADOR",      hint: "Programa que traduce código fuente a ejecutable" },
    ],
  },
};

/**
 * Obtiene una palabra aleatoria según categoría y nivel.
 * @param {string} category
 * @param {string} level  'easy' | 'medium' | 'hard'
 * @param {string[]} exclude - palabras a excluir (para no repetir)
 * @returns {{ word: string, hint: string }}
 */
function getRandomWord(category, level, exclude = []) {
  const pool = (WORDS_DB[category] && WORDS_DB[category][level])
    ? WORDS_DB[category][level]
    : WORDS_DB.general[level];

  const available = pool.filter(w => !exclude.includes(w.word));
  if (available.length === 0) return pool[Math.floor(Math.random() * pool.length)];
  return available[Math.floor(Math.random() * available.length)];
}
