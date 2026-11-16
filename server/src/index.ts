import { buildApp } from './app.js';
import { env } from './config/env.js';

async function start() {
  const app = await buildApp();
  
  try {
    await app.listen({ port: env.PORT, host: env.HOST });
    console.log(`================================================================`);
    console.log(` ServicePro OS — Fastify Enterprise API Server running!        `);
    console.log(` Listening on: http://${env.HOST}:${env.PORT}                   `);
    console.log(` OpenAPI 3.1 Swagger Docs: http://${env.HOST}:${env.PORT}/docs   `);
    console.log(` Health Check: http://${env.HOST}:${env.PORT}/health             `);
    console.log(`================================================================`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

start();
