import { FastifyRequest, FastifyReply } from 'fastify';
import { AuthService } from '../modules/auth/auth.service.js';
import { errorResponse } from '../types/envelope.js';

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  const requestId = request.id || `req_${Date.now()}`;
  const authHeader = request.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return reply.status(401).send(
      errorResponse('UNAUTHORIZED', 'Bearer authentication token is required.', requestId)
    );
  }

  const token = authHeader.substring(7).trim();

  try {
    const payload = AuthService.verifyAccessToken(token);
    request.user = {
      id: payload.sub,
      role: payload.role,
      tenantId: payload.tenantId,
      email: payload.email,
    };

    // Strict Cross-Tenant Guard: Enforce token tenant matches request tenant
    if (request.tenantId && request.user.tenantId !== request.tenantId) {
      return reply.status(403).send(
        errorResponse('CROSS_TENANT_FORBIDDEN', 'Access token belongs to another organization.', requestId)
      );
    }
  } catch (err: any) {
    return reply.status(401).send(
      errorResponse('TOKEN_EXPIRED_OR_INVALID', 'The provided access token is expired or invalid.', requestId)
    );
  }
}

export function requirePermission(permissionId: string) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    // 1. Ensure user is authenticated first
    await authenticate(request, reply);
    if (reply.sent) return;

    const requestId = request.id || `req_${Date.now()}`;
    const userRole = request.user?.role;

    if (!userRole) {
      return reply.status(401).send(
        errorResponse('UNAUTHORIZED', 'Authentication credentials required.', requestId)
      );
    }

    // 2. Administrators have root access
    if (userRole === 'ADMIN') {
      return;
    }

    // 3. Query role permissions
    const permissions = await AuthService.getUserPermissions(userRole);

    if (!permissions.includes(permissionId)) {
      return reply.status(403).send(
        errorResponse(
          'FORBIDDEN',
          `Your role (${userRole}) lacks the required '${permissionId}' permission.`,
          requestId
        )
      );
    }
  };
}
