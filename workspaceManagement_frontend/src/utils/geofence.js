// Haversine Distance Formula (Formula 4.1)
// Calculates distance d in meters between (lat1, lon1) and (lat2, lon2) with R = 6,371,000m

const EARTH_RADIUS_METERS = 6371000;

export const calculateHaversineDistance = (lat1, lon1, lat2, lon2) => {
  const phi1 = (Number(lat1) * Math.PI) / 180;
  const phi2 = (Number(lat2) * Math.PI) / 180;
  const deltaPhi = ((Number(lat2) - Number(lat1)) * Math.PI) / 180;
  const deltaLambda = ((Number(lon2) - Number(lon1)) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distanceMeters = EARTH_RADIUS_METERS * c;
  return Math.round(distanceMeters * 10) / 10; // Round to 1 decimal place
};

export const isWithinGeofence = (lat1, lon1, lat2, lon2, radiusMeters = 200) => {
  const distance = calculateHaversineDistance(lat1, lon1, lat2, lon2);
  return {
    distance,
    isInside: distance <= radiusMeters,
    allowedRadius: radiusMeters,
  };
};
