const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    req.dbConnection.query('SELECT * FROM users WHERE email = ? AND active = true', email, async (error, results) => {
        if (error) throw error;
    
        const user = results[0];

        if (!user) {
            return res.status(401).json({ message: 'Authentication failed' });
        }
    
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Authentication failed' });
        }
    
        const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY, { expiresIn: '1h' });
    
        res.json({ token: token, userId:  user.id, menu: user.menu, role: user.role });
    });

});

router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
  
    req.dbConnection.query('SELECT * FROM users WHERE email = ?', email, async (error, results) => {
        if (error) throw error;
    
        const user = results[0];

        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        req.dbConnection.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword], (error, results) => {
            if (error) throw error;

            const token = jwt.sign({ userId: results.insertId }, process.env.SECRET_KEY, { expiresIn: '1h' });
    
            res.json({ token });
        });
    });    
});

module.exports = router;