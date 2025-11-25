import React, { useState } from 'react';
import { ViewState } from '../types';
import { LayoutDashboard, Calendar, Users, DollarSign, Settings, LogOut, Menu, X, Feather, MessageSquarePlus } from 'lucide-react';

interface LayoutProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
  children: React.ReactNode;
  onLogout: () => void;
  onOpenPublicLink: () => void;
}

const Layout: React.FC<LayoutProps> = ({ currentView, onChangeView, children, onLogout, onOpenPublicLink }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'DASHBOARD', label: 'Painel', icon: LayoutDashboard },
    { id: 'CALENDAR', label: 'Agenda', icon: Calendar },
    { id: 'REQUESTS', label: 'Solicitações', icon: MessageSquarePlus },
    { id: 'CLIENTS', label: 'Clientes', icon: Users },
    { id: 'FINANCE', label: 'Financeiro', icon: DollarSign },
  ];

  const handleNavClick = (view: ViewState) => {
    onChangeView(view);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="flex h-screen w-full bg-ink-950 text-ink-200 overflow-hidden">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 w-full h-16 bg-ink-900 border-b border-ink-800 flex items-center justify-between px-4 z-50">
        <div className="flex items-center gap-2 text-brand">
          <Feather className="w-6 h-6" />
          <span className="font-bold text-lg tracking-tight text-white">Acelera Tattoo</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-ink-200">
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-ink-900 border-r border-ink-800 transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo Area */}
          <div className="h-16 flex items-center gap-3 px-6 border-b border-ink-800">
            <div className="w-8 h-8 rounded-full bg-brand flex items-center justify-center text-white">
              <Feather className="w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">Acelera Tattoo</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id as ViewState)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                    isActive 
                      ? 'bg-ink-800 text-brand' 
                      : 'text-ink-400 hover:bg-ink-800 hover:text-ink-200'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Bottom Actions */}
          <div className="p-4 border-t border-ink-800 space-y-2">
            <button
              onClick={onOpenPublicLink}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-ink-400 hover:bg-blue-900/20 hover:text-blue-400 transition-colors"
            >
              <span className="flex items-center justify-center w-5 h-5 rounded border border-current text-[10px] font-bold">🔗</span>
              <span>Link do Cliente</span>
            </button>
            <button 
              onClick={() => handleNavClick('SETTINGS')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-ink-400 hover:bg-ink-800 hover:text-ink-200 ${currentView === 'SETTINGS' ? 'bg-ink-800 text-brand' : ''}`}
            >
              <Settings className="w-5 h-5" />
              <span>Configurações</span>
            </button>
            <button 
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-ink-400 hover:bg-red-900/20 hover:text-red-400 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <div className="flex-1 overflow-y-auto p-4 md:p-8 pt-20 md:pt-8">
           {children}
        </div>
      </main>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;