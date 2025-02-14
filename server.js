// src/server.ts
// import Fastify from 'fastify';
// import fs from 'fs';
// import path from 'path';
const Fastify = require("fastify");
const path = require("path");
const fs = require('fs');
const fastifyStatic = require("@fastify/static");

const fastify = Fastify({
    logger: true,
});

fastify.register(fastifyStatic, {
  root: path.join(__dirname, '../public'),
  prefix: '/public/',
});

fastify.get('/', async (request, reply) => {
    const filePath = path.join(__dirname, './index.html');
    try {
        const htmlContent = fs.readFileSync(filePath, 'utf-8');
        return reply.type('text/html').send(htmlContent);
      } catch (error) {
        console.error(error);
        return reply.status(500).send('Error reading the HTML file.');
      }
});

fastify.listen({ port: 3000 }, (err, address) => {
  if (err) {
    console.log(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
