import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'wouter';

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('about');
  const [location, setLocation] = useLocation();

  const navItems = [
    { href: 'about', label: 'About' },
    { href: 'services', label: 'Services' },
    { href: 'projects', label: 'Projects' },
    { href: 'contact', label: 'Contact' },
    { href: 'blog', label: 'Blog' },
  ];

  // Scroll tracking for active section only on home page
  useEffect(() => {
    if (location !== '/') return;

    const handleScroll = () => setScrolled(window.scrollY > 50);

    const handleSectionChange = () => {
      const scrollPos = window.scrollY + window.innerHeight / 2;
      let currentSection = 'about';
      navItems.forEach(item => {
        if (item.href !== 'blog') {
          const section = document.getElementById(item.href);
          if (section && section.offsetTop <= scrollPos) {
            currentSection = item.href;
          }
        }
      });
      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('scroll', handleSectionChange);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('scroll', handleSectionChange);
    };
  }, [location]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(sectionId);
    }
    setIsMobileMenuOpen(false);
  };

  const handleNavClick = (href: string, e?: React.MouseEvent) => {
    e?.preventDefault();

    if (href === 'blog') {
      setLocation('/blog');
      setIsMobileMenuOpen(false);
      return;
    }

    if (href === 'home') {
      setLocation('/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setIsMobileMenuOpen(false);
      return;
    }

    if (location === '/') {
      scrollToSection(href);
    } else {
      localStorage.setItem('scrollToSection', href);
      setLocation('/');
    }

    setIsMobileMenuOpen(false);
  };

  // Scroll to target section after returning home
  useEffect(() => {
    if (location === '/') {
      const target = localStorage.getItem('scrollToSection');
      if (target) {
        setTimeout(() => {
          scrollToSection(target);
          localStorage.removeItem('scrollToSection');
        }, 100);
      }
    }
  }, [location]);

  const isActive = (href: string) => {
    if (href === 'blog') return location.startsWith('/blog');
    if (location === '/') return activeSection === href;
    return false;
  };

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 p-4 glassmorphic"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 120 }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Brand */}
          <motion.a
            href="#"
            onClick={(e) => handleNavClick('home', e)}
            className="flex items-center gap-4 group"
          >
            <div className="metal-surface w-16 h-16 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
              <span className="text-accent font-display font-black text-xl">VS</span>
            </div>
            <div className="hidden md:block">
              <h1 className="font-display font-bold text-lg text-foreground m-0">
                VS Signage Enterprise
              </h1>
              <p className="text-muted-foreground text-xs m-0 text-yellow-300">
                LED Signage • Precision Cutting • Custom Fabrication
              </p>
            </div>
          </motion.a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-2">
            {navItems.map(item => (
              <motion.button
                key={item.href}
                onClick={(e) => handleNavClick(item.href, e)}
                className={`px-4 py-2 rounded-lg transition-all duration-300 relative overflow-hidden ${
                  isActive(item.href)
                    ? 'text-accent font-bold'
                    : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10">{item.label}</span>
              </motion.button>
            ))}
          </div>

          {/* Mobile Toggle */}
          <div className="flex items-center gap-3">
            <motion.button
              className="lg:hidden glassmorphic p-3 rounded-xl text-muted-foreground"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileTap={{ scale: 0.95 }}
            >
              <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              className="glassmorphic h-full w-64 ml-auto p-6 pt-24"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.3, type: 'spring', damping: 25 }}
            >
              <div className="flex flex-col gap-4">
                {navItems.map(item => (
                  <motion.button
                    key={item.href}
                    onClick={(e) => handleNavClick(item.href, e)}
                    className={`px-4 py-3 rounded-lg transition-all duration-200 text-left ${
                      isActive(item.href)
                        ? 'text-accent font-bold'
                        : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                    }`}
                    whileHover={{ x: 8 }}
                  >
                    {item.label}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
