<img width="1280" height="640" alt="git (1)" src="https://github.com/user-attachments/assets/8920b256-2ba8-4988-b824-5351134eb4bd" />



# LAST RESORT™ 🎯


## Basic Details
### Team Name: Nova


### Team Members
- Ishana Leny - Muthoot Institute of Technology and Science
- Shreddha Eldho - Muthoot Institute of Technology and Science

### Project Description
LAST RESORT™ is a chaotic anti-gravity dating web application designed for users who are completely exhausted by modern dating apps. It strips away romantic autonomy through randomized destiny modes, legally binding anti-swipe contracts, escaping send buttons, and anonymous scream reveals.

The application features 4 core chaotic modes:
1. **Anti-Swipe Protocol (`AntiSwipeMode.jsx`)**: Forces users to sign Form LR-2026 (Mandatory Dating Contract) before accessing a Tinder-style swipe deck where all user choices are 100% overruled by randomized government algorithm regulations.
2. **Complementary Vibe Match (`OppositeMode.jsx`)**: Uses a 4-question Vibe Harmonizer quiz to calculate your exact opposite personality matrix and match you with complementary energies.
3. **Existential Waiting Modes (`SlowMode.jsx` & `UselessMode.jsx`)**: Features artificial breathing progress rings, rotating reflections, and intentional perceived waiting time.
4. **Anonymous Scream Chat (`TerribleMode.jsx`)**: Masked profile chat featuring an Escaping Send Button that runs away on hover/click (with a 5-attempt stabilization limit) and a `😱 SCREAM TO REVEAL PROFILE!` trigger.

### The Problem (that doesn't exist)
Modern dating applications grant users far too much choice and control, leading to decision paralysis, infinite swiping, ghosting after three dry texts, and over-optimized, unrealistic romantic expectations.

### The Solution (that nobody asked for)
LAST RESORT™ solves choice fatigue by removing human choice entirely:
- **Legal Waiver Contracts**: Users legally surrender their right to be picky.
- **Randomized Algorithm Overrules**: 80% of user swipes result in system rejection or assignment to a completely different human candidate.
- **Sabotaged Chat Interaction**: Send buttons physically escape mouse cursors to prevent dry text openers ("Hey").
- **Scream Verification**: Candidate identities remain 100% hidden until the user screams into the microphone.

## Technical Details
### Technologies/Components Used
For Software:
- **Languages used**: JavaScript (ES6+), HTML5, Vanilla CSS3 (Custom Design Tokens, Glassmorphism, CSS Keyframe Animations)
- **Frameworks used**: React 18 (`useState`, `useRef`, `useEffect`, Context API), Vite 6, React Router DOM v6
- **Libraries used**: `@supabase/supabase-js` v2.45, Framer Motion, Lucide React, React Hot Toast
- **Backend & Database**: Supabase (PostgreSQL Database, Auth Service, Storage Buckets, Row Level Security Policies)
- **Seed Dataset**: 20 Malayalam & Indian Movie Character Seed Profiles (Baahubali, Kabir Singh, Minnal Murali, Puli Murugan, Pooja Mathew, Meesha Madhavan, Ramanan, Appukuttan, Nagavalli, Glixon, Sona, Shammi, Malar Miss, George David, Clara, Dasan, Vijayan, Girirajan Kozhi, Sethumadhavan, Mary)

For Hardware:
- N/A (Pure Software Web Application)
- Specifications: Any device with a modern web browser and mouse/touch controls
- Tools required: Smartphone or PC with Google Chrome, Microsoft Edge, or Mozilla Firefox

### Implementation
For Software:
# Installation
1. Clone the repository and navigate to the application folder:
```bash
git clone https://github.com/user-attachments/assets
cd dateing_web
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables in `.env`:
```env
VITE_SUPABASE_URL=https://your-supabase-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

4. Database Setup (Supabase SQL Editor):
Execute `database/00_complete_setup.sql` to create the `profiles` table and storage buckets, then execute `database/seed_20_movies.sql` to seed movie character profiles.

# Run
Start the Vite local development server:
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

### Project Documentation
For Software:

# Screenshots (Add at least 3)
![Landing Page](file:///C:/Users/ASUS/.gemini/antigravity-ide/brain/9a658c66-301c-4dab-a0d8-52f203b850a5/.user_uploaded/media_1788480368660.png)
*LAST RESORT™ Landing Page featuring the Form LR-2026 mandatory anti-swipe contract waiver.*

![Anti-Swipe Tinder Deck](file:///C:/Users/ASUS/.gemini/antigravity-ide/brain/9a658c66-301c-4dab-a0d8-52f203b850a5/.user_uploaded/media_1788476047917.png)
*Tinder-style Anti-Swipe Protocol card deck where user swipes are overrode by the algorithm.*

![Complementary Vibe Match](file:///C:/Users/ASUS/.gemini/antigravity-ide/brain/9a658c66-301c-4dab-a0d8-52f203b850a5/.user_uploaded/media_1788476551002.png)
*Complementary Vibe Match mode showcasing opposite energy candidate pairings.*

# Diagrams
![Workflow](file:///C:/Users/ASUS/.gemini/antigravity-ide/brain/9a658c66-301c-4dab-a0d8-52f203b850a5/.user_uploaded/media_1788477221216.png)
*User journey from landing waiver to chaotic fate modes and sabotaged send button chat.*

### System Limitations & Known Constraints
1. **Foreign Key Override**: Synthetic movie character profiles use standalone UUID keys (`profiles_id_fkey` constraint dropped) so seed profiles exist without needing individual Supabase Auth user accounts.
2. **Deterministic Audio Thresholding**: Scream intensity verification uses simulated audio triggers and browser frequency state timing.
3. **Button Boundary Constraints**: Escaping Send Button translation vectors are capped within relative parent container bounds (`maxX: 110px`, `maxY: 40px`) to prevent overflow offscreen.

### Future Enhancements & Tweaks
- **Real-Time WebSockets Scream Battle**: Multi-user scream intensity duels to fight over assigned candidates.
- **AI Sarcastic Chat Referee**: Integration of Gemini API to analyze chat messages and roast dry text openers in real time.
- **Geographic Anti-Matching**: Matching users with candidates located in the furthest possible geographical time zone.

For Hardware:

# Schematic & Circuit
![Circuit](https://via.placeholder.com/600x300?text=Hardware+Not+Applicable)
*N/A - Software Application*

![Schematic](https://via.placeholder.com/600x300?text=Hardware+Not+Applicable)
*N/A - Software Application*

# Build Photos
![Components](https://via.placeholder.com/600x300?text=Software+Only)
*N/A - Pure Web Application*

![Build](https://via.placeholder.com/600x300?text=Software+Only)
*N/A - Pure Web Application*

![Final](https://via.placeholder.com/600x300?text=Software+Only)
*N/A - Pure Web Application*

### Project Demo
# Video
[Demo Video Link](https://github.com/user-attachments/assets/8920b256-2ba8-4988-b824-5351134eb4bd)
*Demonstrates mandatory contract signing, chaotic swipe overrides, escaping send button, and scream reveals.*

# Additional Demos
[Project Repository & Live Demo](https://github.com/user-attachments/assets)

## Team Contributions
- **Ishana Leny**: Core React Architecture, Anti-Swipe Tinder Deck, Supabase Integration, Escaping Send Button Sabotage Logic, PostgreSQL Movie Character Dataset.
- **Shreddha Eldho**: Vibe Match Harmonizer Quiz, Floating Glassmorphic Aesthetic Design System, Fate Machine Randomizer.

---
Made with ❤️ at TinkerHub Useless Projects 

![Static Badge](https://img.shields.io/badge/TinkerHub-24?color=%23000000&link=https%3A%2F%2Fwww.tinkerhub.org%2F)
![Static Badge](https://img.shields.io/badge/UselessProjects--26-26?link=https%3A%2F%2Ftinkerhub.org%2Fevents%2F1M8ORET9A1%2Fuseless-projects-3.0)
