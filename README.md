# Web-dev
# Full Stack Website (MEAN stack)

### Project Description
This project is a full stack web application built using the MEAN stack (MongoDB, Express, Angular, and Node.js). It features a modern web interface for managing users and products, with secure authentication and robust backend APIs. The backend, powered by Node.js and Express, connects to a MongoDB database to store user and product information, including user registration, login, and product listings with details such as title, brand, image, stock, seller, price, and reviews. The frontend, developed with Angular, provides a responsive and interactive user experience. This application demonstrates best practices in full stack development, including RESTful API design, user authentication with password hashing, and seamless integration between the frontend and backend. The project serves as a practical example of building scalable and maintainable web applications using popular open-source technologies.

### Security Features
#### Password Hashing:
- User passwords are securely hashed using bcrypt before being stored in the database, protecting user credentials even if the database is compromised.
#### Input Validation:
- User and product data are validated at the schema level to ensure only properly formatted and required information is accepted.
#### Unique Email Enforcement:
- The user registration process enforces unique email addresses, preventing duplicate accounts and reducing the risk of account enumeration.
#### Authentication Middleware:
- API routes for sensitive operations are protected by authentication middleware (if implemented), ensuring only authorized users can access or modify data.
#### CORS Protection:
- Cross-Origin Resource Sharing (CORS) is enabled and configured to control which domains can interact with the backend API, mitigating certain cross-site attacks.
#### Error Handling:
- Centralized error handling prevents sensitive information from being exposed in API responses.



### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Mongo Shell https://www.mongodb.com/try/download/shell 
- Angular CLI
- npm or yarn

### Database

1. Download Mongo Shell for mongosh
2. start mongosh and find database
   ```
   mongosh
   use tut9-g1
   ```
3. view data
   ```
   show collections
   db.users.find() or db.products.find()
   ```

### Installing

1. Clone the repository
2. Install backend dependencies:
   ```
   cd backend
   npm install
   ```
3. Install frontend dependencies:
   ```
   cd frontend
   npm install
   ```

### Deployment

1. Start MongoDB service
2. Start the backend server:
   ```
   cd backend
   npm start
   ```
3. Start the frontend development server:
   ```
   cd frontend
   ng serve
   ```

## Dependencies

* [Angular](https://angular.io/) - Frontend framework
* [Express](https://expressjs.com/) - Backend framework
* [MongoDB](https://www.mongodb.com/) - Database
* [Mongoose](https://mongoosejs.com/) - MongoDB object modeling
* [Node.js](https://nodejs.org/) - JavaScript runtime

## Contributors
* **Rodrigue Ntagashobotse** 
* **Claudia Choi**
* **Jake Marsden**
* **Tianyue Shen**

