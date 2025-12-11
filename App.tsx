import React, { useState, useEffect, useMemo } from 'react';
import { 
  BookOpen, 
  Home, 
  Search, 
  Info, 
  ChevronRight, 
  ArrowLeft, 
  FileText, 
  Video, 
  Download, 
  Clock, 
  Book, 
  PenTool,
  GraduationCap,
  PlayCircle,
  MoreVertical,
  X,
  Github,
  Linkedin,
  Twitter,
  Mail,
  ExternalLink,
  Heart
} from 'lucide-react';
import { data } from './data';
import { Subject, Resource, Year, Semester } from './types';
import { App as CapacitorApp } from '@capacitor/app';
import { StatusBar, Style } from '@capacitor/status-bar';

// --- Components ---

// 1. Splash Screen
const SplashScreen = ({ onFinish }: { onFinish: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onFinish, 2500);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center animate-fade-in">
      <div className="w-24 h-24 bg-surfaceHighlight rounded-2xl flex items-center justify-center mb-6 shadow-2xl border border-white/10">
        <GraduationCap size={48} className="text-white" />
      </div>
      <h1 className="text-3xl font-bold tracking-tight text-white mb-2">BrainSync</h1>
      <p className="text-gray-400 text-sm">Your Engineering Companion</p>
      <div className="mt-8 flex gap-2">
         <div className="w-2 h-2 rounded-full bg-white animate-bounce" style={{ animationDelay: '0s' }} />
         <div className="w-2 h-2 rounded-full bg-white animate-bounce" style={{ animationDelay: '0.2s' }} />
         <div className="w-2 h-2 rounded-full bg-white animate-bounce" style={{ animationDelay: '0.4s' }} />
      </div>
    </div>
  );
};

// 2. Onboarding Screen
const Onboarding = ({ onFinish }: { onFinish: () => void }) => {
  const [slide, setSlide] = useState(0);

  const slides = [
    {
      title: "All Resources in One Place",
      desc: "Access Notes, Assignments, PYQs, and Videos organized by subject and semester.",
      icon: <BookOpen size={64} className="text-blue-400" />
    },
    {
      title: "Previous Year Questions",
      desc: "Practice with a vast collection of PYQs to ace your exams effortlessly.",
      icon: <FileText size={64} className="text-purple-400" />
    },
    {
      title: "Video Lectures",
      desc: "Watch curated YouTube video lectures for every topic in your syllabus.",
      icon: <Video size={64} className="text-red-400" />
    }
  ];

  const handleNext = () => {
    if (slide < slides.length - 1) {
      setSlide(slide + 1);
    } else {
      onFinish();
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-40 flex flex-col text-white">
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <div className="mb-8 p-8 bg-surfaceHighlight rounded-full shadow-2xl">
          {slides[slide].icon}
        </div>
        <h2 className="text-2xl font-bold mb-4">{slides[slide].title}</h2>
        <p className="text-gray-400 leading-relaxed mb-8">{slides[slide].desc}</p>
        
        {/* Progress indicator - moved up after hero text */}
        <div className="flex gap-2 mb-8">
          {slides.map((_, i) => (
            <div 
              key={i} 
              className={`h-2 rounded-full transition-all duration-300 ${i === slide ? 'w-8 bg-white' : 'w-2 bg-gray-700'}`} 
            />
          ))}
        </div>
        
        {/* Next button - moved up and made smaller */}
        <button 
          onClick={handleNext}
          className="bg-white text-black font-semibold px-8 py-3 rounded-xl shadow-lg active:scale-95 transition-transform"
        >
          {slide === slides.length - 1 ? "Get Started" : "Next"}
        </button>
      </div>
      
      {/* Safe area bottom padding */}
      <div className="pb-safe-bottom" />
    </div>
  );
};

// 3. Reusable Components
const Card = ({ children, className = "", onClick, ...props }: { 
  children: React.ReactNode, 
  className?: string, 
  onClick?: () => void 
} & React.HTMLAttributes<HTMLDivElement>) => (
  <div 
    {...props}
    onClick={onClick}
    className={`bg-surfaceHighlight rounded-2xl p-4 border border-white/5 shadow-md active:opacity-90 transition-opacity ${className}`}
  >
    {children}
  </div>
);

const Chip = ({ label, active, onClick, ...props }: { 
  label: string, 
  active: boolean, 
  onClick: () => void 
} & React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    {...props}
    onClick={onClick}
    className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
      active 
        ? 'bg-white text-black shadow-lg scale-105' 
        : 'bg-surfaceHighlight text-gray-400 border border-white/10 hover:bg-white/5'
    }`}
  >
    {label}
  </button>
);

// --- Screens ---

// 1. Home Screen
const HomeScreen = ({ 
  onSubjectClick, 
  selectedYear, 
  setSelectedYear,
  activeView,
  setActiveView,
  searchVisible,
  setSearchVisible,
  searchQuery,
  setSearchQuery
}: { 
  onSubjectClick: (s: Subject) => void,
  selectedYear: string,
  setSelectedYear: (id: string) => void,
  activeView: View,
  setActiveView: (view: View) => void,
  searchVisible: boolean,
  setSearchVisible: (visible: boolean) => void,
  searchQuery: string,
  setSearchQuery: (query: string) => void
}) => {
  const currentYearData = data.years.find(y => y.id === selectedYear) || data.years[0];

  // Search logic (adapted from SearchScreen)
  const searchResults = useMemo(() => {
    if (!searchQuery) return [];
    const allSubjects: Subject[] = [];
    data.years.forEach(y => y.semesters.forEach(s => allSubjects.push(...s.subjects)));
    return allSubjects.filter(s => 
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      s.code.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <div className="h-full overflow-y-auto native-scroll">
      <div className="pb-32 px-4 pt-safe-top animate-fade-in">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 pt-4">
          <div>
            <h1 className="text-2xl font-bold">BrainSync</h1>
            <p className="text-gray-400 text-sm mt-1">Ready to learn something new?</p>
          </div>
          <div className="flex items-center gap-2">
            {!searchVisible && activeView === View.HOME && (
              <button 
                onClick={() => setActiveView(View.PROFILE)}
                className="w-10 h-10 bg-surfaceHighlight rounded-full flex items-center justify-center border border-white/10 hover:bg-white/5 transition-colors"
              >
                <Info size={18} className="text-white" />
              </button>
            )}
            {activeView === View.PROFILE && (
              <button 
                onClick={() => setActiveView(View.HOME)}
                className="w-10 h-10 bg-surfaceHighlight rounded-full flex items-center justify-center border border-white/10 hover:bg-white/5 transition-colors"
              >
                <Home size={18} className="text-white" />
              </button>
            )}
            {activeView === View.HOME && (
              <button 
                onClick={() => {
                  setSearchVisible(!searchVisible);
                  if (searchVisible) setSearchQuery(''); // Clear search when closing
                }}
                className="w-10 h-10 bg-surfaceHighlight rounded-full flex items-center justify-center border border-white/10 hover:bg-white/5 transition-colors"
              >
                {searchVisible ? <X size={20} className="text-white" /> : <Search size={20} className="text-white" />}
              </button>
            )}
          </div>
        </div>

        {/* Search Input - appears when search is toggled */}
        {searchVisible && (
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search subjects, codes..." 
              className="w-full bg-surfaceHighlight text-white pl-12 pr-12 py-4 rounded-xl focus:outline-none focus:ring-1 focus:ring-gray-600 placeholder-gray-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <X size={16} />
              </button>
            )}
          </div>
        )}

      {/* Main Content - Search Results or Normal Home Content */}
      {searchVisible && searchQuery ? (
        // Search Results
        <div className="space-y-4">
          {searchResults.length === 0 ? (
            <div className="text-center text-gray-500 mt-12">
              No subjects found for "{searchQuery}"
            </div>
          ) : (
            <>
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-white rounded-full block"></span>
                Search Results ({searchResults.length})
              </h2>
              {searchResults.map(subject => (
                <Card key={subject.id} onClick={() => onSubjectClick(subject)} className="flex items-center justify-between group cursor-pointer hover:bg-white/5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gray-800 flex items-center justify-center text-xl font-bold text-gray-300 group-hover:bg-white group-hover:text-black transition-colors">
                      {subject.title.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm line-clamp-1">{subject.title}</h3>
                      <p className="text-xs text-gray-500 mt-1">{subject.code} • {subject.credits} Credits</p>
                    </div>
                  </div>
                  <ChevronRight size={20} className="text-gray-600 group-hover:text-white transition-colors" />
                </Card>
              ))}
            </>
          )}
        </div>
      ) : (
        // Normal Home Content
        <>
          {/* Categories / Year Selector */}
          {!searchVisible && (
            <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar mb-4">
              {data.years.map(year => (
                <Chip 
                  key={year.id} 
                  label={year.title} 
                  active={selectedYear === year.id}
                  onClick={() => setSelectedYear(year.id)} 
                />
              ))}
            </div>
          )}

          {/* Quick Stats or Promo */}
          <Card className="mb-8 bg-gradient-to-br from-gray-800 to-gray-900 !border-0 relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-lg font-bold mb-1">Semester Exams?</h3>
              <p className="text-gray-300 text-sm mb-4">Check out the latest PYQ papers to boost your preparation.</p>
              <button className="bg-white text-black px-4 py-2 rounded-lg text-sm font-semibold">View Papers</button>
            </div>
            <div className="absolute right-[-20px] bottom-[-20px] opacity-10 rotate-12">
               <FileText size={120} />
            </div>
          </Card>

          {/* Subjects List */}
          {currentYearData.semesters.map(sem => (
            <div key={sem.id} className="mb-8">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-white rounded-full block"></span>
                {sem.title}
              </h2>
              <div className="grid grid-cols-1 gap-4">
                {sem.subjects.map(subject => (
                  <Card key={subject.id} onClick={() => onSubjectClick(subject)} className="flex items-center justify-between group cursor-pointer hover:bg-white/5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gray-800 flex items-center justify-center text-xl font-bold text-gray-300 group-hover:bg-white group-hover:text-black transition-colors">
                        {subject.title.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm line-clamp-1">{subject.title}</h3>
                        <p className="text-xs text-gray-500 mt-1">{subject.code} • {subject.credits} Credits</p>
                      </div>
                    </div>
                    <ChevronRight size={20} className="text-gray-600 group-hover:text-white transition-colors" />
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </>
      )}
      </div>
    </div>
  );
};

// 2. Subject Detail Screen (UPDATED LAYOUT)
const SubjectDetailScreen = ({ subject, onBack }: { subject: Subject, onBack: () => void }) => {
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  const categories = [
    { id: 'notes', label: 'Notes', icon: <Book size={24} className="text-blue-400" /> },
    { id: 'assignments', label: 'Assignments', icon: <PenTool size={24} className="text-purple-400" /> },
    { id: 'pyq', label: 'PYQ', icon: <Clock size={24} className="text-orange-400" /> },
    { id: 'videos', label: 'Videos', icon: <PlayCircle size={24} className="text-red-400" /> },
    { id: 'books', label: 'Books', icon: <BookOpen size={24} className="text-green-400" /> },
    { id: 'syllabus', label: 'Syllabus', icon: <FileText size={24} className="text-gray-400" /> },
  ];

  const handleResourceClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const toggleCategory = (id: string) => {
    setExpandedCategories(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Filter categories that have content
  const availableCategories = categories.filter(cat => {
    const items = subject[cat.id as keyof Subject] as Resource[];
    return items && items.length > 0;
  });

  return (
    <div className="h-full flex flex-col bg-black animate-slide-in">
      {/* App Bar - Fixed Header */}
      <div className="pt-safe-top px-4 pb-4 bg-black flex items-center gap-4 fixed top-0 left-0 right-0 z-30 shadow-lg border-b border-white/5">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors">
          <ArrowLeft size={24} />
        </button>
        <div className="flex-1">
          <h1 className="text-lg font-bold line-clamp-1">{subject.title}</h1>
          <p className="text-xs text-gray-400">{subject.code} • {subject.credits} Credits</p>
        </div>
        <button className="p-2 rounded-full hover:bg-white/10">
          <MoreVertical size={20} />
        </button>
      </div>

      {/* Content List - With proper top padding to account for fixed header */}
      <div className="flex-1 overflow-y-auto px-4 pb-32 native-scroll" style={{ paddingTop: 'calc(env(safe-area-inset-top) + 80px)' }}>
        {availableCategories.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-gray-500">
            <div className="w-16 h-16 bg-surfaceHighlight rounded-full flex items-center justify-center mb-4">
              <FileText size={24} className="opacity-50" />
            </div>
            <p>No material found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {availableCategories.map(cat => {
              const items = subject[cat.id as keyof Subject] as Resource[];
              const isExpanded = !!expandedCategories[cat.id];
              
              // Group items by their 'group' property
              const groupedItems = items.reduce((acc, item) => {
                const groupName = item.group || 'General';
                if (!acc[groupName]) acc[groupName] = [];
                acc[groupName].push(item);
                return acc;
              }, {} as Record<string, Resource[]>);

              return (
                <div key={cat.id} className="bg-surfaceHighlight rounded-2xl border border-white/5 overflow-hidden transition-all duration-300 shadow-sm hover:border-white/10">
                  <button 
                    onClick={() => toggleCategory(cat.id)}
                    className="w-full p-4 flex items-center justify-between bg-surfaceHighlight hover:bg-white/5 transition-colors active:scale-[0.99]"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-black/40 border border-white/5`}>
                        {cat.icon}
                      </div>
                      <div className="text-left">
                        <h3 className="font-semibold text-base">{cat.label}</h3>
                        <p className="text-xs text-gray-400 mt-0.5">{items.length} {items.length === 1 ? 'Resource' : 'Resources'}</p>
                      </div>
                    </div>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-black/20 transition-transform duration-300 ${isExpanded ? 'rotate-90 bg-white/10' : ''}`}>
                       <ChevronRight size={18} className={`text-gray-400 ${isExpanded ? 'text-white' : ''}`} />
                    </div>
                  </button>
                  
                  {/* Expanded Content */}
                  <div 
                    className={`grid transition-all duration-300 ease-in-out ${
                      isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="overflow-hidden bg-black/20">
                      <div className="p-3">
                         {Object.entries(groupedItems).map(([groupName, groupResources]) => (
                           <div key={groupName} className="mb-4 last:mb-0">
                             {/* Show Group Header if it's not the default 'General' group */}
                             {groupName !== 'General' && (
                               <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 mt-1 px-1 border-l-2 border-accent pl-2">
                                 {groupName}
                               </h4>
                             )}
                             
                             <div className="space-y-2">
                               {groupResources.map((item, idx) => (
                                 <div 
                                   key={idx}
                                   onClick={() => handleResourceClick(item.url)}
                                   className="group flex items-center gap-3 p-3 rounded-xl bg-surface hover:bg-white/10 border border-white/5 cursor-pointer active:scale-[0.98] transition-all"
                                 >
                                   <div className="flex-shrink-0 mt-0.5">
                                     {item.type === 'video' ? (
                                       <PlayCircle size={18} className="text-red-400" />
                                     ) : (
                                       <FileText size={18} className="text-blue-400" />
                                     )}
                                   </div>
                                   
                                   <div className="flex-1 min-w-0">
                                     <p className="text-sm text-gray-200 font-medium line-clamp-2 leading-relaxed group-hover:text-white transition-colors">
                                       {item.title}
                                     </p>
                                     {item.date && (
                                       <p className="text-[10px] text-gray-500 mt-1">{item.date}</p>
                                     )}
                                   </div>
                                   
                                   <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                     <Download size={16} className="text-gray-400" />
                                   </div>
                                 </div>
                               ))}
                             </div>
                           </div>
                         ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

// 3. Info/Contact Screen
const ProfileScreen = () => {
  const [creditsExpanded, setCreditsExpanded] = useState(false);

  return (
  <div className="h-full overflow-y-auto native-scroll">
    <div className="p-4 pt-safe-top pb-32">
      
      {/* Header with App Info Icon */}
      <div className="flex flex-col items-center mb-8 pt-4">
        <div className="w-24 h-24 bg-surfaceHighlight rounded-full flex items-center justify-center mb-4 border-2 border-white/5 shadow-2xl">
          <Info size={40} className="text-gray-400" />
        </div>
        <h2 className="text-xl font-bold">BrainSync</h2>
        <p className="text-gray-500 text-sm">Educational Resource App</p>
      </div>

      {/* About/Description Section */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 text-white">About</h3>
        <Card className="p-4">
          <p className="text-gray-300 leading-relaxed">
            BrainSync is a comprehensive educational resource app designed specifically for Computer Science Engineering students. 
            Access organized study materials, previous year questions, and important resources for all semesters. 
            Built with ❤️ to help CSE students excel in their academic journey.
          </p>
        </Card>
      </div>

      {/* Contact & Social Links */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 text-white">Connect</h3>
        <div className="space-y-3">
          <Card 
            className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors cursor-pointer"
            onClick={() => window.open('https://github.com/devchauhann', '_blank', 'noopener,noreferrer')}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-600/20 rounded-lg">
                <Github size={20} className="text-gray-300" />
              </div>
              <div>
                <span className="text-white">GitHub</span>
                <p className="text-gray-500 text-sm">View source code</p>
              </div>
            </div>
            <ExternalLink size={16} className="text-gray-500" />
          </Card>

          <Card 
            className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors cursor-pointer"
            onClick={() => window.open('https://www.linkedin.com/in/devchauhann3/', '_blank', 'noopener,noreferrer')}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600/20 rounded-lg">
                <Linkedin size={20} className="text-blue-400" />
              </div>
              <div>
                <span className="text-white">LinkedIn</span>
                <p className="text-gray-500 text-sm">Professional profile</p>
              </div>
            </div>
            <ExternalLink size={16} className="text-gray-500" />
          </Card>

          <Card 
            className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors cursor-pointer"
            onClick={() => window.open('https://twitter.com/devchauhann3', '_blank', 'noopener,noreferrer')}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Twitter size={20} className="text-blue-500" />
              </div>
              <div>
                <span className="text-white">Twitter</span>
                <p className="text-gray-500 text-sm">Latest updates</p>
              </div>
            </div>
            <ExternalLink size={16} className="text-gray-500" />
          </Card>

          <Card 
            className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors cursor-pointer"
            onClick={() => window.open('mailto:devgurjar9897@gmail.com', '_blank')}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-600/20 rounded-lg">
                <Mail size={20} className="text-red-400" />
              </div>
              <div>
                <span className="text-white">Gmail</span>
                <p className="text-gray-500 text-sm">Get in touch</p>
              </div>
            </div>
            <ExternalLink size={16} className="text-gray-500" />
          </Card>
        </div>
      </div>

      {/* Credits Section */}
      <div className="mb-6">
        <Card className="overflow-hidden">
          <button 
            onClick={() => setCreditsExpanded(!creditsExpanded)}
            className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-pink-600/20 rounded-lg">
                <Heart size={20} className="text-pink-400" />
              </div>
              <div className="text-left">
                <span className="text-white">Credits & Attribution</span>
                <p className="text-gray-500 text-sm">Resource contributors</p>
              </div>
            </div>
            <ChevronRight size={16} className={`text-gray-500 transition-transform ${creditsExpanded ? 'rotate-90' : ''}`} />
          </button>
          
          {creditsExpanded && (
            <div className="px-4 pb-4 border-t border-white/5 bg-white/2">
              <div className="pt-4 space-y-4">
                <div className="text-sm">
                  <p className="text-white font-medium mb-2">Developed by:</p>
                  <div className="flex items-center gap-2 p-3 bg-gray-800/50 rounded-lg border border-gray-700/30">
                    <div className="p-1.5 bg-gray-600/20 rounded-lg">
                      <Github size={16} className="text-gray-300" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium">Dev Chauhan</p>
                      <a 
                        href="https://github.com/devchauhann" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-400 text-xs hover:text-blue-300 transition-colors flex items-center gap-1"
                      >
                        github.com/devchauhann
                        <ExternalLink size={10} />
                      </a>
                    </div>
                  </div>
                </div>
                
                <div className="text-sm">
                  <p className="text-white font-medium mb-2">Special Thanks:</p>
                  <p className="text-gray-400 leading-relaxed">
                    • abesit.in<br />
                    • btechwala.github.io<br />
                    • notesgallery<br />
                    • College Professor and Students<br />
                    • Lucide React for beautiful icons
                  </p>
                </div>
                <div className="text-sm">
                  <p className="text-white font-medium mb-2">Built with:</p>
                  <p className="text-gray-400">
                    React • TypeScript • Vite • Capacitor • Tailwind CSS
                  </p>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
      
      {/* App Info */}
      <div className="mt-8">
        <h3 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wider ml-2">App Info</h3>
        <Card className="!bg-transparent !border-0 !shadow-none !p-0">
          <div className="bg-surfaceHighlight rounded-t-xl p-4 flex justify-between items-center border-b border-white/5">
            <span>About BrainSync</span>
            <span className="text-xs text-gray-500">v1.0.1</span>
          </div>
          <div className="bg-surfaceHighlight rounded-b-xl p-4 flex justify-between items-center">
            <span>Help & Support</span>
            <ChevronRight size={16} className="text-gray-600" />
          </div>
        </Card>
      </div>
    </div>
  </div>
  );
};

// --- Main App Component ---

enum View {
  HOME = 'home',
  PROFILE = 'profile',
}

export default function App() {
  const [loading, setLoading] = useState(true);
  const [onboardingDone, setOnboardingDone] = useState(false);
  const [activeView, setActiveView] = useState<View>(View.HOME);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedYear, setSelectedYear] = useState('first');
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Setup Capacitor plugins and hardware back button handling
  useEffect(() => {
    const setupApp = async () => {
      // Setup status bar with explicit black theme
      try {
        await StatusBar.setStyle({ style: Style.Dark });
        await StatusBar.setBackgroundColor({ color: '#000000' });
        await StatusBar.setOverlaysWebView({ overlay: false });
        // Additional status bar configuration for black theme
        if ((window as any).Capacitor) {
          // Force black status bar on native app
          await StatusBar.show();
        }
      } catch (error) {
        console.log('StatusBar not available:', error);
      }

      // Setup mobile viewport handling
      const setupMobileViewport = () => {
        // Force mobile fullscreen if on mobile device
        if (window.innerWidth <= 768 || (window as any).Capacitor) {
          document.body.style.width = '100vw';
          document.body.style.maxWidth = 'none';
          document.documentElement.style.width = '100vw';
          
          // Remove any potential margins/borders on mobile
          const appContainer = document.querySelector('.mobile-full-width');
          if (appContainer) {
            (appContainer as HTMLElement).style.width = '100vw';
            (appContainer as HTMLElement).style.maxWidth = 'none';
            (appContainer as HTMLElement).style.border = 'none';
            (appContainer as HTMLElement).style.boxShadow = 'none';
          }
        }
      };

      setupMobileViewport();

      // Setup hardware back button handling
      const setupBackButton = () => {
        // Listen for Capacitor back button events and prevent default
        CapacitorApp.addListener('backButton', (event) => {
          // Prevent the default back action (exiting app)
          event.canGoBack = false;
          handleBackNavigation();
        });
        
        // Listen for custom hardware back button events from MainActivity
        window.addEventListener('capacitor:hardwareBackButton', (event) => {
          event.preventDefault();
          handleBackNavigation();
        });
      };

      // Setup swipe gesture handling for back navigation
      const setupSwipeGestures = () => {
        let startX = 0;
        let startY = 0;
        const minSwipeDistance = 100;
        const maxVerticalDistance = 100;

        const handleTouchStart = (e: TouchEvent) => {
          startX = e.touches[0].clientX;
          startY = e.touches[0].clientY;
        };

        const handleTouchEnd = (e: TouchEvent) => {
          const endX = e.changedTouches[0].clientX;
          const endY = e.changedTouches[0].clientY;
          
          const distanceX = endX - startX;
          const distanceY = Math.abs(endY - startY);
          
          // Check for right swipe from left edge (back gesture)
          if (
            startX < 50 && // Started from left edge
            distanceX > minSwipeDistance && // Swiped right enough
            distanceY < maxVerticalDistance // Not too vertical
          ) {
            handleBackNavigation();
          }
        };

        // Add touch event listeners for swipe gestures
        document.addEventListener('touchstart', handleTouchStart, { passive: true });
        document.addEventListener('touchend', handleTouchEnd, { passive: true });
      };

      // Setup keyboard shortcuts for back navigation
      const setupKeyboardShortcuts = () => {
        const handleKeyDown = (e: KeyboardEvent) => {
          // Handle Escape key for back navigation
          if (e.key === 'Escape') {
            e.preventDefault();
            handleBackNavigation();
          }
        };

        document.addEventListener('keydown', handleKeyDown);
      };
      
      const handleBackNavigation = () => {
        // Handle navigation based on current state
        if (selectedSubject) {
          // If in subject detail view, go back to main view
          setSelectedSubject(null);
          return; // Prevent app exit
        } else if (activeView === View.HOME && searchVisible) {
          // If search is open on home screen, close search first
          setSearchVisible(false);
          setSearchQuery('');
          return; // Prevent app exit
        } else if (activeView !== View.HOME) {
          // If not on home view, go to home
          setActiveView(View.HOME);
          // Also close search if it was open
          setSearchVisible(false);
          setSearchQuery('');
          return; // Prevent app exit
        } else {
          // If on home view and search is not open, actually exit the app
          // For native apps, use exitApp()
          if ((window as any).Capacitor && (window as any).Capacitor.isNative) {
            CapacitorApp.exitApp();
          } else {
            // On web, show a message or do nothing
            console.log('Back pressed on home - would exit app');
          }
        }
      };

      setupBackButton();
      setupSwipeGestures();
      setupKeyboardShortcuts();
    };

    if (onboardingDone) {
      setupApp();
    }

    // Cleanup
    return () => {
      CapacitorApp.removeAllListeners();
    };
  }, [selectedSubject, activeView, onboardingDone]);

  // Handle initialization flow
  if (loading) return <SplashScreen onFinish={() => setLoading(false)} />;
  if (!onboardingDone) return <Onboarding onFinish={() => setOnboardingDone(true)} />;

  // Render content based on state
  const renderContent = () => {
    if (selectedSubject) {
      return (
        <SubjectDetailScreen 
          subject={selectedSubject} 
          onBack={() => setSelectedSubject(null)} 
        />
      );
    }

    switch (activeView) {
      case View.HOME:
        return (
          <HomeScreen 
            onSubjectClick={setSelectedSubject} 
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
            activeView={activeView}
            setActiveView={setActiveView}
            searchVisible={searchVisible}
            setSearchVisible={setSearchVisible}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        );
      case View.PROFILE:
        return <ProfileScreen />;
      default:
        return (
          <HomeScreen 
            onSubjectClick={setSelectedSubject}
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
            activeView={activeView}
            setActiveView={setActiveView}
            searchVisible={searchVisible}
            setSearchVisible={setSearchVisible}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        );
    }
  };

  return (
    // Responsive container: centered with max-width on desktop, full-width on mobile
    <div className="min-h-screen w-full bg-black text-white flex justify-center">
      <div className="w-full md:max-w-md h-[100dvh] bg-black relative md:shadow-2xl md:border-x md:border-gray-900 overflow-hidden flex flex-col mobile-full-width app-container">
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-hidden">
          {renderContent()}
        </main>

      </div>
      
      {/* CSS for custom scrollbar and background dots */}
      <style>{`
        .bg-dots {
          background-image: radial-gradient(#1e1e1e 1px, transparent 1px);
          background-size: 20px 20px;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-in {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.4s ease-out forwards;
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out forwards;
        }
        .pt-safe-top {
          padding-top: max(20px, env(safe-area-inset-top));
        }
      `}</style>
    </div>
  );
}