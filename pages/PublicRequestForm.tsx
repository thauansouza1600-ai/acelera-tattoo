import React, { useState } from 'react';
import { Upload, CheckCircle, Feather, Info, ArrowLeft } from 'lucide-react';
import { TattooRequest, RequestStatus } from '../types';

interface PublicRequestFormProps {
  onSubmit: (request: TattooRequest) => void;
  onGoBack: () => void;
}

const PublicRequestForm: React.FC<PublicRequestFormProps> = ({ onSubmit, onGoBack }) => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    bodyPart: '',
    size: '',
    style: '',
    description: '',
    budget: '',
    availability: '',
    termsAccepted: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simular delay de rede
    await new Promise(resolve => setTimeout(resolve, 1500));

    const newRequest: TattooRequest = {
      id: Math.random().toString(36).substr(2, 9),
      clientName: formData.name,
      clientEmail: formData.email,
      clientPhone: formData.phone,
      description: formData.description,
      bodyPart: formData.bodyPart,
      size: formData.size,
      style: formData.style,
      budget: formData.budget,
      photoUrls: [], // Em um app real, faríamos upload aqui
      availableDays: [formData.availability],
      createdAt: new Date(),
      status: RequestStatus.PENDING,
    };

    onSubmit(newRequest);
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-ink-950 flex flex-col items-center justify-center p-4 text-center">
        <div className="w-20 h-20 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mb-6 animate-bounce">
          <CheckCircle size={48} />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Solicitação Enviada!</h1>
        <p className="text-ink-400 max-w-md mb-8">
          Recebemos sua ideia. O artista irá analisar e entrar em contato via WhatsApp ou E-mail em breve para confirmar os detalhes.
        </p>
        <button 
          onClick={onGoBack}
          className="px-6 py-3 bg-ink-800 hover:bg-ink-700 text-white rounded-lg transition-colors"
        >
          Voltar ao Início
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink-950 overflow-y-auto">
      {/* Header Simples */}
      <div className="sticky top-0 bg-ink-900/80 backdrop-blur-md border-b border-ink-800 z-10 px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-brand">
            <Feather className="w-6 h-6" />
            <span className="font-bold text-lg tracking-tight text-white">Acelera Tattoo</span>
          </div>
          <button onClick={onGoBack} className="text-sm text-ink-400 hover:text-white flex items-center gap-1">
            <ArrowLeft size={14} /> Voltar
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Orçamento de Tattoo</h1>
          <p className="text-ink-400">Preencha o formulário abaixo para que possamos criar algo exclusivo para você.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Seção 1: Contato */}
          <section className="bg-ink-900 border border-ink-800 rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-brand text-white text-xs flex items-center justify-center">1</span>
              Seus Dados
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs uppercase text-ink-400 font-medium">Nome Completo</label>
                <input 
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-ink-950 border border-ink-800 text-white p-3 rounded-lg focus:border-brand outline-none"
                  placeholder="Ex: Ana Costa"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs uppercase text-ink-400 font-medium">WhatsApp</label>
                <input 
                  required
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  className="w-full bg-ink-950 border border-ink-800 text-white p-3 rounded-lg focus:border-brand outline-none"
                  placeholder="(00) 00000-0000"
                />
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs uppercase text-ink-400 font-medium">E-mail</label>
                <input 
                  required
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-ink-950 border border-ink-800 text-white p-3 rounded-lg focus:border-brand outline-none"
                  placeholder="seu@email.com"
                />
              </div>
            </div>
          </section>

          {/* Seção 2: A Tatuagem */}
          <section className="bg-ink-900 border border-ink-800 rounded-xl p-6 space-y-4">
             <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-brand text-white text-xs flex items-center justify-center">2</span>
              Sobre a Tattoo
            </h2>
            
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-1">
                <label className="text-xs uppercase text-ink-400 font-medium">Parte do Corpo</label>
                <input 
                  required
                  value={formData.bodyPart}
                  onChange={e => setFormData({...formData, bodyPart: e.target.value})}
                  className="w-full bg-ink-950 border border-ink-800 text-white p-3 rounded-lg focus:border-brand outline-none"
                  placeholder="Ex: Antebraço"
                />
              </div>
               <div className="space-y-1">
                <label className="text-xs uppercase text-ink-400 font-medium">Tamanho (cm)</label>
                <input 
                  required
                  value={formData.size}
                  onChange={e => setFormData({...formData, size: e.target.value})}
                  className="w-full bg-ink-950 border border-ink-800 text-white p-3 rounded-lg focus:border-brand outline-none"
                  placeholder="Ex: 15x10"
                />
              </div>
            </div>

             <div className="space-y-1">
                <label className="text-xs uppercase text-ink-400 font-medium">Estilo</label>
                <input 
                  required
                  value={formData.style}
                  onChange={e => setFormData({...formData, style: e.target.value})}
                  className="w-full bg-ink-950 border border-ink-800 text-white p-3 rounded-lg focus:border-brand outline-none"
                  placeholder="Ex: Realismo, Old School, Fineline..."
                />
              </div>

            <div className="space-y-1">
              <label className="text-xs uppercase text-ink-400 font-medium">Descrição da Ideia</label>
              <textarea 
                required
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                className="w-full h-32 bg-ink-950 border border-ink-800 text-white p-3 rounded-lg focus:border-brand outline-none resize-none"
                placeholder="Descreva o que você quer tatuar, elementos, significado..."
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs uppercase text-ink-400 font-medium">Referências (Imagens)</label>
              <div className="border-2 border-dashed border-ink-800 rounded-lg p-8 text-center hover:bg-ink-950/50 transition-colors cursor-pointer group">
                <Upload className="mx-auto h-8 w-8 text-ink-500 group-hover:text-brand transition-colors" />
                <p className="mt-2 text-sm text-ink-400">Clique para adicionar fotos</p>
                <p className="text-xs text-ink-600">(Simulação: Upload desativado na demo)</p>
              </div>
            </div>
          </section>

          {/* Seção 3: Agendamento */}
          <section className="bg-ink-900 border border-ink-800 rounded-xl p-6 space-y-4">
             <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-brand text-white text-xs flex items-center justify-center">3</span>
              Preferências
            </h2>

            <div className="space-y-1">
              <label className="text-xs uppercase text-ink-400 font-medium">Disponibilidade</label>
              <input 
                value={formData.availability}
                onChange={e => setFormData({...formData, availability: e.target.value})}
                className="w-full bg-ink-950 border border-ink-800 text-white p-3 rounded-lg focus:border-brand outline-none"
                placeholder="Ex: Terças e Quintas à tarde, Sábados..."
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs uppercase text-ink-400 font-medium">Orçamento Estimado (R$)</label>
              <input 
                value={formData.budget}
                onChange={e => setFormData({...formData, budget: e.target.value})}
                className="w-full bg-ink-950 border border-ink-800 text-white p-3 rounded-lg focus:border-brand outline-none"
                placeholder="Quanto pretende investir?"
              />
            </div>
          </section>

          <div className="flex items-start gap-3 p-4 bg-ink-900/50 rounded-lg border border-ink-800">
             <input 
              type="checkbox" 
              id="terms"
              checked={formData.termsAccepted}
              onChange={e => setFormData({...formData, termsAccepted: e.target.checked})}
              className="mt-1"
            />
             <label htmlFor="terms" className="text-sm text-ink-300 cursor-pointer select-none">
               Concordo que o envio deste formulário é uma solicitação de orçamento e não garante o agendamento imediato. O artista entrará em contato.
             </label>
          </div>

          <button 
            type="submit"
            disabled={!formData.termsAccepted || isSubmitting}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all shadow-lg ${
              formData.termsAccepted 
              ? 'bg-brand hover:bg-brand-dark text-white shadow-brand/20' 
              : 'bg-ink-800 text-ink-500 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? 'Enviando...' : 'Enviar Solicitação'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PublicRequestForm;