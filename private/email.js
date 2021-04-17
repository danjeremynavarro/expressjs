const nodemailer = require("nodemailer");

class MissingArgs extends Error{
    constructor(message){
        super(message);
        super.name = "Not Enough Arguments";
    }
}

class SendEmailError extends Error{
    constructor(message){
        super(message);
        super.name = "Unknown Send Email Error";
    }
}

class EmailUtils{
    // args {object} - email settings
    constructor(settings){
        this.emailSettings = settings;
        this.transporter = nodemailer.createTransport(this.getSettings());
    }
    getSettings(){
        return {
            "service": "gmail",
            "host": "smtp.gmail.com",
            "auth": {
                "user": this.emailSettings.email,
                "pass": this.emailSettings.password
            }
        }; 
    }
    sendEmail(from, to, subject, content){
        // from {string} - from field of email default primary in email settings
        //to {string or array} - email to send to
        // return info - success message
        if(arguments.length < 4){
            throw new MissingArgs("Missing required params (from, to, subject, content)");
        }
        if (Array.isArray(to)){
            to = this.buildToField(to);
        }
        let message = `${content}
        message from: ${from}`
        let mailOptions = {
            "from": "danjeremynavarro@gmail.com",
            "to": to,
            "subject": subject,
            "text": message
        };

        this.transporter.sendMail(mailOptions, function(error, info){
            if (error) throw error;
            return info;
        });
    }
    buildToField(email){
        let toField = [];
        email.forEach((d) => {
            if(this.isEmail(d)){
                toField.push(d);
            }
        });
        return toField.join(",");
    }
    isEmail(email){
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!re.exec(email)){
            return false;
        } else{
            return true;                
        }
    }
}

module.exports = EmailUtils;