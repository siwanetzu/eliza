import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { getYieldOpportunities } from '../../yieldAnalytics';
import { rateLimitedRequest } from '../../apiTools';
import axios from 'axios';

jest.mock('../../apiTools');
jest.mock('axios');

describe('Yield Analytics', () => {
    const mockYieldResponse = {
        data: {
            data: [
                {
                    pool: 'USDC-ETH',
                    apy: 15.5,
                    tvlUsd: 100000000,
                    apyPct1D: 0.5,
                    rewards: ['COMP'],
                    minDeposit: 100,
                    lockupPeriod: 0
                },
                {
                    pool: 'DAI-USDC',
                    apy: 8.2,
                    tvlUsd: 50000000,
                    apyPct1D: 0.2,
                    rewards: ['AAVE'],
                    minDeposit: 50,
                    lockupPeriod: 7
                },
                {
                    pool: 'ETH-WBTC',
                    apy: 25.8,
                    tvlUsd: 25000000,
                    apyPct1D: 2.5,
                    rewards: ['UNI', 'SUSHI'],
                    minDeposit: 500,
                    lockupPeriod: 14
                }
            ]
        }
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (rateLimitedRequest as jest.MockedFunction<typeof rateLimitedRequest>).mockImplementation((fn) => fn());
    });

    it('should analyze yield opportunities correctly', async () => {
        (axios.get as jest.MockedFunction<typeof axios.get>)
            .mockResolvedValueOnce(mockYieldResponse);

        const protocol = 'test-protocol';
        const opportunities = await getYieldOpportunities(protocol);

        expect(opportunities).toHaveLength(3);
        expect(opportunities[0]).toMatchObject({
            protocol,
            pool: 'USDC-ETH',
            apy: 15.5,
            tvl: 100000000,
            risk: 'low',
            rewards: ['COMP'],
            requirements: {
                minDeposit: 100,
                lockupPeriod: 0
            }
        });
    });

    it('should handle high risk opportunities correctly', async () => {
        const highRiskResponse = {
            data: {
                data: [
                    {
                        pool: 'RISKY-POOL',
                        apy: 150.5,
                        tvlUsd: 500000,
                        apyPct1D: 25.5,
                        rewards: ['RISK'],
                        minDeposit: 1000,
                        lockupPeriod: 30
                    }
                ]
            }
        };

        (axios.get as jest.MockedFunction<typeof axios.get>)
            .mockResolvedValueOnce(highRiskResponse);

        const protocol = 'test-protocol';
        const opportunities = await getYieldOpportunities(protocol);

        expect(opportunities).toHaveLength(1);
        expect(opportunities[0]).toMatchObject({
            protocol,
            pool: 'RISKY-POOL',
            apy: 150.5,
            tvl: 500000,
            risk: 'high',
            rewards: ['RISK'],
            requirements: {
                minDeposit: 1000,
                lockupPeriod: 30
            }
        });
    });

    it('should handle missing data gracefully', async () => {
        const incompleteResponse = {
            data: {
                data: [
                    {
                        pool: 'INCOMPLETE-POOL'
                    }
                ]
            }
        };

        (axios.get as jest.MockedFunction<typeof axios.get>)
            .mockResolvedValueOnce(incompleteResponse);

        const protocol = 'test-protocol';
        const opportunities = await getYieldOpportunities(protocol);

        expect(opportunities).toHaveLength(1);
        expect(opportunities[0]).toMatchObject({
            protocol,
            pool: 'INCOMPLETE-POOL',
            apy: 0,
            tvl: 0,
            risk: 'high',
            rewards: [],
            requirements: {
                minDeposit: 0,
                lockupPeriod: 0
            }
        });
    });

    it('should handle API errors gracefully', async () => {
        const error = new Error('API Error');
        (axios.get as jest.MockedFunction<typeof axios.get>)
            .mockRejectedValueOnce(error);

        const protocol = 'test-protocol';
        await expect(getYieldOpportunities(protocol)).rejects.toThrow('API Error');
    });

    it('should sort opportunities by APY correctly', async () => {
        const mixedResponse = {
            data: {
                data: [
                    {
                        pool: 'LOW-APY',
                        apy: 5.5,
                        tvlUsd: 1000000,
                        apyPct1D: 0.1,
                        rewards: ['TOKEN'],
                        minDeposit: 100,
                        lockupPeriod: 0
                    },
                    {
                        pool: 'HIGH-APY',
                        apy: 45.5,
                        tvlUsd: 2000000,
                        apyPct1D: 1.5,
                        rewards: ['TOKEN'],
                        minDeposit: 200,
                        lockupPeriod: 7
                    }
                ]
            }
        };

        (axios.get as jest.MockedFunction<typeof axios.get>)
            .mockResolvedValueOnce(mixedResponse);

        const protocol = 'test-protocol';
        const opportunities = await getYieldOpportunities(protocol);

        expect(opportunities).toHaveLength(2);
        expect(opportunities[0].apy).toBeGreaterThan(opportunities[1].apy);
    });
});