import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendInviteEmail(email: string, inviteLink: string) {
  await transporter.sendMail({
    to: email,
    subject: "You were invited to Paradise AI",
    html: `
      <h2>Workspace Invitation</h2>
      <p>Click below to join:</p>
      <a href="${inviteLink}">${inviteLink}</a>
    `,
  });
}
