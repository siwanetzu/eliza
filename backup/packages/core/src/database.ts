import type {
    Account,
    Actor,
    Goal,
    GoalStatus,
    Memory,
    Participant,
    Relationship,
    UUID
} from "@elizaos/types";

export interface IDatabaseCacheAdapter {
    getCache(params: {
        key: string;
        agentId: UUID;
    }): Promise<string | undefined>;
    setCache(params: {
        key: string;
        agentId: UUID;
        value: string;
    }): Promise<boolean>;
    deleteCache(params: {
        key: string;
        agentId: UUID;
    }): Promise<boolean>;
}

export abstract class DatabaseAdapter {
    abstract init(): Promise<void>;
    abstract close(): Promise<void>;

    abstract getAccountById(userId: UUID): Promise<Account | null>;
    abstract createAccount(account: Account): Promise<boolean>;

    abstract getActorDetails(params: { roomId: UUID }): Promise<Actor[]>;

    abstract getMemoriesByRoomIds(params: {
        agentId: UUID;
        roomIds: UUID[];
        tableName: string;
    }): Promise<Memory[]>;
    abstract getMemoryById(memoryId: UUID): Promise<Memory | null>;
    abstract createMemory(memory: Memory, tableName: string): Promise<void>;
    abstract searchMemories(params: {
        tableName: string;
        roomId: UUID;
        agentId?: UUID;
        embedding: number[];
        match_threshold: number;
        match_count: number;
        unique: boolean;
    }): Promise<Memory[]>;
    abstract searchMemoriesByEmbedding(
        embedding: number[],
        params: {
            match_threshold?: number;
            count?: number;
            roomId?: UUID;
            agentId: UUID;
            unique?: boolean;
            tableName: string;
        }
    ): Promise<Memory[]>;
    abstract getCachedEmbeddings(opts: {
        query_table_name: string;
        query_threshold: number;
        query_input: string;
        query_field_name: string;
        query_field_sub_name: string;
        query_match_count: number;
    }): Promise<{ embedding: number[]; levenshtein_score: number }[]>;

    abstract updateGoalStatus(params: {
        goalId: UUID;
        status: GoalStatus;
    }): Promise<void>;

    abstract log(params: {
        body: { [key: string]: unknown };
        userId: UUID;
        roomId: UUID;
        type: string;
    }): Promise<void>;

    abstract getMemories(params: {
        roomId: UUID;
        count?: number;
        unique?: boolean;
        tableName: string;
        agentId: UUID;
        start?: number;
        end?: number;
    }): Promise<Memory[]>;

    abstract removeMemory(memoryId: UUID, tableName: string): Promise<void>;
    abstract removeAllMemories(roomId: UUID, tableName: string): Promise<void>;
    abstract countMemories(
        roomId: UUID,
        unique?: boolean,
        tableName?: string
    ): Promise<number>;

    abstract getGoals(params: {
        roomId: UUID;
        userId?: UUID | null;
        onlyInProgress?: boolean;
        count?: number;
    }): Promise<Goal[]>;
    abstract updateGoal(goal: Goal): Promise<void>;
    abstract createGoal(goal: Goal): Promise<void>;
    abstract removeGoal(goalId: UUID): Promise<void>;
    abstract removeAllGoals(roomId: UUID): Promise<void>;

    abstract createRoom(roomId?: UUID): Promise<UUID>;
    abstract removeRoom(roomId: UUID): Promise<void>;
    abstract getRoom(roomId: UUID): Promise<UUID | null>;
    abstract getRoomsForParticipant(userId: UUID): Promise<UUID[]>;
    abstract getRoomsForParticipants(userIds: UUID[]): Promise<UUID[]>;

    abstract addParticipant(userId: UUID, roomId: UUID): Promise<boolean>;
    abstract removeParticipant(userId: UUID, roomId: UUID): Promise<boolean>;
    abstract getParticipantsForAccount(userId: UUID): Promise<Participant[]>;
    abstract getParticipantsForRoom(roomId: UUID): Promise<UUID[]>;
    abstract getParticipantUserState(
        roomId: UUID,
        userId: UUID
    ): Promise<"FOLLOWED" | "MUTED" | null>;
    abstract setParticipantUserState(
        roomId: UUID,
        userId: UUID,
        state: "FOLLOWED" | "MUTED" | null
    ): Promise<void>;

    abstract createRelationship(params: {
        userA: UUID;
        userB: UUID;
    }): Promise<boolean>;
    abstract getRelationship(params: {
        userA: UUID;
        userB: UUID;
    }): Promise<Relationship | null>;
    abstract getRelationships(params: { userId: UUID }): Promise<Relationship[]>;
}
