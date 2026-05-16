export type Role = 'Agriculteur' | 'Coopérative' | 'Transporteur' | 'Exportateur' | 'Ministère' | 'Acheteur EU' | 'Administrateur';

export interface User {
  id: string;
  email: string;
  role: Role;
  name: string;
  color: string;
}

export interface LotHistoryItem {
  status: number;
  label: string;
  date: string;
  actor: string;
  hash: string;
}

export interface Lot {
  id: string;
  producerId: string;
  producerName: string;
  quantity: number;
  origin: string;
  gps: string;
  timestamp: string;
  status: number;
  note?: string;
  history: LotHistoryItem[];
  photos?: string[];
}

export interface Stats {
  totalLots: number;
  totalQuantity: number;
  activeTransports: number;
  certifiedLots: number;
}
