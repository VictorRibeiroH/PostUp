import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Image
              src="/placeholder.svg?height=40&width=40"
              alt="PostUp Logo"
              width={40}
              height={40}
              className="rounded-md"
            />
            <span className="text-2xl font-bold text-primary">PostUp</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Começar Agora</Button>
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <section className="py-20">
          <div className="container flex flex-col items-center text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Transforme seu Marketing Digital com a <span className="text-primary">PostUp</span>
            </h1>
            <p className="text-xl md:text-2xl mb-12 max-w-3xl">
              Gerencie seu conteúdo, anúncios e estratégias de marketing em um só lugar. Tudo personalizado para o seu
              segmento de mercado.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/register">
                <Button size="lg" className="text-lg px-8">
                  Começar Agora
                </Button>
              </Link>
              <Link href="#planos">
                <Button size="lg" variant="outline" className="text-lg px-8">
                  Ver Planos
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-20 bg-muted" id="planos">
          <div className="container">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
              Escolha o Plano Ideal para o Seu Negócio
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Plano Start */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6 border-b">
                  <h3 className="text-2xl font-bold mb-2">Start</h3>
                  <p className="text-3xl font-bold mb-4">
                    R$ 100<span className="text-sm font-normal">/mês</span>
                  </p>
                  <p className="text-muted-foreground">Ideal para quem está começando no marketing digital</p>
                </div>
                <div className="p-6">
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <svg
                        className="w-5 h-5 text-primary mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                      Gestão de conteúdo
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="w-5 h-5 text-primary mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                      4 artes personalizáveis
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="w-5 h-5 text-primary mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                      Planner básico
                    </li>
                  </ul>
                  <div className="mt-6">
                    <Link href="/register?plan=1">
                      <Button className="w-full">Escolher Plano</Button>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Plano Plus */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6 border-b">
                  <h3 className="text-2xl font-bold mb-2">Plus</h3>
                  <p className="text-3xl font-bold mb-4">
                    R$ 180<span className="text-sm font-normal">/mês</span>
                  </p>
                  <p className="text-muted-foreground">Para negócios em crescimento</p>
                </div>
                <div className="p-6">
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <svg
                        className="w-5 h-5 text-primary mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                      Gestão de conteúdo
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="w-5 h-5 text-primary mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                      8 artes personalizáveis
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="w-5 h-5 text-primary mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                      Planner completo
                    </li>
                  </ul>
                  <div className="mt-6">
                    <Link href="/register?plan=2">
                      <Button className="w-full">Escolher Plano</Button>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Plano Premium Complete */}
              <div className="bg-primary/5 rounded-lg shadow-lg overflow-hidden border-2 border-primary">
                <div className="p-6 border-b bg-primary text-white">
                  <h3 className="text-2xl font-bold mb-2">Premium Complete</h3>
                  <p className="text-3xl font-bold mb-4">
                    R$ 500<span className="text-sm font-normal">/mês</span>
                  </p>
                  <p className="text-primary-foreground">Solução completa para seu negócio</p>
                </div>
                <div className="p-6">
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <svg
                        className="w-5 h-5 text-primary mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                      Gestão de conteúdo
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="w-5 h-5 text-primary mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                      12 artes personalizáveis
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="w-5 h-5 text-primary mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                      Planner completo
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="w-5 h-5 text-primary mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                      Gestão de anúncios
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="w-5 h-5 text-primary mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                      Dashboard de insights
                    </li>
                  </ul>
                  <div className="mt-6">
                    <Link href="/register?plan=5">
                      <Button className="w-full">Escolher Plano</Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Segmentos que Atendemos</h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {[
                "Alimentação",
                "Saúde",
                "Esporte",
                "Estética",
                "Beleza e Bem Estar",
                "Advocacia",
                "Arquitetura",
                "Imóveis",
                "Pet",
                "Moda",
              ].map((segment, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow p-6 text-center hover:shadow-lg transition-shadow"
                >
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-primary text-2xl font-bold">{segment.charAt(0)}</span>
                  </div>
                  <h3 className="font-semibold">{segment}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer className="bg-gray-900 text-white py-12">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-8 md:mb-0">
              <div className="flex items-center gap-2 mb-4">
                <Image
                  src="/placeholder.svg?height=40&width=40"
                  alt="PostUp Logo"
                  width={40}
                  height={40}
                  className="rounded-md bg-white"
                />
                <span className="text-2xl font-bold text-primary">PostUp</span>
              </div>
              <p className="max-w-xs">Transformando o marketing digital para pequenos e médios negócios.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h4 className="font-semibold text-lg mb-4">Empresa</h4>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="hover:text-primary">
                      Sobre nós
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-primary">
                      Contato
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-primary">
                      Blog
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-lg mb-4">Recursos</h4>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="hover:text-primary">
                      Guias
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-primary">
                      Tutoriais
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-primary">
                      FAQ
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-lg mb-4">Legal</h4>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="hover:text-primary">
                      Termos
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-primary">
                      Privacidade
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-400">
            <p>&copy; {new Date().getFullYear()} PostUp. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

