import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';
import type { Applicant } from '@shared/schema';

export async function generatePDF(applicant: Applicant): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50, size: 'A4' });
      const chunks: Buffer[] = [];

      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Header with logo and school info
      doc.fontSize(24)
         .fillColor('#0F4C81')
         .text('InnoVision School', 50, 50);

      doc.fontSize(12)
         .fillColor('#666')
         .text('École de Technologies', 50, 80)
         .text('Blida, Rue Mohamed Ouali, Blida', 50, 95)
         .text('Tél: 0797 61 69 44 | Email: busvision3@gmail.com', 50, 110);

      // Title
      doc.fontSize(20)
         .fillColor('#0F4C81')
         .text('Fiche d\'Inscription', 50, 150, { align: 'center' });

      // Application ID prominently displayed
      doc.fontSize(14)
         .fillColor('#FFC93C')
         .text(`ID de candidature: ${applicant.applicationId}`, 50, 180, { align: 'center' });

      // Applicant Information
      const yStart = 220;
      let currentY = yStart;

      const addField = (label: string, value: string, y: number) => {
        doc.fontSize(12)
           .fillColor('#333')
           .text(label, 50, y)
           .fillColor('#666')
           .text(value, 200, y);
        return y + 25;
      };

      currentY = addField('Nom & Prénom:', applicant.fullName, currentY);
      currentY = addField('Email:', applicant.email, currentY);
      currentY = addField('Date de naissance:', new Date(applicant.birthDate).toLocaleDateString('fr-FR'), currentY);
      currentY = addField('Âge:', `${applicant.age} ans`, currentY);
      currentY = addField('Wilaya:', applicant.wilaya, currentY);
      currentY = addField('Téléphone:', applicant.phone, currentY);
      currentY = addField('Formation choisie:', applicant.course, currentY);
      currentY = addField('Date d\'inscription:', applicant.createdAt.toLocaleDateString('fr-FR'), currentY);
      currentY = addField('Langue:', applicant.locale.toUpperCase(), currentY);

      // QR Code with application ID
      QRCode.toDataURL(applicant.applicationId, { width: 120 }, (err, url) => {
        if (!err && url) {
          const qrImage = Buffer.from(url.split(',')[1], 'base64');
          doc.image(qrImage, 450, yStart, { width: 100 });
          doc.fontSize(10)
             .fillColor('#666')
             .text('QR Code ID', 465, yStart + 110);
        }

        // Footer
        doc.fontSize(10)
           .fillColor('#666')
           .text('Ce document confirme votre inscription à InnoVision School.', 50, doc.page.height - 120, { align: 'center' })
           .text('Conservez cette fiche pour vos dossiers.', 50, doc.page.height - 105, { align: 'center' });

        // Social links
        doc.text('Suivez-nous:', 50, doc.page.height - 80)
           .text('Facebook: InnoVision School | Instagram: @inno.vision09 | TikTok: @innovision01', 50, doc.page.height - 65);

        doc.end();
      });

    } catch (error) {
      reject(error);
    }
  });
}
