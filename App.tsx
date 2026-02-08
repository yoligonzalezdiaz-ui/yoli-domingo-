
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Filter, 
  Search, 
  CheckCircle, 
  X,
  Plus,
  ArrowRight,
  Menu,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Info,
  Dumbbell,
  Waves,
  Sparkles,
  Zap,
  Phone,
  Instagram,
  Facebook,
  Award,
  Heart,
  UserCheck,
  CreditCard,
  QrCode,
  LogOut,
  Mail,
  Fingerprint,
  Target,
  Stethoscope,
  Building2,
  Image as ImageIcon,
  HelpCircle,
  BrainCircuit,
  Loader2,
  Trophy,
  Flame,
  MessageCircleQuestion,
  Timer,
  Layout,
  Star,
  Quote,
  ZapOff,
  Activity,
  ShieldCheck,
  Car,
  Bath,
  Coffee,
  Accessibility,
  Wind
} from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";
import { Category, ScheduledClass, Booking, UserProfile, Trainer, Center, FitnessGoal, RoutinePlan, RoutineActivity } from './types';
import { DAYS, HOURS, CATEGORY_COLORS, INITIAL_CLASSES, MONITORS, CENTERS, FAQ_DATA, FITNESS_GOALS, MEMBERSHIPS, PT_AVAILABILITY } from './constants';

const App: React.FC = () => {
  const [classes, setClasses] = useState<ScheduledClass[]>(INITIAL_CLASSES);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState<ScheduledClass | null>(null);
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);
  const [selectedCenter, setSelectedCenter] = useState<Center | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [view, setView] = useState<'home' | 'schedule' | 'trainers' | 'centers' | 'routine' | 'profile'>('home');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showEnrollmentModal, setShowEnrollmentModal] = useState<{ plan: string } | null>(null);
  
  // States for AI Routine
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);

  const generationMessages = [
    "Analizando tu objetivo fitness...",
    "Consultando máquinas Technogym disponibles...",
    "Integrando clases de Máis que Auga...",
    "Buscando imágenes de ejercicios...",
    "Diseñando tu plan de entrenamiento semanal...",
    "¡Tu rutina inteligente está casi lista!"
  ];

  // Persistence
  useEffect(() => {
    const savedBookings = localStorage.getItem('ma-bookings');
    const savedUser = localStorage.getItem('ma-user');
    if (savedBookings) setBookings(JSON.parse(savedBookings));
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  useEffect(() => {
    localStorage.setItem('ma-bookings', JSON.stringify(bookings));
    if (user) localStorage.setItem('ma-user', JSON.stringify(user));
    else localStorage.removeItem('ma-user');
  }, [bookings, user]);

  const generateRoutine = async () => {
    if (!user || !selectedGoal) return;
    
    setIsGenerating(true);
    setGenerationStep(0);
    
    const stepInterval = setInterval(() => {
      setGenerationStep(prev => (prev < generationMessages.length - 1 ? prev + 1 : prev));
    }, 2500);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const goalObj = FITNESS_GOALS.find(g => g.id === selectedGoal);
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Eres un experto entrenador personal de Máis que Auga. 
        Genera una rutina semanal para ${user.name} con el objetivo: "${goalObj?.title}".
        
        REQUISITOS OBLIGATORIOS:
        1. Debes incluir MÁQUINAS DE GIMNASIO específicas (ej: Prensa de piernas, Jalón al pecho, Contractora de pecho).
        2. NO te limites solo a cardio. Incluye pesas libres y máquinas de fuerza.
        3. Integra clases dirigidas reales (Spinning, Yoga, Pilates, Body Pump).
        4. Devuelve un plan de 7 días.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              planName: { type: Type.STRING },
              days: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    dayName: { type: Type.STRING },
                    focus: { type: Type.STRING },
                    activities: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          title: { type: Type.STRING },
                          description: { type: Type.STRING },
                          type: { type: Type.STRING, description: "must be one of: machine, cardio, class, free_weight, rest" },
                          sets: { type: Type.STRING },
                          reps: { type: Type.STRING },
                          machineName: { type: Type.STRING }
                        },
                        required: ["title", "description", "type"]
                      }
                    }
                  },
                  required: ["dayName", "activities", "focus"]
                }
              }
            },
            required: ["planName", "days"]
          }
        }
      });

      const plan: RoutinePlan = JSON.parse(response.text);
      setUser(prev => prev ? { ...prev, goal: selectedGoal, routine: plan } : null);
    } catch (error) {
      console.error("AI Generation Error:", error);
      alert("Hubo un error generando tu rutina. Prueba de nuevo.");
    } finally {
      clearInterval(stepInterval);
      setIsGenerating(false);
    }
  };

  const getActivityImage = (activity: RoutineActivity) => {
    const images: Record<string, string> = {
      machine: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&q=80&w=800",
      cardio: "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&q=80&w=800",
      class: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&q=80&w=800",
      free_weight: "https://images.unsplash.com/photo-1583454110551-21f2fa2adfcd?auto=format&fit=crop&q=80&w=800",
      rest: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800"
    };

    const title = activity.title.toLowerCase();
    if (title.includes("prensa") || title.includes("leg press")) return "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800";
    if (title.includes("pecho") || title.includes("chest")) return "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=800";
    if (title.includes("spinning") || title.includes("bici")) return "https://images.unsplash.com/photo-1534258936925-c58bed479fcb?auto=format&fit=crop&q=80&w=800";
    if (title.includes("yoga")) return "https://images.unsplash.com/photo-1552196563-55cd4e45efb3?auto=format&fit=crop&q=80&w=800";
    
    return images[activity.type] || images.machine;
  };

  const filteredClasses = useMemo(() => {
    return classes.filter(cls => {
      const matchesCategory = selectedCategory === 'all' || cls.category === selectedCategory;
      const matchesSearch = cls.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           cls.instructor.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [classes, selectedCategory, searchQuery]);

  const sortedBookings = useMemo(() => {
    return [...bookings]
      .sort((a, b) => b.timestamp - a.timestamp)
      .map(booking => {
        if (booking.type === 'group') {
          const details = classes.find(c => c.id === booking.classId);
          return { booking, details };
        } else {
          const trainer = MONITORS.find(t => t.id === booking.trainerId);
          return {
            booking,
            details: {
              name: `Sesión PT con ${trainer?.name || 'Entrenador'}`,
              instructor: trainer?.role || 'Personal Trainer',
              day: booking.day,
              hour: booking.hour,
            }
          };
        }
      });
  }, [bookings, classes]);

  const getFeatureIcon = (feature: string) => {
    const f = feature.toLowerCase();
    if (f.includes('piscina') || f.includes('spa') || f.includes('jacuzzi') || f.includes('acuático')) return <Waves className="w-5 h-5" />;
    if (f.includes('fitness') || f.includes('peso libre') || f.includes('musculación')) return <Dumbbell className="w-5 h-5" />;
    if (f.includes('crossfit') || f.includes('funcional') || f.includes('hiit')) return <Zap className="w-5 h-5" />;
    if (f.includes('parking') || f.includes('coche')) return <Car className="w-5 h-5" />;
    if (f.includes('vestuarios') || f.includes('baño') || f.includes('ducha')) return <Bath className="w-5 h-5" />;
    if (f.includes('cafetería') || f.includes('nutrición') || f.includes('saludable')) return <Coffee className="w-5 h-5" />;
    if (f.includes('ludoteca') || f.includes('infantil') || f.includes('niños')) return <Accessibility className="w-5 h-5" />;
    if (f.includes('sauna') || f.includes('turco') || f.includes('vapor')) return <Wind className="w-5 h-5" />;
    if (f.includes('padel') || f.includes('raqueta')) return <Target className="w-5 h-5" />;
    if (f.includes('fisioterapia') || f.includes('clínico')) return <Stethoscope className="w-5 h-5" />;
    return <CheckCircle className="w-5 h-5" />;
  };

  const renderIcon = (iconName: string, className?: string) => {
    switch(iconName) {
      case 'Zap': return <Zap className={className} />;
      case 'Dumbbell': return <Dumbbell className={className} />;
      case 'Heart': return <Heart className={className} />;
      default: return <Target className={className} />;
    }
  };

  const handleBooking = (cls: ScheduledClass) => {
    if (!user) { alert("Debes ser socio."); setShowEnrollmentModal({ plan: 'Plan Básico' }); return; }
    if (bookings.some(b => b.classId === cls.id)) return;
    setBookings(prev => [...prev, { id: Math.random().toString(36).substr(2, 9), classId: cls.id, timestamp: Date.now(), type: 'group' }]);
    setClasses(prev => prev.map(c => c.id === cls.id ? { ...c, booked: c.booked + 1 } : c));
    setSelectedClass(null);
  };

  const handleEnrollment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newUser: UserProfile = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      dni: formData.get('dni') as string,
      plan: showEnrollmentModal?.plan || 'Plan Básico',
      memberId: `MA-${Math.floor(Math.random() * 90000 + 10000)}`,
      joinedAt: Date.now()
    };
    setUser(newUser);
    setShowEnrollmentModal(null);
    setView('routine');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col scroll-smooth font-['Inter']">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('home')}>
            <div className="w-10 h-10 bg-[#8dc63f] rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg">MA</div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-gray-900 leading-tight">máis<span className="text-[#8dc63f]">que</span>auga</h1>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest -mt-1 font-black text-center">vigo</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-4 lg:gap-8">
            <button onClick={() => setView('home')} className={`text-sm font-black transition-colors uppercase tracking-tight ${view === 'home' ? 'text-[#8dc63f]' : 'text-gray-400 hover:text-gray-900'}`}>Inicio</button>
            <button onClick={() => setView('schedule')} className={`text-sm font-black transition-colors uppercase tracking-tight ${view === 'schedule' ? 'text-[#8dc63f]' : 'text-gray-400 hover:text-gray-900'}`}>Actividades</button>
            <button onClick={() => setView('trainers')} className={`text-sm font-black transition-colors uppercase tracking-tight ${view === 'trainers' ? 'text-[#8dc63f]' : 'text-gray-400 hover:text-gray-900'}`}>Trainers</button>
            <button onClick={() => setView('routine')} className={`text-sm font-black transition-colors uppercase tracking-tight flex items-center gap-2 ${view === 'routine' ? 'text-[#8dc63f]' : 'text-gray-400 hover:text-gray-900'}`}>
               IA Coach <BrainCircuit className="w-4 h-4" />
            </button>
            <button onClick={() => setView('centers')} className={`text-sm font-black transition-colors uppercase tracking-tight ${view === 'centers' ? 'text-[#8dc63f]' : 'text-gray-400 hover:text-gray-900'}`}>Centros</button>
          </nav>

          <div className="flex items-center gap-3">
            {user ? (
              <button onClick={() => setView('profile')} className="hidden sm:flex items-center gap-3 px-4 py-2 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-all border border-gray-100">
                <div className="w-8 h-8 bg-[#8dc63f] rounded-full flex items-center justify-center text-white font-black text-xs">
                  {user.name.charAt(0)}
                </div>
              </button>
            ) : (
              <button onClick={() => setShowEnrollmentModal({ plan: 'Plan Premium' })} className="bg-[#8dc63f] text-white px-8 py-2.5 rounded-full text-xs font-black shadow-lg shadow-[#8dc63f]/20 uppercase tracking-widest hover:bg-[#7db137] transition-all">Socio MA</button>
            )}
            <button onClick={() => setShowMobileMenu(true)} className="md:hidden p-2 text-gray-600"><Menu className="w-6 h-6" /></button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="fixed inset-0 z-50 bg-white p-6 animate-in slide-in-from-right duration-300">
          <div className="flex justify-between items-center mb-10">
            <div className="w-12 h-12 bg-[#8dc63f] rounded flex items-center justify-center text-white font-bold text-2xl">MA</div>
            <button onClick={() => setShowMobileMenu(false)} className="p-3 bg-gray-100 rounded-full"><X className="w-6 h-6" /></button>
          </div>
          <div className="flex flex-col gap-6">
            <button onClick={() => {setView('home'); setShowMobileMenu(false);}} className="text-3xl font-black text-left">Inicio</button>
            <button onClick={() => {setView('schedule'); setShowMobileMenu(false);}} className="text-3xl font-black text-left">Clases</button>
            <button onClick={() => {setView('routine'); setShowMobileMenu(false);}} className="text-3xl font-black text-left">IA Coach</button>
            <button onClick={() => {setView('trainers'); setShowMobileMenu(false);}} className="text-3xl font-black text-left">Trainers</button>
          </div>
        </div>
      )}

      {view === 'home' && (
        <div className="flex flex-col animate-in fade-in duration-700">
          {/* Hero Section */}
          <section className="relative h-[85vh] flex items-center overflow-hidden bg-gray-900">
            <img src="https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&q=80&w=2000" className="absolute inset-0 w-full h-full object-cover opacity-50 scale-105" alt="Gym" />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent"></div>
            <div className="relative max-w-7xl mx-auto px-4 w-full">
              <div className="max-w-3xl">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-1 bg-[#8dc63f] rounded-full"></div>
                  <span className="text-[#8dc63f] font-black text-xs uppercase tracking-[0.4em]">Vigo Lifestyle</span>
                </div>
                <h2 className="text-6xl md:text-8xl font-black text-white leading-[1] mb-8 tracking-tighter uppercase">
                  TU MEJOR <span className="text-[#8dc63f]">VERSIÓN.</span>
                </h2>
                <p className="text-xl text-gray-300 mb-12 leading-relaxed max-w-xl font-medium">
                  El gimnasio más completo de Vigo. Instalaciones de vanguardia, los mejores coaches y ahora, tu rutina personalizada con Inteligencia Artificial.
                </p>
                <div className="flex flex-col sm:flex-row gap-5">
                  <button onClick={() => {
                    const el = document.getElementById('planes');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }} className="bg-[#8dc63f] text-white px-12 py-5 rounded-2xl font-black text-xl shadow-2xl shadow-[#8dc63f]/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-4">
                    Inscribirme Ahora <ArrowRight className="w-6 h-6" />
                  </button>
                  <button onClick={() => setView('routine')} className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-12 py-5 rounded-2xl font-black text-xl hover:bg-white/20 transition-all flex items-center gap-3">
                    Probar IA Coach <BrainCircuit className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Membership Plans Section */}
          <section id="planes" className="py-32 bg-white relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 relative z-10">
               <div className="text-center max-w-2xl mx-auto mb-20">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#8dc63f]/10 rounded-full mb-6">
                     <CreditCard className="w-4 h-4 text-[#8dc63f]" />
                     <span className="text-[#8dc63f] font-black text-[10px] uppercase tracking-widest">Planes de Membresía</span>
                  </div>
                  <h2 className="text-5xl font-black text-gray-900 mb-6 tracking-tighter uppercase">Mensualidades</h2>
                  <p className="text-gray-500 text-lg font-medium">Elige el plan que mejor se adapte a tu estilo de vida y comienza tu transformación hoy mismo.</p>
               </div>

               <div className="grid lg:grid-cols-3 gap-10">
                  {MEMBERSHIPS.map((plan, idx) => (
                    <div key={plan.name} className={`relative flex flex-col p-10 rounded-[60px] border-4 transition-all hover:shadow-2xl hover:-translate-y-2 ${plan.color === 'bg-white' ? 'bg-white border-gray-100 shadow-xl' : 'bg-[#8dc63f]/5 border-[#8dc63f] shadow-2xl shadow-[#8dc63f]/20'}`}>
                       {idx === 1 && (
                         <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-900 text-white px-8 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">
                            Recomendado
                         </div>
                       )}
                       <h3 className="text-3xl font-black text-gray-900 mb-2 uppercase tracking-tight">{plan.name}</h3>
                       <div className="flex items-baseline gap-1 mb-10">
                          <span className="text-5xl font-black text-gray-900 tracking-tighter">{plan.price.split('€')[0]}</span>
                          <span className="text-xl font-black text-gray-400">€/mes</span>
                       </div>
                       
                       <ul className="space-y-6 mb-12 flex-1">
                          {plan.features.map(feature => (
                            <li key={feature} className="flex items-start gap-4 text-gray-600 font-bold text-sm">
                               <div className="w-6 h-6 bg-[#8dc63f] rounded-lg flex items-center justify-center shrink-0 mt-0.5 shadow-sm shadow-[#8dc63f]/30">
                                  <CheckCircle className="w-3.5 h-3.5 text-white" />
                               </div>
                               {feature}
                            </li>
                          ))}
                       </ul>

                       <button 
                         onClick={() => setShowEnrollmentModal({ plan: plan.name })}
                         className={`w-full py-6 rounded-3xl font-black text-xl transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3 ${idx === 1 ? 'bg-[#8dc63f] text-white hover:bg-[#7db137] shadow-[#8dc63f]/30' : 'bg-gray-900 text-white hover:bg-black shadow-gray-900/20'}`}
                       >
                          Darme de Alta <ArrowRight className="w-5 h-5" />
                       </button>
                    </div>
                  ))}
               </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="py-24 bg-gray-50">
            <div className="max-w-4xl mx-auto px-4">
               <div className="text-center mb-16">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#8dc63f]/10 rounded-full mb-6">
                     <MessageCircleQuestion className="w-4 h-4 text-[#8dc63f]" />
                     <span className="text-[#8dc63f] font-black text-[10px] uppercase tracking-widest">Soporte al Socio</span>
                  </div>
                  <h2 className="text-5xl font-black text-gray-900 mb-6 tracking-tighter uppercase">Preguntas Frecuentes</h2>
                  <p className="text-gray-500 text-lg font-medium">Resolvemos tus dudas para que solo te preocupes de entrenar.</p>
               </div>

               <div className="space-y-4">
                  {FAQ_DATA.map((item, index) => (
                    <div key={index} className="bg-white border-2 border-gray-100 rounded-[30px] overflow-hidden shadow-sm transition-all hover:border-[#8dc63f]/30">
                       <button 
                          onClick={() => setOpenFaq(openFaq === index ? null : index)}
                          className="w-full p-8 flex items-center justify-between text-left focus:outline-none"
                       >
                          <span className={`text-lg font-black tracking-tight transition-colors ${openFaq === index ? 'text-[#8dc63f]' : 'text-gray-900'}`}>{item.question}</span>
                          <ChevronDown className={`w-6 h-6 text-gray-400 transition-transform duration-300 ${openFaq === index ? 'rotate-180 text-[#8dc63f]' : ''}`} />
                       </button>
                       {openFaq === index && (
                          <div className="p-8 pt-0 text-gray-500 font-medium leading-relaxed animate-in slide-in-from-top duration-300">
                             {item.answer}
                          </div>
                       )}
                    </div>
                  ))}
               </div>
            </div>
          </section>
        </div>
      )}

      {view === 'centers' && (
        <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-12 animate-in slide-in-from-bottom duration-500">
           {selectedCenter ? (
              <div className="animate-in fade-in duration-500">
                 <button onClick={() => setSelectedCenter(null)} className="mb-12 flex items-center gap-3 text-gray-400 font-black uppercase tracking-widest hover:text-gray-900 transition-colors">
                    <ChevronLeft className="w-6 h-6" /> Volver a Centros
                 </button>

                 <div className="grid lg:grid-cols-12 gap-16">
                    <div className="lg:col-span-7 space-y-16">
                       <div>
                          <span className="text-[#8dc63f] font-black text-xs uppercase tracking-[0.4em] mb-4 block">Ficha del Centro</span>
                          <h2 className="text-6xl font-black tracking-tighter uppercase mb-6 leading-none">{selectedCenter.name}</h2>
                          <div className="flex items-center gap-3 text-gray-500 font-bold mb-8">
                             <MapPin className="w-5 h-5 text-[#8dc63f]" /> {selectedCenter.address}
                          </div>
                          <p className="text-xl text-gray-600 leading-relaxed font-medium">{selectedCenter.description}</p>
                       </div>

                       {/* Instalaciones Propias del Centro */}
                       <div className="bg-gray-900 p-12 rounded-[60px] text-white">
                          <h3 className="text-4xl font-black tracking-tighter uppercase mb-10 text-white">Instalaciones <span className="text-[#8dc63f]">Elite</span></h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                             {selectedCenter.features.map(f => (
                               <div key={f} className="p-6 bg-white/5 rounded-[30px] border border-white/10 flex items-center gap-6 group hover:bg-[#8dc63f] hover:border-[#8dc63f] transition-all">
                                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-[#8dc63f] group-hover:text-white group-hover:bg-white/20 transition-all">
                                     {getFeatureIcon(f)}
                                  </div>
                                  <p className="font-black text-sm text-white/90 uppercase tracking-tight group-hover:text-white">{f}</p>
                               </div>
                             ))}
                          </div>
                       </div>
                       
                       <div>
                          <h3 className="text-3xl font-black tracking-tighter uppercase mb-8">Galería Multimedia</h3>
                          <div className="grid grid-cols-2 gap-6">
                             {selectedCenter.gallery.map((img, i) => (
                                <img key={i} src={img} className="rounded-[40px] h-64 w-full object-cover shadow-xl hover:scale-[1.02] transition-transform cursor-pointer" alt="Instalaciones" />
                             ))}
                          </div>
                       </div>
                    </div>

                    <div className="lg:col-span-5">
                       <div className="sticky top-24 space-y-8">
                          <div className="rounded-[60px] overflow-hidden shadow-2xl border-4 border-gray-100 relative h-[500px]">
                             <img src={selectedCenter.mainImage} className="w-full h-full object-cover" />
                             <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                             <div className="absolute bottom-10 left-10">
                                <span className="bg-[#8dc63f] px-6 py-2 rounded-full text-white font-black text-xs uppercase tracking-widest">{selectedCenter.highlight}</span>
                             </div>
                          </div>
                          <button onClick={() => setView('schedule')} className="w-full py-6 bg-gray-900 text-white rounded-[30px] font-black text-2xl hover:bg-[#8dc63f] transition-all shadow-xl active:scale-95">Ver Horarios de {selectedCenter.name.split(' ').pop()}</button>
                       </div>
                    </div>
                 </div>
              </div>
           ) : (
              <div className="space-y-20">
                 <div className="text-center max-w-2xl mx-auto">
                    <h2 className="text-5xl font-black text-gray-900 mb-6 tracking-tighter uppercase">Nuestros Centros</h2>
                    <p className="text-gray-500 text-lg font-medium">Contamos con 3 centros en Vigo. Pulsa en cada uno para descubrir sus instalaciones específicas y tours virtuales.</p>
                 </div>
                 <div className="grid md:grid-cols-3 gap-10">
                    {CENTERS.map(center => (
                       <div key={center.id} onClick={() => setSelectedCenter(center)} className="group bg-white border-4 border-gray-100 rounded-[60px] overflow-hidden hover:shadow-2xl transition-all cursor-pointer">
                          <div className="h-64 relative overflow-hidden">
                             <img src={center.mainImage} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                             <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                          </div>
                          <div className="p-10">
                             <h3 className="text-3xl font-black text-gray-900 mb-2 uppercase tracking-tight">{center.name}</h3>
                             <p className="text-gray-400 font-bold text-xs mb-6 uppercase tracking-widest">{center.highlight}</p>
                             <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                                <span className="font-black text-[#8dc63f] text-xs uppercase tracking-widest">Descubrir Instalaciones</span>
                                <div className="w-10 h-10 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-[#8dc63f] group-hover:text-white transition-all"><ArrowRight className="w-5 h-5" /></div>
                             </div>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
           )}
        </main>
      )}

      {/* Trainers View */}
      {view === 'trainers' && (
        <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-12 animate-in slide-in-from-bottom duration-500">
           <div className="text-center max-w-2xl mx-auto mb-20">
              <div className="inline-flex items-center gap-3 mb-6">
                <div className="w-12 h-1 bg-[#8dc63f] rounded-full"></div>
                <span className="text-[#8dc63f] font-black text-xs uppercase tracking-[0.4em]">Elite Team</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 tracking-tighter uppercase">Conoce a tus Coaches</h2>
              <p className="text-gray-500 text-lg font-medium leading-relaxed">
                Expertos dedicados a maximizar tu rendimiento. Elige al mentor que mejor se adapte a tu estilo de entrenamiento.
              </p>
           </div>

           <div className="grid md:grid-cols-2 gap-12">
              {MONITORS.map(trainer => (
                <div key={trainer.id} className="bg-white border-4 border-gray-50 rounded-[60px] overflow-hidden flex flex-col lg:flex-row shadow-xl hover:shadow-2xl transition-all group relative">
                   <div className="lg:w-[45%] relative overflow-hidden h-[450px] lg:h-auto">
                      <img 
                        src={trainer.image} 
                        className="w-full h-full object-cover transition-transform duration-[1500ms] group-hover:scale-110 grayscale-[10%] group-hover:grayscale-0" 
                        alt={trainer.name} 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                      <div className="absolute top-8 left-8">
                         <div className="bg-[#8dc63f] px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white flex items-center gap-2 shadow-2xl">
                            <Star className="w-4 h-4 fill-current" /> Máis que Auga Coach
                         </div>
                      </div>
                   </div>

                   <div className="lg:w-[55%] p-12 flex flex-col justify-between bg-white relative">
                      <div className="absolute top-12 right-12 text-gray-100 opacity-30 hidden lg:block">
                        <Quote className="w-20 h-20" />
                      </div>
                      
                      <div className="relative z-10">
                        <span className="text-[#8dc63f] font-black text-[10px] uppercase tracking-[0.3em] mb-2 block">Personal Trainer</span>
                        <h3 className="text-4xl font-black text-gray-900 mb-2 tracking-tight group-hover:text-[#8dc63f] transition-colors">{trainer.name}</h3>
                        <p className="text-gray-400 font-bold text-sm mb-8 uppercase tracking-widest border-b border-gray-50 pb-4">{trainer.role}</p>
                        
                        <div className="flex flex-wrap gap-2 mb-10">
                           {trainer.specialties.map(spec => (
                             <span key={spec} className="px-3 py-1 bg-gray-50 text-gray-500 text-[9px] font-black uppercase tracking-widest rounded-xl border border-gray-100 group-hover:bg-[#8dc63f]/5 group-hover:border-[#8dc63f]/20 transition-all">
                                {spec}
                             </span>
                           ))}
                        </div>

                        <div className="relative mb-8">
                           <p className="text-gray-500 text-sm leading-relaxed italic pl-6 border-l-4 border-[#8dc63f]">
                             "{trainer.description}"
                           </p>
                        </div>
                      </div>

                      <div className="pt-8 border-t border-gray-50">
                        <button 
                          onClick={() => setSelectedTrainer(trainer)} 
                          className="w-full py-6 bg-gray-900 text-white rounded-[30px] font-black text-xl hover:bg-[#8dc63f] transition-all flex items-center justify-center gap-4 shadow-2xl hover:shadow-[#8dc63f]/30 active:scale-95 group/btn"
                        >
                          Ver Disponibilidad 
                          <ArrowRight className="w-6 h-6 group-hover/btn:translate-x-2 transition-transform" />
                        </button>
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </main>
      )}

      {/* Routine View */}
      {view === 'routine' && (
        <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-12 animate-in slide-in-from-bottom duration-500">
          {!user ? (
            <div className="text-center py-24 bg-gray-50 rounded-[60px] border-4 border-dashed border-gray-200">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
                 <UserCheck className="w-12 h-12 text-[#8dc63f]" />
              </div>
              <h3 className="text-4xl font-black text-gray-900 mb-4 tracking-tighter uppercase">Para socios MA</h3>
              <p className="text-gray-500 mb-12 max-w-sm mx-auto font-medium">Inscríbete o inicia sesión para acceder al generador de rutinas inteligente de Máis que Auga.</p>
              <button onClick={() => setShowEnrollmentModal({ plan: 'Plan Básico' })} className="bg-[#8dc63f] text-white px-12 py-5 rounded-2xl font-black text-xl shadow-xl shadow-[#8dc63f]/30">Darse de Alta</button>
            </div>
          ) : (
            <div className="space-y-12">
               <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div>
                    <h2 className="text-5xl font-black text-gray-900 mb-2 tracking-tighter uppercase">IA COACH</h2>
                    <p className="text-gray-500 text-lg font-medium">Tu plan integral con máquinas y clases dirigidas.</p>
                  </div>
                  {user.routine && (
                    <button onClick={() => { setUser({ ...user, routine: undefined }); setSelectedGoal(null); }} className="text-red-500 font-black text-xs uppercase tracking-widest flex items-center gap-2 px-4 py-2 bg-red-50 rounded-xl">
                      <X className="w-4 h-4" /> Resetear Plan
                    </button>
                  )}
               </div>

               {!user.routine ? (
                 <div className="space-y-12">
                    <h3 className="text-2xl font-black text-gray-800 uppercase tracking-tighter">1. Selecciona tu Objetivo Principal</h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                       {FITNESS_GOALS.map(goal => (
                         <button 
                           key={goal.id} 
                           onClick={() => setSelectedGoal(goal.id)}
                           className={`p-8 rounded-[40px] border-4 text-left transition-all group ${
                             selectedGoal === goal.id 
                             ? 'bg-[#8dc63f] border-[#8dc63f] text-white shadow-2xl shadow-[#8dc63f]/30 -translate-y-2' 
                             : 'bg-white border-gray-100 hover:border-gray-200 hover:bg-gray-50 shadow-sm'
                           }`}
                         >
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-colors ${selectedGoal === goal.id ? 'bg-white/20' : 'bg-[#8dc63f]/10 text-[#8dc63f]'}`}>
                               {renderIcon(goal.icon, "w-8 h-8")}
                            </div>
                            <h4 className="text-xl font-black mb-2 uppercase leading-tight">{goal.title}</h4>
                            <p className={`text-sm font-medium leading-relaxed ${selectedGoal === goal.id ? 'text-white/80' : 'text-gray-400'}`}>{goal.description}</p>
                         </button>
                       ))}
                    </div>

                    <div className="flex justify-center pt-8">
                       <button 
                        disabled={!selectedGoal || isGenerating}
                        onClick={generateRoutine}
                        className={`group px-16 py-6 rounded-3xl font-black text-2xl transition-all shadow-2xl flex items-center gap-4 ${
                          !selectedGoal || isGenerating 
                          ? 'bg-gray-100 text-gray-300 cursor-not-allowed shadow-none' 
                          : 'bg-gray-900 text-white hover:bg-[#8dc63f] shadow-gray-900/20 active:scale-95'
                        }`}
                       >
                         {isGenerating ? (
                           <>
                             <Loader2 className="w-8 h-8 animate-spin" /> {generationMessages[generationStep]}
                           </>
                         ) : (
                           <>
                             Generar mi Rutina Visual <ArrowRight className="w-8 h-8 group-hover/btn:translate-x-2 transition-transform" />
                           </>
                         )}
                       </button>
                    </div>
                 </div>
               ) : (
                 <div className="animate-in slide-in-from-bottom duration-700">
                    <div className="bg-gray-900 rounded-[60px] p-12 text-white shadow-2xl mb-12 relative overflow-hidden">
                       <div className="absolute top-0 right-0 p-16 opacity-10"><BrainCircuit className="w-64 h-64" /></div>
                       <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center">
                          <div className="w-32 h-32 bg-[#8dc63f] rounded-[40px] flex items-center justify-center shrink-0 shadow-2xl">
                             <Trophy className="w-16 h-16 text-white" />
                          </div>
                          <div>
                             <p className="text-[#8dc63f] font-black uppercase text-xs tracking-[0.5em] mb-4">Plan Semanal Estructurado</p>
                             <h3 className="text-5xl font-black tracking-tighter uppercase mb-2">Plan {user.routine.planName}</h3>
                             <p className="text-white/50 text-lg font-medium">Combinación perfecta de máquinas de fuerza y clases dirigidas.</p>
                          </div>
                       </div>
                    </div>

                    <div className="space-y-16">
                       {user.routine.days.map((day, dIdx) => (
                         <div key={dIdx} className="space-y-8">
                            <div className="flex items-center gap-6">
                               <div className="h-12 w-2 bg-[#8dc63f] rounded-full"></div>
                               <h4 className="text-4xl font-black uppercase tracking-tighter m-0">{day.dayName} · <span className="text-gray-400">{day.focus}</span></h4>
                            </div>
                            
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                               {day.activities.map((activity, aIdx) => (
                                 <div key={aIdx} className="bg-white rounded-[40px] border-2 border-gray-100 overflow-hidden group hover:border-[#8dc63f] transition-all hover:shadow-2xl">
                                    <div className="h-48 relative overflow-hidden">
                                       <img src={getActivityImage(activity)} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={activity.title} />
                                       <div className="absolute top-4 right-4 px-3 py-1 bg-black/50 backdrop-blur-md rounded-full text-white text-[10px] font-black uppercase tracking-widest">
                                          {activity.type}
                                       </div>
                                    </div>
                                    <div className="p-8">
                                       <h5 className="text-xl font-black uppercase mb-3 text-gray-900 leading-tight">{activity.title}</h5>
                                       <p className="text-gray-500 text-sm font-medium mb-6 leading-relaxed line-clamp-3">{activity.description}</p>
                                       
                                       {(activity.sets || activity.reps) && (
                                          <div className="flex gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                             {activity.sets && (
                                               <div className="flex-1 text-center border-r border-gray-200">
                                                  <span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Series</span>
                                                  <span className="text-lg font-black text-[#8dc63f]">{activity.sets}</span>
                                               </div>
                                             )}
                                             {activity.reps && (
                                               <div className="flex-1 text-center">
                                                  <span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Reps</span>
                                                  <span className="text-lg font-black text-[#8dc63f]">{activity.reps}</span>
                                               </div>
                                             )}
                                          </div>
                                       )}
                                       
                                       {activity.machineName && (
                                          <div className="mt-4 flex items-center gap-3 text-[#8dc63f] font-black text-[10px] uppercase tracking-widest">
                                             <Layout className="w-4 h-4" /> Máquina: {activity.machineName}
                                          </div>
                                       )}
                                    </div>
                                 </div>
                               ))}
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>
               )}
            </div>
          )}
        </main>
      )}

      {/* Schedule View */}
      {view === 'schedule' && (
        <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-12 animate-in slide-in-from-bottom duration-500">
           <div className="mb-12">
              <h2 className="text-5xl font-black text-gray-900 mb-3 tracking-tighter uppercase">Horario de Actividades</h2>
              <p className="text-gray-500 text-lg font-medium">Reserva tu plaza en cualquiera de nuestras clases dirigidas en Vigo.</p>
           </div>

           {/* Filtros de Categoría */}
           <div className="flex flex-wrap gap-4 mb-12">
              <button onClick={() => setSelectedCategory('all')} className={`px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest transition-all ${selectedCategory === 'all' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}>Todos</button>
              {Object.values(Category).map(cat => (
                <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest transition-all ${selectedCategory === cat ? 'bg-[#8dc63f] text-white' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}>{cat}</button>
              ))}
           </div>

           <div className="overflow-x-auto rounded-[50px] border-4 border-gray-100 shadow-2xl bg-white hidden lg:block custom-scrollbar">
              <table className="w-full text-left border-collapse min-w-[1100px]">
                <thead>
                  <tr className="bg-gray-900 text-white">
                    <th className="p-8 text-[10px] font-black uppercase tracking-[0.5em] w-32">Hora</th>
                    {DAYS.map(day => <th key={day} className="p-8 text-sm font-black uppercase tracking-widest text-center">{day}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {HOURS.map(hour => (
                    <tr key={hour} className="border-b border-gray-50 group hover:bg-gray-50/50">
                      <td className="p-8 font-black text-gray-200 text-xl align-top group-hover:text-[#8dc63f]">{hour}</td>
                      {DAYS.map(day => {
                        const cls = filteredClasses.find(c => c.day === day && c.hour === hour);
                        const isBooked = cls ? bookings.some(b => b.classId === cls.id) : false;
                        return (
                          <td key={`${day}-${hour}`} className="p-3 border-l border-gray-50 align-top min-w-[180px]">
                            {cls ? (
                              <button onClick={() => setSelectedClass(cls)} className={`w-full p-6 rounded-[30px] border-2 transition-all flex flex-col gap-4 shadow-sm ${isBooked ? 'bg-[#8dc63f]/10 border-[#8dc63f]/30' : `${CATEGORY_COLORS[cls.category]} hover:scale-[1.05] hover:shadow-2xl`}`}>
                                <h4 className="font-black text-xs leading-tight uppercase tracking-wider text-left">{cls.name}</h4>
                                <div className="flex items-center gap-3 text-[10px] font-bold opacity-60"><User className="w-4 h-4" /> {cls.instructor}</div>
                              </button>
                            ) : <div className="h-32 rounded-3xl bg-gray-50/30 border-2 border-dashed border-gray-200/50"></div>}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
           </div>
        </main>
      )}

      {/* Profile view */}
      {view === 'profile' && user && (
        <main className="flex-1 max-w-6xl mx-auto w-full p-4 md:p-12 animate-in slide-in-from-right duration-500">
           <div className="grid lg:grid-cols-12 gap-10">
              <div className="lg:col-span-4 space-y-10">
                 <div className="bg-gray-900 rounded-[50px] p-10 text-white shadow-2xl relative">
                    <div className="relative z-10">
                       <p className="text-[10px] font-black text-[#8dc63f] uppercase tracking-[0.4em] mb-3">Socio {user.plan}</p>
                       <h3 className="text-4xl font-black mb-1">{user.name}</h3>
                       <p className="text-white/40 font-mono tracking-tighter text-sm mb-12 uppercase">{user.memberId}</p>
                       <div className="flex flex-col gap-4 pt-6">
                          <button onClick={() => setView('routine')} className="bg-[#8dc63f] text-white px-6 py-4 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg">
                             Mi Rutina IA <BrainCircuit className="w-4 h-4" />
                          </button>
                          <button onClick={() => {setUser(null); setView('home');}} className="px-6 py-4 bg-white/10 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-white/20 transition-all flex items-center justify-center gap-2">
                             Cerrar Sesión <LogOut className="w-4 h-4" />
                          </button>
                       </div>
                    </div>
                 </div>
              </div>
              <div className="lg:col-span-8 space-y-12">
                 <h3 className="text-5xl font-black tracking-tighter uppercase">Mis Reservas</h3>
                 {sortedBookings.length > 0 ? (
                    <div className="grid gap-6">
                       {sortedBookings.map(({ booking, details }) => (
                          <div key={booking.id} className="p-8 rounded-[40px] border-4 flex justify-between items-center gap-8 shadow-xl bg-white border-gray-50 hover:border-[#8dc63f]/20 transition-all">
                             <div className="flex gap-8 items-center">
                                <div className="w-20 h-20 rounded-3xl bg-gray-100 flex items-center justify-center shrink-0">
                                   <Dumbbell className="w-10 h-10 text-gray-300" />
                                </div>
                                <div>
                                   <div className="flex items-center gap-3 mb-2">
                                      <span className="font-black text-sm uppercase tracking-widest text-[#8dc63f]">{details?.day} · {details?.hour}</span>
                                   </div>
                                   <h4 className="text-3xl font-black leading-none uppercase tracking-tight">{details?.name}</h4>
                                   <p className="font-bold text-gray-400 uppercase text-xs tracking-widest mt-1">{details?.instructor}</p>
                                </div>
                             </div>
                             <button onClick={() => setBookings(prev => prev.filter(b => b.id !== booking.id))} className="px-8 py-4 bg-red-50 text-red-500 rounded-2xl font-black text-xs uppercase hover:bg-red-500 hover:text-white transition-all">Cancelar</button>
                          </div>
                       ))}
                    </div>
                 ) : (
                    <div className="text-center py-32 bg-gray-50 rounded-[60px] border-4 border-dashed border-gray-200">
                       <Calendar className="w-12 h-12 text-[#8dc63f] mx-auto mb-8" />
                       <h3 className="text-3xl font-black text-gray-900 mb-4 uppercase">Sin Reservas</h3>
                       <button onClick={() => setView('schedule')} className="bg-[#8dc63f] text-white px-10 py-5 rounded-2xl font-black text-lg shadow-xl shadow-[#8dc63f]/20">Ver Horarios</button>
                    </div>
                 )}
              </div>
           </div>
        </main>
      )}

      {/* Modals & Popups */}
      {selectedTrainer && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/90 backdrop-blur-xl" onClick={() => setSelectedTrainer(null)}></div>
          <div className="relative bg-white w-full max-w-4xl rounded-[60px] overflow-hidden shadow-2xl animate-in zoom-in duration-300">
            <div className="flex flex-col lg:flex-row">
               <div className="lg:w-1/3 bg-gray-900 p-12 text-white flex flex-col items-center justify-center">
                  <div className="w-48 h-48 rounded-[60px] overflow-hidden border-4 border-[#8dc63f] mb-8 shadow-2xl">
                     <img src={selectedTrainer.image} className="w-full h-full object-cover" />
                  </div>
                  <h3 className="text-3xl font-black text-center mb-2 leading-none uppercase tracking-tighter">{selectedTrainer.name}</h3>
                  <p className="text-[#8dc63f] font-bold text-xs uppercase tracking-widest mb-6">{selectedTrainer.role}</p>
               </div>
               <div className="lg:w-2/3 p-12">
                  <div className="flex justify-between items-center mb-10 pb-6 border-b border-gray-100">
                     <h4 className="text-3xl font-black uppercase tracking-tighter">Agenda tu Sesión PT</h4>
                     <button onClick={() => setSelectedTrainer(null)} className="p-3 bg-gray-50 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors"><X className="w-6 h-6" /></button>
                  </div>
                  <div className="space-y-8 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
                     {Object.entries(PT_AVAILABILITY[selectedTrainer.id] || {}).map(([day, slots]) => (
                        <div key={day} className="space-y-4">
                           <div className="flex items-center gap-3">
                              <Calendar className="w-4 h-4 text-[#8dc63f]" />
                              <p className="font-black text-xs uppercase tracking-[0.3em] text-gray-400">{day}</p>
                           </div>
                           <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                              {slots.map(slot => (
                                 <button key={slot} onClick={() => {
                                    if(!user) { alert("Debes ser socio."); setShowEnrollmentModal({plan: 'Premium'}); return; }
                                    setBookings(prev => [...prev, { id: Math.random().toString(36).substr(2, 9), classId: `PT-${slot}`, timestamp: Date.now(), type: 'pt', trainerId: selectedTrainer.id, day, hour: slot }]);
                                    setSelectedTrainer(null);
                                 }} className="px-4 py-3 rounded-2xl font-black text-sm transition-all border-2 bg-white border-gray-100 hover:border-[#8dc63f] hover:bg-[#8dc63f] hover:text-white flex items-center justify-center gap-2 group/slot">
                                    <Clock className="w-3 h-3 opacity-40 group-hover/slot:opacity-100" /> {slot}
                                 </button>
                              ))}
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
          </div>
        </div>
      )}

      {showEnrollmentModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/90 backdrop-blur-xl" onClick={() => setShowEnrollmentModal(null)}></div>
          <div className="relative bg-white w-full max-w-xl rounded-[60px] overflow-hidden shadow-2xl animate-in zoom-in duration-300">
            <div className="bg-gray-900 p-12 text-white relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#8dc63f] rounded-full opacity-20 blur-3xl"></div>
              <h3 className="text-5xl font-black mb-4 tracking-tighter uppercase leading-none relative z-10">Inscripción <span className="text-[#8dc63f]">Máis.</span></h3>
              <p className="text-white/40 font-bold uppercase tracking-widest text-[10px] relative z-10">Plan: {showEnrollmentModal.plan}</p>
            </div>
            <form onSubmit={handleEnrollment} className="p-12 space-y-6">
              <input name="name" type="text" placeholder="Nombre completo" required className="w-full px-8 py-5 bg-gray-50 border-2 border-transparent focus:border-[#8dc63f] rounded-2xl outline-none font-bold transition-all shadow-inner" />
              <input name="email" type="email" placeholder="Email" required className="w-full px-8 py-5 bg-gray-50 border-2 border-transparent focus:border-[#8dc63f] rounded-2xl outline-none font-bold transition-all shadow-inner" />
              <input name="dni" type="text" placeholder="DNI / NIE" required className="w-full px-8 py-5 bg-gray-50 border-2 border-transparent focus:border-[#8dc63f] rounded-2xl outline-none font-bold transition-all shadow-inner" />
              <div className="pt-4">
                <button type="submit" className="w-full py-6 bg-[#8dc63f] text-white rounded-3xl font-black text-2xl shadow-xl shadow-[#8dc63f]/30 hover:bg-[#7db137] transition-all transform active:scale-95">Completar Inscripción</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedClass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-md" onClick={() => setSelectedClass(null)}></div>
          <div className="relative bg-white w-full max-w-xl rounded-[60px] overflow-hidden shadow-2xl animate-in zoom-in duration-300">
            <div className={`p-12 ${CATEGORY_COLORS[selectedClass.category]}`}>
              <h3 className="text-5xl font-black mb-2 leading-none tracking-tighter uppercase">{selectedClass.name}</h3>
              <p className="font-bold opacity-60 uppercase text-sm tracking-widest">{selectedClass.day} {selectedClass.hour}</p>
            </div>
            <div className="p-12 space-y-4">
              <div className="flex items-center gap-3 text-gray-500 font-bold uppercase text-xs tracking-widest">
                 <User className="w-4 h-4 text-[#8dc63f]" /> Monitor: {selectedClass.instructor}
              </div>
              <div className="flex items-center gap-3 text-gray-500 font-bold uppercase text-xs tracking-widest">
                 <Building2 className="w-4 h-4 text-[#8dc63f]" /> Sala: {selectedClass.room}
              </div>
              <button onClick={() => handleBooking(selectedClass)} className="w-full py-6 bg-[#8dc63f] text-white rounded-3xl font-black text-2xl shadow-xl shadow-[#8dc63f]/30 hover:bg-[#7db137] transition-all mt-4 transform active:scale-95">Reservar Plaza</button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white pt-24 pb-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20 mb-20">
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-[#8dc63f] rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg">MA</div>
                <h1 className="text-3xl font-black tracking-tighter">máis<span className="text-[#8dc63f]">que</span>auga</h1>
              </div>
              <p className="text-gray-400 font-medium text-sm leading-relaxed">Entrenamiento inteligente y comunidad deportiva en el corazón de Vigo. Tu mejor versión empieza aquí.</p>
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center hover:bg-[#8dc63f] transition-all cursor-pointer"><Instagram className="w-5 h-5" /></div>
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center hover:bg-[#8dc63f] transition-all cursor-pointer"><Facebook className="w-5 h-5" /></div>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-black mb-10 uppercase tracking-[0.3em] text-[#8dc63f]">Centros</h4>
              <ul className="space-y-4 text-gray-400 font-bold text-xs uppercase tracking-widest">
                {CENTERS.map(c => <li key={c.id} className="hover:text-white cursor-pointer transition-colors" onClick={() => {setSelectedCenter(c); setView('centers');}}>{c.name.split(' ').pop()}</li>)}
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-black mb-10 uppercase tracking-[0.3em] text-[#8dc63f]">Contacto</h4>
              <ul className="space-y-6 text-gray-400 font-medium">
                <li className="flex gap-4 items-center"><MapPin className="w-5 h-5 text-[#8dc63f] shrink-0" /> Vigo, Galicia</li>
                <li className="flex gap-4 items-center"><Mail className="w-5 h-5 text-[#8dc63f] shrink-0" /> contacto@maisqueauga.gal</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/5 pt-12 text-center text-gray-600 text-[10px] font-black uppercase tracking-[0.5em]">
            © 2024 Máis que Auga · Vigo · IA Powered Wellness.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
