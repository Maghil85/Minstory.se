# 📖 Minstory.se - Build a Personal Story Platform

En modern React (Vite) webbplats för att skapa personliga berättelser. Plattformen är designad för att låta människor skapa böcker där deras nära är huvudpersoner.

## 🎯 Features

### MVP (Current)
- ✅ **Landing page** - Elegant presentation av tjänsten
- ✅ **Story Types** - Välja mellan 6 berättelsetyper
- ✅ **How It Works** - Enkelt 3-steg process
- ✅ **Examples** - Visa exempel på möjliga berättelser
- ✅ **Pricing** - Två prissättningsmodeller
- ✅ **Create Story Form** - Komplett formulär med state management
- ✅ **Responsive Design** - Fungerar perfekt på mobil/tablet/desktop

### Tech Stack
- **React 19** - UI framework
- **Vite** - Build tool
- **Inline CSS** - Enkelt att anpassa design
- **JavaScript (ES6+)** - Modernt JavaScript

## 🚀 Få igång Projektet

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```
Besök `http://localhost:5173`

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## 📁 Projektstruktur

```
src/
├── components/
│   ├── Header.jsx             # Navigation header
│   ├── HeroSection.jsx        # Startsida med preview
│   ├── StoryTypesSection.jsx  # Välj berättelsetyp
│   ├── HowItWorks.jsx         # 3-steg guide
│   ├── Examples.jsx           # Exempel på böcker
│   ├── Pricing.jsx            # Prissättning & FAQ
│   ├── CreateStoryForm.jsx    # Huvudformulär
│   ├── Footer.jsx             # Footer med kontakt
│   ├── UI.jsx                 # Återanvändbara UI-komponenter
│   └── index.js               # Component exports
├── styles/
│   └── theme.js               # Design system (colors, spacing, etc)
├── App.jsx                    # Main app
├── main.jsx                   # Entry point
├── App.css                    # Legacy CSS (kan tas bort)
├── index.css                  # Global styles
└── index.html
```

## 🎨 Design System

### Färgpalett
- **Primär:** `#6C63FF` (Lila/Purple)
- **Pasteller:** Lila, Blå, Rosa, Grön
- **Neutrala:** Vita, grå, svart toner

### Spacing
- xs: 6px, sm: 10px, md: 12px, lg: 16px, xl: 18px
- 2xl: 24px, 3xl: 28px, 4xl: 32px, 5xl: 60px

### Komponenter
Alla UI-komponenter är i `components/UI.jsx`:
- **Buttons:** `PrimaryButton`, `SecondaryButton`
- **Forms:** `Input`, `Textarea`, `Select`, `DarkInput`, `DarkTextarea`
- **Cards:** `Card`, `ExampleTile`, `PriceCard`, `StoryTypeCard`
- **Navigation:** `NavLink`, `Badge`

## 🔥 Firebase Integration (Ready)

CreateStoryForm är strukturerad så att den enkelt kan integreras med Firebase.

### Nästa steg för Firebase:

1. **Installera Firebase:**
```bash
npm install firebase
```

2. **Skapa `src/firebase/config.js`:**
```javascript
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
```

3. **Uppdatera `CreateStoryForm.jsx` handleSubmit:**
```javascript
import { db } from '../firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const handleSubmit = async (e) => {
  e.preventDefault();
  
  try {
    const docRef = await addDoc(collection(db, 'stories'), {
      ...formData,
      createdAt: serverTimestamp(),
      status: 'pending'
    });
    console.log('Bok sparad med ID:', docRef.id);
    setIsSubmitted(true);
  } catch (error) {
    console.error('Fel vid sparning:', error);
    alert('Något gick fel, försök igen');
  }
};
```

4. **Lägg till environment variables i `.env.local`:**
```
VITE_REACT_APP_FIREBASE_API_KEY=...
VITE_REACT_APP_FIREBASE_AUTH_DOMAIN=...
VITE_REACT_APP_FIREBASE_PROJECT_ID=...
VITE_REACT_APP_FIREBASE_STORAGE_BUCKET=...
VITE_REACT_APP_FIREBASE_MESSAGING_SENDER_ID=...
VITE_REACT_APP_FIREBASE_APP_ID=...
```

## 📊 Form Data Structure

Formuläret skickar denna struktur (inkludera i Firebase):
```javascript
{
  storyType: "fairy-tale" | "love-story" | "adventure" | "humor" | "life-story" | "custom",
  personName: string,
  personAge: number | null,
  relation: "parent" | "partner" | "friend" | "sibling" | "grandparent" | "other",
  description: string,
  storyIdea: string,
  email: string,
  createdAt: timestamp,
  status: "pending" | "in-progress" | "completed"
}
```

## 📱 Responsive Breakpoints

- **Desktop:** 1280px+
- **Tablet:** 768px - 1023px
- **Mobile:** < 768px

Alla komponenter är responsiva och använder CSS-variabler för sizing.

## 🎯 UX Förbättringar

1. **Preview i Hero** - Se bokförslaget uppdatering i realtid
2. **Story Type Selection** - Interaktiv väljare med visuell feedback
3. **Progressive Form** - Formuläret är intuitivt och enkelt att fylla
4. **Confirmation Screen** - Bekräftelse efter submit
5. **Smooth Scrolling** - Snygg navigation mellan sektioner

## 🔧 Customization

### Ändra Färger
I `src/styles/theme.js` - uppdatera `colors`-objektet

### Ändra Story Types
I `src/styles/theme.js` - uppdatera `storyTypes`-arrayen

### Ändra Text
Direkt i komponenterna eller skapa en `locales/sv.js` för translation

## 📚 Användbara Resurser

- [React Docs](https://react.dev)
- [Vite Docs](https://vitejs.dev)
- [Firebase Docs](https://firebase.google.com/docs)

## ✅ Checklist för Production

- [ ] Lägg till Firebase integration
- [ ] Implementera email notifications
- [ ] Lägg till betalningsgateway (Stripe/Adyen)
- [ ] Skapa user authentication
- [ ] Lägg till admin dashboard
- [ ] SEO optimization
- [ ] Analytics (Google Analytics/Plausible)
- [ ] Legal pages (Privacy Policy, Terms)
- [ ] Email templates för bokförslag

## 📝 License

Made with ❤️ for personal stories.

---

**Questions?** Kontakta: hello@minstory.se (placeholder)
