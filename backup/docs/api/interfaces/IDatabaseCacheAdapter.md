[@elizaos/core v0.1.7-alpha.2](../index.md) / IDatabaseCacheAdapter

# Interface: IDatabaseCacheAdapter

## Methods

### getCache()

> **getCache**(`params`): `Promise`\<`string`\>

#### Parameters

• **params**

• **params.key**: `string`

• **params.agentId**: `string`

#### Returns

`Promise`\<`string`\>

#### Defined in

[packages/core/src/database.ts:13](https://github.com/siwanetzu/eliza/blob/main/packages/core/src/database.ts#L13)

***

### setCache()

> **setCache**(`params`): `Promise`\<`boolean`\>

#### Parameters

• **params**

• **params.key**: `string`

• **params.agentId**: `string`

• **params.value**: `string`

#### Returns

`Promise`\<`boolean`\>

#### Defined in

[packages/core/src/database.ts:17](https://github.com/siwanetzu/eliza/blob/main/packages/core/src/database.ts#L17)

***

### deleteCache()

> **deleteCache**(`params`): `Promise`\<`boolean`\>

#### Parameters

• **params**

• **params.key**: `string`

• **params.agentId**: `string`

#### Returns

`Promise`\<`boolean`\>

#### Defined in

[packages/core/src/database.ts:22](https://github.com/siwanetzu/eliza/blob/main/packages/core/src/database.ts#L22)
