import nodemailer from 'nodemailer';
import type { Applicant } from '@shared/schema';

interface EmailOptions {
  to: string;
  subject: string;
  type: 'enrollment_confirmation';
  data: {
    applicant: Applicant;
    pdfBuffer: Buffer;
    applicationId: string;
  };
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER || 'busvision3@gmail.com',
    pass: process.env.SMTP_PASS || process.env.EMAIL_PASSWORD || 'your_app_password'
  }
});

export async function sendEmail(options: EmailOptions): Promise<void> {
  const { to, subject, type, data } = options;

  if (type === 'enrollment_confirmation') {
    const { applicant, pdfBuffer, applicationId } = data;

    const htmlContent = `
      <!DOCTYPE html>
      <html dir="${applicant.locale === 'ar' ? 'rtl' : 'ltr'}" lang="${applicant.locale}">
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; }
          .header { background: linear-gradient(135deg, #0F4C81 0%, #35A7FF 100%); color: white; padding: 30px; text-align: center; }
          .content { padding: 30px; }
          .logo { width: 60px; height: 60px; background: #FFC93C; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px; }
          .btn { display: inline-block; background: #FFC93C; color: #0F4C81; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; margin: 20px 0; }
          .info-grid { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .info-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #eee; }
          .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">💡</div>
            <h1>InnoVision School</h1>
            <p>Confirmation d'inscription</p>
          </div>
          
          <div class="content">
            <h2>Félicitations ${applicant.fullName} !</h2>
            <p>Votre inscription à InnoVision School a été confirmée avec succès.</p>
            
            <div class="info-grid">
              <div class="info-row">
                <strong>ID de candidature:</strong>
                <span>${applicationId}</span>
              </div>
              <div class="info-row">
                <strong>Formation:</strong>
                <span>${applicant.course}</span>
              </div>
              <div class="info-row">
                <strong>Date d'inscription:</strong>
                <span>${applicant.createdAt.toLocaleDateString('fr-FR')}</span>
              </div>
            </div>
            
            <p>Vous trouverez en pièce jointe votre fiche d'inscription officielle au format PDF.</p>
            
            <p><strong>Prochaines étapes :</strong></p>
            <ul>
              <li>Conservez votre ID de candidature: <strong>${applicationId}</strong></li>
              <li>Nous vous contacterons dans les prochains jours pour finaliser votre inscription</li>
              <li>Préparez les documents requis pour la formation</li>
            </ul>
            
            <a href="https://wa.me/213797616944" class="btn">Contactez-nous sur WhatsApp</a>
          </div>
          
          <div class="footer">
            <p><strong>InnoVision School</strong><br>
            Blida, Rue Mohamed Ouali, Blida<br>
            Tél: 0797 61 69 44 | Email: busvision3@gmail.com</p>
            
            <p>Suivez-nous sur nos réseaux sociaux pour rester informé !</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: `"InnoVision School" <${process.env.SMTP_USER || 'busvision3@gmail.com'}>`,
      to: applicant.email,
      bcc: process.env.ADMIN_EMAIL || 'busvision3@gmail.com',
      subject,
      html: htmlContent,
      attachments: [
        {
          filename: `inscription-${applicationId}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf'
        }
      ]
    };

    await transporter.sendMail(mailOptions);
  }
}
