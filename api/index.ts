import app from "../server";

// Vercel serverless handler
export default app;

// Also support ESM export for Vercel
export const handler = app;
