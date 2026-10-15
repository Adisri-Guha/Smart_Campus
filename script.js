/**
 * SmartCampus Prototype - Core Application Logic
 * College Hackathon Prototype
 * Pure Vanilla JavaScript (No frameworks / no external dependencies)
 */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  // =========================================================================
  // 1. DATA MODELS & INITIAL STATE
  // =========================================================================

  // Campus Facility Directory (Sample Data specified in requirements)
  const facilities = [
    {
      id: "library",
      name: "Library",
      category: "Academic",
      status: "Open",
      statusType: "open",
      location: "Central Quad, Academic Wing A",
      hours: "08:00 AM – 10:00 PM",
      occupancy: "42% (Quiet)",
      icon: "📚",
      description: "Central collegiate repository with quiet study cubicles, book archives, digital journals, and printing stations."
    },
    {
      id: "computer-lab",
      name: "Computer Lab",
      category: "Technology",
      status: "Open",
      statusType: "open",
      location: "Tech Block, 2nd Floor (Room 204)",
      hours: "08:30 AM – 08:30 PM",
      occupancy: "58% (Moderate)",
      icon: "💻",
      description: "High-spec workstations with development environments, high-speed fiber internet, and project collaboration desks."
    },
    {
      id: "main-mess",
      name: "Main Mess",
      category: "Dining",
      status: "Open",
      statusType: "open",
      location: "South Campus, Dining Complex",
      hours: "07:30 AM – 09:30 PM",
      occupancy: "70% (Peak Lunch)",
      icon: "🍽️",
      description: "Full-service dining hall offering hygienic daily meals, breakfast bar, and casual cafeteria seating for 400+ students."
    },
    {
      id: "medical-centre",
      name: "Medical Centre",
      category: "Health & Wellness",
      status: "Open",
      statusType: "open",
      location: "Admin Circle, Ground Floor Annex",
      hours: "24/7 (Emergency & First Aid)",
      occupancy: "15% (Low Wait)",
      icon: "🩺",
      description: "On-campus clinic providing emergency first-aid triage, outpatient consultations, and ambulance standby."
    },
    {
      id: "sports-ground",
      name: "Sports Ground",
      category: "Recreation",
      status: "Busy",
      statusType: "busy",
      location: "East Campus Pavilion",
      hours: "06:00 AM – 09:00 PM",
      occupancy: "88% (Inter-college practice)",
      icon: "⚽",
      description: "Synthetic athletic track, multi-sport turf field, cricket training nets, and floodlit basketball courts."
    },
    {
      id: "study-room",
      name: "Study Room",
      category: "Collaborative",
      status: "Available",
      statusType: "available",
      location: "Student Resource Wing, 3rd Floor",
      hours: "07:00 AM – 11:00 PM",
      occupancy: "25% (Spacious)",
      icon: "📖",
      description: "Sound-damped group rooms with dry-erase whiteboards, HDMI monitors for team presentations, and charging docks."
    }
  ];

  // Illustrative Predefined Routes Catalog
  // Clearly tagged as illustrative sample data
  const sampleRoutes = {
    "Library": {
      summaryPath: "Main Gate → Academic Block → Library",
      estTime: "4 mins",
      distance: "280 meters",
      steps: [
        { title: "Main Gate Departure", desc: "Depart from the South security arch and head north on Palm Avenue.", dist: "60m" },
        { title: "Academic Block Breezeway", desc: "Pass through the covered central walkway between Science and Arts towers.", dist: "140m" },
        { title: "Library Plaza", desc: "Turn right past the fountain to reach the Central Library East Portal.", dist: "80m" }
      ]
    },
    "Computer Lab": {
      summaryPath: "Main Gate → Admin Circle → Tech Block → Computer Lab (2nd Fl)",
      estTime: "5 mins",
      distance: "350 meters",
      steps: [
        { title: "Main Gate Departure", desc: "Take the paved pedestrian lane bearing slightly west towards Admin Circle.", dist: "100m" },
        { title: "Tech Block Entry", desc: "Enter via the automated glass doors of the Technology Innovation Center.", dist: "170m" },
        { title: "Second Floor Lab", desc: "Take the central stairs or elevator to Floor 2; Lab 204 is on the immediate left.", dist: "80m" }
      ]
    },
    "Main Mess": {
      summaryPath: "Main Gate → Central Lawn → South Dining Complex → Main Mess",
      estTime: "6 mins",
      distance: "410 meters",
      steps: [
        { title: "Main Gate Departure", desc: "Follow the shaded promenade heading south-east towards student housing.", dist: "150m" },
        { title: "Central Lawn Crossing", desc: "Cross the paved promenade adjacent to the student amphitheater.", dist: "160m" },
        { title: "Dining Complex Ground Floor", desc: "Enter the double glass doors of the South Dining Complex.", dist: "100m" }
      ]
    },
    "Medical Centre": {
      summaryPath: "Main Gate → Admin Circle → Health Annex → Medical Centre",
      estTime: "3 mins",
      distance: "190 meters",
      steps: [
        { title: "Main Gate Departure", desc: "Turn immediately right along the accessible shaded ramp.", dist: "50m" },
        { title: "Admin Circle Walkway", desc: "Proceed towards the administrative building east wing.", dist: "90m" },
        { title: "Medical Centre Clinic", desc: "Enter through the emergency ramp entrance; reception desk is straight ahead.", dist: "50m" }
      ]
    },
    "Sports Ground": {
      summaryPath: "Main Gate → Outer Ring Road → East Arena → Sports Ground Pavilion",
      estTime: "7 mins",
      distance: "520 meters",
      steps: [
        { title: "Main Gate Departure", desc: "Head east following the marked jogging track along the outer boundary.", dist: "200m" },
        { title: "Gymnasium Complex", desc: "Pass by the indoor badminton courts and swimming complex.", dist: "180m" },
        { title: "Sports Pavilion Entrance", desc: "Enter through Gate 3 into the main stadium and turf grounds.", dist: "140m" }
      ]
    },
    "Study Room": {
      summaryPath: "Main Gate → Academic Block → Resource Wing → Study Room 302",
      estTime: "5 mins",
      distance: "330 meters",
      steps: [
        { title: "Main Gate Departure", desc: "Proceed straight along Palm Avenue toward Academic Block.", dist: "130m" },
        { title: "Resource Wing Elevator", desc: "Enter the Student Resource Wing and take elevator to the 3rd floor.", dist: "120m" },
        { title: "Collaborative Study Suite", desc: "Follow the hallway signs for Study Room 302 (Collaborative Commons).", dist: "80m" }
      ]
    }
  };

  // Alternative origin modifiers to make route generation dynamic
  const originNotes = {
    "Main Gate": "Starting from the southern campus security entrance.",
    "Hostel Block A": "Departing from northern residential quad (adds ~2 minutes crossing Central Park).",
    "Academic Block": "Departing from the central lecture hall lobby.",
    "Admin Block": "Departing from the registrar & student affairs complex."
  };

  // Session Bookings Storage Key
  const STORAGE_KEY = "smartcampus_session_bookings_v1";

  // Initial Seed Booking for instant visual demonstration
  const initialDefaultBookings = [
    {
      id: "SC-8419",
      studentName: "Rohan Sharma",
      studentId: "CS-2026-104",
      facility: "Library",
      slot: "10 AM–11 AM",
      date: getTodayDateString(),
      notes: "Semester exam revision",
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ];

  // Active session bookings state
  let currentBookings = loadBookingsFromSession();

  // Active status filter pill
  let currentFilter = "all";

  // =========================================================================
  // 2. DOM ELEMENT REFERENCES
  // =========================================================================
  const navToggle = document.getElementById("navToggle");
  const siteNav = document.getElementById("siteNav");
  const liveClockEl = document.getElementById("liveClock");
  const navBookingCountEl = document.getElementById("navBookingCount");

  // Facilities Directory Elements
  const facilityGrid = document.getElementById("facilityGrid");
  const facilitySearchInput = document.getElementById("facilitySearchInput");
  const clearSearchBtn = document.getElementById("clearSearchBtn");
  const filterPillsContainer = document.getElementById("filterPills");
  const facilityCountEl = document.getElementById("facilityCount");
  const noResultsState = document.getElementById("noResultsState");
  const resetFilterBtn = document.getElementById("resetFilterBtn");

  // Route Finder Elements
  const routeOriginSelect = document.getElementById("routeOrigin");
  const routeDestSelect = document.getElementById("routeDestination");
  const getRouteBtn = document.getElementById("getRouteBtn");
  const routeResultBox = document.getElementById("routeResultBox");

  // Live Status Elements
  const statusTableBody = document.getElementById("statusTableBody");
  const refreshStatusBtn = document.getElementById("refreshStatusBtn");
  const refreshIcon = document.getElementById("refreshIcon");

  // Booking Form Elements
  const bookingForm = document.getElementById("facilityBookingForm");
  const studentNameInput = document.getElementById("studentName");
  const studentIdInput = document.getElementById("studentId");
  const bookingFacilitySelect = document.getElementById("bookingFacility");
  const bookingSlotSelect = document.getElementById("bookingSlot");
  const bookingDateInput = document.getElementById("bookingDate");
  const bookingNotesInput = document.getElementById("bookingNotes");
  const demoConsentCheckbox = document.getElementById("demoConsent");
  const bookingAlert = document.getElementById("bookingAlert");

  // Error Message Labels
  const nameError = document.getElementById("nameError");
  const idError = document.getElementById("idError");
  const facilityError = document.getElementById("facilityError");
  const slotError = document.getElementById("slotError");
  const dateError = document.getElementById("dateError");
  const consentError = document.getElementById("consentError");

  // Bookings List Elements
  const bookingsGrid = document.getElementById("bookingsGrid");
  const bookingsEmptyState = document.getElementById("bookingsEmptyState");
  const toastContainer = document.getElementById("toastContainer");

  // =========================================================================
  // 3. INITIALIZATION
  // =========================================================================
  function init() {
    setupLiveClock();
    setupMobileNav();
    setupDefaultDate();
    renderFacilities();
    renderStatusTable();
    displayRoute(routeOriginSelect.value, routeDestSelect.value);
    renderBookings();
    bindEventListeners();
  }

  // Set today's date formatted for HTML5 date input (YYYY-MM-DD)
  function setupDefaultDate() {
    const today = getTodayDateString();
    if (bookingDateInput) {
      bookingDateInput.value = today;
      bookingDateInput.min = today; // Prevent choosing past dates
    }
  }

  function getTodayDateString() {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  // Live Clock updater in hero section
  function setupLiveClock() {
    function updateClock() {
      if (!liveClockEl) return;
      const now = new Date();
      liveClockEl.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }
    updateClock();
    setInterval(updateClock, 1000);
  }

  // Mobile menu toggle & close on link click
  function setupMobileNav() {
    if (!navToggle || !siteNav) return;

    navToggle.addEventListener("click", () => {
      const isOpen = siteNav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", isOpen);
    });

    // Close menu when clicking any nav link
    const links = siteNav.querySelectorAll(".nav-link");
    links.forEach(link => {
      link.addEventListener("click", () => {
        siteNav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // =========================================================================
  // 4. FACILITIES DIRECTORY & SEARCH LOGIC
  // =========================================================================
  function renderFacilities() {
    const query = (facilitySearchInput?.value || "").trim().toLowerCase();

    // Filter by name and status pill
    const filtered = facilities.filter(facility => {
      const matchesSearch = facility.name.toLowerCase().includes(query) ||
                            facility.category.toLowerCase().includes(query) ||
                            facility.description.toLowerCase().includes(query);

      const matchesStatus = currentFilter === "all" || facility.status.toLowerCase() === currentFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });

    // Update count
    if (facilityCountEl) {
      facilityCountEl.textContent = filtered.length;
    }

    if (!facilityGrid) return;

    if (filtered.length === 0) {
      facilityGrid.innerHTML = "";
      noResultsState.classList.remove("hidden");
      return;
    }

    noResultsState.classList.add("hidden");

    facilityGrid.innerHTML = filtered.map(fac => {
      const pillClass = fac.statusType === "busy" ? "pill-busy" : "pill-open";
      return `
        <article class="facility-card" data-facility-id="${fac.id}">
          <div class="card-top">
            <div class="card-icon-wrap" aria-hidden="true">${fac.icon}</div>
            <span class="status-pill ${pillClass}">${fac.status}</span>
          </div>
          <h3 class="card-title">${escapeHTML(fac.name)}</h3>
          <p class="card-desc">${escapeHTML(fac.description)}</p>
          
          <div class="card-details">
            <div class="detail-row">
              <span class="detail-icon">📍</span>
              <span>${escapeHTML(fac.location)}</span>
            </div>
            <div class="detail-row">
              <span class="detail-icon">⏰</span>
              <span>${escapeHTML(fac.hours)}</span>
            </div>
            <div class="detail-row">
              <span class="detail-icon">👥</span>
              <span>Occupancy: <strong>${escapeHTML(fac.occupancy)}</strong></span>
            </div>
          </div>

          <div class="card-actions">
            <button type="button" class="btn btn-secondary btn-sm action-route" data-destination="${escapeHTML(fac.name)}">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
              View Route
            </button>
            <button type="button" class="btn btn-primary btn-sm action-book" data-facility="${escapeHTML(fac.name)}">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              Book Slot
            </button>
          </div>
        </article>
      `;
    }).join("");

    // Attach quick action listeners
    attachFacilityCardListeners();
  }

  function attachFacilityCardListeners() {
    // "View Route" button on card
    document.querySelectorAll(".action-route").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const dest = e.currentTarget.getAttribute("data-destination");
        if (dest && routeDestSelect) {
          routeDestSelect.value = dest;
          displayRoute(routeOriginSelect.value, dest);
          const target = document.getElementById("routes");
          if (target) {
            target.scrollIntoView({ behavior: "smooth" });
          }
          showToast(`Generated route to ${dest}`, "info");
        }
      });
    });

    // "Book Slot" button on card
    document.querySelectorAll(".action-book").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const facility = e.currentTarget.getAttribute("data-facility");
        if (facility && bookingFacilitySelect) {
          bookingFacilitySelect.value = facility;
          clearInputError(facilityError, bookingFacilitySelect);
          const target = document.getElementById("booking");
          if (target) {
            target.scrollIntoView({ behavior: "smooth" });
            studentNameInput?.focus();
          }
          showToast(`Selected ${facility} in booking form`, "info");
        }
      });
    });
  }

  // =========================================================================
  // 5. CAMPUS ROUTE FINDER LOGIC
  // =========================================================================
  function displayRoute(origin, destination) {
    if (!routeResultBox) return;

    const routeData = sampleRoutes[destination];
    if (!routeData) {
      routeResultBox.innerHTML = `
        <div class="no-results">
          <p>No sample route available for the selected destination.</p>
        </div>
      `;
      return;
    }

    const originDetail = originNotes[origin] || `Starting point: ${origin}`;

    const stepsHTML = routeData.steps.map((step, index) => {
      let markerClass = "";
      if (index === 0) markerClass = "start";
      else if (index === routeData.steps.length - 1) markerClass = "end";

      return `
        <div class="route-step-card">
          <div class="step-marker ${markerClass}">${index + 1}</div>
          <div class="step-header">
            <strong>${escapeHTML(step.title)}</strong>
            <span class="step-distance">${escapeHTML(step.dist)}</span>
          </div>
          <p class="step-instruction">${escapeHTML(step.desc)}</p>
        </div>
      `;
    }).join("");

    routeResultBox.innerHTML = `
      <div class="route-summary-bar">
        <div class="route-title-group">
          <h3>Sample Route: ${escapeHTML(origin)} &rarr; ${escapeHTML(destination)}</h3>
          <p><strong>Path:</strong> ${escapeHTML(routeData.summaryPath)}</p>
          <p style="font-size: 0.8rem; color: #475569; margin-top: 4px;">ℹ️ ${escapeHTML(originDetail)}</p>
        </div>
        <div class="route-stats-pill-group">
          <span class="stat-pill">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            Est. Walk: ${escapeHTML(routeData.estTime)}
          </span>
          <span class="stat-pill">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
            Distance: ${escapeHTML(routeData.distance)}
          </span>
        </div>
      </div>

      <div class="route-timeline">
        ${stepsHTML}
      </div>
    `;
  }

  // =========================================================================
  // 6. FACILITY LIVE STATUS SECTION
  // =========================================================================
  function renderStatusTable() {
    if (!statusTableBody) return;

    statusTableBody.innerHTML = facilities.map(fac => {
      const pillClass = fac.statusType === "busy" ? "pill-busy" : "pill-open";
      return `
        <tr>
          <td>
            <div class="facility-cell-name">
              <span class="facility-cell-icon" aria-hidden="true">${fac.icon}</span>
              <div class="facility-cell-text">
                <strong>${escapeHTML(fac.name)}</strong>
                <span>${escapeHTML(fac.category)}</span>
              </div>
            </div>
          </td>
          <td>
            <span class="status-pill ${pillClass}">${fac.status}</span>
          </td>
          <td>${escapeHTML(fac.hours)}</td>
          <td>
            <span style="font-weight: 600; color: #334155;">${escapeHTML(fac.occupancy)}</span>
          </td>
          <td>${escapeHTML(fac.location)}</td>
          <td class="text-right">
            <button type="button" class="btn btn-outline btn-sm action-book" data-facility="${escapeHTML(fac.name)}">
              Book
            </button>
          </td>
        </tr>
      `;
    }).join("");

    // Reattach booking buttons inside table
    attachFacilityCardListeners();
  }

  // =========================================================================
  // 7. BOOKING FORM & VALIDATION LOGIC
  // =========================================================================
  function validateBookingForm() {
    let isValid = true;

    // Reset previous errors
    clearAllInputErrors();

    // 1. Student Name validation
    const nameVal = (studentNameInput?.value || "").trim();
    if (!nameVal) {
      setInputError(nameError, studentNameInput, "Please enter the student's full name.");
      isValid = false;
    } else if (nameVal.length < 2) {
      setInputError(nameError, studentNameInput, "Name must be at least 2 characters long.");
      isValid = false;
    }

    // 2. Student ID validation
    const idVal = (studentIdInput?.value || "").trim();
    if (!idVal) {
      setInputError(idError, studentIdInput, "Please enter your student Roll / ID Number.");
      isValid = false;
    } else if (idVal.length < 4) {
      setInputError(idError, studentIdInput, "Roll/ID must be at least 4 characters (e.g., CS-2026-101).");
      isValid = false;
    }

    // 3. Facility dropdown validation
    const facilityVal = bookingFacilitySelect?.value;
    if (!facilityVal) {
      setInputError(facilityError, bookingFacilitySelect, "Please choose a facility to book.");
      isValid = false;
    }

    // 4. Time slot validation
    const slotVal = bookingSlotSelect?.value;
    if (!slotVal) {
      setInputError(slotError, bookingSlotSelect, "Please select an available 1-hour time window.");
      isValid = false;
    }

    // 5. Date validation
    const dateVal = bookingDateInput?.value;
    if (!dateVal) {
      setInputError(dateError, bookingDateInput, "Please pick a booking date.");
      isValid = false;
    }

    // 6. Prototype acknowledgment checkbox
    if (demoConsentCheckbox && !demoConsentCheckbox.checked) {
      setInputError(consentError, demoConsentCheckbox, "Please acknowledge that this is a prototype demonstration.");
      isValid = false;
    }

    // 7. Prevent duplicate booking for the exact same student, facility, slot, and date in this session
    if (isValid) {
      const isDuplicate = currentBookings.some(b => 
        b.studentId.toLowerCase() === idVal.toLowerCase() &&
        b.facility.toLowerCase() === facilityVal.toLowerCase() &&
        b.slot === slotVal &&
        b.date === dateVal
      );

      if (isDuplicate) {
        setBookingAlert("You already have an active session reservation for this facility and time slot.", "error");
        isValid = false;
      }
    }

    return isValid;
  }

  function handleBookingSubmit(e) {
    e.preventDefault();

    if (!validateBookingForm()) {
      return;
    }

    // Generate simulated pass
    const newBooking = {
      id: "SC-" + Math.floor(1000 + Math.random() * 9000),
      studentName: studentNameInput.value.trim(),
      studentId: studentIdInput.value.trim().toUpperCase(),
      facility: bookingFacilitySelect.value,
      slot: bookingSlotSelect.value,
      date: bookingDateInput.value,
      notes: bookingNotesInput.value.trim() || "Standard access",
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Prepend to current bookings
    currentBookings.unshift(newBooking);
    saveBookingsToSession();

    // Show friendly success feedback
    setBookingAlert(`Success! Pass <strong>#${newBooking.id}</strong> has been generated for ${escapeHTML(newBooking.studentName)} at the ${escapeHTML(newBooking.facility)}.`, "success");

    showToast(`Booking #${newBooking.id} created!`, "success");

    // Reset Form fields
    bookingForm.reset();
    setupDefaultDate();
    demoConsentCheckbox.checked = true; // Auto-check for convenience

    // Re-render bookings list and counter
    renderBookings();

    // Smooth scroll to view bookings
    const myBookingsSec = document.getElementById("my-bookings");
    if (myBookingsSec) {
      setTimeout(() => {
        myBookingsSec.scrollIntoView({ behavior: "smooth" });
      }, 500);
    }
  }

  // =========================================================================
  // 8. SESSION BOOKINGS LIST LOGIC
  // =========================================================================
  function renderBookings() {
    // Update navigation badge counter
    if (navBookingCountEl) {
      navBookingCountEl.textContent = currentBookings.length;
    }

    if (!bookingsGrid || !bookingsEmptyState) return;

    if (currentBookings.length === 0) {
      bookingsGrid.innerHTML = "";
      bookingsEmptyState.classList.remove("hidden");
      return;
    }

    bookingsEmptyState.classList.add("hidden");

    bookingsGrid.innerHTML = currentBookings.map(b => {
      // Find facility icon
      const facObj = facilities.find(f => f.name.toLowerCase() === b.facility.toLowerCase());
      const icon = facObj ? facObj.icon : "🎟️";

      return `
        <article class="booking-card" data-booking-id="${b.id}">
          <div class="booking-card-top">
            <span class="booking-ref-badge">PASS: #${b.id}</span>
            <span class="booking-date-badge">Created ${escapeHTML(b.createdAt)}</span>
          </div>

          <div class="booking-facility-title">
            <span style="font-size: 1.5rem;" aria-hidden="true">${icon}</span>
            <div>
              <span>${escapeHTML(b.facility)}</span>
              <div style="font-size: 0.75rem; color: #64748b; font-weight: normal;">Demo Pass</div>
            </div>
          </div>

          <ul class="booking-details-list">
            <li>
              <span>Student:</span>
              <span>${escapeHTML(b.studentName)}</span>
            </li>
            <li>
              <span>Roll / ID:</span>
              <span>${escapeHTML(b.studentId)}</span>
            </li>
            <li>
              <span>Date:</span>
              <span>${escapeHTML(b.date)}</span>
            </li>
            <li>
              <span>Time Slot:</span>
              <span>${escapeHTML(b.slot)}</span>
            </li>
            <li>
              <span>Purpose:</span>
              <span>${escapeHTML(b.notes)}</span>
            </li>
          </ul>

          <div class="booking-card-actions">
            <span class="status-pill pill-available">Active Pass</span>
            <button type="button" class="btn-cancel-booking" data-cancel-id="${b.id}">
              Cancel Pass
            </button>
          </div>
        </article>
      `;
    }).join("");

    // Bind cancellation buttons
    document.querySelectorAll(".btn-cancel-booking").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const idToCancel = e.currentTarget.getAttribute("data-cancel-id");
        cancelBooking(idToCancel);
      });
    });
  }

  function cancelBooking(bookingId) {
    const booking = currentBookings.find(b => b.id === bookingId);
    if (!booking) return;

    // Remove from array
    currentBookings = currentBookings.filter(b => b.id !== bookingId);
    saveBookingsToSession();
    renderBookings();

    showToast(`Cancelled pass #${bookingId}`, "info");
  }

  // SessionStorage helpers
  function loadBookingsFromSession() {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn("sessionStorage read failed, falling back to local memory.", e);
    }
    return [...initialDefaultBookings];
  }

  function saveBookingsToSession() {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(currentBookings));
    } catch (e) {
      console.warn("sessionStorage write failed.", e);
    }
  }

  // =========================================================================
  // 9. EVENT LISTENERS
  // =========================================================================
  function bindEventListeners() {
    // Search input live filtering
    if (facilitySearchInput) {
      facilitySearchInput.addEventListener("input", () => {
        if (clearSearchBtn) {
          clearSearchBtn.style.display = facilitySearchInput.value.length > 0 ? "block" : "none";
        }
        renderFacilities();
      });
    }

    // Clear search button
    if (clearSearchBtn && facilitySearchInput) {
      clearSearchBtn.addEventListener("click", () => {
        facilitySearchInput.value = "";
        clearSearchBtn.style.display = "none";
        renderFacilities();
        facilitySearchInput.focus();
      });
    }

    // Filter pills (All, Open, Available, Busy)
    if (filterPillsContainer) {
      filterPillsContainer.querySelectorAll(".filter-pill").forEach(pill => {
        pill.addEventListener("click", () => {
          filterPillsContainer.querySelectorAll(".filter-pill").forEach(p => p.classList.remove("active"));
          pill.classList.add("active");
          currentFilter = pill.getAttribute("data-filter") || "all";
          renderFacilities();
        });
      });
    }

    // Reset filters button
    if (resetFilterBtn) {
      resetFilterBtn.addEventListener("click", () => {
        if (facilitySearchInput) facilitySearchInput.value = "";
        if (clearSearchBtn) clearSearchBtn.style.display = "none";
        currentFilter = "all";
        if (filterPillsContainer) {
          filterPillsContainer.querySelectorAll(".filter-pill").forEach(p => {
            p.classList.toggle("active", p.getAttribute("data-filter") === "all");
          });
        }
        renderFacilities();
      });
    }

    // Route Finder button click
    if (getRouteBtn) {
      getRouteBtn.addEventListener("click", () => {
        const origin = routeOriginSelect.value;
        const destination = routeDestSelect.value;
        displayRoute(origin, destination);
        showToast(`Route updated: ${origin} → ${destination}`, "info");
      });
    }

    // Status simulate refresh button
    if (refreshStatusBtn) {
      refreshStatusBtn.addEventListener("click", () => {
        if (refreshIcon) {
          refreshIcon.style.transition = "transform 0.6s ease";
          refreshIcon.style.transform = "rotate(360deg)";
          setTimeout(() => {
            refreshIcon.style.transform = "rotate(0deg)";
          }, 600);
        }
        renderStatusTable();
        showToast("Facility live statuses re-synced with prototype cache.", "success");
      });
    }

    // Booking form submission
    if (bookingForm) {
      bookingForm.addEventListener("submit", handleBookingSubmit);
    }

    // Live validation cleanups on input
    studentNameInput?.addEventListener("input", () => clearInputError(nameError, studentNameInput));
    studentIdInput?.addEventListener("input", () => clearInputError(idError, studentIdInput));
    bookingFacilitySelect?.addEventListener("change", () => clearInputError(facilityError, bookingFacilitySelect));
    bookingSlotSelect?.addEventListener("change", () => clearInputError(slotError, bookingSlotSelect));
    bookingDateInput?.addEventListener("change", () => clearInputError(dateError, bookingDateInput));
    demoConsentCheckbox?.addEventListener("change", () => clearInputError(consentError, demoConsentCheckbox));
  }

  // =========================================================================
  // 10. UI HELPERS (ERRORS, ALERTS, TOASTS)
  // =========================================================================
  function setInputError(errorEl, inputEl, message) {
    if (errorEl) errorEl.textContent = message;
    if (inputEl) inputEl.classList.add("is-invalid");
  }

  function clearInputError(errorEl, inputEl) {
    if (errorEl) errorEl.textContent = "";
    if (inputEl) inputEl.classList.remove("is-invalid");
  }

  function clearAllInputErrors() {
    clearInputError(nameError, studentNameInput);
    clearInputError(idError, studentIdInput);
    clearInputError(facilityError, bookingFacilitySelect);
    clearInputError(slotError, bookingSlotSelect);
    clearInputError(dateError, bookingDateInput);
    clearInputError(consentError, demoConsentCheckbox);
    if (bookingAlert) {
      bookingAlert.className = "alert-box hidden";
      bookingAlert.innerHTML = "";
    }
  }

  function setBookingAlert(message, type) {
    if (!bookingAlert) return;
    bookingAlert.className = `alert-box alert-${type}`;
    bookingAlert.innerHTML = `
      <span>${message}</span>
      <button type="button" style="background:none; border:none; cursor:pointer; font-weight:bold; color:inherit;" onclick="this.parentElement.classList.add('hidden')">&times;</button>
    `;
    bookingAlert.classList.remove("hidden");
  }

  function showToast(message, type = "info") {
    if (!toastContainer) return;

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <span>${escapeHTML(message)}</span>
      <button type="button" class="toast-close-btn" aria-label="Close notification">&times;</button>
    `;

    toast.querySelector(".toast-close-btn").addEventListener("click", () => {
      toast.remove();
    });

    toastContainer.appendChild(toast);

    // Auto dismiss after 4 seconds
    setTimeout(() => {
      if (toast.parentElement) {
        toast.style.opacity = "0";
        toast.style.transition = "opacity 0.3s ease";
        setTimeout(() => toast.remove(), 300);
      }
    }, 4000);
  }

  // Helper to prevent XSS in rendering
  function escapeHTML(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // Run app
  init();
});
