# Courses CRUD API

A simple **CRUD REST API** built with **Node.js**, **Express**, and **MySQL2**, following the **MVC architecture** pattern. This application allows users to create, read, update, and delete **courses** from a MySQL database.

---

## 📌 Features

* Create a new course
* Get all courses
* Get a single course by ID
* Update a course
* Delete a course
* Uses **MySQL2 with prepared statements**
* Environment variables managed with **dotenv**
* Structured using **MVC architecture**

---

## 🛠️ Technologies Used

* Node.js
* Express.js
* MySQL2
* dotenv

---

## 📁 Project Structure

```
project/
│
├── config/
│   └── db.js
│
├── models/
│   └── course.Model.js
│
├── controllers/
│   └── course.Controller.js
│
├── routes/
│   └── course.Routes.js
│
├── .env
├── .gitignore
├── server.js
└── package.json
```

---

## 🗄️ Database Setup (IMPORTANT)

### 1️⃣ Create the Database

Create a MySQL database name your own db:

### 2️⃣ Create the `courses` Table

Run the following SQL command:

```sql
CREATE TABLE courses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL
);
```

* `id` is **auto-generated**
* `name` is the course name
* `description` describes the course

---

## 🔐 Environment Variables (.env)

Create a `.env` file in the root directory and add:

```
PORT="your port"
DB_HOST="host name"
DB_USER="user name"
DB_PASSWORD="pssword if the user"
DB_NAME="db name
DB_PORT="db port "
```

⚠️ Make sure `.env` is added to `.gitignore`

---

## 📦 Install Dependencies

```bash
npm install
```

---

## ▶️ Run the Server

```bash
npm run server
```

OR

```bash
node server.js
```

Server will run at:

```
http://localhost:the port you choosed
```

---

## 🔄 API Endpoints (CRUD)

### ➕ Create a Course

**POST** `/courses`

```json
{
  "name": "Node.js Basics",
  "description": "Introduction to Node.js"
}
```

---

### 📄 Get All Courses

**GET** `/courses`

---

### 🔍 Get Course by ID

**GET** `/courses/:id`

Example:

```
/courses/1
```

---

### ✏️ Update a Course

**PUT** `/courses/:id`

```json
{
  "name": "Advanced Node.js",
  "description": "Deep dive into Node.js"
}
```

---

### ❌ Delete a Course

**DELETE** `/courses/:id`

---

## ⚠️ Error Handling

* Returns proper HTTP status codes
* Prevents SQL Injection using prepared statements

---

## ✅ Assignment Compliance

✔ Uses MVC Architecture
✔ Uses MySQL2 with Prepared Statements
✔ Uses dotenv for security
✔ CRUD operations fully implemented
✔ Ready to run with `npm start`

---

## 👤 Author

**Dev Yusuf Isak**

---

## 📜 License

This project is for educational purposes only.
