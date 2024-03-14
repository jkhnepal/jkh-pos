import nodemailer from "nodemailer";
import { resetPasswordTemplate } from "../templates";

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "lokendrachaulagain803@gmail.com",
    pass: "hvcf tefh hfjd tgop",
  },
});

const createMailOptions = (email: string, subject: string, content: string) => {
  return {
    from: "Jacket House",
    to: email,
    subject: subject,
    html: content,
  };
};

export const sendResetPassword = async (email: string, password: string) => {
  const htmlContent = resetPasswordTemplate(password);
  const mailOptions = createMailOptions(email, "Password Changed", htmlContent);
  await transporter.sendMail(mailOptions);
};
