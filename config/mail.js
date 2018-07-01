var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: 'gullapudikanakaraju@gmail.com',
		pass: '8790686045'
	},
	tls: {
		rejectUnauthorized: false
	}
});

module.exports = transporter;