"use client";

import { useEffect, useState } from "react";
import { buscarClientes } from "../actions"; // ← Correção exata do caminho aqui
import { ArrowLeft, Users, User, Phone, FileDigit, MapPin } from "lucide-react";
import Link from "next/link";

export default function ListaClientes() {
  const [clientes, setClientes] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregar() {
      const dados = await buscarClientes();
      setClientes(dados);
      setCarregando(false);
    }
    carregar();
  }, []);

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
              <Users className="w-8 h-8 text-cyan-500" />
              Meus Clientes
            </h1>
          </div>

          <Link 
            href="/clientes/novo" 
            className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-6 py-3 rounded-lg transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)]"
          >
            + Novo Cliente
          </Link>
        </header>

        {/* Tabela de Clientes */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-800/50 text-slate-400 text-xs uppercase tracking-wider">
                <tr>
                  <th className="p-5 font-medium flex items-center gap-2"><User className="w-4 h-4"/> Nome</th>
                  <th className="p-5 font-medium"><Phone className="w-4 h-4 inline mr-2"/>Telefone</th>
                  <th className="p-5 font-medium"><FileDigit className="w-4 h-4 inline mr-2"/>CPF</th>
                  <th className="p-5 font-medium"><MapPin className="w-4 h-4 inline mr-2"/>Endereço</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {carregando ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-slate-500">
                      Carregando clientes...
                    </td>
                  </tr>
                ) : clientes.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-slate-500">
                      Nenhum cliente cadastrado ainda.
                    </td>
                  </tr>
                ) : (
                  clientes.map((cliente) => (
                    <tr key={cliente.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="p-5 font-medium text-white">{cliente.nome}</td>
                      <td className="p-5 text-slate-300">{cliente.telefone || "Não informado"}</td>
                      <td className="p-5 text-slate-300">{cliente.cpf || "Não informado"}</td>
                      <td className="p-5 text-slate-300">{cliente.endereco || "Não informado"}</td>
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