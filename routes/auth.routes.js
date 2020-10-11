const {Router} = require('express');
const bcrypt = require('bcrypt');
const config = require('config');
const jwt = require('jsonwebtoken');
const {check, validationResult} = require('express-validator');
const User = require('../models/User');
const router = Router();


// /api/auth/register  - это префикс из app.use() в файле app.js
// В массиве [] мы поключаем middleware который будет валидировать указанные поля
router.post('/register', [
        check('email', 'wrong type of email').isEmail(),
        check('password', 'Wrong password min 6 simbols').isLength({min: 6})
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Incorrect data for registration'
                })
            }

            const {email, password} = req.body;
            const candidate = await User.findOne({email});
            if (candidate) {
                return res.status(400).json({message: 'Such user already exist, choose another email.'})
            }
            const hashedPassword = await bcrypt.hash(password, 12);
            const user = new User({email, password: hashedPassword})

            await user.save();
            res.status(201).json({message: 'New user created'})
        } catch (e) {
            res.status(500).json({message: "Something goes wrong, try again."})
        }
    })

router.post('/login', [
    check('email', 'Incorrect email').normalizeEmail().isEmail(),
    check('password', 'Insert your password').exists()
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: 'Incorrect data when log in'
            })
        }

        const {email, password} = req.body;
        const user = await User.findOne({email});
        if (!user) {
            return res.status(400).json({message: 'Such User is not found'})
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({message: 'Dont send any message for hackers'})
        }

        const  token = jwt.sign(
            {userId: user.id},
            config.get('jwtSecret'),
            {expiresIn: '1h'}
        )
        res.json({token, userId: user.id})

    } catch (e) {
        res.status(500).json({message: "Something goes wrong, try again."})
    }
})

module.exports = router;