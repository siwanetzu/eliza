import axios, { AxiosError, AxiosResponse } from 'axios';

interface MarketData {
  [key: string]: {
    usd: number;
  };
}

interface ProtocolData {
  tvl: number;
  name: string;
  symbol: string;
  // Add other relevant fields from DeFiLlama API
}

interface TVLData {
  tvl: number;
  name?: string;
  symbol?: string;
  chainTvls?: {
    [chain: string]: number;
  };
  tokens?: {
    [token: string]: {
      amount: number;
      price: number;
      tvl: number;
    };
  };
}

interface ChainTVLData {
  tvl: number[];
  timestamp: number[];
}

/**
 * Interface for chain-specific TVL data
 * @interface ChainTVL
 */
interface ChainTVL {
  /** CoinGecko ID for the chain */
  gecko_id: string;
  /** Total Value Locked in USD */
  tvl: number;
  /** Native token symbol */
  tokenSymbol: string;
  /** CoinMarketCap ID */
  cmcId: string;
  /** Chain name */
  name: string;
}

interface ChainHistoricalTVLData {
  date: number;
  tvl: number;
}

/**
 * Configuration for rate limiting API requests
 * @constant {number} RATE_LIMIT_DELAY - Delay between requests in milliseconds
 */
const RATE_LIMIT_DELAY = 1000;

/**
 * Configuration for request retries
 */
const MAX_RETRIES = 3;
const RETRY_DELAY = 5000;

interface RateLimitConfig {
    maxRequests: number;
    timeWindow: number; // in milliseconds
}

const rateLimits: { [key: string]: RateLimitConfig } = {
    'api.llama.fi': { maxRequests: 30, timeWindow: 60000 }, // 30 requests per minute
    'api.defisafety.com': { maxRequests: 10, timeWindow: 60000 }, // 10 requests per minute
    'hub.snapshot.org': { maxRequests: 20, timeWindow: 60000 }, // 20 requests per minute
    'api.tally.xyz': { maxRequests: 15, timeWindow: 60000 }, // 15 requests per minute
    'api.santiment.net': { maxRequests: 25, timeWindow: 60000 }, // 25 requests per minute
    'default': { maxRequests: 10, timeWindow: 60000 } // Default rate limit
};

const requestTimestamps: { [key: string]: number[] } = {};

async function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function rateLimitedRequest<T>(
    requestFn: () => Promise<AxiosResponse<T>>,
    retries = 3
): Promise<AxiosResponse<T>> {
    try {
        const url = extractBaseUrl(requestFn.toString());
        await enforceRateLimit(url);
        return await requestFn();
    } catch (error: any) {
        if (error.response?.status === 429 && retries > 0) {
            // Rate limit exceeded, wait and retry
            const retryAfter = parseInt(error.response.headers['retry-after']) || 60;
            await delay(retryAfter * 1000);
            return rateLimitedRequest(requestFn, retries - 1);
        }
        throw error;
    }
}

function extractBaseUrl(requestString: string): string {
    // Extract domain from axios request string
    const urlMatch = requestString.match(/https?:\/\/([^\/]+)/);
    return urlMatch ? urlMatch[1] : 'default';
}

async function enforceRateLimit(domain: string): Promise<void> {
    const config = rateLimits[domain] || rateLimits['default'];
    const now = Date.now();

    if (!requestTimestamps[domain]) {
        requestTimestamps[domain] = [];
    }

    // Remove timestamps outside the time window
    requestTimestamps[domain] = requestTimestamps[domain].filter(
        timestamp => now - timestamp < config.timeWindow
    );

    if (requestTimestamps[domain].length >= config.maxRequests) {
        const oldestTimestamp = requestTimestamps[domain][0];
        const waitTime = config.timeWindow - (now - oldestTimestamp);
        await delay(waitTime);
    }

    requestTimestamps[domain].push(now);
}

export function clearRequestTimestamps(): void {
    Object.keys(requestTimestamps).forEach(key => {
        requestTimestamps[key] = [];
    });
}

/**
 * Fetches live market data from CoinGecko
 * @param token - Token ID as per CoinGecko's API
 */
export async function fetchMarketData(token: string): Promise<MarketData> {
  try {
    const response = await rateLimitedRequest(() => axios.get('https://api.coingecko.com/api/v3/simple/price', {
      params: {
        ids: token,
        vs_currencies: 'usd'
      },
      headers: {
        'Accept': 'application/json',
        // Add your API key if you have one
        // 'X-CG-Pro-API-Key': process.env.COINGECKO_API_KEY
      }
    }));
    return response.data;
  } catch (error) {
    console.error('Error fetching market data:', error);
    throw error;
  }
}

/**
 * Fetches protocol data from DeFiLlama
 * @param protocol - Protocol slug as per DeFiLlama's API
 */
export async function fetchProtocolData(protocol: string): Promise<ProtocolData> {
  try {
    const response = await rateLimitedRequest(() =>
      axios.get(`https://api.llama.fi/protocol/${protocol}`, {
        headers: { 'Accept': '*/*' }
      })
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching protocol data:', error);
    throw error;
  }
}

/**
 * Fetches TVL data for multiple protocols
 * @param protocols - Array of protocol slugs
 */
export async function fetchMultiProtocolTVL(protocols: string[]): Promise<Record<string, number>> {
  try {
    const results = await Promise.all(
      protocols.map(protocol => fetchProtocolData(protocol))
    );

    return results.reduce((acc, protocol) => ({
      ...acc,
      [protocol.name]: protocol.tvl
    }), {});
  } catch (error) {
    console.error('Error fetching multiple protocol data:', error);
    throw error;
  }
}

/**
 * Fetches gas prices from ETH gas station
 */
export async function fetchGasPrices(): Promise<{
  fast: number;
  standard: number;
  slow: number;
}> {
  try {
    const response = await axios.get('https://ethgasstation.info/api/ethgasAPI.json', {
      headers: {
        'Accept': 'application/json',
        // Add your API key if you have one
        // 'Authorization': `Bearer ${process.env.ETH_GAS_STATION_API_KEY}`
      }
    });
    return {
      fast: response.data.fast / 10,
      standard: response.data.average / 10,
      slow: response.data.safeLow / 10
    };
  } catch (error) {
    console.error('Error fetching gas prices:', error);
    throw error;
  }
}

// Fetch all protocols
export async function getAllProtocols(): Promise<TVLData[]> {
  try {
    const response = await rateLimitedRequest(() =>
      axios.get('https://api.llama.fi/protocols', {
        headers: { 'Accept': '*/*' }
      })
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching all protocols:', error);
    throw error;
  }
}

// Get historical TVL of a specific protocol with breakdowns
export async function getProtocolHistoricalTVL(protocol: string): Promise<TVLData> {
  try {
    const response = await axios.get(`https://api.llama.fi/protocol/${protocol}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching protocol historical TVL:', error);
    throw error;
  }
}

// Get historical TVL of all chains (excluding liquid staking and double counted TVL)
export async function getHistoricalChainTVL(): Promise<ChainTVLData> {
  try {
    const response = await axios.get('https://api.llama.fi/v2/historicalChainTvl');
    return response.data;
  } catch (error) {
    console.error('Error fetching historical chain TVL:', error);
    throw error;
  }
}

// Get historical TVL of a specific chain
export async function getChainHistoricalTVL(chain: string): Promise<ChainHistoricalTVLData[]> {
  try {
    const response = await rateLimitedRequest(() =>
      axios.get(`https://api.llama.fi/v2/historicalChainTvl/${chain}`, {
        headers: { 'Accept': '*/*' }
      })
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching chain historical TVL:', error);
    throw error;
  }
}

// Get current TVL of a specific protocol (simplified endpoint)
export async function getCurrentProtocolTVL(protocol: string): Promise<number> {
  try {
    const response = await rateLimitedRequest(() =>
      axios.get(`https://api.llama.fi/tvl/${protocol}`, {
        headers: { 'Accept': '*/*' }
      })
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching current protocol TVL:', error);
    throw error;
  }
}

// Get current TVL of all chains
export async function getAllChainsTVL(): Promise<Record<string, ChainTVL>> {
  try {
    const response = await rateLimitedRequest(() =>
      axios.get('https://api.llama.fi/v2/chains', {
        headers: { 'Accept': '*/*' }
      })
    );

    // Transform the response into a record with chain names as keys
    return response.data.reduce((acc: Record<string, ChainTVL>, chain: ChainTVL) => {
      acc[chain.name] = chain;
      return acc;
    }, {});
  } catch (error) {
    console.error('Error fetching all chains TVL:', error);
    throw error;
  }
}