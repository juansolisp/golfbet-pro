import { simplifyDebts, calculateCourseHandicap, getHandicapStrokesForHole, getScoreName } from '../utils';

describe('simplifyDebts', () => {
  it('should simplify simple chain A->B->C to A->C', () => {
    const debts = [
      { from: 'A', to: 'B', amount: 10 },
      { from: 'B', to: 'C', amount: 10 },
    ];

    const simplified = simplifyDebts(debts);
    
    expect(simplified.length).toBe(1);
    expect(simplified[0]).toEqual({ from: 'A', to: 'C', amount: 10 });
  });

  it('should handle multiple debts between same people', () => {
    const debts = [
      { from: 'A', to: 'B', amount: 20 },
      { from: 'B', to: 'A', amount: 10 },
    ];

    const simplified = simplifyDebts(debts);
    
    expect(simplified.length).toBe(1);
    expect(simplified[0].from).toBe('A');
    expect(simplified[0].to).toBe('B');
    expect(simplified[0].amount).toBe(10);
  });

  it('should return empty array when debts cancel out', () => {
    const debts = [
      { from: 'A', to: 'B', amount: 10 },
      { from: 'B', to: 'A', amount: 10 },
    ];

    const simplified = simplifyDebts(debts);
    expect(simplified.length).toBe(0);
  });

  it('should handle complex 4-player scenario', () => {
    const debts = [
      { from: 'A', to: 'B', amount: 10 },
      { from: 'A', to: 'C', amount: 5 },
      { from: 'B', to: 'D', amount: 15 },
      { from: 'C', to: 'D', amount: 5 },
    ];

    const simplified = simplifyDebts(debts);
    const totalIn = debts.reduce((s, d) => s + d.amount, 0);
    const totalSimplified = simplified.reduce((s, d) => s + d.amount, 0);
    
    // Total amounts should be preserved
    expect(totalSimplified).toBeLessThanOrEqual(totalIn);
    // Should have fewer transactions
    expect(simplified.length).toBeLessThanOrEqual(debts.length);
  });
});

describe('calculateCourseHandicap', () => {
  it('should calculate correctly', () => {
    // Standard: HI 15.4, Slope 128, CR 72.5, Par 72
    const result = calculateCourseHandicap(15.4, 128, 72.5, 72);
    expect(result).toBe(18); // 15.4 * (128/113) + (72.5-72) = 17.9 ≈ 18
  });

  it('should handle zero handicap', () => {
    const result = calculateCourseHandicap(0, 113, 72, 72);
    expect(result).toBe(0);
  });

  it('should handle plus handicap', () => {
    const result = calculateCourseHandicap(-2, 130, 73, 72);
    expect(result).toBe(-1); // -2 * (130/113) + 1 = -1.3 ≈ -1
  });
});

describe('getScoreName', () => {
  it('should return correct names', () => {
    expect(getScoreName(2, 4)).toBe('Eagle');
    expect(getScoreName(3, 4)).toBe('Birdie');
    expect(getScoreName(4, 4)).toBe('Par');
    expect(getScoreName(5, 4)).toBe('Bogey');
    expect(getScoreName(6, 4)).toBe('Double Bogey');
    expect(getScoreName(7, 4)).toBe('+3');
    expect(getScoreName(1, 4)).toBe('Albatross');
  });
});
