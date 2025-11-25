import React, { useState } from 'react';
import { TattooRequest, RequestStatus, Booking, BookingStatus } from '../types';
import { MessageCircle, Calendar, XCircle, CheckCircle, Clock, User, Image as ImageIcon, ChevronRight, MoreHorizontal } from 'lucide-react';
import { addHours } from 'date-fns';

interface RequestsProps {
  requests: TattooRequest[];
  onRequestUpdate: (updatedRequest: TattooRequest) => void;
  onCreateBooking: (booking: Booking) => void;
}

const RequestsPage: React.FC<RequestsProps> = ({ requests, onRequestUpdate, onCreateBooking }) => {
  const [selectedRequest, setSelectedRequest] = useState<TattooRequest | null>(null);
  const [replyText, setReplyText] = useState('');

  const pendingRequests = requests.filter(r => r.status === RequestStatus.PENDING);
  const negotiatingRequests = requests.filter(r => r.status === RequestStatus.NEGOTIATING);
  const historyRequests = requests.filter(r => r.status === RequestStatus.APPROVED || r.status === RequestStatus.REJECTED);

  const formatDate = (date: Date) => new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(date);

  const handleStatusChange = (status: RequestStatus) => {
    if (!selectedRequest) return;
    const updated = { ...selectedRequest, status, adminNotes: replyText || selectedRequest.adminNotes };
    onRequestUpdate(updated);
    
    if (status === RequestStatus.APPROVED) {
        // Mock creating a booking automatically for demonstration
        // In a real app, this would open the Calendar Modal pre-filled
        const mockDate = new Date();
        mockDate.setHours(14, 0, 0, 0);
        mockDate.setDate(mockDate.getDate() + 2); // 2 days from now

        const newBooking: Booking = {
            id: Math.random().toString(36).substr(2, 9),
            clientId: selectedRequest.id, // Using request ID as client ID for demo simplicity
            clientName: selectedRequest.clientName,
            serviceName: `${selectedRequest.style} - ${selectedRequest.bodyPart}`,
            startAt: mockDate,
            endAt: addHours(mockDate, 3),
            status: BookingStatus.CONFIRMED,
            price: 0, // To be set
            isPaid: false,
            requestId: selectedRequest.id
        };
        onCreateBooking(newBooking);
    }
    
    setSelectedRequest(null);
    setReplyText('');
  };

  const renderRequestCard = (request: TattooRequest) => (
    <div 
        key={request.id} 
        onClick={() => setSelectedRequest(request)}
        className="bg-ink-900 border border-ink-800 rounded-xl p-4 hover:border-ink-600 cursor-pointer transition-all group relative"
    >
        <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${
                    request.status === RequestStatus.PENDING ? 'bg-brand animate-pulse' : 
                    request.status === RequestStatus.NEGOTIATING ? 'bg-amber-500' : 
                    request.status === RequestStatus.APPROVED ? 'bg-emerald-500' : 'bg-ink-500'
                }`} />
                <span className="text-xs text-ink-400 font-mono">{formatDate(request.createdAt)}</span>
            </div>
            {request.photoUrls.length > 0 && <ImageIcon size={14} className="text-ink-500" />}
        </div>
        <h3 className="font-bold text-white">{request.clientName}</h3>
        <p className="text-sm text-ink-300 line-clamp-2 mt-1">{request.description}</p>
        
        <div className="mt-3 pt-3 border-t border-ink-800 flex items-center justify-between text-xs text-ink-500">
            <span className="bg-ink-950 px-2 py-1 rounded">{request.style}</span>
            <span className="bg-ink-950 px-2 py-1 rounded">{request.bodyPart}</span>
        </div>
    </div>
  );

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-6">
      {/* Columns */}
      <div className="flex-1 flex gap-6 overflow-x-auto pb-4">
        {/* Pending Column */}
        <div className="min-w-[300px] max-w-[350px] flex flex-col bg-ink-950/50 rounded-xl border border-ink-800/50 h-full">
            <div className="p-4 border-b border-ink-800 flex justify-between items-center sticky top-0 bg-ink-950 rounded-t-xl z-10">
                <h2 className="font-bold text-white flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-brand" />
                    Pendentes <span className="text-ink-500 text-sm font-normal">({pendingRequests.length})</span>
                </h2>
            </div>
            <div className="p-4 space-y-3 overflow-y-auto flex-1 custom-scrollbar">
                {pendingRequests.map(renderRequestCard)}
                {pendingRequests.length === 0 && <p className="text-center text-sm text-ink-600 py-8">Nenhuma solicitação pendente.</p>}
            </div>
        </div>

        {/* Negotiating Column */}
        <div className="min-w-[300px] max-w-[350px] flex flex-col bg-ink-950/50 rounded-xl border border-ink-800/50 h-full">
            <div className="p-4 border-b border-ink-800 flex justify-between items-center sticky top-0 bg-ink-950 rounded-t-xl z-10">
                 <h2 className="font-bold text-white flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-500" />
                    Em Negociação <span className="text-ink-500 text-sm font-normal">({negotiatingRequests.length})</span>
                </h2>
            </div>
            <div className="p-4 space-y-3 overflow-y-auto flex-1 custom-scrollbar">
                {negotiatingRequests.map(renderRequestCard)}
            </div>
        </div>

         {/* History Column */}
        <div className="min-w-[300px] max-w-[350px] flex flex-col bg-ink-950/50 rounded-xl border border-ink-800/50 h-full">
            <div className="p-4 border-b border-ink-800 flex justify-between items-center sticky top-0 bg-ink-950 rounded-t-xl z-10">
                 <h2 className="font-bold text-white flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-ink-600" />
                    Histórico <span className="text-ink-500 text-sm font-normal">({historyRequests.length})</span>
                </h2>
            </div>
            <div className="p-4 space-y-3 overflow-y-auto flex-1 custom-scrollbar">
                {historyRequests.map(renderRequestCard)}
            </div>
        </div>
      </div>

      {/* Detail Modal / Side Panel */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-ink-900 border border-ink-800 rounded-xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="flex justify-between items-start p-6 border-b border-ink-800">
                    <div>
                        <h2 className="text-2xl font-bold text-white">{selectedRequest.clientName}</h2>
                        <div className="flex gap-3 mt-1 text-sm text-ink-400">
                            <span className="flex items-center gap-1"><User size={14}/> {selectedRequest.clientPhone}</span>
                            <span className="flex items-center gap-1"><Clock size={14}/> {formatDate(selectedRequest.createdAt)}</span>
                        </div>
                    </div>
                    <button onClick={() => setSelectedRequest(null)} className="text-ink-400 hover:text-white p-1">
                        <XCircle size={28} />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Main Info */}
                    <div className="grid grid-cols-2 gap-4 bg-ink-950 p-4 rounded-lg border border-ink-800">
                        <div>
                            <p className="text-xs text-ink-500 uppercase font-medium">Local</p>
                            <p className="text-white">{selectedRequest.bodyPart}</p>
                        </div>
                        <div>
                            <p className="text-xs text-ink-500 uppercase font-medium">Tamanho</p>
                            <p className="text-white">{selectedRequest.size}</p>
                        </div>
                        <div>
                            <p className="text-xs text-ink-500 uppercase font-medium">Estilo</p>
                            <p className="text-white">{selectedRequest.style}</p>
                        </div>
                        <div>
                            <p className="text-xs text-ink-500 uppercase font-medium">Orçamento Cliente</p>
                            <p className="text-white">{selectedRequest.budget}</p>
                        </div>
                         <div className="col-span-2">
                            <p className="text-xs text-ink-500 uppercase font-medium">Disponibilidade</p>
                            <p className="text-white">{selectedRequest.availableDays.join(', ')}</p>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-2">Ideia</h3>
                        <p className="text-ink-300 bg-ink-950/50 p-4 rounded-lg border border-ink-800/50">
                            {selectedRequest.description}
                        </p>
                    </div>

                    {/* Photos */}
                    {selectedRequest.photoUrls.length > 0 && (
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-2">Referências</h3>
                            <div className="flex gap-2 overflow-x-auto pb-2">
                                {selectedRequest.photoUrls.map((url, i) => (
                                    <img key={i} src={url} alt="Ref" className="w-32 h-32 object-cover rounded-lg border border-ink-700" />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Conversation / Reply */}
                    <div>
                         <h3 className="text-lg font-semibold text-white mb-2">Responder / Negociar</h3>
                         <textarea 
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Escreva uma resposta para o cliente sugerindo um horário ou pedindo mais detalhes..."
                            className="w-full h-24 bg-ink-950 border border-ink-800 text-white p-3 rounded-lg focus:border-brand outline-none resize-none"
                         />
                         <p className="text-xs text-ink-500 mt-2 flex items-center gap-1">
                            <MessageCircle size={12} /> A resposta será enviada para o WhatsApp do cliente.
                         </p>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-ink-800 flex justify-between gap-4 bg-ink-900 rounded-b-xl">
                     <button 
                        onClick={() => handleStatusChange(RequestStatus.REJECTED)}
                        className="px-4 py-2 border border-red-900/50 text-red-500 rounded-lg hover:bg-red-900/20 transition-colors"
                    >
                        Recusar
                    </button>
                    
                    <div className="flex gap-3">
                        <button 
                             onClick={() => handleStatusChange(RequestStatus.NEGOTIATING)}
                             className="px-4 py-2 border border-ink-600 text-white rounded-lg hover:bg-ink-800 transition-colors flex items-center gap-2"
                        >
                            <MessageCircle size={18} /> Responder / Negociar
                        </button>
                         <button 
                             onClick={() => handleStatusChange(RequestStatus.APPROVED)}
                             className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition-colors shadow-lg shadow-emerald-900/20 flex items-center gap-2"
                        >
                            <CheckCircle size={18} /> Aprovar & Agendar
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default RequestsPage;