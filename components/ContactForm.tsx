"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { useState } from "react";
import { Modal } from "./ui/modal";
import { Loader2 } from "lucide-react";

// Seu número de WhatsApp
const WHATSAPP_NUMBER = "554792876899";

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
] as const;

const formSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("Email inválido"),
  whatsapp: z.string()
    .min(11, "WhatsApp deve ter pelo menos 11 dígitos")
    .regex(/^\d+$/, "Digite apenas números"),
  segment: z.enum(segments, {
    required_error: "Selecione um segmento",
  }),
  message: z.string().min(10, "A mensagem deve ter pelo menos 10 caracteres"),
  terms: z.boolean().refine((val) => val === true, {
    message: "Você precisa aceitar os termos",
  }),
});

type FormData = z.infer<typeof formSchema>;

export function ContactForm() {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      whatsapp: "",
      segment: undefined,
      message: "",
      terms: false,
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);

      // Formata a mensagem com quebras de linha para o WhatsApp
      const message = `*Novo contato do site PostUp*%0a%0a` +
                     `👤 *Nome:* ${data.name}%0a` +
                     `📧 *Email:* ${data.email}%0a` +
                     `📱 *WhatsApp:* ${data.whatsapp}%0a` +
                     `🎯 *Segmento:* ${data.segment}%0a%0a` +
                     `💬 *Mensagem:*%0a${data.message}`;

      // Abre o WhatsApp em uma nova aba com seu número
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank");

      // Mostra o modal de sucesso
      setShowSuccessModal(true);

      // Limpa o formulário
      form.reset();
      setTermsAccepted(false);
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao enviar mensagem. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 bg-black p-8 rounded-lg max-w-md w-full">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-white">Nome e Sobrenome</Label>
          <input
            {...form.register("name")}
            id="name"
            placeholder="Insira seu Nome e Sobrenome"
            className="w-full p-3 rounded-md bg-white/10 text-white placeholder:text-gray-400 border-2 border-transparent focus:border-primary focus:outline-none"
          />
          {form.formState.errors.name && (
            <span className="text-primary text-sm">{form.formState.errors.name.message}</span>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-white">E-mail Profissional</Label>
          <input
            {...form.register("email")}
            id="email"
            type="email"
            placeholder="Insira seu E-mail Profissional"
            className="w-full p-3 rounded-md bg-white/10 text-white placeholder:text-gray-400 border-2 border-transparent focus:border-primary focus:outline-none"
          />
          {form.formState.errors.email && (
            <span className="text-primary text-sm">{form.formState.errors.email.message}</span>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="whatsapp" className="text-white">WhatsApp de Contato</Label>
          <input
            {...form.register("whatsapp")}
            id="whatsapp"
            placeholder="Ex: 41988957399"
            maxLength={11}
            className="w-full p-3 rounded-md bg-white/10 text-white placeholder:text-gray-400 border-2 border-transparent focus:border-primary focus:outline-none"
            onChange={(e) => {
              // Remove caracteres não numéricos
              const value = e.target.value.replace(/\D/g, "");
              e.target.value = value;
              form.setValue("whatsapp", value);
            }}
          />
          {form.formState.errors.whatsapp && (
            <span className="text-primary text-sm">{form.formState.errors.whatsapp.message}</span>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="segment" className="text-white">Segmento</Label>
          <select
            {...form.register("segment")}
            id="segment"
            className="w-full p-3 rounded-md bg-white/10 text-white border-2 border-transparent focus:border-primary focus:outline-none"
          >
            <option value="" className="bg-black">Selecione um segmento</option>
            {segments.map((segment) => (
              <option key={segment} value={segment} className="bg-black">
                {segment}
              </option>
            ))}
          </select>
          {form.formState.errors.segment && (
            <span className="text-primary text-sm">{form.formState.errors.segment.message}</span>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="message" className="text-white">Mensagem</Label>
          <textarea
            {...form.register("message")}
            id="message"
            placeholder="Digite sua mensagem aqui..."
            rows={4}
            className="w-full p-3 rounded-md bg-white/10 text-white placeholder:text-gray-400 border-2 border-transparent focus:border-primary focus:outline-none resize-none"
          />
          {form.formState.errors.message && (
            <span className="text-primary text-sm">{form.formState.errors.message.message}</span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="terms"
            checked={termsAccepted}
            onCheckedChange={(checked) => {
              setTermsAccepted(checked as boolean);
              form.setValue("terms", checked as boolean);
            }}
            className="border-white data-[state=checked]:bg-primary data-[state=checked]:text-white"
          />
          <Label htmlFor="terms" className="text-white text-sm">
            Ao criar minha conta estou de acordo com os Termos de Uso e Política de Privacidade
          </Label>
        </div>
        {form.formState.errors.terms && (
          <span className="text-primary text-sm">{form.formState.errors.terms.message}</span>
        )}

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary text-white hover:bg-primary/90 font-semibold py-3 rounded-full flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              TESTAR GRÁTIS
              <span className="text-xl">→</span>
            </>
          )}
        </Button>
      </form>

      {/* Modal de Sucesso */}
      <Modal isOpen={showSuccessModal}>
        <div className="text-center">
          <h3 className="text-lg font-medium mb-2">Mensagem enviada com sucesso!</h3>
          <p className="text-gray-500 mb-4">
            Entraremos em contato com você em breve através do WhatsApp.
          </p>
          <Button
            onClick={() => setShowSuccessModal(false)}
            className="bg-primary text-white hover:bg-primary/90"
          >
            Fechar
          </Button>
        </div>
      </Modal>
    </>
  );
} 