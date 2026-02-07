/**
 * Calculate course handicap from handicap index
 * Formula: Handicap Index × (Slope Rating / 113) + (Course Rating - Par)
 */
export function calculateCourseHandicap(
  handicapIndex: number,
  slopeRating: number,
  courseRating: number,
  par: number
): number {
  const raw = handicapIndex * (slopeRating / 113) + (courseRating - par);
  return Math.round(raw);
}

/**
 * Calculate net score for a hole considering handicap strokes
 */
export function calculateNetScore(
  grossScore: number,
  holeHandicapIndex: number,
  courseHandicap: number,
  totalHoles: number
): number {
  const strokesReceived = getHandicapStrokesForHole(
    holeHandicapIndex,
    courseHandicap,
    totalHoles
  );
  return grossScore - strokesReceived;
}

/**
 * Determine how many handicap strokes a player gets on a specific hole
 */
export function getHandicapStrokesForHole(
  holeHandicapIndex: number,
  courseHandicap: number,
  totalHoles: number = 18
): number {
  if (courseHandicap <= 0) return 0;
  
  // For 18 holes: if courseHandicap >= holeIndex, get 1 stroke
  // If courseHandicap >= holeIndex + 18, get 2 strokes, etc.
  let strokes = 0;
  let remaining = courseHandicap;
  
  while (remaining >= holeHandicapIndex) {
    strokes++;
    remaining -= totalHoles;
  }
  
  return strokes;
}

/**
 * Calculate score relative to par
 */
export function scoreToPar(strokes: number, par: number): number {
  return strokes - par;
}

/**
 * Get score name relative to par
 */
export function getScoreName(strokes: number, par: number): string {
  const diff = strokes - par;
  if (diff <= -3) return 'Albatross';
  if (diff === -2) return 'Eagle';
  if (diff === -1) return 'Birdie';
  if (diff === 0) return 'Par';
  if (diff === 1) return 'Bogey';
  if (diff === 2) return 'Double Bogey';
  return `+${diff}`;
}

/**
 * Simplify debts between players to minimize transactions.
 * Uses a greedy algorithm to find the minimum number of transactions.
 */
export function simplifyDebts(
  debts: Array<{ from: string; to: string; amount: number }>
): Array<{ from: string; to: string; amount: number }> {
  // Calculate net balance for each person
  const balances = new Map<string, number>();
  
  for (const debt of debts) {
    balances.set(debt.from, (balances.get(debt.from) || 0) - debt.amount);
    balances.set(debt.to, (balances.get(debt.to) || 0) + debt.amount);
  }
  
  // Separate into debtors (negative balance) and creditors (positive balance)
  const debtors: Array<{ id: string; amount: number }> = [];
  const creditors: Array<{ id: string; amount: number }> = [];
  
  for (const [id, balance] of balances) {
    if (balance < -0.01) {
      debtors.push({ id, amount: Math.abs(balance) });
    } else if (balance > 0.01) {
      creditors.push({ id, amount: balance });
    }
  }
  
  // Sort both by amount (descending) for greedy optimization
  debtors.sort((a, b) => b.amount - a.amount);
  creditors.sort((a, b) => b.amount - a.amount);
  
  const simplified: Array<{ from: string; to: string; amount: number }> = [];
  
  let i = 0;
  let j = 0;
  
  while (i < debtors.length && j < creditors.length) {
    const transferAmount = Math.min(debtors[i].amount, creditors[j].amount);
    
    if (transferAmount > 0.01) {
      simplified.push({
        from: debtors[i].id,
        to: creditors[j].id,
        amount: Math.round(transferAmount * 100) / 100,
      });
    }
    
    debtors[i].amount -= transferAmount;
    creditors[j].amount -= transferAmount;
    
    if (debtors[i].amount < 0.01) i++;
    if (creditors[j].amount < 0.01) j++;
  }
  
  return simplified;
}

/**
 * Format currency amount
 */
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

/**
 * Generate a random invite code
 */
export function generateInviteCode(length: number = 8): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
