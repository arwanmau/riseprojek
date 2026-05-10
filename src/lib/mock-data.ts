export type Role = "farmer" | "collector" | "distributor" | "retailer";

export type BatchStatus =
  | "Harvested"
  | "Inspected"
  | "In Transit"
  | "Warehoused"
  | "Delivered"
  | "Pending Escrow";

export type TimelineStep = {
  status: BatchStatus;
  actor: string;
  location: string;
  timestamp: string;
  txHash: string;
  wallet: string;
};

export type Batch = {
  id: string;
  product: string;
  variety: string;
  weightKg: number;
  status: BatchStatus;
  location: string;
  timestamp: string;
  txHash: string;
  origin: {
    farm: string;
    region: string;
    country: string;
    coords: string;
    farmer: string;
    harvestDate: string;
  };
  timeline: TimelineStep[];
  escrow?: {
    amountUSD: number;
    counterparty: string;
    counterpartyWallet: string;
  };
};

const tx = (s: string) => `0x${s}`;

export const BATCHES: Batch[] = [
  {
    id: "RICE-8842",
    product: "Rice",
    variety: "IR64 Long Grain",
    weightKg: 12000,
    status: "In Transit",
    location: "Port of Surabaya, ID",
    timestamp: "2026-05-09 14:22 UTC",
    txHash: tx("Ab39c1F7e2D8b4A0913f6c2e8aB3Cf91"),
    origin: {
      farm: "Sawah Hijau Cooperative",
      region: "Karawang, West Java",
      country: "Indonesia",
      coords: "-6.32°S, 107.30°E",
      farmer: "Pak Budi Santoso",
      harvestDate: "2026-04-21",
    },
    escrow: {
      amountUSD: 14400,
      counterparty: "Sawah Hijau Cooperative",
      counterpartyWallet: "0x7E1f...A3c2",
    },
    timeline: [
      { status: "Harvested", actor: "Pak Budi Santoso", location: "Karawang, ID", timestamp: "2026-04-21 06:10 UTC", txHash: tx("9F1...c4e2"), wallet: "0x7E1f...A3c2" },
      { status: "Inspected", actor: "AgriCert Inspector #214", location: "Karawang, ID", timestamp: "2026-04-22 11:40 UTC", txHash: tx("4Bd...91Aa"), wallet: "0x21Cb...7d44" },
      { status: "In Transit", actor: "PT Logistik Nusantara", location: "Port of Surabaya, ID", timestamp: "2026-05-09 14:22 UTC", txHash: tx("Ab3...9F1c"), wallet: "0x55e4...1B09" },
    ],
  },
  {
    id: "WHEAT-2207",
    product: "Wheat",
    variety: "Hard Red Winter",
    weightKg: 26500,
    status: "Warehoused",
    location: "Rotterdam Warehouse 4",
    timestamp: "2026-05-08 09:11 UTC",
    txHash: tx("12fA...D80b"),
    origin: {
      farm: "Prairie Gold Farms",
      region: "Kansas",
      country: "USA",
      coords: "38.50°N, 98.31°W",
      farmer: "John Mercer",
      harvestDate: "2026-03-30",
    },
    timeline: [
      { status: "Harvested", actor: "John Mercer", location: "Kansas, USA", timestamp: "2026-03-30 17:02 UTC", txHash: tx("F12...80bA"), wallet: "0x8Aa1...c11D" },
      { status: "Inspected", actor: "USDA Inspector", location: "Wichita, USA", timestamp: "2026-04-02 10:18 UTC", txHash: tx("3Cc...44eF"), wallet: "0x9Cf2...e88B" },
      { status: "In Transit", actor: "OceanFreight Co.", location: "Atlantic Crossing", timestamp: "2026-04-19 02:00 UTC", txHash: tx("77d...10Ab"), wallet: "0x1B2c...8D77" },
      { status: "Warehoused", actor: "Port of Rotterdam", location: "Rotterdam, NL", timestamp: "2026-05-08 09:11 UTC", txHash: tx("AAf...22B0"), wallet: "0x44F1...91aE" },
    ],
  },
  {
    id: "RICE-8901",
    product: "Rice",
    variety: "Basmati Premium",
    weightKg: 8200,
    status: "Pending Escrow",
    location: "Distributor Hub, Singapore",
    timestamp: "2026-05-10 03:45 UTC",
    txHash: tx("CC3...e9F0"),
    origin: {
      farm: "Punjab Heritage Estate",
      region: "Punjab",
      country: "India",
      coords: "30.73°N, 76.78°E",
      farmer: "Harpreet Singh",
      harvestDate: "2026-03-15",
    },
    escrow: {
      amountUSD: 9840,
      counterparty: "Punjab Heritage Estate",
      counterpartyWallet: "0xB31a...29F4",
    },
    timeline: [
      { status: "Harvested", actor: "Harpreet Singh", location: "Punjab, IN", timestamp: "2026-03-15 05:50 UTC", txHash: tx("E11...88Cc"), wallet: "0xB31a...29F4" },
      { status: "Inspected", actor: "FSSAI Inspector", location: "Amritsar, IN", timestamp: "2026-03-17 09:00 UTC", txHash: tx("7d2...3aF8"), wallet: "0x5577...11bC" },
      { status: "In Transit", actor: "BlueSea Shipping", location: "Mumbai → Singapore", timestamp: "2026-04-05 18:30 UTC", txHash: tx("9aF...0011"), wallet: "0x88E2...bb44" },
      { status: "Warehoused", actor: "SG Distributor Hub", location: "Singapore", timestamp: "2026-05-10 03:45 UTC", txHash: tx("CC3...e9F0"), wallet: "0x33D9...A22f" },
    ],
  },
  {
    id: "WHEAT-2310",
    product: "Wheat",
    variety: "Durum",
    weightKg: 17800,
    status: "Delivered",
    location: "Milano Retail Depot",
    timestamp: "2026-05-07 16:00 UTC",
    txHash: tx("DD2...4f10"),
    origin: {
      farm: "Cascina Bianca",
      region: "Puglia",
      country: "Italy",
      coords: "40.79°N, 17.10°E",
      farmer: "Marco Bianchi",
      harvestDate: "2026-03-12",
    },
    timeline: [
      { status: "Harvested", actor: "Marco Bianchi", location: "Puglia, IT", timestamp: "2026-03-12 07:00 UTC", txHash: tx("11a...22Bc"), wallet: "0xCC11...D3e9" },
      { status: "Inspected", actor: "EU AgroCert", location: "Bari, IT", timestamp: "2026-03-13 10:00 UTC", txHash: tx("33b...44Cd"), wallet: "0xAA22...F8c1" },
      { status: "In Transit", actor: "Eurotrans", location: "Bari → Milano", timestamp: "2026-04-22 12:00 UTC", txHash: tx("55c...66De"), wallet: "0x77Bf...E901" },
      { status: "Warehoused", actor: "Milano Hub", location: "Milano, IT", timestamp: "2026-05-01 08:00 UTC", txHash: tx("77d...88Ef"), wallet: "0x12Aa...44b8" },
      { status: "Delivered", actor: "Milano Retail Depot", location: "Milano, IT", timestamp: "2026-05-07 16:00 UTC", txHash: tx("DD2...4f10"), wallet: "0x99C2...0a1F" },
    ],
  },
];

export const ROLE_LABELS: Record<Role, { en: string; local: string }> = {
  farmer: { en: "Farmer", local: "Petani" },
  collector: { en: "Collector", local: "Pengepul" },
  distributor: { en: "Distributor", local: "" },
  retailer: { en: "Retailer", local: "Pengecer" },
};
