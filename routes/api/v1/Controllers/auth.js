const formidable = require('formidable');
// const bcrypt = require('bcrypt');
// const nodemailer = require('nodemailer');
const router = require('express').Router();  
const passport = require('passport'); 
// const connect = require('../../../../config/db');
const Users = require('../../../../models/user');
const Verifiers = require('../../../../models/verifier');
const utils = require('../../../../lib/utils');
const authServices = require('../Services/authServices');
// const axios = require('axios');
// const path = require('path');
// const randtoken = require('rand-token');
// const { crossOriginResourcePolicy } = require('helmet');


router.get('/protected', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    res.status(200).json({ success: true, msg: "You are successfully authenticated to this route!"});
});

// Validate an existing user (with email and password) and issue a JWT
router.post('/login', async (req, res) => {
    await authServices.login(req, res);
});

// Validate an existing user (with biometrics) and issue a JWT
router.post('/loginWithBiometrics', function(req, res){
    
    loginUser = new Object();

    new formidable.IncomingForm().parse(req)
    .on('field', (field, value) => {
        
        if(field == 'id'){
            loginUser.id = value;
        }          
    })
    .on('aborted', () =>{
        console.error('request aborted by user')
    })
    .on('error', (err) => {
        console.error('Error', err)
        throw err
    }) 
    .on('end', () => {
        Users.findOne({_id: loginUser.id}, {}, function(err, userDoc){
            if(userDoc && userDoc.password){
                const tokenObject = utils.issueJWT(userDoc);
                res.json({ status: 200, user: userDoc, userBalance: userBalance, token: tokenObject.token, expiresIn: tokenObject.expires });
                            
            } else {
                res.json({ status: 501, msg: "Invalid login details" });
            }
        });
    });
});

// Register a new user
router.post('/register', async (req, res, next) => {
    await authServices.register(req, res);
});

router.post('/verifyOTP', async (req, res) => {
    await authServices.verifyOTP(req, res);
});

router.post('/confirmUniqueUsername', function(req, res){
    
    userN = new Object();

    new formidable.IncomingForm().parse(req)
    .on('field', (field, value) => {
        
        if(field == 'username'){
            userN.username = value;
        }    
        
    })
    .on('aborted', () =>{
        console.error('request aborted by user')
    })
    .on('error', (err) => {
        console.error('Error', err)
        throw err
    }) 
    .on('end', () => {
        Users.findOne({username: userN.username}, {}, function(err, userDoc){
            if(err){
                res.status(501).json({ msg: 'Server error.' });
            } else {
                if(userDoc.length > 1){
                    res.status(401).json({ msg: 'Not available.' });
                } else {
                    res.status(200).json({ msg: 'Available.' });
                }
                
            }
        });
    });
});

// email verification
router.post('/emailVerification', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    await authServices.updateUserVerifyEmailPhone(req, res, 'email');
});

// phone verification
router.post('/phoneVerification', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    await authServices.updateUserVerifyEmailPhone(req, res, 'phone');
});

// resend OTP
router.post('/sendOTP', async (req, res, next) => {
    await authServices.resendOTP(req, res)
});

router.post('/reset-password-email', async (req, res, next) => {
    await authServices.resetPasswordEmail(req, res)
});
router.post('/update-password', async (req, res, next) => {
    await authServices.updatePassword(req, res)
});

module.exports = router;
