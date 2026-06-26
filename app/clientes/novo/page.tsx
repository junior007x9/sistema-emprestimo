"use client";

import { UserPlus, ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { salvarClienteDb } from "../../actions"; // Importamos a função do servidor!

export default function NovoCliente() {
  const [formData, setFormData] = useState({
    nome: "",
    telefone: "",
    cpf: "",
    endereco: ""
  });
  const [carregando, setCarregando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCarregando(true);
    
    // Chama a função do servidor enviando os dados do formulário
    const resultado = await salvarClienteDb(formData);

    if (resultado.sucesso) {
      alert("Cliente salvo com sucesso no banco de dados!");
      // Limpa o formulário
      setFormData({ nome: "", telefone: "", cpf: "", endereco: "" });
    } else {
      alert("Erro ao salvar cliente. Tente novamente.");
    }
    
    setCarregando(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 p-8 font-sans">
      <div className="max-w-2xl mx-auto space-y-8">
        
        {/* Cabeçalho */}
        <header className="flex items-center justify-between">
          <div>
            <Link href="/" className="text-slate-400 hover:text-cyan-400 flex items-center gap-2 mb-4 transition-colors w-fit">
              <ArrowLeft className="w-4 h-4" />
              Voltar ao Início
            </Link>
            <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
              <UserPlus className="w-8 h-8 text-cyan-500" />
              Novo Cliente
            </h1>
          </div>
        </header>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">
          <div className="space-y-6">
            
            <div>
              <label className="block text-slate-400 text-sm font-medium mb-2">Nome Completo</label>
              <input 
                type="text" 
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3.5 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
                placeholder="Ex: João da Silva"
                value={formData.nome}
                onChange={(e) => setFormData({...formData, nome: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-slate-400 text-sm font-medium mb-2">Telefone</label>
                <input 
                  type="text" 
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3.5 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
                  placeholder="(00) 00000-0000"
                  value={formData.telefone}
                  onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-slate-400 text-sm font-medium mb-2">CPF</label>
                <input 
                  type="text" 
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3.5 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
                  placeholder="000.000.000-00"
                  value={formData.cpf}
                  onChange={(e) => setFormData({...formData, cpf: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 text-sm font-medium mb-2">Endereço</label>
              <input 
                type="text" 
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3.5 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
                placeholder="Rua, Número, Bairro"
                value={formData.endereco}
                onChange={(e) => setFormData({...formData, endereco: e.target.value})}
              />
            </div>

            <div className="pt-4 border-t border-slate-800">
              <button 
                type="submit"
                disabled={carregando}
                className="w-full bg-cyan-500 hover:bg-cyan-400 disabled:bg-cyan-800 text-slate-950 font-bold py-4 rounded-lg flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(6,182,212,0.2)]"
              >
                <Save className="w-5 h-5" />
                {carregando ? "Salvando..." : "Salvar Cliente"}
              </button>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
}