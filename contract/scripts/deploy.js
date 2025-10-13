const hre = require("hardhat");
require("dotenv").config();

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  const treasuryAddress = process.env.TREASURY_ADDRESS && process.env.TREASURY_ADDRESS !== ""
    ? process.env.TREASURY_ADDRESS
    : deployer.address;

  console.log("🚀 Deploying with:", deployer.address);
  console.log("💰 Treasury address:", treasuryAddress);

  // Deploy EventRegistry
  const EventRegistry = await hre.ethers.getContractFactory("EventRegistry");
  const eventRegistry = await EventRegistry.deploy(treasuryAddress);
  await eventRegistry.waitForDeployment();

  const eventRegistryAddress = await eventRegistry.getAddress();
  console.log("EventRegistry deployed to:", eventRegistryAddress);

  // Deploy AttendanceVerifier
  const AttendanceVerifier = await hre.ethers.getContractFactory(
    "AttendanceVerifier"
  );
  const attendanceVerifier = await AttendanceVerifier.deploy(
    eventRegistryAddress,
    treasuryAddress
  );
  await attendanceVerifier.waitForDeployment();

  const attendanceVerifierAddress = await attendanceVerifier.getAddress();
  console.log("AttendanceVerifier deployed to:", attendanceVerifierAddress);

  // Save addresses
  const addresses = {
    eventRegistry: eventRegistryAddress,
    attendanceVerifier: attendanceVerifierAddress,
    treasury: treasuryAddress,
    network: hre.network.name,
  };

  // === Save to frontend ===
  //   saveFrontendFiles(contractAddresses);

  console.log("\nDeployment Summary:");
  console.log(JSON.stringify(addresses, null, 2));
}

// function saveFrontendFiles(addresses) {
//   const contractsDir = path.join(__dirname, "..", "..", "frontend", "lib", "abis");

//   if (!fs.existsSync(contractsDir)) {
//     fs.mkdirSync(contractsDir, { recursive: true });
//   }

//   fs.writeFileSync(
//     path.join(contractsDir, "contract-addresses.json"),
//     JSON.stringify(addresses, null, 2)
//   );

//   for (const name of Object.keys(addresses)) {
//     try {
//       const artifact = hre.artifacts.readArtifactSync(name);
//       fs.writeFileSync(
//         path.join(contractsDir, `${name}.json`),
//         JSON.stringify(artifact, null, 2)
//       );
//     } catch (error) {
//       console.warn(`⚠️ Could not save ABI for ${name}:`, error.message);
//     }
//   }

//   console.log("📁 Contracts info saved to frontend/lib/abis/");
// }

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
