# 🏛️ Museum of Self: Backend API

This is the backend for **Museum of Self**, a personalized MERN-stack application where users act as "Curators" of their own life history. It handles the secure storage of life phases, memories, and deep reflections.

> **Looking for the interface?**
> Visit the [Museum of Self Frontend Repository](https://github.com/fatemamoh/Museum-of-self-Frontend) to see how these archives are displayed.

---

## ✨ Features

* **🔒 Secure Curator Access**: JWT-based authentication for registration, login, and secure password recovery.
* **📂 Life Phase Exhibits**: Organize life events into "Exhibitions" (Life Phases) with automated chronological validation.
* **🖼️ Artifact Management**: Full CRUD for "Memories," supporting Text, Image, Video, Audio, and Links via Cloudinary integration.
* **💭 Reflective Cataloging**: Add "Reflections" to specific memories to track personal growth on a 1–10 scale.
* **✉️ Automated Notifications**: Thematic email service for welcome messages and password resets via Nodemailer.
* **⚙️ Image Processing**: Automatic image resizing and optimization (800x800) using Cloudinary transformations.

---

## 🛠️ Tech Stack

* **Runtime**: Node.js 
* **Framework**: Express.js 
* **Database**: MongoDB via Mongoose 
* **Storage**: Cloudinary (Media hosting)
* **Email**: Nodemailer (Gmail integration)

---


## 📦 Setup & Installation

Follow these steps to get your curatorial vault running locally:

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/fatemamoh/Museum-of-self-Backend](https://github.com/fatemamoh/Museum-of-self-Backend)
   cd Museum-of-self-Backend

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables**
    Create a `.env` file in the root directory and add the following:
    ```env
    MONGODB_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    PORT=3000
    CLOUDINARY_URL=your_cloudinary_url
    EMAIL_USER=your_email@gmail.com
    EMAIL_PASS=your_app_specific_password
    FRONTEND_URL=http://localhost:5173
    ```

4.  **Start the server**
    ```bash
    npm start
    ```

---

## 🚀 API Routes

The museum is divided into the following wings:

| Wing | Route | Description |
| :--- | :--- | :--- |
| **Auth** | `/auth` | Public routes for signup, signin, and password resets. |
| **Users** | `/users` |Protected routes for profile and avatar management. |
| **Exhibitions** | `/lifePhases` | Management of life periods/phases. |
| **Artifacts** | `/memories` | CRUD operations for specific life memories. |
| **Reflections** | `/reflections` | Adding perspectives and growth tracking to memories. |

---

## 📜 Curatorial Rules (Data Validation)

* **Chronology**: An exhibition cannot end before it begins; `startDate` must be before `endDate`.
* **Statement Required**: A 20-character "Curator’s Statement" (summary) is required to finalize an exhibition once an end date is set.
* **Moods**: Memories can be tagged with moods like `Radiant`, `Melancholic`, `Victorious`, or `Ordinary`.
* **Security**: All user passwords are encrypted using Bcrypt with 10 salt rounds before storage.

---

