import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const databaseConnect = async () => {
  try {
    await prisma.$connect();
    
    const dbUrl = process.env.DATABASE_URL;
    const dbName = dbUrl?.split('/').pop()?.split('?')[0] || 'Unknown';
    
    // Gerçek tablo isimlerini SQL ile al
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `;
    
    const tableNames = tables.map(t => t.table_name);
    
    console.log(' connected ->>>:', dbName);
    console.log('tables:', tableNames);
    
    return 'Database connected';
  } catch (err) {
    console.error(' db connection error:', err);
    return 'db connection error';
  }
};

export const db = {
  user: prisma.user,
  candidate: prisma.candidate,
  form: prisma.form,
};

export default prisma;
