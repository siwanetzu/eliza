import { describe, it, expect } from 'vitest';
import {
  getAllProtocols,
  getProtocolHistoricalTVL,
  getCurrentProtocolTVL,
  getAllChainsTVL,
  getChainHistoricalTVL
} from '../apiTools';

describe('DeFi Llama API Integration', () => {
  // Test fetching all protocols
  it('should fetch all protocols', async () => {
    const protocols = await getAllProtocols();
    expect(protocols).toBeDefined();
    expect(Array.isArray(protocols)).toBe(true);
    expect(protocols.length).toBeGreaterThan(0);
    // Check if protocols have required properties
    expect(protocols[0]).toHaveProperty('tvl');
    expect(protocols[0]).toHaveProperty('name');
  });

  // Test fetching specific protocol data
  it('should fetch Aave protocol data', async () => {
    const protocol = await getProtocolHistoricalTVL('aave');
    expect(protocol).toBeDefined();
    expect(protocol).toHaveProperty('tvl');
    expect(protocol).toHaveProperty('name');
  });

  // Test fetching current TVL for a protocol
  it('should fetch current Uniswap TVL', async () => {
    const tvl = await getCurrentProtocolTVL('uniswap');
    expect(tvl).toBeDefined();
    expect(typeof tvl).toBe('number');
    expect(tvl).toBeGreaterThan(0);
  });

  // Test fetching all chains TVL
  it('should fetch all chains TVL', async () => {
    const chainsTVL = await getAllChainsTVL();
    expect(chainsTVL).toBeDefined();
    expect(typeof chainsTVL).toBe('object');

    // Check if we have chain data
    const someChain = Object.values(chainsTVL)[0];
    expect(someChain).toHaveProperty('tvl');
    expect(someChain).toHaveProperty('name');

    // Check if Ethereum is present
    const ethereum = Object.values(chainsTVL).find(chain =>
      chain.name.toLowerCase() === 'ethereum'
    );
    expect(ethereum).toBeDefined();
    expect(ethereum?.tvl).toBeGreaterThan(0);
  });

  // Test fetching specific chain historical TVL
  it('should fetch Ethereum historical TVL', async () => {
    const ethTVL = await getChainHistoricalTVL('ethereum');
    expect(ethTVL).toBeDefined();
    expect(Array.isArray(ethTVL)).toBe(true);

    // Check the structure of the first data point
    const dataPoint = ethTVL[0];
    expect(dataPoint).toHaveProperty('date');
    expect(dataPoint).toHaveProperty('tvl');
    expect(typeof dataPoint.date).toBe('number');
    expect(typeof dataPoint.tvl).toBe('number');
  });
});