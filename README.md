# Mohit Lovanshi - Developer Portfolio & Resume Website

A professional, high-performance Resume and Portfolio website built for Mohit Lovanshi's Web Development Internship evaluation. This project is crafted strictly using **semantic HTML5**, modern **CSS3**, and **Vanilla JavaScript (ES6+)** with **zero external front-end frameworks or heavyweight libraries**.

---

## 🌟 Project Overview

This portfolio serves as both an interactive professional showcase for **Mohit Lovanshi**, a Computer Science & Engineering undergraduate at **Chameli Devi Group of Institutions, Indore** and **Web Development Intern at InternWave**, and a practical web engineering demonstration.

All personal information, genuine projects (Smart India Hackathon and real estate applications), internship experience, and academic milestones have been imported from Mohit's repository (`MohitLovanshi372/portfolio-mohit372`) into this modern, responsive, and accessible architecture.

---

## 🗺️ Old Repository Content → New Portfolio Section Mapping

| Old Repository Source | Old Content / Asset | New Portfolio Section | New Implementation & Functionality |
| :--- | :--- | :--- | :--- |
| **Hero / Title** (`index.html`) | "Hi, I'm Mohit Lovanshi", typing roles (Full-Stack Developer, AI Enthusiast, Frontend Intern, B.Tech CSE) | **Home (`#home`)** | Clean modern Hero with dynamic Vanilla JS typewriter effect, availability status pill, code visualizer card, and quick CTAs. |
| **About Section** (`index.html`) | Bio: Passionate Full-Stack & AI developer, 6+ months experience, Indore M.P., Chameli Devi Group of Institutions | **About (`#about`)** | Two-column responsive layout with genuine photo card (`assets/img/profile/mohit-intern.png`), stats highlights (5+ Projects, 6+ Months Experience), and key personal attributes. |
| **Resume & Education** (`index.html`) | B.Tech CSE (2024-2028), Chameli Devi Group of Institutions, Indore; Certifications: IBM & Coursera | **Education (`#education`)** | Dedicated Academic Pathway section featuring degree details, coursework tags, and verified certification badges. |
| **Skills & Technologies** (`index.html`) | React.js, HTML5, CSS3, JavaScript, Node.js, Express, MongoDB, MySQL, Python, C, C++, UI/UX & Figma | **Skills (`#skills`)** | Interactive category filtering (**All**, **Frontend & UI**, **Backend & DB**, **Programming**, **Tools & Cloud**) with animated proficiency indicators. |
| **Portfolio / Projects** (`index.html`) | 3 Real Projects: Kisan Procurement Centre (SIH 2025), Smart Property Finder (2026), AutoHub Car Deal (2024-25) | **Projects (`#projects`)** | Real project cards with authentic screenshots, descriptions, tech tags, direct live demo buttons, and official GitHub repository links. |
| **Services** (`service-details.html`) | Student & Academic Web Development, Responsive Frontend, Full-Stack Integration, UI/UX Layouts | **Services (`#services`)** | Modern service cards with iconography, clear problem-solving descriptions, and engineering workflow checklists. |
| **Experience Timeline** (`index.html`) | Current: Web Development Intern at InternWave (Remote); Previous Experience: Frontend Developer Intern at AI Gen Technologies | **Resume (`#resume`)** | Two-column chronological career and education timeline with one-click **Print / Save Resume** functionality. |
| **Contact Info & Socials** (`index.html`, `portfolio-details.html`) | Email: `mohitlovanshi92@gmail.com`, Location: Indore M.P., GitHub: `MohitLovanshi372`, LinkedIn | **Contact (`#contact`)** | Verified contact channels and an interactive form with real-time field validation, character counter, and instant feedback. |
| **InternWave Requirements** | LocalStorage JSON mock database, Admin Login (`admin`/`password123`), Responses Dashboard, Light/Dark toggle, Google Apps Script preparation | **Admin Portal (`#admin`)** | Full client-side mock database with dynamic table and card views, live search, deletion, JSON/CSV exports, and Google Sheets integration modal. |

---

## 🚀 Key Features

1. **Semantic HTML5 Architecture:**
   - Structured with `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`, `<time>`, and appropriate ARIA attributes for accessibility and SEO.

2. **Full Responsive Design:**
   - Mobile-first layout implemented with CSS3 Flexbox and CSS Grid.
   - Smooth navigation drawer for mobile devices and clean sticky navbar with scroll shadow on desktops.

3. **Smooth Scrolling & Dynamic Navigation:**
   - Native CSS `scroll-behavior: smooth` with navigation offset.
   - High-performance `IntersectionObserver` ScrollSpy that dynamically highlights the active section in the navbar across all 8 portfolio sections plus the Admin portal.

4. **Light & Dark Theme Toggle:**
   - Seamless color theme toggle powered by CSS custom properties (variables).
   - Automatically detects OS preference (`prefers-color-scheme`) and persists user choices in `localStorage`.

5. **Animated Hero Typing Header:**
   - Dynamic typewriter effect cycling through Mohit's real professional titles in pure JavaScript without external libraries.

6. **Interactive Skills Categorization:**
   - Filter skills dynamically between **All**, **Frontend & UI**, **Backend & DB**, **Programming**, and **Tools & Cloud**.

7. **Contact Me Form with Validation:**
   - Fields: Name, Email, and Message.
   - Real-time character counter and input feedback (checks email regex, minimum character lengths, and prevents blank submissions).
   - Clear inline success feedback with timestamps.

8. **Browser LocalStorage Mock Database:**
   - Every contact form submission is parsed, packaged with a unique ID and ISO timestamp (`YYYY-MM-DD HH:MM:SS`), and saved as a JSON array in the browser's `localStorage`.
   - Data persists across browser refreshes and tab reopens.

9. **Admin Portal & Responses Dashboard:**
   - Authenticated Admin view (demo credentials provided below).
   - Toggles between the login form and the live responses management view.
   - Dynamic view switcher: **Table View** and **Card View**.
   - Real-time search filter by sender name, email, or message keyword.
   - Delete individual response items or clear all responses with confirmation.
   - Export submissions to downloadable `.json` or `.csv` spreadsheet files.
   - Secure Logout mechanism that invalidates the session and resets the view.

10. **Google Sheets Integration Architecture:**
    - Structured cleanly with a configurable Google Apps Script constant (`GOOGLE_SHEETS_CONFIG.APPS_SCRIPT_URL`).
    - If no URL is configured, it operates honestly in **LocalStorage Mock Mode** without claiming false integration.
    - If a valid Google Apps Script Web App URL is provided, it automatically dispatches submissions to your live Google Sheet while maintaining local storage as a fail-safe backup.

11. **GitHub Pages Ready:**
    - Uses standard relative asset paths (`./style.css`, `./script.js`, `./assets/...`).
    - Requires zero Node.js server runtime or build step to run in production.

---

## 🛠️ Technologies Used

- **HTML5:** Semantic markup, form attributes, accessibility tags.
- **CSS3:** Custom properties (CSS variables), Flexbox, CSS Grid, media queries, keyframe animations, light/dark themes.
- **Vanilla JavaScript (ES6+):** Async/Await, Fetch API, DOM manipulation, `IntersectionObserver`, `localStorage`, `sessionStorage`, JSON serialization.
- **No Heavyweight Frameworks:** No React, Vue, Angular, jQuery, or Bootstrap. Pure web platform standards.

---

## 📁 File Structure

```text
├── index.html       # Semantic HTML5 single-page portfolio layout
├── style.css        # Responsive CSS3 styles with Light & Dark theme tokens
├── script.js        # Vanilla JS logic (Themes, Form, LocalStorage, Admin, Filter)
├── assets/          # Real profile photos and project screenshot assets
│   ├── img/profile/ # Profile photos from Mohit's repository
│   └── img/portfolio/ # Authentic SIH and web app project screenshots
└── README.md        # Comprehensive documentation & setup guides
```

---

## 💻 How to Run Locally

### Method 1: Direct File Open (Easiest)
1. Download or clone this repository.
2. Double-click `index.html` or right-click and choose **Open with > Chrome / Firefox / Safari / Edge**.
3. All features (theme switching, local storage, form submissions, and admin dashboard) work directly in your browser.

### Method 2: VS Code Live Server Extension
1. Open the project folder in Visual Studio Code.
2. Install the **Live Server** extension (by Ritwick Dey).
3. Right-click `index.html` and select **"Open with Live Server"**.
4. The site will open at `http://127.0.0.1:5500/index.html`.

### Method 3: Using Python HTTP Server
```bash
# Python 3.x
python3 -m http.server 3000
```
Open `http://localhost:3000` in your web browser.

---

## 🔑 Demo Admin Credentials

For project evaluators and internship reviewers to test the Admin Responses section:

- **Username:** `admin`
- **Password:** `password123`

> **Note:** To quickly inspect the responses layout without typing into the contact form first, click the **"+ Add Sample Inquiries"** button inside the Admin Dashboard.

---

## 💾 How LocalStorage Works in this Application

1. When a user submits the Contact Form, the input values are validated.
2. An object is created with the following schema:
   ```json
   {
     "id": "resp-1727084532100-a4f2",
     "name": "Sarah Jenkins",
     "email": "sarah@company.com",
     "message": "We would like to interview you for our front-end internship role.",
     "timestamp": "2026-09-23 10:45:00"
   }
   ```
3. Existing entries are retrieved from browser storage:
   ```javascript
   const existing = JSON.parse(localStorage.getItem('devfolio_contact_responses') || '[]');
   ```
4. The new record is unshifted to the front of the array and serialized back:
   ```javascript
   existing.unshift(newEntry);
   localStorage.setItem('devfolio_contact_responses', JSON.stringify(existing));
   ```
5. When an administrator logs into the Admin Portal, JavaScript deserializes this array and dynamically creates the HTML table rows and card elements.

---

## 📊 How to Configure Google Apps Script (Google Sheets Integration)

The application code is already structured to forward submissions to Google Sheets once you configure your Web App endpoint.

### Step 1: Create Your Google Sheet
1. Go to [Google Sheets](https://sheets.new) and create a new blank spreadsheet.
2. Set the first row headers:
   - Cell `A1`: `Timestamp`
   - Cell `B1`: `Name`
   - Cell `C1`: `Email`
   - Cell `D1`: `Message`

### Step 2: Open Google Apps Script
1. In your Google Sheet, click **Extensions** > **Apps Script**.
2. Erase any default code in `Code.gs` and paste the following snippet:

```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var payload = JSON.parse(e.postData.contents);
    
    // Append row: [Timestamp, Name, Email, Message]
    sheet.appendRow([
      payload.timestamp || new Date().toISOString(),
      payload.name || "Anonymous",
      payload.email || "No Email",
      payload.message || "No Message"
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: "success", message: "Row added" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

### Step 3: Deploy as a Web App
1. Click the blue **Deploy** button (top right) > **New deployment**.
2. Select type: **Web app**.
3. Set **Execute as:** `Me` and **Who has access:** `Anyone`.
4. Click **Deploy**, authorize permissions, and copy the **Web app URL**.

### Step 4: Link to Your Portfolio
- **In UI:** Log into the Admin Portal on the website, click **"Google Sheets Settings"**, paste your URL, and click **Save Settings**.
- **In Code:** Open `script.js` and set:
  ```javascript
  const GOOGLE_SHEETS_CONFIG = {
    APPS_SCRIPT_URL: "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec",
    ENABLE_LOCAL_BACKUP: true
  };
  ```

---

## 🌐 How to Deploy on GitHub Pages

1. In your terminal inside the project directory:
   ```bash
   git init
   git add .
   git commit -m "feat: Mohit Lovanshi personal portfolio with InternWave requirements"
   git branch -M main
   git remote add origin https://github.com/MohitLovanshi372/portfolio-mohit372.git
   git push -u origin main
   ```
2. In your GitHub repository:
   - Go to **Settings** > **Pages**.
   - Under **Build and deployment > Source**, select **Deploy from a branch**.
   - Under **Branch**, select `main` and `/ (root)`.
   - Click **Save**.
3. Your live URL will be active at `https://MohitLovanshi372.github.io/portfolio-mohit372/`.
