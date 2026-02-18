# Writr - Frontend

Modern React TypeScript frontend for Writr blog editor with AI-powered features.

## Setup & Development

### Prerequisites
- Node.js 18+
- npm or bun

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm run test
```

## Project Structure

```
src/
├── components/          # React components
│   ├── AIPanel.tsx      # AI results panel
│   ├── BlogEditor.tsx   # Main editor
│   ├── DraftsSidebar.tsx # Posts sidebar with public tab
│   ├── EditorToolbar.tsx # Editor toolbar
│   ├── NavLink.tsx      # Navigation
│   ├── ProtectedRoute.tsx # Auth guard
│   └── ui/              # ShadCN UI components
├── hooks/               # Custom React hooks
│   ├── useAI.ts         # AI features
│   ├── useAutoSave.ts   # Auto-save
│   └── useDebounce.ts   # Debouncing
├── pages/               # Page components
│   ├── Auth.tsx         # Login/Signup
│   ├── Index.tsx        # Editor
│   ├── Landing.tsx      # Landing page
│   ├── PublishedPosts.tsx # Public posts
│   └── PostReader.tsx   # Single post view
├── store/               # Zustand state management
│   └── blogStore.ts     # Global store
├── services/            # API services
│   └── api.ts          # API client
├── lib/                 # Utilities
│   └── utils.ts         # Helper functions
├── App.tsx              # Root component
└── main.tsx             # Entry point
```

## Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **UI Components**: ShadCN UI
- **Rich Editor**: Lexical
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Date Handling**: date-fns

## Key Features

- ✅ Create and edit blog posts
- ✅ Auto-save functionality
- ✅ AI-powered summarization
- ✅ Grammar and clarity checker
- ✅ Publish posts publicly
- ✅ Browse public posts
- ✅ Add comments
- ✅ Dark/Light theme support

## API Integration

The frontend connects to the backend API at `http://127.0.0.1:8000`

### API Endpoints Used

- `POST /auth/signup` - Register
- `POST /auth/login` - Login
- `GET /api/posts/` - Get user posts
- `POST /api/posts/` - Create post
- `PATCH /api/posts/{id}` - Update post
- `DELETE /api/posts/{id}` - Delete post
- `POST /api/posts/{id}/publish` - Publish post
- `POST /api/posts/{id}/unpublish` - Unpublish post
- `GET /api/public/posts` - Get public posts
- `POST /api/ai/generate` - AI features

## Environment

Update `src/services/api.ts` to set backend URL:

```typescript
const API_BASE_URL = 'http://127.0.0.1:8000';
```

## Development

```bash
# Start dev server (includes hot reload)
npm run dev

# Watch for errors
npm run lint

# Check types
npm run type-check
```

## Deployment

```bash
# Build for production
npm run build

# Output is in dist/
```

Deploy the `dist/` folder to any static hosting (Vercel, Netlify, etc.)

## Contributing

1. Create a branch
2. Make changes
3. Test locally with `npm run dev`
4. Push changes

---

**Writr** - Smart Blog Editing, Made Simple ✨

