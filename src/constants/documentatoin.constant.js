export const DOCUMENTATION_OF_SYSTEM = `Documentation: User and UserDetails Management API
Overview
This API allows managing users and their associated details using MongoDB and Express.js. It provides endpoints to perform CRUD operations, ensuring that User and UserDetails collections in MongoDB remain synchronized.

Models
User: Represents a user with basic information.

Fields:
name (String, Required): The name of the user.
email (String, Required, Unique): The user's email address.
phoneNumber (String, Required): The user's phone number.
createdAt (Date, Default: Date.now): Timestamp of when the user was created.
UserDetails: Contains additional details about a user.

Fields:
email (String, Required, Unique, Ref: User): The user's email, linked to the User model.
address (String): The user's address.
age (Number): The user's age.
occupation (String): The user's occupation.
createdAt (Date, Default: Date.now): Timestamp of when the details were created.
Endpoints
1. Get All Users with Details
Method: GET /
Description: Fetches all users and their associated details.
Process:
Retrieve all users from the User collection.
For each user, fetch their details from the UserDetails collection using the email.
Combine user data with their details.
Response:
Success: Returns an array of users with details.
Error: Returns a 500 status with the error message.
2. Create a New User with Details
Method: POST /
Description: Creates a new user along with their details in a transactional manner to ensure data consistency.
Process:
Start a database session and transaction.
Create a new user in the User collection.
Create corresponding details in the UserDetails collection.
Commit the transaction if successful or abort if an error occurs.
Response:
Success: Returns the created user and details.
Error: Returns a 400 status with the error message.`