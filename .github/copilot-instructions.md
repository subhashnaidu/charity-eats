<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# CharityEats - Full-Stack Food Ordering Platform

## Architecture Overview
- **Frontend**: Next.js 15 with TypeScript, Tailwind CSS 4, React 19
- **Backend**: FastAPI with SQLAlchemy 2.0 (async), PostgreSQL/SQLite
- **Authentication**: JWT tokens with role-based access (customer/vendor/admin)
- **Structure**: Monorepo with `src/` (Next.js) and `server/app/` (FastAPI)

## Key Patterns & Conventions

### Frontend (`src/app/`)
- **Route Structure**: Role-based layouts in `/customer`, `/vendor`, `/admin`
- **State Management**: Context API for cart (`CartContext.tsx`) and auth
- **Authentication**: JWT stored in localStorage + cookies, validated via `middleware.ts`
- **Components**: Co-located in feature directories (e.g., `customer/components/`)

### Backend (`server/app/`)
- **Models**: SQLAlchemy ORM with UUID primary keys, enum types for status/roles
- **API Structure**: Feature-based routers in `api/` (auth, menu, orders, etc.)
- **Database**: Async sessions, automatic migrations via Alembic
- **Security**: Bcrypt password hashing, JWT tokens with role claims

## Development Workflows

### Running the Stack
```bash
# Frontend (from root)
npm run dev  # Uses --turbopack for faster builds

# Backend (requires .venv activation)
cd server/app && uvicorn main:app --reload
```

### Database Operations
- **Migrations**: Use Alembic from `server/app/` directory
- **Models**: All in `models/models.py` with relationships defined
- **Connection**: Async SQLAlchemy engine, sessions via dependency injection

### Authentication Flow
1. JWT tokens contain `role` claim for authorization
2. `middleware.ts` protects routes `/customer/*`, `/vendor/*`, `/admin/*`
3. `ProtectedRoute.tsx` handles client-side role-based redirects
4. Backend validates tokens via `core/security.py`

## File Patterns
- **API Endpoints**: Follow `/api/{feature}` pattern with FastAPI routers
- **Schemas**: Pydantic models in `schemas/schemas.py` for request/response validation
- **Frontend Pages**: App Router with nested layouts for role-specific UI
- **Components**: Export named components, use TypeScript interfaces for props

## Deployment Configurations

### Environment Variables
- **Frontend**: `NEXT_PUBLIC_API_BASE_URL` for API endpoint configuration
- **Backend**: SQLite for development (`charityeats.db`), PostgreSQL for production
- **Example**: `.env.local.example` provides template for frontend environment setup

### Build & Deploy
- **Frontend**: Next.js with Turbopack (`npm run dev --turbopack`)
- **Backend**: FastAPI with uvicorn (`uvicorn main:app --reload`)
- **Target Platform**: Vercel deployment ready (standard Next.js configuration)

## Error Handling Patterns

### Backend (FastAPI)
- **HTTPException**: Standard for API errors with proper status codes
- **Database Rollback**: `await db.rollback()` on IntegrityError for transactions
- **Logging**: Structured logging with role-based info, PII redaction
```python
except IntegrityError:
    await db.rollback()
    raise HTTPException(status_code=400, detail="Email already registered")
```

### Frontend (React)
- **Try-Catch**: Async operations wrapped in try-catch blocks
- **Console Logging**: Error details logged with context
- **Router Redirects**: Invalid tokens redirect to `/auth`
```tsx
try {
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch");
} catch (error) {
  console.error("Error context:", error);
}
```

## Database Relationship Patterns

### SQLAlchemy Relationships
- **One-to-One**: `User ↔ Wallet`, `User ↔ Vendor` (uselist=False)
- **One-to-Many**: `Vendor → MenuItem[]`, `Order → OrderItem[]`
- **Foreign Keys**: UUID references with cascade relationships
```python
# Bidirectional relationships with back_populates
user = relationship("User", back_populates="wallet")
wallet = relationship("Wallet", uselist=False, back_populates="user")
```

### Key Patterns
- **UUID Primary Keys**: All models use `uuid.uuid4()` defaults
- **Enum Types**: OrderStatus, PaymentStatus, UserRole for type safety
- **Timestamps**: `created_at`, `updated_at` with automatic updates

## Frontend Styling Conventions

### Tailwind CSS 4
- **Inline Themes**: CSS custom properties in `@theme inline` blocks
- **Dark Mode**: Automatic with `prefers-color-scheme` media queries
- **Font Variables**: Geist Sans/Mono via CSS custom properties
```css
@theme inline {
  --color-background: var(--background);
  --font-sans: var(--font-geist-sans);
}
```

### Component Patterns
- **Accessibility**: ARIA labels, semantic HTML, keyboard navigation
- **Responsive**: Mobile-first with flex layouts
- **Color Override**: Force black text with `!important` for visibility
- **State Classes**: Hover/focus states for interactive elements

Use modern async/await patterns, proper error handling, and maintain type safety across the full stack.