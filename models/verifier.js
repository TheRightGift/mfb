const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const verifierSchema = new Schema({
    userId: {
		type: String,
		required: true
	},
	otp: {
		type: String,
		required: true
	},
  	dateCreated: {
		type: Date,
    	default: Date.now
	},
    dateDeleted: {
        type: Date
    }
});

let Verifier = mongoose.model("Verifier", verifierSchema);

module.exports = Verifier;
