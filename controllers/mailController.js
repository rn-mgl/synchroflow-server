import sgMail from "@sendgrid/mail";
import { BadRequestError } from "../errors/index.js";
import nodemailer from "nodemailer";

const url = process.env.URL;

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  tls: {
    ciphers: "SSLv3",
  },
  requireTLS: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendVerificationMail = async (name, email, token) => {
  const message = {
    to: email,
    from: "SynchroFlow <no-reply@rltn.space>",
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

  const data = await transporter.sendMail(message);

  if (!data) {
    throw new BadRequestError("Error in sending verification code.");
  }

  return data;
};

export const sendPasswordResetMail = async (name, email, token) => {
  const message = {
    to: email,
    from: "SynchroFlow <no-reply@rltn.space>",
    subject: "Password Reset",
    html: `<h1> Hello ${name}</h1>

            <br /><br />

            You requested for a password reset for your account on SynchroFlow, 

            <br /><br />

            before being able to use your account you need to verify that this is your email 
            address by clicking here:

            <br /><br />

            <a href="${url}/reset/${token}">
            <h4>Reset SynchroFlow Password</h4>
            </a> 

            <br /><br />

            This link will expire in <b>24 hours.</b> If you did not requested for a password reset,
            you can safely ignore this email.

            <br /><br />

            Kind Regards,

            <br /><br />

            SynchroFlow | Developers.`,
  };

  const data = await transporter.sendMail(message);

  if (!data) {
    throw new BadRequestError("Error in sending password reset mail.");
  }

  return data;
};
