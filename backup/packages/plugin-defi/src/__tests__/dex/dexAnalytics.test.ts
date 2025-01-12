import { describe, it, expect, beforeEach } from 'vitest';
import { getDEXStats } from '../../dexAnalytics';
import { mockDEXResponse } from '../testUtils';
import { mockedAxios } from '../setup';

describe('DEX Analytics', () => {
  const dexName = 'uniswap';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch DEX statistics successfully', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        totalVolume: 50000000,
        dailyVolume: 1000000,
        volumeChange24h: 0.05
      }
    });

    const result = await getDEXStats(dexName);

    expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    expect(mockedAxios.get).toHaveBeenCalledWith(
      `https://api.llama.fi/overview/dexs/${dexName}`,
      expect.any(Object)
    );
    expect(result).toEqual({
      totalVolume: 50000000,
      dailyVolume: 1000000,
      volumeChange24h: 0.05
    });
  });

  it('should handle API errors gracefully', async () => {
    const error = new Error('API Error');
    mockedAxios.get.mockRejectedValueOnce(error);

    await expect(getDEXStats(dexName)).rejects.toThrow('API Error');
  });
});