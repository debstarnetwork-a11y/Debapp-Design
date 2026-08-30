# Future Migration Framework

This folder contains the blueprints you need to migrate this application away from Supabase to a fully custom backend architecture (like an Express.js or Python server).

## 1. Database Schema (`schema.sql`)
This file contains the exact PostgreSQL table structures currently powering your app (Settings, Gallery, Contact Submissions). 
- When you set up a new database, simply run this `.sql` file to instantly recreate your database structure.

## 2. Environment Variables (`.env.custom-backend.example`)
This file shows the standard environment variables a custom Node.js/Express backend would need to run this app, manage admin authentication securely, and send newsletter emails.

## 3. Frontend React Changes Needed
When you migrate, you will modify the React application in the following ways:

1. **Remove Supabase SDK:** Delete `src/lib/supabase.ts` and uninstall the `@supabase/supabase-js` package.
2. **Update API Calls:** Wherever the code currently uses Supabase syntax (e.g., `supabase.from('gallery').select()`), you will replace it with standard JavaScript `fetch` calls to your new backend API.

**Example of Old Code:**
```typescript
const { data } = await supabase.from('gallery').select('*');
```

**Example of Future Code:**
```typescript
const response = await fetch('https://api.yourdomain.com/gallery');
const data = await response.json();
```

## 4. Admin Authentication
Instead of using Supabase Auth, your custom backend will need a login route (e.g., `POST /api/login`) that checks the admin email/password, and returns a secure JWT (JSON Web Token) that your React app stores in `localStorage` or secure cookies to protect the dashboard.
