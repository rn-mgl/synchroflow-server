import sgMail from "@sendgrid/mail";
import { BadRequestError } from "../errors/index.js";

const local = "http://192.168.1.121:9000";
const prod = "https://synchroflow-server.onrender.com";

const url = prod;

export const sendVerificationMail = async (name, email, token) => {
  const message = {
    to: email,
    from: "SynchroFlow <rltnslns@gmail.com>",
    subject: "Account Verification",
    html: `<h1> Hello ${name}</h1>

            <br /><br />

            You <b>registered an account</b> on SynchroFlow, 

            <br /><br />

            before being able to use your account you need to verify that this is your email 
            address by clicking here:

            <br /><br />

            <a href="${url}/verify/${token}">
            <h4>Verify SynchroFlow Account</h4>
            </a> 

            <br /><br />

            This link will expire in <b>24 hours.</b> If you did not sign up for a SynchroFlow account,
            you can safely ignore this email.

            <br /><br />

            Kind Regards,

            <br /><br />

            SynchroFlow | Developers.`,
  };

  const data = await sgMail.send(message);

  if (!data) {
    throw new BadRequestError("Error in sending verification code.");
  }

  return data;
};
