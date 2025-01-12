import { getProtocolRisk } from './riskAnalysis';
import { getMarketSentiment } from './sentimentAnalysis';
import { getGovernanceProposals } from './governanceAnalytics';
import { getYieldOpportunities } from './yieldAnalytics';
import { getProtocolTrends } from './historicalAnalysis';

interface DefiInsight {
    protocol: string;
    risk: {
        overall: 'low' | 'medium' | 'high';
        details: any;
    };
    sentiment: {
        score: number;
        socialMetrics: any;
    };
    governance: {
        activeProposals: number;
        recentActivity: any[];
    };
    yield: {
        bestOpportunities: any[];
        averageApy: number;
    };
    trends: {
        tvl: any;
        volume: any;
        metrics: any;
    };
    summary: string;
}

export async function getComprehensiveAnalysis(protocol: string): Promise<DefiInsight> {
    try {
        // Fetch data from all sources in parallel
        const [
            riskData,
            sentimentData,
            governanceData,
            yieldData,
            trendsData
        ] = await Promise.all([
            getProtocolRisk(protocol),
            getMarketSentiment(protocol),
            getGovernanceProposals(protocol),
            getYieldOpportunities(protocol),
            getProtocolTrends(protocol)
        ]);

        // Process and combine the data
        const insight: DefiInsight = {
            protocol,
            risk: {
                overall: riskData.riskLevel,
                details: {
                    securityScore: riskData.securityScore,
                    riskFactors: riskData.riskFactors
                }
            },
            sentiment: {
                score: sentimentData.sentimentScore,
                socialMetrics: {
                    volume: sentimentData.socialVolume,
                    twitter: sentimentData.twitterMentions,
                    github: sentimentData.githubActivity
                }
            },
            governance: {
                activeProposals: governanceData.filter(p => p.status === 'active').length,
                recentActivity: governanceData.map(p => ({
                    title: p.title,
                    status: p.status,
                    deadline: p.deadline
                }))
            },
            yield: {
                bestOpportunities: yieldData
                    .sort((a, b) => b.apy - a.apy)
                    .slice(0, 3)
                    .map(y => ({
                        pool: y.pool,
                        apy: y.apy,
                        risk: y.risk
                    })),
                averageApy: calculateAverageApy(yieldData)
            },
            trends: {
                tvl: trendsData.tvl,
                volume: trendsData.volume,
                metrics: trendsData.metrics
            },
            summary: generateInsightSummary({
                protocol,
                risk: riskData,
                sentiment: sentimentData,
                governance: governanceData,
                yield: yieldData,
                trends: trendsData
            })
        };

        return insight;
    } catch (error) {
        console.error('Error generating comprehensive analysis:', error);
        throw error;
    }
}

function calculateAverageApy(yieldData: any[]): number {
    if (yieldData.length === 0) return 0;
    const totalApy = yieldData.reduce((sum, pool) => sum + pool.apy, 0);
    return totalApy / yieldData.length;
}

function generateInsightSummary(data: any): string {
    const {
        protocol,
        risk,
        sentiment,
        governance,
        yield: yieldData,
        trends
    } = data;

    const riskLevel = risk.riskLevel.toUpperCase();
    const trendDirection = trends.tvl.trend;
    const activeProposals = governance.filter((p: any) => p.status === 'active').length;
    const bestApy = yieldData.length > 0 ? Math.max(...yieldData.map((y: any) => y.apy)) : 0;

    return `${protocol} shows ${riskLevel} risk with ${trendDirection} TVL trend. ` +
           `Community sentiment is ${sentiment.sentimentScore > 0 ? 'positive' : 'negative'} ` +
           `with ${activeProposals} active governance proposals. ` +
           `Best yield opportunity offers ${bestApy.toFixed(2)}% APY.`;
}