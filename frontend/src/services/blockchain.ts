import { ethers } from "ethers";
import dotenv from "dotenv";

dotenv.config();

// Configuration Polygon Mumbai Testnet
const POLYGON_RPC_URL =
  process.env.POLYGON_RPC_URL || "https://rpc-mumbai.maticvigil.com";
const PRIVATE_KEY = process.env.BLOCKCHAIN_PRIVATE_KEY || "";
const CONTRACT_ADDRESS =
  process.env.CONTRACT_ADDRESS || "0x0000000000000000000000000000000000000000";

// ABI du smart contract (généré après déploiement)
const CONTRACT_ABI = [
  "function recordLot(string lotId, uint256 quantity, string origin, string gps, uint8 initialStatus) public",
  "function updateLotStatus(string lotId, uint8 newStatus, string label) public",
  "function getLot(string lotId) public view returns (tuple(string lotId, address producer, uint256 quantity, string origin, string gps, uint256 timestamp, uint8 status, bytes32 contentHash))",
  "function getLotHistory(string lotId) public view returns (tuple(uint8 status, string label, uint256 date, address actor, bytes32 transactionHash)[])",
  "function verifyLot(string lotId) public view returns (bool)",
  "event LotCreated(string indexed lotId, address indexed producer, uint256 timestamp)",
  "event StatusUpdated(string indexed lotId, uint8 newStatus, address indexed actor, uint256 timestamp)",
];

// Mock provider si pas de clé privée
let provider: any;
let wallet: any;
let contract: any;

export async function initBlockchain() {
  try {
    provider = new ethers.JsonRpcProvider(POLYGON_RPC_URL);

    if (PRIVATE_KEY && PRIVATE_KEY !== "") {
      wallet = new ethers.Wallet(PRIVATE_KEY, provider);
      contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, wallet);
      console.log("✅ Blockchain connecté (Polygon Mumbai)");
      return true;
    } else {
      console.log("⚠️  BLOCKCHAIN_PRIVATE_KEY non défini - Mode simulation");
      return false;
    }
  } catch (error) {
    console.error("❌ Erreur initialisation blockchain:", error);
    return false;
  }
}

// Enregistrer un lot sur la blockchain
export async function recordLotOnBlockchain(lotData: any) {
  if (!contract) {
    // Mode simulation - retourner un hash fake
    const fakeHash = "0x" + Math.random().toString(16).substring(2, 66);
    return {
      success: true,
      message: "🎪 Mode simulation (pas de blockchain)",
      transactionHash: fakeHash,
      lotId: lotData.lotId,
    };
  }

  try {
    const tx = await contract.recordLot(
      lotData.lotId,
      lotData.quantity,
      lotData.origin,
      lotData.gps,
      0, // status initial
    );

    const receipt = await tx.wait();
    console.log(`✅ Lot ${lotData.lotId} enregistré sur blockchain`);

    return {
      success: true,
      transactionHash: receipt.hash,
      blockNumber: receipt.blockNumber,
      lotId: lotData.lotId,
    };
  } catch (error: any) {
    console.error("❌ Erreur enregistrement blockchain:", error.message);
    return {
      success: false,
      error: error.message,
    };
  }
}

// Mettre à jour le status d'un lot
export async function updateLotStatusOnBlockchain(
  lotId: string,
  newStatus: number,
  label: string,
) {
  if (!contract) {
    // Mode simulation
    const fakeHash = "0x" + Math.random().toString(16).substring(2, 66);
    return {
      success: true,
      message: "🎪 Mode simulation",
      transactionHash: fakeHash,
    };
  }

  try {
    const tx = await contract.updateLotStatus(lotId, newStatus, label);
    const receipt = await tx.wait();

    console.log(`✅ Status du lot ${lotId} mis à jour sur blockchain`);
    return {
      success: true,
      transactionHash: receipt.hash,
      blockNumber: receipt.blockNumber,
    };
  } catch (error: any) {
    console.error("❌ Erreur mise à jour status:", error.message);
    return {
      success: false,
      error: error.message,
    };
  }
}

// Récupérer les détails d'un lot
export async function getLotFromBlockchain(lotId: string) {
  if (!contract) {
    return {
      success: false,
      message: "Blockchain non connectée (mode simulation)",
    };
  }

  try {
    const lot = await contract.getLot(lotId);
    return {
      success: true,
      lot: {
        lotId: lot.lotId,
        producer: lot.producer,
        quantity: lot.quantity.toString(),
        origin: lot.origin,
        gps: lot.gps,
        timestamp: lot.timestamp.toString(),
        status: lot.status,
      },
    };
  } catch (error: any) {
    console.error("❌ Erreur récupération lot:", error.message);
    return {
      success: false,
      error: error.message,
    };
  }
}

// Récupérer l'historique d'un lot
export async function getLotHistoryFromBlockchain(lotId: string) {
  if (!contract) {
    return { success: false, message: "Blockchain non connectée" };
  }

  try {
    const history = await contract.getLotHistory(lotId);
    return {
      success: true,
      history: history.map((h: any) => ({
        status: h.status,
        label: h.label,
        date: h.date.toString(),
        actor: h.actor,
        transactionHash: h.transactionHash,
      })),
    };
  } catch (error: any) {
    console.error("❌ Erreur récupération historique:", error.message);
    return {
      success: false,
      error: error.message,
    };
  }
}

// Vérifier l'intégrité d'un lot
export async function verifyLotOnBlockchain(lotId: string): Promise<boolean> {
  if (!contract) return false;

  try {
    const isValid = await contract.verifyLot(lotId);
    return isValid;
  } catch (error) {
    console.error("❌ Erreur vérification lot:", error);
    return false;
  }
}

// Générer un vrai hash blockchain
export function generateBlockchainHash(data: string): string {
  return ethers.keccak256(ethers.toUtf8Bytes(data));
}
