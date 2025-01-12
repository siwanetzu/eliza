export type UUID = string;

export interface Account {
    id: UUID;
    name: string;
    username: string;
    email?: string;
    avatarUrl?: string;
    details: Record<string, unknown>;
}

export interface Actor {
    id: UUID;
    name: string;
    username: string;
    details: Record<string, unknown>;
}

export interface Memory {
    id: UUID;
    type: string;
    content: unknown;
    embedding?: number[];
    userId?: UUID;
    roomId: UUID;
    agentId: UUID;
    unique?: boolean;
    createdAt?: number;
}

export interface Goal {
    id: UUID;
    title: string;
    description: string;
    name: string;
    objectives: Record<string, unknown>;
    status: GoalStatus;
    userId?: UUID;
    roomId: UUID;
    createdAt: number;
    updatedAt: number;
}

export interface Relationship {
    userA: UUID;
    userB: UUID;
    status: string;
    createdAt: number;
    updatedAt: number;
}

export interface Participant {
    id: UUID;
    userId: UUID;
    roomId: UUID;
    last_message_read?: number;
    userState?: "FOLLOWED" | "MUTED" | null;
}

export enum GoalStatus {
    PENDING = "PENDING",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED"
}
