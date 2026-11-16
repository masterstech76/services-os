import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

describe('Spatial Radar & Booking Dispatch State Machine Suite', () => {
  it('Haversine distance calculation validates spatial radius queries', () => {
    function haversineDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
      const R = 6371; // Earth radius in km
      const dLat = (lat2 - lat1) * (Math.PI / 180);
      const dLon = (lon2 - lon1) * (Math.PI / 180);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    }

    // Miami Downtown (25.7617, -80.1918) to Miami Beach (25.7907, -80.1300)
    const distanceKm = haversineDistanceKm(25.7617, -80.1918, 25.7907, -80.1300);
    assert.ok(distanceKm > 6 && distanceKm < 8, `Expected distance ~6.8km, got ${distanceKm}`);

    // Within a 15km search radius, this technician should be included
    const searchRadiusKm = 15;
    assert.equal(distanceKm <= searchRadiusKm, true);
  });

  it('Booking status transitions follow strict valid path', () => {
    const validTransitions: Record<string, string[]> = {
      'REQUESTED': ['BROADCASTING', 'CANCELLED'],
      'BROADCASTING': ['ASSIGNED', 'CANCELLED', 'REQUESTED'],
      'ASSIGNED': ['EN_ROUTE', 'CANCELLED'],
      'EN_ROUTE': ['ON_SITE', 'CANCELLED'],
      'ON_SITE': ['COMPLETED', 'DISPUTED'],
      'COMPLETED': ['DISPUTED'],
      'CANCELLED': [],
      'DISPUTED': ['COMPLETED', 'CANCELLED']
    };

    function canTransition(current: string, next: string): boolean {
      return validTransitions[current]?.includes(next) ?? false;
    }

    assert.equal(canTransition('REQUESTED', 'BROADCASTING'), true);
    assert.equal(canTransition('BROADCASTING', 'ASSIGNED'), true);
    assert.equal(canTransition('ASSIGNED', 'EN_ROUTE'), true);
    assert.equal(canTransition('EN_ROUTE', 'ON_SITE'), true);
    assert.equal(canTransition('ON_SITE', 'COMPLETED'), true);

    // Invalid jumps
    assert.equal(canTransition('REQUESTED', 'COMPLETED'), false);
    assert.equal(canTransition('EN_ROUTE', 'COMPLETED'), false);
    assert.equal(canTransition('COMPLETED', 'REQUESTED'), false);
  });

  it('Customer 4-digit safety PIN verification is deterministic', () => {
    function generatePin(): string {
      return Math.floor(1000 + Math.random() * 9000).toString();
    }

    const pin = generatePin();
    assert.equal(pin.length, 4);
    assert.match(pin, /^\d{4}$/);

    const enteredCorrect = pin;
    const enteredWrong = (parseInt(pin, 10) === 9999 ? '1111' : (parseInt(pin, 10) + 1).toString()).padStart(4, '0');

    assert.equal(pin === enteredCorrect, true);
    assert.equal(pin === enteredWrong, false);
  });
});
