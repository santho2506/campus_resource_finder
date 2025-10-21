const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

// ==================== MIDDLEWARE ====================
app.use(cors());
app.use(express.json());
app.use(express.static('frontend'));

// ==================== HELPER FUNCTIONS ====================
function readData() {
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading data:', error);
        return { users: [], resources: [], bookings: [] };
    }
}

function writeData(data) {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error('Error writing data:', error);
        return false;
    }
}

// ==================== INITIALIZE DATA ====================
if (!fs.existsSync(DATA_FILE)) {
    const initialData = {
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
    writeData(initialData);
}

// ==================== USER ROUTES ====================

// Get all users
app.get('/api/users', (req, res) => {
    const data = readData();
    res.json(data.users);
});

// Get user by ID
app.get('/api/users/:id', (req, res) => {
    const data = readData();
    const user = data.users.find(u => String(u.id) === String(req.params.id));
    user ? res.json(user) : res.status(404).json({ error: 'User not found' });
});

// Create new user (Register)
app.post('/api/users', (req, res) => {
    const data = readData();
    const newUser = { id: Date.now().toString(), ...req.body };
    data.users.push(newUser);
    writeData(data) ? res.status(201).json(newUser) : res.status(500).json({ error: 'Failed to create user' });
});

// Login
app.post('/api/login', (req, res) => {
    const { registrationNumber, password } = req.body;
    const data = readData();

    const user = data.users.find(u =>
        u.registrationNumber === registrationNumber &&
        u.password === password
    );

    if (user) res.json({ success: true, user });
    else res.status(401).json({ success: false, error: 'Invalid credentials' });
});

// Update user
app.put('/api/users/:id', (req, res) => {
    const data = readData();
    const index = data.users.findIndex(u => String(u.id) === String(req.params.id));

    if (index !== -1) {
        data.users[index] = { ...data.users[index], ...req.body };
        writeData(data) ? res.json(data.users[index]) : res.status(500).json({ error: 'Failed to update user' });
    } else {
        res.status(404).json({ error: 'User not found' });
    }
});

// Delete user
app.delete('/api/users/:id', (req, res) => {
    const data = readData();
    const index = data.users.findIndex(u => String(u.id) === String(req.params.id));

    if (index !== -1) {
        data.users.splice(index, 1);
        writeData(data) ? res.json({ success: true, message: 'User deleted' }) : res.status(500).json({ error: 'Failed to delete user' });
    } else {
        res.status(404).json({ error: 'User not found' });
    }
});

// ==================== RESOURCE ROUTES ====================

app.get('/api/resources', (req, res) => {
    const data = readData();
    res.json(data.resources);
});

app.get('/api/resources/:id', (req, res) => {
    const data = readData();
    const resource = data.resources.find(r => String(r.id) === String(req.params.id));
    resource ? res.json(resource) : res.status(404).json({ error: 'Resource not found' });
});

app.get('/api/resources/type/:type', (req, res) => {
    const data = readData();
    const resources = data.resources.filter(r =>
        r.type.toLowerCase().includes(req.params.type.toLowerCase())
    );
    res.json(resources);
});

app.post('/api/resources', (req, res) => {
    const data = readData();
    const newResource = { id: Date.now().toString(), ...req.body };
    data.resources.push(newResource);
    writeData(data) ? res.status(201).json(newResource) : res.status(500).json({ error: 'Failed to create resource' });
});

app.put('/api/resources/:id', (req, res) => {
    const data = readData();
    const index = data.resources.findIndex(r => String(r.id) === String(req.params.id));

    if (index !== -1) {
        data.resources[index] = { ...data.resources[index], ...req.body };
        writeData(data) ? res.json(data.resources[index]) : res.status(500).json({ error: 'Failed to update resource' });
    } else {
        res.status(404).json({ error: 'Resource not found' });
    }
});

app.delete('/api/resources/:id', (req, res) => {
    const data = readData();
    const index = data.resources.findIndex(r => String(r.id) === String(req.params.id));

    if (index !== -1) {
        data.resources.splice(index, 1);
        writeData(data) ? res.json({ success: true, message: 'Resource deleted' }) : res.status(500).json({ error: 'Failed to delete resource' });
    } else {
        res.status(404).json({ error: 'Resource not found' });
    }
});

// ==================== BOOKING ROUTES ====================

// Get all bookings
app.get('/api/bookings', (req, res) => {
    const data = readData();
    res.json(data.bookings);
});

// Get booking by ID
app.get('/api/bookings/:id', (req, res) => {
    const data = readData();
    const booking = data.bookings.find(b => String(b.id) === String(req.params.id));
    booking ? res.json(booking) : res.status(404).json({ error: 'Booking not found' });
});

// Get bookings by user ID
app.get('/api/bookings/user/:userId', (req, res) => {
    const data = readData();
    const bookings = data.bookings.filter(b => String(b.userId) === String(req.params.userId));
    res.json(bookings);
});

// Get bookings by resource ID
app.get('/api/bookings/resource/:resourceId', (req, res) => {
    const data = readData();
    const bookings = data.bookings.filter(b => String(b.resourceId) === String(req.params.resourceId));
    res.json(bookings);
});

// Create new booking
app.post('/api/bookings', (req, res) => {
    const data = readData();

    const resource = data.resources.find(r => String(r.id) === String(req.body.resourceId));
    const user = data.users.find(u => String(u.id) === String(req.body.userId));

    if (!resource || !user) {
        return res.status(404).json({ error: 'Resource or User not found' });
    }

    const newBooking = {
        id: Date.now().toString(),
        userId: req.body.userId,
        userName: user.fullName,
        resourceId: req.body.resourceId,
        resourceName: resource.name,
        resourceType: resource.type,
        date: req.body.date,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
        status: 'Confirmed',
        bookedOn: new Date().toISOString().split('T')[0]
    };

    data.bookings.push(newBooking);
    writeData(data) ? res.status(201).json(newBooking) : res.status(500).json({ error: 'Failed to create booking' });
});

// Update booking
app.put('/api/bookings/:id', (req, res) => {
    const data = readData();
    const index = data.bookings.findIndex(b => String(b.id) === String(req.params.id));

    if (index !== -1) {
        data.bookings[index] = { ...data.bookings[index], ...req.body };
        writeData(data) ? res.json(data.bookings[index]) : res.status(500).json({ error: 'Failed to update booking' });
    } else {
        res.status(404).json({ error: 'Booking not found' });
    }
});

// Cancel booking (Delete)
app.delete('/api/bookings/:id', (req, res) => {
    const data = readData();
    const index = data.bookings.findIndex(b => String(b.id) === String(req.params.id));

    if (index !== -1) {
        const deletedBooking = data.bookings[index];
        data.bookings.splice(index, 1);
        writeData(data)
            ? res.json({ success: true, message: 'Booking cancelled', booking: deletedBooking })
            : res.status(500).json({ error: 'Failed to cancel booking' });
    } else {
        res.status(404).json({ error: 'Booking not found' });
    }
});

// ==================== SERVER START ====================
app.listen(PORT, () => {
    console.log(`🚀 Campus Resource Finder Server running on http://localhost:${PORT}`);
    console.log(`📁 Data file: ${DATA_FILE}`);
    console.log(`\n📋 Available API endpoints:`);
    console.log(`   Users: /api/users`);
    console.log(`   Resources: /api/resources`);
    console.log(`   Bookings: /api/bookings`);
    console.log(`   Login: /api/login`);
});
