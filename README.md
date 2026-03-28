# Eve Clinic - OB/GYN Clinic Management System

A comprehensive, production-level web application for managing an OB/GYN clinic. Built with Next.js, Firebase, and Tailwind CSS.

## Features

### Core Modules

- **Patient Management**: Complete patient profiles with auto-generated IDs
- **Obstetrics Calculator**: Calculate EGA, EDD from LMP with trimester info
- **Lab Results**: 25+ predefined tests with auto-interpretation
- **Medications**: Track patient medications with dosage and frequency
- **Imaging Records**: Ultrasound, CT, MRI, X-Ray tracking
- **Visit Management**: Visit notes with vital signs and follow-up scheduling

### Key Features

- **Real-time Sync**: All data syncs instantly across devices using Firebase
- **Mobile-First Design**: Optimized for phone and tablet use
- **Dark Mode**: Toggle between light and dark themes
- **PWA Support**: Install as a standalone app on mobile devices
- **Quick Actions**: Fast access to common tasks from patient page
- **Search & Filter**: Find patients by name, ID, or phone number

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Database**: Firebase Firestore (real-time)
- **Icons**: Lucide React
- **Date Handling**: date-fns

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Firebase account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd eve-clinic-web
```

2. Install dependencies:
```bash
npm install
```

3. Configure Firebase:
   - Create a Firebase project at https://console.firebase.google.com
   - Enable Firestore Database
   - Copy your Firebase config to `app/lib/firebase.ts`

4. Run the development server:
```bash
npm run dev
```

5. Open http://localhost:3000 in your browser

### Firebase Configuration

Update `app/lib/firebase.ts` with your Firebase config:

```typescript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-auth-domain",
  projectId: "your-project-id",
  storageBucket: "your-storage-bucket",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

## Deployment

### Deploy to Firebase Hosting

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Login to Firebase:
```bash
firebase login
```

3. Initialize Firebase:
```bash
firebase init
```

4. Build and deploy:
```bash
npm run build
firebase deploy
```

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy with one click

## Project Structure

```
eve-clinic-web/
├── app/
│   ├── components/     # Reusable components
│   ├── hooks/          # Custom React hooks for Firebase
│   ├── lib/            # Firebase configuration
│   ├── types/          # TypeScript types
│   ├── utils/          # Utility functions
│   ├── patients/       # Patient-related pages
│   ├── calculator/     # Obstetrics calculator
│   ├── settings/       # Settings page
│   ├── globals.css     # Global styles
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Home page
├── public/             # Static assets
└── package.json
```

## Usage

### Adding a Patient

1. Click "Add Patient" on the home screen
2. Fill in patient details
3. For pregnant patients, check "Currently Pregnant" and enter LMP
4. Save the patient

### Using the Calculator

1. Navigate to the Calculator tab
2. Select calculation mode (LMP, EDD, or EGA)
3. Enter the date or values
4. View automatic calculations

### Adding Lab Results

1. Open a patient profile
2. Click "Add Lab" from Quick Actions
3. Select the test type
4. Enter result value
5. Enable auto-interpret for automatic status

### Adding a Visit

1. Open a patient profile
2. Click "Add Visit" from Quick Actions
3. Fill in visit details
4. Optionally add vital signs
5. Save the visit

## Data Model

### Patient
- Auto-generated unique ID
- Personal information (name, phone, email)
- Pregnancy status and dates
- Obstetric history (G/P/A/L)

### Lab Result
- Test name and code
- Result value with unit
- Reference range
- Auto-interpreted status (normal/abnormal)

### Medication
- Drug name and dose
- Frequency and duration
- Active/inactive status

### Visit
- Date and chief complaint
- Diagnosis and plan
- Vital signs
- Follow-up date

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

This project is for clinical use. Ensure compliance with local healthcare data regulations.

## Support

For issues or feature requests, please contact the development team.
