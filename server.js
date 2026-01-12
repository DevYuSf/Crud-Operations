import express from 'express';
import dotenv from 'dotenv';
import db from './config/db.js';
import router from './router/course.route.js';
//mongo import routes
import { createUser,getAllUsers,getUserById,login } from './controller/mongo/user.controller.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use('/api', router);
db;

app.get('/', (req, res) => {
    res.send('Hello World!');
});

//mongo routes


app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});