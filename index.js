require("dotenv").config();
const twilio = require("twilio");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

export default function verificationModule(userPhoneNumber) {
  verificationModule(userPhoneNumber);
  //creating verification service
  async function createVerifcation(phoneNumber) {
    try {
      await client.verify.services
        .create({ friendlyName: "Drop Shop Verification" })
        .then((service) => {
          return service.sid;
        })
        .then((json) => {
          startVerification(json, phoneNumber);
        });
    } catch (e) {
      return e.message;
    }
  }

  //starts the verification. in this case a phone call

  async function startVerification(json, phoneNumber) {
    try {
      await client.verify
        .services(json)
        .verifications.create({ to: phoneNumber, channel: "call" })
        .then((verification) => {
          console.log(verification.status);
          checkVerification(json, phoneNumber);
        });
    } catch (e) {
      return e.message;
    }
  }

  async function checkVerification(json, phoneNumber) {
    try {
      await client.verify
        .services("VAXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
        .verificationChecks.create({ to: "+15017122661", code: "123456" })
        .then((verification_check) => {
          return verification_check.status;
        });
    } catch (e) {
      return e.message;
    }
  }
}
