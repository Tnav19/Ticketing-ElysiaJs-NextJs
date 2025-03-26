import sequelize from "../config/db";
import { Karyawan } from "../models/karyawan";

// Fungsi untuk menampilkan isi tabel secara dinamis
async function viewTable(tableName: string) {
    try {
      console.log(`📥 Retrieving data from table ${tableName}...`);
      
      const [results] = await sequelize.query(`SELECT * FROM \`${tableName}\`;`);
      
      console.log(`📊 Table ${tableName} contents:`, results);
    } catch (error) {
      console.error(`❌ Failed to get table contents for ${tableName}:`, error);
    }
  }
  
  // Ambil nama tabel dari argumen CLI
  const tableName = process.argv[2];
  
  if (!tableName) {
    console.error("❌ Please provide a table name. Example: bun run viewTable.ts employee");
    process.exit(1);
  }
  
  viewTable(tableName);