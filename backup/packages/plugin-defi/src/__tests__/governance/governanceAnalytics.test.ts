import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { getGovernanceProposals } from '../../governanceAnalytics';
import { rateLimitedRequest } from '../../apiTools';
import axios from 'axios';

jest.mock('../../apiTools');
jest.mock('axios');

describe('Governance Analytics', () => {
    const mockSnapshotResponse = {
        data: {
            data: {
                proposals: [
                    {
                        id: 'proposal1',
                        title: 'Test Proposal 1',
                        body: 'Test Description 1',
                        state: 'active',
                        scores_total: 1000,
                        scores_state: 'final',
                        quorum: 500,
                        end: Math.floor(Date.now() / 1000) + 86400
                    },
                    {
                        id: 'proposal2',
                        title: 'Test Proposal 2',
                        body: 'Test Description 2',
                        state: 'closed',
                        scores_total: 2000,
                        scores_state: 'final',
                        quorum: 1000,
                        end: Math.floor(Date.now() / 1000)
                    }
                ]
            }
        }
    };

    const mockTallyResponse = {
        data: {
            data: {
                proposals: {
                    nodes: [
                        {
                            id: 'tally1',
                            title: 'Tally Proposal 1',
                            description: 'Tally Description 1',
                            status: 'ACTIVE',
                            totalVotes: 1500,
                            quorum: 750,
                            endTime: new Date().toISOString()
                        }
                    ]
                }
            }
        }
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (rateLimitedRequest as jest.MockedFunction<typeof rateLimitedRequest>).mockImplementation((fn) => fn());
    });

    it('should fetch and format Snapshot governance proposals', async () => {
        (axios.post as jest.MockedFunction<typeof axios.post>).mockResolvedValueOnce(mockSnapshotResponse);

        const protocol = 'test-protocol';
        const proposals = await getGovernanceProposals(protocol);

        expect(proposals).toHaveLength(2);
        expect(proposals[0]).toMatchObject({
            id: 'proposal1',
            title: 'Test Proposal 1',
            description: 'Test Description 1',
            status: 'active',
            votes: {
                for: 1000,
                against: 0
            },
            quorum: 500
        });
        expect(proposals[0].deadline).toBeInstanceOf(Date);
    });

    it('should fallback to Tally when Snapshot returns no proposals', async () => {
        (axios.post as jest.MockedFunction<typeof axios.post>)
            .mockResolvedValueOnce({ data: { data: { proposals: [] } } })
            .mockResolvedValueOnce(mockTallyResponse);

        const protocol = 'test-protocol';
        const proposals = await getGovernanceProposals(protocol);

        expect(proposals).toHaveLength(1);
        expect(proposals[0]).toMatchObject({
            id: 'tally1',
            title: 'Tally Proposal 1',
            description: 'Tally Description 1',
            status: 'active',
            votes: {
                for: 1500,
                against: 0
            },
            quorum: 750
        });
        expect(proposals[0].deadline).toBeInstanceOf(Date);
    });

    it('should handle API errors gracefully', async () => {
        const error = new Error('API Error');
        (axios.post as jest.MockedFunction<typeof axios.post>).mockRejectedValue(error);

        const protocol = 'test-protocol';
        await expect(getGovernanceProposals(protocol)).rejects.toThrow('API Error');
    });
});