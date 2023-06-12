const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstname: {
		type: String,
		required: true, 
	},
	lastname: {
		type: String,
		required: true, 
	},
	othername: {
		type: String
	},
	hash: {
		type: String,
		required: true, 
	},
	salt: {
		type: String,
		required: true, 
	},
	email: {
		type: String,
		required: true, 
		unique: true
	},
	phone: {
		type: String,
		// required: true
	},
	gender: {
		type: String,
        enum: ['M', 'F', 'O'],
		// required: true
	},
	phoneVerified: {
		type: String,
        enum: ['Y', 'N'],
		default : 'N'
	},
	emailVerified: {
		type: String,
        enum: ['Y', 'N'],
		default : 'N'
	},
	username: {
		type: String,
		// required: true,
      	unique: true
	},
	dob: {
		type: Date,
		// required: true
	},
	user_type: {
		type: String,
		enum: ["user", "admin", "superadmin"],
		required: true,
	},
	  
  	dateCreated: {
		type: Date,
    	default: Date.now
	},
    dateDeleted: {
        type: Date
    }
});

let User = mongoose.model("User", userSchema);

module.exports = User;
