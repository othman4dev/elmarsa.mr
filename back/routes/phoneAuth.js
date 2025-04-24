import twilio from 'twilio';

const accountSid = 'your_account_sid'; // Replace with your Twilio Account SID
const authToken = 'your_auth_token'; // Replace with your Twilio Auth Token
const client = new twilio(accountSid, authToken);

// Function to send SMS
export const sendSMS = async (phoneNumber) => {
  try {
    const message = await client.messages.create({
      body: 'Your verification code is: 123456', // Replace with a dynamic code if necessary
      from: '+your_twilio_number', // Replace with your Twilio phone number
      to: phoneNumber,
    });

    return { success: true, message: message.sid };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
