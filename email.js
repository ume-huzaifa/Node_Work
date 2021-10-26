const nodemailer = require("nodemailer");


function sendEmail(resetPass_link, receiver) {

    var transporter = nodemailer.createTransport({
        service: "namecheap",
        auth: {
            user : "info@ezmec.com",
            pass : "ezmec123" 
        }
    });

    var mailOption = {
        from : "info@ezmec.com",
        to: receiver,
        subject : `EZMEC Customer care : ${resetPass_link}`,
        text : `Here is your reset password link: ${resetPass_link}`
    };

    transporter.sendMail(mailOption, function(error, info){
        if (error){
            console.log(error);
        }
        else {
            console.log("Email sent: " + info.response);
        }
    });

}

module.exports = sendEmail;