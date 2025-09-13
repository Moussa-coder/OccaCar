import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Car, 
  Users, 
  Shield, 
  Award, 
  Heart, 
  CheckCircle2,
  Phone,
  Star,
  Zap
} from "lucide-react";
import { Link } from "react-router-dom";

const teamMembers = [
  {
    name: "Marie Dubois",
    role: "Fondatrice & CEO",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300",
    description: "15 ans d'expérience dans l'automobile. Passionnée par l'innovation et la satisfaction client."
  },
  {
    name: "Thomas Martin",
    role: "CTO",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300",
    description: "Expert en technologies web et mobile. Architecte de notre plateforme sécurisée."
  },
  {
    name: "Sophie Laurent",
    role: "Responsable Qualité",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300",
    description: "Garantit la qualité de chaque véhicule et l'excellence de notre service client."
  },
  {
    name: "Pierre Moreau",
    role: "Responsable Marketing",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300",
    description: "Développe notre présence digitale et nos partenariats stratégiques."
  }
];

const values = [
  {
    icon: Shield,
    title: "Transparence",
    description: "Toutes les informations sur nos véhicules sont vérifiées et authentiques. Aucune surprise, que de la confiance."
  },
  {
    icon: Heart,
    title: "Passion",
    description: "Nous partageons votre passion pour l'automobile et nous nous engageons à vous trouver le véhicule parfait."
  },
  {
    icon: Users,
    title: "Service Client",
    description: "Notre équipe dédiée vous accompagne à chaque étape de votre achat, avant, pendant et après."
  },
  {
    icon: Award,
    title: "Excellence",
    description: "Nous sélectionnons rigoureusement chaque véhicule pour vous garantir qualité et fiabilité."
  }
];

const stats = [
  { label: "Véhicules vendus", value: "12 547", icon: Car },
  { label: "Clients satisfaits", value: "8 923", icon: Users },
  { label: "Années d'expérience", value: "15+", icon: Award },
  { label: "Taux de satisfaction", value: "98%", icon: Star }
];

const achievements = [
  {
    year: "2009",
    title: "Création d'OccazCar",
    description: "Lancement de la plateforme avec une vision : démocratiser l'achat de voitures d'occasion."
  },
  {
    year: "2012",
    title: "Premier million d'euros",
    description: "Atteinte du premier million d'euros de chiffre d'affaires grâce à la confiance de nos clients."
  },
  {
    year: "2015",
    title: "Expansion nationale",
    description: "Déploiement de notre service dans toute la France avec plus de 50 partenaires."
  },
  {
    year: "2018",
    title: "Innovation technologique",
    description: "Lancement de notre application mobile et de notre système de vérification 360°."
  },
  {
    year: "2021",
    title: "Certification ISO",
    description: "Obtention de la certification ISO 9001 pour notre système de management qualité."
  },
  {
    year: "2024",
    title: "Leader du marché",
    description: "OccazCar devient la référence française de la vente de voitures d'occasion en ligne."
  }
];

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              À propos d'<span className="gradient-text">OccazCar</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Depuis 2009, nous révolutionnons l'achat de voitures d'occasion en France. 
              Notre mission : vous offrir la meilleure expérience d'achat automobile.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center space-y-2">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-3">
                  <stat.icon className="h-6 w-6" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-primary">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Notre Histoire</h2>
              <p className="text-muted-foreground text-lg">
                Une aventure qui a commencé par une simple idée : rendre l'achat de voitures d'occasion 
                plus simple, plus sûr et plus transparent.
              </p>
            </div>

            <div className="space-y-8">
              {achievements.map((achievement, index) => (
                <div key={index} className="flex items-start space-x-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary font-bold text-lg">{achievement.year}</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{achievement.title}</h3>
                    <p className="text-muted-foreground">{achievement.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Nos Valeurs</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Ces valeurs guident chacune de nos décisions et définissent notre engagement envers vous.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
                    <value.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
                  <p className="text-muted-foreground text-sm">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Notre Équipe</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Des professionnels passionnés qui travaillent chaque jour pour vous offrir le meilleur service.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-lg font-semibold mb-1">{member.name}</h3>
                  <Badge variant="secondary" className="mb-3">{member.role}</Badge>
                  <p className="text-muted-foreground text-sm">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Pourquoi Choisir OccazCar ?</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Nous nous distinguons par notre expertise, notre transparence et notre engagement client.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-success/10 text-success mb-4">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Véhicules Vérifiés</h3>
                <p className="text-muted-foreground text-sm">
                  Chaque véhicule passe par notre processus de vérification rigoureux : 
                  historique, état mécanique, et conformité légale.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
                  <Shield className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Achat Sécurisé</h3>
                <p className="text-muted-foreground text-sm">
                  Protection totale de votre achat avec notre garantie et notre service 
                  de médiation en cas de litige.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/10 text-accent mb-4">
                  <Zap className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Processus Simplifié</h3>
                <p className="text-muted-foreground text-sm">
                  De la recherche à l'achat, nous simplifions chaque étape pour vous faire 
                  gagner du temps et de l'argent.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Prêt à Trouver Votre Prochaine Voiture ?</h2>
              <p className="text-muted-foreground mb-6">
                Rejoignez des milliers de clients satisfaits qui nous font confiance pour leur achat automobile.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link to="/voitures">
                    <Car className="h-5 w-5 mr-2" />
                    Voir nos véhicules
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/contact">
                    <Phone className="h-5 w-5 mr-2" />
                    Nous contacter
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
