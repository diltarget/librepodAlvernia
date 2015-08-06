var nodemailer = require('nodemailer');

var transporter;

exports.auth = function(o,callback){
	if(o == undefined || o.user == undefined || o.pass == undefined) return;
	
	transporter = nodemailer.createTransport({
		service: 'Gmail',
		auth: {
			user: o.user,
			pass: o.pass
		}
	});
}

exports.send = function(o,callback){
	if(o == undefined || o.to == undefined || o.subject == undefined || o.text == undefined) return;

	var mail = {
		from :"lab bot",
		to: o.to,
		subject: o.subject,
		text: o.text
	};

	transporter.sendMail(mail,function(err,data){
		if(err){
			callback("error did not send");
		}else{
			callback("message success");
		}
	});
}
