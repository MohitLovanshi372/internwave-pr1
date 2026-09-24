/**
 * ==============================================================================
 * DevFolio - Vanilla JavaScript Application
 * Tech Stack: HTML5, CSS3, Vanilla JavaScript (No Frameworks)
 * Author: Web Development Intern Portfolio
 * Features:
 *  - Theme Toggle (Dark / Light Mode) with LocalStorage persistence
 *  - Responsive Mobile Navigation & Smooth Section Scrolling
 *  - ScrollSpy active link highlighting with IntersectionObserver
 *  - Animated typing header in Hero section
 *  - Interactive Skills Category Filter
 *  - Contact Form with live validation & LocalStorage mock database
 *  - Admin Portal with JS Auth, Responses Viewer (Table/Card view), Export & Delete
 *  - Configurable Google Apps Script Integration endpoint architecture
 * ==============================================================================
 */

// Strict mode for cleaner and safer JavaScript execution
"use strict";

// ==============================================================================
// 1. CONFIGURATION & CONSTANTS
// ==============================================================================

/**
 * GOOGLE SHEETS INTEGRATION CONFIGURATION
 * ------------------------------------------------------------------------------
 * How to connect Google Sheets (Full instructions in README.md):
 * 1. Open Google Sheets and create a new spreadsheet.
 * 2. Navigate to Extensions > Apps Script.
 * 3. Paste the Web App script provided in the README.md.
 * 4. Click Deploy > New deployment > Select type "Web app".
 * 5. Set 'Execute as' to "Me", and 'Who has access' to "Anyone".
 * 6. Copy the generated Web App URL and paste it into APPS_SCRIPT_URL below.
 *
 * NOTE: When APPS_SCRIPT_URL is an empty string, the application operates in
 * LocalStorage Mock Database mode. It will NOT falsely claim Google Sheets
 * is connected unless an endpoint is configured.
 */
const GOOGLE_SHEETS_CONFIG = {
  // Replace with your Google Apps Script Web App URL when ready
  APPS_SCRIPT_URL: "",
  // Keep local backup even when sending to Google Sheets
  ENABLE_LOCAL_BACKUP: true,
  // Timeout in milliseconds for Google Sheets fetch
  REQUEST_TIMEOUT_MS: 8000
};

// LocalStorage Keys
const STORAGE_KEYS = {
  THEME: "devfolio_theme",
  CONTACTS: "devfolio_contact_responses",
  ADMIN_SESSION: "devfolio_admin_session",
  CUSTOM_SHEETS_URL: "devfolio_custom_sheets_url"
};

// Demo Admin Credentials (for internship review & demonstration)
const ADMIN_CREDENTIALS = {
  USERNAME: "admin",
  PASSWORD: "password123"
};

// Typing animation words for Mohit Lovanshi's hero subtitle
const TYPING_ROLES = [
  "Web Development Intern",
  "Full-Stack Developer",
  "AI Enthusiast",
  "B.Tech CSE Student",
  "Frontend Developer"
];

// Sample responses for quick review if evaluator wants to inspect UI immediately
const INITIAL_DEMO_RESPONSES = [
  {
    id: "demo-1",
    name: "AI Gen Technologies HR",
    email: "hr@aigentechnologies.com",
    message: "Hi Mohit! Your work on frontend UI components and responsive design during the internship was impressive. Great progress on your portfolio!",
    timestamp: "2026-09-21 14:30:15"
  },
  {
    id: "demo-2",
    name: "Chameli Devi Project Coordinator",
    email: "faculty@cdgi.edu.in",
    message: "Mohit, your Kisan Procurement Centre project demonstration was well received. Keep up the good work on your full-stack journey.",
    timestamp: "2026-09-22 09:15:40"
  }
];

// ==============================================================================
// 2. DOM ELEMENT REFERENCES
// ==============================================================================
const DOM = {
  html: document.documentElement,
  themeToggleBtn: document.getElementById("themeToggleBtn"),
  navHamburger: document.getElementById("navHamburger"),
  navMenu: document.getElementById("navMenu"),
  navLinks: document.querySelectorAll(".nav-link"),
  header: document.querySelector(".header"),
  typingElement: document.getElementById("typingRoleText"),
  
  // Skills Filter
  filterBtns: document.querySelectorAll(".filter-btn"),
  skillCards: document.querySelectorAll(".skill-card"),

  // Contact Form
  contactForm: document.getElementById("contactForm"),
  inputName: document.getElementById("contactName"),
  inputEmail: document.getElementById("contactEmail"),
  inputMessage: document.getElementById("contactMessage"),
  nameError: document.getElementById("nameError"),
  emailError: document.getElementById("emailError"),
  messageError: document.getElementById("messageError"),
  charCount: document.getElementById("messageCharCount"),
  formFeedback: document.getElementById("formFeedback"),
  submitBtn: document.getElementById("submitContactBtn"),

  // Admin Portal & Responses
  adminLoginBox: document.getElementById("adminLoginBox"),
  adminDashboard: document.getElementById("adminDashboard"),
  adminLoginForm: document.getElementById("adminLoginForm"),
  adminUsernameInput: document.getElementById("adminUsername"),
  adminPasswordInput: document.getElementById("adminPassword"),
  adminLoginError: document.getElementById("adminLoginError"),
  adminLogoutBtn: document.getElementById("adminLogoutBtn"),
  adminNavBtn: document.getElementById("adminNavBtn"),

  // Responses Viewer Elements
  responsesCountBadge: document.getElementById("responsesCountBadge"),
  responsesTableBody: document.getElementById("responsesTableBody"),
  responsesTableWrapper: document.getElementById("responsesTableWrapper"),
  responsesCardsContainer: document.getElementById("responsesCardsContainer"),
  emptyResponsesState: document.getElementById("emptyResponsesState"),
  searchResponsesInput: document.getElementById("searchResponsesInput"),
  viewTableBtn: document.getElementById("viewTableBtn"),
  viewCardsBtn: document.getElementById("viewCardsBtn"),
  clearAllResponsesBtn: document.getElementById("clearAllResponsesBtn"),
  exportJsonBtn: document.getElementById("exportJsonBtn"),
  exportCsvBtn: document.getElementById("exportCsvBtn"),
  populateDemoBtn: document.getElementById("populateDemoBtn"),
  sheetsStatusText: document.getElementById("sheetsStatusText"),
  sheetsStatusPill: document.getElementById("sheetsStatusPill"),
  configureSheetsBtn: document.getElementById("configureSheetsBtn"),

  // Modals & Sheets Config
  sheetsConfigModal: document.getElementById("sheetsConfigModal"),
  closeSheetsModalBtn: document.getElementById("closeSheetsModalBtn"),
  sheetsUrlInput: document.getElementById("sheetsUrlInput"),
  saveSheetsUrlBtn: document.getElementById("saveSheetsUrlBtn"),
  resetSheetsUrlBtn: document.getElementById("resetSheetsUrlBtn"),
  toastContainer: document.getElementById("toastContainer")
};

// Global state
const appState = {
  currentView: "table", // 'table' | 'cards'
  currentFilterQuery: "",
  typingIndex: 0,
  charIndex: 0,
  isDeleting: false
};

// ==============================================================================
// 3. THEME MANAGEMENT (Dark / Light)
// ==============================================================================

/**
 * Initializes the theme based on localStorage or OS system preference.
 */
function initTheme() {
  const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
  
  if (savedTheme) {
    applyTheme(savedTheme);
  } else {
    // Default to the light pink theme
    applyTheme("light");
  }
}

/**
 * Applies theme string to the root <html> element and stores in localStorage.
 * @param {"light" | "dark"} theme
 */
function applyTheme(theme) {
  DOM.html.setAttribute("data-theme", theme);
  localStorage.setItem(STORAGE_KEYS.THEME, theme);
  
  if (DOM.themeToggleBtn) {
    DOM.themeToggleBtn.setAttribute(
      "aria-label",
      theme === "dark" ? "Switch to light theme" : "Switch to dark theme"
    );
  }
}

/**
 * Toggles between light and dark themes.
 */
function toggleTheme() {
  const currentTheme = DOM.html.getAttribute("data-theme") || "light";
  const nextTheme = currentTheme === "dark" ? "light" : "dark";
  applyTheme(nextTheme);
  showToast(`Switched to ${nextTheme} mode`, "info");
}

// ==============================================================================
// 4. NAVIGATION & MOBILE MENU
// ==============================================================================

/**
 * Setup mobile drawer open/close and auto-close when clicking links.
 */
function initNavigation() {
  // Mobile hamburger toggle
  if (DOM.navHamburger && DOM.navMenu) {
    DOM.navHamburger.addEventListener("click", () => {
      const isExpanded = DOM.navHamburger.classList.toggle("is-active");
      DOM.navMenu.classList.toggle("is-active");
      DOM.navHamburger.setAttribute("aria-expanded", String(isExpanded));
    });

    // Close mobile menu when clicking any nav link
    DOM.navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        DOM.navHamburger.classList.remove("is-active");
        DOM.navMenu.classList.remove("is-active");
        DOM.navHamburger.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Active navigation link highlighting on scroll
  setupScrollSpy();
}

/**
 * IntersectionObserver for high performance scroll tracking
 */
function setupScrollSpy() {
  const sections = document.querySelectorAll("section[id]");
  if (!sections.length) return;

  const observerOptions = {
    root: null,
    rootMargin: "-20% 0px -70% 0px",
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        DOM.navLinks.forEach((link) => {
          const href = link.getAttribute("href");
          if (href === `#${id}`) {
            link.classList.add("active");
          } else {
            link.classList.remove("active");
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach((section) => observer.observe(section));
}

// ==============================================================================
// 5. ANIMATED HERO TYPING EFFECT
// ==============================================================================

/**
 * Creates dynamic typewriter effect in the hero section.
 */
function typeHeroRole() {
  if (!DOM.typingElement) return;

  const currentWord = TYPING_ROLES[appState.typingIndex];
  
  if (appState.isDeleting) {
    DOM.typingElement.textContent = currentWord.substring(0, appState.charIndex - 1);
    appState.charIndex--;
  } else {
    DOM.typingElement.textContent = currentWord.substring(0, appState.charIndex + 1);
    appState.charIndex++;
  }

  let typingSpeed = appState.isDeleting ? 40 : 80;

  if (!appState.isDeleting && appState.charIndex === currentWord.length) {
    // Pause at end of word
    typingSpeed = 1600;
    appState.isDeleting = true;
  } else if (appState.isDeleting && appState.charIndex === 0) {
    // Word fully cleared, switch to next word
    appState.isDeleting = false;
    appState.typingIndex = (appState.typingIndex + 1) % TYPING_ROLES.length;
    typingSpeed = 400;
  }

  setTimeout(typeHeroRole, typingSpeed);
}

// ==============================================================================
// 6. SKILLS CATEGORY FILTER
// ==============================================================================

function initSkillsFilter() {
  if (!DOM.filterBtns.length || !DOM.skillCards.length) return;

  DOM.filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      DOM.filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const category = btn.getAttribute("data-category");

      DOM.skillCards.forEach((card) => {
        const cardCategory = card.getAttribute("data-category");
        if (category === "all" || cardCategory === category) {
          card.style.display = "flex";
          card.style.opacity = "1";
        } else {
          card.style.display = "none";
          card.style.opacity = "0";
        }
      });
    });
  });
}

// ==============================================================================
// 7. CONTACT FORM & LOCAL STORAGE MOCK DATABASE
// ==============================================================================

/**
 * Validates an email address format using standard regex.
 * @param {string} email
 * @returns {boolean}
 */
function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

/**
 * Retrieves all stored contact messages from localStorage.
 * @returns {Array<{id: string, name: string, email: string, message: string, timestamp: string}>}
 */
function getStoredContacts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CONTACTS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Error reading responses from localStorage:", error);
    return [];
  }
}

/**
 * Saves contact messages array to localStorage.
 * @param {Array} contacts
 */
function saveContactsToStorage(contacts) {
  try {
    localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(contacts));
  } catch (error) {
    console.error("Error saving responses to localStorage:", error);
  }
}

/**
 * Formats current date and time as YYYY-MM-DD HH:MM:SS
 * @returns {string}
 */
function getCurrentFormattedTimestamp() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

/**
 * Resolves the currently active Google Apps Script URL.
 * Checks custom user overrides first, then the code constant.
 * @returns {string}
 */
function getActiveAppsScriptUrl() {
  const customUrl = localStorage.getItem(STORAGE_KEYS.CUSTOM_SHEETS_URL);
  if (customUrl && customUrl.trim() !== "") {
    return customUrl.trim();
  }
  return GOOGLE_SHEETS_CONFIG.APPS_SCRIPT_URL.trim();
}

/**
 * Contact Submission Dispatcher.
 * Saves to LocalStorage mock database and optionally sends to Google Apps Script.
 * @param {{name: string, email: string, message: string, timestamp: string}} payload
 * @returns {Promise<{success: boolean, destination: "local" | "sheets" | "both", message: string}>}
 */
async function dispatchContactSubmission(payload) {
  // Always store in LocalStorage (as mock database or safe local backup)
  const contacts = getStoredContacts();
  const newEntry = {
    id: `resp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    name: payload.name.trim(),
    email: payload.email.trim(),
    message: payload.message.trim(),
    timestamp: payload.timestamp
  };

  contacts.unshift(newEntry);
  saveContactsToStorage(contacts);

  const activeSheetsUrl = getActiveAppsScriptUrl();

  // If no Google Apps Script endpoint is provided, run purely in mock LocalStorage mode
  if (!activeSheetsUrl) {
    return {
      success: true,
      destination: "local",
      message: "Message saved to browser LocalStorage (Mock Database Mode). Google Sheets URL is not configured."
    };
  }

  // When endpoint is configured, forward data to Google Apps Script Web App
  try {
    // Google Apps Script Web Apps often redirect or require no-cors mode in browsers
    // Sending form-encoded or JSON payload
    await fetch(activeSheetsUrl, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newEntry)
    });

    return {
      success: true,
      destination: "both",
      message: "Message transmitted to Google Sheets Web App & backed up locally."
    };
  } catch (netErr) {
    console.warn("Google Apps Script dispatch error; LocalStorage backup retained:", netErr);
    return {
      success: true,
      destination: "local",
      message: "Message saved to LocalStorage (Google Sheets endpoint did not respond)."
    };
  }
}

/**
 * Real-time form validation and submission logic
 */
function initContactForm() {
  if (!DOM.contactForm) return;

  // Live character counter
  DOM.inputMessage.addEventListener("input", () => {
    const len = DOM.inputMessage.value.length;
    DOM.charCount.textContent = `${len}/500`;
    if (len >= 10) {
      DOM.messageError.classList.remove("is-visible");
      DOM.inputMessage.classList.remove("input-error");
    }
  });

  // Name live input validation
  DOM.inputName.addEventListener("input", () => {
    if (DOM.inputName.value.trim().length >= 2) {
      DOM.nameError.classList.remove("is-visible");
      DOM.inputName.classList.remove("input-error");
    }
  });

  // Email live input validation
  DOM.inputEmail.addEventListener("input", () => {
    if (isValidEmail(DOM.inputEmail.value.trim())) {
      DOM.emailError.classList.remove("is-visible");
      DOM.inputEmail.classList.remove("input-error");
    }
  });

  // Handle Form Submit
  DOM.contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = DOM.inputName.value.trim();
    const email = DOM.inputEmail.value.trim();
    const message = DOM.inputMessage.value.trim();

    let hasErrors = false;

    // Validate Name
    if (name.length < 2) {
      DOM.nameError.textContent = "Please enter your name (at least 2 characters).";
      DOM.nameError.classList.add("is-visible");
      DOM.inputName.classList.add("input-error");
      hasErrors = true;
    } else {
      DOM.nameError.classList.remove("is-visible");
      DOM.inputName.classList.remove("input-error");
    }

    // Validate Email
    if (!isValidEmail(email)) {
      DOM.emailError.textContent = "Please enter a valid email address (e.g. name@example.com).";
      DOM.emailError.classList.add("is-visible");
      DOM.inputEmail.classList.add("input-error");
      hasErrors = true;
    } else {
      DOM.emailError.classList.remove("is-visible");
      DOM.inputEmail.classList.remove("input-error");
    }

    // Validate Message
    if (message.length < 10) {
      DOM.messageError.textContent = "Please write a message with at least 10 characters.";
      DOM.messageError.classList.add("is-visible");
      DOM.inputMessage.classList.add("input-error");
      hasErrors = true;
    } else {
      DOM.messageError.classList.remove("is-visible");
      DOM.inputMessage.classList.remove("input-error");
    }

    if (hasErrors) {
      showToast("Please fix the highlighted errors before submitting.", "danger");
      return;
    }

    // Set loading button state
    const originalBtnText = DOM.submitBtn.innerHTML;
    DOM.submitBtn.disabled = true;
    DOM.submitBtn.innerHTML = `
      <svg class="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
        <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path>
      </svg>
      Submitting...
    `;

    try {
      const submissionData = {
        name,
        email,
        message,
        timestamp: getCurrentFormattedTimestamp()
      };

      const result = await dispatchContactSubmission(submissionData);

      // Display feedback banner
      DOM.formFeedback.className = "form-feedback is-success";
      DOM.formFeedback.style.display = "flex";
      DOM.formFeedback.innerHTML = `
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
        <div>
          <strong>Thank you, ${escapeHtml(name)}!</strong>
          <p>${result.message}</p>
          <small style="opacity: 0.85;">Timestamp: ${submissionData.timestamp}</small>
        </div>
      `;

      // Reset form fields
      DOM.contactForm.reset();
      DOM.charCount.textContent = "0/500";

      // If user is currently logged into the admin dashboard, refresh the responses view
      if (isAdminLoggedIn()) {
        renderAdminResponses();
      }

      showToast("Your message was sent successfully!", "success");
    } catch (err) {
      console.error("Submission failed:", err);
      DOM.formFeedback.className = "form-feedback is-error";
      DOM.formFeedback.style.display = "flex";
      DOM.formFeedback.innerHTML = `
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <div>
          <strong>Submission Error</strong>
          <p>Could not process your message. Please try again.</p>
        </div>
      `;
      showToast("Failed to submit form.", "danger");
    } finally {
      DOM.submitBtn.disabled = false;
      DOM.submitBtn.innerHTML = originalBtnText;
    }
  });
}

// ==============================================================================
// 8. ADMIN LOGIN & AUTHENTICATION
// ==============================================================================

/**
 * Checks if admin is logged in (sessionStorage based).
 * @returns {boolean}
 */
function isAdminLoggedIn() {
  return sessionStorage.getItem(STORAGE_KEYS.ADMIN_SESSION) === "true";
}

/**
 * Sets admin login state.
 * @param {boolean} loggedIn
 */
function setAdminLoggedIn(loggedIn) {
  if (loggedIn) {
    sessionStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, "true");
    DOM.adminLoginBox.style.display = "none";
    DOM.adminDashboard.classList.add("is-visible");
    if (DOM.adminNavBtn) DOM.adminNavBtn.classList.add("logged-in");
    renderAdminResponses();
    updateIntegrationStatusUI();
  } else {
    sessionStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION);
    DOM.adminLoginBox.style.display = "block";
    DOM.adminDashboard.classList.remove("is-visible");
    if (DOM.adminNavBtn) DOM.adminNavBtn.classList.remove("logged-in");
    if (DOM.adminLoginForm) DOM.adminLoginForm.reset();
  }
}

/**
 * Setup Admin Login Form listeners
 */
function initAdminAuth() {
  // Check initial session
  if (isAdminLoggedIn()) {
    setAdminLoggedIn(true);
  }

  // Handle Login submission
  if (DOM.adminLoginForm) {
    DOM.adminLoginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const username = DOM.adminUsernameInput.value.trim();
      const password = DOM.adminPasswordInput.value;

      if (
        username === ADMIN_CREDENTIALS.USERNAME &&
        password === ADMIN_CREDENTIALS.PASSWORD
      ) {
        DOM.adminLoginError.style.display = "none";
        setAdminLoggedIn(true);
        showToast("Logged in as Admin successfully!", "success");
      } else {
        DOM.adminLoginError.style.display = "block";
        DOM.adminLoginError.textContent = "Invalid username or password. Check demo credentials.";
        showToast("Authentication failed", "danger");
      }
    });
  }

  // Handle Logout
  if (DOM.adminLogoutBtn) {
    DOM.adminLogoutBtn.addEventListener("click", () => {
      setAdminLoggedIn(false);
      showToast("Logged out of Admin Portal.", "info");
    });
  }
}

// ==============================================================================
// 9. USER RESPONSES VIEWER (TABLE & CARDS)
// ==============================================================================

/**
 * Safely escapes HTML strings to prevent XSS.
 * @param {string} str
 * @returns {string}
 */
function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Renders stored responses into either Table or Card format based on current state.
 */
function renderAdminResponses() {
  const allContacts = getStoredContacts();
  const query = appState.currentFilterQuery.toLowerCase();

  // Filter based on search box
  const filtered = allContacts.filter((c) => {
    return (
      c.name.toLowerCase().includes(query) ||
      c.email.toLowerCase().includes(query) ||
      c.message.toLowerCase().includes(query) ||
      (c.timestamp && c.timestamp.includes(query))
    );
  });

  // Update total badge count
  if (DOM.responsesCountBadge) {
    DOM.responsesCountBadge.textContent = `${allContacts.length} Total`;
  }

  // Handle Empty State
  if (filtered.length === 0) {
    DOM.responsesTableWrapper.style.display = "none";
    DOM.responsesCardsContainer.style.display = "none";
    DOM.emptyResponsesState.style.display = "block";
    return;
  }

  DOM.emptyResponsesState.style.display = "none";

  if (appState.currentView === "table") {
    DOM.responsesTableWrapper.style.display = "block";
    DOM.responsesCardsContainer.style.display = "none";
    renderTableView(filtered);
  } else {
    DOM.responsesTableWrapper.style.display = "none";
    DOM.responsesCardsContainer.style.display = "grid";
    renderCardsView(filtered);
  }
}

/**
 * Builds Table rows for responses.
 * @param {Array} list
 */
function renderTableView(list) {
  if (!DOM.responsesTableBody) return;
  DOM.responsesTableBody.innerHTML = "";

  list.forEach((item, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td style="font-weight: 600; color: var(--text-muted);">${index + 1}</td>
      <td class="user-name-cell">${escapeHtml(item.name)}</td>
      <td class="user-email-cell">
        <a href="mailto:${escapeHtml(item.email)}">${escapeHtml(item.email)}</a>
      </td>
      <td style="max-width: 320px; word-break: break-word;">${escapeHtml(item.message)}</td>
      <td>
        <span class="timestamp-badge">${escapeHtml(item.timestamp || "N/A")}</span>
      </td>
      <td style="text-align: right;">
        <button class="btn btn-sm btn-outline delete-single-btn" data-id="${escapeHtml(item.id)}" title="Delete response" style="color: var(--danger); border-color: var(--danger);">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
      </td>
    `;
    DOM.responsesTableBody.appendChild(tr);
  });

  // Attach delete handlers
  DOM.responsesTableBody.querySelectorAll(".delete-single-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      deleteSingleResponse(id);
    });
  });
}

/**
 * Builds Card items for responses.
 * @param {Array} list
 */
function renderCardsView(list) {
  if (!DOM.responsesCardsContainer) return;
  DOM.responsesCardsContainer.innerHTML = "";

  list.forEach((item) => {
    const card = document.createElement("div");
    card.className = "response-card";
    card.innerHTML = `
      <div class="response-card-header">
        <div>
          <h4 class="response-card-title">${escapeHtml(item.name)}</h4>
          <a class="response-card-email" href="mailto:${escapeHtml(item.email)}">${escapeHtml(item.email)}</a>
        </div>
        <button class="btn btn-sm btn-outline delete-single-btn" data-id="${escapeHtml(item.id)}" title="Delete response" style="color: var(--danger); border-color: var(--danger); padding: 0.35rem 0.5rem;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
      </div>
      <p class="response-card-message">${escapeHtml(item.message)}</p>
      <div class="response-card-footer">
        <span class="timestamp-badge">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:inline; margin-right:4px;">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          ${escapeHtml(item.timestamp || "N/A")}
        </span>
        <a href="mailto:${escapeHtml(item.email)}?subject=Re: Portfolio Inquiry" class="btn btn-sm btn-secondary" style="font-size:0.78rem; padding: 0.25rem 0.65rem;">Reply</a>
      </div>
    `;
    DOM.responsesCardsContainer.appendChild(card);
  });

  // Attach delete handlers
  DOM.responsesCardsContainer.querySelectorAll(".delete-single-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      deleteSingleResponse(id);
    });
  });
}

/**
 * Deletes a single response by ID.
 * @param {string} id
 */
function deleteSingleResponse(id) {
  const current = getStoredContacts();
  const updated = current.filter((item) => item.id !== id);
  saveContactsToStorage(updated);
  renderAdminResponses();
  showToast("Response removed from localStorage.", "info");
}

/**
 * Clears all responses after confirmation.
 */
function clearAllResponses() {
  const contacts = getStoredContacts();
  if (contacts.length === 0) {
    showToast("No responses to clear.", "info");
    return;
  }

  const confirmed = window.confirm("Are you sure you want to permanently clear all contact responses from localStorage?");
  if (confirmed) {
    saveContactsToStorage([]);
    renderAdminResponses();
    showToast("All contact responses cleared.", "success");
  }
}

/**
 * Populates sample responses for instant demo evaluation.
 */
function populateDemoResponses() {
  const existing = getStoredContacts();
  const merged = [...INITIAL_DEMO_RESPONSES, ...existing];
  saveContactsToStorage(merged);
  renderAdminResponses();
  showToast("Added demo responses for review!", "success");
}

/**
 * Exports stored responses as a JSON file download.
 */
function exportResponsesAsJson() {
  const contacts = getStoredContacts();
  if (contacts.length === 0) {
    showToast("No responses to export.", "info");
    return;
  }

  const jsonString = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(contacts, null, 2));
  const downloadAnchor = document.createElement("a");
  downloadAnchor.setAttribute("href", jsonString);
  downloadAnchor.setAttribute("download", `portfolio_responses_${Date.now()}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
  showToast("Downloaded responses as JSON file.", "success");
}

/**
 * Exports stored responses as a CSV file download.
 */
function exportResponsesAsCsv() {
  const contacts = getStoredContacts();
  if (contacts.length === 0) {
    showToast("No responses to export.", "info");
    return;
  }

  const headers = ["ID", "Name", "Email", "Message", "Timestamp"];
  const rows = contacts.map((c) => [
    `"${(c.id || "").replace(/"/g, '""')}"`,
    `"${(c.name || "").replace(/"/g, '""')}"`,
    `"${(c.email || "").replace(/"/g, '""')}"`,
    `"${(c.message || "").replace(/"/g, '""')}"`,
    `"${(c.timestamp || "").replace(/"/g, '""')}"`
  ]);

  const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const downloadAnchor = document.createElement("a");
  downloadAnchor.setAttribute("href", encodeURI(csvContent));
  downloadAnchor.setAttribute("download", `portfolio_responses_${Date.now()}.csv`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
  showToast("Downloaded responses as CSV file.", "success");
}

/**
 * Setup responses view buttons and controls
 */
function initResponsesViewerControls() {
  // View Toggle (Table vs Cards)
  if (DOM.viewTableBtn && DOM.viewCardsBtn) {
    DOM.viewTableBtn.addEventListener("click", () => {
      appState.currentView = "table";
      DOM.viewTableBtn.classList.add("active");
      DOM.viewCardsBtn.classList.remove("active");
      renderAdminResponses();
    });

    DOM.viewCardsBtn.addEventListener("click", () => {
      appState.currentView = "cards";
      DOM.viewCardsBtn.classList.add("active");
      DOM.viewTableBtn.classList.remove("active");
      renderAdminResponses();
    });
  }

  // Search input filter
  if (DOM.searchResponsesInput) {
    DOM.searchResponsesInput.addEventListener("input", (e) => {
      appState.currentFilterQuery = e.target.value.trim();
      renderAdminResponses();
    });
  }

  // Clear & Export buttons
  if (DOM.clearAllResponsesBtn) {
    DOM.clearAllResponsesBtn.addEventListener("click", clearAllResponses);
  }
  if (DOM.exportJsonBtn) {
    DOM.exportJsonBtn.addEventListener("click", exportResponsesAsJson);
  }
  if (DOM.exportCsvBtn) {
    DOM.exportCsvBtn.addEventListener("click", exportResponsesAsCsv);
  }
  if (DOM.populateDemoBtn) {
    DOM.populateDemoBtn.addEventListener("click", populateDemoResponses);
  }
}

// ==============================================================================
// 10. GOOGLE APPS SCRIPT SETTINGS & MODAL
// ==============================================================================

/**
 * Updates UI banner indicating whether Google Apps Script is active or LocalStorage mode.
 */
function updateIntegrationStatusUI() {
  const activeUrl = getActiveAppsScriptUrl();

  if (DOM.sheetsStatusText && DOM.sheetsStatusPill) {
    if (activeUrl) {
      DOM.sheetsStatusPill.className = "badge badge-success";
      DOM.sheetsStatusPill.textContent = "Google Sheets Active";
      DOM.sheetsStatusText.textContent = `Connected to: ${activeUrl.substring(0, 45)}... (Dual write to Sheets & LocalStorage enabled)`;
    } else {
      DOM.sheetsStatusPill.className = "badge badge-warning";
      DOM.sheetsStatusPill.textContent = "LocalStorage Mock Mode";
      DOM.sheetsStatusText.textContent = "Operating on browser localStorage mock database. Connect Google Apps Script anytime.";
    }
  }
}

function initSheetsConfigModal() {
  if (!DOM.configureSheetsBtn || !DOM.sheetsConfigModal) return;

  DOM.configureSheetsBtn.addEventListener("click", () => {
    const currentUrl = getActiveAppsScriptUrl();
    if (DOM.sheetsUrlInput) {
      DOM.sheetsUrlInput.value = currentUrl;
    }
    DOM.sheetsConfigModal.classList.add("is-active");
  });

  if (DOM.closeSheetsModalBtn) {
    DOM.closeSheetsModalBtn.addEventListener("click", () => {
      DOM.sheetsConfigModal.classList.remove("is-active");
    });
  }

  // Close when clicking outside modal
  DOM.sheetsConfigModal.addEventListener("click", (e) => {
    if (e.target === DOM.sheetsConfigModal) {
      DOM.sheetsConfigModal.classList.remove("is-active");
    }
  });

  // Save new URL
  if (DOM.saveSheetsUrlBtn) {
    DOM.saveSheetsUrlBtn.addEventListener("click", () => {
      const url = DOM.sheetsUrlInput.value.trim();
      if (url === "") {
        localStorage.removeItem(STORAGE_KEYS.CUSTOM_SHEETS_URL);
        showToast("Reset to LocalStorage Mock Database mode.", "info");
      } else if (!url.startsWith("https://script.google.com/macros/s/")) {
        showToast("Warning: URL doesn't look like a standard Google Apps Script Web App URL.", "danger");
        localStorage.setItem(STORAGE_KEYS.CUSTOM_SHEETS_URL, url);
      } else {
        localStorage.setItem(STORAGE_KEYS.CUSTOM_SHEETS_URL, url);
        showToast("Google Apps Script URL saved successfully!", "success");
      }
      updateIntegrationStatusUI();
      DOM.sheetsConfigModal.classList.remove("is-active");
    });
  }

  // Reset to default
  if (DOM.resetSheetsUrlBtn) {
    DOM.resetSheetsUrlBtn.addEventListener("click", () => {
      localStorage.removeItem(STORAGE_KEYS.CUSTOM_SHEETS_URL);
      if (DOM.sheetsUrlInput) DOM.sheetsUrlInput.value = "";
      updateIntegrationStatusUI();
      showToast("Reset to default LocalStorage mode.", "info");
      DOM.sheetsConfigModal.classList.remove("is-active");
    });
  }
}

// ==============================================================================
// 11. TOAST NOTIFICATIONS HELPER
// ==============================================================================

/**
 * Displays a non-intrusive toast notification on screen.
 * @param {string} message
 * @param {"success" | "danger" | "info"} type
 */
function showToast(message, type = "info") {
  if (!DOM.toastContainer) return;

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  
  let iconSvg = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="12" x2="12" y2="16"></line>
      <line x1="12" y1="8" x2="12.01" y2="8"></line>
    </svg>
  `;

  if (type === "success") {
    iconSvg = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
    `;
  } else if (type === "danger") {
    iconSvg = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="15" y1="9" x2="9" y2="15"></line>
        <line x1="9" y1="9" x2="15" y2="15"></line>
      </svg>
    `;
  }

  toast.innerHTML = `
    ${iconSvg}
    <span>${escapeHtml(message)}</span>
  `;

  DOM.toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(20px)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ==============================================================================
// 12. INITIALIZATION ON DOM CONTENT LOADED
// ==============================================================================
document.addEventListener("DOMContentLoaded", () => {
  // Theme Setup
  initTheme();
  if (DOM.themeToggleBtn) {
    DOM.themeToggleBtn.addEventListener("click", toggleTheme);
  }

  // Navigation Setup
  initNavigation();

  // Typing Hero Effect
  typeHeroRole();

  // Skills Filtering
  initSkillsFilter();

  // Contact Form & LocalStorage
  initContactForm();

  // Admin Authentication
  initAdminAuth();

  // Responses Viewer & Export
  initResponsesViewerControls();

  // Google Sheets Config Modal
  initSheetsConfigModal();

  // Seed demo responses if storage is completely empty on first visit
  const existingResponses = getStoredContacts();
  if (existingResponses.length === 0) {
    saveContactsToStorage(INITIAL_DEMO_RESPONSES);
  }

  // Initialize UI status
  updateIntegrationStatusUI();

  // Header shadow on scroll
  window.addEventListener("scroll", () => {
    if (window.scrollY > 30) {
      DOM.header?.classList.add("header-scrolled");
    } else {
      DOM.header?.classList.remove("header-scrolled");
    }
  });

  console.log("DevFolio initialized successfully. Pure Vanilla JS, HTML5 & CSS3.");
});
