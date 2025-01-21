import { Log } from '../helpers/logger';
import { Redis } from '../helpers/redis';
import { ChatSocketUtils } from './chatSocketUtils';
import { ChatSocketEvent } from './chatSocketEvent';
import { MemCache } from '../helpers/memCache';

export class ChatSocket {
  private logger = Log.getLogger();
  private chatSocketUtils = new ChatSocketUtils();
  private redis = new Redis().client;
  public init(io, app) {
    io.use(async (socket, next) => {
      const params = socket.handshake.query;
      let token;
      if (params.authorization) {
        token = params.authorization;

        const userData = await this.chatSocketUtils.getUserData(token);
        if (userData) {
          socket.user = userData;
          next();
        } else {
          this.logger.debug('You are unauthorized');
        }
      } else {
        this.logger.debug('You are unauthorized');
      }
    }).on('connection', (socket) => {
      try {
        app.set('socketIo', socket);
        socket.join(socket.id);
        
        MemCache.hset(process.env.CHAT_SOCKET, socket.user._id, socket.id)
        
        // this.redis.hset(process.env.CHAT_SOCKET, socket.user.email, socket.id);
        const chatSocketEvent = new ChatSocketEvent();
        chatSocketEvent.init(socket, io);
        this.logger.debug(`User: ${socket.user.id} Connected`);
      } catch (err) {
        this.logger.error(err);
      }
    });
  }
}
