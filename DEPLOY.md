# Free Deployment Instructions

This guide provides instructions for deploying your Cifras Club Clone application for free using popular platforms.

## 1. Frontend Deployment (Next.js - `web` directory)

We recommend using **Vercel** for the Next.js frontend due to its seamless integration and generous free tier.

**Steps:**

1.  **Create a Vercel Account:** If you don't have one, sign up at [vercel.com](https://vercel.com/). You can sign up with your GitHub account for easy integration.
2.  **Import Your Project:**
    *   Go to your Vercel Dashboard.
    *   Click "Add New..." -> "Project".
    *   Select your Git provider (e.g., GitHub) and connect the repository containing your `cifras-club-clone` project.
3.  **Configure Project:**
    *   When importing, Vercel will automatically detect your Next.js project.
    *   For the "Root Directory", make sure it points to the `web` folder within your repository (e.g., if your repo is `cifras-club-clone`, set the root directory to `web`).
    *   **Environment Variables:** You will need to set the `NEXT_PUBLIC_API_URL` environment variable. This should point to the URL of your deployed backend API (which you will get after deploying your backend).
        *   Go to "Settings" -> "Environment Variables" for your project in Vercel.
        *   Add a new variable:
            *   Name: `NEXT_PUBLIC_API_URL`
            *   Value: `YOUR_DEPLOYED_BACKEND_API_URL` (e.g., `https://your-api-name.onrender.com/api`)
4.  **Deploy:** Click "Deploy". Vercel will build and deploy your frontend application.

## 2. Backend Deployment (Node.js API with Prisma - `api` directory)

We recommend using **Render** for the Node.js API and PostgreSQL database, as it offers both services within its free tier.

**Steps:**

1.  **Create a Render Account:** If you don't have one, sign up at [render.com](https://render.com/). You can sign up with your GitHub account.
2.  **Create a PostgreSQL Database:**
    *   Go to your Render Dashboard.
    *   Click "New" -> "PostgreSQL".
    *   Choose a name for your database and select a region.
    *   Click "Create Database". Render will provide you with a `DATABASE_URL`. Copy this URL.
3.  **Create a Web Service for Your API:**
    *   Go to your Render Dashboard.
    *   Click "New" -> "Web Service".
    *   Connect your GitHub repository containing your `cifras-club-clone` project.
    *   For the "Root Directory", make sure it points to the `api` folder within your repository (e.g., `api`).
    *   **Environment:** Node.js
    *   **Build Command:**
        ```bash
        npm install && npx prisma migrate deploy
        ```
        *This command installs dependencies and applies your Prisma database migrations.*
    *   **Start Command:**
        ```bash
        npm start
        ```
    *   **Environment Variables:**
        *   Add the `DATABASE_URL` you copied from your Render PostgreSQL database.
        *   Add any other environment variables your API needs (e.g., `JWT_SECRET`, `PORT` - Render usually sets `PORT` automatically, but you can specify it if your app expects a specific one).
            *   Name: `JWT_SECRET`
            *   Value: `A_STRONG_RANDOM_SECRET_STRING` (Generate a long, random string)
    *   **Connect to Database:** In the "Environment" section of your Web Service settings, ensure the `DATABASE_URL` is correctly linked to your PostgreSQL database.
4.  **Deploy:** Click "Create Web Service". Render will build and deploy your API.

## Important Notes:

*   **Environment Variables:** Always use environment variables for sensitive information (database URLs, API keys, secrets). Never hardcode them in your code.
*   **Prisma Migrations:** The `npx prisma migrate deploy` command is crucial for applying your database schema changes to the deployed database. Ensure it runs successfully during your backend's build process.
*   **Free Tier Limits:** Be aware of the free tier limitations of Vercel and Render (e.g., build minutes, bandwidth, database size, idle time). For small projects, these tiers are usually sufficient.
*   **API URL Update:** Once your backend API is deployed on Render, copy its URL and update the `NEXT_PUBLIC_API_URL` environment variable in your Vercel frontend project. Then, redeploy your frontend on Vercel for the changes to take effect.
