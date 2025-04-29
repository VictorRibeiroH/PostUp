"use client";

import Link from 'next/link';
import Image from 'next/image';

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-2">
            {/* Placeholder para a logo */}
            <div className="w-10 h-10 bg-primary rounded-full" />
            <span className="text-2xl font-bold text-primary">PostUp</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <Link href="/funcionalidades" className="text-gray-600 hover:text-primary transition-colors">
            Funcionalidades
          </Link>
          <Link href="/planos" className="text-gray-600 hover:text-primary transition-colors">
            Planos
          </Link>
          <Link href="/fale-conosco" className="text-gray-600 hover:text-primary transition-colors">
            Fale Conosco
          </Link>
          <Link
            href="/register"
            className="bg-primary text-white px-6 py-2 rounded-full hover:bg-primary/90 transition-colors"
          >
            Acessar plataforma
          </Link>
        </nav>
      </div>
    </header>
  );
} 