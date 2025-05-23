import { Header } from "@/components/Header";
import { ContactForm } from "@/components/ContactForm";
import { PricingPlans } from "@/components/PricingPlans";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-32 pb-16">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
          {/* Lado esquerdo - Texto */}
          <div className="flex-1 space-y-6">
            <h1 className="text-5xl font-bold leading-tight">
              Seja <span className="text-primary">Você</span> sua <span className="text-primary">Agência de Marketing Digital</span>
            </h1>
          </div>

          {/* Lado direito - Formulário */}
          <div className="flex-1 flex justify-center">
            <ContactForm />
          </div>
        </div>
      </div>

      {/* Planos Section */}
      <PricingPlans />

      {/* Logo no final */}
      <div className="bg-black py-16">
        <div className="container mx-auto px-4 text-right">
          <div className="inline-block">
            <h2 className="text-6xl font-bold text-white">PostUp</h2>
            <p className="text-primary mt-2">FM Marketing</p>
          </div>
        </div>
      </div>
    </main>
  );
}

