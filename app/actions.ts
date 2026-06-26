"use server";

import { db } from "../db"; // Importa a conexão que criamos
import { clientes, emprestimos, controlePagamentos } from "../db/schema"; // Importa todas as tabelas
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm"; // Importação necessária para o leftJoin e where

// Função para salvar o cliente no banco de dados Turso
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
    
    // Atualiza o cache do Next.js para mostrar os dados novos imediatamente
    revalidatePath("/"); 
    return { sucesso: true };
  } catch (erro) {
    console.error("Erro ao salvar no banco:", erro);
    return { sucesso: false, erro: "Falha ao salvar cliente" };
  }
}

// Função para buscar a lista de clientes
export async function buscarClientes() {
  try {
    const listaClientes = await db.select().from(clientes);
    return listaClientes;
  } catch (erro) {
    console.error("Erro ao buscar clientes:", erro);
    return [];
  }
}

// Função para salvar um novo empréstimo
export async function salvarEmprestimoDb(dados: {
  clienteId: string;
  valor: number;
  dias: number;
  total: number;
  dataVencimento: string;
}) {
  try {
    // 1. Insere o empréstimo
    const [novoEmprestimo] = await db.insert(emprestimos).values({
      clienteId: dados.clienteId,
      valorEmprestimo: dados.valor,
      valorTotalPagar: dados.total,
      dataEmprestimo: new Date().toISOString().split('T')[0],
      dataVencimento: dados.dataVencimento,
      prazoDias: dados.dias,
    }).returning();

    // 2. Insere o primeiro registro no controle de pagamentos (a "linha 1" da sua planilha)
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

// Função para buscar os empréstimos e mostrar na tabela
export async function buscarEmprestimosComClientes() {
  try {
    // Busca empréstimos junto com o nome do cliente associado
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

// Função para dar baixa (Receber Pagamento)
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
// --- ADICIONE ESTA FUNÇÃO NO FINAL DO SEU app/actions.ts ---

export async function obterResumoDashboard() {
  try {
    const todosEmprestimos = await db.select().from(emprestimos);
    const pagamentos = await db.select().from(controlePagamentos);

    let capitalAtivo = 0;
    let jurosAReceber = 0;

    // Soma os valores reais do banco
    todosEmprestimos.forEach(emp => {
      capitalAtivo += emp.valorEmprestimo;
      jurosAReceber += (emp.valorTotalPagar - emp.valorEmprestimo);
    });

    // Calcula inadimplência básica (exemplo: pagamentos não feitos)
    let inadimplencia = 0;
    pagamentos.forEach(pag => {
      if (pag.status === "ATRASADO") {
        inadimplencia += pag.valorPrincipal;
      }
    });

    return { 
      capitalAtivo, 
      jurosAReceber, 
      inadimplencia 
    };
  } catch (erro) {
    console.error("Erro ao buscar resumo:", erro);
    return { capitalAtivo: 0, jurosAReceber: 0, inadimplencia: 0 };
  }
}