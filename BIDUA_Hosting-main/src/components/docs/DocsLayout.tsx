import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Book, ChevronDown, ChevronRight, Menu, X } from 'lucide-react';
import { docSections } from './docSections';

export function DocsLayout() {
  const location = useLocation();
  const [openSections, setOpenSections] = useState<string[]>(['Getting Started']);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const activeSection = docSections.find(section =>
      section.items?.some(item => item.path === location.pathname)
    );

    if (activeSection && !openSections.includes(activeSection.title)) {
      setOpenSections(prev => [...prev, activeSection.title]);
    }
  }, [location.pathname, openSections]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const toggleSection = (title: string) => {
    setOpenSections(prev =>
      prev.includes(title)
        ? prev.filter(section => section !== title)
        : [...prev, title]
    );
  };

  const isActive = (path: string) => location.pathname === path;

  const Sidebar = () => (
    <div className="bg-white border-r border-slate-200 h-full overflow-y-auto">
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center space-x-2">
          <Book className="h-6 w-6 text-cyan-500" />
          <h1 className="text-xl font-bold text-slate-900">Documentation</h1>
        </div>
      </div>

      <nav className="p-4">
        {docSections.map(section => (
          <div key={section.title} className="mb-2">
            <button
              onClick={() => toggleSection(section.title)}
              className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-100 transition"
            >
              <div className="flex items-center space-x-2">
                <section.icon className="h-5 w-5 text-slate-600" />
                <span className="font-medium text-slate-900">{section.title}</span>
              </div>
              {openSections.includes(section.title) ? (
                <ChevronDown className="h-4 w-4 text-slate-400" />
              ) : (
                <ChevronRight className="h-4 w-4 text-slate-400" />
              )}
            </button>

            {openSections.includes(section.title) && section.items && (
              <div className="ml-7 mt-1 space-y-1">
                {section.items.map(item => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`block p-2 rounded-lg text-sm transition ${
                      isActive(item.path)
                        ? 'bg-cyan-50 text-cyan-700 font-medium'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="lg:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Book className="h-6 w-6 text-cyan-500" />
          <h1 className="text-lg font-bold text-slate-900">Documentation</h1>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg hover:bg-slate-100"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50" onClick={() => setMobileMenuOpen(false)}>
          <div className="w-80 bg-white h-full overflow-y-auto" onClick={e => e.stopPropagation()}>
            <Sidebar />
          </div>
        </div>
      )}

      <div className="flex h-full min-h-screen">
        <div className="hidden lg:block w-80 flex-shrink-0">
          <Sidebar />
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-12 py-8">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
