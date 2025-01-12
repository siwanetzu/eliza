import { rateLimitedRequest } from './apiTools';
import axios from 'axios';

const DEFI_LLAMA_API = 'https://api.llama.fi';

interface TrendAnalysis {
    protocol: string;
    tvl: {
        current: number;
        change7d: number;
        change30d: number;
        trend: 'up' | 'down' | 'stable';
    };
    volume: {
        current: number;
        change7d: number;
        change30d: number;
        trend: 'up' | 'down' | 'stable';
    };
    metrics: {
        dominance: number;
        volatility: number;
        growth: number;
    };
}

export async function getProtocolTrends(protocol: string): Promise<TrendAnalysis> {
    try {
        // Fetch historical TVL data
        const tvlResponse = await rateLimitedRequest(() =>
            axios.get(`${DEFI_LLAMA_API}/protocol/${protocol}`)
        );

        // Fetch volume data
        const volumeResponse = await rateLimitedRequest(() =>
            axios.get(`${DEFI_LLAMA_API}/summary/dexs/${protocol}`)
        );

        const tvlData = tvlResponse.data;
        const volumeData = volumeResponse.data;

        // Calculate TVL trends
        const currentTvl = tvlData.tvl[tvlData.tvl.length - 1].totalLiquidityUSD;
        const tvl7dAgo = getTvlNDaysAgo(tvlData.tvl, 7);
        const tvl30dAgo = getTvlNDaysAgo(tvlData.tvl, 30);

        const tvlChange7d = calculatePercentageChange(currentTvl, tvl7dAgo);
        const tvlChange30d = calculatePercentageChange(currentTvl, tvl30dAgo);

        // Calculate volume trends
        const currentVolume = volumeData.total24h || 0;
        const volume7dAgo = volumeData.total7d ? volumeData.total7d / 7 : 0;
        const volume30dAgo = volumeData.total30d ? volumeData.total30d / 30 : 0;

        const volumeChange7d = calculatePercentageChange(currentVolume, volume7dAgo);
        const volumeChange30d = calculatePercentageChange(currentVolume, volume30dAgo);

        // Calculate additional metrics
        const dominance = (currentTvl / tvlData.chainTvls.total) * 100;
        const volatility = calculateVolatility(tvlData.tvl.slice(-30));
        const growth = calculateGrowthScore(tvlChange30d, volumeChange30d);

        return {
            protocol,
            tvl: {
                current: currentTvl,
                change7d: tvlChange7d,
                change30d: tvlChange30d,
                trend: determineTrend(tvlChange7d, tvlChange30d)
            },
            volume: {
                current: currentVolume,
                change7d: volumeChange7d,
                change30d: volumeChange30d,
                trend: determineTrend(volumeChange7d, volumeChange30d)
            },
            metrics: {
                dominance,
                volatility,
                growth
            }
        };
    } catch (error) {
        console.error('Error fetching protocol trends:', error);
        throw error;
    }
}

function getTvlNDaysAgo(tvlData: any[], days: number): number {
    const targetIndex = tvlData.length - 1 - days;
    return targetIndex >= 0 ? tvlData[targetIndex].totalLiquidityUSD : 0;
}

function calculatePercentageChange(current: number, previous: number): number {
    if (!previous) return 0;
    return ((current - previous) / previous) * 100;
}

function determineTrend(change7d: number, change30d: number): 'up' | 'down' | 'stable' {
    const shortTermWeight = 0.7;
    const longTermWeight = 0.3;
    const weightedChange = (change7d * shortTermWeight) + (change30d * longTermWeight);

    if (Math.abs(weightedChange) < 5) return 'stable';
    return weightedChange > 0 ? 'up' : 'down';
}

function calculateVolatility(tvlData: any[]): number {
    const returns = [];
    for (let i = 1; i < tvlData.length; i++) {
        const dailyReturn = (tvlData[i].totalLiquidityUSD - tvlData[i-1].totalLiquidityUSD) / tvlData[i-1].totalLiquidityUSD;
        returns.push(dailyReturn);
    }

    const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
    const variance = returns.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / returns.length;
    return Math.sqrt(variance) * 100; // Convert to percentage
}

function calculateGrowthScore(tvlGrowth: number, volumeGrowth: number): number {
    const tvlWeight = 0.6;
    const volumeWeight = 0.4;
    return (tvlGrowth * tvlWeight) + (volumeGrowth * volumeWeight);
}