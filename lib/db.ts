import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"

// Inicializa o cliente SQL
const sql = neon(process.env.DATABASE_URL!)

// Inicializa o cliente Drizzle
export const db = drizzle(sql)

// Função para executar consultas SQL diretamente
export async function query(sql: string, params: any[] = []) {
  try {
    return await db.execute(sql, params)
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

// Funções de utilidade para operações comuns

// Usuários
export async function getUserByEmail(email: string) {
  const result = await query("SELECT * FROM users WHERE email = $1 LIMIT 1", [email])
  return result.rows[0]
}

export async function getUserById(id: number) {
  const result = await query("SELECT * FROM users WHERE id = $1 LIMIT 1", [id])
  return result.rows[0]
}

// Planos
export async function getAllPlans() {
  const result = await query("SELECT * FROM plans ORDER BY price ASC")
  return result.rows
}

export async function getPlanById(id: number) {
  const result = await query("SELECT * FROM plans WHERE id = $1 LIMIT 1", [id])
  return result.rows[0]
}

// Segmentos
export async function getAllSegments() {
  const result = await query("SELECT * FROM segments ORDER BY name ASC")
  return result.rows
}

// Assinaturas
export async function getUserSubscription(userId: number) {
  const result = await query(
    `SELECT s.*, p.* 
     FROM subscriptions s
     JOIN plans p ON s.plan_id = p.id
     WHERE s.user_id = $1 AND s.status = 'active'
     ORDER BY s.created_at DESC
     LIMIT 1`,
    [userId],
  )
  return result.rows[0]
}

// Atalhos
export async function getUserShortcuts(userId: number) {
  const result = await query("SELECT * FROM shortcuts WHERE user_id = $1 ORDER BY position ASC", [userId])
  return result.rows
}

// Conteúdos
export async function getUserContents(userId: number) {
  const result = await query("SELECT * FROM contents WHERE user_id = $1 ORDER BY created_at DESC", [userId])
  return result.rows
}

// Notificações
export async function getUserNotifications(userId: number) {
  const result = await query("SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC", [userId])
  return result.rows
}

// Eventos do planner
export async function getUserPlannerEvents(userId: number) {
  const result = await query("SELECT * FROM planner_events WHERE user_id = $1 ORDER BY start_date ASC", [userId])
  return result.rows
}

// Anúncios
export async function getUserAds(userId: number) {
  const result = await query("SELECT * FROM ads WHERE user_id = $1 ORDER BY created_at DESC", [userId])
  return result.rows
}

