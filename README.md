<div align="center">
    <h1>Threads App</h1>

This application is deployed on Render. Please check it out [here](https://threads-sociial-app.onrender.com/).

![threads-thumbnail](https://github.com/user-attachments/assets/01db2d79-f2e9-4cce-85fd-8692fbfd2ae9)

</div>

## Introduction

Threads is a full-stack social media application built using the MERN stack (MongoDB, Express.js, React.js, Node.js). Designed to provide a dynamic and engaging user experience, Threads allows users to connect, share, and interact with each other seamlessly. The application offers a wide range of features to ensure a modern social media experience, with functionalities like real-time chat, post creation, and user interaction. Utilizing the MERN stack ensures a smooth and robust performance, making Threads a reliable platform for social interaction.

## 🖥️ Tech Stack

**Frontend:**

![React](https://img.shields.io/badge/react_js-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)&nbsp;
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)&nbsp;
![Static Badge](https://img.shields.io/badge/Chakra_Ui-%23319795?style=for-the-badge&logo=chakraui&logoColor=black&color=%23319795)
&nbsp;
![Static Badge](https://img.shields.io/badge/Context_API-%23764ABC?style=for-the-badge)&nbsp;

**Backend:**

![Static Badge](https://img.shields.io/badge/Node_JS-%235FA04E?style=for-the-badge&logo=nodedotjs&logoColor=black)
&nbsp;
![Static Badge](https://img.shields.io/badge/Express_JS-%23000000?style=for-the-badge&logo=express&logoColor=white)
&nbsp;
![MongoDB](https://img.shields.io/badge/MongoDB-%2347A248?style=for-the-badge&logo=mongodb&logoColor=black)&nbsp;
![Static Badge](https://img.shields.io/badge/socketio-%23010101?style=for-the-badge&logo=socketdotio)
&nbsp;

**Deployed On:**

![Render](https://img.shields.io/badge/Render-%23000000?style=for-the-badge&logo=render)&nbsp;

## Features

- **User Authentication**: Secure user authentication for account creation and login.
- **Profile Management**: Logged-in users can edit and update their profile.
- **Freeze**: Logged-in users can freeze/disable their account.
- **Posts**: Create, read, delete, and share posts with their followers.
- **Follow/Unfollow Users**: Discover and connect with new users through the suggestion list, and manage your network by following or unfollowing users.
- **Like/Unlike Posts**: Engage with posts by liking or unliking them.
- **Comment**: Comment on posts to interact and share your thoughts with others.
- **Search**: Easily search user by username to start a conversation.
- **Real-Time Messaging**: Chat with other users in real-time, with support for both text and image messages.
- **Light and Dark Mode**: Toggle between light and dark themes for a personalized user interface.
- **Responsive Design**: Fully responsive design for seamless use on any device.

## Installation

1. **Clone the repository**:

   ```sh
   git clone https://github.com/rajeevkrS/Threads-Social-App
   ```

2. **Install dependencies in root folder**:

   ```sh
   npm install
   ```

3. **Set up environment `.env` variables**:

   ```dotenv
   # for port
   PORT= your port number

   # for mongo database
   MONGODB_URI= your mongo url

   # for password secret
   JWT_SECRET= your jwt secret

   # for cloudinary setup
   CLOUDINARY_CLOUD_NAME= your cloudinary name
   CLOUDINARY_API_KEY= your cloudinary api key
   CLOUDINARY_API_SECRET= your cloudinary api secret

   # for frontend url
   FRONTEND_URL= your frontend url

   # for backend url
   BACKEND_URL= your backend url
   ```

4. **Run the application**:

   Build the app:

   ```sh
   npm run build
   ```

   Start the app:

   ```sh
   npm start
   ```

## API Endpoints

Here are listed all available API endpoints along with a brief description of each.

#### Users Routes:

- `POST /api/users/signup`: creating new user
- `POST /api/users/login`: user logged in
- `POST /api/users/logout`: user logged out
- `PUT /api/users/update/:id`: update user profile
- `POST /api/users/follow/:id`: follow & unfollow users
- `GET /api/users/profile/:query`: get other user's profile
- `GET /api/users/suggested`: get new users suggestion
- `PUT /api/users/freeze`: freeze & unfreeze account

#### Post Routes:

- `POST /api/posts/create`: create posts
- `PUT /api/posts/like/:id`: like & unlike the posts
- `PUT /api/posts/reply/:id`: reply on posts
- `GET /api/posts/:id`: get any posts
- `DELETE /api/posts/:id`: delete posts
- `GET /api/posts/user/:username`: get user posts
- `GET /api/posts/feed`: get all feed posts

#### Chat Routes:

- `POST /api/messages`: send messages to other users
- `GET /api/messages/:otherUserId`: get all messages between the user
- `GET /api/messages/conversations`: get all conversation that logged in user has conversed with

## 👤 Developer

[RAJEEV KUMAR SUDHANSU](https://github.com/rajeevkrS)

## 📬 Contact

If you want to contact me, you can reach me through below handles.

<a href="https://www.linkedin.com/in/rajeev-kumar-sudhansu/" target="_blank"><img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn"/></a>

<a href="mailto:rajeevkumarr1221@gmail.com"><img  alt="Gmail" src="https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white" /></a>

## Contribution:

Feel free to contribute to the project by opening issues or creating pull requests. Your feedback and suggestions are highly appreciated.

### Show your support by Star 🌟 this repo!
