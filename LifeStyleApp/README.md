# LifeCoach — Personal Wellness Coaching App

A modern, full-featured lifestyle coaching web application built with React and TypeScript. Track your workouts, log nutrition, visualize progress over time, and receive personalized coaching recommendations — all in one place.

![Dashboard](https://img.shields.io/badge/React-18-61DAFB?logo=react) ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript) ![Tailwind](https://img.shields.io/badge/Tailwind-3-06B6D4?logo=tailwindcss) ![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite)

---

## Features

### Onboarding
- 3-step setup wizard collecting personal info (name, age, weight, height, gender)
- Goal selection: **Lose Weight**, **Build Muscle**, **Stay Healthy**, or **Boost Endurance**
- Activity level picker with automatic **BMR / TDEE calculation**
- Personalized daily calorie and macro targets (protein, carbs, fat) generated on completion
- Optional 30-day sample data load to explore the app immediately

### Dashboard
- Personalized greeting with today's date and remaining calories
- Live **Lifestyle Score** (0–100 with letter grade) based on recent activity
- Stat cards: calories consumed, workouts today, protein intake, current weight
- **7-day calorie trend** area chart vs. daily target
- Workout consistency circles for the past 7 days
- Today's macro progress bars (protein / carbs / fat)
- Top 3 coaching recommendations surfaced inline
- Quick-action buttons to jump to any section

### Workout Tracker
- **Template quick-start**: Push Day, Pull Day, Leg Day, Upper Body, Lower Body, Full Body, Cardio
- **Custom workout** creation with free-form naming
- Exercise search modal with 57 exercises across 7 muscle groups (Chest, Back, Shoulders, Arms, Legs, Core, Full Body)
- Filter exercises by muscle group or search by name
- Per-exercise set logging: reps, weight (kg), and completion checkbox for each set
- Add / remove individual sets; default 3 sets added automatically
- **Cardio logging**: type (10 options), duration, distance, calories burned, average heart rate
- Workout history list with expandable detail cards
- Date navigation to view or log workouts on any past date

### Nutrition Tracker
- **4 meal sections**: Breakfast, Lunch, Dinner, Snacks — each expandable with per-food detail
- **Calorie ring** showing percentage of daily goal consumed
- **Macro breakdown pie chart** (protein / carbs / fat in calories)
- Protein, carbs, and fat progress bars vs. daily targets
- Food search modal with **60 common foods** across 10 categories
- Category filters: Protein, Eggs & Dairy, Plant Protein, Grains, Fruit, Vegetables, Nuts & Fats, Snacks, Beverages
- Live **nutrition preview** (calories, protein, carbs, fat, fiber) as quantity is adjusted
- Quantity adjuster with +/– buttons; all values scaled per 100g
- Foods logged with full macro breakdown visible inline
- Date navigation to review or edit any past day's meals

### Progress & Analytics
- **Time range selector**: 7 days, 30 days, 90 days, or all time
- Summary stat cards: total workouts, average daily calories, weight change, total cardio time
- **Weight History** line chart with all logged weigh-ins
- **Calorie Intake** area chart vs. target line
- **Workout Frequency** bar chart (sessions per week, color-coded by volume)
- **Macro Trend** area chart (protein, carbs, fat over last 14 days)
- **Weight log**: add body weight + optional body fat %, delete past entries
- All charts update dynamically with the selected time range

### Personal Coaching
- **Wellness Score gauge** (SVG arc, 0–100, A+ → C grade) updated from real data
- **Goal program card**: tailored focus description and progress target status badges (On Track / Close / Needs Work)
- 14-day averages for calories and protein displayed in context
- **Personalized recommendations** engine — up to 6 cards ranked by priority:
  - Workout frequency warnings and encouragement
  - Protein intake assessment relative to goal
  - Calorie adherence feedback (over or under target)
  - Weight trend alignment with goal
  - Recovery / overtraining detection
  - Cardio suggestions for weight-loss and endurance goals
  - Consistency celebration when streak is strong
- Each recommendation includes a category badge, priority badge, description, and specific **Action Plan**
- **Evidence-Based Tips** section: Progressive Overload, Protein Timing, Sleep for Recovery, Hydration

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Build | Vite 6 |
| Styling | Tailwind CSS 3 |
| Charts | Recharts 2 |
| Icons | Lucide React |
| State | React Context + useReducer |
| Persistence | localStorage |
| Dates | date-fns |

No backend required — all data lives in the browser's localStorage.

---

## Getting Started

### Prerequisites
- Node.js 18+ (tested on Node 24)

### Install & Run

```bash
cd LifeStyleApp
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

---

## Project Structure

```
LifeStyleApp/
├── src/
│   ├── components/
│   │   ├── coaching/        # CoachingPanel — score gauge, recommendations
│   │   ├── dashboard/       # Dashboard — overview, charts, quick stats
│   │   ├── layout/          # Sidebar, Layout, header with date nav
│   │   ├── nutrition/       # NutritionTracker — meals, food search modal
│   │   ├── onboarding/      # Onboarding — 3-step wizard
│   │   ├── progress/        # ProgressDashboard — 4 charts, weight log
│   │   └── workout/         # WorkoutTracker — exercises, sets, cardio
│   ├── contexts/
│   │   └── AppContext.tsx   # Global state (user, workouts, nutrition, weights)
│   ├── data/
│   │   ├── foodDatabase.ts  # 60 foods with full macro data
│   │   └── exerciseDatabase.ts # 57 exercises + cardio types + templates
│   ├── types/
│   │   └── index.ts         # All TypeScript interfaces
│   └── utils/
│       ├── calculations.ts  # BMR, TDEE, macro targets, lifestyle score
│       ├── coaching.ts      # Recommendation engine
│       └── sampleData.ts    # 30-day demo data generator
```
