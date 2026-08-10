import { describe, expect, it } from 'vitest';
import { getRollingMonths } from './dates';

describe('getRollingMonths', () => {
  it('returns a rolling window ending in the reference month', () => {
    const months = getRollingMonths(new Date(2026, 7, 10), 13);

    expect(months).toHaveLength(13);
    expect(months[0]).toEqual({ label: 'Ago/25', month: 8, year: 2025 });
    expect(months[months.length - 1]).toEqual({ label: 'Ago/26', month: 8, year: 2026 });
  });

  it('rejects invalid counts', () => {
    expect(getRollingMonths(new Date(), 0)).toEqual([]);
  });
});
