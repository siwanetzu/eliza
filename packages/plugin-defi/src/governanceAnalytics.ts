import axios from 'axios';
import { GovernanceProposal } from './types';
import { rateLimitedRequest } from './apiTools';

const SNAPSHOT_API = 'https://hub.snapshot.org/graphql';
const TALLY_API = 'https://api.tally.xyz/query';

export async function getGovernanceProposals(protocol: string): Promise<GovernanceProposal[]> {
    try {
        // Try Snapshot first
        const snapshotProposals = await getSnapshotProposals(protocol);
        if (snapshotProposals.length > 0) {
            return snapshotProposals;
        }

        // Fallback to Tally
        return getTallyProposals(protocol);
    } catch (error) {
        console.error('Error fetching governance proposals:', error);
        throw error;
    }
}

async function getSnapshotProposals(protocol: string): Promise<GovernanceProposal[]> {
    const query = `
        query Proposals {
            proposals(
                first: 10,
                skip: 0,
                where: {
                    space_in: ["${protocol}.eth"]
                },
                orderBy: "created",
                orderDirection: desc
            ) {
                id
                title
                body
                state
                scores_total
                scores_state
                quorum
                end
            }
        }
    `;

    const response = await rateLimitedRequest(() =>
        axios.post(SNAPSHOT_API, { query })
    );

    return response.data.data.proposals.map((prop: any) => ({
        id: prop.id,
        title: prop.title,
        description: prop.body,
        status: prop.state,
        votes: {
            for: prop.scores_total || 0,
            against: 0 // Snapshot doesn't always provide against votes
        },
        quorum: prop.quorum || 0,
        deadline: new Date(prop.end * 1000)
    }));
}

async function getTallyProposals(protocol: string): Promise<GovernanceProposal[]> {
    const query = `
        query Proposals($protocol: String!) {
            proposals(
                where: { governanceId: $protocol }
                orderBy: CREATED_AT_DESC
                first: 10
            ) {
                nodes {
                    id
                    title
                    description
                    status
                    totalVotes
                    quorum
                    endTime
                }
            }
        }
    `;

    const response = await rateLimitedRequest(() =>
        axios.post(TALLY_API, {
            query,
            variables: { protocol }
        })
    );

    return response.data.data.proposals.nodes.map((prop: any) => ({
        id: prop.id,
        title: prop.title,
        description: prop.description,
        status: prop.status.toLowerCase(),
        votes: {
            for: prop.totalVotes || 0,
            against: 0 // Tally API might not provide against votes
        },
        quorum: prop.quorum || 0,
        deadline: new Date(prop.endTime)
    }));
}