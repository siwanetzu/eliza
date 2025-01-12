declare global {
  var twitterClient: {
    searchTweets: (query: string) => Promise<any[]>;
  };
}

export {};