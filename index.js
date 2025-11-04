import dotenv from 'dotenv';
import path from 'path';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';
import { databaseConnect } from './db.connection.js';
import { errorHandler } from './middleware/errorHandler.js';
import authRoutes from './domains/auth/auth.routes.js';
import adminRoutes from './domains/admin/admin.routes.js';
import candidateRoutes from './domains/candidate/canidate.routes.js';
import workflowRoutes from './domains/workflow/workflow.route.js';
import userRoutes from './domains/users/user.routes.js';
import taskRoutes from './domains/tasks/task.route.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envFile =
  process.env.NODE_ENV === 'production'? '.env.production': '.env.development';

dotenv.config({ path: path.resolve(__dirname, envFile) });

const app = express();
app.use(cookieParser());

databaseConnect();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials:true,
}));

app.use(express.json());

app.use((req, res, next) => {
  console.log('Content-Type:', req.headers['content-type']);
  next();
});

app.use('/api/auth', authRoutes); 
app.use('/api/user', userRoutes); 
app.use('/api/admin', adminRoutes); 
app.use('/api/candidate', candidateRoutes); 
app.use('/api/workflows', workflowRoutes); 
app.use('/api', taskRoutes); 


app.use(errorHandler);
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor...`);
});
