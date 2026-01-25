# PluggKompis Client

Frontend application for the PluggKompis homework help coordination platform.

**UI Language:** Swedish  
**Code Language:** English

## 📋 About

PluggKompis is a platform that connects students and parents with free homework help (läxhjälp) offered at libraries, youth centers (fritidsgårdar), and study associations throughout Sweden.

## 🛠️ Tech Stack

- **React** 18.2
- **TypeScript** 5.2
- **Vite** 5.0 - Build tool and dev server
- **React Router** 6.21 - Client-side routing
- **Tailwind CSS** 3.4 - Utility-first CSS framework
- **Axios** 1.6 - HTTP client for API calls
- **React Hook Form** 7.49 - Form validation
- **Zod** 3.22 - Schema validation
- **Leaflet** 1.9 & React Leaflet 4.2 - Interactive maps
- **Lucide React** 0.303 - Icon library
- **date-fns** 3.0 - Date utility library

### 💡 Why this Tech Stack?

We chose this modern stack to prioritize **developer experience**, **type safety**, and **performance**:

- **Vite vs Create-React-App:** We opted for Vite for its lightning-fast Hot Module Replacement (HMR) and build times, significantly speeding up our development loop compared to older bundlers.
- **TypeScript:** Essential for our team collaboration. It catches errors at compile-time and provides self-documenting code, which is crucial for the complex data structures in our booking and venue systems.
- **Tailwind CSS:** Allows us to build a responsive, mobile-first UI rapidly without context-switching between CSS files and TSX components.
- **Zod & React Hook Form:** This combination provides a robust solution for our complex forms (like registration and booking), separating UI concerns from validation logic.
- **Leaflet:** Selected over Google Maps for being lightweight, open-source, and free to use, which fits our project constraints perfectly.

## 📦 Dependencies

### Core Dependencies

- `react` ^18.2.0
- `react-dom` ^18.2.0
- `react-router-dom` ^6.21.0
- `axios` ^1.6.0

### UI & Styling

- `tailwindcss` ^3.4.1
- `lucide-react` ^0.303.0

### Forms & Validation

- `react-hook-form` ^7.49.0
- `zod` ^3.22.0
- `@hookform/resolvers` ^3.3.0

### Maps

- `leaflet` ^1.9.4
- `react-leaflet` ^4.2.1

### Utilities

- `date-fns` ^3.0.0

### Dev Dependencies

- `@types/react` ^18.2.0
- `@types/react-dom` ^18.2.0
- `@types/node` ^20.10.0
- `@types/leaflet` ^1.9.8
- `@vitejs/plugin-react` ^4.2.0
- `typescript` ^5.2.2
- `vite` ^5.0.0
- `postcss` ^8.4.33
- `autoprefixer` ^10.4.16
- `eslint` ^8.55.0

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository

```bash
git clone https://github.com/your-username/pluggkompis-client.git
cd pluggkompis-client
```

2. Install dependencies

```bash
npm install
```

3. Create environment file

```bash
cp .env.example .env
```

4. Update `.env` with your API URL

```env
VITE_API_URL=http://localhost:5001/api
```

5. Start development server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 📜 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build locally
npm run lint         # Run ESLint
```

## 📁 Project Structure

```
src/ 
├── components/ 
│   ├── auth/ # Authentication forms (Login, Register) 
│   ├── common/ # Reusable UI components (Button, Modal, Card, etc.) 
│   ├── layout/ # Layout components (Navbar, Footer, Sidebar) 
│   └── features/ # Feature-specific components 
│      ├── bookings/ # Booking management lists and cards 
│      ├── coordinator/ # Coordinator dashboard widgets 
│      ├── parent/ # Parent dashboard and child management 
│      ├── profile/ # User profile and settings 
│      ├── student/ # Student dashboard views 
│      ├── timeslots/ # Calendar and slot management 
│      ├── venues/ # Venue maps, lists, and details 
│      └── volunteers/ # Volunteer specific tools 
├── pages/ # Page components (one per route) 
├── services/ # API service layer (axios instances) 
├── hooks/ # Custom React hooks 
├── types/ # TypeScript type definitions 
├── utils/ # Helper functions and utilities 
├── contexts/ # React context providers 
├── App.tsx # Main app component with routing 
├── main.tsx # Application entry point 
└── index.css # Global styles and Tailwind imports
```

## 🔐 Authentication

The app uses JWT (JSON Web Tokens) for authentication:

- Tokens are stored in `localStorage`
- Automatically attached to API requests via axios interceptor
- Protected routes redirect to login if unauthenticated

## 🗺️ Routing

**Public Routes:**
- `/` - Home page
- `/about` - About PluggKompis
- `/faq` - Frequently Asked Questions
- `/venues` - Browse all venues
- `/venues/:id` - Venue detail page
- `/login` - Login page
- `/register` - Registration page

**Protected Dashboards:**
- `/parent` - Parent dashboard (Manage children & bookings)
- `/student` - Student dashboard (Manage own bookings)
- `/volunteer` - Volunteer dashboard (Manage assignments)
- `/coordinator` - Coordinator dashboard (Venue & subject management)
- `/profile` - User settings and profile management

## 🎨 Styling

This project uses Tailwind CSS with a custom configuration:

- **Primary color:** Green (`primary-500` to `primary-900`)
- **Custom components:** Predefined in `@layer components` (buttons, inputs, cards)
- **Responsive design:** Mobile-first approach with Tailwind breakpoints

## 🌐 API Integration

API base URL is configured via environment variable:

```typescript
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";
```

Service files handle all API communication:

- `services/auth.ts` - Authentication (login, register, logout)
- `services/venues.ts` - Venue CRUD operations
- `services/bookings.ts` - Booking management
- `services/volunteers.ts` - Volunteer operations

## 🔧 Configuration Files

### `tailwind.config.js`

Tailwind CSS configuration with custom color palette

### `postcss.config.js`

PostCSS configuration for Tailwind

### `tsconfig.json`

TypeScript configuration with path aliases:

- `@/*` → `./src/*`
- `@/components/*` → `./src/components/*`
- etc.

### `vite.config.ts`

Vite build configuration with path alias resolution

## 🚀 Deployment

This app will be deployed to Vercel.

**Live URL:** [PluggKompis](https://pluggkompis-client.vercel.app/)

### Build for production

```bash
npm run build
```

Output will be in `dist/` directory.

## 🧪 Future Testing

Testing framework will be added in future iterations:

- **Vitest** for unit tests
- **React Testing Library** for component tests
- **Playwright** or **Cypress** for E2E tests

## 🔮 Future Roadmap

We have planned several enhancements to scale the platform's functionality:

### 🏢 Enhanced Coordinator Features
- **Multi-Venue Management:** Update the coordinator dashboard to support managing multiple locations from a single account.
- **Subject Administration UI:** A new interface for coordinators to:
    - Create and name new subjects dynamicially.
    - Upload or select custom icons for subjects.
    - Archive or disable subjects that are no longer offered.
    - Configure venue-specific subjects (e.g., "Math" at City Library vs. "Art" at Youth Center).

### 🎨 UX/UI Improvements
- **Map/List Toggle:** Add a toggle switch on the "Find Venues" page, allowing users to switch between the interactive map view and a detailed list view for better accessibility.
- **Notification Settings:** User interface for managing automated email reminders for upcoming bookings.

## 👥 Team

- **Gabby** - Full-stack developer
- **Mohanad** - Full-stack developer

## 📄 License

This project is created as a school project for NBI Handelsakademin.

## 🔗 Related Repositories

- **Backend API:** [pluggkompis-api](https://github.com/mohald-3/Pluggkompis-BE)
- **Project Board:** [PluggKompis Development](https://github.com/users/mohald-3/projects/11/views/1)

---

**Note:** This is a student project for the Advanced Object-Oriented Programming course at NBI Handelsakademin, Gothenburg.
