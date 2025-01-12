import { elizaLogger } from '@elizaos/core';
import type { TwitterMetrics, GithubMetrics } from './types';

interface EngagementMetrics {
    followers: number;
    mentions: number;
    replies: number;
    retweets: number;
    likes: number;
    impressions: number;
}

interface GrowthReport {
    period: 'daily' | 'weekly' | 'monthly';
    metrics: {
        engagement: EngagementMetrics;
        topTweets: Array<{
            id: string;
            text: string;
            engagement: number;
        }>;
        growthRate: {
            followers: number;
            engagement: number;
        };
    };
    timestamp: number;
}

export class MetricsReporter {
    private lastReportTime: number = 0;
    private reportingInterval: number = 24 * 60 * 60 * 1000; // 24 hours
    private targetUser: string = '0xgolab';

    constructor(private client: any, private runtime: any) {
        this.initialize();
    }

    private async initialize(): Promise<void> {
        // Start the reporting cycle
        await this.scheduleNextReport();
    }

    private async scheduleNextReport(): Promise<void> {
        const now = Date.now();
        const nextReportTime = this.lastReportTime + this.reportingInterval;

        if (now >= nextReportTime) {
            await this.generateAndSendReport();
            this.lastReportTime = now;
        }

        // Schedule next check in 1 hour
        setTimeout(() => this.scheduleNextReport(), 60 * 60 * 1000);
    }

    private async collectMetrics(): Promise<GrowthReport> {
        const profile = await this.client.twitterClient.getProfile();
        const now = Date.now();
        const dayAgo = now - (24 * 60 * 60 * 1000);

        // Get current metrics
        const currentMetrics: EngagementMetrics = {
            followers: profile.followers_count,
            mentions: await this.countMentions(dayAgo),
            replies: await this.countReplies(dayAgo),
            retweets: await this.countRetweets(dayAgo),
            likes: await this.countLikes(dayAgo),
            impressions: await this.countImpressions(dayAgo)
        };

        // Calculate growth rates
        const previousMetrics = await this.getPreviousMetrics();
        const growthRate = {
            followers: this.calculateGrowthRate(previousMetrics.followers, currentMetrics.followers),
            engagement: this.calculateEngagementGrowthRate(previousMetrics, currentMetrics)
        };

        // Get top performing tweets
        const topTweets = await this.getTopTweets(dayAgo);

        return {
            period: 'daily',
            metrics: {
                engagement: currentMetrics,
                topTweets,
                growthRate
            },
            timestamp: now
        };
    }

    private async generateReportMessage(report: GrowthReport): Promise<string> {
        const { metrics } = report;
        const growthEmoji = (rate: number) => rate > 0 ? '📈' : rate < 0 ? '📉' : '➡️';

        return `Hey boss! Here's your daily AI agent report 🤖

Growth Metrics:
${growthEmoji(metrics.growthRate.followers)} Followers: ${metrics.engagement.followers} (${metrics.growthRate.followers >= 0 ? '+' : ''}${metrics.growthRate.followers.toFixed(2)}%)
${growthEmoji(metrics.growthRate.engagement)} Engagement: ${metrics.growthRate.engagement >= 0 ? '+' : ''}${metrics.growthRate.engagement.toFixed(2)}%

Today's Activity:
📊 Mentions: ${metrics.engagement.mentions}
💬 Replies: ${metrics.engagement.replies}
🔄 Retweets: ${metrics.engagement.retweets}
❤️ Likes: ${metrics.engagement.likes}
👁️ Impressions: ${metrics.engagement.impressions}

${metrics.topTweets.length > 0 ? `
Top Performing Tweet:
"${metrics.topTweets[0].text}"
Engagement: ${metrics.topTweets[0].engagement}
` : ''}

Keep crushing it! 🚀`;
    }

    private async sendDirectMessage(message: string): Promise<void> {
        try {
            await this.client.twitterClient.sendDirectMessage(this.targetUser, message);
            elizaLogger.success(`Sent metrics report to ${this.targetUser}`);
        } catch (error) {
            elizaLogger.error('Error sending metrics report via DM:', error);
        }
    }

    private async generateAndSendReport(): Promise<void> {
        try {
            const report = await this.collectMetrics();
            const message = await this.generateReportMessage(report);
            await this.sendDirectMessage(message);

            // Store metrics for future comparison
            await this.storeMetrics(report);
        } catch (error) {
            elizaLogger.error('Error generating or sending report:', error);
        }
    }

    private async countMentions(since: number): Promise<number> {
        const mentions = await this.client.twitterClient.fetchMentions(since);
        return mentions.length;
    }

    private async countReplies(since: number): Promise<number> {
        const replies = await this.client.twitterClient.fetchReplies(since);
        return replies.length;
    }

    private async countRetweets(since: number): Promise<number> {
        const retweets = await this.client.twitterClient.fetchRetweets(since);
        return retweets.length;
    }

    private async countLikes(since: number): Promise<number> {
        const likes = await this.client.twitterClient.fetchLikes(since);
        return likes.length;
    }

    private async countImpressions(since: number): Promise<number> {
        const tweets = await this.client.twitterClient.fetchTweets(since);
        return tweets.reduce((sum, tweet) => sum + (tweet.public_metrics?.impression_count || 0), 0);
    }

    private async getTopTweets(since: number) {
        const tweets = await this.client.twitterClient.fetchTweets(since);
        return tweets
            .sort((a, b) => this.calculateEngagement(b) - this.calculateEngagement(a))
            .slice(0, 3)
            .map(tweet => ({
                id: tweet.id,
                text: tweet.text,
                engagement: this.calculateEngagement(tweet)
            }));
    }

    private calculateEngagement(tweet: any): number {
        return (tweet.public_metrics?.like_count || 0) +
               (tweet.public_metrics?.retweet_count || 0) * 2 +
               (tweet.public_metrics?.reply_count || 0) * 3;
    }

    private async getPreviousMetrics(): Promise<EngagementMetrics> {
        try {
            const stored = await this.runtime.cacheManager.get('previous_metrics');
            return stored || {
                followers: 0,
                mentions: 0,
                replies: 0,
                retweets: 0,
                likes: 0,
                impressions: 0
            };
        } catch (error) {
            elizaLogger.error('Error retrieving previous metrics:', error);
            return {
                followers: 0,
                mentions: 0,
                replies: 0,
                retweets: 0,
                likes: 0,
                impressions: 0
            };
        }
    }

    private async storeMetrics(report: GrowthReport): Promise<void> {
        try {
            await this.runtime.cacheManager.set('previous_metrics', report.metrics.engagement);
        } catch (error) {
            elizaLogger.error('Error storing metrics:', error);
        }
    }

    private calculateGrowthRate(previous: number, current: number): number {
        if (previous === 0) return 0;
        return ((current - previous) / previous) * 100;
    }

    private calculateEngagementGrowthRate(previous: EngagementMetrics, current: EngagementMetrics): number {
        const prevTotal = previous.mentions + previous.replies + previous.retweets + previous.likes;
        const currentTotal = current.mentions + current.replies + current.retweets + current.likes;

        if (prevTotal === 0) return 0;
        return ((currentTotal - prevTotal) / prevTotal) * 100;
    }
}