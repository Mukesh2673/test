
export const get = async (token: any, email: any) => {
    try {
      var crypto = require('crypto');
      var base64url = require('base64url');
      console.log('asfdasdfsadf');
      console.log('body',email);
      var emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
      if(!email){
        return {
          responseCode: 401,
          responseMessage: "email required",
          
        }
        }
        var valid = emailRegex.test(email);
        if(!valid)
        {
        return {
          responseCode: 404,
          responseMessage: "invalid Email",
        }
      }
      else{
        var key= base64url(crypto.randomBytes(26));
        var nodemailer = require('nodemailer');
        const transporter:any = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'mukesh12344@gmail.com',
            pass: '123455'
          }
        });
        var mailOptions = {
          from: 'mukesh12344@gmail.com',
          to: email,
          subject: 'get your code',
          text: key
        };
        
        transporter.sendMail(mailOptions, function(error:any, info:any){
          if (error) {
            
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });
        return {
          responseCode: 400,
          responseMessage: `http://localhost:3000/api/v1/test?key=${key}`,
        }


      }
      }
  catch(err){
    console.log('err',err);
  }
}
   
export const registerPage=(data:any)=>{
  return '<html><body><center>Welcome to register page<center></body><html>'
}