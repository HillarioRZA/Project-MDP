const { exec } = require('child_process');

console.log('Menjalankan migration untuk fitur verifikasi donasi...');

// Jalankan migration
exec('npx sequelize-cli db:migrate', (error, stdout, stderr) => {
  if (error) {
    console.error('Error menjalankan migration:', error);
    return;
  }
  if (stderr) {
    console.error('Stderr:', stderr);
    return;
  }
  console.log('Migration berhasil dijalankan:', stdout);
}); 