## Team Member:

| Name          | Git names         |
|---------------|-------------------|
| Wenxuan Sun   | Annaxuan, anna    |
| Xingyu Yue    | XY-Yue, yuexy     |
| HongCheng Wei | HomeletW          |
| Jiayi Su      | sujiayi317, jenny |

# Phase 2

## URL for the deployed website:

https://uplust.herokuapp.com/

## User accounts

| Username                                                | Password           | Account type |
|---------------------------------------------------------|--------------------|--------------|
| user1, user3, user4, user5, user6, user7, user8, user16 | same as username   | Student      |
| tutor1, tutor2, tutor3, tutor4                          | same as username   | Tutor        |
| admin                                                   | same as username   | Admin        |

You may also signup your own account.

## Introduction:

There are three types of users: Admin, Tutor and Student. All users can log in from the button ‘Login’ at the top right
corner.

- The admin user will login using username and password ‘admin’.

- Tutor users will login using username and password ‘tutor1’ (first tutor), ‘tutor2’ (second tutor).

- Students are the “regular users” of the app, so they login using username and password ‘user1’, ‘user2’, etc. as
  specified in the handout.

## How to run our app locally after cloning the repo

Create a .env file in the root directory of the project with the following information:

```
PORT = 5002
CLIENT_URL = http://localhost:3000
SERVER_URL = http://localhost:5002
SECRET = csc309uplust
ACCESS_TOKEN_SECRET = csc309uplustAccess
DATABASE_URL = postgres://cgodegbcqasnhk:bc9dde8d49b2cf3b9a08f5319d6a14852efb37e1ac70244e2e50be6d51c92246@ec2-3-225-213-67.compute-1.amazonaws.com:5432/dc90378pfint6c
AWS_ACCESS_KEY_ID = AKIAZECF76RMGLCPUVAO
AWS_SECRET_ACCESS_KEY = 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
```

(This is a React-Express app, so before running locally, we need to run ‘npm install’ and ‘npm start’ in both the root
and the /client directory. )

Actually, in the root folder, we provide you with a script to start the server with database connected, you can simply
run ```npm run fullstack```

To start the frontend server, you can cd into the client directory and run ```npm start```

## Overview of the routes in our Express server, and their functionality in our app:

### Express Routes Structure:

* All the backend (database or server) related files are in the root directory (and their respective subdirectories),
  and the frontend code is contained within the client folder.
* In the root directory, server.js is the starting point of the Express server, where
  ``` const app = express() ``` starts the server and listens to requests.

  The detailed routes are used starting from around line 70:

```js
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/message', messagingRouter);
app.use('/api/course', courseRouter);
app.use('/api/schedule', scheduleRoute);
app.use('/api/account', accountRoutes);
app.use('/api/connection', connectionRoutes);
```

* The routes folder contains routes responsible for different functionalities:
    * authRoutes.js mainly handles requests for register, login, and logout
    * account folder contains routes for account related information:
        * accountRoutes router for account
        * accountAdmin handles routes that require admin access like get all accounts, delete account.
        * accountInfo handles basic get, patch request on the logged-in user's account.
        * accountProfilePicture handles get, post profile picture of the logged-in user.
    * connectionRoutes.js handles tutor-user connections adding, looking up, or updating
    * messagingRoutes.js handles message sending and receiving
    * scheduleRoute.js handles get all schedule for a user, post a new schedule to a specific connection.
    * courseRoutes.js handles request related to course, get/post/put/delete course detail, and get/post course picture.

### Routes Overview

Note: Most routes below requires user to login (has a JWT in the header of the request), and a cookie called token in
the client side.

#### Account routes

- GET /profilePic -- returns the profile picture of the currently logged-in user.
- GET /profilePic/:id -- returns the profile picture of the specific user.
- POST /profilePic -- Update the profile picture with a new one.
- GET / -- get the currently logged-in account info.
- PATCH / -- Update the account info with a new one.
- GET /allAccount -- Get the info on all accounts, requires admin access.
- DELETE /:id -- Delete a specific account, requires admin access.

#### Authentication routes

- POST /register -- Register a new user, the role of the user could be either student or tutor. We disallow people from
  registering an account for admin.
- POST /login -- Log an already registered user in, the user could have any role. A signed JWT alone with other
  information will be returned as a response for a successful request.
- POST /logout -- Log out a user who is currently logged in. It's a POST request because the JWT token will be sent in
  the header to verify that the user is logged in at the time of the request. Only a logged in user is allowed to
  logout.

#### Connection routes

- GET /course/:courseId -- Gets all connections related to the given course ID. Takes a course ID as request param.
  Returns a list of connection objects of the course. Note this method does not require authentication because guest
  users can also see tutor info in a course
- GET /account/:accountId -- Gets all connections related to the given account ID. Takes an account ID as request param.
  Returns a list of connections involving the account.
- POST / -- Adds a connection. Takes an account ID (id of student or admin in connection, optional), a tutor ID, a
  course ID as request body. If account ID is not specified, then a random admin will be the account. Status field of
  the connection object will be false. Returns the new connection object created.
- PATCH /:connectionId -- Change status of the connection. Takes a connection ID as the request param. Changes the given
  connection's status to true. Return the updated connection object.

#### Course routes

- POST / -- Adds a new course to the database.
- GET / -- Gets all courses.
- GET /:id -- Get the course information with the given course id.
- PUT /:id -- Update the course information with the given course id.
- DELETE /:id -- Delete the course information from the database with the given id, and delete the course picture with
  the given id.
- POST /coursePic/:id -- Add the course picture with the given course id.
- GET /coursePic/:id -- Get the course picture with the given course id.

#### Messaging routes

- POST /:connectionId -- Adds a new message that belongs to the given connection id. Takes a connection ID as request
  param, and the content of the message in the body. Returns a message object that got inserted into the database.
- GET /:connectionId -- Gets all messages associated with the given connection ID. Takes a connection ID as request
  param. Returns a list of message objects associated with the connection ID that the database is storing.
- GET /file/list/:connectionId -- Gets a list of file names belonging to the given connection. Takes a connection ID as
  request param. Returns a list of objects containing file names associated with the connection ID that aws s3 is
  storing, along with the metadata: sender, and the last modified date of the file.
- GET /files/:connectionId/:name -- Gets a single file with the given name from the connection ID's files. Takes a
  connection ID and a file name as request param. Returns a file with the given name that belongs to the given
  connection ID.
- GET /files/exists/:connectionId/:name -- Checks if the given connection ID has a file with the given name. Takes a
  connection ID and a file name as request param. Returns a boolean indicating if the file exists.
- POST /file/:connectionId -- Uploads a file belonging to the given connection ID from user to aws s3. Takes a
  connection ID as request param, and a file from the body (sent inside a form). Returns "Uploaded" on success.

#### Schedule routes

- GET / -- Get the schedule of the currently logged-in user.
- POST /:connectionId -- Add a new schedule to the specific connection.

### More About Authentication and Authorization:

Both of the signup and login page on the client side take into the availability into consideration. A screen reader
could be used to help users understand the requirments for the input fields of the form.

#### Register (or sign up)

From the sign-up page, a user is able to register as a student or as a tutor. When the “submit” button is pressed, the
request will be handled by the register route (line 17)  in authRoutes.js.

A student or tutor account is going to be created in the database after we validate that the new use does not exist in
the database already. We require that every username is unique because the username will be used for login purposes, and
we also require that email is unique in the database, because there is normally one owner for each unique email address.

We then encrypt the password before saving it into the database with bcrypt, which was taught in lectures. The
routes/helper/passwordHelper.js contains helper functions that help with encrypting or comparing the passwords.

##### To test it with postman locally:

Create a POST request with URL: [http://localhost:5002/api/auth/login](http://localhost:5002/api/auth/login)

In the Body section, specify a JSON object with username and password information:

```json
{
	"username": "user16",
	"email": "user16@mail.utoronto.ca",
	"password": "user16",
	"role": "student"
}
```

The response after a successful request (example):

```json
{
	"success": true,
	"message": "Registered successfully"
}
```

#### Login

From the log-in page, an already registered user should be able to login with the username and password. A request will
be sent to the login route (line 96)  in authRoutes.js.

The Account table stores students and admin information, and the Tutor table stores tutors’ information. Both tables are
available to be searched to find the account with the given username and password. Once found, the server will send a
cookie with a signed accessToken which is a JWT, along with userInfo in a JSON object, together with success flag. The
goal is for the client side to be able to know the information about this user so that next time when this user sends
requests to the server with that accessToken in the header of the request, the server could use the JWT methods to
verify that the user is authenticated to access the protected routes.

##### To test it with postman:

Create a POST request with URL: [http://localhost:5002/api/auth/login](http://localhost:5002/api/auth/login)

In the Body section, specify a JSON object with username and password information:

```json
{
	"username": "user4",
	"password": "user4"
}
```

The response after a successful request:

```json
{
	"userInfo": {
		"id": 7,
		"username": "user4",
		"email": "student4@mail.utoronto.ca",
		"role": "student",
		"description": null,
		"campus": null,
		"programOfStudy": null
	},
	"success": true,
	"message": "Logged in successfully",
	"accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywidXNlcm5hbWUiOiJ1c2VyNCIsImVtYWlsIjoic3R1ZGVudDRAbWFpbC51dG9yb250by5jYSIsInJvbGUiOiJzdHVkZW50IiwiZGVzY3JpcHRpb24iOm51bGwsImNhbXB1cyI6bnVsbCwicHJvZ3JhbU9mU3R1ZHkiOm51bGwsImlhdCI6MTY0OTE2NjUzNH0.h6Kk1TFa9Xl_muHWZWyGOMqRPMmfg6Zx9jvIisQ2UZA"
}
```

After getting a success status code (200) and having the response information, you should copy the accessToken, and
paste it into the Headers section of any protected route (that uses a verifyUser middleware), the format is Bearer
token, that is to say, there's actually a space between Bearer and token. This manually adding the token is necessary,
however, adding the token to the header is automatically handled by the client code.

#### Logout

From the navbar, an already registered user should be able to logout with the correct token sent in the header of the
request. A request will be sent to the logout route in authRoutes.js.

By successfully logging out, the JWT access token will be removed from the cookies, therefore the user will no longer
have access to all the protected routes

##### To test it with postman:

Create a POST request with URL: [http://localhost:5002/api/auth/logout](http://localhost:5002/api/auth/logout)

In the Header section, specify a key called "authorization" and a value with the format "Bearer theUserAccesstoken". For
example, to log out user4, the value should be

```
Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywidXNlcm5hbWUiOiJ1c2VyNCIsImVtYWlsIjoic3R1ZGVudDRAbWFpbC51dG9yb250by5jYSIsInJvbGUiOiJzdHVkZW50IiwiZGVzY3JpcHRpb24iOm51bGwsImNhbXB1cyI6bnVsbCwicHJvZ3JhbU9mU3R1ZHkiOm51bGwsImlhdCI6MTY0OTE2NjUzNH0.h6Kk1TFa9Xl_muHWZWyGOMqRPMmfg6Zx9jvIisQ2UZA
```

Note: the token will change for a different logging-in session.

The response after a successful request:

```json
{
	"success": true,
	"message": "Logged out successfully"
}
```

#### How we store the authentication and authorization information on the client side.

- We use react redux toolkit to manage state and user information. client/src/redux/store.js contains the redux store,
  authSlice and userSlice are reducers handling the authenticated state of a user and the user information.
- client/src/api/auth.js describes how we add the token in the header when we send requests to routes that need an
  access token.

#### Middlewares

The **validateInfo.js** validates the username, email, or password by checking if their existence or format is valid or
not. It’s used in both register and login routes.

The **verityUser.js** is important for the authorization checking. It tries to find the JWT from the request header. If
the accessToken exists in the header, the token information will be further verified with the jwt.verify method, which
checks if the secret is the correct one that we have in the .env file.

### Database Setup

We are using a Postgresql database hosted on Heroku. The database ORM library we worked with is Sequlize.

Here is the ER Diagram.

![ER diagram](./readme-assets/CSC309%20U+T%20Entity%20Relationship%20Model.png)

Notice that the users are divided into two table: Account table for storing Student and admin account, Tutor table for
storing tutors.

The reason for this wierd choice of schema is that we couldn't find an easy way for expressing a "Many-to-Many recursive
relationship" in Sequelize ORM.

There is a clever trick that is used to ensure the id across the two tables are disjoint, i.e. not the same id for a
users.

```sql
ALTER SEQUENCE "Accounts_id_seq" START 1 INCREMENT 2;
ALTER SEQUENCE "Tutors_id_seq" START 2 INCREMENT 2;
```

This mutates the sequence that generates the id of these two table, which makes Account id to be always odd, and Tutor
id to be always even.

(Credit: The response of user Martin6989
on [this discussion on community.spiceworks.com](https://community.spiceworks.com/topic/1709798-how-to-create-a-unique-index-constraint-across-multiple-tables))

### File Storage

We used AWS S3 Bucket for storing profile picture, course picture and files for messaging.

![AWS S3 bucket](./readme-assets/s3bucket.png)

- uplust-course: stores the course picture for each course.
    - For example `1/coursePicture` would be the key for the course picture for course with id `1`.
- uplust-messages: stores the files that were uploaded for each message.
    - For example `1/example.txt` would be the key to a file named `example.txt` that was uploaded to the message for
      connection with id `1`.
    - The sender flag (identifies who sends this file) is attached as metadata.
- uplust-user: stores the profile picture for each user.
    - For example `1/profilePicture` would be the key for profile picture for user with id `1`.
    - There is a fallback profile picture `default` that be used if there were no profile picture uploaded for that
      user.

We designed a reference based helper that works with AWS-SDK, where each resource is identified by a reference, and we
simply put/get/list/... on the reference. This is inspired by Firebase cloud storage reference system.

## Features Updated in Phase 2 to help you navigate though our app easily

* A new feature in navigation bar: It will conditionally render navigation link items based on the log-in state of the
  user. If the use is not logged in, the navigation bar will only show three links: Courses, Login, and SignUp.
  Otherwise, the user could see the full range of links, such as Dashboard, Schedule, and Profile. Additionally, if the
  logged in user has the admin role, then the user could also see the Management on the navigation bar. The navigation
  bar is responsive to the screen size, so that for small screen size, a hamburger menu allows users to expand the items
  in the navigation bar.

* schedule: user is able to see a list of schedule that they have, and be able to jump to a meeting link (if provided
  properly). Click on the calendar to filter out the schedule of a specific date. Switch to a course tab to only show
  schedule related to that course. The date/course that has some meeting would have a red dot beside it.

* management: this feature is added on phase 2, reflecting the feedback from phase 1. Admin now have a management tab
  where he/she can see a list of all users and all course. Admin is able to apply "role", "campus" filter and search for
  an account using search box within the account management. Admin is able to add, remove and change the course's info
  courses within the course management.

* profile: User is now able to change their email, profile picture, campus, program of study and description on the
  profile page.

* general messaging: User can now upload and download files in the dashboard when chatting with others. The files are
  stored in AWS S3 as described above.

## Third-party libraries:

### Server side

    "aws-sdk": "^2.1106.0",
    "bcrypt": "^5.0.1",
    "cookie-parser": "^1.4.6",
    "cors": "^2.8.5",
    "dotenv": "^16.0.0",
    "express": "^4.17.3",
    "joy": "^0.1.1",
    "jsonwebtoken": "^8.5.1",
    "moment": "^2.29.1",
    "moment-timezone": "^0.5.34",
    "multer": "^1.4.4",
    "passport": "^0.5.2",
    "passport-jwt": "^4.0.0",
    "pg": "^8.7.3",
    "pg-hstore": "^2.3.4",
    "request": "^2.88.2",
    "sequelize": "^6.17.0",
    "sequelize-cli": "^6.4.1",
    "uuid": "^8.3.2"

### Client side

    "@emotion/react": "^11.8.1",
    "@emotion/styled": "^11.8.1",
    "@fortawesome/fontawesome-svg-core": "^6.1.1",
    "@fortawesome/free-regular-svg-icons": "^6.1.1",
    "@fortawesome/free-solid-svg-icons": "^6.1.1",
    "@fortawesome/react-fontawesome": "^0.1.18",
    "@mui/icons-material": "^5.4.2",
    "@mui/lab": "^5.0.0-alpha.70",
    "@mui/material": "^5.4.3",
    "@reduxjs/toolkit": "^1.8.0",
    "axios": "^0.26.1",
    "moment": "^2.29.1",
    "moment-timezone": "^0.5.34",
    "react": "^17.0.2",
    "react-dom": "^17.0.2",
    "react-icons": "^4.3.1",
    "react-redux": "^7.2.6",
    "react-router-dom": "^6.2.1",
    "react-scripts": "5.0.0",
    "react-toastify": "^8.2.0",
    "react-uid": "^2.3.1",
    "use-http": "^1.0.26",
    "web-vitals": "^2.1.4"

-----------

# Phase 1

### Browse Course (home page or courses page, course detail page)

- A user (admin, tutor, student, or not logged in) can view course cards on the home page, which is the courses
  available.
- A user can click on a course card on the homepage to go to the course detail page of that specific course, which
  includes a course description, and a list of available tutors (with profile picture, username, and description).
- The admin user can click on the ‘Add Course’ button (which is only visible to admins) on the left side of the home
  page to add a new course.
- The admin user can click on the red cross button (which is only visible to admins) on each course card to remove a
  course.
- When the admin click add course button, a dialog will appear and ask the admin to input the course name and course
  number.
- When the admin click delete course button, a warning dialog will appear to ask the admin whether to delete the course.
- A student user can click on the ‘Connect’ button (which is only visible to student users) below the profile picture. A
  dialog will appear to ask whether to chat with that tutor.
    1. If click "Cancel", then the dialog will disappear.
    2. If click "Yes", the student will be direct to the dashboard page to discuss the course or any services.
- A tutor user can click on the ‘Apply Now!’ button (which is only visible to tutor users) on the course detail page for
  a course. A dialog will appear to ask whether to chat with the admin.
    1. If click "Cancel", then the dialog will disappear.
    2. If click "Yes", the tutor will be direct to the dashboard page, where application information can be discussed.

### Sign Up

#### Sign Up, which applies directly to the MVP in Phase 1

> Note the sign up page has finished all the UI design, in the next phase, as indicated in the A1 handout, we’ll make it fully functional by providing the following specification.

- A user can sign up by providing account type, username, uoft email and password. In the next phase, we will implement
  proper (and more secure) authentication.
    1. There are two types of accounts that accept sign up: Student, Tutor. Admin accounts don’t accept signup.
    2. When signed up, the profile picture is randomly assigned (by the backend), this can be changed in the profile
       page.
    3. The campus and program of study of Student accounts, is assumed to be empty when signed up. This can be changed
       in the profile page.

### Log In, which applies directly to the MVP in Phase 1

- Before logging in to the website, all visitors can see a general page with a view of courses. Before logging in, the
  visitor should be able to see the “courses”, “login” and “Sign Up” buttons on the navbar at the top. “courses” in this
  case are not specific to a user, however, it’ll change to a specific view after the user logs in.
- A user can log in to the website by providing a matching username and password that are listed in the mock.js.
  Examples:
  Admin user: username: admin, password: admin Tutor user1: username: tutor1, password: tutor1 Tutor user2: username:
  tutor2, password: tutor2 Tutor user3: username: tutor3, password: tutor3 Tutor user4: username: tutor4, password:
  tutor4 Student user1: username: user1, password: user1 Student user2: username: user2, password: user2 Student user3:
  username: user3, password: user3
- If a user is logged in, the navbar will show the links to Courses, Dashboard, Schedule, Profile, and Log Out. This
  user can click into these pages to see the views that this user is allowed to browse.
- A user can jump to sign up in the login page if they don’t have an account yet by clicking the “Sign Up” at the bottom
  of the paragraph or the link on the navbar.
- For the login page, if the user fails to provide a username or password, the password has length less than 4 or
  greater than 15, or the user fails to provide the correct combinations of username and password pair, a red hint is
  going to show at the top of the input boxes to let the user know that there’s an error.

### Dashboard

> Note: (RESOLVED in phase 2) When running Dashboard, there will be a MUI warning about using an uncontrolled TreeView. We are aware of this issue but fixing the warning will cost two times more work resulting in the same product. Therefore, we will leave this warning at this moment.

- Logged in users (admin, tutor, student) can click on a user from a specific course displayed as a tree structured list
  of buttons on the left side to open a chat box and chat with that specific user in the chat box on the right side (
  chat box not visible if no user selected).
- Tutor users can click on a course code in the drop down menu ‘Admins’ (only visible to tutors) below the above tree
  structured list to open a chat box with the admin to chat about a course (application, general arrangements, etc.).
  Tutors can upload resumes and other files there.
- Logged in users can view the information (profile picture, description, and status (approved to teach a course,
  registered in a course, etc.)) of the user he/she is connecting with.
- Logged in users can chat with the user he/she is connecting with using the chat box, where a user types a message and
  clicks on the ‘Send’ button to send the message.
- The ‘Upload a File’ button beside the text field to enter messages is not available at this moment as it requires
  server calls to run. It is planned to upload a file (resume, course notes, etc.).
- Admin and Tutor users can click on the ‘Schedule Meeting’ button in the user information box to open a pop-up dialog
  to schedule a meeting with the user he/she is connecting with.
- If a student user wants to purchase service from a tutor user he/she is connecting with, the user can click on the
  ‘Purchase’ button in the user info box to register for the course under the target tutor. (the button is not visible
  if the student is already registered)
- If the admin wants to approve a tutor who is applying to teach a specific course, he/she can click on the ‘Approve’
  button in the user info box to approve the tutor. (the button is not visible if the tutor has already been approved)
- The admin user can click on the ‘Performance’ tab above the user info box to view a list of students who are
  registered under the selected tutor.

### Profile

- Logged in users can change their uoft email, password and profile picture.
- Tutors and students can also provide a short description about themself.
- In addition to short descriptions, students can also change their campus and program of study.

### Schedule

- The logged in user can see meeting schedules related to he/she in the schedule page.
- The course, title, date and opponent of the meeting is displayed on the meeting card.
- The description for the meeting is contained in a dropdown, which is expanded when clicked on the meeting.
- Users can visit the meeting link by clicking “Join Meeting”.
- The future meetings (or meetings for today) are sorted in ascending order of time, located before the divider “Past
  Event”.
- The past meetings are disabled (not clickable and in gray) and sorted in descending order of time, located after the
  divider “Past Event”.
- Users can apply a filter to show the meeting schedules on a specific date by selecting the date on the calendar; the
  selected date is highlighted with a blue background.
    1. Users can clear this filter by clicking “Show All Schedule”.
    2. Users can quickly select today by clicking “Go to Today”.
- Users can apply another filter to only show the meetings for a specific course by clicking on the tab for that course.
- In the calendar, today is highlighted by a circle border.
- In the calendar, the date that contains at least one meeting has a red dot below it.
- Users can change the month of the calendar by clicking on the left and right button located on top of the calendar.

## AWS S3 Reference

- https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/getting-started-nodejs.html
- https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/loading-node-credentials-shared.html
- https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/s3-node-examples.html
