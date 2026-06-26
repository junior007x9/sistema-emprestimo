"use client";

import { Calculator, ArrowLeft, Send, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { buscarClientes, salvarEmprestimoDb } from "../../actions";

export default function NovoEmprestimo() {
  const router = useRouter(); // Adicionado para fazer o redirecionamento
  const [clientes, setClientes] = useState<{id: string, nome: string}[]>([]);
  const [clienteId, setClienteId] = useState("");
  const [valor, setValor] = useState<number | "">("");
  const [dias, setDias] = useState<number>(30);
  const [juros, setJuros] = useState(0);
  const [total, setTotal] = useState(0);
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    async function carregarDados() {
      const dados = await buscarClientes();
      setClientes(dados);
    }
    carregarDados();
  }, []);

  useEffect(() => {
    if (valor && !isNaN(Number(valor))) {
      const jurosCalculados = Number(valor) * 0.25 * (dias / 30);
      setJuros(jurosCalculados);
      setTotal(Number(valor) + jurosCalculados);
    } else {
      setJuros(0);
      setTotal(0);
    }
  }, [valor, dias]);

  const handleConfirmar = async () => {
    if (!clienteId) return alert("Por favor, selecione um cliente.");
    if (!valor || Number(valor) <= 0) return alert("Informe um valor válido.");

    setCarregando(true);
    
    try {
      const dataVencimento = new Date();
      dataVencimento.setDate(dataVencimento.getDate() + dias);

      const resultado = await salvarEmprestimoDb({
        clienteId,
        valor: Number(valor),
        dias,
        total,
        dataVencimento: dataVencimento.toISOString().split('T')[0]
      });

      if (resultado.sucesso) {
        alert("Empréstimo registrado com sucesso!");
        router.push("/emprestimos"); // Joga o usuário para a lista após salvar
      } else {
        alert("Erro no banco: " + (resultado.erro || "Falha desconhecida"));
      }
    } catch (err) {
      alert("Erro interno. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-8 font-sans text-slate-200">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <header>
          <Link href="/" className="text-slate-400 hover:text-emerald-400 flex items-center gap-2 mb-4 transition-colors w-fit">
            <ArrowLeft className="w-4 h-4" /> Voltar ao Início
          </Link>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Calculator className="w-8 h-8 text-emerald-500" />
            Simular & Confirmar Empréstimo
          </h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <h2 className="text-xl font-semibold text-white mb-6">Dados da Operação</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-slate-400 text-sm font-medium mb-2">Cliente</label>
                <select 
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3.5 text-white outline-none focus:border-emerald-500 transition-all"
                  value={clienteId}
                  onChange={(e) => setClienteId(e.target.value)}
                >
                  <option value="">Selecione um cliente...</option>
                  {clientes.map((c) => (
                    <option key={c.id} value={c.id}>{c.nome}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 text-sm font-medium mb-2">Valor (R$)</label>
                <input 
                  type="number" 
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3.5 text-white outline-none focus:border-emerald-500 transition-all text-xl font-bold"
                  placeholder="0.00"
                  value={valor}
                  onChange={(e) => setValor(Number(e.target.value))}
                />
              </div>

              <div>
                <label className="block text-slate-400 text-sm font-medium mb-2">Prazo (Dias)</label>
                <input 
                  type="number" 
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3.5 text-white outline-none focus:border-emerald-500 transition-all text-xl font-bold"
                  value={dias}
                  onChange={(e) => setDias(Number(e.target.value))}
                />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-8 flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white mb-6">Resumo</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-end border-b border-slate-800 pb-4">
                  <span className="text-slate-400">Principal:</span>
                  <span className="text-xl text-white font-medium">R$ {Number(valor || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-end border-b border-slate-800 pb-4">
                  <span className="text-slate-400">Juros (25%):</span>
                  <span className="text-xl text-emerald-400 font-medium">+ R$ {juros.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-6 mb-6">
                <p className="text-emerald-500 font-medium mb-1">Total a Receber</p>
                <p className="text-4xl font-bold text-white">R$ {total.toFixed(2)}</p>
              </div>

              <button 
                onClick={handleConfirmar}
                disabled={carregando}
                className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-800 text-slate-950 font-bold py-4 rounded-lg flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)]"
              >
                {carregando ? <Loader2 className="animate-spin w-5 h-5" /> : <Send className="w-5 h-5" />}
                {carregando ? "Processando..." : "Confirmar Empréstimo"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}