export const tweetTemplate = `
# Context
{{recentMessages}}

# Topics
{{topics}}

# Post Directions
{{postDirections}}

# Recent interactions between {{agentName}} and other users:
{{recentPostInteractions}}

# Task
Generate a tweet that:
1. Relates to the recent conversation or requested topic
2. Matches the character's style and voice
3. Is concise and engaging
4. Must be UNDER 280 characters (this is a strict requirement)
5. Speaks from the perspective of {{agentName}}
6. Do not include any meta information like character counts in the tweet itself

Generate only the tweet text, no other commentary.`;
