Convergence Spring Boot app

Setup

1. Ensure MySQL is running on localhost:3306 and has a database named `convergence`.
2. Create a table `usuarios` for testing, for example:

   CREATE TABLE usuarios (
     id INT AUTO_INCREMENT PRIMARY KEY,
     nombre VARCHAR(100),
     email VARCHAR(150)
   );

3. Set environment variables (optional). By default the app uses `root` and empty password.

   In PowerShell:

   $env:DB_USER = "root";
   $env:DB_PASS = "your_password_here";

Run

In project root (PowerShell):

.\mvnw.cmd spring-boot:run

Endpoints

- GET /saludo -> returns a greeting
- GET /usuarios -> returns rows from `usuarios` table (as JSON array)

Notes

- Credentials are read from DB_USER and DB_PASS environment variables if set.
- For production, configure secure credentials and proper error handling.
