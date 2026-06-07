# GitHub Repo Explorer

## Brief Description

GitHub Repo Explorer is a full-stack web application that allows users to search for public GitHub profiles and browse their repositories. The application uses a React frontend and a Node.js/Express backend. The backend acts as a proxy between the client and GitHub APIs, providing caching, rate limiting, centralized error handling, and a cleaner API layer.

---

## Live Demo Links

Frontend:
https://git-expo-taupe.vercel.app/

Backend:
https://git-expo.onrender.com/

---

## Tech Stack

### Frontend

- React
  - Component-based UI development
  - State management using React Hooks

- Axios
  - API communication with backend

- CSS
  - Custom styling using GitHub-inspired dark theme

### Backend

- Node.js
  - JavaScript runtime

- Express.js
  - REST API framework

- Axios
  - Communication with GitHub REST API

- Node Cache
  - In-memory caching for GitHub responses

- Express Rate Limit
  - Prevents excessive API requests

- Morgan
  - HTTP request logging

- CORS
  - Cross-origin communication between frontend and backend

### External API

- GitHub REST API

---

## Features

### User Search

- Search any public GitHub user

### Profile Information

Displays:

- Avatar
- Name
- Bio
- Followers
- Following
- Public Repository Count

### Repository Explorer

Displays:

- Repository Name
- Description
- Primary Language
- Star Count
- Last Updated Date
- view repositories link

### Repository Sorting

Sort repositories by:

- Stars
- Repository Name
- Last Updated

### Pagination

- Loads repositories in pages of 30
- Load More functionality

### Recently Searched Users

- Stores last 5 searches in local storage

### Backend Caching

- Cache-Aside Pattern
- 60-second cache TTL
- Reduces GitHub API calls

### Rate Limiting

Protects backend from excessive requests.

### Error Handling

Handles:

- Invalid users
- GitHub rate limits
- Network failures

---
# Environment Variables

## Backend

Create a `.env` file inside the backend directory:

```env
PORT=5000
FRONTEND_URL=http://localhost:5173
GITHUB_TOKEN=your_github_personal_access_token
```

### Variables

| Variable     | Description                                                      |
| ------------ | ---------------------------------------------------------------- |
| PORT         | Backend server port                                              |
| FRONTEND_URL | Allowed frontend origin for CORS                                 |
| GITHUB_TOKEN | GitHub Personal Access Token used for authenticated API requests |

---

## Frontend

Create a `.env` file inside the frontend directory:

```env
VITE_API_URL=http://localhost:5000/api/github
```

### Variables

| Variable     | Description          |
| ------------ | -------------------- |
| VITE_API_URL | Backend API base URL |

# How to Run Locally

## Clone Repository

```bash
git clone <repository-url>

cd Git_expo
```

## Backend Setup

### 1. Generate a GitHub Personal Access Token

Go to:

```text
GitHub Settings
→ Developer Settings
→ Personal Access Tokens
→ Tokens (Classic)
→ Generate New Token
```

No additional scopes are required for public repository access.

---

### 2. Create Environment Variables

Create a `.env` file inside the `backend` directory:

```env
PORT=5000
FRONTEND_URL=http://localhost:5173
GITHUB_TOKEN=your_github_personal_access_token
```

---

### 3. Install Dependencies

```bash
cd backend

npm install
```

---

### 4. Start Backend Server

```bash
node src/app.js
```

Backend runs at:

```text
http://localhost:5000
```

## Frontend Setup

Open a new terminal:

```bash
cd frontend

npm install

npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

# API Documentation

## Search GitHub User 

### Endpoint

```http
GET /api/github/:username
```

### Example

```http
GET /api/github/mvanhorn
```

### Success Response

```json
{
  "success": true,
  "data": {
    "profile": {},
    "repositories": [],
    "page": ,
    "hasmore": true/false
  }
}
```

---

## Search GitHub User With Pagination

### Endpoint

```http
GET /api/github/:username?page=1&per_page=30
```

### Example

```http
GET /api/github/mvanhorns?page=1&per_page=30
```

### Success Response

```json
{
  "success": true,
  "data": {
    "profile": {
      "login": "mvanhorn",
      "name": "Matt Van Horn",
      "avatarUrl": "https://avatars.githubusercontent.com/u/455140?v=4",
      "bio": "Co-founded June (\"self-driving oven\" acquired by @webergrills) & the co that became @Lyft. Building again, more soon. OS: @slashlast30days 27k★ @ppressdev 4.2k★",
      "followers": 2273,
      "following": 5,
      "publicRepos": 1228
    },
    "repositories": [],
    "page": 1,
    "hasMore": true
  }
}
```

---

## Error Response

```json
{
  "success": false,
  "message": "User not found"
}
```

Possible errors:

- User not found
- GitHub rate limit exceeded
- Failed to fetch GitHub data

---

# Cache Design

## Strategy

Cache-Aside Pattern

### Cache Key

```text
github:{username}:{page}:{perPage}
```

### Example

```text
github:mvanhorn:1:30
```

### Cache Duration

```text
60 seconds
```

### Flow

```text
Request
   |
Check Cache
   |
Hit?
 /   \
Yes   No
 |     |
Return Call GitHub API
       |
   Store Cache
       |
     Return
```

---

# Project Structure

```text
Github_expo
│
├── backend
│   │
│   ├── src
│   │   ├── cache
│   │   │   └── memoryCache.js
│   │   │
│   │   ├── controllers
│   │   │   └── github.controller.js
│   │   │
│   │   ├── routes
│   │   │   └── github.routes.js
│   │   │
│   │   ├── services
│   │   │   └── github.service.js
│   │   │
│   │   └── app.js
│   │
│   ├── package.json
│   └── package-lock.json
│
├── frontend
│   │
│   ├── src
│   │   ├── api
│   │   ├── components
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   │
│   └── package.json
│
└── README.md
```

---

# Engineering Decisions

## Why Backend Proxy Instead of Direct GitHub Calls?

Using a backend proxy:

- Hides implementation details
- Allows caching
- Supports rate limiting
- Centralizes error handling
- Makes future enhancements easier

## Why Cache-Aside Pattern?

- Simple to implement
- Reduces GitHub API calls
- Improves response times

## Why 60-Second Cache TTL?

Balances:

- Freshness of GitHub data
- Reduced API traffic

## Why Layered Architecture?

```text
Routes
 ↓
Controllers
 ↓
Services
 ↓
External APIs
```

Benefits:

- Better maintainability
- Easier testing
- Clear separation of concerns

---

# Next Steps

The following enhancements were intentionally left for future iterations:

- Redis distributed caching
- GitHub OAuth authentication
- Search history database
- Infinite scrolling
- Repository language statistics
- Advanced filtering
- Unit and integration testing
- Docker support
- CI/CD pipeline
- Production deployment
