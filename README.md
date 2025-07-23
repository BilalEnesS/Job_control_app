# Job Application Tracker App

This project was developed to help me keep track of the many job applications I have recently made, all in one place. It automatically fetches your job applications from your Gmail account, saves them to a database, and displays them in a modern interface.

## Features
- **Gmail integration:** Scans your Gmail account every 15 minutes and automatically adds new job applications.
- **PostgreSQL database:** Your applications are stored securely.
- **Modern UI:** React-based, easy to use, and responsive interface.

## Setup

### 1. Server (Backend) Setup

#### Requirements
- Node.js (v18+ recommended)
- PostgreSQL

#### Steps
1. Create a `.env` file in the `server` folder and fill in the following variables:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/database_name
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxx
GOOGLE_REDIRECT_URI=http://localhost
GOOGLE_REFRESH_TOKEN=xxx
PORT=3001
```

- `DATABASE_URL`: Your PostgreSQL connection string.
- To get Google API credentials, create an OAuth2 client via [Google Cloud Console](https://console.cloud.google.com/) and enable the Gmail API.
- To obtain the `GOOGLE_REFRESH_TOKEN`, run `server/get_token.js` and follow the instructions.

2. Install the required packages:
```bash
cd server
npm install pg express dotenv googleapis
```

3. Start the server:
```bash
node index.js
```

### 2. Client (Frontend) Setup

1. Install the required packages:
```bash
cd client
npm install
```

2. Start the development server:
```bash
npm run dev
```

> Thanks to the Vite proxy configuration, `/api` requests are automatically forwarded to the backend.

## Application Flow
- The server scans your Gmail account every 15 minutes and adds new applications to the database.
- The client fetches applications from the `/api/applications` endpoint and displays them.
- You can see the last and next scan times in the Navbar.

## Contribution & License
This is a personal project. Feel free to open a PR if you want to contribute. 