const SibApiV3Sdk = require('sib-api-v3-sdk');

const emailWebHook = async ({ name, to, htmlContent, subject }) => {
    let defaultClient = SibApiV3Sdk.ApiClient.instance;
    let apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = process.env.EMAIL_API_KEY;
    
    let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    
    let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    
    sendSmtpEmail.subject = "{{params.subject}}";
    sendSmtpEmail.htmlContent = htmlContent;
    sendSmtpEmail.sender = { name:"Make sarees", email: process.env.SENDER_EMAIL };
    sendSmtpEmail.to = [{ email: to, name }];
    // sendSmtpEmail.cc = [{"email":"example2@example2.com","name":"Janice Doe"}];
    // sendSmtpEmail.headers = {"Some-Custom-Name":"unique-id-1234"};
    sendSmtpEmail.params = { subject };

    try {
        const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log('API called successfully. Returned data: ' + JSON.stringify(data));
    } catch(err) {
        console.log(error);
    } 
}

module.exports = {
    emailWebHook
}