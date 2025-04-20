import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';
import { fetch, Request, Response } from 'cross-fetch';

global.fetch = fetch;
global.Request = Request;
global.Response = Response;
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock the console.error to avoid noisy error logs during tests
global.console.error = jest.fn(); 