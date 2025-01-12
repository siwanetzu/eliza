[@elizaos/core v0.1.7-alpha.2](../index.md) / DatabaseAdapter

# Class: `abstract` DatabaseAdapter

## Constructors

### new DatabaseAdapter()

> **new DatabaseAdapter**(): [`DatabaseAdapter`](DatabaseAdapter.md)

#### Returns

[`DatabaseAdapter`](DatabaseAdapter.md)

## Methods

### init()

> `abstract` **init**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/core/src/database.ts:29](https://github.com/siwanetzu/eliza/blob/main/packages/core/src/database.ts#L29)

***

### close()

> `abstract` **close**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/core/src/database.ts:30](https://github.com/siwanetzu/eliza/blob/main/packages/core/src/database.ts#L30)

***

### getAccountById()

> `abstract` **getAccountById**(`userId`): `Promise`\<`Account`\>

#### Parameters

• **userId**: `string`

#### Returns

`Promise`\<`Account`\>

#### Defined in

[packages/core/src/database.ts:32](https://github.com/siwanetzu/eliza/blob/main/packages/core/src/database.ts#L32)

***

### createAccount()

> `abstract` **createAccount**(`account`): `Promise`\<`boolean`\>

#### Parameters

• **account**: `Account`

#### Returns

`Promise`\<`boolean`\>

#### Defined in

[packages/core/src/database.ts:33](https://github.com/siwanetzu/eliza/blob/main/packages/core/src/database.ts#L33)

***

### getActorDetails()

> `abstract` **getActorDetails**(`params`): `Promise`\<`Actor`[]\>

#### Parameters

• **params**

• **params.roomId**: `string`

#### Returns

`Promise`\<`Actor`[]\>

#### Defined in

[packages/core/src/database.ts:35](https://github.com/siwanetzu/eliza/blob/main/packages/core/src/database.ts#L35)

***

### getMemoriesByRoomIds()

> `abstract` **getMemoriesByRoomIds**(`params`): `Promise`\<`Memory`[]\>

#### Parameters

• **params**

• **params.agentId**: `string`

• **params.roomIds**: `string`[]

• **params.tableName**: `string`

#### Returns

`Promise`\<`Memory`[]\>

#### Defined in

[packages/core/src/database.ts:37](https://github.com/siwanetzu/eliza/blob/main/packages/core/src/database.ts#L37)

***

### getMemoryById()

> `abstract` **getMemoryById**(`memoryId`): `Promise`\<`Memory`\>

#### Parameters

• **memoryId**: `string`

#### Returns

`Promise`\<`Memory`\>

#### Defined in

[packages/core/src/database.ts:42](https://github.com/siwanetzu/eliza/blob/main/packages/core/src/database.ts#L42)

***

### createMemory()

> `abstract` **createMemory**(`memory`, `tableName`): `Promise`\<`void`\>

#### Parameters

• **memory**: `Memory`

• **tableName**: `string`

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/core/src/database.ts:43](https://github.com/siwanetzu/eliza/blob/main/packages/core/src/database.ts#L43)

***

### searchMemories()

> `abstract` **searchMemories**(`params`): `Promise`\<`Memory`[]\>

#### Parameters

• **params**

• **params.tableName**: `string`

• **params.roomId**: `string`

• **params.agentId?**: `string`

• **params.embedding**: `number`[]

• **params.match\_threshold**: `number`

• **params.match\_count**: `number`

• **params.unique**: `boolean`

#### Returns

`Promise`\<`Memory`[]\>

#### Defined in

[packages/core/src/database.ts:44](https://github.com/siwanetzu/eliza/blob/main/packages/core/src/database.ts#L44)

***

### searchMemoriesByEmbedding()

> `abstract` **searchMemoriesByEmbedding**(`embedding`, `params`): `Promise`\<`Memory`[]\>

#### Parameters

• **embedding**: `number`[]

• **params**

• **params.match\_threshold?**: `number`

• **params.count?**: `number`

• **params.roomId?**: `string`

• **params.agentId**: `string`

• **params.unique?**: `boolean`

• **params.tableName**: `string`

#### Returns

`Promise`\<`Memory`[]\>

#### Defined in

[packages/core/src/database.ts:53](https://github.com/siwanetzu/eliza/blob/main/packages/core/src/database.ts#L53)

***

### getCachedEmbeddings()

> `abstract` **getCachedEmbeddings**(`opts`): `Promise`\<`object`[]\>

#### Parameters

• **opts**

• **opts.query\_table\_name**: `string`

• **opts.query\_threshold**: `number`

• **opts.query\_input**: `string`

• **opts.query\_field\_name**: `string`

• **opts.query\_field\_sub\_name**: `string`

• **opts.query\_match\_count**: `number`

#### Returns

`Promise`\<`object`[]\>

#### Defined in

[packages/core/src/database.ts:64](https://github.com/siwanetzu/eliza/blob/main/packages/core/src/database.ts#L64)

***

### updateGoalStatus()

> `abstract` **updateGoalStatus**(`params`): `Promise`\<`void`\>

#### Parameters

• **params**

• **params.goalId**: `string`

• **params.status**: `GoalStatus`

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/core/src/database.ts:73](https://github.com/siwanetzu/eliza/blob/main/packages/core/src/database.ts#L73)

***

### log()

> `abstract` **log**(`params`): `Promise`\<`void`\>

#### Parameters

• **params**

• **params.body**

• **params.userId**: `string`

• **params.roomId**: `string`

• **params.type**: `string`

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/core/src/database.ts:78](https://github.com/siwanetzu/eliza/blob/main/packages/core/src/database.ts#L78)

***

### getMemories()

> `abstract` **getMemories**(`params`): `Promise`\<`Memory`[]\>

#### Parameters

• **params**

• **params.roomId**: `string`

• **params.count?**: `number`

• **params.unique?**: `boolean`

• **params.tableName**: `string`

• **params.agentId**: `string`

• **params.start?**: `number`

• **params.end?**: `number`

#### Returns

`Promise`\<`Memory`[]\>

#### Defined in

[packages/core/src/database.ts:85](https://github.com/siwanetzu/eliza/blob/main/packages/core/src/database.ts#L85)

***

### removeMemory()

> `abstract` **removeMemory**(`memoryId`, `tableName`): `Promise`\<`void`\>

#### Parameters

• **memoryId**: `string`

• **tableName**: `string`

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/core/src/database.ts:95](https://github.com/siwanetzu/eliza/blob/main/packages/core/src/database.ts#L95)

***

### removeAllMemories()

> `abstract` **removeAllMemories**(`roomId`, `tableName`): `Promise`\<`void`\>

#### Parameters

• **roomId**: `string`

• **tableName**: `string`

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/core/src/database.ts:96](https://github.com/siwanetzu/eliza/blob/main/packages/core/src/database.ts#L96)

***

### countMemories()

> `abstract` **countMemories**(`roomId`, `unique`?, `tableName`?): `Promise`\<`number`\>

#### Parameters

• **roomId**: `string`

• **unique?**: `boolean`

• **tableName?**: `string`

#### Returns

`Promise`\<`number`\>

#### Defined in

[packages/core/src/database.ts:97](https://github.com/siwanetzu/eliza/blob/main/packages/core/src/database.ts#L97)

***

### getGoals()

> `abstract` **getGoals**(`params`): `Promise`\<`Goal`[]\>

#### Parameters

• **params**

• **params.roomId**: `string`

• **params.userId?**: `string`

• **params.onlyInProgress?**: `boolean`

• **params.count?**: `number`

#### Returns

`Promise`\<`Goal`[]\>

#### Defined in

[packages/core/src/database.ts:103](https://github.com/siwanetzu/eliza/blob/main/packages/core/src/database.ts#L103)

***

### updateGoal()

> `abstract` **updateGoal**(`goal`): `Promise`\<`void`\>

#### Parameters

• **goal**: `Goal`

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/core/src/database.ts:109](https://github.com/siwanetzu/eliza/blob/main/packages/core/src/database.ts#L109)

***

### createGoal()

> `abstract` **createGoal**(`goal`): `Promise`\<`void`\>

#### Parameters

• **goal**: `Goal`

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/core/src/database.ts:110](https://github.com/siwanetzu/eliza/blob/main/packages/core/src/database.ts#L110)

***

### removeGoal()

> `abstract` **removeGoal**(`goalId`): `Promise`\<`void`\>

#### Parameters

• **goalId**: `string`

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/core/src/database.ts:111](https://github.com/siwanetzu/eliza/blob/main/packages/core/src/database.ts#L111)

***

### removeAllGoals()

> `abstract` **removeAllGoals**(`roomId`): `Promise`\<`void`\>

#### Parameters

• **roomId**: `string`

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/core/src/database.ts:112](https://github.com/siwanetzu/eliza/blob/main/packages/core/src/database.ts#L112)

***

### createRoom()

> `abstract` **createRoom**(`roomId`?): `Promise`\<`string`\>

#### Parameters

• **roomId?**: `string`

#### Returns

`Promise`\<`string`\>

#### Defined in

[packages/core/src/database.ts:114](https://github.com/siwanetzu/eliza/blob/main/packages/core/src/database.ts#L114)

***

### removeRoom()

> `abstract` **removeRoom**(`roomId`): `Promise`\<`void`\>

#### Parameters

• **roomId**: `string`

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/core/src/database.ts:115](https://github.com/siwanetzu/eliza/blob/main/packages/core/src/database.ts#L115)

***

### getRoom()

> `abstract` **getRoom**(`roomId`): `Promise`\<`string`\>

#### Parameters

• **roomId**: `string`

#### Returns

`Promise`\<`string`\>

#### Defined in

[packages/core/src/database.ts:116](https://github.com/siwanetzu/eliza/blob/main/packages/core/src/database.ts#L116)

***

### getRoomsForParticipant()

> `abstract` **getRoomsForParticipant**(`userId`): `Promise`\<`string`[]\>

#### Parameters

• **userId**: `string`

#### Returns

`Promise`\<`string`[]\>

#### Defined in

[packages/core/src/database.ts:117](https://github.com/siwanetzu/eliza/blob/main/packages/core/src/database.ts#L117)

***

### getRoomsForParticipants()

> `abstract` **getRoomsForParticipants**(`userIds`): `Promise`\<`string`[]\>

#### Parameters

• **userIds**: `string`[]

#### Returns

`Promise`\<`string`[]\>

#### Defined in

[packages/core/src/database.ts:118](https://github.com/siwanetzu/eliza/blob/main/packages/core/src/database.ts#L118)

***

### addParticipant()

> `abstract` **addParticipant**(`userId`, `roomId`): `Promise`\<`boolean`\>

#### Parameters

• **userId**: `string`

• **roomId**: `string`

#### Returns

`Promise`\<`boolean`\>

#### Defined in

[packages/core/src/database.ts:120](https://github.com/siwanetzu/eliza/blob/main/packages/core/src/database.ts#L120)

***

### removeParticipant()

> `abstract` **removeParticipant**(`userId`, `roomId`): `Promise`\<`boolean`\>

#### Parameters

• **userId**: `string`

• **roomId**: `string`

#### Returns

`Promise`\<`boolean`\>

#### Defined in

[packages/core/src/database.ts:121](https://github.com/siwanetzu/eliza/blob/main/packages/core/src/database.ts#L121)

***

### getParticipantsForAccount()

> `abstract` **getParticipantsForAccount**(`userId`): `Promise`\<`Participant`[]\>

#### Parameters

• **userId**: `string`

#### Returns

`Promise`\<`Participant`[]\>

#### Defined in

[packages/core/src/database.ts:122](https://github.com/siwanetzu/eliza/blob/main/packages/core/src/database.ts#L122)

***

### getParticipantsForRoom()

> `abstract` **getParticipantsForRoom**(`roomId`): `Promise`\<`string`[]\>

#### Parameters

• **roomId**: `string`

#### Returns

`Promise`\<`string`[]\>

#### Defined in

[packages/core/src/database.ts:123](https://github.com/siwanetzu/eliza/blob/main/packages/core/src/database.ts#L123)

***

### getParticipantUserState()

> `abstract` **getParticipantUserState**(`roomId`, `userId`): `Promise`\<`"FOLLOWED"` \| `"MUTED"`\>

#### Parameters

• **roomId**: `string`

• **userId**: `string`

#### Returns

`Promise`\<`"FOLLOWED"` \| `"MUTED"`\>

#### Defined in

[packages/core/src/database.ts:124](https://github.com/siwanetzu/eliza/blob/main/packages/core/src/database.ts#L124)

***

### setParticipantUserState()

> `abstract` **setParticipantUserState**(`roomId`, `userId`, `state`): `Promise`\<`void`\>

#### Parameters

• **roomId**: `string`

• **userId**: `string`

• **state**: `"FOLLOWED"` \| `"MUTED"`

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/core/src/database.ts:128](https://github.com/siwanetzu/eliza/blob/main/packages/core/src/database.ts#L128)

***

### createRelationship()

> `abstract` **createRelationship**(`params`): `Promise`\<`boolean`\>

#### Parameters

• **params**

• **params.userA**: `string`

• **params.userB**: `string`

#### Returns

`Promise`\<`boolean`\>

#### Defined in

[packages/core/src/database.ts:134](https://github.com/siwanetzu/eliza/blob/main/packages/core/src/database.ts#L134)

***

### getRelationship()

> `abstract` **getRelationship**(`params`): `Promise`\<`Relationship`\>

#### Parameters

• **params**

• **params.userA**: `string`

• **params.userB**: `string`

#### Returns

`Promise`\<`Relationship`\>

#### Defined in

[packages/core/src/database.ts:138](https://github.com/siwanetzu/eliza/blob/main/packages/core/src/database.ts#L138)

***

### getRelationships()

> `abstract` **getRelationships**(`params`): `Promise`\<`Relationship`[]\>

#### Parameters

• **params**

• **params.userId**: `string`

#### Returns

`Promise`\<`Relationship`[]\>

#### Defined in

[packages/core/src/database.ts:142](https://github.com/siwanetzu/eliza/blob/main/packages/core/src/database.ts#L142)
