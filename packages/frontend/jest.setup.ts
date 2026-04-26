import "@testing-library/jest-dom";

process.env.VITE_API_BASE_URL ??= "http://127.0.0.1:9";

// Polyfill TextEncoder and TextDecoder
import { TextEncoder, TextDecoder } from "util";

// Assign them to the global scope for JSDOM
global.TextEncoder = TextEncoder;
// You might need a type assertion for TextDecoder depending on your @types/node version
global.TextDecoder = TextDecoder as typeof global.TextDecoder;
