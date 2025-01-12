import { ClientBase } from './base';
import { elizaLogger } from '@elizaos/core';
import { TwitterClient } from './twitterClient';

interface TwitterPersonality {
    username: string;
    categories: string[];
    style: 'degen' | 'analytical' | 'mixed';
    lastChecked?: Date;
    minFollowers?: number;
    requireVerified?: boolean;
}

// Initial list of verified and trusted crypto personalities
const CRYPTO_PERSONALITIES: TwitterPersonality[] = [
    // DeFi Researchers and Analytics
    { username: 'DefiIgnas', categories: ['defi', 'analytics', 'research'], style: 'analytical', minFollowers: 10000, requireVerified: true },
    { username: 'DefiLlama', categories: ['defi', 'tvl', 'analytics'], style: 'analytical', minFollowers: 50000, requireVerified: true },
    { username: 'hasufl', categories: ['defi', 'research', 'analysis'], style: 'analytical', minFollowers: 50000, requireVerified: true },
    { username: 'tokenterminal', categories: ['defi', 'analytics', 'metrics'], style: 'analytical', minFollowers: 30000, requireVerified: true },
    { username: 'DefiPrime', categories: ['defi', 'analytics', 'news'], style: 'analytical', minFollowers: 30000, requireVerified: true },
    { username: 'DeFiWeekly', categories: ['defi', 'research', 'news'], style: 'analytical', minFollowers: 20000, requireVerified: true },
    { username: 'DefiDividends', categories: ['defi', 'yield', 'analytics'], style: 'analytical', minFollowers: 20000, requireVerified: true },
    { username: 'DeFiResearcher', categories: ['defi', 'research', 'analysis'], style: 'analytical', minFollowers: 30000, requireVerified: true },
    { username: 'CurveResearch', categories: ['defi', 'research', 'amm'], style: 'analytical', minFollowers: 20000, requireVerified: true },
    { username: 'DeFiInnovator', categories: ['defi', 'research', 'innovation'], style: 'analytical', minFollowers: 25000, requireVerified: true },

    // Protocol Teams and Developers
    { username: 'VitalikButerin', categories: ['ethereum', 'tech', 'defi'], style: 'mixed', minFollowers: 100000, requireVerified: true },
    { username: 'StaniKulechov', categories: ['defi', 'lending', 'aave'], style: 'mixed', minFollowers: 50000, requireVerified: true },
    { username: 'haydenzadams', categories: ['dex', 'defi', 'uniswap'], style: 'mixed', minFollowers: 50000, requireVerified: true },
    { username: 'kaiynne', categories: ['derivatives', 'defi', 'synthetix'], style: 'mixed', minFollowers: 30000, requireVerified: true },
    { username: 'rleshner', categories: ['defi', 'lending', 'compound'], style: 'mixed', minFollowers: 30000, requireVerified: true },
    { username: 'FernandoMartinjs', categories: ['defi', 'amm', 'balancer'], style: 'mixed', minFollowers: 20000, requireVerified: true },
    { username: 'mhonkasalo', categories: ['defi', 'research', 'analysis'], style: 'analytical', minFollowers: 30000, requireVerified: true },
    { username: 'ChrisBlec', categories: ['defi', 'governance', 'analysis'], style: 'mixed', minFollowers: 30000, requireVerified: true },

    // Trusted Degen Analysts
    { username: 'notthreadguy', categories: ['degen', 'market-trends', 'alpha'], style: 'degen', minFollowers: 50000, requireVerified: true },
    { username: '0xrwu', categories: ['degen', 'defi', 'alpha'], style: 'degen', minFollowers: 30000, requireVerified: true },
    { username: 'Route2FI', categories: ['degen', 'defi-yield', 'alpha'], style: 'degen', minFollowers: 30000, requireVerified: true },
    { username: '0xSisyphus', categories: ['degen', 'defi', 'alpha'], style: 'degen', minFollowers: 30000, requireVerified: true },

    // Industry Leaders and VCs
    { username: 'shawmakesmagic', categories: ['defi', 'industry', 'ai'], style: 'mixed', minFollowers: 5000, requireVerified: true },
    { username: 'a16z', categories: ['vc', 'defi', 'industry'], style: 'mixed', minFollowers: 100000, requireVerified: true },
    { username: 'AriannaSimpson', categories: ['vc', 'defi', 'industry'], style: 'mixed', minFollowers: 50000, requireVerified: true },
    { username: 'cdixon', categories: ['vc', 'tech', 'defi'], style: 'mixed', minFollowers: 100000, requireVerified: true }
];

interface TweetPattern {
    pattern: string;
    style: 'degen' | 'analytical' | 'mixed';
    sentiment: 'bullish' | 'bearish' | 'neutral';
    context: string[];
    verified?: boolean;
    onchainVerified?: boolean;
}

interface OnchainMetrics {
    tvl?: number;
    volume24h?: number;
    apy?: number;
    timestamp: number;
}

export class TwitterLearningClient {
    private client: ClientBase;
    private twitterClient: TwitterClient;
    private lastScanTime: Record<string, Date> = {};
    private scanInterval = 1000 * 60 * 60; // 1 hour
    private learnedPatterns: TweetPattern[] = [];
    private followedAccounts: Set<string> = new Set();
    private onchainMetricsCache: Map<string, OnchainMetrics> = new Map();

    constructor(client: ClientBase) {
        this.client = client;
        this.twitterClient = new TwitterClient(
            client.profile.id,
            client.twitterConfig
        );
    }

    async init() {
        await this.initializeFollowedAccounts();
    }

    private async initializeFollowedAccounts() {
        this.followedAccounts = new Set(CRYPTO_PERSONALITIES.map(p => p.username));

        // Follow all initial accounts
        for (const username of this.followedAccounts) {
            try {
                const isFollowing = await this.twitterClient.isFollowing(username);
                if (!isFollowing) {
                    await this.twitterClient.follow(username);
                    elizaLogger.info(`Started following ${username}`);
                    // Add a small delay to avoid rate limits
                    await new Promise(resolve => setTimeout(resolve, 2000));
                }
            } catch (error) {
                elizaLogger.error(`Error following ${username}:`, error);
            }
        }
    }

    /**
     * Follow a specific Twitter account
     */
    public async followAccount(username: string): Promise<boolean> {
        try {
            const isFollowing = await this.twitterClient.isFollowing(username);
            if (!isFollowing) {
                await this.twitterClient.follow(username);
                this.followedAccounts.add(username);
                elizaLogger.info(`Started following ${username}`);
                return true;
            }
            return false;
        } catch (error) {
            elizaLogger.error(`Error following ${username}:`, error);
            return false;
        }
    }

    /**
     * Unfollow a specific Twitter account
     */
    public async unfollowAccount(username: string): Promise<boolean> {
        try {
            const isFollowing = await this.twitterClient.isFollowing(username);
            if (isFollowing) {
                await this.twitterClient.unfollow(username);
                this.followedAccounts.delete(username);
                elizaLogger.info(`Unfollowed ${username}`);
                return true;
            }
            return false;
        } catch (error) {
            elizaLogger.error(`Error unfollowing ${username}:`, error);
            return false;
        }
    }

    /**
     * Evaluates a Twitter account for potential following
     */
    private async evaluateAccountForFollowing(username: string): Promise<boolean> {
        try {
            const profile = await this.client.twitterClient.getProfile(username);

            // Basic criteria
            if (!profile.isVerified) return false;
            if (profile.followersCount < 20000) return false;

            // Check if they tweet about DeFi
            const recentTweets = await this.client.getUserTweets(username, 20);
            const defiTweetCount = recentTweets.filter(tweet =>
                tweet.text.toLowerCase().includes('defi') ||
                tweet.text.toLowerCase().includes('tvl') ||
                tweet.text.toLowerCase().includes('yield') ||
                tweet.text.match(/\$[A-Z]+/) // Token symbols
            ).length;

            // Require at least 25% DeFi-related content
            return defiTweetCount >= 5;
        } catch (error) {
            elizaLogger.error(`Error evaluating account ${username}:`, error);
            return false;
        }
    }

    /**
     * Discovers new accounts to follow based on interactions
     */
    private async discoverNewAccounts(tweet: any) {
        try {
            // Check mentions and replies
            const mentionedUsers = tweet.entities?.mentions?.map(m => m.username) || [];
            for (const username of mentionedUsers) {
                if (!this.followedAccounts.has(username)) {
                    const shouldFollow = await this.evaluateAccountForFollowing(username);
                    if (shouldFollow) {
                        await this.followAccount(username);
                    }
                }
            }
        } catch (error) {
            elizaLogger.error('Error discovering new accounts:', error);
        }
    }

    /**
     * Verifies metrics mentioned in tweets against on-chain data
     */
    private async verifyOnchainMetrics(text: string, protocol: string): Promise<boolean> {
        try {
            // Extract metrics from tweet
            const metrics = this.extractMetrics(text);

            // Get current on-chain data
            const onchainData = await this.fetchOnchainMetrics(protocol);

            // Compare mentioned metrics with on-chain data
            for (const number of metrics.numbers) {
                const value = parseFloat(number.replace(/[^0-9.]/g, ''));
                const unit = number.slice(-1);

                // Convert to same unit for comparison
                const normalizedValue = unit === 'B' ? value * 1e9 :
                                     unit === 'M' ? value * 1e6 :
                                     unit === 'K' ? value * 1e3 : value;

                // Allow 5% deviation
                const deviation = Math.abs(normalizedValue - onchainData.tvl) / onchainData.tvl;
                if (deviation > 0.05) {
                    return false;
                }
            }

            return true;
        } catch (error) {
            elizaLogger.error('Error verifying on-chain metrics:', error);
            return false;
        }
    }

    /**
     * Fetches on-chain metrics from various sources
     */
    private async fetchOnchainMetrics(protocol: string): Promise<OnchainMetrics> {
        // Check cache first
        const cached = this.onchainMetricsCache.get(protocol);
        if (cached && Date.now() - cached.timestamp < 1000 * 60 * 15) { // 15 min cache
            return cached;
        }

        try {
            // Fetch from multiple sources for verification using axios
            const [defiLlamaData, tokenTerminalData] = await Promise.all([
                fetch(`https://api.defillama.com/v2/protocols/${protocol}`).then(res => res.json()),
                fetch(`https://api.tokenterminal.com/v1/projects/${protocol}`).then(res => res.json())
            ]);

            const metrics: OnchainMetrics = {
                tvl: defiLlamaData.tvl,
                volume24h: tokenTerminalData.volume_24h,
                apy: tokenTerminalData.apy,
                timestamp: Date.now()
            };

            // Cache the results
            this.onchainMetricsCache.set(protocol, metrics);
            return metrics;
        } catch (error) {
            elizaLogger.error(`Error fetching on-chain metrics for ${protocol}:`, error);
            throw error;
        }
    }

    /**
     * Scans tweets from crypto personalities to learn patterns and gather insights
     */
    async scanCryptoPersonalities() {
        for (const personality of CRYPTO_PERSONALITIES) {
            try {
                // Check if we should scan this personality (respect rate limits)
                const lastScan = this.lastScanTime[personality.username];
                if (lastScan && (new Date().getTime() - lastScan.getTime()) < this.scanInterval) {
                    continue;
                }

                elizaLogger.info(`Scanning tweets from ${personality.username} (${personality.style} style)`);

                // Get recent tweets from this personality
                const tweets = await this.client.getUserTweets(personality.username, 50);

                // Analyze tweets for patterns and insights
                for (const tweet of tweets) {
                    await this.analyzeTweet(tweet, personality);
                }

                // Update last scan time
                this.lastScanTime[personality.username] = new Date();

            } catch (error) {
                elizaLogger.error(`Error scanning tweets from ${personality.username}:`, error);
            }
        }
    }

    /**
     * Analyzes a tweet for patterns and insights with on-chain verification
     */
    private async analyzeTweet(tweet: any, personality: TwitterPersonality) {
        try {
            // Extract relevant information based on personality categories
            const insights = {
                timestamp: new Date(tweet.created_at),
                text: tweet.text,
                metrics: this.extractMetrics(tweet.text),
                sentiment: this.analyzeSentiment(tweet.text),
                style: personality.style,
                categories: personality.categories,
                patterns: this.extractPatterns(tweet.text, personality.style)
            };

            // Verify metrics if present
            if (insights.metrics.numbers.length > 0) {
                const isVerified = await this.verifyOnchainMetrics(tweet.text, personality.username);
                if (!isVerified) {
                    elizaLogger.warn(`Skipping unverified metrics from ${personality.username}`);
                    return;
                }
            }

            // Discover new accounts to follow
            await this.discoverNewAccounts(tweet);

            // Learn from the tweet patterns
            await this.learnFromTweet(insights);

            // Store insights for future use
            await this.storeInsights(insights);

        } catch (error) {
            elizaLogger.error(`Error analyzing tweet:`, error);
        }
    }

    /**
     * Extracts common patterns from tweet text based on style
     */
    private extractPatterns(text: string, style: string): TweetPattern[] {
        const patterns: TweetPattern[] = [];

        if (style === 'degen') {
            // Extract degen-style patterns
            const degenPatterns = [
                /(?:ngmi|wagmi|gm|gn)\b/i,
                /(?:ser|anon|fren)\b/i,
                /(?:🚀|💎|🙌|🌙|📈|🐂|🔥|👀)/,
                /(?:aping|mooning|pumping)\b/i,
                /(?:alpha|based|chad)\b/i
            ];

            degenPatterns.forEach(pattern => {
                if (pattern.test(text)) {
                    patterns.push({
                        pattern: pattern.source,
                        style: 'degen',
                        sentiment: this.analyzeSentiment(text),
                        context: this.extractContext(text, pattern)
                    });
                }
            });
        }

        return patterns;
    }

    /**
     * Extracts context around a matched pattern
     */
    private extractContext(text: string, pattern: RegExp): string[] {
        const matches = text.match(pattern);
        if (!matches) return [];

        return matches.map(match => {
            const index = text.indexOf(match);
            const start = Math.max(0, index - 30);
            const end = Math.min(text.length, index + match.length + 30);
            return text.slice(start, end);
        });
    }

    /**
     * Learns from tweet patterns and updates internal knowledge
     */
    private async learnFromTweet(insights: any) {
        if (insights.patterns && insights.patterns.length > 0) {
            this.learnedPatterns = [...this.learnedPatterns, ...insights.patterns];
            // Keep only the most recent 1000 patterns
            if (this.learnedPatterns.length > 1000) {
                this.learnedPatterns = this.learnedPatterns.slice(-1000);
            }
        }
    }

    /**
     * Gets a random learned pattern matching the given style and sentiment
     */
    public getRandomPattern(style: 'degen' | 'analytical' | 'mixed', sentiment: 'bullish' | 'bearish' | 'neutral'): TweetPattern | null {
        const matchingPatterns = this.learnedPatterns.filter(p =>
            p.style === style && p.sentiment === sentiment
        );

        if (matchingPatterns.length === 0) return null;
        return matchingPatterns[Math.floor(Math.random() * matchingPatterns.length)];
    }

    /**
     * Extracts metrics from tweet text (numbers, percentages, etc.)
     */
    private extractMetrics(text: string) {
        return {
            numbers: text.match(/\$?\d+\.?\d*[BMK]?/g) || [],
            percentages: text.match(/[-+]?\d+\.?\d*%/g) || [],
            tokens: text.match(/\$[A-Z]+/g) || [],
            emojis: text.match(/[\u{1F300}-\u{1F9FF}]/gu) || []
        };
    }

    /**
     * Analyzes sentiment of tweet text
     */
    private analyzeSentiment(text: string): 'bullish' | 'bearish' | 'neutral' {
        const bullishTerms = /\b(bullish|moon|pump|ath|higher|up|gain|growth|increase|long|buy|calls|chad|based|alpha)\b/i;
        const bearishTerms = /\b(bearish|dump|dip|lower|down|loss|decrease|fall|short|sell|puts|rekt|ngmi)\b/i;

        const bullishCount = (text.match(bullishTerms) || []).length;
        const bearishCount = (text.match(bearishTerms) || []).length;

        if (bullishCount > bearishCount) return 'bullish';
        if (bearishCount > bullishCount) return 'bearish';
        return 'neutral';
    }

    /**
     * Stores insights for future use
     */
    private async storeInsights(insights: any) {
        // TODO: Implement storage mechanism (database, file, etc.)
        elizaLogger.info('New insights gathered:', insights);
    }
}