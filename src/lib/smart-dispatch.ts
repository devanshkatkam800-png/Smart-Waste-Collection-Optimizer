export interface WorkerCandidate {
  id: string;
  name: string;
  phone: string;
  vehicleType: string;
  status: string;
  currentLat: number;
  currentLng: number;
  activeMissionsCount: number;
  maxCapacityKg: number;
}

export interface ComplaintTarget {
  id: string;
  ticketNo: string;
  latitude: number;
  longitude: number;
  priorityLevel: string;
  priorityScore: number;
  estimatedWeightKg: number;
}

export interface AssignmentRecommendation {
  workerId: string;
  workerName: string;
  workerPhone: string;
  distanceKm: number;
  workload: number;
  suitabilityScore: number; // 0 - 100
  reason: string;
}

// Haversine formula to compute great-circle distance between two points in km
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Math.round(d * 100) / 100;
}

export function rankWorkersForComplaint(
  complaint: ComplaintTarget,
  workers: WorkerCandidate[]
): AssignmentRecommendation[] {
  const eligible = workers.filter(
    (w) => w.status === "ACTIVE" || w.status === "ON_DUTY"
  );

  const results: AssignmentRecommendation[] = eligible.map((w) => {
    const dist = calculateHaversineDistance(
      complaint.latitude,
      complaint.longitude,
      w.currentLat,
      w.currentLng
    );

    // Scoring formula:
    // Proximity: up to 50 pts (closer is better, e.g. within 2km gets 50, drops to 10 at 15km)
    const proximityScore = Math.max(0, 50 - dist * 3);

    // Workload: up to 35 pts (0 missions = 35, 1 mission = 25, 2 missions = 15, >=4 missions = 0)
    const workloadScore = Math.max(0, 35 - w.activeMissionsCount * 10);

    // Status bonus: 15 pts if ACTIVE, 5 pts if ON_DUTY
    const statusScore = w.status === "ACTIVE" ? 15 : 5;

    const totalScore = Math.round(
      Math.min(100, proximityScore + workloadScore + statusScore)
    );

    let reason = `${dist} km away with ${w.activeMissionsCount} active mission(s)`;
    if (dist < 3 && w.activeMissionsCount === 0) {
      reason = `Optimal: Immediate proximity (${dist} km) & zero pending workload`;
    } else if (dist < 5) {
      reason = `Close range (${dist} km), capacity available`;
    }

    return {
      workerId: w.id,
      workerName: w.name,
      workerPhone: w.phone,
      distanceKm: dist,
      workload: w.activeMissionsCount,
      suitabilityScore: totalScore,
      reason,
    };
  });

  return results.sort((a, b) => b.suitabilityScore - a.suitabilityScore);
}
