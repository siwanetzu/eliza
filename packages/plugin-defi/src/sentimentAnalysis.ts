import { MarketSentiment } from './types';
import { rateLimitedRequest } from './apiTools';
import axios from 'axios';

const SANTIMENT_API = 'https://api.santiment.net/graphql';
const GITHUB_API = 'https://api.github.com';

export async function getMarketSentiment(protocol: string): Promise<MarketSentiment> {
    try {
        // Fetch social metrics
        const socialResponse = await rateLimitedRequest(() =>
            axios.post(SANTIMENT_API, {
                query: `{
                    socialVolume: socialVolumeQuery(slug: "${protocol}") {
                        mentionsCount
                        sentiment
                    }
                    githubActivity: githubActivity(slug: "${protocol}") {
                        commits
                        contributors
                    }
                }`
            })
        );

        const data = socialResponse.data.data;

        return {
            protocol,
            socialVolume: data.socialVolume.mentionsCount || 0,
            sentimentScore: data.socialVolume.sentiment || 0,
            twitterMentions: data.socialVolume.mentionsCount || 0,
            githubActivity: data.githubActivity.commits || 0,
            developerActivity: data.githubActivity.contributors || 0
        };
    } catch (error) {
        console.error('Error fetching market sentiment:', error);
        throw error;
    }
}