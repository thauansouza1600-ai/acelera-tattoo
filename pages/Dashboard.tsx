import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, Users, Calendar, Clock } from 'lucide-react';
import StatCard from '../components/StatCard';
import { Booking, BookingStatus, Transaction, TransactionType } from '../types';

interface DashboardProps {
  bookings: Booking[];
  transactions: Transaction[];
  clientCount: number;
}

const statusMap: Record<BookingStatus, string> = {
    [BookingStatus.PENDING]: 'Pendente',
    [BookingStatus.CONFIRMED]: 'Confirmado',
    [BookingStatus.COMPLETED]: 'Concluído',
    [BookingStatus.CANCELED]: 'Cancelado',
};

const Dashboard: React.FC<DashboardProps> = ({ bookings, transactions, clientCount }) => {
  // Calculate Totals
  const totalRevenue = useMemo(() => 
    transactions
      .filter(t => t.type === TransactionType.INCOME)
      .reduce((sum, t) => sum + t.amount, 0)
  , [transactions]);

  const activeBookings = bookings.filter(b => 
    b.status === BookingStatus.CONFIRMED || b.status === BookingStatus.PENDING
  ).length;

  const pendingRevenue = bookings
    .filter(b => !b.isPaid && b.status !== BookingStatus.CANCELED)
    .reduce((sum, b) => sum + b.price, 0);

  // Prepare Chart Data (Mocking a 7-day trend based on transactions)
  const chartData = useMemo(() => {
    // Group transactions by day (simplified for demo)
    return [
      { name: 'Seg', revenue: 400 },
      { name: 'Ter', revenue: 300 },
      { name: 'Qua', revenue: 550 },
      { name: 'Qui', revenue: 200 },
      { name: 'Sex', revenue: 800 },
      { name: 'Sáb', revenue: 1200 },
      { name: 'Dom', revenue: 150 },
    ];
  }, []);

  // Format Helpers using Intl
  const formatMonth = (date: Date) => new Intl.DateTimeFormat('pt-BR', { month: 'short' }).format(date).replace('.', '');
  const formatDay = (date: Date) => new Intl.DateTimeFormat('pt-BR', { day: '2-digit' }).format(date);
  const formatTime = (date: Date) => new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(date);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Visão Geral do Estúdio</h1>
          <p className="text-ink-400">Bem-vindo de volta, confira suas estatísticas diárias.</p>
        </div>
        <div className="flex items-center gap-2">
            <span className="text-xs font-medium bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full border border-emerald-500/20">
                Loja Aberta
            </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Receita Total" 
          value={`R$ ${totalRevenue.toLocaleString('pt-BR')}`} 
          trend="12%" 
          trendUp={true} 
          icon={DollarSign}
          colorClass="text-emerald-500" 
        />
        <StatCard 
          label="Agendamentos Ativos" 
          value={activeBookings.toString()} 
          icon={Calendar}
          colorClass="text-blue-500"
        />
        <StatCard 
          label="Total de Clientes" 
          value={clientCount.toString()} 
          trend="4" 
          trendUp={true} 
          icon={Users}
          colorClass="text-purple-500"
        />
        <StatCard 
          label="Pagamento Pendente" 
          value={`R$ ${pendingRevenue.toLocaleString('pt-BR')}`} 
          icon={Clock}
          colorClass="text-amber-500"
        />
      </div>

      {/* Main Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 bg-ink-900 border border-ink-800 rounded-xl p-6 shadow-lg">
          <h2 className="text-lg font-semibold text-white mb-6">Fluxo de Receita</h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
                <XAxis dataKey="name" stroke="#525252" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#525252" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `R$${value}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#171717', borderColor: '#404040', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                  formatter={(value: number) => [`R$ ${value}`, 'Receita']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#f43f5e" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity / Next Up */}
        <div className="bg-ink-900 border border-ink-800 rounded-xl p-6 shadow-lg flex flex-col">
          <h2 className="text-lg font-semibold text-white mb-4">Próximas Sessões</h2>
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
            {bookings
              .sort((a, b) => a.startAt.getTime() - b.startAt.getTime())
              .slice(0, 5)
              .map(booking => (
              <div key={booking.id} className="flex items-center gap-4 p-3 rounded-lg bg-ink-950/50 hover:bg-ink-950 transition-colors border border-ink-800/50">
                <div className="flex flex-col items-center justify-center w-12 h-12 rounded bg-ink-800 text-brand font-bold">
                   <span className="text-xs uppercase">{formatMonth(booking.startAt)}</span>
                   <span className="text-lg leading-none">{formatDay(booking.startAt)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{booking.clientName}</p>
                  <p className="text-xs text-ink-400 truncate">{booking.serviceName}</p>
                </div>
                <div className="text-right">
                    <span className="block text-xs text-ink-500">{formatTime(booking.startAt)}</span>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                        booking.status === BookingStatus.CONFIRMED ? 'bg-emerald-500/10 text-emerald-500' :
                        booking.status === BookingStatus.COMPLETED ? 'bg-blue-500/10 text-blue-500' :
                        'bg-amber-500/10 text-amber-500'
                    }`}>
                        {statusMap[booking.status]}
                    </span>
                </div>
              </div>
            ))}
            {bookings.length === 0 && (
                <div className="text-center text-ink-500 py-8">Nenhum agendamento próximo</div>
            )}
          </div>
          <button className="w-full mt-4 py-2 text-sm font-medium text-ink-300 hover:text-white border border-ink-700 rounded-lg hover:bg-ink-800 transition-colors">
            Ver Agenda
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;