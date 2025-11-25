import React from 'react';
import { Transaction, TransactionType } from '../types';
import { ArrowDownLeft, ArrowUpRight, Download, Plus } from 'lucide-react';

interface FinanceProps {
  transactions: Transaction[];
}

const FinancePage: React.FC<FinanceProps> = ({ transactions }) => {
  const totalIncome = transactions.filter(t => t.type === TransactionType.INCOME).reduce((acc, t) => acc + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === TransactionType.EXPENSE).reduce((acc, t) => acc + t.amount, 0);
  const balance = totalIncome - totalExpense;

  const formatDate = (date: Date) => new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' }).format(date);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Financeiro</h1>
          <p className="text-ink-400">Gestão de fluxo de caixa.</p>
        </div>
        <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 border border-ink-700 rounded-lg text-ink-300 hover:text-white hover:bg-ink-800 transition-colors">
                <Download size={16} /> Exportar CSV
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-brand hover:bg-brand-dark text-white rounded-lg font-medium transition-colors">
                <Plus size={16} /> Nova Transação
            </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-ink-900 border border-ink-800 rounded-xl p-6">
            <p className="text-ink-400 text-sm font-medium uppercase">Saldo Líquido</p>
            <h2 className={`text-3xl font-bold mt-2 ${balance >= 0 ? 'text-white' : 'text-red-500'}`}>
                R$ {balance.toLocaleString('pt-BR')}
            </h2>
        </div>
        <div className="bg-ink-900 border border-ink-800 rounded-xl p-6 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10">
                 <ArrowUpRight size={100} className="text-emerald-500" />
             </div>
            <p className="text-emerald-500 text-sm font-medium uppercase">Receita Total</p>
            <h2 className="text-3xl font-bold text-white mt-2">R$ {totalIncome.toLocaleString('pt-BR')}</h2>
        </div>
        <div className="bg-ink-900 border border-ink-800 rounded-xl p-6 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10">
                 <ArrowDownLeft size={100} className="text-rose-500" />
             </div>
            <p className="text-rose-500 text-sm font-medium uppercase">Despesas Totais</p>
            <h2 className="text-3xl font-bold text-white mt-2">R$ {totalExpense.toLocaleString('pt-BR')}</h2>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-ink-900 border border-ink-800 rounded-xl overflow-hidden shadow-lg">
          <div className="px-6 py-4 border-b border-ink-800 flex justify-between items-center">
              <h3 className="font-semibold text-white">Transações Recentes</h3>
              <select className="bg-ink-950 border border-ink-800 text-ink-300 text-sm rounded-lg px-3 py-1 outline-none focus:border-brand">
                  <option>Este Mês</option>
                  <option>Mês Passado</option>
                  <option>Todo o Período</option>
              </select>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-ink-950/50 text-ink-400 text-xs uppercase tracking-wider">
                        <th className="px-6 py-4 font-medium">Data</th>
                        <th className="px-6 py-4 font-medium">Descrição</th>
                        <th className="px-6 py-4 font-medium">Categoria</th>
                        <th className="px-6 py-4 font-medium text-right">Valor</th>
                        <th className="px-6 py-4 font-medium text-center">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-ink-800">
                    {transactions
                        .sort((a,b) => b.date.getTime() - a.date.getTime())
                        .map((t) => (
                        <tr key={t.id} className="hover:bg-ink-800/50 transition-colors">
                            <td className="px-6 py-4 text-sm text-ink-300 whitespace-nowrap">
                                {formatDate(t.date)}
                            </td>
                            <td className="px-6 py-4 text-sm text-white font-medium">
                                {t.description}
                                {t.bookingId && <span className="ml-2 text-xs text-ink-500 bg-ink-950 px-1.5 py-0.5 rounded">Agendamento</span>}
                            </td>
                            <td className="px-6 py-4 text-sm text-ink-400">
                                {t.category}
                            </td>
                            <td className={`px-6 py-4 text-sm font-bold text-right ${t.type === TransactionType.INCOME ? 'text-emerald-500' : 'text-rose-500'}`}>
                                {t.type === TransactionType.INCOME ? '+' : '-'} R$ {t.amount.toLocaleString('pt-BR')}
                            </td>
                            <td className="px-6 py-4 text-center">
                                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
          </div>
          {transactions.length === 0 && (
             <div className="p-8 text-center text-ink-500">Nenhuma transação registrada ainda.</div>
          )}
      </div>
    </div>
  );
};

export default FinancePage;