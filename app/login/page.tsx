"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Wallet, Lock, Loader2, ArrowRight } from "lucide-react";
import { fazerLogin } from "../actions";

export default function Login() {
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const router = useRouter();

  const handleEntrar = async (e: React.FormEvent) => {
    e.preventDefault();
    setCarregando(true);
    setErro(false);

    const resultado = await fazerLogin(senha);

    if (resultado.sucesso) {
      // Se a senha estiver correta, limpa o estado e manda pro Dashboard
      router.push("/");
    } else {
      // Se errar, mostra a mensagem de erro
      setErro(true);
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 font-sans text-slate-200">
      <div className="max-w-md w-full">
        
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-3xl tracking-wider">
            <Wallet className="w-10 h-10" />
            <span>PAY<span className="text-white">TRACK</span></span>
          </div>
        </div>

        {/* Formulário de Login */}
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-emerald-500"></div>
          
          <h1 className="text-2xl font-bold text-white mb-2">Acesso Restrito</h1>
          <p className="text-slate-400 mb-8">Digite sua senha mestre para acessar o sistema.</p>

          <form onSubmit={handleEntrar} className="space-y-6">
            <div>
              <label className="block text-slate-400 text-sm font-medium mb-2 flex items-center gap-2">
                <Lock className="w-4 h-4" /> Senha de Acesso
              </label>
              <input
                type="password"
                required
                className={`w-full bg-slate-950 border ${erro ? 'border-rose-500' : 'border-slate-800'} rounded-lg p-4 text-white text-lg tracking-widest outline-none focus:border-cyan-500 transition-all`}
                placeholder="••••••••"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
              {erro && (
                <p className="text-rose-500 text-sm mt-2 font-medium">Senha incorreta. Tente novamente.</p>
              )}
            </div>

            <button
              type="submit"
              disabled={carregando || !senha}
              className="w-full bg-cyan-500 hover:bg-cyan-400 disabled:bg-cyan-900/50 disabled:text-cyan-700 text-slate-950 font-bold py-4 rounded-lg flex items-center justify-center gap-2 transition-all"
            >
              {carregando ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Processando...
                </>
              ) : (
                <>
                  Entrar no Sistema <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </div>
        
        <p className="text-center text-slate-600 text-sm mt-8">
          Ambiente Seguro • Acesso Exclusivo
        </p>

      </div>
    </div>
  );
}