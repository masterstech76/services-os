/**
 * Authentication Lock Configuration
 *
 * When AUTH_LOCK_PAUSED is set to true, authentication route guards and login redirects
 * are temporarily paused strictly in local development/preview so all 85+ pages can be inspected freely
 * in the browser without encountering login gates or redirect walls.
 *
 * It is hardcoded to false in production builds (cannot be enabled in production).
 */
const DEV_PREVIEW_AUTH_PAUSED = false;
export const AUTH_LOCK_PAUSED = process.env.NODE_ENV !== "production" && DEV_PREVIEW_AUTH_PAUSED;
