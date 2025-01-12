import pThrottle from 'p-throttle';

// Create a throttled function that allows 5 requests per second
const throttle = pThrottle({
  limit: 5,
  interval: 1000
});

export const rateLimitedRequest = throttle(async (requestFn: () => Promise<any>) => {
  return requestFn();
});