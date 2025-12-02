import sgMail from "@sendgrid/mail";
import { BadRequestError } from "../errors/index.js";
import nodemailer from "nodemailer";
import axios from "axios";

const url = process.env.URL;

export const sendVerificationMail = async (name, email, token) => {
  const message = {
    to: email,
    from: "SynchroFlow <no-reply@rltn.space>",
    subject: "Account Verification",
    source: process.env.EMAIL_SOURCE,
    html: `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Verify Your SynchroFlow Account</title>
            </head>
            <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7fa;">
                <table role="presentation" style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 40px 20px;">
                            <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                                <!-- Header -->
                                <tr>
                                    <td style="padding: 40px 40px 30px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px 8px 0 0;">
                                        <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600; letter-spacing: -0.5px;">SynchroFlow</h1>
                                    </td>
                                </tr>
                                
                                <!-- Content -->
                                <tr>
                                    <td style="padding: 40px;">
                                        <h2 style="margin: 0 0 20px; color: #1a1a1a; font-size: 24px; font-weight: 600;">Hello ${name},</h2>
                                        
                                        <p style="margin: 0 0 20px; color: #4a5568; font-size: 16px; line-height: 1.6;">
                                            Thank you for registering an account with SynchroFlow. We're excited to have you on board!
                                        </p>
                                        
                                        <p style="margin: 0 0 30px; color: #4a5568; font-size: 16px; line-height: 1.6;">
                                            To complete your registration and start using your account, please verify your email address by clicking the button below:
                                        </p>
                                        
                                        <!-- CTA Button -->
                                        <table role="presentation" style="margin: 0 auto;">
                                            <tr>
                                                <td style="text-align: center;">
                                                    <a href="${url}/verify/${token}" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 6px rgba(102, 126, 234, 0.25);">
                                                        Verify Your Account
                                                    </a>
                                                </td>
                                            </tr>
                                        </table>
                                        
                                        <p style="margin: 30px 0 20px; color: #718096; font-size: 14px; line-height: 1.6;">
                                            Or copy and paste this link into your browser:
                                        </p>
                                        
                                        <p style="margin: 0 0 30px; padding: 12px; background-color: #f7fafc; border-left: 4px solid #667eea; color: #4a5568; font-size: 13px; word-break: break-all; border-radius: 4px;">
                                            ${url}/verify/${token}
                                        </p>
                                        
                                        <!-- Warning Box -->
                                        <div style="margin: 30px 0; padding: 16px; background-color: #fff5f5; border-left: 4px solid #f56565; border-radius: 4px;">
                                            <p style="margin: 0; color: #742a2a; font-size: 14px; line-height: 1.5;">
                                                <strong>⏱️ Important:</strong> This verification link will expire in <strong>24 hours</strong>.
                                            </p>
                                        </div>
                                        
                                        <p style="margin: 0 0 10px; color: #718096; font-size: 14px; line-height: 1.6;">
                                            If you did not create a SynchroFlow account, please disregard this email. No further action is required.
                                        </p>
                                    </td>
                                </tr>
                                
                                <!-- Footer -->
                                <tr>
                                    <td style="padding: 30px 40px; background-color: #f7fafc; border-radius: 0 0 8px 8px; border-top: 1px solid #e2e8f0;">
                                        <p style="margin: 0 0 5px; color: #4a5568; font-size: 14px;">
                                            Best regards,
                                        </p>
                                        <p style="margin: 0; color: #667eea; font-size: 14px; font-weight: 600;">
                                            The SynchroFlow Team
                                        </p>
                                        <p style="margin: 15px 0 0; color: #a0aec0; font-size: 12px;">
                                            © ${new Date().getFullYear()} SynchroFlow. All rights reserved.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Bottom Disclaimer -->
                            <table role="presentation" style="max-width: 600px; margin: 20px auto 0;">
                                <tr>
                                    <td style="text-align: center; padding: 0 20px;">
                                        <p style="margin: 0; color: #a0aec0; font-size: 12px; line-height: 1.5;">
                                            This email was sent to you as part of your SynchroFlow account registration.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
            </html>`,
  };

  const data = await axios.post(`${process.env.EMAIL_CONNECTOR}`, message);

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
    source: process.env.EMAIL_SOURCE,
    html: `<h1>Hello ${name}</h1>

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

  const data = await axios.post(`${process.env.EMAIL_CONNECTOR}`, message);

  if (!data) {
    throw new BadRequestError("Error in sending password reset mail.");
  }

  return data;
};
