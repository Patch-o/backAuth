const express = require('express');
const passport = require('passport');
const router = express.Router();

router.post('/create', (req,res) => {
    
    const done = (error, user) => {
        if (error) {
            return res.status(500).json(error.message)
        } 
        req.logIn(user, (error) => {
            if(error) return res.status(error.status || 500).json(error.message);
            return res.status(201).json(user);
        })
    }
    passport.authenticate('register', done)(req);
    
})


router.post('/login', (req,res) => {
    const done = (error, user) => {
        if (error) {
            return res.status(error.status || 500).json(error.message)
        } 
        req.logIn(user, (error) => {
            if(error) return res.status(error.status || 500).json(error.message);
            return res.status(200).json(user);

        });
    
    }
    passport.authenticate('login', done)(req);
})


router.post('/logout', async (req,res) => {
    if (req.user) {
        await req.logOut(() => {
            req.session.destroy(() => {
                res.clearCookie("connect.sid");
                return res.status(200).json("goodbye!!")
            })
        })
    } else {
        return res.status(404).json('No user authenticated')
    }
});

router.post('/test', (req,res) => {
    console.log(`user authenticated`,req.user);
    return res.status(200).json(req.user);
})
module.exports = router;