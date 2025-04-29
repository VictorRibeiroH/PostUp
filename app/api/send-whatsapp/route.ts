import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { name, email, whatsapp } = data;

    // Formata o número do WhatsApp (removendo qualquer caractere não numérico)
    const phoneNumber = "5541988957399".replace(/\D/g, "");
    
    // Formata a mensagem com quebras de linha adequadas para o WhatsApp
    const message = `*Novo contato do site PostUp*%0a%0a` + 
                   `👤 *Nome:* ${name}%0a` +
                   `📧 *Email:* ${email}%0a` +
                   `📱 *WhatsApp:* ${whatsapp}`;

    // URL da API do WhatsApp com o formato correto
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

    // Tenta enviar a mensagem
    try {
      const response = await fetch(whatsappUrl);
      if (!response.ok) {
        throw new Error("Falha ao enviar mensagem para o WhatsApp");
      }
    } catch (error) {
      console.error("Erro ao enviar para o WhatsApp:", error);
    }

    return NextResponse.json({ 
      success: true,
      message: "Mensagem enviada com sucesso",
      url: whatsappUrl 
    });

  } catch (error) {
    console.error("Erro ao processar requisição:", error);
    return NextResponse.json({ 
      success: false,
      error: "Erro ao enviar mensagem" 
    }, { 
      status: 500 
    });
  }
} 