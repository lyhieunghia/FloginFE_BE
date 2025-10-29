# FloginFE_BE
## Overview
This is a full-stack web application built for learning and practicing software testing principles.  
The project simulates a Login and Product Management System with the following features:
- **Login Function:** User authentication system with full validation  
- **Product Management:** CRUD (Create, Read, Update, Delete) operations for products  
- **Frontend:** Built with React 18+  
- **Backend:** Built with Spring Boot 3.2+  
- **Testing:** Developed following the **Test-Driven Development (TDD)** methodology  

---

## Technologies Used

### 1. Frontend
- **React 18+** – JavaScript framework for building user interfaces  
- **React Testing Library** – Unit and integration testing for React components  
- **Jest** – JavaScript testing framework  
- **Axios** – HTTP client for API communication  
- **CSS3** – Styling with animations and responsive design  

### 2. Backend
- **Spring Boot 3.2+** – Java-based web framework for REST APIs  
- **Java 17+** – Programming language  
- **JUnit 5** – Testing framework for unit testing  
- **Mockito** – Mocking framework for test isolation  
- **Maven** – Build and dependency management tool  
- **Spring Data JPA** – ORM for database operations 
---
## Environment Setup
### 1. Prerequitsition
| Tool | Version | Purpose |
|------|----------|----------|
| [Node.js](https://nodejs.org/en/) | 18.x or 22.x | Run React frontend |
| [npm](https://www.npmjs.com/) | ≥ 8 | Install JS dependencies |
| [Java JDK](https://adoptium.net/) | 17+ | Run Spring Boot backend |
| [MySQL](https://dev.mysql.com/downloads/mysql/) | 8.0+ | Database |
| [Git](https://git-scm.com/) | latest | Version control |
| [nvm](https://github.com/nvm-sh/nvm)  | latest | Manage Node versions easily |

### 2. Clone the Repository

```bash
git clone https://github.com/lyhieunghia/FloginFE_BE.git
cd FloginFE_BE
```

### 3. Set node version
```bash
nvm install 18.17.0
nvm use 18.17.0
```
### 4. Install Dependencies
```bash
cd frontend
npm ci
cd ..

cd backend
./mvnw clean install -DskipTests
cd ..
```

### 5. Run the Application
Start Frontend (React)
```bash
cd frontend
npm start
```

Start Backend (Spring Boot)
```bash
cd backend
mvn spring-boot:run

```
---

