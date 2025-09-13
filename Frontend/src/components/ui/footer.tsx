import { Link } from "react-router-dom";
import { Car, Phone, Mail, MessageCircle, MapPin, Clock, Facebook, Twitter, Instagram, Linkedin, Shield, Award, Users, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Logo } from "./logo";

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  const handleWhatsApp = () => {
    window.open('https://wa.me/33123456789', '_blank');
  };

  const handlePhone = () => {
    window.open('tel:+33123456789', '_self');
  };

  const handleEmail = () => {
    window.open('mailto:contact@occazcar.fr', '_self');
  };
  
  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-4">
            <Logo size="md" />
            <p className="text-sm text-muted-foreground max-w-md">
              La plateforme de confiance pour acheter et vendre des voitures d'occasion en toute sécurité. 
              Plus de 12 000 véhicules vendus avec satisfaction.
            </p>
            
            {/* Citation inspirante */}
            <blockquote className="mt-4 p-3 bg-primary/5 rounded-lg border-l-4 border-primary">
              <p className="text-sm italic text-muted-foreground">
                "Votre prochaine aventure commence par le bon véhicule. 
                Chez OccazCar, nous croyons que chaque voiture a une histoire à raconter."
              </p>
              <footer className="text-xs text-primary font-medium mt-2">
                — L'équipe OccazCar
              </footer>
            </blockquote>
            
            {/* Trust Badges */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="text-xs">
                <Shield className="h-3 w-3 mr-1" />
                Véhicules vérifiés
              </Badge>
              <Badge variant="secondary" className="text-xs">
                <Award className="h-3 w-3 mr-1" />
                15+ ans d'expérience
              </Badge>
              <Badge variant="secondary" className="text-xs">
                <Users className="h-3 w-3 mr-1" />
                8 923 clients
              </Badge>
            </div>

            {/* Social Media */}
            <div className="flex space-x-3">
              <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                <Linkedin className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Navigation */}
          <div className="space-y-4">
            <h3 className="font-semibold">Navigation</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/voitures" className="text-muted-foreground hover:text-primary transition-colors">
                  Nos véhicules
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-muted-foreground hover:text-primary transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/a-propos" className="text-muted-foreground hover:text-primary transition-colors">
                  À propos
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Services */}
          <div className="space-y-4">
            <h3 className="font-semibold">Services</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/services" className="text-muted-foreground hover:text-primary transition-colors">
                  Estimation gratuite
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-muted-foreground hover:text-primary transition-colors">
                Entretien & Réparation
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-muted-foreground hover:text-primary transition-colors">
                  Garantie véhicule
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-muted-foreground hover:text-primary transition-colors">
                  Reprise véhicule
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-muted-foreground hover:text-primary transition-colors">
                  Assistance 24/7
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact & Hours */}
          <div className="space-y-4">
            <h3 className="font-semibold">Contact</h3>
            <div className="space-y-3">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start"
                onClick={handleWhatsApp}
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                WhatsApp
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start"
                onClick={handlePhone}
              >
                <Phone className="h-4 w-4 mr-2" />
                +221 78 587 44 72 
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start"
                onClick={handleEmail}
              >
                <Mail className="h-4 w-4 mr-2" />
                occazcar340@gmail.com
              </Button>
            </div>

            {/* Opening Hours */}
            <div className="mt-6 space-y-2">
              <h4 className="font-medium text-sm">Horaires d'ouverture</h4>
              <div className="space-y-1 text-xs text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <Clock className="h-3 w-3" />
                  <span>Lun-Ven: 9h-19h</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-3 w-3" />
                  <span>Sam: 9h-17h</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-3 w-3" />
                  <span>Dim: Fermé</span>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="mt-4 space-y-1">
              <div className="flex items-start space-x-2 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3 mt-0.5" />
                <span>Hann Mariste, Dakar, Sénégal</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className="pt-8 border-t">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            <div className="text-sm text-muted-foreground">
              © {currentYear} OccazCar. Tous droits réservés.
            </div>
            <div className="flex flex-wrap justify-center lg:justify-end gap-4 lg:gap-6 text-sm">
              <Link to="/mentions-legales" className="text-muted-foreground hover:text-primary transition-colors">
                Mentions légales
              </Link>
              <Link to="/confidentialite" className="text-muted-foreground hover:text-primary transition-colors">
                Confidentialité
              </Link>
              <Link to="/cgu" className="text-muted-foreground hover:text-primary transition-colors">
                CGU
              </Link>
              <Link to="/cookies" className="text-muted-foreground hover:text-primary transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}