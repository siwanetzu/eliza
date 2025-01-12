export const CONFIG = {
    // API Endpoints
    apis: {
        defiLlama: {
            base: 'https://api.llama.fi',
            endpoints: {
                protocol: '/protocol',
                yields: '/pools',
                dexs: '/summary/dexs'
            }
        },
        defiSafety: {
            base: 'https://api.defisafety.com/v1',
            endpoints: {
                projects: '/projects'
            }
        },
        snapshot: {
            base: 'https://hub.snapshot.org/graphql'
        },
        tally: {
            base: 'https://api.tally.xyz/query'
        },
        santiment: {
            base: 'https://api.santiment.net/graphql'
        }
    },

    // Rate Limiting
    rateLimits: {
        defiLlama: {
            maxRequests: 30,
            timeWindow: 60000 // 1 minute
        },
        defiSafety: {
            maxRequests: 10,
            timeWindow: 60000
        },
        snapshot: {
            maxRequests: 20,
            timeWindow: 60000
        },
        tally: {
            maxRequests: 15,
            timeWindow: 60000
        },
        santiment: {
            maxRequests: 25,
            timeWindow: 60000
        }
    },

    // Analysis Settings
    analysis: {
        // Risk Analysis
        risk: {
            tvlThresholds: {
                low: 1000000000, // $1B
                medium: 100000000 // $100M
            },
            volatilityThresholds: {
                high: 20, // 20%
                medium: 10 // 10%
            },
            securityThresholds: {
                high: 85,
                medium: 70
            }
        },

        // Yield Analysis
        yield: {
            minTvl: 1000000, // $1M
            maxApy: 1000, // 1000%
            riskThresholds: {
                volatility: 20,
                apy: 50
            }
        },

        // Sentiment Analysis
        sentiment: {
            sampleSize: 100,
            timeWindow: 7 * 24 * 60 * 60 * 1000, // 7 days
            positiveWords: [
                'bullish', 'great', 'moon', 'good',
                'up', 'gain', 'profit', 'win'
            ],
            negativeWords: [
                'bearish', 'bad', 'down', 'loss',
                'crash', 'dump', 'rug', 'scam'
            ]
        },

        // Governance Analysis
        governance: {
            proposalLimit: 10,
            activeOnly: true,
            minQuorum: 0.04 // 4%
        },

        // Historical Analysis
        historical: {
            timeframes: {
                short: '7d',
                medium: '30d',
                long: '90d'
            },
            trendThresholds: {
                significant: 5, // 5%
                volatile: 20 // 20%
            }
        }
    },

    // Reporting Settings
    reporting: {
        updateInterval: 24 * 60 * 60 * 1000, // 24 hours
        maxRetries: 3,
        retryDelay: 5000, // 5 seconds
        cacheExpiry: 15 * 60 * 1000 // 15 minutes
    }
};