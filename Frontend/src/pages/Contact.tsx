import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  MessageCircle, 
  Send,
  Headphones
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const contactMethods = [
  {
    icon: Phone,
    title: "Téléphone",
    description: "Appelez-nous pour une assistance immédiate",
    contact: "01 23 45 67 89",
    availability: "Lun-Ven: 9h-19h, Sam: 9h-17h"
  },
  {
    icon: Mail,
    title: "Email",
    description: "Envoyez-nous un message détaillé",
    contact: "contact@occazcar.fr",
    availability: "Réponse sous 24h"
  },
  {
    icon: MessageCircle,
    title: "Réseaux sociaux",
    description: "Suivez-nous et contactez-nous sur nos réseaux",
    contact: "@OccazCar",
    availability: "Réponse sous 4h"
  }
];

const faqs = [
  {
    question: "Comment puis-je vendre ma voiture sur OccazCar ?",
    answer: "C'est très simple ! Créez un compte, cliquez sur 'Déposer une annonce', remplissez le formulaire avec les informations de votre véhicule et publiez votre annonce. Notre équipe la vérifiera avant publication."
  },
  {
    question: "Quelles sont les garanties proposées ?",
    answer: "Nous proposons une garantie de 6 mois sur les véhicules de moins de 5 ans et moins de 100 000 km. Tous nos véhicules passent par un contrôle technique et une vérification complète."
  },
  {
    question: "Puis-je négocier le prix d'un véhicule ?",
    answer: "Oui, la plupart de nos vendeurs acceptent la négociation. Vous pouvez contacter directement le vendeur via notre plateforme pour discuter du prix."
  },
  {
    question: "Comment se déroule la transaction ?",
    answer: "Une fois l'accord trouvé, vous pouvez organiser un rendez-vous pour voir le véhicule. Le paiement se fait directement entre l'acheteur et le vendeur, nous ne prenons pas de commission."
  }
];

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    contactMethod: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Le nom est requis";
    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "L'email n'est pas valide";
    }
    if (!formData.subject.trim()) newErrors.subject = "Le sujet est requis";
    if (!formData.message.trim()) newErrors.message = "Le message est requis";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Erreurs dans le formulaire",
        description: "Veuillez corriger les erreurs avant de continuer",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      // Simulation d'un envoi de message
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Message envoyé avec succès",
        description: "Nous vous répondrons dans les plus brefs délais",
      });
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        contactMethod: ""
      });
      
    } catch (error: unknown) {
      console.error('Contact form error:', error);
      toast({
        title: "Erreur lors de l'envoi",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Contactez <span className="gradient-text">OccazCar</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Notre équipe est là pour vous accompagner dans votre recherche de véhicule. 
              N'hésitez pas à nous contacter pour toute question.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Methods */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Headphones className="h-5 w-5" />
                  <span>Nous Contacter</span>
                </CardTitle>
                <CardDescription>
                  Choisissez le moyen de contact qui vous convient le mieux
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {contactMethods.map((method, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <method.icon className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{method.title}</h3>
                      <p className="text-sm text-muted-foreground mb-1">{method.description}</p>
                      <p className="text-sm font-medium text-primary">{method.contact}</p>
                      <p className="text-xs text-muted-foreground">{method.availability}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Office Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5" />
                  <span>Nos Bureaux</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-medium">Siège Social</h3>
                  <p className="text-sm text-muted-foreground">
                    Hann Mariste, <br />
                    Dakar, Sénégal
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>Horaires d'ouverture</span>
                  </h3>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>Lundi - Vendredi: 9h00 - 19h00</p>
                    <p>Samedi: 9h00 - 17h00</p>
                    <p>Dimanche: Fermé</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="bg-primary/5">
              <CardContent className="p-6 text-center">
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-primary">98%</div>
                  <div className="text-sm text-muted-foreground">Satisfaction client</div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="text-2xl font-bold text-primary">&lt; 2h</div>
                  <div className="text-sm text-muted-foreground">Temps de réponse moyen</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Envoyez-nous un message</CardTitle>
                <CardDescription>
                  Remplissez le formulaire ci-dessous et nous vous répondrons rapidement
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name & Email */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nom complet *</Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="Votre nom"
                        value={formData.name}
                        onChange={handleChange}
                        className={errors.name ? "border-destructive" : ""}
                      />
                      {errors.name && (
                        <p className="text-sm text-destructive">{errors.name}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Adresse email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="votre@email.com"
                        value={formData.email}
                        onChange={handleChange}
                        className={errors.email ? "border-destructive" : ""}
                      />
                      {errors.email && (
                        <p className="text-sm text-destructive">{errors.email}</p>
                      )}
                    </div>
                  </div>

                  {/* Phone & Subject */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Téléphone</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="77 340 90 03"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="subject">Sujet *</Label>
                      <Select value={formData.subject} onValueChange={(value) => handleSelectChange('subject', value)}>
                        <SelectTrigger className={errors.subject ? "border-destructive" : ""}>
                          <SelectValue placeholder="Sélectionnez un sujet" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="question-generale">Question générale</SelectItem>
                          <SelectItem value="aide-achat">Aide pour un achat</SelectItem>
                          <SelectItem value="aide-vente">Aide pour une vente</SelectItem>
                          <SelectItem value="probleme-technique">Problème technique</SelectItem>
                          <SelectItem value="reclamation">Réclamation</SelectItem>
                          <SelectItem value="partenariat">Partenariat</SelectItem>
                          <SelectItem value="autre">Autre</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.subject && (
                        <p className="text-sm text-destructive">{errors.subject}</p>
                      )}
                    </div>
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Décrivez votre demande en détail..."
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      className={errors.message ? "border-destructive" : ""}
                    />
                    {errors.message && (
                      <p className="text-sm text-destructive">{errors.message}</p>
                    )}
                  </div>

                  {/* Submit */}
                  <Button type="submit" size="lg" disabled={isLoading} className="w-full">
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2" />
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Envoyer le message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <section className="mt-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Questions Fréquentes</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Trouvez rapidement les réponses aux questions les plus courantes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs.map((faq, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-3 flex items-start space-x-2">
                    <MessageCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>{faq.question}</span>
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {faq.answer}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
