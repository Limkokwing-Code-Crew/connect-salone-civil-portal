# SaloneHub — Presentation Script

## Slide 1: Title Slide

**Speaker:** "Good morning/afternoon. My name is [Name], and I'm here to present SaloneHub — a civic portal designed to make government services more accessible for every citizen of Sierra Leone."

**[Hold for a moment]**

---

## Slide 2: The Problem We Discovered

**Speaker:** "Before we built anything, we went out and talked to real citizens. We asked them about their experiences dealing with the government. Here's what we heard:"

**[Pause, then deliver with emphasis]**

**Speaker:** "One citizen told us: *'I went to four different offices just to renew my passport. Nobody told me I needed a birth certificate until I got there.'*"

**Speaker:** "Another said: *'I don't know who my MP is. I wouldn't even know where to start if I needed help.'*"

**Speaker:** "And this was common: *'The forms are all in English. My mother only speaks Krio — she can't use any of this.'*"

**Speaker:** "We identified three core problems:"

1. **Information is fragmented** — No central place to find what documents, fees, and steps are needed for any government service
2. **No connection to representatives** — Citizens don't know who their MP or local councillor is or how to contact them
3. **Language barrier** — Most civic information is only in English, excluding millions of Sierra Leoneans

---

## Slide 3: The Solution — SaloneHub

**Speaker:** "So we built SaloneHub — one web application that brings together everything a citizen needs:"

- **Service Directory** — Search any government service, see the exact documents, fees, processing time, and locations
- **Representative Finder** — Find your MP or local councillor by district
- **AI Assistant** — Ask questions in plain language about any government process
- **Civic News** — Stay updated on government announcements
- **Multi-language** — Available in English, Krio, Mende, and Temne

**Speaker:** "And critically — the Service Directory includes warnings about corruption. Every service lists official fees and warns: *'Beware of middlemen; registration is free.'* This was directly inspired by what citizens told us."

---

## Slide 4: Live Demo

**Speaker:** "Let me show you how it works."

**[Open browser to https://connect-salone-civil-portal-peach.vercel.app]**

**Speaker:** "Here's the homepage. Notice the Services tab is open by default — that's intentional. Any citizen can browse services without logging in."

**[Click a few services — Voter Registration, National ID, Passport Renewal]**

**Speaker:** "I can search for 'passport' and instantly see all the details: the fee, processing time, required documents, and locations. I can also see warnings — like here: *'Do not pay extra for express outside office.'* This is the kind of information citizens told us they never have before they arrive at an office."

**[Click on the News tab — it shows 🔒]**

**Speaker:** "Now if I try to access Chat, Representatives, or News, I get a lock icon. Clicking it shows..."

**[Click the locked tab → LoginPromptModal appears]**

**Speaker:** "...a prompt asking me to sign in. This is because those features require an account — but the Service Directory stays open for everyone."

**[Click "Sign In" → navigates to /login]**

**Speaker:** "Here's the login page. A citizen can sign in, sign up, or reset their password. Let me sign in as an admin."

**[Type: admin@salonehub.sl / admin1234]**

**Speaker:** "Now I'm signed in. I can access the Chat, Representatives, and News tabs. You can also see the welcome message with my name."

**[Click Representatives tab]**

**Speaker:** "The Representative Finder lets me search by district or role. Let's look at Freetown — I can see MPs and Local Councillors with their phone numbers and emails."

**[Click Chat tab]**

**Speaker:** "This is the AI Assistant. It's powered by Groq's Llama model and is specifically trained on Sierra Leone government processes. Let me ask it something..."

**[Type: "How do I register my business in Sierra Leone?"]**

**Speaker:** "It gives a clear step-by-step answer. This is useful for citizens who don't know where to start."

**[Click the gear icon → Admin Dashboard]**

**Speaker:** "For administrators, there's a full dashboard with statistics, the ability to add or edit services, manage representatives, moderate feedback, and create news articles. Every action is logged for accountability."

---

## Slide 5: How It Works — Architecture

**Speaker:** "Let me quickly explain how we built this."

**[Show simple architecture diagram if possible, or describe]**

**Speaker:** "The frontend is a React single-page application styled with Tailwind CSS. It's deployed on Vercel."

**Speaker:** "The backend runs on Convex Cloud — that's a serverless platform that gives us a database, server functions, and authentication all in one SDK."

**Speaker:** "When a user signs in, the Convex Auth library verifies their password, issues a signed JWT token, and the client stores it. Every server function checks that token before returning data."

**Speaker:** "The AI chat works by calling Groq's API — a fast inference provider running Llama 3.1 — with a system prompt specifically written for Sierra Leone government procedures."

**Speaker:** "We support four languages using i18next: English, Krio, Mende, and Temne. The translations are stored in JSON files and switched client-side."

---

## Slide 6: Challenges We Overcame

**Speaker:** "Building this wasn't straightforward. Let me share three challenges we faced."

**Challenge 1 — The Blank Screen**
**Speaker:** "We initially used React Router for navigation. When we deployed to production, the page was completely blank. The issue was React Router v7's new routing behavior conflicting with Vercel's SPA setup. We fixed it by removing React Router entirely and handling routing manually with pathname detection — simpler and more reliable."

**Challenge 2 — Authentication on Production**
**Speaker:** "Locally, authentication worked perfectly. But on production, signing in would fail silently. The issue was missing environment variables — the Convex Auth library requires JWT signing keys and a site URL. These were set in our local `.env` file but not on the production deployment. We set them and it worked."

**Challenge 3 — Seed Data Passwords**
**Speaker:** "Our test user passwords were 7 characters, but the library requires minimum 8. After fixing the passwords, we discovered the accounts already existed with the old passwords. We had to write a cleanup mutation that deletes old accounts before re-seeding."

---

## Slide 7: What We Learned

**Speaker:** "Through user interviews, we learned that:"

- Citizens make multiple trips because they don't know requirements in advance
- Most people don't know who their representatives are
- Language is a real barrier — information in local languages is critical
- Corruption is a concern — people want to know official fees upfront

**Speaker:** "And technically, we learned:"

- Real-time databases like Convex eliminate state management complexity
- Testing on production early catches environment-specific bugs
- Code splitting is essential for performance on low-bandwidth connections
- PWA support makes the app feel native on mobile devices

---

## Slide 8: Future Improvements

**Speaker:** "If we had more time, here's what we'd add:"

1. **OAuth login** — Google and Facebook sign-in for convenience
2. **Email-based password reset** — Currently codes display on-screen for the demo
3. **Mobile app** — React Native version for offline access
4. **SMS notifications** — Alert citizens when service fees change or new reps are added
5. **Feedback analytics** — Dashboard showing common complaints by region
6. **CI/CD pipeline** — Automated testing before deployment
7. **More languages** — Add Limba and other Sierra Leonean languages

---

## Slide 9: Conclusion

**Speaker:** "SaloneHub addresses a real need we heard directly from citizens. It makes government services transparent, representatives accessible, and civic information available in local languages."

**Speaker:** "We believe this is a foundation that can grow — and with the right partnerships, could make a meaningful difference in how Sierra Leoneans interact with their government."

**[Pause]**

**Speaker:** "Thank you. I'm happy to answer any questions."

---

## Q&A Preparation

### Expected questions and answers:

**Q: "Why Convex and not a traditional database?"**
> "Convex gives us a database, server functions, and authentication in one SDK without managing REST endpoints. Queries automatically update when data changes, which eliminated manual state management. For a project our size, it saved weeks of backend setup."

**Q: "How do you prevent unauthorized access?"**
> "Two layers. On the backend, every mutation checks the user's identity and admin role, throwing an error if unauthorized. On the frontend, admin controls only render when the isAdmin query returns true. Both layers must pass."

**Q: "Is this deployed and accessible?"**
> "Yes. The frontend is live at `connect-salone-civil-portal-peach.vercel.app`. Anyone can browse services without signing in. Test accounts are available for evaluating the full experience."

**Q: "How accurate is the AI assistant?"**
> "The AI is powered by Groq's Llama 3.1 with a system prompt written specifically for Sierra Leone government procedures. It gives reasonable answers for common processes, but we include a disclaimer that users should verify with the official agency. The Service Directory is the authoritative source."

**Q: "How did you handle translations?"**
> "We used i18next, a standard React internationalization library. A native speaker reviewed each translation file. The languages are English, Krio, Mende, and Temne — covering the most widely spoken languages in Sierra Leone."

**Q: "What security measures are in place?"**
> "Passwords are hashed with scrypt. Sessions use RS256-signed JWTs. Rate limiting prevents brute force attacks on login and API abuse on the chat endpoint. Admin actions are logged in an audit trail."

**Q: "How scalable is this?"**
> "Convex scales automatically — we don't manage servers. Vercel's CDN serves the frontend globally. The chat is rate-limited to prevent abuse. For a national rollout, we'd add caching and optimize database queries."
