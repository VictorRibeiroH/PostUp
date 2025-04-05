import "dotenv/config"
import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"

// Verificar se a variável de ambiente está definida
if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL não está definida no arquivo .env")
  console.log(
    "Variáveis de ambiente disponíveis:",
    Object.keys(process.env).filter((key) => key.includes("PG") || key.includes("DATABASE")),
  )
  throw new Error("DATABASE_URL não está definida")
}

// Inicializa o cliente SQL
console.log("Conectando ao banco de dados com URL:", process.env.DATABASE_URL.substring(0, 30) + "...")
const sql = neon(process.env.DATABASE_URL)

// Inicializa o cliente Drizzle
export const db = drizzle(sql)

// Função para executar consultas SQL diretamente
export async function query(sqlQuery: string, params: any[] = []) {
  console.log("Executando query:", sqlQuery, "com parâmetros:", params)
  try {
    // Usar sql tagged template literal em vez de db.execute
    const result = await sql.query(sqlQuery, params)

    console.log("Resultado da query:", result)
    return {
      rows: result.rows || [],
      rowCount: result.rowCount,
    }
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

// Funções de utilidade para operações comuns

// Usuários
export async function getUserByEmail(email: string) {
  try {
    const result = await sql`SELECT * FROM users WHERE email = ${email} LIMIT 1`
    return result[0]
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

export async function getUserById(id: number) {
  try {
    const result = await sql`SELECT * FROM users WHERE id = ${id} LIMIT 1`
    return result[0]
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

// Planos
export async function getAllPlans() {
  try {
    const result = await sql`SELECT * FROM plans ORDER BY price ASC`
    return result
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

export async function getPlanById(id: number) {
  try {
    const result = await sql`SELECT * FROM plans WHERE id = ${id} LIMIT 1`
    return result[0]
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

// Segmentos
export async function getAllSegments() {
  try {
    const result = await sql`SELECT * FROM segments ORDER BY name ASC`
    return result
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

// Assinaturas
export async function getUserSubscription(userId: number) {
  try {
    const result = await sql`
      SELECT s.*, p.* 
      FROM subscriptions s
      JOIN plans p ON s.plan_id = p.id
      WHERE s.user_id = ${userId} AND s.status = 'active'
      ORDER BY s.created_at DESC
      LIMIT 1
    `
    return result[0]
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

// Atalhos
export async function getUserShortcuts(userId: number) {
  try {
    const result = await sql`SELECT * FROM shortcuts WHERE user_id = ${userId} ORDER BY position ASC`
    return result
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

// Conteúdos
export async function getUserContents(userId: number) {
  try {
    const result = await sql`SELECT * FROM contents WHERE user_id = ${userId} ORDER BY created_at DESC`
    return result
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

// Notificações
export async function getUserNotifications(userId: number) {
  try {
    const result = await sql`SELECT * FROM notifications WHERE user_id = ${userId} ORDER BY created_at DESC`
    return result
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

// Eventos do planner
export async function getUserPlannerEvents(userId: number) {
  try {
    const result = await sql`SELECT * FROM planner_events WHERE user_id = ${userId} ORDER BY start_date ASC`
    return result
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

// Anúncios
export async function getUserAds(userId: number) {
  try {
    const result = await sql`SELECT * FROM ads WHERE user_id = ${userId} ORDER BY created_at DESC`
    return result
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

