import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { getMarketSentiment } from '../../sentimentAnalysis';
import { rateLimitedRequest } from '../../apiTools';
import axios from 'axios';

jest.mock('../../apiTools');
jest.mock('axios');

describe('Sentiment Analysis', () => {
    const mockPositiveSentimentResponse = {
        data: {
            data: {
                socialVolume: {
                    mentionsCount: 1500,
                    sentiment: 0.75
                },
                githubActivity: {
                    commits: 250,
                    contributors: 45
                }
            }
        }
    };

    const mockNegativeSentimentResponse = {
        data: {
            data: {
                socialVolume: {
                    mentionsCount: 2000,
                    sentiment: -0.6
                },
                githubActivity: {
                    commits: 150,
                    contributors: 30
                }
            }
        }
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (rateLimitedRequest as jest.MockedFunction<typeof rateLimitedRequest>).mockImplementation((fn) => fn());
    });

    it('should analyze positive market sentiment correctly', async () => {
        (axios.post as jest.MockedFunction<typeof axios.post>)
            .mockResolvedValueOnce(mockPositiveSentimentResponse);

        const protocol = 'test-protocol';
        const sentiment = await getMarketSentiment(protocol);

        expect(sentiment).toMatchObject({
            protocol,
            socialVolume: 1500,
            sentimentScore: 0.75,
            twitterMentions: 1500,
            githubActivity: 250,
            developerActivity: 45
        });
    });

    it('should analyze negative market sentiment correctly', async () => {
        (axios.post as jest.MockedFunction<typeof axios.post>)
            .mockResolvedValueOnce(mockNegativeSentimentResponse);

        const protocol = 'test-protocol';
        const sentiment = await getMarketSentiment(protocol);

        expect(sentiment).toMatchObject({
            protocol,
            socialVolume: 2000,
            sentimentScore: -0.6,
            twitterMentions: 2000,
            githubActivity: 150,
            developerActivity: 30
        });
    });

    it('should handle missing data gracefully', async () => {
        const incompleteResponse = {
            data: {
                data: {
                    socialVolume: {},
                    githubActivity: {}
                }
            }
        };

        (axios.post as jest.MockedFunction<typeof axios.post>)
            .mockResolvedValueOnce(incompleteResponse);

        const protocol = 'test-protocol';
        const sentiment = await getMarketSentiment(protocol);

        expect(sentiment).toMatchObject({
            protocol,
            socialVolume: 0,
            sentimentScore: 0,
            twitterMentions: 0,
            githubActivity: 0,
            developerActivity: 0
        });
    });

    it('should handle API errors gracefully', async () => {
        const error = new Error('API Error');
        (axios.post as jest.MockedFunction<typeof axios.post>)
            .mockRejectedValueOnce(error);

        const protocol = 'test-protocol';
        await expect(getMarketSentiment(protocol)).rejects.toThrow('API Error');
    });

    it('should handle extreme sentiment values', async () => {
        const extremeResponse = {
            data: {
                data: {
                    socialVolume: {
                        mentionsCount: 10000,
                        sentiment: 0.95
                    },
                    githubActivity: {
                        commits: 1000,
                        contributors: 100
                    }
                }
            }
        };

        (axios.post as jest.MockedFunction<typeof axios.post>)
            .mockResolvedValueOnce(extremeResponse);

        const protocol = 'test-protocol';
        const sentiment = await getMarketSentiment(protocol);

        expect(sentiment).toMatchObject({
            protocol,
            socialVolume: 10000,
            sentimentScore: 0.95,
            twitterMentions: 10000,
            githubActivity: 1000,
            developerActivity: 100
        });
    });
});