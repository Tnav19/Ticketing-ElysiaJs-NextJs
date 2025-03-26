import sequelize from "../config/db";
// Fungsi untuk mengecek koneksi ke database
async function checkConnection() {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully!");
  } catch (error) {
    console.error("❌ Failed to connect to database:", error);
  }
}

// Fungsi untuk melihat semua tabel
async function listTables() {
  try {
    const results = await sequelize.query("SHOW TABLES");
    console.log("📋 List of Tables:", results);
  } catch (error) {
    console.error("❌ Failed to get list of tables:", error);
  }
}

// Jalankan fungsi di sini
checkConnection().then(() => listTables());
