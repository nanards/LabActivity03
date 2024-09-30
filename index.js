
const express = require('express');
const bodyParser = require('body-parser');


const app = express();
const PORT = 3000;

app.use(bodyParser.json());

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});


const users = [];


app.get('/users', (req, res) => {
    console.log('GET /users endpoint was accessed');
    res.status(200).json(users);
});

const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

const isValidPassword = (password) => {
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()\-+.]).{6,20}$/;
    return passwordRegex.test(password);
}

app.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    
    switch (true) {
        case !name:
            return res.status(400).json({ error: 'All Email are required.' });
        case !email:
            return res.status(400).json({ error: 'All Password are required.' });
        case !password:
            return res.status(400).json({ error: 'All fields are required.' });
        case !isValidEmail(email):
            return res.status(400).json({ error: 'Invalid Email format.' });
        case !isValidPassword(password):
            return res.status(400).json({ error: 'Invalid password format. Password must be 6-20 characters long and include uppercase, lowercase, number, and special character.' });
        case users.some(user => user.email === email):
            return res.status(409).json({ error: 'Email already exists.' });
    }

    users.push({ name, email, password });
    console.log(`POST /users endpoint was accessed ${JSON.stringify(users)}`);
    res.status(201).json({ message: 'User registered successfully' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
