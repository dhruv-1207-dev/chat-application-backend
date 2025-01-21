import { Log } from '../helpers/logger';
import { ChatSocketUtils } from './chatSocketUtils';
import { Validator } from './chatSocketValidators';
import { validate } from 'class-validator';
import { Redis } from '../helpers/redis';
import { plainToClass } from 'class-transformer';
import { SocketEvents } from '../config/socketEvents';
import { MemCache } from '../helpers/memCache';

export class ChatSocketEvent {
  private logger = Log.getLogger();
  private validatorMapping = new Validator.ValidatorMapping();
  private redis = new Redis().client;
  private socket;
  private io;

  public init(socket, io) {
    this.socket = socket;
    this.io = io;
    this.mwValidator();
    this.listenToEvents();
  }

  private mwValidator() {
    this.socket.use(async (packet, next) => {
      const [socketEvent, socketBody] = packet;
      if (socketEvent) {
        const validatorClass: any = this.validatorMapping.mapping(socketEvent);
        if (validatorClass) {
          const errors = await validate(
            plainToClass(validatorClass, socketBody)
          );
          if (errors && errors.length > 0) {
            const [error] = errors;
            const errMsg =
              error.constraints[`${Object.keys(errors[0].constraints)[0]}`];
            this.socket.emit(SocketEvents.ERROR_SOCKET_MESSAGE, {
              socketEvent,
              statusCode: 400,
              error: errMsg,
            });
          } else {
            next();
          }
        } else {
          this.socket.emit(SocketEvents.ERROR_SOCKET_MESSAGE, {
            socketEvent,
            statusCode: 400,
            error: 'Event not found',
          });
        }
      }
    });
  }

  private async listenToEvents() {
    this.sendNewMessageToUser();
  }

  private async sendNewMessageToUser() {
    try {
      this.socket.on(
        SocketEvents.EMIT_NEW_USER_MESSAGE,
        async (req: Validator.SendNewMessageToUser) => {
          const recSocket = await MemCache.hget(
            process.env.CHAT_SOCKET,
            `${req.userId}`
          );
          if (recSocket) {
            const chatRecordObject = {
              message: req.message,
              senderId: this.socket.user.id,
              receiverId: req.userId,
              name: req.name,
            };
            this.socket
              .to(recSocket)
              .emit(SocketEvents.EMIT_RECEIVE_USER_MESSAGE, chatRecordObject);
          }
        }
      );
    } catch (err) {
      console.log(err);
    }
  }
}
