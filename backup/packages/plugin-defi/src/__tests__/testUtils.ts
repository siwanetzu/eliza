export const mockDEXResponse = {
  data: {
    total24h: 1000000,
    totalAllTime: 50000000,
    change24h: 0.05,
    pairs: [
      {
        name: 'ETH/USDC',
        volume24h: 500000,
        priceChange24h: 0.02
      },
      {
        name: 'BTC/USDT',
        volume24h: 300000,
        priceChange24h: -0.01
      }
    ]
  }
};

export const mockYieldResponse = {
  data: [
    {
      project: 'Aave',
      apy: 4.5,
      tvlUsd: 5000000,
      rewardTokens: ['AAVE']
    },
    {
      project: 'Compound',
      apy: 3.8,
      tvlUsd: 4000000,
      rewardTokens: ['COMP']
    }
  ]
};

export const mockGovernanceResponse = {
  data: {
    data: {
      proposals: [
        {
          id: 'proposal-1',
          title: 'Update Interest Rate Model',
          space: {
            name: 'aave.eth'
          },
          state: 'active',
          scores: [1000000, 500000],
          end: 1678900000,
          body: 'Proposal to update the interest rate model...'
        },
        {
          id: 'proposal-2',
          title: 'Add New Market',
          space: {
            name: 'compound'
          },
          state: 'active',
          scores: [800000, 300000],
          end: 1678900100,
          body: 'Proposal to add new market...'
        }
      ]
    }
  }
};

export const mockTwitterResponse = {
  data: {
    meta: { result_count: 100 },
    data: [
      { text: 'Very bullish on this protocol!' },
      { text: 'Great development progress' }
    ]
  }
};

export const mockGithubResponse = {
  commits: { data: [{ total: 10 }, { total: 15 }] },
  contributors: { data: Array(5).fill({}) },
  issues: { data: Array(20).fill({}) },
  pulls: { data: Array(10).fill({}) }
};

export const mockAuditResponse = {
  data: {
    audits: [
      {
        auditor: 'CertiK',
        score: 95,
        date: '2023-12-01',
        url: 'https://certik.com/report/aave'
      },
      {
        auditor: 'OpenZeppelin',
        score: 92,
        date: '2023-11-15',
        url: 'https://openzeppelin.com/security-audits/aave'
      }
    ]
  }
};

export const mockEtherscanResponse = {
  data: {
    result: [{
      SourceCode: `
        contract AaveProtocol {
          modifier onlyOwner() {
            require(msg.sender == owner);
            _;
          }

          uint256 public constant delay = 86400; // 24 hours

          // Using TransparentUpgradeableProxy
          function upgrade() external onlyOwner timelock { }
        }
      `,
      IsVerified: '1',
      License: 'MIT',
      Proxy: '1'
    }]
  }
};

export const mockTVLHoldersResponse = {
  data: [
    { value: 1000000 },
    { value: 800000 },
    { value: 500000 },
    { value: 300000 },
    { value: 200000 }
  ]
};