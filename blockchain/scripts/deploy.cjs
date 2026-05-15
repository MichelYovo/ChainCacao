const hre = require("hardhat");

async function main() {
  console.log("Déploiement du contrat CacaoTraceability...");

  const CacaoTraceability = await hre.ethers.getContractFactory("CacaoTraceability");
  const contract = await CacaoTraceability.deploy();

  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log("------------------------------------------");
  console.log("Contrat déployé avec succès !");
  console.log("Adresse du contrat :", address);
  console.log("Réseau : Polygon Amoy Testnet");
  console.log("------------------------------------------");
  console.log("Pensez à copier cette adresse dans votre fichier .env");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
