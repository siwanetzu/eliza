import { elizaLogger } from '@elizaos/core';
import { Scraper as BaseTwitterScraper } from 'agent-twitter-client';

export class Scraper extends BaseTwitterScraper {
    async login(username: string, password: string, email?: string, twoFactorSecret?: string): Promise<void> {
        try {
            elizaLogger.info('Attempting to log in to Twitter...');
            await super.login(username, password, email, twoFactorSecret);
            if (await super.isLoggedIn()) {
                elizaLogger.info('Successfully logged in to Twitter');
            } else {
                throw new Error('Failed to login to Twitter');
            }
        } catch (error) {
            elizaLogger.error('Error logging in to Twitter:', error);
            throw error;
        }
    }

    async isLoggedIn(): Promise<boolean> {
        try {
            const loggedIn = await super.isLoggedIn();
            elizaLogger.debug('Twitter login status:', loggedIn);
            return loggedIn;
        } catch (error) {
            elizaLogger.error('Error checking Twitter login status:', error);
            return false;
        }
    }

    async follow(username: string): Promise<void> {
        try {
            elizaLogger.debug(`Attempting to follow ${username}`);
            await super.followUser(username);
        } catch (error) {
            elizaLogger.error(`Error following ${username}:`, error);
            throw error;
        }
    }

    async unfollow(username: string): Promise<void> {
        try {
            elizaLogger.debug(`Attempting to unfollow ${username}`);
            throw new Error('Unfollow operation is not supported');
        } catch (error) {
            elizaLogger.error(`Error unfollowing ${username}:`, error);
            throw error;
        }
    }

    async isFollowing(username: string): Promise<boolean> {
        try {
            elizaLogger.debug(`Checking if following ${username}`);
            throw new Error('isFollowing operation is not supported');
        } catch (error) {
            elizaLogger.error(`Error checking if following ${username}:`, error);
            return false;
        }
    }
}