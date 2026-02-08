
import { Category, ScheduledClass, Trainer, Center, FAQItem, FitnessGoal } from './types';

export const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
export const HOURS = ['8:00', '9:30', '11:00', '12:30', '14:00', '17:00', '18:30', '20:00'];

export const CATEGORY_COLORS: Record<Category, string> = {
  [Category.BAJO_IMPACTO]: 'bg-pink-100 text-pink-800 border-pink-200',
  [Category.ALTO_IMPACTO]: 'bg-red-100 text-red-800 border-red-200',
  [Category.FUNCIONAL]: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  [Category.PISCINA]: 'bg-blue-100 text-blue-800 border-blue-200',
  [Category.COREOGRAFICAS]: 'bg-purple-100 text-purple-800 border-purple-200',
};

export const FITNESS_GOALS: FitnessGoal[] = [
  { id: 'weight_loss', title: 'Pérdida de Peso', description: 'Enfoque en quema calórica y ejercicios cardiovasculares.', icon: 'Zap' },
  { id: 'muscle_gain', title: 'Ganancia Muscular', description: 'Entrenamiento de fuerza e hipertrofia para aumentar masa.', icon: 'Dumbbell' },
  { id: 'flexibility', title: 'Flexibilidad y Salud', description: 'Mejora de la postura, movilidad y reducción de estrés.', icon: 'Heart' },
  { id: 'endurance', title: 'Rendimiento y Cardio', description: 'Aumenta tu resistencia para deportes de larga duración.', icon: 'Zap' },
];

export const MONITORS: Trainer[] = [
  { 
    id: 1, 
    name: 'Paula Méndez', 
    role: 'Especialista en Pilates y Core', 
    image: 'https://images.unsplash.com/photo-1518611012118-2969c6328328?auto=format&fit=crop&q=80&w=400&h=400',
    specialties: ['Pilates Clínico', 'Post-Parto', 'Flexibilidad'],
    description: 'Con más de 10 años de experiencia, Paula te ayudará a mejorar tu postura y fortalecer tu core de forma segura.'
  },
  { 
    id: 2, 
    name: 'Sergio Domínguez', 
    role: 'Entrenador Personal y Musculación', 
    image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2adfcd?auto=format&fit=crop&q=80&w=400&h=400',
    specialties: ['Hipertrofia', 'Pérdida de Grasa', 'Powerlifting'],
    description: 'Especialista en transformación física. Si buscas resultados estéticos y fuerza funcional, Sergio es tu coach.'
  },
  { 
    id: 3, 
    name: 'Lucía Romero', 
    role: 'Instructora de Yoga y Meditación', 
    image: 'https://images.unsplash.com/photo-1552196563-55cd4e45efb3?auto=format&fit=crop&q=80&w=400&h=400',
    specialties: ['Hatha Yoga', 'Mindfulness', 'Gestión del Estrés'],
    description: 'Encuentra el equilibrio entre mente y cuerpo. Lucía adapta la práctica de yoga a cualquier nivel físico.'
  },
  { 
    id: 4, 
    name: 'Héctor Jiménez', 
    role: 'Head Coach Crossfit', 
    image: 'https://images.unsplash.com/photo-1507398941214-57f196a5ad35?auto=format&fit=crop&q=80&w=400&h=400',
    specialties: ['Halterofilia', 'HIIT', 'Rendimiento Deportivo'],
    description: 'Ex-atleta profesional enfocado en el alto rendimiento y la superación de límites físicos.'
  },
];

export const PT_AVAILABILITY: Record<number, Record<string, string[]>> = {
  1: { 'Lunes': ['9:30', '11:00', '17:00'], 'Martes': ['9:30', '12:30', '18:30'], 'Miércoles': ['11:00', '14:00', '20:00'] },
  2: { 'Lunes': ['8:00', '12:30', '17:00'], 'Martes': ['9:30', '11:00', '20:00'], 'Jueves': ['12:30', '18:30', '20:00'] },
  3: { 'Miércoles': ['9:30', '11:00', '18:30'], 'Viernes': ['9:30', '12:30', '17:00'], 'Lunes': ['12:30', '14:00'] },
  4: { 'Lunes': ['8:00', '9:30', '14:00'], 'Martes': ['11:00', '12:30', '20:00'], 'Viernes': ['17:00', '18:30'] }
};

export const CENTERS: Center[] = [
  {
    id: 'navia',
    name: 'Máis que Auga Navia',
    address: 'C. Teixugueiras, 15, Vigo',
    description: 'Nuestro centro más moderno y urbano. Un espacio diáfano diseñado para la máxima eficiencia en tu entrenamiento con tecnología de vanguardia.',
    mainImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=1200',
    highlight: 'Box de Entrenamiento Funcional Pro',
    features: ['Sala Fitness de 1000m²', 'Box de Crossfit', 'Piscina Panorámica', 'Zona de Peso Libre', 'Cardio Technogym', 'Vestuarios Premium', 'Parking Gratuito', 'Cafetería Saludable'],
    gallery: [
      'https://images.unsplash.com/photo-1574680096145-d05b474e2158?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&q=80&w=600'
    ]
  },
  {
    id: 'coia',
    name: 'Máis que Auga Coia',
    address: 'Av. de Castelao, s/n, Vigo',
    description: 'El corazón acuático de Vigo. Especializado en natación y bienestar termal, Coia ofrece una experiencia de relajación y salud inigualable.',
    mainImage: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&q=80&w=1200',
    highlight: 'Circuito de Spa y Bienestar',
    features: ['2 Piscinas Olímpicas', 'Circuito Spa Completo', 'Jacuzzi y Chorros', 'Sauna y Baño Turco', 'Salas de Actividades Dirigidas', 'Zona de Nutrición', 'Fisioterapia', 'Parking Vigilado'],
    gallery: [
      'https://images.unsplash.com/photo-1559333086-b0a56225a93c?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1570829460005-c840387bb1ca?auto=format&fit=crop&q=80&w=600'
    ]
  },
  {
    id: 'barreiro',
    name: 'Máis que Auga Barreiro',
    address: 'Av. Ramón Nieto, 310, Vigo',
    description: 'Un centro familiar con espíritu de comunidad. Amplias zonas exteriores y una gran oferta de deportes de raqueta en el pulmón verde de la zona.',
    mainImage: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=1200',
    highlight: 'Pistas de Pádel Indoor y Outdoor',
    features: ['8 Pistas de Pádel', 'Gimnasio Exterior', 'Pista de Atletismo', 'Ludoteca Infantil', 'Cafetería Saludable', 'Zona de Barbacoa', 'Área de Descanso', 'Fisioterapia Deportiva'],
    gallery: [
      'https://images.unsplash.com/photo-1551632432-c735e829942b?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1521830101529-057b1dfd9784?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1549476464-37392f717551?auto=format&fit=crop&q=80&w=600'
    ]
  }
];

export const FAQ_DATA: FAQItem[] = [
  {
    question: "¿Cómo puedo reservar una clase dirigida?",
    answer: "Para reservar, debes ser socio activo. Una vez dentro de la aplicación, ve a la sección 'Actividades', elige el día y la hora que prefieras, y pulsa en 'Reservar Plaza'. Podrás ver tus reservas confirmadas en tu sección 'Mi Agenda'."
  },
  {
    question: "¿Con cuánta antelación puedo hacer mi reserva?",
    answer: "Puedes reservar tus clases dirigidas favoritas con hasta 7 días de antelación. Te recomendamos hacerlo pronto, ¡las plazas de las horas punta suelen volar!"
  },
  {
    question: "¿Puedo acceder a todos los centros con mi cuota?",
    answer: "Si tienes el Plan Premium, tienes acceso total e ilimitado a nuestros tres centros en Vigo: Navia, Coia y Barreiro. Si tienes el Plan Básico, tu acceso está limitado al centro en el que realizaste el alta."
  },
  {
    question: "¿Cómo cancelo una clase si no puedo asistir?",
    answer: "Desde la sección 'Mi Agenda' en tu perfil, verás un listado de tus próximas actividades. Pulsa el botón 'Cancelar' en la actividad correspondiente. Te pedimos que lo hagas con al menos 2 horas de antelación para que otro socio pueda aprovechar la plaza."
  }
];

export const MEMBERSHIPS = [
  { name: 'Plan Básico', price: '34,90€', features: ['Acceso ilimitado Sala Fitness', 'Clases dirigidas (Max 3/sem)', 'App Móvil'], color: 'bg-white' },
  { name: 'Plan Premium', price: '49,90€', features: ['Acceso total ilimitado', 'Clases dirigidas ilimitadas', 'Zona Spa incluida', 'Invitado gratis 1/mes'], color: 'bg-[#8dc63f]/10 border-[#8dc63f]' },
  { name: 'Plan Familiar', price: '85,00€', features: ['2 Adultos + Hijos < 18', 'Ludoteca incluida', 'Descuentos en cursillos'], color: 'bg-white' },
];

export const INITIAL_CLASSES: ScheduledClass[] = [
  // Lunes
  { id: 'l1', hour: '8:00', day: 'Lunes', name: 'MOVILIDAD & CORE', instructor: 'Paula Méndez', room: 'Sala A', category: Category.BAJO_IMPACTO, capacity: 20, booked: 12 },
  { id: 'l2', hour: '9:30', day: 'Lunes', name: 'TONO GENERAL', instructor: 'Sergio Domínguez', room: 'Fitness', category: Category.FUNCIONAL, capacity: 30, booked: 25 },
  { id: 'l3', hour: '11:00', day: 'Lunes', name: 'AQUAGYM', instructor: 'Lucía Romero', room: 'Piscina', category: Category.PISCINA, capacity: 20, booked: 15 },
  { id: 'l4', hour: '12:30', day: 'Lunes', name: 'PILATES', instructor: 'Paula Méndez', room: 'Sala B', category: Category.BAJO_IMPACTO, capacity: 20, booked: 18 },
  { id: 'l5', hour: '14:00', day: 'Lunes', name: 'CROSS TRAINING', instructor: 'Héctor Jiménez', room: 'Box', category: Category.FUNCIONAL, capacity: 12, booked: 10 },
  { id: 'l6', hour: '17:00', day: 'Lunes', name: 'LATIN DANCE', instructor: 'Lucía Romero', room: 'Gimnasio', category: Category.COREOGRAFICAS, capacity: 35, booked: 30 },
  { id: 'l7', hour: '18:30', day: 'Lunes', name: 'BODY PUMP', instructor: 'Sergio Domínguez', room: 'Sala A', category: Category.FUNCIONAL, capacity: 30, booked: 28 },
  { id: 'l8', hour: '20:00', day: 'Lunes', name: 'SPINNING PRO', instructor: 'Héctor Jiménez', room: 'Ciclo', category: Category.ALTO_IMPACTO, capacity: 25, booked: 15 },

  // Martes
  { id: 'm1', hour: '8:00', day: 'Martes', name: 'PILATES SUAVE', instructor: 'Paula Méndez', room: 'Sala B', category: Category.BAJO_IMPACTO, capacity: 20, booked: 18 },
  { id: 'm2', hour: '9:30', day: 'Martes', name: 'YOGA FLOW', instructor: 'Lucía Romero', room: 'Sala B', category: Category.BAJO_IMPACTO, capacity: 15, booked: 12 },
  { id: 'm3', hour: '11:00', day: 'Martes', name: 'BODY COMBAT', instructor: 'Sergio Domínguez', room: 'Sala A', category: Category.ALTO_IMPACTO, capacity: 30, booked: 20 },
  { id: 'm4', hour: '12:30', day: 'Martes', name: 'GAP', instructor: 'Paula Méndez', room: 'Sala A', category: Category.FUNCIONAL, capacity: 25, booked: 22 },
  { id: 'm5', hour: '14:00', day: 'Martes', name: 'HIIT BOX', instructor: 'Héctor Jiménez', room: 'Box', category: Category.ALTO_IMPACTO, capacity: 12, booked: 12 },
  { id: 'm6', hour: '17:00', day: 'Martes', name: 'SPINNING', instructor: 'Héctor Jiménez', room: 'Ciclo', category: Category.ALTO_IMPACTO, capacity: 20, booked: 20 },
  { id: 'm7', hour: '18:30', day: 'Martes', name: 'TRX & CORE', instructor: 'Héctor Jiménez', room: 'Box', category: Category.FUNCIONAL, capacity: 12, booked: 10 },
  { id: 'm8', hour: '20:00', day: 'Martes', name: 'ZUMBA FIT', instructor: 'Lucía Romero', room: 'Gimnasio', category: Category.COREOGRAFICAS, capacity: 40, booked: 38 },

  // Miércoles
  { id: 'w1', hour: '8:00', day: 'Miércoles', name: 'YOGA DESPERTAR', instructor: 'Lucía Romero', room: 'Sala B', category: Category.BAJO_IMPACTO, capacity: 15, booked: 5 },
  { id: 'w2', hour: '9:30', day: 'Miércoles', name: 'PILATES', instructor: 'Paula Méndez', room: 'Sala B', category: Category.BAJO_IMPACTO, capacity: 20, booked: 19 },
  { id: 'w3', hour: '11:00', day: 'Miércoles', name: 'CIRCUITO FUERZA', instructor: 'Sergio Domínguez', room: 'Fitness', category: Category.FUNCIONAL, capacity: 20, booked: 15 },
  { id: 'w4', hour: '12:30', day: 'Miércoles', name: 'NATACIÓN', instructor: 'Lucía Romero', room: 'Piscina', category: Category.PISCINA, capacity: 12, booked: 8 },
  { id: 'w5', hour: '14:00', day: 'Miércoles', name: 'SPINNING MIX', instructor: 'Héctor Jiménez', room: 'Ciclo', category: Category.ALTO_IMPACTO, capacity: 20, booked: 18 },
  { id: 'w6', hour: '17:00', day: 'Miércoles', name: 'AQUAGYM', instructor: 'Lucía Romero', room: 'Piscina', category: Category.PISCINA, capacity: 15, booked: 12 },
  { id: 'w7', hour: '18:30', day: 'Miércoles', name: 'CROSS TRAINING', instructor: 'Héctor Jiménez', room: 'Box', category: Category.FUNCIONAL, capacity: 15, booked: 14 },
  { id: 'w8', hour: '20:00', day: 'Miércoles', name: 'BODY COMBAT', instructor: 'Sergio Domínguez', room: 'Sala A', category: Category.ALTO_IMPACTO, capacity: 30, booked: 25 },

  // Jueves
  { id: 'j1', hour: '8:00', day: 'Jueves', name: 'POSTURAL TRAINING', instructor: 'Sergio Domínguez', room: 'Sala B', category: Category.BAJO_IMPACTO, capacity: 25, booked: 22 },
  { id: 'j2', hour: '9:30', day: 'Jueves', name: 'ZUMBA FIT', instructor: 'Lucía Romero', room: 'Gimnasio', category: Category.COREOGRAFICAS, capacity: 30, booked: 28 },
  { id: 'j3', hour: '11:00', day: 'Jueves', name: 'STEP', instructor: 'Paula Méndez', room: 'Sala A', category: Category.COREOGRAFICAS, capacity: 20, booked: 15 },
  { id: 'j4', hour: '12:30', day: 'Jueves', name: 'CORE & STRETCH', instructor: 'Lucía Romero', room: 'Sala B', category: Category.BAJO_IMPACTO, capacity: 20, booked: 18 },
  { id: 'j5', hour: '14:00', day: 'Jueves', name: 'BOXEO FIT', instructor: 'Héctor Jiménez', room: 'Box', category: Category.ALTO_IMPACTO, capacity: 12, booked: 10 },
  { id: 'j6', hour: '17:00', day: 'Jueves', name: 'SH\'BAM', instructor: 'Lucía Romero', room: 'Gimnasio', category: Category.COREOGRAFICAS, capacity: 25, booked: 10 },
  { id: 'j7', hour: '18:30', day: 'Jueves', name: 'HIIT BOX', instructor: 'Héctor Jiménez', room: 'Box', category: Category.ALTO_IMPACTO, capacity: 12, booked: 12 },
  { id: 'j8', hour: '20:00', day: 'Jueves', name: 'YOGA FLOW', instructor: 'Lucía Romero', room: 'Sala B', category: Category.BAJO_IMPACTO, capacity: 20, booked: 18 },

  // Viernes
  { id: 'v1', hour: '8:00', day: 'Viernes', name: 'BODY STRETCH', instructor: 'Lucía Romero', room: 'Sala B', category: Category.BAJO_IMPACTO, capacity: 20, booked: 8 },
  { id: 'v2', hour: '9:30', day: 'Viernes', name: 'BODY PUMP', instructor: 'Sergio Domínguez', room: 'Sala A', category: Category.FUNCIONAL, capacity: 30, booked: 25 },
  { id: 'v3', hour: '11:00', day: 'Viernes', name: 'SPINNING', instructor: 'Héctor Jiménez', room: 'Ciclo', category: Category.ALTO_IMPACTO, capacity: 20, booked: 18 },
  { id: 'v4', hour: '12:30', day: 'Viernes', name: 'AQUAFIT', instructor: 'Lucía Romero', room: 'Piscina', category: Category.PISCINA, capacity: 15, booked: 14 },
  { id: 'v5', hour: '14:00', day: 'Viernes', name: 'PILATES', instructor: 'Paula Méndez', room: 'Sala B', category: Category.BAJO_IMPACTO, capacity: 20, booked: 20 },
  { id: 'v6', hour: '17:00', day: 'Viernes', name: 'NATACIÓN', instructor: 'Lucía Romero', room: 'Piscina', category: Category.PISCINA, capacity: 10, booked: 9 },
  { id: 'v7', hour: '18:30', day: 'Viernes', name: 'GAP', instructor: 'Paula Méndez', room: 'Sala A', category: Category.FUNCIONAL, capacity: 30, booked: 25 },
  { id: 'v8', hour: '20:00', day: 'Viernes', name: 'CIRCUITO FUERZA', instructor: 'Sergio Domínguez', room: 'Fitness', category: Category.FUNCIONAL, capacity: 20, booked: 15 },

  // Sábado
  { id: 's1', hour: '9:30', day: 'Sábado', name: 'MASTER SPINNING', instructor: 'Héctor Jiménez', room: 'Ciclo', category: Category.ALTO_IMPACTO, capacity: 30, booked: 29 },
  { id: 's2', hour: '11:00', day: 'Sábado', name: 'YOGA DINÁMICO', instructor: 'Lucía Romero', room: 'Sala B', category: Category.BAJO_IMPACTO, capacity: 20, booked: 12 },
  { id: 's3', hour: '12:30', day: 'Sábado', name: 'ZUMBA PARTY', instructor: 'Lucía Romero', room: 'Gimnasio', category: Category.COREOGRAFICAS, capacity: 40, booked: 35 },

  // Domingo
  { id: 'd1', hour: '10:00', day: 'Domingo', name: 'ENTRENO FAMILIAR', instructor: 'Sergio Domínguez', room: 'Gimnasio', category: Category.FUNCIONAL, capacity: 40, booked: 20 },
  { id: 'd2', hour: '11:30', day: 'Domingo', name: 'PILATES ZEN', instructor: 'Paula Méndez', room: 'Sala B', category: Category.BAJO_IMPACTO, capacity: 20, booked: 10 },
];
