import React, { useState } from 'react';
import { addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, format, setHours, setMinutes } from 'date-fns';
import { ChevronLeft, ChevronRight, Plus, Clock, X, Calendar as CalendarIcon, User, Layers } from 'lucide-react';
import { Booking, BookingStatus } from '../types';
import { MOCK_CLIENTS, MOCK_SERVICES } from '../constants';

interface CalendarProps {
  bookings: Booking[];
  onAddBooking: (booking: Booking) => void;
}

const CalendarPage: React.FC<CalendarProps> = ({ bookings, onAddBooking }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    clientId: '',
    serviceId: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    time: '10:00'
  });

  // Generate days for the week view
  const start = startOfWeek(currentDate, { weekStartsOn: 1 }); // Monday start
  const end = endOfWeek(currentDate, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start, end });

  const nextWeek = () => setCurrentDate(addDays(currentDate, 7));
  const prevWeek = () => setCurrentDate(addDays(currentDate, -7));
  const resetToday = () => setCurrentDate(new Date());

  const getBookingsForDay = (date: Date) => {
    return bookings.filter(b => isSameDay(b.startAt, date)).sort((a,b) => a.startAt.getTime() - b.startAt.getTime());
  };

  // Interaction Handlers
  const handleOpenModal = (preselectedDate?: Date) => {
    if (preselectedDate) {
        setFormData(prev => ({ ...prev, date: format(preselectedDate, 'yyyy-MM-dd') }));
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const client = MOCK_CLIENTS.find(c => c.id === formData.clientId);
    const service = MOCK_SERVICES.find(s => s.id === formData.serviceId);

    if (!client || !service) return;

    // Construct Dates
    const [year, month, day] = formData.date.split('-').map(Number);
    const [hours, minutes] = formData.time.split(':').map(Number);
    
    const startAt = new Date(year, month - 1, day);
    startAt.setHours(hours, minutes, 0, 0);

    const endAt = new Date(startAt.getTime() + service.duration * 60000);

    const newBooking: Booking = {
        id: Math.random().toString(36).substr(2, 9),
        clientId: client.id,
        clientName: client.name,
        serviceId: service.id,
        serviceName: service.name,
        startAt: startAt,
        endAt: endAt,
        status: BookingStatus.CONFIRMED, // Auto confirm for demo
        price: service.price,
        isPaid: false
    };

    onAddBooking(newBooking);
    setIsModalOpen(false);
    
    // Reset form slightly but keep date for convenience if adding multiple
    setFormData(prev => ({ ...prev, clientId: '', serviceId: '' }));
  };

  // Format Helpers
  const formatRange = (s: Date, e: Date) => {
    const fmt = new Intl.DateTimeFormat('pt-BR', { month: 'short', day: 'numeric' });
    const yearFmt = new Intl.DateTimeFormat('pt-BR', { year: 'numeric' });
    return `${fmt.format(s)} - ${fmt.format(e)}, ${yearFmt.format(e)}`;
  };
  const formatDayName = (date: Date) => new Intl.DateTimeFormat('pt-BR', { weekday: 'short' }).format(date).replace('.', '');
  const formatDayNum = (date: Date) => new Intl.DateTimeFormat('pt-BR', { day: 'numeric' }).format(date);
  const formatTime = (date: Date) => new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(date);

  return (
    <div className="space-y-6 h-full flex flex-col relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Agenda</h1>
          <p className="text-ink-400">Gerencie agendamentos e disponibilidade.</p>
        </div>
        <div className="flex items-center gap-3">
            <button 
                onClick={resetToday}
                className="px-3 py-2 text-sm bg-ink-800 text-ink-200 rounded-lg hover:bg-ink-700 transition-colors"
            >
                Hoje
            </button>
            <div className="flex items-center bg-ink-900 border border-ink-800 rounded-lg p-1">
                <button onClick={prevWeek} className="p-1 hover:bg-ink-800 rounded text-ink-400 hover:text-white"><ChevronLeft size={20}/></button>
                <span className="px-4 font-medium text-sm text-white min-w-[140px] text-center capitalize">
                    {formatRange(start, end)}
                </span>
                <button onClick={nextWeek} className="p-1 hover:bg-ink-800 rounded text-ink-400 hover:text-white"><ChevronRight size={20}/></button>
            </div>
            <button 
                onClick={() => handleOpenModal()}
                className="flex items-center gap-2 bg-brand hover:bg-brand-dark text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-brand/20"
            >
                <Plus size={18} />
                <span className="hidden sm:inline">Novo Agendamento</span>
            </button>
        </div>
      </div>

      {/* Calendar Grid (Week View) */}
      <div className="flex-1 overflow-x-auto pb-4">
        <div className="min-w-[800px] h-full grid grid-cols-7 gap-4">
            {days.map((day) => {
                const dayBookings = getBookingsForDay(day);
                const isToday = isSameDay(day, new Date());

                return (
                    <div key={day.toString()} className={`flex flex-col h-full rounded-xl border ${isToday ? 'border-brand bg-ink-900/50' : 'border-ink-800 bg-ink-900'} transition-colors`}>
                        {/* Day Header */}
                        <div className={`p-3 text-center border-b border-ink-800 ${isToday ? 'bg-brand/10' : ''}`}>
                            <p className="text-xs uppercase font-medium text-ink-500">{formatDayName(day)}</p>
                            <p className={`text-xl font-bold mt-1 ${isToday ? 'text-brand' : 'text-white'}`}>{formatDayNum(day)}</p>
                        </div>
                        
                        {/* Slots */}
                        <div className="flex-1 p-2 space-y-2 overflow-y-auto custom-scrollbar relative group/day">
                            {dayBookings.length > 0 ? (
                                dayBookings.map(booking => (
                                    <div 
                                        key={booking.id} 
                                        className={`p-3 rounded-lg border text-left group cursor-pointer hover:scale-[1.02] transition-all duration-200
                                            ${booking.status === BookingStatus.CONFIRMED ? 'bg-emerald-900/20 border-emerald-900/50 hover:border-emerald-500/50' : 
                                              booking.status === BookingStatus.COMPLETED ? 'bg-ink-800 border-ink-700' : 
                                              'bg-amber-900/20 border-amber-900/50'}
                                        `}
                                    >
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="text-xs font-mono text-ink-400 flex items-center gap-1">
                                                <Clock size={10} />
                                                {formatTime(booking.startAt)}
                                            </span>
                                            {booking.isPaid && <span className="text-[10px] text-emerald-500 font-bold">R$</span>}
                                        </div>
                                        <p className="font-medium text-sm text-white truncate">{booking.clientName}</p>
                                        <p className="text-xs text-ink-500 truncate mt-1">{booking.serviceName}</p>
                                    </div>
                                ))
                            ) : null}
                            
                            {/* Empty State / Add Button on Hover */}
                            <button 
                                onClick={() => handleOpenModal(day)}
                                className="w-full py-4 flex flex-col items-center justify-center text-ink-700 hover:text-brand hover:bg-ink-800/50 rounded-lg transition-colors border border-transparent hover:border-brand/20 opacity-0 group-hover/day:opacity-100"
                            >
                                <Plus size={24} className="mb-1" />
                                <span className="text-xs font-medium">Adicionar</span>
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
      </div>

      {/* Booking Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-ink-900 border border-ink-800 rounded-xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center p-6 border-b border-ink-800">
                    <h2 className="text-xl font-bold text-white">Novo Agendamento</h2>
                    <button onClick={() => setIsModalOpen(false)} className="text-ink-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Client Selection */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-ink-400 uppercase">Cliente</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-500 w-4 h-4" />
                            <select 
                                required
                                value={formData.clientId}
                                onChange={(e) => setFormData({...formData, clientId: e.target.value})}
                                className="w-full bg-ink-950 border border-ink-800 text-white rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-brand appearance-none"
                            >
                                <option value="" disabled>Selecione um cliente</option>
                                {MOCK_CLIENTS.map(client => (
                                    <option key={client.id} value={client.id}>{client.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Service Selection */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-ink-400 uppercase">Serviço</label>
                        <div className="relative">
                            <Layers className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-500 w-4 h-4" />
                            <select 
                                required
                                value={formData.serviceId}
                                onChange={(e) => setFormData({...formData, serviceId: e.target.value})}
                                className="w-full bg-ink-950 border border-ink-800 text-white rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-brand appearance-none"
                            >
                                <option value="" disabled>Selecione um serviço</option>
                                {MOCK_SERVICES.map(service => (
                                    <option key={service.id} value={service.id}>
                                        {service.name} - {service.duration}min - R${service.price}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Date */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-ink-400 uppercase">Data</label>
                            <div className="relative">
                                <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-500 w-4 h-4" />
                                <input 
                                    type="date" 
                                    required
                                    value={formData.date}
                                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                                    className="w-full bg-ink-950 border border-ink-800 text-white rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-brand appearance-none [&::-webkit-calendar-picker-indicator]:invert"
                                />
                            </div>
                        </div>

                        {/* Time */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-ink-400 uppercase">Horário</label>
                            <div className="relative">
                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-500 w-4 h-4" />
                                <input 
                                    type="time" 
                                    required
                                    value={formData.time}
                                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                                    className="w-full bg-ink-950 border border-ink-800 text-white rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-brand appearance-none [&::-webkit-calendar-picker-indicator]:invert"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button 
                            type="button" 
                            onClick={() => setIsModalOpen(false)}
                            className="flex-1 px-4 py-2.5 border border-ink-700 rounded-lg text-ink-300 hover:text-white hover:bg-ink-800 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button 
                            type="submit"
                            className="flex-1 px-4 py-2.5 bg-brand hover:bg-brand-dark text-white font-bold rounded-lg transition-colors shadow-lg shadow-brand/20"
                        >
                            Confirmar
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default CalendarPage;