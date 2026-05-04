# FocusForge Architecture

## Overview
FocusForge is a productivity-focused educational platform. It uses Next.js App Router with a Clean Architecture approach.

## Tech Stack
- **Framework**: Next.js 15+ (App Router)
- **Database/Auth**: Supabase (PostgreSQL, Auth, Realtime)
- **ORM**: Prisma
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **API**: Server Actions + tRPC
- **Local Dev**: Supabase CLI (Mandatory)

## Tech Standards
- **DO**: Use Server Actions for mutations, Strict TS, Mobile-First UI (44px touch targets), Local Supabase testing.
- **DON'T**: Use `any`, fetch in `useEffect`, or bypass RLS.
