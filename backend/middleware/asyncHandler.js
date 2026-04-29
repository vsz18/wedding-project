/** Wraps an async route handler and forwards thrown errors to Express error middleware. */
export const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)
