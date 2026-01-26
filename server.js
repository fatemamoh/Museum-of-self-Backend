const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const app = express();

const mongoose = require('mongoose');
const cors = require('cors');
const logger = require('morgan');
const { sendWelcomeEmail } = require('./services/emailService');

// Controllers
const authCtrl = require('./controllers/auth');
const userCtrl = require('./controllers/users')
const lifePhaseCtrl = require('./controllers/lifePhases');
const memoryCtrl = require('./controllers/memories');
const reflectionCtrl = require('./controllers/reflections');

// Middleware
const verifyToken = require('./middleware/verify-token');

mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

app.use(cors());
app.use(express.json());
app.use(logger('dev'));

// Public Routes
app.use('/auth', authCtrl);

app.get('/test-email-ui', async (req, res) => {
    try {
        await sendWelcomeEmail('ghostlyblueme@gmail.com', 'Test Curator');
        res.send('<h1>Check your inbox! The Museum Invitation has been sent.</h1>');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Protected Routes
app.use(verifyToken);
app.use('/users', userCtrl);
app.use('/lifePhases', lifePhaseCtrl);
app.use('/memories', memoryCtrl);
app.use('/reflections', reflectionCtrl);


app.listen(process.env.PORT || 3000, () => {
  console.log('The express app is ready!');
});

