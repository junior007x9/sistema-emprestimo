import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const caminhoAtual = request.nextUrl.pathname;
  
  // A única página liberada sem senha é o /login
  const isCaminhoLogin = caminhoAtual === '/login';

  // Verifica se o usuário tem o cookie de autenticação
  const token = request.cookies.get('auth_token')?.value;

  // Se tentar acessar o sistema sem o token, manda pro login
  if (!isCaminhoLogin && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Se tentar acessar a tela de login já estando logado, manda pro Dashboard
  if (isCaminhoLogin && token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

// Configura quais páginas este segurança vai proteger
export const config = {
  matcher: [
    '/',
    '/clientes/:path*',
    '/emprestimos/:path*',
    '/login'
  ]
}