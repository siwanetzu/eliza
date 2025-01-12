import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { getProtocolRisk } from '../../riskAnalysis';
import { rateLimitedRequest } from '../../apiTools';
import axios from 'axios';

jest.mock('../../apiTools');
jest.mock('axios');

describe('Risk Analysis', () => {
    const mockSafetyResponse = {
        data: {
            score: 85,
            details: {
                security: 90,
                documentation: 85,
                testing: 80
            }
        }
    };

    const mockLlamaResponse = {
        data: {
            tvl: 1500000000,
            tvlChange24h: -15,
            chains: ['ethereum', 'polygon'],
            category: 'Lending'
        }
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (rateLimitedRequest as jest.MockedFunction<typeof rateLimitedRequest>).mockImplementation((fn) => fn());
    });

    it('should calculate risk metrics correctly for a high TVL protocol', async () => {
        (axios.get as jest.MockedFunction<typeof axios.get>)
            .mockResolvedValueOnce(mockSafetyResponse)
            .mockResolvedValueOnce(mockLlamaResponse);

        const protocol = 'test-protocol';
        const risk = await getProtocolRisk(protocol);

        expect(risk).toMatchObject({
            protocol,
            securityScore: 85,
            tvlUSD: 1500000000,
            volatility24h: -15,
            riskLevel: 'low',
            riskFactors: {
                tvlRisk: 'low',
                volatilityRisk: 'medium',
                securityRisk: 'medium'
            }
        });
    });

    it('should handle high risk scenarios correctly', async () => {
        const highRiskResponse = {
            data: {
                score: 65,
                details: {
                    security: 60,
                    documentation: 70,
                    testing: 65
                }
            }
        };

        const lowTvlResponse = {
            data: {
                tvl: 50000000,
                tvlChange24h: -25,
                chains: ['ethereum'],
                category: 'DeFi'
            }
        };

        (axios.get as jest.MockedFunction<typeof axios.get>)
            .mockResolvedValueOnce(highRiskResponse)
            .mockResolvedValueOnce(lowTvlResponse);

        const protocol = 'risky-protocol';
        const risk = await getProtocolRisk(protocol);

        expect(risk).toMatchObject({
            protocol,
            securityScore: 65,
            tvlUSD: 50000000,
            volatility24h: -25,
            riskLevel: 'high',
            riskFactors: {
                tvlRisk: 'high',
                volatilityRisk: 'high',
                securityRisk: 'high'
            }
        });
    });

    it('should handle API errors gracefully', async () => {
        const error = new Error('API Error');
        (axios.get as jest.MockedFunction<typeof axios.get>).mockRejectedValue(error);

        const protocol = 'test-protocol';
        await expect(getProtocolRisk(protocol)).rejects.toThrow('API Error');
    });

    it('should handle missing or invalid data', async () => {
        const incompleteResponse = {
            data: {
                score: null,
                details: {}
            }
        };

        const emptyTvlResponse = {
            data: {}
        };

        (axios.get as jest.MockedFunction<typeof axios.get>)
            .mockResolvedValueOnce(incompleteResponse)
            .mockResolvedValueOnce(emptyTvlResponse);

        const protocol = 'incomplete-protocol';
        const risk = await getProtocolRisk(protocol);

        expect(risk).toMatchObject({
            protocol,
            securityScore: 0,
            tvlUSD: 0,
            volatility24h: 0,
            riskLevel: 'high',
            riskFactors: {
                tvlRisk: 'high',
                volatilityRisk: 'medium',
                securityRisk: 'high'
            }
        });
    });
});