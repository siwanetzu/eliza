import { vi } from 'vitest';
import axios from 'axios';

// Mock the rate limiter
vi.mock('../utils/rateLimiter', () => ({
  rateLimitedRequest: vi.fn((fn) => fn())
}));

// Mock axios
vi.mock('axios');

// Export mocked axios instance
export const mockedAxios = {
  get: vi.fn(),
  post: vi.fn()
};

// Reset all mocks before each test
beforeEach(() => {
  vi.clearAllMocks();

  // Set up default axios mock implementation
  mockedAxios.get.mockImplementation(() => Promise.resolve({ data: {} }));
  mockedAxios.post.mockImplementation(() => Promise.resolve({ data: {} }));
});