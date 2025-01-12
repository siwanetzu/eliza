import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { getComprehensiveAnalysis } from '../../aggregator';
import { getProtocolRisk } from '../../riskAnalysis';
import { getMarketSentiment } from '../../sentimentAnalysis';
import { getGovernanceProposals } from '../../governanceAnalytics';
import { getYieldOpportunities } from '../../yieldAnalytics';
import { getProtocolTrends } from '../../historicalAnalysis';

jest.mock('../../riskAnalysis');
jest.mock('../../sentimentAnalysis');
jest.mock('../../governanceAnalytics');
jest.mock('../../yieldAnalytics');
jest.mock('../../historicalAnalysis');

describe('DeFi Aggregator', () => {
    const mockRiskData = {
        protocol: 'test-protocol',
        securityScore: 85,
        tvlUSD: 1000000000,
        volatility24h: 5,
        riskLevel: 'low' as const,
        riskFactors: {
            tvlRisk: 'low' as const,
            volatilityRisk: 'medium' as const,
            securityRisk: 'low' as const
        }
    };

    const mockSentimentData = {
        protocol: 'test-protocol',
        socialVolume: 1500,
        sentimentScore: 0.75,
        twitterMentions: 1000,
        githubActivity: 250,
        developerActivity: 45
    };

    const mockGovernanceData = [
        {
            id: 'proposal1',
            title: 'Test Proposal',
            description: 'Test Description',
            status: 'active',
            votes: {
                for: 1000,
                against: 500
            },
            quorum: 750,
            deadline: new Date()
        }
    ];

    const mockYieldData = [
        {
            protocol: 'test-protocol',
            pool: 'USDC-ETH',
            apy: 15.5,
            tvl: 100000000,
            risk: 'low' as const,
            rewards: ['COMP'],
            requirements: {
                minDeposit: 100,
                lockupPeriod: 0
            }
        }
    ];

    const mockTrendsData = {
        protocol: 'test-protocol',
        tvl: {
            current: 1000000000,
            change7d: 5,
            change30d: 15,
            trend: 'up' as const
        },
        volume: {
            current: 50000000,
            change7d: 10,
            change30d: 25,
            trend: 'up' as const
        },
        metrics: {
            dominance: 5,
            volatility: 15,
            growth: 20
        }
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (getProtocolRisk as jest.MockedFunction<typeof getProtocolRisk>)
            .mockResolvedValue(mockRiskData);
        (getMarketSentiment as jest.MockedFunction<typeof getMarketSentiment>)
            .mockResolvedValue(mockSentimentData);
        (getGovernanceProposals as jest.MockedFunction<typeof getGovernanceProposals>)
            .mockResolvedValue(mockGovernanceData);
        (getYieldOpportunities as jest.MockedFunction<typeof getYieldOpportunities>)
            .mockResolvedValue(mockYieldData);
        (getProtocolTrends as jest.MockedFunction<typeof getProtocolTrends>)
            .mockResolvedValue(mockTrendsData);
    });

    it('should aggregate protocol analysis correctly', async () => {
        const protocol = 'test-protocol';
        const analysis = await getComprehensiveAnalysis(protocol);

        expect(analysis).toMatchObject({
            protocol,
            risk: {
                overall: 'low',
                details: expect.any(Object)
            },
            sentiment: {
                score: 0.75,
                socialMetrics: expect.any(Object)
            },
            governance: {
                activeProposals: 1,
                recentActivity: expect.any(Array)
            },
            yield: {
                bestOpportunities: expect.any(Array),
                averageApy: expect.any(Number)
            },
            trends: {
                tvl: expect.any(Object),
                volume: expect.any(Object),
                metrics: expect.any(Object)
            },
            summary: expect.any(String)
        });

        expect(analysis.summary).toContain(protocol);
        expect(analysis.yield.bestOpportunities).toHaveLength(1);
        expect(analysis.governance.recentActivity).toHaveLength(1);
    });

    it('should handle high risk scenarios correctly', async () => {
        const highRiskData = {
            ...mockRiskData,
            riskLevel: 'high' as const,
            securityScore: 65
        };

        (getProtocolRisk as jest.MockedFunction<typeof getProtocolRisk>)
            .mockResolvedValueOnce(highRiskData);

        const protocol = 'test-protocol';
        const analysis = await getComprehensiveAnalysis(protocol);

        expect(analysis.risk.overall).toBe('high');
        expect(analysis.summary).toContain('HIGH');
    });

    it('should handle missing data gracefully', async () => {
        (getGovernanceProposals as jest.MockedFunction<typeof getGovernanceProposals>)
            .mockResolvedValueOnce([]);
        (getYieldOpportunities as jest.MockedFunction<typeof getYieldOpportunities>)
            .mockResolvedValueOnce([]);

        const protocol = 'test-protocol';
        const analysis = await getComprehensiveAnalysis(protocol);

        expect(analysis.governance.activeProposals).toBe(0);
        expect(analysis.yield.bestOpportunities).toHaveLength(0);
        expect(analysis.yield.averageApy).toBe(0);
    });

    it('should handle API errors gracefully', async () => {
        const error = new Error('API Error');
        (getProtocolRisk as jest.MockedFunction<typeof getProtocolRisk>)
            .mockRejectedValueOnce(error);

        const protocol = 'test-protocol';
        await expect(getComprehensiveAnalysis(protocol)).rejects.toThrow('API Error');
    });

    it('should generate meaningful summaries', async () => {
        const protocol = 'test-protocol';
        const analysis = await getComprehensiveAnalysis(protocol);

        expect(analysis.summary).toContain(protocol);
        expect(analysis.summary).toContain('risk');
        expect(analysis.summary).toContain('TVL trend');
        expect(analysis.summary).toContain('sentiment');
        expect(analysis.summary).toContain('governance');
        expect(analysis.summary).toContain('APY');
    });
});