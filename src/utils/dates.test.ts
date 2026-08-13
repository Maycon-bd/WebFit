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

  it('crosses year boundaries without skipping months', () => {
    expect(getRollingMonths(new Date(2026, 0, 15), 3)).toEqual([
      { label: 'Nov/25', month: 11, year: 2025 },
      { label: 'Dez/25', month: 12, year: 2025 },
      { label: 'Jan/26', month: 1, year: 2026 },
    ]);
  });

  it('returns an empty window for negative and fractional counts below one', () => {
    expect(getRollingMonths(new Date(2026, 0, 1), -2)).toEqual([]);
    expect(getRollingMonths(new Date(2026, 0, 1), 0.5)).toEqual([]);
  });
});
