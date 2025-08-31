import { useI18n } from "@/hooks/use-i18n";
import { Logo } from "@/components/ui/logo";
import { MapPin, Phone, Mail } from "lucide-react";
import { FaFacebook, FaInstagram, FaTiktok, FaWhatsapp } from "react-icons/fa";

export function Footer() {
  const { t } = useI18n();

  return (
    <footer id="contact" className="py-20 gradient-bg relative" data-testid="footer">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* School Info */}
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start space-x-3 mb-6">
              <Logo size="md" />
              <span className="text-2xl font-bold text-white">InnoVision School</span>
            </div>
            <p className="text-white/80 leading-relaxed mb-6" data-testid="footer-description">
              {t('footer.description')}
            </p>
            <div className="text-white/70">
              <p className="mb-2 flex items-center justify-center lg:justify-start">
                <MapPin className="mr-2 text-accent w-4 h-4" />
                {t('hero.address')}
              </p>
            </div>
          </div>
          
          {/* Contact Info */}
          <div className="text-center">
            <h3 className="text-xl font-bold text-white mb-6" data-testid="contact-title">
              {t('footer.contact')}
            </h3>
            <div className="space-y-4 text-white/80">
              <div className="flex items-center justify-center">
                <Phone className="mr-3 text-accent w-4 h-4" />
                <a 
                  href="tel:+213797616944" 
                  className="hover:text-accent transition-colors"
                  data-testid="contact-phone"
                >
                  0797 61 69 44
                </a>
              </div>
              <div className="flex items-center justify-center">
                <Mail className="mr-3 text-accent w-4 h-4" />
                <a 
                  href="mailto:busvision3@gmail.com" 
                  className="hover:text-accent transition-colors"
                  data-testid="contact-email"
                >
                  busvision3@gmail.com
                </a>
              </div>
              <div className="flex items-center justify-center">
                <FaWhatsapp className="mr-3 text-accent w-4 h-4" />
                <a 
                  href="https://wa.me/213797616944" 
                  className="hover:text-accent transition-colors"
                  data-testid="contact-whatsapp"
                >
                  {t('footer.whatsapp')}
                </a>
              </div>
            </div>
          </div>
          
          {/* Social Links */}
          <div className="text-center lg:text-right">
            <h3 className="text-xl font-bold text-white mb-6" data-testid="social-title">
              {t('footer.social')}
            </h3>
            <div className="flex justify-center lg:justify-end space-x-4">
              <a 
                href="https://www.facebook.com/profile.php?id=61551887724810"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 glass rounded-full flex items-center justify-center hover:scale-110 transition-all hover:bg-accent"
                data-testid="social-facebook"
              >
                <FaFacebook className="text-white text-xl" />
              </a>
              <a 
                href="https://www.instagram.com/inno.vision09/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 glass rounded-full flex items-center justify-center hover:scale-110 transition-all hover:bg-accent"
                data-testid="social-instagram"
              >
                <FaInstagram className="text-white text-xl" />
              </a>
              <a 
                href="https://www.tiktok.com/@innovision01"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 glass rounded-full flex items-center justify-center hover:scale-110 transition-all hover:bg-accent"
                data-testid="social-tiktok"
              >
                <FaTiktok className="text-white text-xl" />
              </a>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-white/20 mt-12 pt-8 text-center">
          <p className="text-white/70" data-testid="footer-copyright">
            {t('footer.copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
}
