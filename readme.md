# 🚀 Writr - AI-Powered Blog Editor

A modern, full-stack blog editing platform with AI-powered summarization and grammar checking. Built with React/TypeScript frontend and Python FastAPI backend.

---

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Features](#features)
3. [Project Structure](#project-structure)
4. [Setup & Installation](#setup--installation)
5. [Running the Application](#running-the-application)
6. [API Documentation](#api-documentation)
7. [Testing Guide](#testing-guide)
8. [Production Deployment](#production-deployment)
9. [Troubleshooting](#troubleshooting)
10. [Tech Stack](#tech-stack)
11. [FAQ](#faq)

---

## 🎯 Quick Start

### Prerequisites
- Python 3.10+
- Node.js 18+
- MongoDB running locally (`127.0.0.1:27017`)
- OpenRouter API key (for AI features)

### 60-Second Setup

**Terminal 1 - Backend:**
```bash
cd backend
venv\Scripts\activate
python -m uvicorn main:app --reload
```
✅ Backend: http://127.0.0.1:8000

**Terminal 2 - Frontend:**
```bash
cd smart-editor-pro-main
npm run dev
```
✅ Frontend: http://localhost:8080

**Terminal 3 - Test (PowerShell):**
```powershell
# Test AI Summarize
$body = @{ text = "Your blog content..."; mode = "summary" } | ConvertTo-Json
Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/ai/generate" `
    -Method Post -Body $body -ContentType "application/json"
```

---

## ✨ Features

### 📝 Core Features
- ✅ **Create & Edit Posts** - Rich text editing with auto-save
- ✅ **Drafts & Publishing** - Save as draft or publish for public view
- ✅ **Search & Filter** - Find posts quickly with search functionality
- ✅ **Real-time Updates** - See changes instantly with auto-save

### 🤖 AI Features
- ✅ **AI Summarize** - Generates professional 2-3 sentence summaries
- ✅ **Grammar Fix** - Corrects grammar, spelling, and improves clarity
- ✅ **Powered by OpenRouter** - Uses reliable AI models with fallback support

### 👥 Social Features
- ✅ **Public Posts** - Browse all published posts from all users
- ✅ **Comments** - Add comments to published posts
- ✅ **Author Info** - See who wrote each post
- ✅ **Public Sidebar Tab** - Dedicated tab to explore community posts

### 🔐 Security
- ✅ **JWT Authentication** - Secure token-based auth
- ✅ **Password Hashing** - bcrypt for secure password storage
- ✅ **CORS Protection** - Properly configured CORS headers
- ✅ **Protected Routes** - Private posts only visible to author

---

## 📁 Project Structure

```
Writr/
├── backend/
│   ├── config.py              # Configuration & env variables
│   ├── main.py                # FastAPI app & routing
│   ├── requirements.txt        # Python dependencies
│   ├── db/
│   │   └── connection.py       # MongoDB connection
│   ├── models/
│   │   └── post_model.py       # Post database model
│   ├── routes/
│   │   ├── ai.py              # AI endpoints
│   │   ├── auth.py            # Authentication endpoints
│   │   ├── posts.py           # Posts endpoints
│   │   ├── comments.py        # Comments endpoints
│   │   └── users.py           # User profile endpoints
│   ├── schemas/
│   │   ├── post_schema.py      # Post validation schema
│   │   ├── comment_schema.py   # Comment validation
│   │   └── user_schema.py      # User validation
│   └── utils/
│       ├── ai_client.py        # AI API client (OpenRouter)
│       ├── auth.py             # Auth utilities
│       └── jwt_handler.py      # JWT token handling
│
├── smart-editor-pro-main/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AIPanel.tsx          # AI result panel
│   │   │   ├── BlogEditor.tsx       # Main editor
│   │   │   ├── DraftsSidebar.tsx    # Posts sidebar
│   │   │   ├── EditorToolbar.tsx    # Editor toolbar
│   │   │   ├── NavLink.tsx          # Navigation
│   │   │   ├── ProtectedRoute.tsx   # Auth guard
│   │   │   └── SaveStatusIndicator.tsx  # Save status
│   │   ├── hooks/
│   │   │   ├── useAI.ts        # AI feature hook
│   │   │   ├── useAutoSave.ts  # Auto-save hook
│   │   │   └── useDebounce.ts  # Debounce hook
│   │   ├── pages/
│   │   │   ├── Auth.tsx               # Login/Signup
│   │   │   ├── Index.tsx              # Editor page
│   │   │   ├── Landing.tsx            # Landing page
│   │   │   ├── PublishedPosts.tsx     # Public posts view
│   │   │   └── PostReader.tsx         # Single post view
│   │   ├── store/
│   │   │   └── blogStore.ts    # Zustand store
│   │   ├── services/
│   │   │   └── api.ts          # API client
│   │   └── App.tsx
│   ├── package.json
│   └── vite.config.ts
│
├── API_TESTING_GUIDE.md   # Detailed API/Feature tests
└── readme.md             # This file
```

---

## 🔧 Setup & Installation

### Backend Setup

1. **Navigate to backend:**
   ```bash
   cd backend
   ```

2. **Create virtual environment (if not exists):**
   ```bash
   python -m venv venv
   venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   pip install aiohttp  # Additional async HTTP client
   ```

4. **Create `.env` file:**
   ```env
   # OpenRouter API Configuration
   OPENROUTER_API_KEY=sk-or-v1-your-key-here
   
   # MongoDB Configuration
   MONGO_URL=mongodb://127.0.0.1:27017/SyncDraft
   
   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   ```

5. **Ensure MongoDB is running:**
   ```bash
   mongod  # Or use MongoDB from Services
   ```

### Frontend Setup

1. **Navigate to frontend:**
   ```bash
   cd smart-editor-pro-main
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Verify configuration:**
   - Backend URL in `src/services/api.ts` should be `http://127.0.0.1:8000`

---

## 🚀 Running the Application

### Method 1: Multiple Terminals (Recommended)

**Terminal 1 - Backend:**
```bash
cd backend
venv\Scripts\activate
python -m uvicorn main:app --reload
```
Output: `Uvicorn running on http://127.0.0.1:8000`

**Terminal 2 - Frontend:**
```bash
cd smart-editor-pro-main
npm run dev
```
Output: `VITE v5.0.0  ready in XXX ms → Local: http://localhost:8080`

**Terminal 3 - Monitor logs (Optional):**
```bash
# Check backend health
curl http://127.0.0.1:8000/health

# Or use PowerShell:
Invoke-RestMethod -Uri "http://127.0.0.1:8000/health" -Method Get
```

### Method 2: Using npm scripts

From `smart-editor-pro-main`:
```bash
npm run build    # Build for production
npm run preview  # Preview production build
npm run test     # Run tests
```

---

## 📚 API Documentation

### Authentication Endpoints

#### **POST** `/auth/signup`
Register a new user
```json
{
  "full_name": "John Doe",
  "email": "john@example.com",
  "password": "secure_password"
}
```
Response: `{"access_token": "...", "refresh_token": "..."}`

#### **POST** `/auth/login`
Log in existing user
```json
{
  "email": "john@example.com",
  "password": "secure_password"
}
```

### Posts Endpoints

#### **GET** `/api/posts/`
Get all your posts (requires auth)

#### **POST** `/api/posts/`
Create new post
```json
{
  "title": "My Blog Post",
  "content": "Post content here..."
}
```

#### **PATCH** `/api/posts/{id}`
Update post
```json
{
  "title": "Updated Title",
  "content": "Updated content..."
}
```

#### **POST** `/api/posts/{id}/publish`
Publish a post (make public)

#### **POST** `/api/posts/{id}/unpublish`
Unpublish a post (make private)

#### **DELETE** `/api/posts/{id}`
Delete a post

#### **GET** `/api/public/posts`
Get all published posts (public)

#### **GET** `/api/public/posts/{id}`
Get single published post

### AI Endpoints

#### **POST** `/api/ai/generate`
Generate AI content (summary or grammar fix)
```json
{
  "text": "Your blog content to process...",
  "mode": "summary"  // or "grammar"
}
```

Response:
```json
{
  "result": "AI-generated summary or corrected text..."
}
```

**Parameters:**
- `text` (string, required): Content to process
- `mode` (string, required): Either `"summary"` or `"grammar"`

**Options:**
- `summary`: 2-3 sentence professional summary
- `grammar`: Grammar-corrected version with improved clarity

### Comments Endpoints

#### **POST** `/api/posts/{post_id}/comments`
Add comment to post
```json
{
  "body": "Great post!"
}
```

#### **GET** `/api/public/posts/{post_id}/comments`
Get comments for post

#### **DELETE** `/api/posts/{post_id}/comments/{comment_id}`
Delete your comment

---

## 🧪 Testing Guide

### Quick Test Flow

1. **Open Application**
   - Navigate to `http://localhost:8080`

2. **Create Account**
   - Click "Sign Up"
   - Fill: Full Name, Email, Password
   - Click "Sign Up"

3. **Create Post**
   - Sidebar: Click "New Post"
   - Enter title
   - Write content (at least 50 words)

4. **Test AI Summarize**
   - Click **✨ AI** button
   - Click **"Summarize"**
   - Wait for AI response
   - ✅ Should see summary in panel

5. **Test AI Grammar Fix**
   - Click **✨ AI** button
   - Click **"Fix Grammar"**
   - Wait for correction
   - ✅ Should see corrected text

6. **Test Publish**
   - Click **Publish** button
   - Status changes to "Published"
   - Close sidebar, click "Public" tab
   - ✅ Your post appears there

7. **Test Public Posts**
   - Sidebar: Click "Public" tab
   - Browse other published posts
   - Search for posts

### PowerShell API Tests

**Test Health Check:**
```powershell
Invoke-RestMethod -Uri "http://127.0.0.1:8000/health" -Method Get
# Response: {"status": "healthy"}
```

**Test AI Summary:**
```powershell
$body = @{
    text = "Machine learning is transforming industries with AI-powered solutions. Companies use ML for predictive analytics, recommendation systems, and automation."
    mode = "summary"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/ai/generate" `
    -Method Post `
    -Body $body `
    -ContentType "application/json"
```

**Test AI Grammar:**
```powershell
$body = @{
    text = "He are going to the store. The weather is very nicely today."
    mode = "grammar"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/ai/generate" `
    -Method Post `
    -Body $body `
    -ContentType "application/json"
```

**Test Signup:**
```powershell
$body = @{
    full_name = "Test User"
    email = "test@example.com"
    password = "password123"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://127.0.0.1:8000/auth/signup" `
    -Method Post `
    -Body $body `
    -ContentType "application/json"
```

### Browser DevTools Testing

1. **Open DevTools:** Press `F12`
2. **Network Tab:** Click "Network" tab
3. **Perform Action:** Click "Summarize" in app
4. **Monitor:** Watch for `ai/generate` request
5. **Check Response:** Should be `200` with result

---
## 🚀 Production Deployment

### ⚡ Quick Deploy to Render + Vercel (5-10 minutes)

This is the recommended way to deploy Writr to production.

#### Backend Deployment to Render

**Step 1: Prepare Backend Repository**

```bash
# From project root, backend is already ready
# Just make sure these files exist:
# - backend/Dockerfile
# - backend/requirements.txt
# - backend/.env (with your secrets)
```

**Step 2: Deploy to Render**

1. Go to [render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository (or paste public repo URL)
4. Fill in the form:
   - **Name**: `writr-backend`
   - **Environment**: `Docker`
   - **Branch**: `main`
   - **Build Command**: (auto-detected)
   - **Start Command**: (auto-detected)
5. Add Environment Variables (click "Add Environment Variable"):
   ```
   MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/syncdraft
   JWT_SECRET=<generate_with: openssl rand -hex 32>
   OPENROUTER_API_KEY=<your_api_key>
   ALLOWED_ORIGINS=https://<YOUR_FRONTEND_VERCEL_URL>,https://<YOUR_DOMAIN>
   ENVIRONMENT=production
   ```
6. Click "Deploy"
7. Wait for build to complete (~3-5 minutes)
8. Note the URL: `https://YOUR_BACKEND_SERVICE.onrender.com`

**Verify Backend:**
```bash
curl https://YOUR_BACKEND_SERVICE.onrender.com/health
# Should return: {"status": "healthy"}
```

#### Frontend Deployment to Vercel

**Step 1: Prepare Frontend**

```bash
cd smart-editor-pro-main

# Create .env.production
echo "VITE_API_URL=https://YOUR_BACKEND_SERVICE.onrender.com" > .env.production

# Build locally to test
npm run build
# Should complete without errors
```

**Step 2: Deploy to Vercel**

**Option A: Using Vercel CLI**
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod

# Follow prompts:
# - Link to existing project? No
# - Project name: writr
# - Framework: Vite
# - Output directory: dist
# - Ignore build command? No
```

**Option B: Using Vercel Dashboard**

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New..." → "Project"
3. Import Git repository (or upload manually)
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `smart-editor-pro-main`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add Environment Variables:
   ```
   VITE_API_URL=https://YOUR_BACKEND_SERVICE.onrender.com
   ```
6. Click "Deploy"
7. Wait for deployment (~2 minutes)
8. Get your Frontend URL: `https://YOUR_PROJECT.vercel.app`

**Step 3: Update Backend CORS**

Go back to Render dashboard:
1. Select your backend service
2. Go to "Environment"
3. Update `ALLOWED_ORIGINS`:
   ```
   https://YOUR_PROJECT.vercel.app,https://yourdomain.com
   ```
4. Click "Save"
5. Service will redeploy automatically

#### Verify Full Deployment

```bash
# Test backend
curl https://YOUR_BACKEND_SERVICE.onrender.com/health

# Test frontend (should load without errors)
# Visit: https://YOUR_PROJECT.vercel.app

# Login and test all features:
# 1. Sign up
# 2. Create post
# 3. Click "Summarize" (AI)
# 4. Publish post
# 5. View public posts
```

---

### 🐳 Alternative: Docker Deployment (Local/Self-Hosted)

If you prefer to deploy yourself or use Docker:

**Step 1: Build Docker Images**

```bash
# From root directory
docker-compose build
```

**Step 2: Set Environment Variables**

Create `.env` in root:
```env
MONGO_USERNAME=syncdraft_admin
MONGO_PASSWORD=your_strong_password_here
JWT_SECRET=<generate_with: openssl rand -hex 32>
OPENROUTER_API_KEY=your_api_key
ALLOWED_ORIGINS=https://yourdomain.com
VITE_API_URL=https://api.yourdomain.com
```

**Step 3: Run Containers**

```bash
# Start all services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Stop services
docker-compose down
```

---

### Environment Variables Summary

| Variable | Backend | Frontend | Purpose |
|----------|---------|----------|---------|
| `MONGO_URL` | ✅ | | MongoDB connection string (local or Atlas) |
| `JWT_SECRET` | ✅ | | Secret key for JWT tokens (min 32 chars) |
| `OPENROUTER_API_KEY` | ✅ | | API key for AI features |
| `ALLOWED_ORIGINS` | ✅ | | CORS domains (comma-separated) |
| `VITE_API_URL` | | ✅ | Backend API URL for frontend |
| `ENVIRONMENT` | ✅ | | Either `production` or `development` |

**Generate a Strong JWT Secret:**
```bash
# Mac/Linux
openssl rand -hex 32

# Windows PowerShell
$([Convert]::ToBase64String((Get-Random -Count 32 -InputObject (0..255))))
```

---
## ❌ Troubleshooting

### Backend Errors

#### Error: `ModuleNotFoundError: No module named 'aiohttp'`
**Solution:**
```bash
cd backend
venv\Scripts\activate
pip install aiohttp
```

#### Error: `ConnectionRefusedError` for MongoDB
**Solution:** Start MongoDB
```bash
mongod  # Windows/Linux
# Or check if MongoDB Service is running in Windows Services
```

#### Error: `401 Unauthorized`
**Solution:** Token expired
- Log out and log back in
- Or clear localStorage in browser DevTools

### Frontend Errors

#### Error: `API Error: 500`
**Solution:** Check backend console for errors
- Backend might have crashed
- Check OpenRouter API key validity

#### AI Feature Returns Error
**Solutions:**
- Verify `OPENROUTER_API_KEY` in `backend/.env`
- Check network tab in DevTools (F12)
- Ensure backend is running (`http://127.0.0.1:8000/health`)
- Try again (API might be rate-limited)

#### CORS Error
**Solution:** Already configured in backend
- Verify `main.py` has CORS middleware
- Clear browser cache and reload

### API Issues

#### 404 Not Found
- Check if URL is correct
- Backend might not be running
- Verify port is 8000

#### Slow Response from AI
- OpenRouter API might be busy
- Normal: 5-15 seconds for response
- Check internet connection

---

## 🛠 Tech Stack

### Frontend
- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite
- **State Management:** Zustand
- **Styling:** Tailwind CSS
- **UI Components:** ShadCN UI
- **Rich Editor:** Lexical Editor
- **Icons:** Lucide React
- **HTTP Client:** Axios
- **Date Handling:** date-fns

### Backend
- **Framework:** FastAPI (Python)
- **Server:** Uvicorn
- **Database:** MongoDB with Motor (async driver)
- **Authentication:** JWT with python-jose
- **Validation:** Pydantic
- **Password:** bcrypt
- **AI Client:** OpenRouter API with aiohttp
- **Environment:** python-dotenv

### Infrastructure
- **Database:** MongoDB 5.0+
- **AI Provider:** OpenRouter.ai
- **Deployment Ready:** Can be containerized with Docker

---

## 📊 Environment Variables

### Backend `.env`
```env
# AI Service
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxx

# Database
MONGO_URL=mongodb://127.0.0.1:27017/SyncDraft

# Security
JWT_SECRET=your-secret-key-here-change-in-production
```

### Frontend Configuration
- API Base URL: `http://127.0.0.1:8000` (in `src/services/api.ts`)
- Dev Server: `http://localhost:8080` (or `5173` with Vite)

---

## 🎓 How AI Features Work

### AI Summarize Flow
1. User writes content in post
2. User clicks "Summarize" button
3. Frontend sends content to backend `/api/ai/generate` endpoint
4. Backend calls OpenRouter API with prompt
5. OpenRouter returns 2-3 sentence professional summary
6. Frontend streams result token-by-token to user
7. User sees summary appear word by word

### AI Grammar Fix Flow
1. Similar flow but with `mode: "grammar"`
2. Backend requests grammar correction and clarity improvement
3. OpenRouter returns corrected version
4. Frontend displays corrected text
5. User can copy and use corrected version

---

## 📞 FAQ

### Deployment

**Q: Which deployment option should I choose?**
A: 
- **Render + Vercel**: ⭐ Easiest & fastest (recommended)
- **Docker**: Best control, can deploy anywhere
- **Traditional Server**: For custom infrastructure

**Q: How much will it cost?**
A:
- **Render**: $7-12/month for free tier with paid options
- **Vercel**: Free tier available, scales on usage
- **MongoDB Atlas**: Free tier (512MB storage, good for starting)

**Q: How do I add a custom domain?**
A:
- **Vercel**: Dashboard → Domains → Add custom domain
- **Render**: Dashboard → Custom Domain
Follow DNS setup instructions provided

**Q: Can I use SQLite instead of MongoDB?**
A: Yes, but requires code changes in `backend/db/connection.py` and models

### Features

**Q: Why is AI feature slow?**
A: OpenRouter API response time is 5-15 seconds (normal for free/shared models)

**Q: Can I use ChatGPT, Claude, or other AI?**
A: Yes! Modify `backend/utils/ai_client.py` to use any provider

**Q: Can I disable AI features?**
A: Yes, remove routes from `backend/routes/ai.py` or return dummy responses

### Development

**Q: How do I add new features?**
A:
1. Backend: Add endpoint in `backend/routes/`
2. Frontend: Add component/page in `smart-editor-pro-main/src/`
3. Database: Update models if needed

**Q: How do I contribute?**
A: Feel free to fork, make changes, and submit pull requests!

**Q: Can I modify the code?**
A: Yes! This project is open source (MIT License)

---

## 📄 License

This project is open source and available under the MIT License.

---

## ✅ Quick Checklist

### Local Development
- [ ] Backend running on `http://127.0.0.1:8000`
- [ ] Frontend running on `http://localhost:8081`
- [ ] MongoDB running
- [ ] OpenRouter API key configured
- [ ] Can sign up and log in
- [ ] Can create and edit posts
- [ ] Can use AI Summarize
- [ ] Can use AI Grammar Fix
- [ ] Can publish posts
- [ ] Can view public posts

### Before Deployment
- [ ] Rename/update app branding if needed
- [ ] Configure production database (MongoDB Atlas)
- [ ] Generate strong JWT_SECRET
- [ ] Have OpenRouter API key
- [ ] Test locally with npm run build
- [ ] Decide on deployment platform (Render + Vercel)

### After Deployment
- [ ] Verify backend health endpoint
- [ ] Test frontend loads without errors
- [ ] Sign up with test account
- [ ] Test AI features
- [ ] Publish a test post
- [ ] View public posts
- [ ] Share with friends!

---

## 🎉 Ready to Launch!

You have everything needed for a production-grade blog editor platform with AI features.

**Deploy now and start blogging! ✨**

### Next Steps

1. **For Render + Vercel Deployment**: Follow steps in [Production Deployment](#production-deployment) section
2. **For Questions**: Check [FAQ](#faq) section
3. **For Issues**: Check [Troubleshooting](#troubleshooting) section
4. **For Development**: Modify code in `backend/` and `smart-editor-pro-main/`

---

**Happy blogging! 🚀**
