import React, { useState } from 'react';
import { Client } from '../types';
import { Search, Mail, Phone, MoreHorizontal, Camera, FileText, Filter } from 'lucide-react';

interface ClientsProps {
  clients: Client[];
}

const ClientsPage: React.FC<ClientsProps> = ({ clients }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (date: Date) => new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'short' }).format(date);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Clientes</h1>
          <p className="text-ink-400">Base de dados de {clients.length} clientes ativos.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-500 w-4 h-4" />
                <input 
                    type="text" 
                    placeholder="Buscar clientes..." 
                    className="w-full bg-ink-900 border border-ink-800 text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-brand transition-colors"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <button className="p-2 bg-ink-900 border border-ink-800 rounded-lg text-ink-400 hover:text-white hover:bg-ink-800 transition-colors">
                <Filter size={20} />
            </button>
            <button className="bg-white text-black px-4 py-2 rounded-lg font-bold hover:bg-ink-200 transition-colors">
                Adicionar Cliente
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredClients.map(client => (
            <div key={client.id} className="bg-ink-900 border border-ink-800 rounded-xl overflow-hidden hover:border-ink-600 transition-all group">
                <div className="p-6">
                    <div className="flex justify-between items-start">
                        <div className="w-16 h-16 rounded-full bg-ink-800 flex items-center justify-center text-xl font-bold text-ink-500 overflow-hidden border-2 border-ink-800 group-hover:border-brand transition-colors">
                            {client.photoUrls.length > 0 ? (
                                <img src={client.photoUrls[0]} alt={client.name} className="w-full h-full object-cover" />
                            ) : (
                                <span>{client.name.substring(0, 2).toUpperCase()}</span>
                            )}
                        </div>
                        <button className="text-ink-500 hover:text-white">
                            <MoreHorizontal size={20} />
                        </button>
                    </div>
                    
                    <div className="mt-4">
                        <h3 className="text-lg font-bold text-white truncate">{client.name}</h3>
                        <div className="flex items-center gap-2 mt-2 text-sm text-ink-400">
                            <Mail size={14} />
                            <span className="truncate">{client.email}</span>
                        </div>
                         <div className="flex items-center gap-2 mt-1 text-sm text-ink-400">
                            <Phone size={14} />
                            <span className="truncate">{client.phone}</span>
                        </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-ink-800 grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-xs text-ink-500 uppercase font-medium">Sessões</p>
                            <p className="text-lg font-semibold text-white">{client.totalSessions}</p>
                        </div>
                        <div>
                            <p className="text-xs text-ink-500 uppercase font-medium">Última Visita</p>
                            <p className="text-sm font-medium text-white mt-1">
                                {client.lastVisit ? formatDate(client.lastVisit) : 'Novo'}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-ink-950 px-6 py-3 flex justify-between items-center text-xs font-medium text-ink-500 border-t border-ink-800">
                    <div className="flex gap-3">
                         {client.notes && (
                            <span className="flex items-center gap-1" title="Possui anotações">
                                <FileText size={14} />
                            </span>
                         )}
                         {client.photoUrls.length > 0 && (
                             <span className="flex items-center gap-1" title={`${client.photoUrls.length} Fotos`}>
                                <Camera size={14} /> {client.photoUrls.length}
                            </span>
                         )}
                    </div>
                    <button className="text-brand hover:underline">Ver Perfil</button>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};

export default ClientsPage;