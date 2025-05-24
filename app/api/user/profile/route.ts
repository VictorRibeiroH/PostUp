import { NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth"
import { neon } from "@neondatabase/serverless"
import * as z from "zod"

const profileSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório").optional(),
  email: z.string().email("E-mail inválido").optional(),
  segment_id: z.coerce.number().optional(),
})

// Schema para validação do perfil (campos que podem ser atualizados via PATCH)
const profileUpdateSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório").optional(), // Tornando name opcional para permitir atualização parcial
  email: z.string().email("E-mail inválido").optional(), // Email opcional
  segment_id: z.coerce.number().optional(),
  // phone: z.string().optional(), 
})

export async function GET() {
  try {
    const user = await getAuthUser()
    if (!user) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      )
    }

    console.log("Buscando perfil do usuário:", user.id)
    const sql = neon(process.env.DATABASE_URL!)
    const result = await sql`
      SELECT 
        u.id, 
        u.name as user_name, 
        u.email, 
        u.segment_id,
        p.name as plan_name
      FROM users u
      LEFT JOIN subscriptions s ON u.id = s.user_id AND s.status = 'active'
      LEFT JOIN plans p ON s.plan_id = p.id
      WHERE u.id = ${user.id}
    `

    console.log("Resultado da busca:", result)

    if (result.length === 0) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      )
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Erro ao buscar perfil:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await getAuthUser()
    if (!user) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      )
    }

    const body = await request.json()
    console.log("Dados recebidos para atualização:", body)

    // Validar dados (permitindo apenas os campos no schema de update)
    const validatedData = profileUpdateSchema.parse(body)
    console.log("Dados validados:", validatedData)

    // Construir a query de UPDATE dinamicamente
    const updateParts: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (validatedData.name !== undefined) {
      updateParts.push(`name = $${paramIndex++}`);
      values.push(validatedData.name);
    }
    // Nota: Não estamos adicionando email e phone à query de update por enquanto
    if (validatedData.segment_id !== undefined) {
       // Verificar se o segment_id existe na tabela segments antes de atualizar (opcional, mas recomendado)
       // const segmentExists = await checkSegmentExists(validatedData.segment_id);
       // if (!segmentExists) { /* retornar erro */ }
      updateParts.push(`segment_id = $${paramIndex++}`);
      values.push(validatedData.segment_id);
    }

    // Se não houver campos para atualizar, retornar sucesso sem fazer UPDATE
    if (updateParts.length === 0) {
         return NextResponse.json({ message: "Nenhum dado para atualizar" }, { status: 200 });
    }

    // Adicionar updated_at e o id do usuário
    updateParts.push(`updated_at = NOW()`);
    values.push(user.id);

    const sql = neon(process.env.DATABASE_URL!)
    // Executar a query de UPDATE
    // Construindo a query string manualmente e passando os values separadamente
    const setClause = updateParts.join(', ');
    const queryText = `UPDATE users SET ${setClause} WHERE id = $${paramIndex} RETURNING id, name, email, segment_id`;
    console.log("Executing query:", queryText, values);

    // Usando sql.query conforme sugerido pela mensagem de erro
    const result = await sql.query(queryText, values);

    console.log("Resultado da atualização:", result);

    // sql.query retorna um objeto com a propriedade 'rows'
    // sql.query retorna um array de records, acessar diretamente
    if (result.length === 0) {
      return NextResponse.json(
        { error: "Usuário não encontrado após atualização" }, // Mensagem ajustada
        { status: 404 }
      )
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Dados de entrada inválidos", details: error.errors }, // Mensagem ajustada
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Erro interno do servidor ao atualizar perfil" }, // Mensagem ajustada
      { status: 500 }
    )
  }
} 