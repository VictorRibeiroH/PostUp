import 'dotenv/config'; // Isso carrega as variáveis do .env
import { neon } from "@neondatabase/serverless";

async function testConnection() {
  try {
    // Verificar se a variável de ambiente está definida
    if (!process.env.DATABASE_URL) {
      console.error("DATABASE_URL não está definida no arquivo .env");
      console.log("Variáveis de ambiente disponíveis:", Object.keys(process.env).filter(key => key.includes('PG') || key.includes('DATABASE')));
      return false;
    }
    
    console.log("Tentando conectar com:", process.env.DATABASE_URL.substring(0, 30) + "...");
    
    const sql = neon(process.env.DATABASE_URL);
    const result = await sql`SELECT NOW()`;
    console.log("Conexão bem-sucedida:", result);
    return true;
  } catch (error) {
    console.error("Erro na conexão:", error);
    return false;
  }
}

testConnection();