import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';

// Para a aplicação Next.js, usamos o process.env.
// Quando subir para a Vercel, basta configurar estas variáveis lá no painel.
const client = createClient({
  url: process.env.TURSO_DATABASE_URL || "libsql://sistema-emprestimo-junior007x9.aws-us-east-1.turso.io",
  authToken: process.env.TURSO_AUTH_TOKEN || "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3ODI0ODk3MjksImlkIjoiMDE5ZjA0YTktYTkwMS03ZGU5LTkyYWMtMGYwZjNhMDg4ZTIxIiwicmlkIjoiZjBiYWM1MmUtZWE0OC00NzE5LTg5NjctMjFhNTdmZjVkYzNjIn0.RSJVxdEv8O7RXrq0Xm-ff0HXk97WfIjWJVG2D2-K5U_4LXYHFnpIE0KkeZArQahzQc3qCw9X60gkpKuyFVQGDw",
});

export const db = drizzle(client, { schema });