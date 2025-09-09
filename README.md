# Synthia

**Synthia**: A blend of "synthesis" and "AI," Synthia is an AI-powered browser application designed to provide intelligent, user-friendly search and research capabilities. It synthesizes information from web searches, delivers AI-generated summaries, and organizes results into an intuitive interface. Synthia combines modern web technologies with a robust backend to offer a seamless experience for users seeking information on diverse topics.

 Synthia: A blend of "synthesis" and "AI," highlighting its ability to synthesize information.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Features](#features)
   - [User Authentication](#user-authentication)
   - [Home Search Interface](#home-search-interface)
   - [Results Page](#results-page)
   - [Library Page](#library-page)
   - [Discovery Page](#discovery-page)
   - [Credit System](#credit-system)
   - [Sidebar Navigation](#sidebar-navigation)
   - [API Endpoints](#api-endpoints)
   - [Database Structure](#database-structure)
   - [Responsive Design](#responsive-design)
3. [Tech Stack](#tech-stack)
4. [Installation](#installation)
   - [Prerequisites](#prerequisites)
   - [Setup Instructions](#setup-instructions)
5. [Usage](#usage)
   - [Getting Started](#getting-started)
   - [Performing a Search](#performing-a-search)
   - [Viewing Past Searches](#viewing-past-searches)
   - [Exploring Discovery](#exploring-discovery)
   - [Managing Credits](#managing-credits)
6. [Project Structure](#project-structure)
7. [Environment Variables](#environment-variables)
8. [Contributing](#contributing)
9. [License](#license)
10. [Acknowledgments](#acknowledgments)
11. [Contact](#contact)

---

## Project Overview

Synthia is a full-stack web application that leverages AI to enhance the search experience. It allows users to perform searches via text or audio input, offering two modes: **Standard Search** for quick results and **Deep Research** for in-depth analysis. Results include AI-generated summaries, images, and source links, all stored for future reference in a user’s library. The app features a discovery section for trending news, a credit system for usage limits, and secure authentication via Clerk.

Key objectives:
- Provide a seamless, AI-driven search experience.
- Support both guest and authenticated users.
- Organize search history and trending topics.
- Ensure a responsive, modern UI with dark/light mode support.

Synthia integrates Google Custom Search for web results, Gemini AI for summarization, Supabase for data storage, and Inngest for asynchronous processing, making it a robust tool for information retrieval and synthesis.

---

## Features

### User Authentication
- **Provider**: Clerk for secure sign-in and sign-up.
- **Routes**:
  - `/sign-in`: Login page with Clerk’s `SignIn` component.
  - `/sign-up`: Registration page with Clerk’s `SignUp` component.
- **Guest Access**: Non-authenticated users can perform one search; further actions require login.
- **User Data**: Upon sign-up/login, user details (name, email) are stored in Supabase’s `Users` table.
- **Middleware**: Clerk’s middleware protects routes, allowing public access to `/`, `/sign-in`, `/sign-up`, and API endpoints.

### Home Search Interface
- **Route**: `/` (root).
- **Input Options**:
  - **Text Input**: Users enter queries via a text field.
  - **Audio-to-Text**: Converts voice input to text (implementation details in `ChatInputBox.jsx`).
- **Search Modes**:
  - **Standard Search**: Quick results using Google Custom Search API.
  - **Deep Research**: Enhanced analysis with potentially broader result fetching or deeper AI processing.
- **Credit Cost**: Each search deducts 1 credit from the user’s balance.
- **Output**: Redirects to `/search/[libid]` with a unique library ID (`libid`) for the search session.

### Results Page
- **Route**: `/search/[libid]`.
- **Components**:
  - **Header** (`Header.jsx`):
    - Displays search query, timestamp (via Moment.js), user avatar (Clerk’s `UserButton`), and credit balance.
    - Includes a “Copy Link” button to share the results page URL.
  - **Tabs** (`DisplayResult.jsx`):
    - **Answer Tab**: AI-generated summary (via Gemini AI) with markdown formatting (bold, headings, lists).
    - **Images Tab**: Masonry grid of images from search results (`ImageTabList.jsx`).
    - **Sources Tab**: List of source cards with titles, descriptions, URLs, favicons, and thumbnails (`SourceCard.jsx`).
  - **Data Flow**:
    - Search results are fetched via `/api/search-api` and stored in Supabase’s `Chats` table.
    - AI summaries are generated asynchronously via `/api/llm-model` and Inngest, updated in real-time.
  - **UX**: Loading skeletons (`skeleton.jsx`) and error handling for smooth interaction.

### Library Page
- **Route**: `/library`.
- **Functionality**:
  - Displays a list of past searches/chats for the authenticated user.
  - Each entry shows:
    - Search query (`searchinput`).
    - Type (`search` or `research`).
    - Creation date (formatted via Moment.js).
  - Users can:
    - Click to view details (redirects to `/search/[libid]`).
    - Delete entries, removing associated data from `Librery` and `Chats` tables.
  - **Data Source**: Supabase (`Librery` table, joined with `Chats`).
  - **UI**: Responsive list with hover effects and delete buttons (`Trash2` icon from Lucide).

### Discovery Page
- **Route**: `/discover`.
- **Functionality**:
  - Curated categories: Top, Technology, Finance, Art & Culture.
  - Clicking a category triggers a search for “{category} Latest News & Updates” via Google Custom Search.
  - Displays news cards with:
    - Title, snippet, and source link.
    - Optional thumbnail image.
  - **UI**: Responsive grid layout, loading spinner (`Loader2` from Lucide).
  - **Navigation**: Button to return to home for new searches.

### Credit System
- **Implementation**:
  - Stored in Supabase’s `Users` table (`credits` column).
  - Each search deducts 1 credit.
  - Displayed in the header (`Header.jsx`) with a `CreditCard` icon.
- **Purchase Credits**:
  - Implemented via `CreditPopup.jsx` (likely a modal or external payment gateway integration).
  - Users are prompted to buy credits if balance is low.
- **Validation**: Checks credit balance before allowing searches.

### Sidebar Navigation
- **Component**: `AppSidebar.jsx`.
- **Features**:
  - Links to Home, Library, and Discover.
  - Collapsible on mobile (via `use-mobile.js` hook).
  - Includes Clerk’s `UserButton` for profile management.
- **Styling**: Uses custom colors (`#e9fff6` for sidebar, `#2b5195` for primary).

### API Endpoints
- **`/api/search-api`**: Executes Google Custom Search queries, returns formatted results.
- **`/api/llm-model`**: Sends search results and user input to Gemini AI for summarization, triggers Inngest job.
- **`/api/inngest`**: Handles Inngest serverless functions for background tasks.
- **`/api/get-inngest-status`**: Polls status of Inngest jobs to update AI responses.
- **Protection**: Public routes defined in `middleware.js`.

### Database Structure
- **Provider**: Supabase (PostgreSQL).
- **Tables**:
  - **Users**:
    - Columns: `id`, `name`, `email`, `credits`.
    - Stores user details and credit balance.
  - **Librery**:
    - Columns: `libid` (UUID), `searchinput`, `type` (search/research), `userEmail`, `created_at`.
    - Tracks search sessions.
  - **Chats**:
    - Columns: `id`, `libid`, `searchResult` (JSON), `userSearchInput`, `aiResp` (markdown).
    - Stores individual search results and AI responses.
- **Context**: `UserDetailContext.jsx` provides real-time user data access.

### Responsive Design
- **Breakpoints**: Uses Tailwind CSS for mobile-first design.
- **Mobile Detection**: `use-mobile.js` hook checks for screen width < 768px.
- **Features**:
  - Sidebar collapses on mobile.
  - Masonry grid for images adjusts columns (2 on mobile, 4 on desktop).
  - Responsive typography and padding.

---

## Tech Stack

- **Frontend**:
  - **Next.js**: React framework for server-side rendering and API routes.
  - **Tailwind CSS**: Utility-first CSS with custom colors (`#e9fff6`, `#f9faf5`, `#2b5195`).
  - **Shadcn UI**: Accessible components (button, sidebar, tabs, etc.).
  - **Lucide React**: Icons (e.g., `Star`, `LibraryBig`, `CreditCard`).
  - **Radix UI**: Headless UI primitives for accessibility.
- **Backend**:
  - **Next.js API Routes**: Handle search and AI processing.
  - **Supabase**: PostgreSQL database for user and search data.
  - **Inngest**: Serverless functions for asynchronous AI tasks.
- **Authentication**: Clerk for user management.
- **APIs**:
  - **Google Custom Search**: Web search results.
  - **Gemini AI**: AI summarization (via `/api/llm-model`).
- **Other Libraries**:
  - **Axios**: HTTP requests.
  - **Moment.js**: Date formatting.
  - **UUID**: Generate unique IDs.
  - **clsx & tailwind-merge**: Class name utilities.
- **Fonts**: Geist Sans and Geist Mono (via Next.js font optimization).
- **Deployment**: Vercel or similar (Next.js compatible).

---

## Installation

### Prerequisites
- **Node.js**: v18 or higher.
- **Accounts/Services**:
  - Clerk (authentication).
  - Supabase (database).
  - Google Custom Search (API key and CX ID).
  - Gemini AI (API key).
  - Inngest (signing key and server host).

### Setup Instructions
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/yourusername/synthia.git
   cd synthia
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   - Copy `.env.example` to `.env.local`:
     ```bash
     cp .env.example .env.local
     ```
   - Add the following keys in `.env.local`:
     ```plaintext
     NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
     CLERK_SECRET_KEY=your_clerk_secret_key
     NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
     NEXT_PUBLIC_SUPABASE_KEY=your_supabase_key
     GOOGLE_SEARCH_API_KEY=your_google_api_key
     CX=your_google_cx_id
     GEMINI_API_KEY=your_gemini_api_key
     NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_public_key
     INNGEST_SIGNING_KEY=your_inngest_signing_key
     INNGEST_SERVER_HOST=your_inngest_server_host
     ```

4. **Run the Development Server**:
   ```bash
   npm run dev
   ```
   - Access at `http://localhost:3000`.

5. **Build for Production**:
   ```bash
   npm run build
   npm run start
   ```

---

## Usage

### Getting Started
1. Visit `http://localhost:3000` (or deployed URL).
2. For first-time use, perform a guest search or sign up at `/sign-up`.
3. Log in at `/sign-in` for full access.

### Performing a Search
1. On the home page (`/`), enter a query via:
   - Text input in `ChatInputBox`.
   - Audio-to-text (click the mic icon, if implemented).
2. Select **Search** or **Deep Research**.
3. View results at `/search/[libid]` with tabs for Answer, Images, and Sources.
4. Share results using the “Copy Link” button.

### Viewing Past Searches
1. Navigate to `/library`.
2. Browse past searches, click to view details, or delete unwanted entries.
3. Each entry links to its results page (`/search/[libid]`).

### Exploring Discovery
1. Go to `/discover`.
2. Select a category (Top, Technology, Finance, Art & Culture).
3. Browse news cards; click to open sources in a new tab.

### Managing Credits
1. Check credit balance in the header.
2. If low, use the credit purchase feature (via `CreditPopup.jsx`).
3. Each search deducts 1 credit.

---

## Project Structure

```
sakshamagarwalm2-synthia/
├── README.md                  # Project documentation
├── components.json            # Shadcn UI configuration
├── jsconfig.json              # Path aliases (@/*)
├── middleware.js              # Clerk authentication middleware
├── next-env.d.ts              # TypeScript environment types
├── next.config.mjs            # Next.js configuration
├── package.json               # Dependencies and scripts
├── postcss.config.mjs         # Tailwind/PostCSS configuration
├── tsconfig.json              # TypeScript configuration
├── .env.example               # Environment variable template
├── app/                       # Next.js app router
│   ├── globals.css            # Global Tailwind styles
│   ├── layout.js              # Root layout with sidebar
│   ├── page.js                # Home page with search input
│   ├── provider.jsx           # User context provider
│   ├── (auth)/                # Authentication routes
│   │   ├── sign-in/[[...sign-in]]/page.jsx
│   │   └── sign-up/[[...sign-up]]/page.jsx
│   ├── (routes)/              # Protected routes
│   │   ├── discover/page.jsx  # Trending news page
│   │   ├── library/page.jsx   # Search history page
│   │   └── search/[libid]/    # Search results page
│   │       ├── page.jsx
│   │       └── _components/   # Results-specific components
│   │           ├── AnswerDisplay.jsx
│   │           ├── DisplayResult.jsx
│   │           ├── Header.jsx
│   │           ├── ImageTabList.jsx
│   │           ├── SourceCard.jsx
│   │           └── SourceList.jsx
│   ├── _components/           # Shared app components
│   │   ├── AppSidebar.jsx
│   │   └── ChatInputBox.jsx
│   └── api/                   # API routes
│       ├── get-inngest-status/route.jsx
│       ├── inngest/route.js
│       ├── llm-model/route.js
│       └── search-api/route.jsx
├── components/                # Reusable UI components
│   └── ui/
│       ├── button.jsx
│       ├── CreditPopup.jsx
│       ├── dropdown-menu.jsx
│       ├── input.jsx
│       ├── separator.jsx
│       ├── sheet.jsx
│       ├── sidebar.jsx
│       ├── skeleton.jsx
│       ├── tabs.jsx
│       └── tooltip.jsx
├── context/                   # React contexts
│   └── UserDetailContext.jsx
├── hooks/                     # Custom React hooks
│   └── use-mobile.js
├── inngest/                   # Inngest serverless functions
│   ├── client.js
│   └── functions.js
├── lib/                       # Utility functions
│   └── utils.js
└── Services/                  # External service integrations
    ├── Shared.jsx             # Sample search result structure
    └── supabase.jsx           # Supabase client
```

---

## Environment Variables

Required variables (see `.env.example`):
- **Clerk**:
  - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
  - `CLERK_SECRET_KEY`
  - `NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up`
  - `NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in`
  - `NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/`
  - `NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/`
- **Supabase**:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_KEY`
- **Google Custom Search**:
  - `GOOGLE_SEARCH_API_KEY`
  - `CX`
- **Gemini AI**:
  - `GEMINI_API_KEY`
  - `NEXT_PUBLIC_GEMINI_API_KEY`
- **Inngest**:
  - `INNGEST_SIGNING_KEY`
  - `INNGEST_SERVER_HOST`

Store sensitive keys securely in production (e.g., Vercel environment variables).

---

## Contributing

1. Fork the repository.
2. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature
   ```
3. Commit changes:
   ```bash
   git commit -m "Add your feature"
   ```
4. Push to your fork:
   ```bash
   git push origin feature/your-feature
   ```
5. Open a Pull Request with a detailed description.

---

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

---

## Acknowledgments

- **Inspiration**: Tools like Perplexity AI and Google Search.
- **Libraries**: Next.js, Tailwind CSS, Clerk, Supabase, Inngest, Gemini AI.
- **Community**: Open-source contributors to Shadcn UI, Radix UI, and Lucide React.

---

## Contact

For questions or feedback, contact [your-email@example.com] or open an issue on GitHub.
