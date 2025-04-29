"use client";

import Link from 'next/link';

const plans = {
  content: [
    {
      name: "START",
      price: "100",
      period: "MES",
      description: "GESTÃO DE CONTEÚDO COM 4 ARTES PERSONALIZÁVEIS.",
      features: [],
      href: "/register?plan=start"
    },
    {
      name: "PLUS",
      price: "180",
      period: "MES",
      description: "GESTÃO DE CONTEÚDO COM 8 ARTES PERSONALIZÁVEIS.",
      features: [],
      href: "/register?plan=plus"
    },
    {
      name: "PREMIUM",
      price: "249",
      period: "MES",
      description: "GESTÃO DE CONTEÚDO COM 12 ARTES PERSONALIZÁVEIS.",
      features: [],
      href: "/register?plan=premium"
    }
  ],
  complete: [
    {
      name: "Básico",
      price: "250",
      description: "Gestão de conteúdo com 4 artes + anúncios",
      features: [],
      href: "/register?plan=basic"
    },
    {
      name: "Premium",
      price: "500",
      description: "Gestão de conteúdo com 12 artes + anúncios + dashboard",
      features: [],
      href: "/register?plan=premium-complete"
    }
  ]
};

const segments = [
  "Alimentação",
  "Saúde",
  "Esporte",
  "Estética",
  "Beleza e bem estar",
  "Advocacia",
  "Arquitetura",
  "Imóveis",
  "Pet",
  "Moda"
];

const features = [
  "Página Inicial",
  "Caixa de entrada",
  "Conteúdos",
  "Planner",
  "Anúncios",
  "insights - dashboard"
];

export function PricingPlans() {
  return (
    <div className="bg-black text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Planos Conteúdo */}
          <div className="space-y-8">
            <h2 className="text-2xl font-bold mb-8">PLANOS CONTEÚDO</h2>
            {plans.content.map((plan) => (
              <div key={plan.name} className="border border-primary p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="text-primary text-2xl font-bold mb-4">
                  R${plan.price}
                  <span className="text-sm text-white">/{plan.period}</span>
                </div>
                <p className="text-sm mb-6">{plan.description}</p>
                <Link 
                  href={plan.href}
                  className="block w-full text-center bg-primary text-white py-2 rounded-full hover:bg-primary/90 transition-colors"
                >
                  Escolher Plano
                </Link>
              </div>
            ))}
          </div>

          {/* Planos Completo */}
          <div className="space-y-8">
            <h2 className="text-2xl font-bold mb-8">PLANOS COMPLETO</h2>
            {plans.complete.map((plan) => (
              <div key={plan.name} className="border border-primary p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="text-primary text-2xl font-bold mb-4">
                  R${plan.price}
                </div>
                <p className="text-sm mb-6">{plan.description}</p>
                <Link 
                  href={plan.href}
                  className="block w-full text-center bg-primary text-white py-2 rounded-full hover:bg-primary/90 transition-colors"
                >
                  Escolher Plano
                </Link>
              </div>
            ))}
          </div>

          {/* Segmentos */}
          <div>
            <h2 className="text-2xl font-bold mb-8">SEGMENTOS</h2>
            <ul className="space-y-2">
              {segments.map((segment) => (
                <li key={segment} className="flex items-center gap-2">
                  <span className="text-primary">*</span>
                  {segment}
                </li>
              ))}
            </ul>
          </div>

          {/* Funcionalidades */}
          <div>
            <h2 className="text-2xl font-bold mb-8">FUNCIONALIDADES</h2>
            <ul className="space-y-2">
              {features.map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <span className="text-primary">*</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 