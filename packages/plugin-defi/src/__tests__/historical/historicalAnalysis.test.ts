import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { getProtocolTrends } from '../../historicalAnalysis';
import { rateLimitedRequest } from '../../apiTools';
import axios from 'axios';

jest.mock('../../apiTools');
jest.mock('axios');

describe('Historical Analysis', () => {
    const mockTvlResponse = {
        data: {
            tvl: [
                { date: '2023-01-01', totalLiquidityUSD: 1000000000 },
                { date: '2023-01-07', totalLiquidityUSD: 1100000000 },
                { date: '2023-01-30', totalLiquidityUSD: 1200000000 }
            ],
            chainTvls: {
                total: 10000000000
            }
        }
    };

    const mockVolumeResponse = {
        data: {
            total24h: 50000000,
            total7d: 300000000,
            total30d: 1500000000
        }
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (rateLimitedRequest as jest.MockedFunction<typeof rateLimitedRequest>).mockImplementation((fn) => fn());
    });

    it('should analyze upward trends correctly', async () => {
        (axios.get as jest.MockedFunction<typeof axios.get>)
            .mockResolvedValueOnce(mockTvlResponse)
            .mockResolvedValueOnce(mockVolumeResponse);

        const protocol = 'test-protocol';
        const trends = await getProtocolTrends(protocol);

        expect(trends).toMatchObject({
            protocol,
            tvl: {
                current: 1200000000,
                change7d: expect.any(Number),
                change30d: expect.any(Number),
                trend: 'up'
            },
            volume: {
                current: 50000000,
                change7d: expect.any(Number),
                change30d: expect.any(Number),
                trend: expect.any(String)
            },
            metrics: {
                dominance: expect.any(Number),
                volatility: expect.any(Number),
                growth: expect.any(Number)
            }
        });

        expect(trends.tvl.change7d).toBeGreaterThan(0);
        expect(trends.tvl.change30d).toBeGreaterThan(0);
    });

    it('should analyze downward trends correctly', async () => {
        const downwardTrendResponse = {
            data: {
                tvl: [
                    { date: '2023-01-01', totalLiquidityUSD: 1200000000 },
                    { date: '2023-01-07', totalLiquidityUSD: 1100000000 },
                    { date: '2023-01-30', totalLiquidityUSD: 1000000000 }
                ],
                chainTvls: {
                    total: 10000000000
                }
            }
        };

        const decreasedVolumeResponse = {
            data: {
                total24h: 40000000,
                total7d: 350000000,
                total30d: 1800000000
            }
        };

        (axios.get as jest.MockedFunction<typeof axios.get>)
            .mockResolvedValueOnce(downwardTrendResponse)
            .mockResolvedValueOnce(decreasedVolumeResponse);

        const protocol = 'test-protocol';
        const trends = await getProtocolTrends(protocol);

        expect(trends.tvl.trend).toBe('down');
        expect(trends.tvl.change7d).toBeLessThan(0);
        expect(trends.tvl.change30d).toBeLessThan(0);
    });

    it('should handle missing data gracefully', async () => {
        const incompleteResponse = {
            data: {
                tvl: [],
                chainTvls: {}
            }
        };

        const emptyVolumeResponse = {
            data: {}
        };

        (axios.get as jest.MockedFunction<typeof axios.get>)
            .mockResolvedValueOnce(incompleteResponse)
            .mockResolvedValueOnce(emptyVolumeResponse);

        const protocol = 'test-protocol';
        const trends = await getProtocolTrends(protocol);

        expect(trends).toMatchObject({
            protocol,
            tvl: {
                current: 0,
                change7d: 0,
                change30d: 0,
                trend: 'stable'
            },
            volume: {
                current: 0,
                change7d: 0,
                change30d: 0,
                trend: 'stable'
            },
            metrics: {
                dominance: 0,
                volatility: 0,
                growth: 0
            }
        });
    });

    it('should handle API errors gracefully', async () => {
        const error = new Error('API Error');
        (axios.get as jest.MockedFunction<typeof axios.get>)
            .mockRejectedValueOnce(error);

        const protocol = 'test-protocol';
        await expect(getProtocolTrends(protocol)).rejects.toThrow('API Error');
    });

    it('should calculate volatility correctly', async () => {
        const volatileDataResponse = {
            data: {
                tvl: [
                    { date: '2023-01-01', totalLiquidityUSD: 1000000000 },
                    { date: '2023-01-02', totalLiquidityUSD: 1200000000 },
                    { date: '2023-01-03', totalLiquidityUSD: 900000000 },
                    { date: '2023-01-04', totalLiquidityUSD: 1100000000 }
                ],
                chainTvls: {
                    total: 10000000000
                }
            }
        };

        (axios.get as jest.MockedFunction<typeof axios.get>)
            .mockResolvedValueOnce(volatileDataResponse)
            .mockResolvedValueOnce(mockVolumeResponse);

        const protocol = 'test-protocol';
        const trends = await getProtocolTrends(protocol);

        expect(trends.metrics.volatility).toBeGreaterThan(0);
    });
});