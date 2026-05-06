# 🧠 Copilot Instructions — FocusForge System

## 📌 Project Overview

This is a **Next.js 15 App Router** application with:

* React 19
* PostgreSQL (Supabase)
* Prisma ORM
* Tailwind CSS v4
* Zod validation

The system is a **gamified Pomodoro productivity platform** with:

* Student + Teacher roles
* XP / Level / Streak system
* Rewards & Penalties
* Session tracking
* Teacher monitoring dashboard

---

## 🏗️ Architecture Rules (STRICT)

### 1. Folder Responsibilities

* `/app` → Routing + layouts + API routes only
* `/components` → UI components ONLY (no business logic)
* `/lib/actions` → Server Actions (bridge between UI and backend)
* `/lib/services` → Business logic (XP, sessions, penalties, etc.)
* `/hooks` → Client-side logic only
* `/prisma` → Database schema
* `/types` → Shared TypeScript types

❗ NEVER mix responsibilities

---

### 2. Business Logic Separation

ALL core logic MUST go into:

```
/lib/services/
```

Examples:

* xp.service.ts
* session.service.ts
* penalty.service.ts

❌ DO NOT put logic in:

* components
* pages
* API routes

---

### 3. Database Integrity (Prisma)

* Always use Prisma models
* Do NOT bypass Prisma
* Respect existing schema:

  * User (xp, level, streak)
  * StudySession
  * Reward / RewardClaim
  * Penalty
  * Class / ClassMember

---

### 4. Authentication & Roles

* Use Supabase SSR auth

* Roles:

  * student
  * teacher/admin

* Enforce role-based access in:

  * API routes
  * Server actions
  * UI rendering

---

### 5. UI/UX SYSTEM (MANDATORY)

### 🎨 Color System

* Primary: deep navy blue, sky blue
* Progress/Timer: sage green
* Rewards: pale yellow
* Penalties: brick red
* Background: soft cream + warm light gray

### 🧩 Layout System

* Center → Pomodoro Timer
* Sidebar → Teacher dashboard / navigation
* Top/Side → Student level + XP progress
* Gamification → stars, badges, game controller icon

### 🎯 Design Style

* Flat design
* Subtle shadows
* Clean typography
* Modern dashboard (Dribbble-style)

❗ UI must remain consistent across all features

---

### 6. Component Rules

* Keep components reusable and small
* Use `/components/ui` for base UI
* Use feature folders:

  * `/components/pomodoro`
  * `/components/gamification`

---

### 7. State Management

* Prefer server-first approach (App Router)
* Use hooks only when necessary
* Avoid unnecessary global state

---

### 8. API & Actions

* Use Server Actions in `/lib/actions`
* Keep them thin
* Delegate logic to `/lib/services`

---

### 9. Naming Conventions

* kebab-case for files
* PascalCase for components
* camelCase for functions

---

### 10. Error Handling

* Always handle errors gracefully
* Return structured responses
* Never expose sensitive data

---

## 🚫 Strict Anti-Patterns (DO NOT DO)

❌ No business logic in components
❌ No direct DB calls in UI
❌ No mixing student/teacher logic without roles
❌ No inline styles (use Tailwind)
❌ No breaking folder structure

---

## ✅ Feature Development Flow

When implementing a feature:

1. Check existing structure
2. Create service (business logic)
3. Create action (bridge)
4. Create UI component
5. Connect everything cleanly

---

## 🧪 Example Flow (Pomodoro)

* `/lib/services/session.service.ts` → handles session logic
* `/lib/actions/session.actions.ts` → handles API bridge
* `/components/pomodoro/timer.tsx` → UI

---

## 🧠 Final Rule

Always prioritize:

1. Clean architecture
2. Scalability
3. Consistency
4. Best practices

If unsure → DO NOT GUESS → follow existing patterns
