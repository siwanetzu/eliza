[@elizaos/core v0.1.7-alpha.2](../index.md) / AgentRuntime

# Class: AgentRuntime

Represents the runtime environment for an agent, handling message processing,
action registration, and interaction with external services like OpenAI and Supabase.

## Implements

- `IAgentRuntime`

## Constructors

### new AgentRuntime()

> **new AgentRuntime**(`opts`): [`AgentRuntime`](AgentRuntime.md)

Creates an instance of AgentRuntime.

#### Parameters

• **opts**

The options for configuring the AgentRuntime.

• **opts.conversationLength?**: `number`

The number of messages to hold in the recent message cache.

• **opts.agentId?**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

Optional ID of the agent.

• **opts.character?**: `Character`

• **opts.token**: `string`

The JWT token, can be a JWT token if outside worker, or an OpenAI token if inside worker.

• **opts.serverUrl?**: `string`

The URL of the worker.

• **opts.actions?**: `Action`[]

Optional custom actions.

• **opts.evaluators?**: `Evaluator`[]

Optional custom evaluators.

• **opts.plugins?**: `Plugin`[]

• **opts.providers?**: `Provider`[]

Optional context providers.

• **opts.modelProvider**: `ModelProviderName`

• **opts.services?**: `Service`[]

Optional custom services.

• **opts.managers?**: `IMemoryManager`[]

• **opts.databaseAdapter**: `IDatabaseAdapter`

The database adapter used for interacting with the database.

• **opts.fetch?**: `unknown`

Custom fetch function to use for making requests.

• **opts.speechModelPath?**: `string`

• **opts.cacheManager**: `ICacheManager`

• **opts.logging?**: `boolean`

#### Returns

[`AgentRuntime`](AgentRuntime.md)

#### Defined in

[packages/core/src/runtime.ts:209](https://github.com/siwanetzu/eliza/blob/main/packages/core/src/runtime.ts#L209)

## Properties

### agentId

> **agentId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

The ID of the agent

#### Implementation of

`IAgentRuntime.agentId`

#### Defined in

[packages/core/src/runtime.ts:63](https://github.com/siwanetzu/eliza/blob/main/packages/core/src/runtime.ts#L63)

***

### serverUrl

> **serverUrl**: `string` = `"http://localhost:7998"`

The base URL of the server where the agent's requests are processed.

#### Implementation of

`IAgentRuntime.serverUrl`

#### Defined in

[packages/core/src/runtime.ts:67](https://github.com/siwanetzu/eliza/blob/main/packages/core/src/runtime.ts#L67)

***

### databaseAdapter

> **databaseAdapter**: `IDatabaseAdapter`

The database adapter used for interacting with the database.

#### Implementation of

`IAgentRuntime.databaseAdapter`

#### Defined in

[packages/core/src/runtime.ts:72](https://github.com/siwanetzu/eliza/blob/main/packages/core/src/runtime.ts#L72)

***

### token

> **token**: `string`

Authentication token used for securing requests.

#### Implementation of

`IAgentRuntime.token`

#### Defined in

[packages/core/src/runtime.ts:77](https://github.com/siwanetzu/eliza/blob/main/packages/core/src/runtime.ts#L77)

***

### actions

> **actions**: `Action`[] = `[]`

Custom actions that the agent can perform.

#### Implementation of

`IAgentRuntime.actions`

#### Defined in

[packages/core/src/runtime.ts:82](https://github.com/siwanetzu/eliza/blob/main/packages/core/src/runtime.ts#L82)

***

### evaluators

> **evaluators**: `Evaluator`[] = `[]`

Evaluators used to assess and guide the agent's responses.

#### Implementation of

`IAgentRuntime.evaluators`

#### Defined in

[packages/core/src/runtime.ts:87](https://github.com/siwanetzu/eliza/blob/main/packages/core/src/runtime.ts#L87)

***

### providers

> **providers**: `Provider`[] = `[]`

Context providers used to provide context for message generation.

#### Implementation of

`IAgentRuntime.providers`

#### Defined in

[packages/core/src/runtime.ts:92](https://github.com/siwanetzu/eliza/blob/main/packages/core/src/runtime.ts#L92)

***

### plugins

> **plugins**: `Plugin`[] = `[]`

#### Implementation of

`IAgentRuntime.plugins`

#### Defined in

[packages/core/src/runtime.ts:94](https://github.com/siwanetzu/eliza/blob/main/packages/core/src/runtime.ts#L94)

***

### modelProvider

> **modelProvider**: `ModelProviderName`

The model to use for generateText.

#### Implementation of

`IAgentRuntime.modelProvider`

#### Defined in

[packages/core/src/runtime.ts:99](https://github.com/siwanetzu/eliza/blob/main/packages/core/src/runtime.ts#L99)

***

### imageModelProvider

> **imageModelProvider**: `ModelProviderName`

The model to use for generateImage.

#### Implementation of

`IAgentRuntime.imageModelProvider`

#### Defined in

[packages/core/src/runtime.ts:104](https://github.com/siwanetzu/eliza/blob/main/packages/core/src/runtime.ts#L104)

***

### fetch()

> **fetch**: (`input`, `init`?) => `Promise`\<`Response`\>(`input`, `init`?) => `Promise`\<`Response`\>

Fetch function to use
Some environments may not have access to the global fetch function and need a custom fetch override.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/fetch)

#### Parameters

• **input**: `RequestInfo` \| `URL`

• **init?**: `RequestInit`

#### Returns

`Promise`\<`Response`\>

#### Parameters

• **input**: `string` \| `Request` \| `URL`

• **init?**: `RequestInit`

#### Returns

`Promise`\<`Response`\>

#### Implementation of

`IAgentRuntime.fetch`

#### Defined in

[packages/core/src/runtime.ts:110](https://github.com/siwanetzu/eliza/blob/main/packages/core/src/runtime.ts#L110)

***

### character

> **character**: `Character`

The character to use for the agent

#### Implementation of

`IAgentRuntime.character`

#### Defined in

[packages/core/src/runtime.ts:115](https://github.com/siwanetzu/eliza/blob/main/packages/core/src/runtime.ts#L115)

***

### messageManager

> **messageManager**: `IMemoryManager`

Store messages that are sent and received by the agent.

#### Implementation of

`IAgentRuntime.messageManager`

#### Defined in

[packages/core/src/runtime.ts:120](https://github.com/siwanetzu/eliza/blob/main/packages/core/src/runtime.ts#L120)

***

### descriptionManager

> **descriptionManager**: `IMemoryManager`

Store and recall descriptions of users based on conversations.

#### Implementation of

`IAgentRuntime.descriptionManager`

#### Defined in

[packages/core/src/runtime.ts:125](https://github.com/siwanetzu/eliza/blob/main/packages/core/src/runtime.ts#L125)

***

### loreManager

> **loreManager**: `IMemoryManager`

Manage the creation and recall of static information (documents, historical game lore, etc)

#### Implementation of

`IAgentRuntime.loreManager`

#### Defined in

[packages/core/src/runtime.ts:130](https://github.com/siwanetzu/eliza/blob/main/packages/core/src/runtime.ts#L130)

***

### documentsManager

> **documentsManager**: `IMemoryManager`

Hold large documents that can be referenced

#### Implementation of

`IAgentRuntime.documentsManager`

#### Defined in

[packages/core/src/runtime.ts:135](https://github.com/siwanetzu/eliza/blob/main/packages/core/src/runtime.ts#L135)

***

### knowledgeManager

> **knowledgeManager**: `IMemoryManager`

Searchable document fragments

#### Implementation of

`IAgentRuntime.knowledgeManager`

#### Defined in

[packages/core/src/runtime.ts:140](https://github.com/siwanetzu/eliza/blob/main/packages/core/src/runtime.ts#L140)

***

### services

> **services**: `Map`\<`ServiceType`, `Service`\>

#### Implementation of

`IAgentRuntime.services`

#### Defined in

[packages/core/src/runtime.ts:142](https://github.com/siwanetzu/eliza/blob/main/packages/core/src/runtime.ts#L142)

***

### memoryManagers

> **memoryManagers**: `Map`\<`string`, `IMemoryManager`\>

#### Defined in

[packages/core/src/runtime.ts:143](https://github.com/siwanetzu/eliza/blob/main/packages/core/src/runtime.ts#L143)

***

### cacheManager

> **cacheManager**: `ICacheManager`

#### Implementation of

`IAgentRuntime.cacheManager`

#### Defined in

[packages/core/src/runtime.ts:144](https://github.com/siwanetzu/eliza/blob/main/packages/core/src/runtime.ts#L144)

***

### clients

> **clients**: `Record`\<`string`, `any`\>

any could be EventEmitter
but I think the real solution is forthcoming as a base client interface

#### Implementation of

`IAgentRuntime.clients`

#### Defined in

[packages/core/src/runtime.ts:145](https://github.com/siwanetzu/eliza/blob/main/packages/core/src/runtime.ts#L145)

## Methods

### registerMemoryManager()

> **registerMemoryManager**(`manager`): `void`

#### Parameters

• **manager**: `IMemoryManager`

#### Returns

`void`

#### Implementation of

`IAgentRuntime.registerMemoryManager`

#### Defined in

[packages/core/src/runtime.ts:147](https://github.com/siwanetzu/eliza/blob/main/packages/core/src/runtime.ts#L147)

***

### getMemoryManager()

> **getMemoryManager**(`tableName`): `IMemoryManager`

#### Parameters

• **tableName**: `string`

#### Returns

`IMemoryManager`

#### Implementation of

`IAgentRuntime.getMemoryManager`

#### Defined in

[packages/core/src/runtime.ts:162](https://github.com/siwanetzu/eliza/blob/main/packages/core/src/runtime.ts#L162)

***

### getService()

> **getService**\<`T`\>(`service`): `T`

#### Type Parameters

• **T** *extends* `Service`

#### Parameters

• **service**: `ServiceType`

#### Returns

`T`

#### Implementation of

`IAgentRuntime.getService`

#### Defined in

[packages/core/src/runtime.ts:166](https://github.com/siwanetzu/eliza/blob/main/packages/core/src/runtime.ts#L166)

***

### registerService()

> **registerService**(`service`): `Promise`\<`void`\>

#### Parameters

• **service**: `Service`

#### Returns

`Promise`\<`void`\>

#### Implementation of

`IAgentRuntime.registerService`

#### Defined in

[packages/core/src/runtime.ts:175](https://github.com/siwanetzu/eliza/blob/main/packages/core/src/runtime.ts#L175)

***

### initialize()

> **initialize**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Implementation of

`IAgentRuntime.initialize`

#### Defined in

[packages/core/src/runtime.ts:379](https://github.com/siwanetzu/eliza/blob/main/packages/core/src/runtime.ts#L379)

***

### stop()

> **stop**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/core/src/runtime.ts:412](https://github.com/siwanetzu/eliza/blob/main/packages/core/src/runtime.ts#L412)

***

### getSetting()

> **getSetting**(`key`): `any`

#### Parameters

• **key**: `string`

#### Returns

`any`

#### Implementation of

`IAgentRuntime.getSetting`

#### Defined in

[packages/core/src/runtime.ts:462](https://github.com/siwanetzu/eliza/blob/main/packages/core/src/runtime.ts#L462)

***

### getConversationLength()

> **getConversationLength**(): `number`

Get the number of messages that are kept in the conversation buffer.

#### Returns

`number`

The number of recent messages to be kept in memory.

#### Implementation of

`IAgentRuntime.getConversationLength`

#### Defined in

[packages/core/src/runtime.ts:484](https://github.com/siwanetzu/eliza/blob/main/packages/core/src/runtime.ts#L484)

***

### registerAction()

> **registerAction**(`action`): `void`

Register an action for the agent to perform.

#### Parameters

• **action**: `Action`

The action to register.

#### Returns

`void`

#### Implementation of

`IAgentRuntime.registerAction`

#### Defined in

[packages/core/src/runtime.ts:492](https://github.com/siwanetzu/eliza/blob/main/packages/core/src/runtime.ts#L492)

***

### registerEvaluator()

> **registerEvaluator**(`evaluator`): `void`

Register an evaluator to assess and guide the agent's responses.

#### Parameters

• **evaluator**: `Evaluator`

The evaluator to register.

#### Returns

`void`

#### Defined in

[packages/core/src/runtime.ts:501](https://github.com/siwanetzu/eliza/blob/main/packages/core/src/runtime.ts#L501)

***

### registerContextProvider()

> **registerContextProvider**(`provider`): `void`

Register a context provider to provide context for message generation.

#### Parameters

• **provider**: `Provider`

The context provider to register.

#### Returns

`void`

#### Defined in

[packages/core/src/runtime.ts:509](https://github.com/siwanetzu/eliza/blob/main/packages/core/src/runtime.ts#L509)

***

### processActions()

> **processActions**(`message`, `responses`, `state`?, `callback`?): `Promise`\<`void`\>

Process the actions of a message.

#### Parameters

• **message**: `Memory`

The message to process.

• **responses**: `Memory`[]

• **state?**: `State`

• **callback?**: `HandlerCallback`

#### Returns

`Promise`\<`void`\>

#### Implementation of

`IAgentRuntime.processActions`

#### Defined in

[packages/core/src/runtime.ts:518](https://github.com/siwanetzu/eliza/blob/main/packages/core/src/runtime.ts#L518)

***

### evaluate()

> **evaluate**(`message`, `state`?, `didRespond`?, `callback`?): `Promise`\<`string`[]\>

Evaluate the message and state using the registered evaluators.

#### Parameters

• **message**: `Memory`

The message to evaluate.

• **state?**: `State`

The state of the agent.

• **didRespond?**: `boolean`

Whether the agent responded to the message.~

• **callback?**: `HandlerCallback`

The handler callback

#### Returns

`Promise`\<`string`[]\>

The results of the evaluation.

#### Implementation of

`IAgentRuntime.evaluate`

#### Defined in

[packages/core/src/runtime.ts:602](https://github.com/siwanetzu/eliza/blob/main/packages/core/src/runtime.ts#L602)

***

### ensureParticipantExists()

> **ensureParticipantExists**(`userId`, `roomId`): `Promise`\<`void`\>

Ensure the existence of a participant in the room. If the participant does not exist, they are added to the room.

#### Parameters

• **userId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

The user ID to ensure the existence of.

• **roomId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

#### Returns

`Promise`\<`void`\>

#### Throws

An error if the participant cannot be added.

#### Implementation of

`IAgentRuntime.ensureParticipantExists`

#### Defined in

[packages/core/src/runtime.ts:669](https://github.com/siwanetzu/eliza/blob/main/packages/core/src/runtime.ts#L669)

***

### ensureUserExists()

> **ensureUserExists**(`userId`, `userName`, `name`, `email`?, `source`?): `Promise`\<`void`\>

Ensure the existence of a user in the database. If the user does not exist, they are added to the database.

#### Parameters

• **userId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

The user ID to ensure the existence of.

• **userName**: `string`

The user name to ensure the existence of.

• **name**: `string`

• **email?**: `string`

• **source?**: `string`

#### Returns

`Promise`\<`void`\>

#### Implementation of

`IAgentRuntime.ensureUserExists`

#### Defined in

[packages/core/src/runtime.ts:685](https://github.com/siwanetzu/eliza/blob/main/packages/core/src/runtime.ts#L685)

***

### ensureParticipantInRoom()

> **ensureParticipantInRoom**(`userId`, `roomId`): `Promise`\<`void`\>

#### Parameters

• **userId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

• **roomId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

#### Returns

`Promise`\<`void`\>

#### Implementation of

`IAgentRuntime.ensureParticipantInRoom`

#### Defined in

[packages/core/src/runtime.ts:705](https://github.com/siwanetzu/eliza/blob/main/packages/core/src/runtime.ts#L705)

***

### ensureConnection()

> **ensureConnection**(`userId`, `roomId`, `userName`?, `userScreenName`?, `source`?): `Promise`\<`void`\>

#### Parameters

• **userId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

• **roomId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

• **userName?**: `string`

• **userScreenName?**: `string`

• **source?**: `string`

#### Returns

`Promise`\<`void`\>

#### Implementation of

`IAgentRuntime.ensureConnection`

#### Defined in

[packages/core/src/runtime.ts:722](https://github.com/siwanetzu/eliza/blob/main/packages/core/src/runtime.ts#L722)

***

### ensureRoomExists()

> **ensureRoomExists**(`roomId`): `Promise`\<`void`\>

Ensure the existence of a room between the agent and a user. If no room exists, a new room is created and the user
and agent are added as participants. The room ID is returned.

#### Parameters

• **roomId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

#### Returns

`Promise`\<`void`\>

The room ID of the room between the agent and the user.

#### Throws

An error if the room cannot be created.

#### Implementation of

`IAgentRuntime.ensureRoomExists`

#### Defined in

[packages/core/src/runtime.ts:758](https://github.com/siwanetzu/eliza/blob/main/packages/core/src/runtime.ts#L758)

***

### composeState()

> **composeState**(`message`, `additionalKeys`): `Promise`\<`State`\>

Compose the state of the agent into an object that can be passed or used for response generation.

#### Parameters

• **message**: `Memory`

The message to compose the state from.

• **additionalKeys** = `{}`

#### Returns

`Promise`\<`State`\>

The state of the agent.

#### Implementation of

`IAgentRuntime.composeState`

#### Defined in

[packages/core/src/runtime.ts:771](https://github.com/siwanetzu/eliza/blob/main/packages/core/src/runtime.ts#L771)

***

### updateRecentMessageState()

> **updateRecentMessageState**(`state`): `Promise`\<`State`\>

#### Parameters

• **state**: `State`

#### Returns

`Promise`\<`State`\>

#### Implementation of

`IAgentRuntime.updateRecentMessageState`

#### Defined in

[packages/core/src/runtime.ts:1217](https://github.com/siwanetzu/eliza/blob/main/packages/core/src/runtime.ts#L1217)
