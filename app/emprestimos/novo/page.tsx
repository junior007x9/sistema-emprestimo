"use client";

import { useEffect, useState } from "react";
import { buscarEmprestimosComClientes, baixarParcelaDb } from "../../actions";
import { ArrowLeft, CheckCircle, Clock, Wallet } from "lucide-react";
import Link from "next/link";

export default function ListaEmprestimos() {
  const [lista, setLista] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(false);

  // Função que busca os dados no banco (Turso)
  async function carregarDados() {
    const dados = await buscarEmprestimosComClientes();
    setLista(dados);
  }

  useEffect(() => {
    carregarDados();
  }, []);

  // Função ativada ao clicar no botão "Receber"
  const handleBaixarPagamento = async (emprestimoId: string) => {
    const confirmar = window.confirm("Tem certeza que deseja confirmar o recebimento deste valor?");
    if (!confirmar) return;

    setCarregando(true);
    const resultado = await baixarParcelaDb(emprestimoId);

    if (resultado.sucesso) {
      alert("Pagamento recebido e baixado com sucesso!");
      await carregarDados(); // Atualiza a tabela imediatamente
    } else {
      alert("Erro ao processar o pagamento.");
    }
    setCarregando(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 p-8 font-sans text-slate-200">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Cabeçalho */}
        <header className="flex justify-between items-end">
          <div>
            <Link href="/" className="text-slate-400 hover:text-cyan-400 flex items-center gap-2 mb-4 transition-colors w-fit">
              <ArrowLeft className="w-4 h-4" /> Voltar ao Início
            </Link>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Wallet className="w-8 h-8 text-cyan-500" />
              Controle de Empréstimos
            </h1>
          </div>
          
          <Link 
            href="/emprestimos/novo" 
            className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-6 py-3 rounded-lg transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)]"
          >
            + Novo Empréstimo
          </Link>
        </header>

        {/* Tabela de Controle */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-800/50 text-slate-400 text-xs uppercase tracking-wider">
                <tr>
                  <th className="p-5 font-medium">Cliente</th>
                  <th className="p-5 font-medium">Valor Principal</th>
                  <th className="p-5 font-medium">Total a Pagar</th>
                  <th className="p-5 font-medium">Vencimento</th>
                  <th className="p-5 font-medium">Status</th>
                  <th className="p-5 font-medium text-center">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {lista.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-500">
                      Nenhum empréstimo registrado ainda.
                    </td>
                  </tr>
                ) : (
                  lista.map((emp) => (
                    <tr key={emp.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="p-5 font-medium text-white">{emp.nomeCliente}</td>
                      <td className="p-5 text-slate-300">R$ {emp.valorPrincipal.toFixed(2)}</td>
                      <td className="p-5 font-bold text-cyan-400">R$ {emp.valorTotal.toFixed(2)}</td>
                      <td className="p-5 text-slate-300">
                        {emp.dataVencimento.split('-').reverse().join('/')}
                      </td>
                      <td className="p-5">
                        {emp.status === "PAGO" ? (
                          <span className="flex items-center gap-1.5 w-fit px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-xs font-bold border border-emerald-500/20">
                            <CheckCircle className="w-3.5 h-3.5" /> Pago
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 w-fit px-3 py-1 bg-amber-500/10 text-amber-500 rounded-full text-xs font-bold border border-amber-500/20">
                            <Clock className="w-3.5 h-3.5" /> Pendente
                          </span>
                        )}
                      </td>
                      <td className="p-5 text-center">
                        {emp.status !== "PAGO" && (
                          <button 
                            onClick={() => handleBaixarPagamento(emp.id)}
                            disabled={carregando}
                            className="bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-800 text-slate-950 font-bold px-4 py-2 rounded-lg text-sm transition-all"
                          >
                            Receber
                          </button>
                        )}
                        {emp.status === "PAGO" && (
                          <span className="text-slate-500 text-sm font-medium">Finalizado</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}