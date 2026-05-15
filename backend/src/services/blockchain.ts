import { ethers } from "ethers";
import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config();

// Polygon Mumbai testnet config
const RPC_URL =
  process.env.POLYGON_RPC_URL || "https://rpc-mumbai.maticvigil.com";
const BLOCKCHAIN_PRIVATE_KEY = process.env.BLOCKCHAIN_PRIVATE_KEY || "";
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || "";

let provider: ethers.JsonRpcProvider | null = null;
let signer: ethers.Wallet | null = null;
let contract: ethers.Contract | null = null;

// Smart contract ABI (minimal for MVP)
const CONTRACT_ABI = [
  "function recordLot(string lotId, string origin, string quality) public",
  "function updateLotStatus(string lotId, string newStatus) public",
  "function getLot(string lotId) public view returns (string, string, string, uint256, string)",
  "function verifyLot(string lotId) public view returns (bool)",
];

export async function initBlockchain() {
  try {
    provider = new ethers.JsonRpcProvider(RPC_URL);

    if (BLOCKCHAIN_PRIVATE_KEY) {
      signer = new ethers.Wallet(BLOCKCHAIN_PRIVATE_KEY, provider);
      console.log("✅ Blockchain: Real mode (signer connected)");

      if (CONTRACT_ADDRESS) {
        contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
        console.log("✅ Contract connected to:", CONTRACT_ADDRESS);
      }
    } else {
      console.log("⚠️ Blockchain: Simulation mode (no private key)");
    }
  } catch (error) {
    console.error("❌ Blockchain init failed:", error);
  }
}

export async function generateBlockchainHash(data: string): Promise<string> {
  if (contract && BLOCKCHAIN_PRIVATE_KEY) {
    // Real blockchain: use ethers keccak256
    return ethers.id(data);
  } else {
    // Simulation mode: fake hash
    return (
      "0x" + crypto.createHash("sha256").update(data).digest("hex")
    );
  }
}

export async function recordLotOnBlockchain(
  lotId: string,
  origin: string,
  quality: string,
): Promise<string> {
  try {
    if (!contract || !BLOCKCHAIN_PRIVATE_KEY) {
      return `SIMULATED_RECEIPT_${lotId}_${Date.now()}`;
    }

    const tx = await contract.recordLot(lotId, origin, quality);
    const receipt = await tx.wait();
    return receipt?.transactionHash || "tx_hash_unknown";
  } catch (error) {
    console.error("❌ Failed to record lot on blockchain:", error);
    return `ERROR_${lotId}`;
  }
}

export async function updateLotStatusOnBlockchain(
  lotId: string,
  newStatus: string,
): Promise<string> {
  try {
    if (!contract || !BLOCKCHAIN_PRIVATE_KEY) {
      return `SIMULATED_UPDATE_${lotId}`;
    }

    const tx = await contract.updateLotStatus(lotId, newStatus);
    const receipt = await tx.wait();
    return receipt?.transactionHash || "tx_hash_unknown";
  } catch (error) {
    console.error("❌ Failed to update lot status on blockchain:", error);
    return `ERROR_${lotId}`;
  }
}

export async function verifyLotOnBlockchain(lotId: string): Promise<boolean> {
  try {
    if (!contract) {
      return true; // Simulation: always valid
    }

    return await contract.verifyLot(lotId);
  } catch (error) {
    console.error("❌ Failed to verify lot:", error);
    return false;
  }
}
