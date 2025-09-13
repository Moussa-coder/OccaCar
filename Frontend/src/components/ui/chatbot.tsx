import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User,
  Minimize2,
  Maximize2,
  Lock
} from "lucide-react";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  type?: 'text' | 'quick_reply';
}

interface QuickReply {
  text: string;
  action: string;
}

const quickReplies: QuickReply[] = [
  { text: "Rechercher une voiture", action: "search_car" },
  { text: "Vendre ma voiture", action: "sell_car" },
  { text: "M'inscrire", action: "register" },
  { text: "Se connecter", action: "login" },
  { text: "Nos services", action: "services" },
  { text: "Garanties", action: "warranty" },
  { text: "Comment ça marche ?", action: "how_it_works" },
  { text: "Tarifs et frais", action: "pricing" },
  { text: "Nous contacter", action: "contact" }
];

const adminQuickReplies: QuickReply[] = [
  { text: "Gestion utilisateurs", action: "admin_users" },
  { text: "Analytics avancées", action: "admin_analytics" },
  { text: "Modération contenu", action: "admin_moderation" },
  { text: "Paramètres système", action: "admin_settings" },
  { text: "Logs de sécurité", action: "admin_security" },
  { text: "Statistiques globales", action: "admin_stats" },
  { text: "Gestion des annonces", action: "admin_listings" },
  { text: "Support client", action: "admin_support" }
];

const botResponses: Record<string, string> = {
  search_car: "Parfait ! Je peux vous aider à trouver votre voiture idéale. OccazCar propose plus de 15 000 véhicules vérifiés avec des filtres avancés par marque, modèle, prix, année et localisation. Voulez-vous que je vous redirige vers notre catalogue ?",
  
  sell_car: "Excellente idée ! Pour vendre votre voiture sur OccazCar :\n1. Créez un compte ou connectez-vous\n2. Remplissez le formulaire de vente avec photos\n3. Notre équipe vérifie votre annonce\n4. Elle est mise en ligne et visible par nos acheteurs\n\nVoulez-vous commencer ?",
  
  register: "Parfait ! L'inscription sur OccazCar est gratuite et vous permet de :\n\n✅ **Créer votre compte vendeur**\n✅ **Déposer vos annonces**\n✅ **Gérer vos véhicules**\n✅ **Suivre vos ventes**\n✅ **Accéder à nos services premium**\n\n**Processus d'inscription :**\n1. Cliquez sur 'S'inscrire'\n2. Remplissez le formulaire (nom, email, téléphone)\n3. Confirmez votre email\n4. Votre compte est activé immédiatement\n\nVoulez-vous que je vous redirige vers la page d'inscription ?",
  
  login: "Pour vous connecter à votre compte OccazCar :\n\n**Informations nécessaires :**\n• Votre adresse email\n• Votre mot de passe\n\n**Si vous avez oublié votre mot de passe :**\n• Cliquez sur 'Mot de passe oublié ?'\n• Entrez votre email\n• Suivez les instructions reçues\n\n**Nouveau sur OccazCar ?**\n• Créez un compte gratuitement\n• Accédez à tous nos services\n\nVoulez-vous que je vous redirige vers la page de connexion ?",
  
  services: "OccazCar propose 6 services premium :\n\n🔍 **Recherche Avancée** (Gratuit)\n• Filtres intelligents par marque, prix, année\n• Géolocalisation et alertes personnalisées\n\n🛡️ **Vérification Véhicule** (À partir de 150€)\n• Contrôle technique complet\n• Vérification historique et documents\n\n🔧 **Entretien & Réparation** (Devis gratuit)\n• Contrôle technique et réparations\n• Pièces d'origine garanties\n\n📞 **Assistance 24/7** (Inclus)\n• Support téléphonique et chat\n• Conseils personnalisés\n\n📄 **Gestion Administrative** (À partir de 200€)\n• Transfert de propriété et carte grise\n• Contrat de vente\n\n🚗 **Livraison à Domicile** (À partir de 300€)\n• Transport sécurisé sous 48h\n• Inspection à la livraison",
  
  warranty: "**Garanties OccazCar :**\n\n🛡️ **Garantie Véhicule :**\n• **6 mois** pour véhicules < 5 ans et < 100 000 km\n• **3 mois** pour véhicules < 8 ans et < 150 000 km\n• Couvre moteur, transmission, direction, freinage\n• Réparations chez nos garages partenaires\n\n✅ **Garantie Authenticité :**\n• Vérification complète de l'historique\n• Contrôle des documents (carte grise, factures)\n• Vérification du kilométrage\n• Inspection technique approfondie\n\n🔒 **Garantie Transaction :**\n• Paiement sécurisé\n• Protection contre les arnaques\n• Médiation en cas de litige\n• Remboursement sous conditions\n\n📋 **Garantie Service :**\n• Satisfaction client garantie\n• Support client dédié\n• Suivi post-vente\n• Assistance administrative\n\n**Conditions :**\n• Garantie valable uniquement pour les véhicules vérifiés par OccazCar\n• Entretien régulier obligatoire\n• Exclusions : usure normale, accidents, modifications non autorisées",
  
  how_it_works: "Voici comment fonctionne OccazCar :\n\n**Pour ACHETER :**\n1. Parcourez notre catalogue de 15 000+ véhicules\n2. Utilisez nos filtres avancés pour affiner\n3. Consultez les détails et photos\n4. Contactez le vendeur ou notre équipe\n5. Testez le véhicule\n6. Finalisez l'achat avec nos services\n\n**Pour VENDRE :**\n1. Créez votre compte vendeur\n2. Déposez votre annonce avec photos\n3. Notre équipe vérifie votre véhicule\n4. Votre annonce est mise en ligne\n5. Gérez les contacts et rendez-vous\n6. Finalisez la vente\n\n**Nos garanties :**\n• Véhicules vérifiés et authentifiés\n• Transaction 100% sécurisée\n• Support client dédié",
  
  pricing: "Voici nos tarifs OccazCar :\n\n**GRATUIT :**\n• Inscription et compte utilisateur\n• Recherche et consultation des annonces\n• Contact avec les vendeurs\n• Service de recherche avancée\n\n**SERVICES PAYANTS :**\n• Vérification véhicule : 150€\n• Gestion administrative : 200€\n• Livraison à domicile : 300€\n• Entretien & réparation : Devis gratuit\n\n**FRAIS DE VENTE :**\n• Commission vendeur : 3% du prix de vente\n• Frais de mise en ligne : 29€\n• Service premium : 99€ (mise en avant)\n\n**GARANTIES INCLUSES :**\n• Assistance 24/7\n• Support client dédié\n• Protection des données",
  
  contact: "**Contactez OccazCar :**\n\n📞 **Téléphone :** 01 23 45 67 89\n• Du lundi au vendredi : 9h-19h\n• Samedi : 9h-17h\n• Dimanche : Fermé\n\n📧 **Email :** contact@occazcar.fr\n• Réponse sous 24h\n\n📱 **Réseaux sociaux :** @OccazCar\n• Facebook, Instagram, Twitter\n• Réponse sous 4h\n\n📍 **Adresse :**\nOccazCar\n123 Avenue des Champs-Élysées\n75008 Paris\n\n🕒 **Horaires d'ouverture :**\nLun-Ven : 9h-19h\nSam : 9h-17h\nDim : Fermé",
  
  greeting: "Bonjour ! Je suis CarBot 🤖\n\nJe suis là pour vous aider avec :\n• La recherche de votre voiture idéale\n• La vente de votre véhicule\n• Nos services (vérification, entretien, etc.)\n• Les tarifs et processus\n• Toute question sur OccazCar\n\nComment puis-je vous aider aujourd'hui ?",
  
  help: "**Je peux vous aider avec :**\n\n🚗 **Achat de voiture :**\n• Recherche par critères\n• Filtres avancés\n• Informations véhicules\n\n💰 **Vente de voiture :**\n• Processus de mise en vente\n• Tarifs et commissions\n• Optimisation de votre annonce\n\n👤 **Compte utilisateur :**\n• Inscription gratuite\n• Connexion et mot de passe\n• Gestion du profil\n\n🔧 **Services OccazCar :**\n• Vérification véhicules\n• Entretien & réparation\n• Gestion administrative\n• Livraison à domicile\n\n🛡️ **Garanties :**\n• Garantie véhicule (6 mois/3 mois)\n• Garantie authenticité\n• Garantie transaction\n• Garantie service\n\n📞 **Support :**\n• Contact et horaires\n• Processus d'achat/vente\n• Tarifs et frais\n\nQue souhaitez-vous savoir ?",
  
  default: "Je ne suis pas sûr de comprendre votre demande. 🤔\n\nPouvez-vous reformuler ou choisir une de ces options :\n• Rechercher une voiture\n• Vendre ma voiture\n• M'inscrire\n• Se connecter\n• Nos services\n• Garanties\n• Comment ça marche ?\n• Tarifs et frais\n• Nous contacter\n\nJe suis là pour vous aider ! 😊",

  // Réponses pour les administrateurs
  admin_users: "**Gestion des Utilisateurs** 👥\n\nJe peux vous aider avec :\n\n📊 **Statistiques utilisateurs :**\n• 89 utilisateurs actifs\n• 15 nouvelles inscriptions cette semaine\n• 67 utilisateurs connectés aujourd'hui\n\n🔧 **Actions disponibles :**\n• Voir tous les utilisateurs\n• Modifier les rôles\n• Suspendre/activer des comptes\n• Exporter la liste des utilisateurs\n\n📈 **Métriques clés :**\n• Taux de conversion : 3.2%\n• Utilisateurs récurrents : 45\n• Temps de session moyen : 4m 32s\n\nVoulez-vous accéder au tableau de bord de gestion des utilisateurs ?",

  admin_analytics: "**Analytics Avancées** 📊\n\nVoici un aperçu des performances d'OccazCar :\n\n💰 **Revenus :**\n• Total : 125 000€ (+12.5%)\n• Ce mois : 45 000€\n• Prix moyen : 28 500€\n\n🚗 **Annonces :**\n• Total : 156 annonces (+8.2%)\n• Actives : 142\n• Vendues ce mois : 18\n\n👥 **Utilisateurs :**\n• Total : 89 (+15.3%)\n• Nouveaux : 15 cette semaine\n• Actifs : 67\n\n📈 **Performance :**\n• Taux de conversion : 3.2%\n• Temps de vente moyen : 18 jours\n• Satisfaction client : 4.7/5\n\nVoulez-vous voir les analytics détaillées ?",

  admin_moderation: "**Modération du Contenu** 🛡️\n\nÉtat actuel de la modération :\n\n📋 **En attente :**\n• 3 annonces à vérifier\n• 2 signalements utilisateurs\n• 1 demande de vérification\n\n✅ **Traitées aujourd'hui :**\n• 12 annonces approuvées\n• 1 annonce rejetée\n• 3 signalements résolus\n\n🔍 **Critères de modération :**\n• Photos de qualité\n• Descriptions complètes\n• Prix cohérents\n• Informations véhicule exactes\n\n⚠️ **Alertes :**\n• 0 contenu inapproprié détecté\n• 1 utilisateur signalé\n• Système de modération opérationnel\n\nVoulez-vous accéder à la file de modération ?",

  admin_settings: "**Paramètres Système** ⚙️\n\nConfiguration actuelle d'OccazCar :\n\n🌐 **Serveur :**\n• Uptime : 99.8%\n• Temps de réponse : 1.2s\n• Charge : 45%\n\n🔒 **Sécurité :**\n• Taux d'erreur : 0.3%\n• Connexions sécurisées : 100%\n• Sauvegardes : Automatiques\n\n📊 **Base de données :**\n• Requêtes : 1 250/heure\n• Appels API : 8 900/heure\n• Performance : Optimale\n\n🔧 **Maintenance :**\n• Dernière mise à jour : Aujourd'hui\n• Prochaine maintenance : Dimanche 2h-4h\n• Statut : Tous systèmes opérationnels\n\nVoulez-vous modifier les paramètres système ?",

  admin_security: "**Logs de Sécurité** 🔐\n\nRapport de sécurité en temps réel :\n\n🟢 **Statut :** Sécurisé\n• 0 tentatives d'intrusion\n• 0 violations détectées\n• Système de sécurité actif\n\n📊 **Activité récente :**\n• 45 connexions réussies\n• 2 tentatives de connexion échouées\n• 0 comptes compromis\n• 1 changement de mot de passe\n\n🔍 **Surveillance :**\n• Monitoring 24/7 actif\n• Alertes automatiques configurées\n• Logs archivés sécurisés\n• Conformité RGPD respectée\n\n⚠️ **Recommandations :**\n• Mise à jour des mots de passe recommandée\n• Audit de sécurité mensuel programmé\n• Formation équipe prévue\n\nVoulez-vous consulter les logs détaillés ?",

  admin_stats: "**Statistiques Globales** 📈\n\nTableau de bord complet d'OccazCar :\n\n🏆 **Performance générale :**\n• Croissance mensuelle : +12.5%\n• Satisfaction client : 4.7/5\n• Taux de rétention : 78%\n\n🚗 **Véhicules :**\n• 156 annonces actives\n• 18 ventes ce mois\n• 5 marques les plus populaires\n• Prix moyen : 28 500€\n\n👥 **Utilisateurs :**\n• 89 utilisateurs actifs\n• 15 nouvelles inscriptions\n• 67 sessions aujourd'hui\n• 45 utilisateurs récurrents\n\n💰 **Revenus :**\n• 125 000€ total\n• 45 000€ ce mois\n• Commission moyenne : 3.2%\n• Marge bénéficiaire : 15%\n\nVoulez-vous voir les statistiques détaillées ?",

  admin_listings: "**Gestion des Annonces** 🚗\n\nÉtat des annonces OccazCar :\n\n📋 **Répartition :**\n• Actives : 142 annonces\n• En attente : 8 annonces\n• Vendues : 6 annonces\n• Expirées : 0 annonce\n\n🏆 **Top performers :**\n• BMW Série 3 : 127 vues\n• Audi A4 : 98 vues\n• Mercedes Classe C : 89 vues\n\n📊 **Métriques :**\n• Temps moyen en ligne : 12 jours\n• Taux de conversion : 3.2%\n• Vues moyennes : 45 par annonce\n• Demandes moyennes : 3 par annonce\n\n🔧 **Actions disponibles :**\n• Modérer les annonces\n• Optimiser les descriptions\n• Gérer les photos\n• Contacter les vendeurs\n\nVoulez-vous gérer les annonces ?",

  admin_support: "**Support Client** 🎧\n\nÉtat du support OccazCar :\n\n📞 **Tickets en cours :**\n• 5 tickets ouverts\n• 2 tickets urgents\n• 12 tickets résolus aujourd'hui\n• Temps de réponse moyen : 2h\n\n👥 **Équipe support :**\n• 3 agents disponibles\n• 1 superviseur actif\n• Couverture : 9h-19h\n• Support 24/7 : Chatbot actif\n\n📊 **Satisfaction :**\n• Note moyenne : 4.6/5\n• Taux de résolution : 95%\n• Temps de résolution : 4h\n• Retours positifs : 89%\n\n🔧 **Outils disponibles :**\n• Chat en direct\n• Système de tickets\n• Base de connaissances\n• FAQ automatique\n\nVoulez-vous accéder au centre de support ?",

  admin_greeting: "Bonjour Administrateur ! 👋\n\nJe suis CarBot, votre assistant personnel pour la gestion d'OccazCar. Je peux vous aider avec :\n\n📊 **Analytics & Statistiques**\n• Performance de la plateforme\n• Métriques utilisateurs\n• Revenus et conversions\n\n👥 **Gestion Utilisateurs**\n• Modération des comptes\n• Support client\n• Gestion des rôles\n\n🚗 **Gestion Contenu**\n• Modération des annonces\n• Vérification des véhicules\n• Optimisation du catalogue\n\n⚙️ **Administration**\n• Paramètres système\n• Logs de sécurité\n• Maintenance\n\nComment puis-je vous assister aujourd'hui ?"
};

export function Chatbot() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Bonjour ! Je suis CarBot. Comment puis-je vous aider aujourd'hui ?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Vérifier l'authentification et le rôle au chargement
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    setIsAuthenticated(!!token);
    setIsAdmin(userRole === 'admin');
    
    // Message d'accueil personnalisé pour les admins
    if (userRole === 'admin') {
      setMessages([{
        id: "1",
        text: "Bonjour Administrateur ! 👋\n\nJe suis CarBot, votre assistant personnel pour la gestion d'OccazCar. Comment puis-je vous assister aujourd'hui ?",
        isUser: false,
        timestamp: new Date()
      }]);
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = (text: string, isUser: boolean, type: 'text' | 'quick_reply' = 'text') => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser,
      timestamp: new Date(),
      type
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const simulateTyping = (response: string) => {
    setIsTyping(true);
    setTimeout(() => {
      addMessage(response, false);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleQuickReply = (action: string) => {
    const reply = quickReplies.find(r => r.action === action);
    if (reply) {
      addMessage(reply.text, true);
      handleBotResponse(action);
    }
  };

  const handleBotResponse = (action: string) => {
    const response = botResponses[action] || botResponses.default;
    
    // Actions spéciales pour les utilisateurs normaux
    if (action === "search_car") {
      setTimeout(() => {
        window.location.href = '/voitures';
      }, 2000);
    } else if (action === "sell_car") {
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    } else if (action === "register") {
      setTimeout(() => {
        window.location.href = '/register';
      }, 2000);
    } else if (action === "login") {
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    } else if (action === "services") {
      setTimeout(() => {
        window.location.href = '/services';
      }, 3000);
    } else if (action === "contact") {
      setTimeout(() => {
        window.location.href = '/contact';
      }, 3000);
    }
    
    // Actions spéciales pour les administrateurs
    else if (action === "admin_users") {
      setTimeout(() => {
        window.location.href = '/admin/users';
      }, 3000);
    } else if (action === "admin_analytics") {
      setTimeout(() => {
        window.location.href = '/admin/analytics';
      }, 3000);
    } else if (action === "admin_moderation") {
      setTimeout(() => {
        window.location.href = '/admin/moderation';
      }, 3000);
    } else if (action === "admin_settings") {
      setTimeout(() => {
        window.location.href = '/admin/settings';
      }, 3000);
    } else if (action === "admin_security") {
      setTimeout(() => {
        window.location.href = '/admin/security';
      }, 3000);
    }
    
    simulateTyping(response);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    addMessage(inputValue, true);
    const userMessage = inputValue.toLowerCase();

    // Analyse intelligente des messages utilisateur
    let action = "default";
    
    // Salutations
    if (userMessage.includes("bonjour") || userMessage.includes("salut") || userMessage.includes("hello") || 
        userMessage.includes("bonsoir") || userMessage.includes("coucou")) {
      action = isAdmin ? "admin_greeting" : "greeting";
    }
    // Recherche/Achat
    else if (userMessage.includes("rechercher") || userMessage.includes("trouver") || userMessage.includes("acheter") || 
             userMessage.includes("voiture") || userMessage.includes("véhicule") || userMessage.includes("catalogue") ||
             userMessage.includes("bmw") || userMessage.includes("audi") || userMessage.includes("mercedes") ||
             userMessage.includes("peugeot") || userMessage.includes("renault") || userMessage.includes("volkswagen")) {
      action = "search_car";
    }
    // Vente
    else if (userMessage.includes("vendre") || userMessage.includes("vendre ma voiture") || userMessage.includes("déposer") ||
             userMessage.includes("annonce") || userMessage.includes("mettre en vente")) {
      action = "sell_car";
    }
    // Inscription
    else if (userMessage.includes("inscrire") || userMessage.includes("inscription") || userMessage.includes("créer un compte") ||
             userMessage.includes("compte") || userMessage.includes("s'inscrire") || userMessage.includes("m'inscrire") ||
             userMessage.includes("nouveau compte") || userMessage.includes("enregistrer")) {
      action = "register";
    }
    // Connexion
    else if (userMessage.includes("connecter") || userMessage.includes("connexion") || userMessage.includes("se connecter") ||
             userMessage.includes("me connecter") || userMessage.includes("login") || userMessage.includes("identifier") ||
             userMessage.includes("authentifier") || userMessage.includes("mot de passe")) {
      action = "login";
    }
    // Services
    else if (userMessage.includes("service") || userMessage.includes("entretien") || userMessage.includes("réparation") ||
             userMessage.includes("vérification") || userMessage.includes("contrôle technique") || userMessage.includes("garage")) {
      action = "services";
    }
    // Garanties
    else if (userMessage.includes("garantie") || userMessage.includes("garanties") || userMessage.includes("assurance") ||
             userMessage.includes("protection") || userMessage.includes("sécurité") || userMessage.includes("couverture") ||
             userMessage.includes("remboursement") || userMessage.includes("litige") || userMessage.includes("médiation")) {
      action = "warranty";
    }
    // Comment ça marche
    else if (userMessage.includes("comment") || userMessage.includes("fonctionne") || userMessage.includes("processus") ||
             userMessage.includes("marche") || userMessage.includes("étapes") || userMessage.includes("procédure")) {
      action = "how_it_works";
    }
    // Tarifs
    else if (userMessage.includes("prix") || userMessage.includes("tarif") || userMessage.includes("coût") ||
             userMessage.includes("frais") || userMessage.includes("commission") || userMessage.includes("gratuit") ||
             userMessage.includes("€") || userMessage.includes("euro")) {
      action = "pricing";
    }
    // Contact
    else if (userMessage.includes("contact") || userMessage.includes("téléphone") || userMessage.includes("email") ||
             userMessage.includes("adresse") || userMessage.includes("horaires") || userMessage.includes("ouvrir") ||
             userMessage.includes("joindre") || userMessage.includes("appeler")) {
      action = "contact";
    }
    // Aide
    else if (userMessage.includes("aide") || userMessage.includes("help") || userMessage.includes("assistance") ||
             userMessage.includes("problème") || userMessage.includes("question") || userMessage.includes("savoir")) {
      action = "help";
    }
    
    // Questions d'administration (uniquement pour les admins)
    else if (isAdmin) {
      // Gestion utilisateurs
      if (userMessage.includes("utilisateur") || userMessage.includes("user") || userMessage.includes("compte") ||
          userMessage.includes("inscription") || userMessage.includes("membre") || userMessage.includes("client")) {
        action = "admin_users";
      }
      // Analytics
      else if (userMessage.includes("analytics") || userMessage.includes("statistique") || userMessage.includes("performance") ||
               userMessage.includes("métrique") || userMessage.includes("revenu") || userMessage.includes("conversion")) {
        action = "admin_analytics";
      }
      // Modération
      else if (userMessage.includes("modération") || userMessage.includes("moderation") || userMessage.includes("contenu") ||
               userMessage.includes("annonce") || userMessage.includes("vérification") || userMessage.includes("signalement")) {
        action = "admin_moderation";
      }
      // Paramètres système
      else if (userMessage.includes("paramètre") || userMessage.includes("système") || userMessage.includes("configuration") ||
               userMessage.includes("serveur") || userMessage.includes("maintenance") || userMessage.includes("performance technique")) {
        action = "admin_settings";
      }
      // Sécurité
      else if (userMessage.includes("sécurité") || userMessage.includes("security") || userMessage.includes("log") ||
               userMessage.includes("audit") || userMessage.includes("intrusion") || userMessage.includes("violation")) {
        action = "admin_security";
      }
      // Statistiques globales
      else if (userMessage.includes("statistique globale") || userMessage.includes("tableau de bord") || userMessage.includes("dashboard") ||
               userMessage.includes("vue d'ensemble") || userMessage.includes("résumé")) {
        action = "admin_stats";
      }
      // Gestion des annonces
      else if (userMessage.includes("gestion annonce") || userMessage.includes("liste annonce") || userMessage.includes("catalogue admin") ||
               userMessage.includes("véhicule admin") || userMessage.includes("voiture admin")) {
        action = "admin_listings";
      }
      // Support client
      else if (userMessage.includes("support") || userMessage.includes("ticket") || userMessage.includes("client") ||
               userMessage.includes("aide client") || userMessage.includes("service client")) {
        action = "admin_support";
      }
    }

    setInputValue("");
    handleBotResponse(action);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleChat = () => {
    if (!isAuthenticated) {
      // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
      navigate('/login', { 
        state: { 
          message: 'Vous devez être connecté pour accéder au chatbot',
          redirectTo: window.location.pathname
        } 
      });
      return;
    }
    
    setIsOpen(!isOpen);
    if (!isOpen) {
      setIsMinimized(false);
    }
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <>
      {/* Bouton flottant */}
      {!isOpen && (
        <Button
          onClick={toggleChat}
          className={`fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 ${
            isAuthenticated 
              ? 'bg-primary hover:bg-primary/90' 
              : 'bg-muted hover:bg-muted/80'
          }`}
          size="icon"
          title={isAuthenticated ? "Ouvrir le chatbot" : "Connectez-vous pour accéder au chatbot"}
        >
          {isAuthenticated ? (
            <MessageCircle className="h-6 w-6" />
          ) : (
            <Lock className="h-6 w-6" />
          )}
        </Button>
      )}

      {/* Chatbot */}
      {isOpen && isAuthenticated && (
        <Card className={`fixed bottom-6 right-6 z-50 w-80 shadow-2xl transition-all duration-300 ${
          isMinimized ? 'h-16' : 'h-96'
        }`}>
          <CardContent className="p-0 h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-primary text-primary-foreground rounded-t-lg">
              <div className="flex items-center space-x-2">
                <Bot className="h-5 w-5" />
                <span className="font-semibold">CarBot</span>
                <Badge variant={isAdmin ? "default" : "secondary"} className="text-xs">
                  {isAdmin ? "Admin" : "Connecté"}
                </Badge>
              </div>
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-primary-foreground hover:bg-primary-foreground/20"
                  onClick={toggleMinimize}
                >
                  {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-primary-foreground hover:bg-primary-foreground/20"
                  onClick={toggleChat}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex items-start space-x-2 max-w-[80%] ${
                        message.isUser ? 'flex-row-reverse space-x-reverse' : ''
                      }`}>
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                          message.isUser 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          {message.isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                        </div>
                        <div className={`rounded-lg px-3 py-2 ${
                          message.isUser 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-muted'
                        }`}>
                          <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                          <p className={`text-xs mt-1 ${
                            message.isUser ? 'text-primary-foreground/70' : 'text-muted-foreground'
                          }`}>
                            {message.timestamp.toLocaleTimeString('fr-FR', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="flex items-start space-x-2">
                        <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center">
                          <Bot className="h-4 w-4" />
                        </div>
                        <div className="bg-muted rounded-lg px-3 py-2">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.1s]"></div>
                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.2s]"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>


                {/* Input */}
                <div className="p-4 border-t">
                  <div className="flex space-x-2">
                    <Input
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Tapez votre message..."
                      className="flex-1"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!inputValue.trim()}
                      size="icon"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </>
  );
}
