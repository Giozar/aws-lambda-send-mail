import nodemailer from 'nodemailer';

const contactMail = async (data) => {
  // CPANEL
  const transporter = await nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  let index = 0;
  let mailSubject = '';
  let mailBody = '';
  
  for (const key in data) {
    if (Object.hasOwnProperty.call(data, key)) {
      
      const element = data[key];

      if (index <= 0) {
        mailSubject = element;
        index++;
      }
      
      mailBody += (`<h2> ${key} : ${element} </h2> <br>`);
    
    }
  }

  const mailOption = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: mailSubject,
    html: mailBody,
  };

  try {
    await transporter.sendMail(mailOption);
    return Promise.resolve("Message Sent Successfully!");
  } catch (error) {
    return Promise.reject(error);
  }
};

export const handler = async event => {
  // Log the event argument for debugging and for use in local development.
  // console.log(JSON.stringify(event, undefined, 2));

  const data = JSON.parse(event.body);

  try {

    await contactMail(data);

    const response = {
      statusCode: 200,
      headers: {
          "Access-Control-Allow-Headers" : "Content-Type",
          "Access-Control-Allow-Origin": ["https://www.mydomain.com", "http://127.0.0.1:8000"], // Ingresamos lás dominios permitidos al recurso
          "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
      },
      body: JSON.stringify({
        success: true, message: 'Message Sent Successfully!',
      }),
    }

    return response;

  } catch (error) {
    console.log(error)
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false, message: 'Message Could not be Sent',
      }),
    };
  }
}
