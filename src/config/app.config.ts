export default()=>({
  DATABASE_HOST:process.env.DATABASE_HOST || 'db',
  DATABASE_PORT:process.env.DATABASE_PORT || 5432,
  DATABASE_USER:process.env.DATABASE_USER || 'postgres',
  DATABASE_PASSWORD:process.env.DATABASE_PASSWORD || 'root',
  DATABASE_NAME:process.env.DATABASE_NAME || 'puul_db',

})