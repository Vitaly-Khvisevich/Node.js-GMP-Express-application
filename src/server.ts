import express, { Response } from 'express';
import { Socket } from 'net';
import cartsRouter from './controllers/carts.controller';
import productsRouter from './controllers/products.controller';
import userRouter from './controllers/users.controller';
import { myDataSource } from './data-source';
import { createEmptyError } from './utils/helper.util';
import { verifyToken, authenticate, logging } from './middlewares/middlewares';
import 'dotenv/config';
import { logger } from './logger';

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use('/api/profile/cart', verifyToken, authenticate, logging, cartsRouter);
app.use('/api/products', verifyToken, authenticate, logging, productsRouter);
app.use('/api/auth', logging, userRouter);
app.get('/health', async (req, res) => {
  try {
    // Simple query to check the connection
    const response = await myDataSource.query('SELECT NOW()');
    const currentTime = response[0].now;
    if (currentTime) {
      createEmptyError(res, 200, 'Application and database are healthy');
    }
  } catch (error) {
    createEmptyError(res, 500, 'Application and database are not healthy');
  }
});

app.use((_req, res: Response) => {
  createEmptyError(res, 500, 'Internal Server error');
});

myDataSource.initialize()
  .then(async () => {
    const server = app.listen(PORT, () => {
      logger.info(`Server running at http://localhost:${PORT}`);
    });

    let connections = [] as Socket[];

    server.on('connection', (connection) => {
      connections.push(connection);

      connection.on('close', () => {
        connections = connections.filter((currentConnection) => currentConnection !== connection);
      });
    });
    function shutdown() {
      logger.info('Received kill signal, shutting down gracefully');

      server.close(() => {
        logger.info('Closed out remaining connections');
        process.exit(0);
      });

      setTimeout(() => {
        logger.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
      }, 20000);

      // end current connections
      connections.forEach((connection) => connection.end());

      // then destroy connections
      setTimeout(() => {
        connections.forEach((connection) => connection.destroy());
      }, 10000);
    }

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  }).catch((error: Error) => {
    logger.error(`Error connecting to DB: ${error}`);
  });
