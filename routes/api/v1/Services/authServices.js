const formidable = require('formidable');
const Users = require('../../../../models/user');
const Verifiers = require('../../../../models/verifier');
const utils = require('../../../../lib/utils');
const connect = require('../../../../config/db');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: 2525,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
});


const register = async (req, res) => {
    regUser = new Object();

    new formidable.IncomingForm().parse(req)
    .on('field', (field, value) => {
        if(field == 'user_type'){
            regUser.user_type = value;
        }
        if(field == 'firstname'){
            regUser.firstname = value;
        }
        if(field == 'lastname'){
            regUser.lastname = value;
        }
        if(field == 'othername'){
            regUser.othername = value;
        }
        if(field == 'phone'){
            regUser.phone = value;
        }
        if(field == 'email'){
            regUser.email = value;
        }        
        if(field == 'gender'){
            regUser.gender = value;
        }
        if(field == 'username'){
            regUser.username = value;
        }        
        if(field == 'password'){
            regUser.password = value;
        }
        if(field == 'address'){
            regUser.address = value;
        }
        if(field == 'dob'){
            regUser.id_type = value;
        }
    })
    .on('aborted', () =>{
        console.error('request aborted by user')
    })
    .on('error', (err) => {
        console.error('Error', err)
        // throw err
    }) 
    .on('end', () => {
        
        Users.findOne({$or: [{email: regUser.email},{username: regUser.username}]}, {}, function(err, userDoc){ 
            
            if(userDoc != null || userDoc && userDoc.email && userDoc.email != ''){
                res.status(422).json({msg: 'User Exists' });
            } else {              
                // generate has and salt for authentication 
                let {hash, salt} = utils.genPassword(regUser.password);

                // save user if hash and salt re generated
                if(hash && salt){
                    saveUser(regUser, hash, salt, res);
                } else {
                    res.status(501).json({msg: 'Internal server error.' });
                }                
            }
        });       
    });
}

const resendOTP = async (req, res) => {
    otp = new Object();
    
    new formidable.IncomingForm().parse(req)
    .on('field', (field, value) => {
        if(field == 'userId'){
            otp.userId = value;
        }
        if(field == 'type'){
            otp.type = value;
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
        sendOTP(otp.userId, otp.type);
        res.json({ status: 200, msg: "OTP sent!" });     
    });     
}

const login = async (req, res) => {
    loginUser = new Object();

    new formidable.IncomingForm().parse(req)
    .on('field', (field, value) => {
        
        if(field == 'emailOrUsername'){
            loginUser.emailOrUsername = value;
        }        
        if(field == 'password'){
            loginUser.password = value;
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
        Users.findOne({$or: [{email: loginUser.emailOrUsername},{username: loginUser.emailOrUsername}]}, {}, function(err, userDoc){
            console.log(userDoc);
            if(userDoc && userDoc.hash && userDoc.salt){
                // Change password to hash and salt
                let isAuthenticated = utils.validPassword(loginUser.password, userDoc.hash, userDoc.salt)
                if(isAuthenticated){
                    userDoc.hash = null;
                    userDoc.salt = null;
                    const tokenObject = utils.issueJWT(userDoc);
                    res.json({ status: 200, user: userDoc, token: tokenObject.token, expiresIn: tokenObject.expires });
                } else {
                    res.json({ status: 501, msg: "Invalid login details" });
                }
                // let userPass = userDoc.password;

                // bcrypt.compare(loginUser.password, userPass, function (err, user) {
                //     if(err || user == false){
                //         res.json({ status: 501, msg: "Invalid login details" });
                //     } else {
                //         const tokenObject = utils.issueJWT(userDoc);
                //         res.json({ status: 200, user: userDoc, token: tokenObject.token, expiresIn: tokenObject.expires });
                                                        
                //     }
                // })
            } else {
                res.json({ status: 501, msg: "Invalid login details..." });
            }
        });
    });
}

const updateUserVerifyEmailPhone = async (req, res, type) => {
    verifier = new Object();

    new formidable.IncomingForm().parse(req)
    .on('field', (field, value) => {
        if(field == 'userId'){
            verifier.userId = value;
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
            //save Asset to the database
            connect.then(db => {
                if(type == 'email'){
                    Users.findOneAndUpdate({_id: verifier.userId}, {$set: {emailVerified: 'Y'}}, (err, user) => {
                        if(err){
                            res.status(401).json({ success: false, msg: "User not verified" });
                        } else {
                            res.status(200).json({ success: true, user: user});
                        }
                    }) 
                }

                if(type == 'phone'){
                    Users.findOneAndUpdate({_id: verifier.userId}, {$set: {phoneVerified: 'Y'}}, (err, user) => {
                        if(err){
                            res.status(401).json({ success: false, msg: "User not verified" });
                        } else {
                            res.status(200).json({ success: true, user: user});
                        }
                    })    
                }
                               
            });
        } catch (inException) {// Handle any unexpected problems, ensuring the server doesn't go down.
            //console.log(`${inException}`);
        }
        
    }); 
}

const resetPasswordEmail = async (req, res) => {
    resetPass = new Object();
    
    new formidable.IncomingForm().parse(req)
    .on('field', (field, value) => {
        if(field == 'email'){
            resetPass.email = value;
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
                Users.findOne({email: resetPass.email}, {}, function(err, userDoc){
                    if(err){
                        res.json({ status: 401, msg: "Email is not registered" });
                    } else {
                        sendOTP(userDoc._id, 'email');
                        res.json({ status: 200, msg: "OTP sent!" });  
                    }
                });                               
            });
        } catch (inException) {// Handle any unexpected problems, ensuring the server doesn't go down.
            //console.log(`${inException}`);
        }
        
    }); 
}

const updatePassword = async (req, res) => {
    resetPass = new Object();
    
    new formidable.IncomingForm().parse(req)
    .on('field', (field, value) => {
        if(field == 'email'){
            resetPass.email = value;
        }

        if(field == 'password'){
            resetPass.password = value;
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
                Users.findOne({email: resetPass.email}, {}, function(err, userDoc){
                    if(err || userDoc == null){
                        res.json({ status: 401, msg: "Email is not registered" });
                    } else {
                        // generate has and salt for authentication 
                        let {hash, salt} = utils.genPassword(resetPass.password);

                        // save user if hash and salt re generated
                        if(hash && salt){
                            userDoc.hash = hash;
                            userDoc.salt = salt;
                            userDoc.save((err, uUser) => {
                                if(err){
                                    res.status(501).json({msg: 'Password not reset' });
                                } else {
                                    res.json({ status: 200, data: 'Your password has been updated successfully'});
                                }
                            });
                        } else {
                            res.status(501).json({msg: 'Internal server error.' });
                        }  
                    }
                });                               
            });
        } catch (inException) {// Handle any unexpected problems, ensuring the server doesn't go down.
            //console.log(`${inException}`);
        }
        
    }); 
}

const verifyOTP = async (req, res) => {
    otp = new Object();

    new formidable.IncomingForm().parse(req)
    .on('field', (field, value) => {
        if(field == 'userId'){
            otp.userId = value;
        }
        if(field == 'otp'){
            otp.otp = value;
        }
        if(field == 'type'){
            otp.type = value;
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
            //save otp against user
            connect.then(db => {
                // Does user have and existing OTP
                Verifiers.findOne({userId: otp.userId, otp: otp.otp}, {}, async function(err, otpDoc){
                    if(otpDoc && otpDoc.userId){
                        
                        if(otp.type == 'email'){
                            res.json({ status: 200, msg: 'User email verified.'});
                        } else if(otp.type == 'phone') {
                            res.json({ status: 200, msg: 'User phone verified.'});
                        }                        
                    } else {
                        // wrong OTP
                        res.json({ status: 401, msg: "Invalid OTP" });
                    }
                });
                               
            });
        } catch (inException) {// Handle any unexpected problems, ensuring the server doesn't go down.
            //console.log(`${inException}`);
        }
        
    }); 
}

/* Local Functions */
// Function to generate OTP
let generateOTP = () => {          
    // Declare a digits variable 
    // which stores all digits
    var digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < 6; i++ ) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
}

let saveUser = (user, hash, salt, res) => {
    try{
        //save User to the database
        connect.then(db => {
            let newUser;
            newUser = new Users({
                email: user.email,
                hash,
                salt,
                firstname: user.firstname,
                user_type: user.user_type,
                lastname: user.lastname,
                username: user.username,
                othername: user.othername,
                phone: user.phone,
                gender: user.gender,
                dob: user.dob,
            });
            
            newUser.save(function(err, userDoc){
                if(err){
                    res.status(501).json({ success: false, msg: `User not registered: ${err.message}`});
                } else {                
                    const jwt = utils.issueJWT(user)
                    userDoc.hash = null;
                    userDoc.salt = null;
                    res.status(200).json({ success: true, user: userDoc, token: jwt.token, expiresIn: jwt.expires });
                    
                    //Send email OTP
                    sendOTP(userDoc._id, 'email');

                    // if user doesnt get OTP, resend on request
                }
            }); 
                        
        });                    
    } catch (inException) {// Handle any unexpected problems, ensuring the server doesn't go down.
        // console.log(`${inException}`);
        res.status(501).json({msg: 'Internal server error....' });
    }
}

const sendOTP = (userId, type, path = null) => {
    let pin = generateOTP();

    Verifiers.findOne({userId: userId}, {}, function(err, otpDoc){
        let newVerifier; 

        if(otpDoc && otpDoc.userId){
            otpDoc.otp = pin;
            newVerifier = otpDoc;
        } else {                        
            newVerifier = new Verifiers({
                otp: pin,
                userId: userId
            });
        }

        newVerifier.save(function(err, verifier){
            if(err){
                // res.json({ status: 401, msg: "Failed verification" });
                return "Failed verification";
            } else{                                
                Users.findOne({_id: userId}, {}, async (err, userDoc) => {
                    if(err){
                        // res.json({ status: 401, msg: "User not found" });
                        return "User not found";
                    } else {
                        let resMsg = {
                            code: 500,
                            status: ''
                        }
                        if(type == 'email'){
                            let userEmail = userDoc.email;
                            let subject = '';
                            
                            if(path == 'resetPass'){
                                subject = 'MFB: OTP for Password Reset.';
                            } else {
                                subject = "MFB: OTP for Email Verification.";
                            }
                            //Send email
                            let info = await transporter.sendMail({
                                from: '"CEO, MFB" <ceo@example.com>', // sender address
                                to: userEmail, // list of receivers
                                subject, // Subject line
                                html: `<p>Please verify your email with this PIN: ${pin}`, // html body
                            });
                        
                            if(info.messageId){
                                resMsg.code = 200;
                                resMsg.status = 'OTP sent to email.'
                                
                            } else {
                                resMsg.status = 'OTP not sent to email.'
                            }
                            return resMsg;
                            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
                        } else if(type == 'phone') {
                            // UPDATE USER phone
                            let userData = {
                                phone: userDoc.phone
                            }
                            // axios
                            // .patch(`${process.env.CLIENT_URL}api/v1/users/update/${otp.userId}`, userData)
                            // .then(resp => {
                            //     if(resp.data.status == 201){
                            //         // let userPhone = otp.phone;

                            //         //TODO: send OTP to userPhone. get an SMS gateway API

                            //         // res.json({ status: 200, msg: 'OTP sent to phone'});
                            //         return 200;
                            //     } else {
                            //         res.json({ status: 401, msg: 'Error!'});
                            //     }
                            // })
                            // .catch(err => {
                            //     console.log(err);
                            // });
                        }
                    }
                });
                 
            }
        }); 
    });
}

// Export Modules
module.exports = {
    // testCntrlServ,
    register,
    resendOTP,
    login,
    updateUserVerifyEmailPhone,
    resetPasswordEmail,
    verifyOTP,
    updatePassword
}