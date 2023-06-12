// USE STRICT;
const express = require('express');
const app = express();
const session = require('express-session');
const fs = require('fs');
// var privateKey  = fs.readFileSync('SSL/nuKey.key', 'utf8');
// var certificate = fs.readFileSync('SSL/api_hifast_io.crt', 'utf8');
// let ca = fs.readFileSync('SSL/api_hifast_io.ca-bundle', 'utf8');
// var credentials = {key: privateKey, cert: certificate};

// require the socket.io module
const socket = require("socket.io");

// const https = require('https').Server(credentials, app);
const http = require('http').Server(app);

//integrating socketio
// io = socket(https);
io = socket(http);

const port = 8000;
app.use(express.static(__dirname+"/public"));
const axios = require('axios');
const NodeCache = require( "node-cache" );
const goFastCache = new NodeCache();
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const mustacheExpress = require('mustache-express');
app.engine('html', mustacheExpress());
app.set('view engine', 'html');
app.set('views', __dirname+'/views');
const secret = 'p9euMo9ou1traMicro6copic6i1icovo1ca9oco9io6i6';
const cors = require('cors');
const path = require('path');
const passport = require('passport');
const helmet = require("helmet");
// Gives us access to variables set in the .env file via `process.env.VARIABLE_NAME` syntax
require('dotenv').config();
const connect = require('./config/db');
// const Assets = require('./models/assets');
// Must first load the models before passport
require('./models/user');
// Pass the global passport object into the configuration function
require('./config/passport')(passport);

// This will initialize the passport object on every request
app.use(passport.initialize());
// Allows our remote applications to make HTTP requests to Express application
app.use(cors());
// 
app.use(helmet());

app.use(express.urlencoded({extended: false}));
//app.use(express.json()); //WARNING: Do not turn on. stops formidable for api calls

app.use(cookieParser(secret));
app.use(session({
    secret: secret,
    resave: false,
    saveUninitialized: true,
    cookie: { 
        httpOnly: true,
        secure: true 
    }
}));
// app.use(csrf());
// Stop page caching
app.use(function(req, res, next){
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next();
});

// Imports all of the routes from ./routes/index.js
app.use(require('./routes/api/v1'));

// Socket Operations
// const Show = require('./models/show');
io.on("connection", socket => {
    let sessionId = socket.id;
    // console.log(sessionId)

    // socket.on('userJoinedShow', (data) => {
    //     // console.log(data.showId)    

    //     try{
    //         connect.then(db => {    
    //             // console.log(data.showId)    
    //             let date = new Date();        
    //             let showData = {
    //                 userId: data.userId,
    //                 dateCreated: date
    //             }
                
    //             // Show.findOneAndUpdate({_id: data.showId}, {"$push": {"audience": showData}}, {new: true}, (err, showDoc) => {
    //             //     console.log(`Show ${showDoc}`)
    //             // })      

    //             Show.findOne({ _id: data.showId }).
    //             then(showDoc => {
    //                 let aud = showDoc.audience;

    //                 if(aud.length > 0){
    //                     let found = aud.findIndex((ad) => {
    //                         return ad.userId.toString() === data.userId;
    //                     }); 

    //                     if(found === -1){
    //                         // create
    //                         let showData = {
    //                             userId: data.userId,
    //                             dateCreated: date
    //                         }
    //                         aud.push(showData);  
    //                     } 
    //                 } else {
    //                     // create
    //                     let showData = {
    //                         userId: data.userId,
    //                         dateCreated: date
    //                     }
    //                     aud.push(showData);
    //                 }
    //                 showDoc.save();
    //             })
    //         });
    //     } catch (inException) {// Handle any unexpected problems, ensuring the server doesn't go down.
    //         //console.log(`${inException}`);
    //         res.json({ status: 501, msg: "Error! Please inform tech." });
    //     }
    // });

    // socket.on('addPrivateComment', (data) => {

    //     try{
    //         connect.then(db => {    
                
    //             Show.findOne({ _id: data.showId }).
    //             then(showDoc => {
                    
    //                 let pComm = showDoc.privateComment;
    //                 let date = new Date(); 
                    
    //                 if(pComm.length > 0){   
                                           
    //                     let found = pComm.findIndex((comm) => {
    //                         return comm.audienceUserId.toString() === data.audienceUserId;
    //                     }); 

    //                     if(found == -1){
    //                         // create
    //                         let privateCommentData = {
    //                             audienceUserId: data.audienceUserId,
    //                             dateCreated: date,
    //                             message: [
    //                                 {
    //                                     from: data.messageFrom,
    //                                     to: data.messageTo,
    //                                     dateCreated: date,
    //                                     message: data.message
    //                                 }
    //                             ]
    //                         }
    //                         pComm.push(privateCommentData);                   
    //                     } else {                            
    //                         //update
    //                         let message = {
    //                             from: data.messageFrom,
    //                             to: data.messageTo,
    //                             dateCreated: date,
    //                             message: data.message
    //                         }
    //                         pComm[found].message.push(message);
    //                     }
    //                 } else {
    //                     // create
    //                     let privateCommentData = {
    //                         audienceUserId: data.audienceUserId,
    //                         dateCreated: date,
    //                         message: [
    //                             {
    //                                 from: data.messageFrom,
    //                                 to: data.messageTo,
    //                                 dateCreated: date,
    //                                 message: data.message
    //                             }
    //                         ]
    //                     }
    //                     pComm.push(privateCommentData);                        
    //                 }    
                    
    //                 showDoc.save();

    //                 io.emit("showPrivateCommentResponse", {show: showDoc});
    //             })
    //         });
    //     } catch (inException) {// Handle any unexpected problems, ensuring the server doesn't go down.
    //         //console.log(`${inException}`);
    //         // res.json({ status: 501, msg: "Error! Please inform tech." });
    //     }
    // });

    // socket.on('addLiveChat', (data) => {
    //     try{
    //         connect.then(db => {    
                
    //             Show.findOne({ _id: data.showId }).
    //             then(showDoc => {
                    
    //                 let lChat = showDoc.liveChat;
    //                 let date = new Date(); 

    //                 let liveChatData = {
    //                     userId: data.audienceId,
    //                     dateCreated: date,
    //                     message: data.message
    //                 }
    //                 lChat.push(liveChatData);
    //                 // if(lChat.length > 0){   
                                           
    //                 //     let found = lChat.findIndex((chat) => {
    //                 //         return chat.userId.toString() === data.audienceId;
    //                 //     }); 

    //                 //     if(found == -1){
    //                 //         // create
    //                 //         let liveChatData = {
    //                 //             userId: data.audienceId,
    //                 //             dateCreated: date,
    //                 //             message: data.message
    //                 //         }
    //                 //         pComm.push(privateCommentData);                   
    //                 //     } else {                            
    //                 //         //update
    //                 //         let message = {
    //                 //             from: data.messageFrom,
    //                 //             to: data.messageTo,
    //                 //             dateCreated: date,
    //                 //             message: data.message
    //                 //         }
    //                 //         pComm[found].message.push(message);
    //                 //     }
    //                 // } else {
    //                 //     // create
    //                 //     let privateCommentData = {
    //                 //         audienceUserId: data.audienceUserId,
    //                 //         dateCreated: date,
    //                 //         message: [
    //                 //             {
    //                 //                 from: data.messageFrom,
    //                 //                 to: data.messageTo,
    //                 //                 dateCreated: date,
    //                 //                 message: data.message
    //                 //             }
    //                 //         ]
    //                 //     }
    //                 //     pComm.push(privateCommentData);                        
    //                 // }    
                    
    //                 showDoc.save();

    //                 io.emit("showLiveChatResponse", {show: showDoc});
    //             })
    //         });
    //     } catch (inException) {// Handle any unexpected problems, ensuring the server doesn't go down.
    //         //console.log(`${inException}`);
    //         // res.json({ status: 501, msg: "Error! Please inform tech." });
    //     }
    // });
});


// Handle 404
app.use(function(req, res) {
    res.status(404);
    res.status(404).json({msg: '404: File Not Found.' });
});
   
// Handle 500
app.use(function(error, req, res, next) {
    res.status(500);
    res.render('500.html', {title:'500: Internal Server Error', error: error});
});
http.listen(port, () => {   
    console.log('Running on port: '+port);
})