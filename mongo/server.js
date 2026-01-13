import express from 'express';
import dotenv from 'dotenv';

// Import MongoDB connection
import { connectDB } from './config/mongo.js';

// Import existing mongo routes
import mongoUsersRoute from './router/user.router.js';

// Import new routes
import subjectRoutes from './router/subjectRoutes.js';
import teacherRoutes from './router/teacherRoutes.js';
import courseRoutes from './router/courseRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Connect to MongoDB
connectDB().catch(console.error);


// Default route
app.get('/', (req, res) => {
    res.json({ 
        message: 'API Server is running',
        endpoints: {
            users: '/odmapi/users',
            subjects: '/odmapi/subjects',
            teachers: '/odmapi/teachers',
            courses: '/odmapi/courses'
        }
    });
});

// Existing mongo user routes
app.use('/odmapi/users', mongoUsersRoute);

// New mongo routes
app.use('/odmapi/subjects', subjectRoutes);
app.use('/odmapi/teachers', teacherRoutes);
app.use('/odmapi/courses', courseRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});