/**
 * GateLink Official Flat Slab Pricing Engine
 */
export function calculateSocietyMonthlyFee(flatCount) {
  const count = Math.max(1, Number(flatCount) || 1);

  if (count <= 12) return 1000;
  if (count <= 20) return 1500;
  if (count <= 30) return 2000;
  if (count <= 40) return 2500;
  if (count <= 50) return 3000;
  if (count <= 60) return 3500;
  if (count <= 75) return 4000;
  if (count <= 100) return 4500;
  if (count <= 125) return 5000;
  if (count <= 150) return 5500;
  if (count <= 200) return 6000;
  if (count <= 250) return 6500;
  if (count <= 300) return 7500;

  // 301+ flats: ₹7,500 base + ₹20 for every flat above 300
  return 7500 + (count - 300) * 20;
}

export const PRICING_SLABS = [
  { range: '1 – 12 flats', price: 1000, effective: '₹83 – ₹1,000' },
  { range: '13 – 20 flats', price: 1500, effective: '₹75 – ₹115' },
  { range: '21 – 30 flats', price: 2000, effective: '₹67 – ₹95' },
  { range: '31 – 40 flats', price: 2500, effective: '₹63 – ₹81' },
  { range: '41 – 50 flats', price: 3000, effective: '₹60 – ₹73' },
  { range: '51 – 60 flats', price: 3500, effective: '₹58 – ₹69' },
  { range: '61 – 75 flats', price: 4000, effective: '₹53 – ₹66' },
  { range: '76 – 100 flats', price: 4500, effective: '₹45 – ₹59' },
  { range: '101 – 125 flats', price: 5000, effective: '₹40 – ₹50' },
  { range: '126 – 150 flats', price: 5500, effective: '₹37 – ₹44' },
  { range: '151 – 200 flats', price: 6000, effective: '₹30 – ₹40' },
  { range: '201 – 250 flats', price: 6500, effective: '₹26 – ₹32' },
  { range: '251 – 300 flats', price: 7500, effective: '₹25 – ₹30' },
  { range: '301+ flats', price: 7500, effective: '₹7,500 + ₹20/flat' },
];
