export interface PriorityCalculationInput {
  wasteType: string;
  quantity: string; // "SMALL" | "MEDIUM" | "LARGE" | "OVERFLOW"
  estimatedWeightKg?: number;
  address?: string;
  historicalReportsCount?: number;
  nearSensitiveZone?: boolean; // school, hospital, market
}

export interface PriorityCalculationResult {
  priorityLevel: "HIGH" | "MEDIUM" | "LOW";
  priorityScore: number; // 0 - 100
  factors: {
    quantityImpact: number;
    hazardImpact: number;
    locationImpact: number;
    frequencyImpact: number;
  };
  explanation: string;
}

export function calculatePriorityScore(
  input: PriorityCalculationInput
): PriorityCalculationResult {
  let score = 20; // baseline

  // 1. Quantity factor (0 - 35 pts)
  let quantityImpact = 10;
  switch (input.quantity?.toUpperCase()) {
    case "OVERFLOW":
      quantityImpact = 35;
      break;
    case "LARGE":
      quantityImpact = 25;
      break;
    case "MEDIUM":
      quantityImpact = 15;
      break;
    case "SMALL":
    default:
      quantityImpact = 8;
      break;
  }
  score += quantityImpact;

  // 2. Waste Type Hazard factor (0 - 25 pts)
  let hazardImpact = 10;
  switch (input.wasteType?.toUpperCase()) {
    case "E_WASTE":
      hazardImpact = 25; // toxic heavy metals / fire hazard
      break;
    case "ORGANIC":
      hazardImpact = 20; // pathogen vector, rapid smell & disease vector
      break;
    case "PLASTIC":
      hazardImpact = 14; // drain choke risk, wind dispersion
      break;
    case "PAPER":
      hazardImpact = 10;
      break;
    case "MIXED":
    default:
      hazardImpact = 12;
      break;
  }
  score += hazardImpact;

  // 3. Sensitive Area / Location Importance factor (0 - 20 pts)
  const addr = (input.address || "").toLowerCase();
  let locationImpact = 5;
  const isHighPriorityZone =
    input.nearSensitiveZone ||
    addr.includes("hospital") ||
    addr.includes("clinic") ||
    addr.includes("school") ||
    addr.includes("college") ||
    addr.includes("market") ||
    addr.includes("bus station") ||
    addr.includes("metro") ||
    addr.includes("temple") ||
    addr.includes("central");

  if (isHighPriorityZone) {
    locationImpact = 20;
  } else if (addr.includes("main road") || addr.includes("avenue")) {
    locationImpact = 12;
  }
  score += locationImpact;

  // 4. Frequency / Recurrence factor (0 - 20 pts)
  const freq = input.historicalReportsCount || 1;
  const frequencyImpact = Math.min(20, freq * 4);
  score += frequencyImpact;

  // Clamp 0 - 100
  const finalScore = Math.min(100, Math.max(10, score));

  let priorityLevel: "HIGH" | "MEDIUM" | "LOW" = "LOW";
  if (finalScore >= 70) {
    priorityLevel = "HIGH";
  } else if (finalScore >= 45) {
    priorityLevel = "MEDIUM";
  }

  let explanation = "Routine localized cleanup profile";
  if (priorityLevel === "HIGH") {
    explanation = isHighPriorityZone
      ? "Critical sanitation priority: high volume near civic/transit hub"
      : "Urgent: high volume or hazardous bio/e-waste accumulation";
  } else if (priorityLevel === "MEDIUM") {
    explanation = "Moderate volume requiring scheduled same-day collection";
  }

  return {
    priorityLevel,
    priorityScore: finalScore,
    factors: {
      quantityImpact,
      hazardImpact,
      locationImpact,
      frequencyImpact,
    },
    explanation,
  };
}
