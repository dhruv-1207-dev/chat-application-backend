import * as bodyParser from 'body-parser'; // pull information from HTML POST (express4)
import * as dotenv from 'dotenv';
import * as express from 'express';
import * as cors from 'cors';
// tslint:disable-next-line: no-var-requires
require('express-async-errors');
import * as helmet from 'helmet'; // Security
import * as morgan from 'morgan'; // log requests to the console (express4)
import { Log } from './helpers/logger';
import { Routes } from './routes';
// import { DB } from "./database";
import * as busboy from 'connect-busboy';
import connectDB from './database';
import * as fileUpload from 'express-fileupload';
import * as path from 'path';
import * as SocketIO from "socket.io";
import { ChatSocket } from './socket/chatSocket';

dotenv.config();

// initialize database
connectDB();

export class App {
  protected app: express.Application;
  private logger = Log.getLogger();
  private chatSocket = new ChatSocket();
  constructor() {
    const NODE_ENV = process.env.NODE_ENV;
    const PORT = process.env.PORT as string;

    this.app = express();
    this.app.use(helmet());
    this.app.use(cors());
    this.app.all('/*', (req, res, next) => {
      // res.setHeader("Access-Control-Allow-Origin", "*");
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Request-Headers', '*');
      res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept,Access-Control-Allow-Headers, Authorization, token, x-device-type, x-app-version, x-build-number, uuid,x-auth-token,X-L10N-Locale'
      );
      res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE');
      if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
      } else {
        next();
      }
    });
    this.app.use(busboy({ immediate: true }));
    this.app.use(morgan('dev'));

    this.app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded
    this.app.use(bodyParser.json(), (error, req, res, next) => {
      if (error) {
        return res.status(400).json({ error: 'Invalid request data' });
      }
      next();
    });

    this.app.use(fileUpload());
    const uploadsPath = path.join(__dirname, '../uploads');
    this.app.use('/uploads', express.static(uploadsPath));

    const routes = new Routes(NODE_ENV);
    this.app.use('/api/', routes.path());
    const Server = this.app.listen(PORT, () => {
      this.logger.info(
        `The server is running in port localhost: ${process.env.PORT}`
      );
      this.app.use((err: any, req: any, res: any, next: () => void) => {
        if (err) {
          res.status(500).json({ error: 'INTERNAL SERVER ERROR' });
        }
        next();
      });
    });

    // Socket Config
    const io = SocketIO.listen(Server, {
      transports: ["websocket", "polling"],
    });
    
    this.app.set("IO", io);
    this.chatSocket.init(io, this.app);
  }
}
