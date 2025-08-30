import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertApplicantSchema, insertUserSchema } from "@shared/schema";
import { z } from "zod";
import bcrypt from "bcrypt";
import { generatePDF } from "./services/pdf";
import { sendEmail } from "./services/email";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Enrollment endpoint
  app.post("/api/enrollment", async (req, res) => {
    try {
      const validatedData = insertApplicantSchema.parse(req.body);
      
      // Calculate age
      const birthDate = new Date(validatedData.birthDate);
      const today = new Date();
      const age = Math.floor((today.getTime() - birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
      
      if (age < 8) {
        return res.status(400).json({ message: "Âge minimum 8 ans" });
      }

      // Generate unique application ID
      const applicationId = `INV-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      // Create applicant
      const applicant = await storage.createApplicant({
        ...validatedData,
        age,
        applicationId,
      });

      // Generate PDF
      const pdfBuffer = await generatePDF(applicant);
      const pdfUrl = `/api/pdf/${applicationId}`;

      // Update applicant with PDF URL
      await storage.updateApplicant(applicant.id, { pdfUrl });

      // Send email to applicant and admin
      try {
        await sendEmail({
          to: applicant.email,
          subject: "Confirmation d'inscription - InnoVision School",
          type: "enrollment_confirmation",
          data: { applicant, pdfBuffer, applicationId }
        });

        await storage.updateApplicant(applicant.id, { emailSent: true });
      } catch (emailError) {
        console.error("Failed to send email:", emailError);
        // Don't fail the enrollment if email fails
      }

      res.json({
        success: true,
        applicationId,
        pdfUrl,
        message: "Inscription réussie ! Vous recevrez un email de confirmation."
      });

    } catch (error) {
      console.error("Enrollment error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Données invalides",
          errors: error.errors
        });
      }
      res.status(500).json({ message: "Erreur interne du serveur" });
    }
  });

  // PDF download endpoint
  app.get("/api/pdf/:applicationId", async (req, res) => {
    try {
      const { applicationId } = req.params;
      const applicant = await storage.getApplicantByApplicationId(applicationId);
      
      if (!applicant) {
        return res.status(404).json({ message: "Application non trouvée" });
      }

      const pdfBuffer = await generatePDF(applicant);
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="inscription-${applicationId}.pdf"`);
      res.send(pdfBuffer);

    } catch (error) {
      console.error("PDF generation error:", error);
      res.status(500).json({ message: "Erreur de génération PDF" });
    }
  });

  // Admin login
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { email, password } = loginSchema.parse(req.body);
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Identifiants invalides" });
      }

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return res.status(401).json({ message: "Identifiants invalides" });
      }

      // Set session
      (req.session as any).userId = user.id;
      
      res.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          role: user.role
        }
      });

    } catch (error) {
      console.error("Login error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Données invalides",
          errors: error.errors
        });
      }
      res.status(500).json({ message: "Erreur interne du serveur" });
    }
  });

  // Admin logout
  app.post("/api/admin/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Erreur de déconnexion" });
      }
      res.json({ success: true });
    });
  });

  // Get current admin user
  app.get("/api/admin/me", async (req, res) => {
    try {
      const userId = (req.session as any)?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Non authentifié" });
      }

      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(401).json({ message: "Utilisateur non trouvé" });
      }

      res.json({
        id: user.id,
        email: user.email,
        role: user.role
      });

    } catch (error) {
      console.error("Auth check error:", error);
      res.status(500).json({ message: "Erreur interne du serveur" });
    }
  });

  // Get applicants (admin only)
  app.get("/api/admin/applicants", async (req, res) => {
    try {
      const userId = (req.session as any)?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Non authentifié" });
      }

      const {
        search,
        wilaya,
        course,
        ageGroup,
        dateFrom,
        dateTo,
        limit = "20",
        offset = "0",
        sortBy = "createdAt",
        sortOrder = "desc"
      } = req.query;

      const result = await storage.getApplicants({
        search: search as string,
        wilaya: wilaya as string,
        course: course as string,
        ageGroup: ageGroup as 'kids' | 'adults',
        dateFrom: dateFrom as string,
        dateTo: dateTo as string,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
        sortBy: sortBy as 'createdAt' | 'fullName' | 'age',
        sortOrder: sortOrder as 'asc' | 'desc'
      });

      res.json(result);

    } catch (error) {
      console.error("Get applicants error:", error);
      res.status(500).json({ message: "Erreur interne du serveur" });
    }
  });

  // Get admin stats
  app.get("/api/admin/stats", async (req, res) => {
    try {
      const userId = (req.session as any)?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Non authentifié" });
      }

      const stats = await storage.getApplicantStats();
      res.json(stats);

    } catch (error) {
      console.error("Get stats error:", error);
      res.status(500).json({ message: "Erreur interne du serveur" });
    }
  });

  // Resend email for applicant
  app.post("/api/admin/applicants/:id/resend-email", async (req, res) => {
    try {
      const userId = (req.session as any)?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Non authentifié" });
      }

      const { id } = req.params;
      const applicant = await storage.getApplicant(id);
      
      if (!applicant) {
        return res.status(404).json({ message: "Candidat non trouvé" });
      }

      const pdfBuffer = await generatePDF(applicant);
      
      await sendEmail({
        to: applicant.email,
        subject: "Confirmation d'inscription - InnoVision School",
        type: "enrollment_confirmation",
        data: { applicant, pdfBuffer, applicationId: applicant.applicationId }
      });

      res.json({ success: true, message: "Email renvoyé avec succès" });

    } catch (error) {
      console.error("Resend email error:", error);
      res.status(500).json({ message: "Erreur d'envoi d'email" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
