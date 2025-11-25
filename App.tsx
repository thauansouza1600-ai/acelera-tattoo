import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import CalendarPage from './pages/Calendar';
import ClientsPage from './pages/Clients';
import FinancePage from './pages/Finance';
import RequestsPage from './pages/Requests';
import PublicRequestForm from './pages/PublicRequestForm';
import { ViewState, Booking, TattooRequest } from './types';
import { MOCK_BOOKINGS, MOCK_CLIENTS, MOCK_TRANSACTIONS, MOCK_REQUESTS } from './constants';
import { Feather, Lock, User } from 'lucide-react';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState<ViewState>('DASHBOARD');
  const [isLoading, setIsLoading] = useState(false);
  
  // State for Bookings and Requests
  const [bookings, setBookings] = useState<Booking[]>(MOCK_BOOKINGS);
  const [requests, setRequests] = useState<TattooRequest[]>(MOCK_REQUESTS);

  // Login Handler (Mock)
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
        setIsAuthenticated(true);
        setIsLoading(false);
    }, 1000);
  };

  const handleAddBooking = (newBooking: Booking) => {
    setBookings(prev => [...prev, newBooking]);
    setCurrentView('CALENDAR'); // Redirect to calendar to see the new booking
  };

  const handleAddRequest = (newRequest: TattooRequest) => {
      setRequests(prev => [newRequest, ...prev]);
      // If submitting from public form, we might want to show a success message there instead of redirecting
  };

  const handleUpdateRequest = (updatedRequest: TattooRequest) => {
      setRequests(prev => prev.map(r => r.id === updatedRequest.id ? updatedRequest : r));
  };

  // If viewing the Public Form, render it without Layout
  if (currentView === 'PUBLIC_FORM') {
    return (
      <PublicRequestForm 
        onSubmit={handleAddRequest} 
        onGoBack={() => {
            // If logged in, go to dashboard, else go to login
            if(isAuthenticated) setCurrentView('DASHBOARD');
            else window.location.reload(); // Simple reset for demo
        }}
      />
    );
  }

  // Login Screen Component
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-ink-950 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-brand/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="w-full max-w-md bg-ink-900 border border-ink-800 p-8 rounded-2xl shadow-2xl relative z-10">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-brand rounded-full flex items-center justify-center mb-4 shadow-lg shadow-brand/20">
              <Feather className="text-white w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Acelera Tattoo</h1>
            <p className="text-ink-400 mt-2">Sistema de Gestão para Estúdios</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-ink-400 uppercase mb-1">Endereço de Email</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-600 w-5 h-5" />
                <input 
                  type="email" 
                  defaultValue="artist@aceleratattoo.com"
                  className="w-full bg-ink-950 border border-ink-800 text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-brand transition-colors"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-ink-400 uppercase mb-1">Senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-600 w-5 h-5" />
                <input 
                  type="password" 
                  defaultValue="password"
                  className="w-full bg-ink-950 border border-ink-800 text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-brand transition-colors"
                  required
                />
              </div>
            </div>
            
            <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-brand hover:bg-brand-dark text-white font-bold py-3 rounded-lg transition-colors shadow-lg shadow-brand/20 flex justify-center items-center"
            >
                {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : 'Entrar'}
            </button>
          </form>
          
          <div className="mt-6 pt-6 border-t border-ink-800">
             <button 
                onClick={() => setCurrentView('PUBLIC_FORM')}
                className="w-full text-sm text-ink-400 hover:text-brand transition-colors flex items-center justify-center gap-2"
             >
                Simular Visão do Cliente (Formulário)
             </button>
          </div>
        </div>
      </div>
    );
  }

  // Render current view
  const renderView = () => {
    switch (currentView) {
      case 'DASHBOARD':
        return <Dashboard bookings={bookings} transactions={MOCK_TRANSACTIONS} clientCount={MOCK_CLIENTS.length} />;
      case 'CALENDAR':
        return <CalendarPage bookings={bookings} onAddBooking={handleAddBooking} />;
      case 'CLIENTS':
        return <ClientsPage clients={MOCK_CLIENTS} />;
      case 'FINANCE':
        return <FinancePage transactions={MOCK_TRANSACTIONS} />;
      case 'REQUESTS':
        return <RequestsPage requests={requests} onRequestUpdate={handleUpdateRequest} onCreateBooking={handleAddBooking} />;
      case 'SETTINGS':
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] text-ink-500">
                <SettingsPlaceholder />
            </div>
        );
      default:
        return <div>View not found</div>;
    }
  };

  return (
    <Layout 
      currentView={currentView} 
      onChangeView={setCurrentView} 
      onLogout={() => setIsAuthenticated(false)}
      onOpenPublicLink={() => setCurrentView('PUBLIC_FORM')}
    >
      {renderView()}
    </Layout>
  );
};

// Simple placeholder for empty views
const SettingsPlaceholder = () => (
    <div className="text-center p-8 bg-ink-900 border border-ink-800 rounded-xl max-w-lg">
        <h2 className="text-xl font-bold text-white mb-2">Configurações</h2>
        <p className="text-ink-400 mb-4">Configuração do estúdio, notificações e gestão de perfil estariam aqui.</p>
        <button className="text-sm bg-ink-800 px-4 py-2 rounded text-ink-300" disabled>Em Breve</button>
    </div>
);

export default App;