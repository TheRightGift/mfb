const formidable = require('formidable');
const router = require('express').Router();  
const passport = require('passport'); 
const connect = require('../../../config/db');
const User = require('../../../models/user');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
});

router.get('/all', passport.authenticate('jwt', { session: false }), function(req, res, next){
    try{
        connect.then(db => {
            User.find({dateDeleted: { $exists: false }}, {}, function(err, users){
                if(err){
                    res.status(401).json({ success: false, msg: "No user found" });
                } else {
                    res.status(200).json({ success: true, users: users});
                }
            });
        })
    } catch (inException) {// Handle any unexpected problems, ensuring the server doesn't go down.
        //console.log(`${inException}`);
    }
});

router.get('/user/:id', passport.authenticate('jwt', { session: false }), function(req, res, next){
    let userId = req.params.id;
    try{
        connect.then(db => {            
            User.findOne({_id: userId, dateDeleted: { $exists: false }}, {}, function(err, user){
                if(err){
                    res.status(401).json({ success: false, msg: "User not found" });
                } else {
                    res.status(200).json({ success: true, user: user});
                }
            });                    
        });
    } catch (inException) {// Handle any unexpected problems, ensuring the server doesn't go down.
        //console.log(`${inException}`);
    }
});

router.patch('/update/:id', passport.authenticate('jwt', { session: false }), function(req, res, next){
// router.patch('/update/:id', function(req, res, next){
    let userId = req.params.id;
    user = new Object();

    new formidable.IncomingForm().parse(req)
    .on('field', (field, value) => {
        if(field == 'firstname'){
            user.firstname = value;
        }
        if(field == 'lastname'){
            user.lastname = value;
        }
        if(field == 'username'){
            user.username = value;
        }
        if(field == 'email'){
            user.email = value;
        }
        if(field == 'emailVerified'){
            user.emailVerified = value;
        }
        if(field == 'phoneVerified'){
            user.phoneVerified = value;
        }
        if(field == 'phone'){
            user.phone = value;
        }
        if(field == 'PIN'){
            user.PIN = value;
        }
        if(field == 'gender'){
            user.gender = value;
        }
        if(field == 'password'){
            user.password = value;
        }
        if(field == 'dateDeleted'){
            user.dateDeleted = value;
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
        try{
            connect.then(db => {                
                User.findOneAndUpdate({_id: userId}, {$set: user}, {new: true}, (err, userDoc) => {
                    if(err){
                        res.json({ status: 401, msg: "User not updated" });
                    } else {
                        if(user.PIN){
                            // TODO: send OTP to user email
                            let userEmail = userDoc.email;
                            let mailOptions = {
                                from: process.env.EMAIL_USERNAME,
                                to: userEmail,
                                subject: 'GoFast: Transaction PIN',
                                text: 'Please save this PIN and provide on request:'+user.PIN
                            };
                                
                            transporter.sendMail(mailOptions, function(error, info){
                                if (error) {
                                    res.json({ status: 401, msg: "Transaction PIN not sent to user's email: "+userEmail });
                                } else {
                                    res.json({ status: 200, data: 'Transaction PIN sent to user email'});
                                }
                            });
                            // res.json({ status: 201, user: userDoc});
                        } else {
                            res.json({ status: 201, user: userDoc});
                        }
                        
                    }
                })      
            });
        } catch (inException) {// Handle any unexpected problems, ensuring the server doesn't go down.
            //console.log(`${inException}`);
            res.json({ status: 501, msg: "Error! Please inform tech." });
        }
    }); 
    
});

router.delete('/confirmPIN', passport.authenticate('jwt', { session: false }), function(req, res, next){
// router.post('/confirmPIN', function(req, res, next){
    userObj = new Object();

    new formidable.IncomingForm().parse(req)
    .on('field', (field, value) => {
        
        if(field == 'userId'){
            userObj.userId = value;
        }          
        if(field == 'PIN'){
            userObj.PIN = value;
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
        User.findOne({_id: userObj.userId, PIN: userObj.PIN}, {}, function(err, userDoc){
            if(userDoc && userDoc.PIN){                
                res.json({ status: 200, user: userDoc });
            } else {
                res.json({ status: 401, msg: "Invalid PIN" });
            }
        });
    });
});

router.patch('/addContact/:id', function(req, res, next){
    let userId = req.params.id;
    userAddressObj = new Object();

    new formidable.IncomingForm().parse(req)
    .on('field', (field, value) => {
        
        if(field == 'names'){
            userAddressObj.names = value;
        }          
        if(field == 'phone'){
            userAddressObj.phone = value;
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
        // check if any user with this phone number exists
        User.findOne({phone: userAddressObj.phone}, {}, function(err, userDoc){
            if(userDoc && userDoc.phone){//phone number register against any account 
                User.findOneAndUpdate({_id: userId}, { "$push": { "contacts": {"phone": userAddressObj.phone, "registered": "Y", "synched": "Y", "names": userDoc.firstname+' '+userDoc.lastname, "username": userDoc.username, "userId": userDoc._id}}}, {}, function(err, userDoc){
                    if(userDoc && userDoc._id){                
                        res.json({ status: 200, user: userDoc });
                    } else {
                        console.log(err)
                        res.json({ status: 401, msg: "Contact not inserted" });
                    }
                });
            } else {//phone number not register against any account
                User.findOneAndUpdate({_id: userId}, { "$push": { "contacts": { "names": userAddressObj.names, "phone": userAddressObj.phone, "registered": "N", "synched": "N"}}}, {}, function(err, userDoc){
                    if(userDoc && userDoc._id){                
                        res.json({ status: 201});
                    } else {
                        console.log(err)
                        res.json({ status: 401, msg: "Contact not inserted" });
                    }
                });
            }
        });
        
    });
});

router.delete('/deleteWallet/:id', passport.authenticate('jwt', { session: false }), function(req, res, next){
    let userId = req.params.id;

    try{
        connect.then(db => {            
            User.findOne({_id: userId, dateDeleted: { $exists: false }}, {}, function(err, user){
                if(err){
                    res.status(401).json({ success: false, msg: "User not found" });
                } else {
                    // res.status(200).json({ success: true, user: user});
                }
            });                    
        });
    } catch (inException) {// Handle any unexpected problems, ensuring the server doesn't go down.
        //console.log(`${inException}`);
    }
});
module.exports = router;