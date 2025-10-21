// Data Storage
let appData = {
    users: [],
    resources: [
        {
            id: 1,
            name: "Study Room 102",
            type: "Study Room",
            building: "Main Library",
            capacity: 30,
            facilities: ["High-Speed Computers", "Programming Software", "Wi-Fi"],
            available: true
        },
        {
            id: 2,
            name: "Meeting Room A",
            type: "Conference Room",
            building: "Admin Block",
            capacity: 15,
            facilities: ["Projector", "Whiteboard", "Video Conference"],
            available: true
        },
        {
            id: 3,
            name: "Conference Hall 1",
            type: "Conference Room",
            building: "Academic Building",
            capacity: 50,
            facilities: ["Audio System", "Podium", "AC"],
            available: true
        },
        {
            id: 4,
            name: "Badminton Court",
            type: "Sports Facility",
            building: "Sports Complex",
            capacity: 4,
            facilities: ["Outdoor Court", "Night Lights", "Equipment Rental"],
            available: true
        },
        {
            id: 5,
            name: "Tennis Court",
            type: "Sports Facility",
            building: "Sports Complex",
            capacity: 4,
            facilities: ["Outdoor Court", "Night Lights", "Equipment Rental"],
            available: true
        },
        {
            id: 6,
            name: "Reading Hall A",
            type: "Library Resource",
            building: "Main Library",
            capacity: 50,
            facilities: ["Silent Zone", "Individual Desks", "AC"],
            available: true
        }
    ],
    bookings: []
};

let currentUser = null;
let selectedResource = null;

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    showLandingPage();
});

// Data Management
function saveData() {
    localStorage.setItem('campusData', JSON.stringify(appData));
}

function loadData() {
    const saved = localStorage.getItem('campusData');
    if (saved) {
        appData = JSON.parse(saved);
    }
}

// Page Navigation
function showLandingPage() {
    const html = `
        <div class="landing-page">
            <div class="landing-content">
                <div class="landing-badge">
                    <span style="font-size: 1.5rem;">🎓</span>
                    <span>Campus Management System</span>
                </div>
                <h1 class="landing-title">Campus Resource Finder</h1>
                <p class="landing-subtitle">
                    Streamline your campus experience with our intelligent resource booking system. 
                    Find and reserve study rooms, computer labs, sports facilities, and more.
                </p>
                <button class="btn-get-started" onclick="showLoginPage()">
                    Get Started →
                </button>
            </div>
        </div>
    `;
    document.getElementById('app').innerHTML = html;
}

function showLoginPage() {
    const html = `
        <div class="auth-page">
            <div class="auth-container">
                <h2 class="auth-title">Login</h2>
                <form onsubmit="handleLogin(event)">
                    <div class="form-group">
                        <label class="form-label">Registration Number *</label>
                        <input type="text" class="form-input" id="loginRegNum" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Password *</label>
                        <input type="password" class="form-input" id="loginPassword" required>
                    </div>
                    <button type="submit" class="btn-primary">Login</button>
                </form>
                <div class="auth-footer">
                    Don't have an account? 
                    <button class="link-btn" onclick="showRegisterPage()">Create Account</button>
                </div>
            </div>
        </div>
    `;
    document.getElementById('app').innerHTML = html;
}

function showRegisterPage() {
    const html = `
        <div class="auth-page">
            <div class="auth-container">
                <div class="auth-header">
                    <h2 class="auth-title">Create Account</h2>
                    <button class="close-btn" onclick="showLoginPage()">×</button>
                </div>
                <p style="color: #666; margin-bottom: 20px;">Register using your college registration number and date of birth</p>
                <form onsubmit="handleRegister(event)">
                    <div class="form-group">
                        <label class="form-label">Registration Number *</label>
                        <input type="text" class="form-input" id="regNum" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Full Name *</label>
                        <input type="text" class="form-input" id="fullName" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Date of Birth *</label>
                        <input type="date" class="form-input" id="dob" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Password *</label>
                        <input type="password" class="form-input" id="password" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Email</label>
                        <input type="email" class="form-input bg-blue" id="email">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Phone Number</label>
                        <input type="tel" class="form-input bg-blue" id="phone">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Department</label>
                        <input type="text" class="form-input" id="department">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Role *</label>
                        <select class="form-select" id="role">
                            <option>Student</option>
                            <option>Faculty</option>
                            <option>Staff</option>
                        </select>
                    </div>
                    <button type="submit" class="btn-primary">Create Account</button>
                </form>
                <div class="auth-footer">
                    Already have an account? 
                    <button class="link-btn" onclick="showLoginPage()">Login here</button>
                </div>
            </div>
        </div>
    `;
    document.getElementById('app').innerHTML = html;
}

function showDashboard(tab = 'search') {
    const activeBookings = appData.bookings.filter(b => 
        b.userId === currentUser.id && new Date(b.date) >= new Date()
    );
    
    const allUserBookings = appData.bookings.filter(b => b.userId === currentUser.id);

    const html = `
        <div class="dashboard">
            <header class="header">
                <div class="header-content">
                    <div class="logo">Campus Resource Finder</div>
                    <div class="user-info">
                        <div class="user-avatar">${currentUser.fullName.charAt(0)}</div>
                        <div class="user-details">
                            <div class="user-name">${currentUser.fullName}</div>
                            <span class="user-role">${currentUser.role}</span>
                        </div>
                        <button class="btn-logout" onclick="logout()">Logout</button>
                    </div>
                </div>
            </header>
            
            <nav class="nav-tabs">
                <div class="nav-tabs-content">
                    <button class="nav-tab ${tab === 'search' ? 'active' : ''}" onclick="showDashboard('search')">
                        Search Resources
                    </button>
                    <button class="nav-tab ${tab === 'bookings' ? 'active' : ''}" onclick="showDashboard('bookings')">
                        My Bookings
                    </button>
                    <button class="nav-tab ${tab === 'history' ? 'active' : ''}" onclick="showDashboard('history')">
                        History
                    </button>
                </div>
            </nav>
            
            <main class="main-content">
                <div id="tab-content">
                    ${tab === 'search' ? renderSearchTab() : ''}
                    ${tab === 'bookings' ? renderBookingsTab(activeBookings) : ''}
                    ${tab === 'history' ? renderHistoryTab(allUserBookings) : ''}
                </div>
            </main>
        </div>
    `;
    document.getElementById('app').innerHTML = html;
}

function renderSearchTab() {
    return `
        <div class="resource-grid">
            ${appData.resources.map(resource => `
                <div class="resource-card">
                    <div class="resource-header">
                        <div>
                            <h3 class="resource-title">${resource.name}</h3>
                            <p class="resource-building">${resource.building}</p>
                        </div>
                        <span class="resource-type-badge">${resource.type}</span>
                    </div>
                    <div class="resource-info">
                        <div class="resource-capacity">
                            <span>👥</span>
                            <span>Capacity: ${resource.capacity} persons</span>
                        </div>
                        <div>
                            <div class="facilities-label">Facilities:</div>
                            <div class="facilities-list">
                                ${resource.facilities.map(f => `
                                    <span class="facility-tag">${f}</span>
                                `).join('')}
                            </div>
                        </div>
                        ${resource.available ? '<div class="available-badge">✓ Available</div>' : ''}
                    </div>
                    <button class="btn-book" onclick='openBookingModal(${JSON.stringify(resource)})'>
                        Book Now
                    </button>
                </div>
            `).join('')}
        </div>
    `;
}

function renderBookingsTab(bookings) {
    if (bookings.length === 0) {
        return `
            <div class="empty-state">
                <div class="empty-icon">📅</div>
                <p class="empty-text">No active bookings found</p>
            </div>
        `;
    }
    
    return `
        <div class="bookings-header">
            <h2 class="bookings-title">My Active Bookings</h2>
            <p class="bookings-subtitle">Manage your current bookings</p>
        </div>
        <div class="bookings-list">
            ${bookings.map(booking => `
                <div class="booking-card">
                    <div class="booking-content">
                        <div class="booking-details">
                            <h3 class="booking-name">${booking.resourceName}</h3>
                            <div class="booking-info">
                                <div class="booking-info-row">
                                    <span class="info-label">Type:</span>
                                    <span>${booking.resourceType}</span>
                                </div>
                                <div class="booking-info-row">
                                    <span class="info-label">Date:</span>
                                    <span>${booking.date}</span>
                                </div>
                                <div class="booking-info-row">
                                    <span class="info-label">Time:</span>
                                    <span>${booking.startTime} - ${booking.endTime}</span>
                                </div>
                            </div>
                        </div>
                        <div class="booking-actions">
                            <span class="status-badge">Confirmed</span>
                            <button class="btn-cancel" onclick="cancelBooking(${booking.id})">Cancel Booking</button>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function renderHistoryTab(bookings) {
    if (bookings.length === 0) {
        return `
            <div class="empty-state">
                <div class="empty-icon">📜</div>
                <p class="empty-text">No booking history found</p>
            </div>
        `;
    }
    
    return `
        <div class="bookings-header">
            <h2 class="bookings-title">Booking History</h2>
            <p class="bookings-subtitle">View all your past and current bookings</p>
        </div>
        <div class="bookings-list">
            ${bookings.map(booking => `
                <div class="booking-card">
                    <div class="booking-content">
                        <div class="booking-details">
                            <h3 class="booking-name">${booking.resourceName}</h3>
                            <div class="booking-info">
                                <div class="booking-info-row">
                                    <span class="info-label">Type:</span>
                                    <span>${booking.resourceType}</span>
                                </div>
                                <div class="booking-info-row">
                                    <span class="info-label">Date:</span>
                                    <span>${booking.date}</span>
                                </div>
                                <div class="booking-info-row">
                                    <span class="info-label">Time:</span>
                                    <span>${booking.startTime} - ${booking.endTime}</span>
                                </div>
                                <div class="booking-info-row">
                                    <span class="info-label">Booked on:</span>
                                    <span>${booking.bookedOn}</span>
                                </div>
                            </div>
                        </div>
                        <span class="status-badge">Confirmed</span>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// Event Handlers
function handleRegister(e) {
    e.preventDefault();
    const newUser = {
        id: Date.now(),
        registrationNumber: document.getElementById('regNum').value,
        fullName: document.getElementById('fullName').value,
        dateOfBirth: document.getElementById('dob').value,
        password: document.getElementById('password').value,
        email: document.getElementById('email').value,
        phoneNumber: document.getElementById('phone').value,
        department: document.getElementById('department').value,
        role: document.getElementById('role').value
    };
    
    appData.users.push(newUser);
    saveData();
    alert('Account created successfully!');
    showLoginPage();
}

function handleLogin(e) {
    e.preventDefault();
    const regNum = document.getElementById('loginRegNum').value;
    const password = document.getElementById('loginPassword').value;
    
    const user = appData.users.find(u => 
        u.registrationNumber === regNum && u.password === password
    );
    
    if (user) {
        currentUser = user;
        showDashboard('search');
    } else {
        alert('Invalid credentials!');
    }
}

function logout() {
    currentUser = null;
    showLandingPage();
}

function openBookingModal(resource) {
    selectedResource = resource;
    const modal = `
        <div class="modal-overlay" onclick="closeModalOnOutside(event)">
            <div class="modal">
                <div class="modal-header">
                    <h2 class="modal-title">Book ${resource.name}</h2>
                    <button class="close-btn" onclick="closeBookingModal()">×</button>
                </div>
                <p class="modal-subtitle">Fill in the details to complete your booking</p>
                <form onsubmit="handleBooking(event)">
                    <div class="form-group">
                        <label class="form-label">Booking Date *</label>
                        <input type="date" class="form-input" id="bookingDate" required 
                               min="${new Date().toISOString().split('T')[0]}">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Start Time *</label>
                        <input type="time" class="form-input" id="startTime" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">End Time *</label>
                        <input type="time" class="form-input" id="endTime" required>
                    </div>
                    <div class="resource-summary">
                        <div><strong>Resource:</strong> ${resource.name}</div>
                        <div><strong>Building:</strong> ${resource.building}</div>
                        <div><strong>Capacity:</strong> ${resource.capacity} persons</div>
                    </div>
                    <button type="submit" class="btn-primary" style="margin-top: 20px;">Confirm Booking</button>
                </form>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modal);
}

function closeBookingModal() {
    document.querySelector('.modal-overlay').remove();
    selectedResource = null;
}

function closeModalOnOutside(e) {
    if (e.target.classList.contains('modal-overlay')) {
        closeBookingModal();
    }
}

function handleBooking(e) {
    e.preventDefault();
    const newBooking = {
        id: Date.now(),
        userId: currentUser.id,
        userName: currentUser.fullName,
        resourceId: selectedResource.id,
        resourceName: selectedResource.name,
        resourceType: selectedResource.type,
        date: document.getElementById('bookingDate').value,
        startTime: document.getElementById('startTime').value,
        endTime: document.getElementById('endTime').value,
        status: 'Confirmed',
        bookedOn: new Date().toISOString().split('T')[0]
    };
    
    appData.bookings.push(newBooking);
    saveData();
    closeBookingModal();
    alert('Booking confirmed successfully!');
    showDashboard('bookings');
}

function cancelBooking(bookingId) {
    if (confirm('Are you sure you want to cancel this booking?')) {
        appData.bookings = appData.bookings.filter(b => b.id !== bookingId);
        saveData();
        showDashboard('bookings');
    }
}