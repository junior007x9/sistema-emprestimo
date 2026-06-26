"use server";

import { db } from "../db";
import { clientes, emprestimos, controlePagamentos } from "../db/schema";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";

// ==========================================
// FUNÇÕES DE AUTENTICAÇÃO (LOGIN)
// ==========================================

export async function fazerLogin(senha: string) {
  // Puxa a senha do arquivo .env ou usa "admin123" como segurança caso não encontre
  const senhaCorreta = process.env.ADMIN_PASSWORD || "admin123";

  if (senha === senhaCorreta) {
    // No Next.js 15+, cookies() é uma Promise, então precisamos usar await
    const cookieStore = await cookies();
    
    cookieStore.set("auth_token", "autorizado", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 dias em segundos
      path: "/",
    });
    return { sucesso: true };
  }
  return { sucesso: false };
}

export async function fazerLogout() {
  const cookieStore = await cookies();
  cookieStore.delete("auth_token");
}

// ==========================================
// FUNÇÕES DE CLIENTES
// ==========================================

export async function salvarClienteDb(dados: { 
  nome: string; 
  telefone: string; 
  cpf: string; 
  endereco: string; 
}) {
  try {
    await db.insert(clientes).values({
      nome: dados.nome,
      telefone: dados.telefone,
      cpf: dados.cpf,
      endereco: dados.endereco,
    });
    revalidatePath("/"); 
    return { sucesso: true };
  } catch (erro) {
    console.error("Erro ao salvar no banco:", erro);
    return { sucesso: false, erro: "Falha ao salvar cliente" };
  }
}

export async function buscarClientes() {
  try {
    const listaClientes = await db.select().from(clientes);
    return listaClientes;
  } catch (erro) {
    console.error("Erro ao buscar clientes:", erro);
    return [];
  }
}

// ==========================================
// FUNÇÕES DE EMPRÉSTIMOS E PAGAMENTOS
// ==========================================

export async function salvarEmprestimoDb(dados: {
  clienteId: string;
  valor: number;
  dias: number;
  total: number;
  dataVencimento: string;
}) {
  try {
    const [novoEmprestimo] = await db.insert(emprestimos).values({
      clienteId: dados.clienteId,
      valorEmprestimo: dados.valor,
      valorTotalPagar: dados.total,
      dataEmprestimo: new Date().toISOString().split('T')[0],
      dataVencimento: dados.dataVencimento,
      prazoDias: dados.dias,
    }).returning();

    await db.insert(controlePagamentos).values({
      emprestimoId: novoEmprestimo.id,
      numeroLinha: 1,
      data: new Date().toISOString().split('T')[0],
      descricao: "Empréstimo concedido",
      dias: 0,
      valorPrincipal: dados.valor,
      juros: 0,
      total: dados.valor,
      pago: 0,
      saldo: dados.valor,
      status: "PENDENTE"
    });

    return { sucesso: true };
  } catch (erro) {
    console.error("Erro ao salvar empréstimo:", erro);
    return { sucesso: false };
  }
}

export async function buscarEmprestimosComClientes() {
  try {
    const lista = await db.select({
      id: emprestimos.id,
      nomeCliente: clientes.nome,
      valorPrincipal: emprestimos.valorEmprestimo,
      valorTotal: emprestimos.valorTotalPagar,
      dataVencimento: emprestimos.dataVencimento,
      status: controlePagamentos.status,
    })
    .from(emprestimos)
    .leftJoin(clientes, eq(emprestimos.clienteId, clientes.id))
    .leftJoin(controlePagamentos, eq(emprestimos.id, controlePagamentos.emprestimoId));
    
    return lista;
  } catch (erro) {
    console.error("Erro ao buscar empréstimos:", erro);
    return [];
  }
}

export async function baixarParcelaDb(emprestimoId: string) {
  try {
    await db.update(controlePagamentos)
      .set({ status: 'PAGO' })
      .where(eq(controlePagamentos.emprestimoId, emprestimoId));
      
    return { sucesso: true };
  } catch (erro) {
    console.error("Erro ao dar baixa:", erro);
    return { sucesso: false };
  }
}

// ==========================================
// FUNÇÃO DO DASHBOARD (RESUMO)
// ==========================================

export async function obterResumoDashboard() {
  try {
    const todosEmprestimos = await db.select().from(emprestimos);
    const pagamentos = await db.select().from(controlePagamentos);

    let capitalAtivo = 0;
    let jurosAReceber = 0;

    todosEmprestimos.forEach(emp => {
      capitalAtivo += emp.valorEmprestimo;
      jurosAReceber += (emp.valorTotalPagar - emp.valorEmprestimo);
    });

    let inadimplencia = 0;
    pagamentos.forEach(pag => {
      if (pag.status === "ATRASADO") {
        inadimplencia += pag.valorPrincipal;
      }
    });

    return { capitalAtivo, jurosAReceber, inadimplencia };
  } catch (erro) {
    console.error("Erro ao buscar resumo:", erro);
    return { capitalAtivo: 0, jurosAReceber: 0, inadimplencia: 0 };
  }
}