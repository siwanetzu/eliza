import { Client, elizaLogger, IAgentRuntime } from "@elizaos/core";
import { ClientBase } from "./base.ts";
import { validateTwitterConfig, TwitterConfig } from "./environment.ts";
import { TwitterInteractionClient } from "./interactions.ts";
import { TwitterPostClient } from "./post.ts";
import { TwitterSearchClient } from "./search.ts";
import { TwitterLearningClient } from "./twitterLearning.ts";
import { MetricsReporter } from '@elizaos/core/src/metrics/metricsReporting';

class TwitterManager {
    client: ClientBase;
    post: TwitterPostClient;
    search: TwitterSearchClient;
    interaction: TwitterInteractionClient;
    learning: TwitterLearningClient;
    metricsReporter: MetricsReporter;
    constructor(runtime: IAgentRuntime, twitterConfig:TwitterConfig) {
        this.client = new ClientBase(runtime, twitterConfig);
        this.post = new TwitterPostClient(this.client, runtime);
        this.learning = new TwitterLearningClient(this.client);

        if (twitterConfig.TWITTER_SEARCH_ENABLE) {
            // this searches topics from character file
            elizaLogger.warn("Twitter/X client running in a mode that:");
            elizaLogger.warn("1. violates consent of random users");
            elizaLogger.warn("2. burns your rate limit");
            elizaLogger.warn("3. can get your account banned");
            elizaLogger.warn("use at your own risk");
            this.search = new TwitterSearchClient(this.client, runtime);
        }

        this.interaction = new TwitterInteractionClient(this.client, runtime);
        this.metricsReporter = new MetricsReporter(this, runtime);
    }

    async init() {
        await this.client.init();
        await this.learning.init();
        await this.post.start();
        if (this.search) {
            await this.search.start();
        }
        await this.interaction.start();
    }
}

export const TwitterClientInterface: Client = {
    async start(runtime: IAgentRuntime) {
        const twitterConfig:TwitterConfig = await validateTwitterConfig(runtime);

        elizaLogger.log("Twitter client started");

        const manager = new TwitterManager(runtime, twitterConfig);
        await manager.init();

        return manager;
    },
    async stop(_runtime: IAgentRuntime) {
        elizaLogger.warn("Twitter client does not support stopping yet");
    },
};

export default TwitterClientInterface;
