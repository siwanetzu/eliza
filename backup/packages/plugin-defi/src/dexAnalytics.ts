import axios from 'axios';
import { DEXVolume } from './types';
import { rateLimitedRequest } from './apiTools';

export async function getDEXStats(dex: string): Promise<DEXVolume> {
  try {
    const response = await rateLimitedRequest(() =>
      axios.get(`https://api.llama.fi/overview/dexs/${dex}`, {
        headers: { 'Accept': '*/*' }
      })
    );

    const data = response.data;
    return {
      dailyVolume: data.total24h || 0,
      totalVolume: data.totalAllTime || 0,
      volumeChange24h: data.change24h || 0,
      topPairs: (data.pairs || []).slice(0, 5).map((pair: any) => ({
        pair: pair.name,
        volume: pair.volume24h,
        priceChange: pair.priceChange24h
      }))
    };
  } catch (error) {
    console.error('Error fetching DEX stats:', error);
    throw error;
  }
}