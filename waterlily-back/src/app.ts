import express, { Application } from 'express';
import sequelize from './config/database';
import authRoutes from './routes/authRoutes';
import cors from 'cors';
import surveyResponseRoutes from './routes/surveyResponseRoutes';

const app: Application = express();

app.use(
    cors({
        origin: 'http://localhost:5173', // Adjust the origin as needed
        credentials: true,
    }),
);
// Middleware
app.use(express.json());

app.use('/api/auth', authRoutes);

app.use('/api/survey-responses', surveyResponseRoutes);

// Database connection
sequelize.sync()
    .then(() => {
        console.log('Database connected');
    })
    .catch((err: Error) => {
        console.error('Unable to connect to the database:', err);
    });


export default app;