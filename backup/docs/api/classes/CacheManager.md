[@elizaos/core v0.1.7-alpha.2](../index.md) / CacheManager

# Class: CacheManager\<CacheAdapter\>

## Type Parameters

• **CacheAdapter** *extends* [`ICacheAdapter`](../interfaces/ICacheAdapter.md) = [`ICacheAdapter`](../interfaces/ICacheAdapter.md)

## Implements

- `ICacheManager`

## Constructors

### new CacheManager()

> **new CacheManager**\<`CacheAdapter`\>(`adapter`): [`CacheManager`](CacheManager.md)\<`CacheAdapter`\>

#### Parameters

• **adapter**: `CacheAdapter`

#### Returns

[`CacheManager`](CacheManager.md)\<`CacheAdapter`\>

#### Defined in

[packages/core/src/cache.ts:93](https://github.com/siwanetzu/eliza/blob/main/packages/core/src/cache.ts#L93)

## Properties

### adapter

> **adapter**: `CacheAdapter`

#### Defined in

[packages/core/src/cache.ts:91](https://github.com/siwanetzu/eliza/blob/main/packages/core/src/cache.ts#L91)

## Methods

### get()

> **get**\<`T`\>(`key`): `Promise`\<`T`\>

#### Type Parameters

• **T** = `unknown`

#### Parameters

• **key**: `string`

#### Returns

`Promise`\<`T`\>

#### Implementation of

`ICacheManager.get`

#### Defined in

[packages/core/src/cache.ts:97](https://github.com/siwanetzu/eliza/blob/main/packages/core/src/cache.ts#L97)

***

### set()

> **set**\<`T`\>(`key`, `value`, `opts`?): `Promise`\<`void`\>

#### Type Parameters

• **T**

#### Parameters

• **key**: `string`

• **value**: `T`

• **opts?**: `CacheOptions`

#### Returns

`Promise`\<`void`\>

#### Implementation of

`ICacheManager.set`

#### Defined in

[packages/core/src/cache.ts:116](https://github.com/siwanetzu/eliza/blob/main/packages/core/src/cache.ts#L116)

***

### delete()

> **delete**(`key`): `Promise`\<`void`\>

#### Parameters

• **key**: `string`

#### Returns

`Promise`\<`void`\>

#### Implementation of

`ICacheManager.delete`

#### Defined in

[packages/core/src/cache.ts:123](https://github.com/siwanetzu/eliza/blob/main/packages/core/src/cache.ts#L123)
