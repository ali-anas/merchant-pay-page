const Fastify = require("fastify");
const path = require("path");
const fs = require('fs');

const fastify = Fastify({
    logger: true,
});

fastify.get('/healthcheck', async (request, reply) => {
  reply.status(200).send({ status: 'success' });
})

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

fastify.get("/status-screen", async (request, reply) => {
  const statusPageFile = path.join(__dirname, "./html/status.html");
  try {
    const statusPageHtmlContent = fs.readFileSync(statusPageFile, 'utf-8');
    return reply.type('text/html').send(statusPageHtmlContent);
    } catch (error) {
      console.error(error);
      return reply.status(500).send('Error reading the HTML status file.');
    }
})

fastify.get("/js/status.js", async (request, reply) => {
  const statusPageFile = path.join(__dirname, "./js/status.js");
  try {
    const statusPageScript = fs.readFileSync(statusPageFile, 'utf-8');
    return reply.header('Content-Type', 'application/javascript').send(statusPageScript);
    } catch (error) {
      console.error(error);
      return reply.status(500).send('Error reading the status js file.');
    }
})

fastify.get('/example-2', async (request, reply) => {
  const filePath = path.join(__dirname, './example-2/index.html');
  try {
      const htmlContent = fs.readFileSync(filePath, 'utf-8');
      return reply.type('text/html').send(htmlContent);
    } catch (error) {
      console.error(error);
      return reply.status(500).send('Error reading the HTML file.');
    }
});

fastify.get('/card-example', async (request, reply) => {
  const filePath = path.join(__dirname, './card-example/index.html');
  try {
      const htmlContent = fs.readFileSync(filePath, 'utf-8');
      return reply.type('text/html').send(htmlContent);
    } catch (error) {
      console.error(error);
      return reply.status(500).send('Error reading the HTML file.');
    }
});

fastify.get('/js/payWidget.js', async (request, reply) => {
  const filePath = path.join(__dirname, './js/payWidget.js');
  try {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      return reply.header('Content-Type', 'application/javascript').send(fileContent);
    } catch (error) {
      console.error(error);
      return reply.status(500).send('Error reading the HTML file.');
    }
});

// /js/razorpayWidget.js
fastify.get('/js/example-2.js', async (request, reply) => {
  const filePath = path.join(__dirname, './js/example-2.js');
  try {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      return reply.header('Content-Type', 'application/javascript').send(fileContent);
    } catch (error) {
      console.error(error);
      return reply.status(500).send('Error reading the HTML file.');
    }
});

fastify.get('/js/cardExample.js', async (request, reply) => {
  const filePath = path.join(__dirname, './js/cardExample.js');
  try {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      return reply.header('Content-Type', 'application/javascript').send(fileContent);
    } catch (error) {
      console.error(error);
      return reply.status(500).send('Error reading the HTML file.');
    }
});

fastify.get('/js/apiHelpers', async (request, reply) => {
  const filePath = path.join(__dirname, './js/apiHelpers.js');
  try {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      return reply.header('Content-Type', 'application/javascript').send(fileContent);
    } catch (error) {
      console.error(error);
      return reply.status(500).send('Error reading the apiHelpers.js file.');
    }
});

fastify.listen({ port: 3000 }, (err, address) => {
  if (err) {
    console.log(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
