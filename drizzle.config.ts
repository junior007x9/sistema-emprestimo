import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './db/schema.ts',
  out: './drizzle',
  dialect: 'turso',
  dbCredentials: {
    url: "libsql://sistema-emprestimo-junior007x9.aws-us-east-1.turso.io",
    authToken: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3ODI0ODk3MjksImlkIjoiMDE5ZjA0YTktYTkwMS03ZGU5LTkyYWMtMGYwZjNhMDg4ZTIxIiwicmlkIjoiZjBiYWM1MmUtZWE0OC00NzE5LTg5NjctMjFhNTdmZjVkYzNjIn0.RSJVxdEv8O7RXrq0Xm-ff0HXk97WfIjWJVG2D2-K5U_4LXYHFnpIE0KkeZArQahzQc3qCw9X60gkpKuyFVQGDw",
  },
});