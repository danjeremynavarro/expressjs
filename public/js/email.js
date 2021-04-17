
dannavarro.email = {
    submit_control: function(){
        var email_address = document.getElementById("email-address").value;
        if(this.is_valid_email(email_address)){
            //Add Ajax Post Call
            this.send_email();
        } else if (!this.is_valid_email(email_address)){
            alert("Invalid Email");
        }
    },
    is_valid_email: function(email_address){
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!re.exec(email_address)){
            var email_child = document.getElementById(emailHelp);
            return false;
        } else {
            return true;
        }        
    },
    send_email: function(form_id){
        var user_email = $("#email-form").find("#email-address").val();
        var user_message = $("#email-form").find("#email-message").val(); 
        $.ajax({"url": "/api/sendEmail",
                "type": "POST",
                "datatype": "json",
                "data": {
                    "from": user_email,
                    "subject": "New Email from Site",
                    "message": user_message
                },
                "success": function(){
                    alert("Email Send Success");
                    $("#"+form_id).trigger("reset");
                }
        });
    }
};