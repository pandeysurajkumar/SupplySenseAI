import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();
  const sectionsRef = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    sectionsRef.current.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="bg-slate-50 antialiased">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-40">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <svg className="h-8 w-auto text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75" />
            </svg>
            <span className="ml-3 font-bold text-xl text-gray-800">SUPPLYSENSEAI</span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <button onClick={() => scrollToSection('hero-section')} className="text-gray-600 hover:text-blue-600 font-medium">Home</button>
            <button onClick={() => scrollToSection('the-challenge')} className="text-gray-600 hover:text-blue-600 font-medium">Challenge</button>
            <button onClick={() => scrollToSection('our-solution')} className="text-gray-600 hover:text-blue-600 font-medium">Solution</button>
            <button onClick={() => scrollToSection('how-it-works')} className="text-gray-600 hover:text-blue-600 font-medium">Process</button>
            <button onClick={() => scrollToSection('benefits')} className="text-gray-600 hover:text-blue-600 font-medium">Benefits</button>
          </div>
          <div className="flex items-center space-x-4">
            <button onClick={() => navigate('/login')} className="text-slate-600 hover:text-slate-900 font-semibold transition-colors">
              Sign In
            </button>
            <button onClick={() => navigate('/signup')} className="bg-slate-800 text-white py-2 px-6 rounded-lg hover:bg-slate-900 font-semibold transition-transform duration-300 hover:scale-105">
              Sign Up
            </button>
          </div>
        </nav>
      </header>

      <main>
        {/* Hero Section */}
        <section id="hero-section" className="relative min-h-screen flex items-center overflow-hidden bg-slate-900">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900/50 to-slate-900"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-grid-slate-800 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0))]"></div>

          <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center relative z-10">
            <div className="text-center md:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 leading-tight tracking-tight">
                Optimize Your Material Demand with <span className="text-blue-400">AI-Powered Forecasting</span>
              </h1>
              <p className="text-lg text-blue-200 max-w-xl mx-auto md:mx-0">
                Accurately plan procurement, reduce costs, and avoid delays in critical projects across India.
              </p>
              <div className="mt-8 space-y-4 sm:space-y-0 sm:space-x-4 flex flex-col sm:flex-row justify-center md:justify-start">
                <button onClick={() => navigate('/signup')} className="bg-blue-600 text-white py-3 px-8 rounded-full font-semibold hover:bg-blue-700 transition text-lg shadow-lg hover:shadow-xl transform hover:scale-105">
                  Get Started
                </button>
                <button onClick={() => scrollToSection('the-challenge')} className="bg-white/10 text-white backdrop-blur-sm border border-white/20 py-3 px-8 rounded-full font-semibold hover:bg-white/20 transition text-lg">
                  Learn More
                </button>
              </div>
            </div>
            <div className="hidden md:block">
              <svg className="w-full h-auto" viewBox="0 0 550 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  <linearGradient id="glass-border" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: 'rgba(255, 255, 255, 0.5)' }} />
                    <stop offset="100%" style={{ stopColor: 'rgba(255, 255, 255, 0.1)' }} />
                  </linearGradient>
                </defs>
                <g id="glassmorphism-window">
                  <rect x="25" y="25" width="500" height="350" rx="20" fill="rgba(255, 255, 255, 0.1)" stroke="url(#glass-border)" strokeWidth="1.5" />
                  <g id="header">
                    <path d="M25 45C25 33.9543 33.9543 25 45 25H505C516.046 25 525 33.9543 525 45V80H25V45Z" fill="rgba(255, 255, 255, 0.05)" />
                    <circle cx="50" cy="52" r="6" fill="rgba(255, 255, 255, 0.2)" />
                    <circle cx="75" cy="52" r="6" fill="rgba(255, 255, 255, 0.2)" />
                    <circle cx="100" cy="52" r="6" fill="rgba(255, 255, 255, 0.2)" />
                    <rect x="425" y="42" width="80" height="20" rx="10" fill="rgba(255, 255, 255, 0.2)" />
                  </g>
                  <g id="content-placeholders">
                    <rect x="50" y="110" width="180" height="24" rx="8" fill="rgba(255, 255, 255, 0.3)" />
                    <rect x="50" y="160" width="450" height="12" rx="6" fill="rgba(255, 255, 255, 0.15)" />
                    <rect x="50" y="182" width="420" height="12" rx="6" fill="rgba(255, 255, 255, 0.15)" />
                    <rect x="50" y="204" width="380" height="12" rx="6" fill="rgba(255, 255, 255, 0.15)" />
                  </g>
                  <g id="graph" filter="url(#glow)">
                    <path d="M100 320 Q 150 260, 200 290 T 300 300 Q 350 310, 400 280 T 500 290" stroke="#4cc9f0" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
                    <path d="M100 280 Q 150 340, 200 270 T 300 260 Q 350 250, 400 320 T 500 310" stroke="#5723E1" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </g>
                </g>
              </svg>
            </div>
          </div>
        </section>

        {/* Challenge Section */}
        <section
          id="the-challenge"
          ref={(el) => (sectionsRef.current[0] = el)}
          className="section-fade-in py-24 bg-white"
        >
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <span className="text-sm font-bold uppercase text-blue-600 tracking-widest">The Challenge</span>
              <h2 className="text-4xl font-bold text-slate-800 mt-2">The Complexity of Scale</h2>
              <p className="text-slate-600 mt-4 max-w-3xl mx-auto">SUPPLYSENSEAI helps organizations manage supply chain and material forecasting. Mismanaged materials can cause significant cost overruns and operational inefficiencies across diverse variables.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 text-center max-w-6xl mx-auto">
              {['Budgets', 'Locations', 'Tower Types', 'Sub-stations', 'Taxes', 'Geography'].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <div className="bg-blue-100 text-blue-600 rounded-full p-3 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="1" x2="12" y2="23"></line>
                      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                    </svg>
                  </div>
                  <p className="font-semibold text-slate-700">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Solution Section */}
        <section
          id="our-solution"
          ref={(el) => (sectionsRef.current[1] = el)}
          className="section-fade-in py-24 bg-slate-50"
        >
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <span className="text-sm font-bold uppercase text-blue-600 tracking-widest">Our Solution</span>
              <h2 className="text-4xl font-bold text-slate-800 mt-2">A Smarter, Predictive Platform</h2>
              <p className="text-slate-600 mt-4 max-w-3xl mx-auto">Our platform forecasts material needs, reduces shortages, and optimizes inventory to keep your projects on track and on budget.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { title: 'Accurate Forecasting', desc: 'Leverage AI to predict material needs with high accuracy based on project variables.' },
                { title: 'Inventory Control', desc: 'Maintain optimal stock levels, automate reorder points, and prevent costly shortages.' },
                { title: 'Real-Time Dashboards', desc: 'Access dynamic visualizations and reports for informed, data-driven decision-making.' }
              ].map((feature, idx) => (
                <div key={idx} className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <div className="flex justify-center items-center mb-4 h-14 w-14 rounded-full bg-blue-100 text-blue-600">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
                      <path d="M22 12A10 10 0 0 0 12 2v10z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-2">{feature.title}</h3>
                  <p className="text-slate-500">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section
          id="how-it-works"
          ref={(el) => (sectionsRef.current[2] = el)}
          className="section-fade-in py-24 bg-white"
        >
          <div className="container mx-auto px-6">
            <div className="text-center mb-20">
              <span className="text-sm font-bold uppercase text-blue-600 tracking-widest">Our Process</span>
              <h2 className="text-4xl font-bold text-slate-800 mt-2">Four Steps to Efficiency</h2>
              <p className="text-slate-600 mt-4 max-w-3xl mx-auto">Our process is designed for simplicity and power, transforming complex data into actionable supply chain insights.</p>
            </div>
            <div className="max-w-2xl mx-auto">
              <div className="space-y-12">
                {[
                  { num: 1, title: 'Input Project Data', desc: 'Securely upload your project details including budget, locations, and material specifications.' },
                  { num: 2, title: 'AI-Powered Analysis', desc: 'Our intelligent model analyzes the data, identifying patterns and forecasting future needs.' },
                  { num: 3, title: 'Get Recommendations', desc: 'Receive a detailed breakdown of required materials and smart procurement suggestions.' },
                  { num: 4, title: 'Optimize & Monitor', desc: 'Track your inventory in real-time and continuously optimize your supply chain.' }
                ].map((step, idx) => (
                  <div key={idx} className="timeline-item relative pl-16">
                    <div className="absolute left-0 flex items-center justify-center h-12 w-12 rounded-full bg-slate-800 text-white border-4 border-white shadow-md text-xl font-bold">
                      {step.num}
                    </div>
                    <h3 className="text-xl font-semibold mb-1 text-slate-800">{step.title}</h3>
                    <p className="text-slate-600">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section
          id="benefits"
          ref={(el) => (sectionsRef.current[3] = el)}
          className="section-fade-in py-24 bg-slate-50"
        >
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <span className="text-sm font-bold uppercase text-blue-600 tracking-widest">Benefits</span>
              <h2 className="text-4xl font-bold text-slate-800 mt-2">Unlock Tangible Business Value</h2>
              <p className="text-slate-600 mt-4 max-w-3xl mx-auto">Drive growth, efficiency, and savings by transforming your material management process.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { title: 'Minimize Costs', desc: 'Prevent over-stocking and leverage bulk purchasing insights to save on procurement.' },
                { title: 'Avoid Shortages', desc: 'Ensure materials are available when needed, eliminating costly project delays.' },
                { title: 'Improve Efficiency', desc: 'Streamline your supply chain and reduce manual planning efforts significantly.' },
                { title: 'Enhance Decisions', desc: 'Make strategic choices with confidence, backed by reliable data and insights.' }
              ].map((benefit, idx) => (
                <div key={idx} className="bg-white p-8 rounded-xl border border-slate-200">
                  <div className="flex justify-start items-center mb-4 h-12 w-12 rounded-full bg-teal-100 text-teal-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-2">{benefit.title}</h3>
                  <p className="text-slate-600">{benefit.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        {/* <section className="bg-slate-900 text-white">
          <div className="container mx-auto px-6 py-20 text-center">
            <h2 className="text-4xl font-bold">Start Optimizing Your Projects Today</h2>
            <p className="mt-4 max-w-2xl mx-auto text-slate-300">Leverage AI to forecast materials demand and streamline your supply chain. See the difference for yourself.</p>
            <div className="mt-8">
              <button className="bg-white text-slate-900 py-3 px-8 rounded-full font-semibold hover:bg-slate-200 transition text-lg shadow-lg transform hover:scale-105">
                Request a Demo
              </button>
            </div>
          </div>
        </section> */}
      </main>

      {/* Footer */}
      <footer className="bg-slate-800 text-white">
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg">SUPPLYSENSEAI</h3>
              <p className="text-slate-400 mt-2 text-sm">AI-Powered Material Demand Forecasting</p>
            </div>
            <div>
              <h3 className="font-semibold">Quick Links</h3>
              <ul className="mt-4 space-y-2 text-sm">
                <li><button onClick={() => scrollToSection('hero-section')} className="text-slate-400 hover:text-white">Home</button></li>
                <li><button onClick={() => scrollToSection('the-challenge')} className="text-slate-400 hover:text-white">Challenge</button></li>
                <li><button onClick={() => scrollToSection('our-solution')} className="text-slate-400 hover:text-white">Solution</button></li>
                <li><button onClick={() => scrollToSection('benefits')} className="text-slate-400 hover:text-white">Benefits</button></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold">Follow Us</h3>
              <div className="flex space-x-4 mt-4">
                <a href="#" className="text-slate-400 hover:text-white">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.71v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                  </svg>
                </a>
                <a href="#" className="text-slate-400 hover:text-white">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.388 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.638 2H6.362A4.362 4.362 0 002 6.362v11.276A4.362 4.362 0 006.362 22h11.276A4.362 4.362 0 0022 17.638V6.362A4.362 4.362 0 0017.638 2z" clipRule="evenodd"></path>
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h3 className="font-semibold">Stay Updated</h3>
              <form className="mt-4 flex flex-col sm:flex-row">
                <input type="email" className="w-full px-3 py-2 rounded-md text-slate-800 bg-slate-100" placeholder="Enter your email" />
                <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded-md mt-2 sm:mt-0 sm:ml-2">Subscribe</button>
              </form>
            </div>
          </div>
          <div className="border-t border-slate-700 mt-8 py-6 text-center text-sm text-slate-400">
            <p>&copy; 2025 SUPPLYSENSEAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;

