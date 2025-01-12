export interface DEXVolume {
  dailyVolume: number;
  totalVolume: number;
  volumeChange24h: number;
  topPairs: {
    pair: string;
    volume: number;
    priceChange: number;
  }[];
}

export interface YieldOpportunity {
  protocol: string;
  pool: string;
  apy: number;
  tvl: number;
  risk: 'low' | 'medium' | 'high';
  rewards: string[];
  requirements?: {
    minDeposit?: number;
    lockupPeriod?: number;
  };
}

export interface GovernanceProposal {
  id: string;
  title: string;
  description: string;
  status: string;
  votes: {
    for: number;
    against: number;
  };
  quorum: number;
  deadline: Date;
}

export interface MarketSentiment {
  protocol: string;
  socialVolume: number;
  sentimentScore: number;
  twitterMentions: number;
  githubActivity: number;
  developerActivity: number;
}

export interface ProtocolRisk {
  protocol: string;
  securityScore: number;
  tvlUSD: number;
  volatility24h: number;
  riskLevel: 'low' | 'medium' | 'high';
  riskFactors: {
    tvlRisk: 'low' | 'medium' | 'high';
    volatilityRisk: 'low' | 'medium' | 'high';
    securityRisk: 'low' | 'medium' | 'high';
  };
}

export interface TrendAnalysis {
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

export interface DefiInsight {
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

export interface TwitterMetrics {
    tweet_count: number;
    sentiment_score: number;
    followers_count: number;
    following_count: number;
    tweet_count_24h: number;
    engagement_rate: number;
}

export interface GithubMetrics {
    commits: number;
    contributors: number;
    issues: number;
    pullRequests: number;
    stars: number;
    forks: number;
}