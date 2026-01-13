# MongoDB CRUD API with Relationships

A complete Node.js CRUD application with MongoDB, featuring three related schemas (Subject, Teacher, Course) with proper authentication and authorization.

## Features

- ✅ **JWT Authentication & Authorization** (Admin/User roles)
- ✅ **Three Related Schemas** with MongoDB references
- ✅ **Complete CRUD Operations** for all entities
- ✅ **Relationship Management** between entities
- ✅ **Soft Delete Functionality**
- ✅ **Data Validation & Error Handling**
- ✅ **Populated References** in API responses
- ✅ **Query Parameters** for filtering

## Table of Contents

- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Testing with Postman](#testing-with-postman)
- [Data Relationships](#data-relationships)
- [Error Handling](#error-handling)

## Project Structure

```
├── config/
│   └── mongo.js        # MongoDB connection
├── controller/
│   ├── userController.js
│   ├── subjectController.js
│   ├── teacherController.js
│   └── courseController.js
├── middlewares/
│   └── auth.middlewares.js
├── model/
│   ├── userModel.js
│   ├── subjectModel.js
│   ├── teacherModel.js
│   └── courseModel.js
├── router/
│   │── user.router.js
│   ├── subjectRoutes.js
│   ├── teacherRoutes.js
│   └── courseRoutes.js
├── .env
├── package.json
└── server.js
```

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Postman (for API testing)

## Installation

1. **Clone or download the project**

   ```bash
   git clone <repository-url>
   cd <project-folder>
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:

   ```env
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/crud_app
   JWT_SECRET=your_super_secret_jwt_key_here
   ```

4. **Start the server**

   ```bash
   npm run dev
   ```

   Or for production:

   ```bash
   npm start
   ```

5. **Seed initial data (optional)**

   ```bash
   npm run seed
   ```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 3000 |
| MONGO_URI | MongoDB connection string | mongodb://localhost:27017/crud_app |
| JWT_SECRET | Secret key for JWT tokens | (required) |

## API Endpoints

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/odmapi/users/muser` | Create new user | Admin only |
| GET | `/odmapi/users/musers` | Get all users | Yes |
| GET | `/odmapi/users/muser/:id` | Get user by ID | Yes |
| POST | `/odmapi/users/mlogin` | User login | No |

### Subject Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/odmapi/subjects` | Get all subjects | Yes |
| GET | `/odmapi/subjects/:id` | Get subject by ID | Yes |
| POST | `/odmapi/subjects` | Create subject | Admin only |
| PUT | `/odmapi/subjects/:id` | Update subject | Admin only |
| DELETE | `/odmapi/subjects/:id` | Delete subject | Admin only |

### Teacher Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/odmapi/teachers` | Get all teachers | Yes |
| GET | `/odmapi/teachers/:id` | Get teacher by ID | Yes |
| POST | `/odmapi/teachers` | Create teacher | Admin only |
| PUT | `/odmapi/teachers/:id` | Update teacher | Admin only |
| DELETE | `/odmapi/teachers/:id` | Delete teacher | Admin only |
| POST | `/odmapi/teachers/:teacherId/subjects/:subjectId` | Add subject to teacher | Admin only |

### Course Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/odmapi/courses` | Get all courses | Yes |
| GET | `/odmapi/courses/teacher/:teacherId` | Get courses by teacher | Yes |
| GET | `/odmapi/courses/subject/:subjectId` | Get courses by subject | Yes |
| GET | `/odmapi/courses/:id` | Get course by ID | Yes |
| POST | `/odmapi/courses` | Create course | Admin only |
| PUT | `/odmapi/courses/:id` | Update course | Admin only |
| DELETE | `/odmapi/courses/:id` | Delete course | Admin only |

## Testing with Postman

### Step 1: Create Admin User

```http
POST http://localhost:3000/odmapi/users/muser
Content-Type: application/json

{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "admin123",
  "role": "admin"
}
```

### Step 2: Login to Get Token

```http
POST http://localhost:3000/odmapi/users/mlogin
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "admin123"
}
```

Save the `token` from response for subsequent requests.

### Step 3: Create Subject

```http
POST http://localhost:3000/odmapi/subjects
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "name": "Mathematics",
  "code": "MATH101",
  "description": "Fundamental mathematics course",
  "credits": 3
}
```

### Step 4: Create Teacher

```http
POST http://localhost:3000/odmapi/teachers
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "name": "Eng. Yusuf Isak",
  "email": "Yusuf.isak@university.edu",
  "department": "Mathematics",
  "qualification": "PhD in Mathematics",
  "experience": 10,
  "subjects": ["SUBJECT_ID_FROM_STEP_3"]
}
```

### Step 5: Create Course

```http
POST http://localhost:3000/odmapi/courses
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "title": "Calculus I",
  "code": "CALC101",
  "description": "Introduction to differential calculus",
  "teacher": "TEACHER_ID_FROM_STEP_4",
  "subject": "SUBJECT_ID_FROM_STEP_3",
  "schedule": {
    "day": "Monday",
    "time": "09:00 AM",
    "room": "Room 101"
  },
  "maxStudents": 40
}
```

### Step 6: Test Relationships

```http
GET http://localhost:3000/odmapi/courses
Authorization: Bearer <your_token>
```

The response will include populated teacher and subject data.

## Query Parameters

### Subjects

- `activeOnly=true` - Get only active subjects
- Example: `GET /odmapi/subjects?activeOnly=true`

### Teachers

- `activeOnly=true` - Get only active teachers
- `populateSubjects=true` - Include subject details
- Example: `GET /odmapi/teachers?populateSubjects=true`

### Courses

- `activeOnly=true` - Get only active courses
- `teacherId=ID` - Filter by teacher
- `subjectId=ID` - Filter by subject
- Example: `GET /odmapi/courses?teacherId=65f4a3c9d1e2f3a4b5c6d7e9`

## Data Relationships

### 1. Teacher ↔ Subject (Many-to-Many)

- A teacher can teach multiple subjects
- A subject can be taught by multiple teachers
- Teachers have `subjects` array field with Subject references

### 2. Course → Teacher (Many-to-One)

- A course has one teacher
- A teacher can teach multiple courses
- Courses have `teacher` field with Teacher reference

### 3. Course → Subject (Many-to-One)

- A course belongs to one subject
- A subject can have multiple courses
- Courses have `subject` field with Subject reference

## Business Rules

1. **Teacher Qualification**: A teacher can only be assigned to courses for subjects they're qualified to teach
2. **Soft Deletes**: All delete operations set `isActive` to `false` instead of removing records
3. **Data Integrity**: References are validated before creation/updates
4. **Authorization**: Admin-only operations are protected
5. **Validation**: All input data is validated

## Error Handling

The API returns appropriate HTTP status codes:

| Code | Meaning | Typical Scenario |
|------|---------|------------------|
| 200 | OK | Successful GET request |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid input data |
| 401 | Unauthorized | Missing or invalid token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Duplicate data (email, code, etc.) |
| 500 | Internal Server Error | Server error |

## Sample Error Response

```json
{
  "message": "Teacher not found or inactive",
  "error": "Teacher with ID 65f4a3c9d1e2f3a4b5c6d7e9 not found"
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.

## Support

For issues, questions, or contributions, please open an issue in the repository.

---

**Happy Coding!** 🚀
