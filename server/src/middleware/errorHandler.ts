import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { ZodError } from 'zod';
import { errorResponse } from '../types/envelope.js';

export function errorHandler(error: FastifyError, request: FastifyRequest, reply: FastifyReply) {
  const requestId = request.id || `req_${Date.now()}`;

  // 1. Zod Validation Errors
  if (error instanceof ZodError) {
    const details = error.issues.map(issue => ({
      field: issue.path.join('.'),
      issue: issue.message
    }));
    return reply.status(400).send(
      errorResponse('VALIDATION_ERROR', 'The request payload failed validation checks.', requestId, details)
    );
  }

  // 2. Fastify Schema Validation Errors
  if (error.validation) {
    const details = error.validation.map(v => ({
      field: v.instancePath || v.params?.missingProperty as string || 'field',
      issue: v.message || 'Invalid value'
    }));
    return reply.status(400).send(
      errorResponse('SCHEMA_VALIDATION_ERROR', error.message, requestId, details)
    );
  }

  // 3. Fastify HTTP Errors (e.g. 401, 403, 404, 429)
  const statusCode = error.statusCode || 500;
  
  if (statusCode === 429) {
    return reply.status(429).send(
      errorResponse('RATE_LIMIT_EXCEEDED', 'Too many requests. Please try again later.', requestId)
    );
  }

  if (statusCode === 401) {
    return reply.status(401).send(
      errorResponse('UNAUTHORIZED', error.message || 'Authentication credentials required.', requestId)
    );
  }

  if (statusCode === 403) {
    return reply.status(403).send(
      errorResponse('FORBIDDEN', error.message || 'Access denied for this resource.', requestId)
    );
  }

  if (statusCode === 404) {
    return reply.status(404).send(
      errorResponse('NOT_FOUND', error.message || 'Resource not found.', requestId)
    );
  }

  // 4. Uncaught Internal Server Errors
  request.log.error(error);
  return reply.status(500).send(
    errorResponse(
      'INTERNAL_SERVER_ERROR',
      process.env.NODE_ENV === 'production' ? 'An unexpected error occurred.' : error.message,
      requestId
    )
  );
}
