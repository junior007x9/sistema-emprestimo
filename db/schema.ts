import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';
import { randomUUID } from 'crypto';

// 1. Tabela de Clientes (Dados do Cliente)
export const clientes = sqliteTable('clientes', {
  id: text('id').primaryKey().$defaultFn(() => randomUUID()),
  nome: text('nome').notNull(),
  telefone: text('telefone'),
  cpf: text('cpf'),
  endereco: text('endereco'),
  criadoEm: integer('criado_em', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// 2. Tabela de Empréstimos (Dados do Empréstimo)
export const emprestimos = sqliteTable('emprestimos', {
  id: text('id').primaryKey().$defaultFn(() => randomUUID()),
  clienteId: text('cliente_id')
    .notNull()
    .references(() => clientes.id, { onDelete: 'cascade' }),
  valorEmprestimo: real('valor_emprestimo').notNull(), // Ex: 1000.00
  taxaJuros: real('taxa_juros').notNull().default(25.0), // Ex: 25% simples
  prazoDias: integer('prazo_dias').notNull().default(30), // Ex: 30 dias
  dataEmprestimo: text('data_emprestimo').notNull(), // Formato: YYYY-MM-DD
  dataVencimento: text('data_vencimento').notNull(), // Formato: YYYY-MM-DD
  valorTotalPagar: real('valor_total_pagar').notNull(), // Ex: 1250.00
  observacoes: text('observacoes'),
  criadoEm: integer('criado_em', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// 3. Tabela de Controle de Pagamentos (Mapeia a tabela inferior da sua imagem)
export const controlePagamentos = sqliteTable('controle_pagamentos', {
  id: text('id').primaryKey().$defaultFn(() => randomUUID()),
  emprestimoId: text('emprestimo_id')
    .notNull()
    .references(() => emprestimos.id, { onDelete: 'cascade' }),
  numeroLinha: integer('numero_linha').notNull(), // Nº (1, 2, 3...)
  data: text('data').notNull(), // DATA
  descricao: text('descricao').notNull(), // DESCRIÇÃO (Ex: "Empréstimo concedido", "Vencimento")
  dias: integer('dias').notNull(), // DIAS (0, 30...)
  valorPrincipal: real('valor_principal').notNull(), // VALOR PRINCIPAL (R$)
  juros: real('juros').notNull(), // JUROS (R$)
  total: real('total').notNull(), // TOTAL (R$)
  pago: real('pago').notNull().default(0.0), // PAGO (R$)
  saldo: real('saldo').notNull(), // SALDO (R$)
  status: text('status').notNull().default('PENDENTE'), // STATUS (PENDENTE, PAGO, ou '-')
});

// ==========================================
// Definição de Relacionamentos (Drizzle Relations)
// ==========================================

export const clientesRelations = relations(clientes, ({ many }) => ({
  emprestimos: many(emprestimos),
}));

export const emprestimosRelations = relations(emprestimos, ({ one, many }) => ({
  cliente: one(clientes, {
    fields: [emprestimos.clienteId],
    references: [clientes.id],
  }),
  pagamentos: many(controlePagamentos),
}));

export const controlePagamentosRelations = relations(controlePagamentos, ({ one }) => ({
  emprestimo: one(emprestimos, {
    fields: [controlePagamentos.emprestimoId],
    references: [emprestimos.id],
  }),
}));