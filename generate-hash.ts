import * as bcrypt from 'bcrypt';

async function main() {
  const hash = await bcrypt.hash('password12345', 10);
  console.log(hash);
  // $2b$10$5X625ILH4MxFBcFyHAn9tuCToVMoKsE.x3Zi7FUxvfIQ530rtS3b2
}

main();
