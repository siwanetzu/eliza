import axios from 'axios';
import { YieldOpportunity } from './types';
import { rateLimitedRequest } from './apiTools';
import { CONFIG } from './config';

const DEFI_LLAMA_YIELDS_API = 'https://yields.llama.fi/pools';

export async function getYieldOpportunities(protocol: string): Promise<YieldOpportunity[]> {
    try {
        // Fetch yield data from DeFi Llama
        const response = await rateLimitedRequest(() =>
            axios.get(`${DEFI_LLAMA_YIELDS_API}?project=${protocol}`)
        );

        const pools = response.data.data;
        return pools.map((pool: any) => ({
            protocol,
            pool: pool.pool,
            apy: pool.apy,
            tvl: pool.tvlUsd,
            risk: determinePoolRisk(pool),
            rewards: pool.rewards || [],
            requirements: {
                minDeposit: pool.minDeposit || 0,
                lockupPeriod: pool.lockupPeriod || 0
            }
        }));
    } catch (error) {
        console.error('Error fetching yield opportunities:', error);
        throw error;
    }
}

function determinePoolRisk(pool: any): 'low' | 'medium' | 'high' {
    // Risk factors to consider
    const tvlThreshold = 1000000; // $1M
    const volatilityThreshold = 20; // 20%
    const apyThreshold = 50; // 50% APY

    let riskScore = 0;

    // TVL risk
    if (pool.tvlUsd < tvlThreshold) riskScore += 2;
    else if (pool.tvlUsd < tvlThreshold * 10) riskScore += 1;

    // Volatility risk
    if (pool.apyPct1D > volatilityThreshold) riskScore += 2;
    else if (pool.apyPct1D > volatilityThreshold / 2) riskScore += 1;

    // APY risk (unusually high APY might indicate higher risk)
    if (pool.apy > apyThreshold) riskScore += 1;

    // Determine risk level based on total score
    if (riskScore <= 1) return 'low';
    if (riskScore <= 3) return 'medium';
    return 'high';
}