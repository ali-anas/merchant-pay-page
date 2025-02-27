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

fastify.get('/razorpay-example', async (request, reply) => {
  const filePath = path.join(__dirname, './razorpay.html');
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
fastify.get('/js/razorpayWidget.js', async (request, reply) => {
  const filePath = path.join(__dirname, './js/razorpayWidget.js');
  try {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      return reply.header('Content-Type', 'application/javascript').send(fileContent);
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
