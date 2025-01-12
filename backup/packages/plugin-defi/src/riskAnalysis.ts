import { ProtocolRisk } from './types';
import { rateLimitedRequest } from './apiTools';
import axios from 'axios';

const DEFI_SAFETY_API = 'https://api.defisafety.com/v1';
const DEFI_LLAMA_API = 'https://api.llama.fi/protocol';

export async function getProtocolRisk(protocol: string): Promise<ProtocolRisk> {
    try {
        // Fetch DeFi Safety score
        const safetyResponse = await rateLimitedRequest(() =>
            axios.get(`${DEFI_SAFETY_API}/projects/${protocol}`)
        );

        // Fetch TVL data from DeFi Llama
        const llamaResponse = await rateLimitedRequest(() =>
            axios.get(`${DEFI_LLAMA_API}/${protocol}`)
        );

        const safetyScore = safetyResponse.data.score || 0;
        const tvl = llamaResponse.data.tvl || 0;
        const tvlChange24h = llamaResponse.data.tvlChange24h || 0;

        // Calculate risk metrics
        const tvlRisk = calculateTVLRisk(tvl);
        const volatilityRisk = Math.abs(tvlChange24h) > 20 ? 'high' : 'medium';
        const securityRisk = safetyScore < 70 ? 'high' : safetyScore < 85 ? 'medium' : 'low';

        return {
            protocol,
            securityScore: safetyScore,
            tvlUSD: tvl,
            volatility24h: tvlChange24h,
            riskLevel: determineOverallRisk(tvlRisk, volatilityRisk, securityRisk),
            riskFactors: {
                tvlRisk,
                volatilityRisk,
                securityRisk
            }
        };
    } catch (error) {
        console.error('Error fetching protocol risk:', error);
        throw error;
    }
}

function calculateTVLRisk(tvl: number): 'low' | 'medium' | 'high' {
    if (tvl > 1000000000) return 'low'; // > $1B
    if (tvl > 100000000) return 'medium'; // > $100M
    return 'high';
}

function determineOverallRisk(
    tvlRisk: string,
    volatilityRisk: string,
    securityRisk: string
): 'low' | 'medium' | 'high' {
    const riskScores = {
        low: 1,
        medium: 2,
        high: 3
    };

    const avgScore = (
        riskScores[tvlRisk as keyof typeof riskScores] +
        riskScores[volatilityRisk as keyof typeof riskScores] +
        riskScores[securityRisk as keyof typeof riskScores]
    ) / 3;

    if (avgScore <= 1.5) return 'low';
    if (avgScore <= 2.5) return 'medium';
    return 'high';
}