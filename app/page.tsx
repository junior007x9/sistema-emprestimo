"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { 
  LayoutDashboard, 
  Users, 
  Wallet, 
  FileText, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  ArrowUpRight 
} from "lucide-react";

// Dados fictícios para o gráfico
const dadosGrafico = [
  { mes: "Jan", emprestado: 4000, juros: 1000 },
  { mes: "Fev", emprestado: 3000, juros: 750 },
  { mes: "Mar", emprestado: 5000, juros: 1250 },
  { mes: "Abr", emprestado: 2780, juros: 695 },
  { mes: "Mai", emprestado: 1890, juros: 472 },
  { mes: "Jun", emprestado: 2390, juros: 597 },
];

export default function Dashboard() {
  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 overflow-hidden font-sans">
      
      {/* Sidebar (Menu Lateral) */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col hidden md:flex">
        <div className="h-20 flex items-center px-8 border-b border-slate-800">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-xl tracking-wider">
            <Wallet className="w-6 h-6" />
            <span>PAY<span className="text-white">TRACK</span></span>
          </div>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          <a href="#" className="flex items-center gap-3 px-4 py-3 bg-cyan-500/10 text-cyan-400 rounded-lg transition-colors border border-cyan-500/20">
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium">Dashboard</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-lg transition-colors">
            <Users className="w-5 h-5" />
            <span className="font-medium">Clientes</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-lg transition-colors">
            <TrendingUp className="w-5 h-5" />
            <span className="font-medium">Empréstimos</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-lg transition-colors">
            <FileText className="w-5 h-5" />
            <span className="font-medium">Relatórios</span>
          </a>
        </nav>
      </aside>

      {/* Conteúdo Principal */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8 max-w-7xl mx-auto space-y-8">
          
          {/* Cabeçalho */}
          <header className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">Olá, Jailson!</h1>
              <p className="text-slate-400 mt-1">Aqui está o resumo financeiro do seu sistema hoje.</p>
            </div>
            <button className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold px-5 py-2.5 rounded-lg flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              <TrendingUp className="w-4 h-4" />
              Novo Empréstimo
            </button>
          </header>

          {/* Cards de Métricas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card 1: Total Emprestado */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Wallet className="w-16 h-16 text-cyan-500" />
              </div>
              <h3 className="text-slate-400 font-medium mb-2 flex items-center gap-2">
                Capital Ativo
              </h3>
              <p className="text-4xl font-bold text-white mb-2">R$ 19.060</p>
              <div className="flex items-center text-emerald-400 text-sm font-medium">
                <ArrowUpRight className="w-4 h-4 mr-1" />
                +12.5% em relação ao mês passado
              </div>
            </div>

            {/* Card 2: Lucro / Juros */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden group shadow-[0_0_30px_rgba(16,185,129,0.05)] border-t-emerald-500/30">
              <h3 className="text-slate-400 font-medium mb-2 flex items-center gap-2">
                Juros a Receber (Lucro)
              </h3>
              <p className="text-4xl font-bold text-emerald-400 mb-2">R$ 4.765</p>
              <div className="flex items-center text-slate-500 text-sm font-medium">
                Retorno médio de 25%
              </div>
            </div>

            {/* Card 3: Inadimplência */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden group border-t-rose-500/30">
              <h3 className="text-slate-400 font-medium mb-2 flex items-center gap-2">
                Inadimplência
              </h3>
              <p className="text-4xl font-bold text-rose-500 mb-2">R$ 0,00</p>
              <div className="flex items-center text-emerald-400 text-sm font-medium">
                <CheckCircle2 className="w-4 h-4 mr-1" />
                Todos os pagamentos em dia
              </div>
            </div>

          </div>

          {/* Área do Gráfico */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <h3 className="text-lg font-semibold text-white mb-6">Desempenho Mensal (Capital vs Retorno)</h3>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dadosGrafico} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorEmprestado" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorJuros" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="mes" stroke="#64748b" axisLine={false} tickLine={false} />
                  <YAxis stroke="#64748b" axisLine={false} tickLine={false} tickFormatter={(val) => `R$${val}`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#f1f5f9' }}
                    itemStyle={{ color: '#e2e8f0' }}
                  />
                  <Area type="monotone" name="Capital Emprestado" dataKey="emprestado" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#colorEmprestado)" />
                  <Area type="monotone" name="Lucro (Juros)" dataKey="juros" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorJuros)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Atividades Recentes */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Atividades Recentes</h3>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl divide-y divide-slate-800">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-800/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="bg-emerald-500/10 p-2 rounded-full text-emerald-500">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-white font-medium">Parcela recebida - João Silva</p>
                      <p className="text-slate-400 text-sm">Empréstimo #00{i+1} • Hoje às 14:30</p>
                    </div>
                  </div>
                  <span className="text-emerald-400 font-bold">+ R$ 250,00</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}