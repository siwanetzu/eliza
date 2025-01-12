import axios from 'axios';
import { elizaLogger } from '@elizaos/core';
import { TwitterConfig } from './environment';
import { Scraper } from './scraper';

export class TwitterClient {
    private scraper: Scraper;
    private userId: string;

    constructor(userId: string, config: TwitterConfig) {
        this.userId = userId;
        this.scraper = new Scraper();
        this.initializeScraper(config);
    }

    private async initializeScraper(config: TwitterConfig) {
        try {
            await this.scraper.login(
                config.TWITTER_USERNAME,
                config.TWITTER_PASSWORD,
                config.TWITTER_EMAIL,
                config.TWITTER_2FA_SECRET
            );
        } catch (error) {
            elizaLogger.error('Error initializing Twitter scraper:', error);
            throw error;
        }
    }

    /**
     * Check if we are following a user
     */
    async isFollowing(username: string): Promise<boolean> {
        try {
            return await this.scraper.isFollowing(username);
        } catch (error) {
            elizaLogger.error(`Error checking if following ${username}:`, error);
            return false;
        }
    }

    /**
     * Follow a user
     */
    async follow(username: string): Promise<boolean> {
        try {
            return await this.scraper.follow(username);
        } catch (error) {
            elizaLogger.error(`Error following ${username}:`, error);
            return false;
        }
    }

    /**
     * Unfollow a user
     */
    async unfollow(username: string): Promise<boolean> {
        try {
            return await this.scraper.unfollow(username);
        } catch (error) {
            elizaLogger.error(`Error unfollowing ${username}:`, error);
            return false;
        }
    }
}