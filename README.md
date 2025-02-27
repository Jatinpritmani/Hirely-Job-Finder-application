# Hirely - JobFinder

Hirely - JobFinder is a React Native (Expo) mobile app with a Node.js backend. It connects job seekers and employers, offering user registration, profiles, job search with filters, application tracking, notifications, bookmarks, and job postings. Future updates will add notifications and video resumes, ensuring a scalable career platform.

## Project Structure

```
Hirely-JobFinder/
│-- Backend/     # Node.js backend with MongoDB
│-- Frontend/    # React Native (Expo) app
```

---

## Backend Setup (Node.js + MongoDB)

### Prerequisites

- [Node.js](https://nodejs.org/) installed
- [MongoDB](https://www.mongodb.com/) installed and running locally or a cloud database like MongoDB Atlas

### Steps to Run the Backend

1. Navigate to the backend directory:
   ```bash
   cd Backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Install dependencies:
   ```bash
   npm install nodemon
   ```
4. Start the backend server:
   ```bash
   node app
   ```
   The backend will be running at `http://localhost:4200` (or your configured port).

---

## Frontend Setup (React Native Expo)

### Prerequisites

- [Node.js](https://nodejs.org/) installed
- [Expo CLI](https://docs.expo.dev/get-started/installation/) installed globally
- A physical device or an emulator (Android Studio or Xcode for iOS)

### Steps to Run the React Native App

1. Navigate to the Frontend directory:
   ```bash
   cd Frontend/hirely-job-finder-application
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Expo development server:
   ```bash
   npx expo start
   ```
4. Choose how to run the app:
   - Open in a **development build**
   - Open in an **Android emulator**
   - Open in an **iOS simulator**
   - Open in **Expo Go**

### Connecting the Frontend to the Backend

- Update the API base URL in the Frontend/hirely-job-finder-application/components/api.js:
  ```js
  export const API_BASE_URL = "http://localhost:4402";
  ```
  If using a mobile device, replace `localhost` with your machine's local IP.
  iOS Simulator http://localhost:4402
  Android Emulator http://10.0.2.2:4402
  Physical Device http://<your-local-IP>:4402

---

## Learn More

- [Expo Documentation](https://docs.expo.dev/)
- [Node.js Documentation](https://nodejs.org/en/docs/)
- [MongoDB Documentation](https://www.mongodb.com/docs/)

## Community & Support

- [Expo GitHub](https://github.com/expo/expo)
- [Discord Community](https://chat.expo.dev)
