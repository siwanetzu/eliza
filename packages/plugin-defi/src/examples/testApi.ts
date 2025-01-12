import {
  getAllProtocols,
  getProtocolHistoricalTVL,
  getCurrentProtocolTVL
} from '../apiTools';

async function testDefiLlamaAPI() {
  try {
    // Test getting all protocols
    console.log('\nFetching all protocols...');
    const protocols = await getAllProtocols();
    console.log(`Found ${protocols.length} protocols`);
    console.log('Sample protocol:', protocols[0]);

    // Test getting specific protocol data
    console.log('\nFetching Aave data...');
    const aaveData = await getProtocolHistoricalTVL('aave');
    console.log('Aave TVL:', aaveData.tvl);

    // Test getting current TVL
    console.log('\nFetching current Uniswap TVL...');
    const uniswapTVL = await getCurrentProtocolTVL('uniswap');
    console.log('Uniswap current TVL:', uniswapTVL);

  } catch (error) {
    console.error('Error testing DeFi Llama API:', error);
  }
}

// Run the test
testDefiLlamaAPI();