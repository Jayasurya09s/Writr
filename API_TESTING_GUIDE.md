# Writr - API Testing Guide

## 🎯 Quick Start Guide for AI Features

### Step 1: Start the Backend
```bash
cd backend
venv\Scripts\activate
python -m uvicorn main:app --reload
```
✅ Backend running at: http://127.0.0.1:8000

### Step 2: Start the Frontend
```bash
cd smart-editor-pro-main
npm run dev
```
✅ Frontend running at: http://localhost:8080 (or http://localhost:5173)

### Step 3: Test the AI Feature
1. Open http://localhost:8080 in your browser
2. Log in or create a new account
3. Create a new post and write some content
4. Click the **✨ AI** button in the toolbar
5. Click **"Summarize"** or **"Fix Grammar"**
6. ✅ You should see the AI response appear in the panel!

---

### 🧪 Testing with PowerShell (Manual API Test)

#### Test AI Summary:
```powershell
$body = @{
    text = "This is a comprehensive guide about machine learning. It covers neural networks, deep learning, and practical applications. The author explains complex concepts in simple terms with real-world examples. Readers will learn the fundamentals and how to apply them."
    mode = "summary"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/ai/generate" `
    -Method Post `
    -Body $body `
    -ContentType "application/json"
```

**Expected Response:**
```json
{
  "result": "A professional summary of your content"
}
```

#### Test AI Grammar Fix:
```powershell
$body = @{
    text = "He are going to the store. The weather is very nicely today. I has three apple."
    mode = "grammar"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/ai/generate" `
    -Method Post `
    -Body $body `
    -ContentType "application/json"
```

**Expected Response:**
```json
{
  "result": "He is going to the store. The weather is very nice today. I have three apples."
}
```

---

## �🚀 Server Status

### Backend API
- **URL**: http://127.0.0.1:8000
- **Status**: ✅ Running
- **Health Check**: http://127.0.0.1:8000/health

### Frontend Application
- **URL**: http://localhost:8080
- **Status**: ✅ Running

---

## 🧪 Testing Steps

### 1. **Authentication Testing**

#### Sign Up (Register New User)
1. Open http://localhost:8080
2. Click on "Sign Up" or navigate to `/auth`
3. Fill in:
   - Full Name: `Test User`
   - Email: `test@example.com`
   - Password: `password123`
4. Click "Sign Up"
5. ✅ Should automatically log you in and redirect to editor

**API Call**: `POST /auth/signup`
```json
{
  "full_name": "Test User",
  "email": "test@example.com",
  "password": "password123"
}
```

#### Login (Existing User)
1. Navigate to `/auth`
2. Enter email and password
3. Click "Login"
4. ✅ Should redirect to editor with your posts

**API Call**: `POST /auth/login`

---

### 2. **Posts/Drafts Testing**

#### Create New Post
1. Once logged in, click "New Post" button
2. ✅ Should create a new untitled draft

**API Call**: `POST /api/posts/`

#### Edit Post
1. Type in the editor
2. Change the title
3. ✅ Should auto-save (watch "Saved" indicator)

**API Call**: `PATCH /api/posts/{id}`

#### View All Posts
1. Open sidebar (left panel)
2. ✅ Should see all your drafts listed

**API Call**: `GET /api/posts/`

#### Publish Post
1. Click "Publish" button on a post
2. ✅ Status should change to "Published"

**API Call**: `POST /api/posts/{id}/publish`

#### Delete Post
1. Click delete/trash icon on a post
2. Confirm deletion
3. ✅ Post should be removed from list

**API Call**: `DELETE /api/posts/{id}`

---

### 3. **Public Posts Testing**

#### View Published Posts
1. Navigate to `/posts` (public posts page)
2. ✅ Should see all published posts from all users

**API Call**: `GET /api/public/posts`

#### Read Single Post
1. Click on any published post
2. ✅ Should show full post content with comments

**API Call**: `GET /api/public/posts/{id}`

---

### 4. **Comments Testing**

#### Add Comment (Requires Login)
1. Navigate to a published post
2. Scroll to comments section
3. Type a comment
4. Click "Post Comment"
5. ✅ Comment should appear immediately

**API Call**: `POST /api/posts/{post_id}/comments`

#### View Comments (Public)
1. View any published post
2. ✅ Should see all comments below

**API Call**: `GET /api/public/posts/{post_id}/comments`

#### Delete Comment (Author Only)
1. Find your own comment
2. Click delete icon
3. ✅ Comment should be removed

**API Call**: `DELETE /api/posts/{post_id}/comments/{comment_id}`

---

### 5. **AI Features Testing** ✨

#### AI Summarize Blog Post
1. Open a post in the editor
2. Write some content in the post
3. Click the AI panel button (✨ Sparkles icon)
4. Click "Summarize" button
5. ✅ Should display a professional summary of your content

**Features:**
- Generates concise 2-3 sentence summaries
- Focuses on main points and key takeaways
- Uses OpenRouter AI API

**API Call**: `POST /api/ai/generate`
```json
{
  "text": "Your blog post content here...",
  "mode": "summary"
}
```

**Response:**
```json
{
  "result": "A thoughtful examination of the subject matter, this post delivers actionable insights wrapped in engaging prose. The central thesis is supported by concrete examples and logical progression, leaving readers with a clear takeaway and motivation to learn more."
}
```

#### AI Fix Grammar
1. Open a post in the editor
2. Write some content (with or without grammar errors)
3. Click the AI panel button (✨ Sparkles icon)
4. Click "Fix Grammar" button
5. ✅ Should display the corrected version of your content

**Features:**
- Fixes grammar and spelling errors
- Improves sentence clarity and flow
- Converts passive to active voice where appropriate
- Maintains your original tone and intent

**API Call**: `POST /api/ai/generate`
```json
{
  "text": "Your blog post with potential errors here...",
  "mode": "grammar"
}
```

**Response:**
```json
{
  "result": "Your blog post with corrected grammar and improved clarity here..."
}
```

#### Troubleshooting AI Features
- ✅ **AI returns data**: Working properly, powered by OpenRouter
- ❌ **Error message**: Check that OpenRouter API key is valid in `.env` file
- ❌ **Network error**: Ensure backend is running (`http://127.0.0.1:8000/health`)
- ❌ **Slow response**: OpenRouter API might be busy, try again in a moment
- ❌ **Empty content**: Make sure to write content in the post before using AI features
- ❌ **"No result from AI API"**: Backend received empty response; check OpenRouter API status

---

## 📚 New Feature: Public Posts Sidebar

You can now view all published posts in the sidebar!

### How to Use:
1. Open the sidebar (if closed, click the sidebar toggle)
2. Click the **"Public"** tab (globe icon)
3. ✅ See all published posts from all users
4. Click any post to view author and date
5. Search through public posts using the search bar

### My Posts vs Public:
- **My Posts Tab**: Your drafts and published posts (with edit/delete options)
- **Public Tab**: All published posts from all users (read-only, shows author info)

---

---

### 6. **User Profile Testing**

#### View Profile
1. Click on user icon/profile
2. ✅ Should show your profile info

**API Call**: `GET /users/profile`

#### Update Profile
1. Edit your name or bio
2. Save changes
3. ✅ Should update successfully

**API Call**: `PATCH /users/profile`

---

## 🔍 Testing with Browser DevTools

### Open Developer Console
- Press `F12` or `Ctrl+Shift+I` (Windows)
- Go to "Network" tab
- Filter by "Fetch/XHR"

### Monitor API Calls
1. Perform any action in the app
2. Watch Network tab for API requests
3. Check:
   - ✅ Status: 200 (success), 201 (created)
   - ❌ Status: 400 (bad request), 401 (unauthorized), 404 (not found)

### Check Console for Errors
- Go to "Console" tab
- Look for any red error messages
- All operations should complete without errors

---

## 🧰 Manual API Testing (curl/PowerShell)

### Test Backend Health
```powershell
Invoke-RestMethod -Uri "http://127.0.0.1:8000/health" -Method Get
```

### Test Root Endpoint
```powershell
Invoke-RestMethod -Uri "http://127.0.0.1:8000/" -Method Get
```

### Test Signup (replace with your data)
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

---

## ✅ Expected Results

### All Tests Should:
1. ✅ No console errors
2. ✅ API calls return 200/201 status
3. ✅ Data saves and loads correctly
4. ✅ Authentication works (login/signup)
5. ✅ Auto-save works when typing
6. ✅ Published posts appear on public page
7. ✅ Comments can be added and deleted
8. ✅ AI features generate content

### Common Issues & Solutions

#### ❌ CORS Errors
- **Solution**: Backend has CORS enabled for all origins, should not happen

#### ❌ 401 Unauthorized
- **Solution**: Token expired, log out and log back in

#### ❌ 404 Not Found
- **Solution**: Check if backend is running on http://127.0.0.1:8000

#### ❌ Network Error
- **Solution**: Ensure both servers are running

---

## 📊 Database (MongoDB)

### Check if MongoDB is Running
The app requires MongoDB to be running. Make sure MongoDB is installed and running on your system.

### View Data
You can use MongoDB Compass or mongosh to view:
- **users** collection - User accounts
- **posts** collection - Blog posts/drafts
- **comments** collection - Post comments

---

## 🎯 Full Test Checklist

- [ ] Sign up new user
- [ ] Log in with existing user
- [ ] Create new post
- [ ] Edit post (auto-save)
- [ ] View all posts in sidebar
- [ ] Publish post
- [ ] Unpublish post
- [ ] Delete post
- [ ] View public posts page
- [ ] Read single published post
- [ ] Add comment on published post
- [ ] Delete own comment
- [ ] Generate AI content
- [ ] View user profile
- [ ] Update user profile

---

## 🚀 Ready to Test!

**Frontend**: http://localhost:8080
**Backend**: http://127.0.0.1:8000
**API Docs**: http://127.0.0.1:8000/docs (FastAPI auto-generated docs)

Happy Testing! 🎉
