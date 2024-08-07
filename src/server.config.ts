// src/server.ts
// Configurations de Middlewares
import express from 'express';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import bodyParser from 'body-parser';
import cors from 'cors'
import { setupSwagger } from './core/config/swagger';
import morgan from 'morgan';
import { ONE_HUNDRED, SIXTY } from './core/constants';
import userRouter from './routes/user.routes';
import cookieParser from 'cookie-parser';
import routerTable from './routes/table.routes';
import reservedRouter from './routes/reservation.routes';


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(
	rateLimit({
		max: ONE_HUNDRED,
		windowMs: SIXTY,
		message: 'Trop de Requete à partir de cette adresse IP '
	})
);

app.use(morgan('combined'));
app.use(cookieParser())
app.use(bodyParser.json())
app.use(cors())
app.use("/users",userRouter)
app.use("/tables",routerTable)
app.use("/reservations",reservedRouter)

setupSwagger(app);
export default app;
