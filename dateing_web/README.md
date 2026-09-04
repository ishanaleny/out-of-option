# LAST RESORT™ — React + Vite + Supabase

> The dating app you use when every other option has failed. You have officially hit rock bottom.

---

## 🚀 Quick Start

### 1. Database Setup (Supabase)
1. Open your [Supabase Dashboard](https://supabase.com/dashboard).
2. Navigate to the **SQL Editor**.
3. Copy and paste the entire content of [`database/00_complete_setup.sql`](./database/00_complete_setup.sql) (or `database/01_profiles_table.sql`, `02_rls_policies.sql`, `03_storage_bucket.sql`).
4. Click **Run**. This will create:
   - `profiles` table with all columns and constraints
   - Auto-create profile trigger on user signup (`auth.users`)
   - Auto-update timestamp trigger
   - Row Level Security (RLS) policies
   - `profile-photos` storage bucket for user avatars

### 2. Run Locally
```bash
cd dateing_web
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📁 Project Architecture

```
dateing_web/
├── database/
│   ├── 00_complete_setup.sql          # 🌟 One-click complete Supabase setup
│   ├── 01_profiles_table.sql          # Profiles DDL + auth trigger
│   ├── 02_rls_policies.sql            # Row Level Security
│   └── 03_storage_bucket.sql          # Profile photos storage bucket
├── public/
│   └── favicon.svg                    # Broken heart icon
├── src/
│   ├── lib/
│   │   └── supabase.js                # Supabase client & API helpers
│   ├── context/
│   │   └── AuthContext.jsx            # Supabase session & user profile state
│   ├── styles/
│   │   ├── globals.css                # Design system, theme tokens, reset
│   │   └── components.css             # Component-level styling & animations
│   ├── components/
│   │   ├── auth/
│   │   │   └── AuthPage.jsx           # Email Auth + 2-step registration + photo upload
│   │   ├── layout/
│   │   │   ├── TopBar.jsx             # User bar with avatar, score & exit
│   │   │   └── StatusBar.jsx          # Live Supabase connection indicator
│   │   ├── feed/
│   │   │   ├── FeedPage.jsx           # Tinder-style card stack feed + fun facts ticker
│   │   │   └── ProfileCard.jsx        # Rich profile card (photos, badges, meta)
│   │   ├── fate/
│   │   │   └── FatePage.jsx           # The Fate Question (number picker: 7, 27, 11, 67, 99, 52)
│   │   └── modes/
│   │       ├── MatchResult.jsx        # Reusable match result component
│   │       ├── OppositeMode.jsx       # 7: The Opposite (4-question personality quiz)
│   │       ├── UselessMode.jsx        # 11: Uselessness Match (scream, mosquito, quiz)
│   │       ├── SlowMode.jsx           # 27: Slow Dating (patience test)
│   │       ├── AntiSwipeMode.jsx      # 67: Anti-Swipe (binding dating waiver contract)
│   │       ├── TerribleMode.jsx       # 99: Wheel of Terrible Decisions
│   │       └── FateWheelMode.jsx      # 52: The Fate Wheel (cosmic RNG)
│   ├── pages/
│   │   └── App.jsx                    # Top-level screen router & toast provider
│   └── main.jsx                       # Vite React entry point
├── index.html
├── vite.config.js
└── package.json
```

---

## 🎯 Features & Algorithm Integrity

- **Strict Real-Data Matching**: No fake or mock users — all candidate matching pulls exclusively from the Supabase `profiles` table.
- **Progressive Data Collection**: User choices in games (numbers, personality, snooze habits, etc.) seamlessly update their Supabase profile.
- **Card Stack Feed**: Smooth swipe actions (left/right) with animated stack preview and rotating fun facts ticker.
- **6 Thematic Modes**:
  - `7` ➔ **The Opposite**: Calculates opposite personality matches.
  - `11` ➔ **Uselessness Match**: Measures chaos via scream volume, mosquito reflex, and quiz.
  - `27` ➔ **Slow Dating**: Enforces patience with artificial delays.
  - `67` ➔ **Anti-Swipe**: Legal binding contract against ghosting.
  - `99` ➔ **Wheel of Terrible Decisions**: Animated spinning disaster wheel.
  - `52` ➔ **The Fate Wheel**: Cosmic roulette match allocation.
