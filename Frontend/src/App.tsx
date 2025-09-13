import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/hooks/use-theme";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { Chatbot } from "@/components/ui/chatbot";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CarDetail from "./pages/CarDetail";
import MyListings from "./pages/MyListings";
import EditListing from "./pages/EditListing";
import UserProfile from "./pages/UserProfile";
import CreateListing from "./pages/CreateListing";
import AdminDashboard from "./pages/AdminDashboard";
import UserManagement from "./pages/UserManagement";
import AdminAnalytics from "./pages/AdminAnalytics";
import ModerationQueue from "./pages/ModerationQueue";
import SystemSettings from "./pages/SystemSettings";
import SecurityLogs from "./pages/SecurityLogs";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Services from "./pages/Services";
import Cars from "./pages/Cars";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [isDark, setIsDark] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Check authentication status on app load
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    setIsAuthenticated(!!token);
    setIsAdmin(userRole === 'admin');
  }, []);

  // Check theme preference
  useEffect(() => {
    const theme = localStorage.getItem('occazcar-ui-theme');
    if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    } else {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark';
    localStorage.setItem('occazcar-ui-theme', newTheme);
    
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    } else {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsAdmin(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="occazcar-ui-theme">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="flex flex-col min-h-screen">
              <Navbar 
                isAuthenticated={isAuthenticated}
                onToggleTheme={toggleTheme}
                isDark={isDark}
                isAdmin={isAdmin}
                onLogout={handleLogout}
              />
              
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/voiture/:id" element={<CarDetail />} />
                  <Route path="/mes-annonces" element={<MyListings />} />
                  <Route path="/modifier/:id" element={<EditListing />} />
                  <Route path="/profil" element={<UserProfile />} />
                  <Route path="/deposer" element={<CreateListing />} />
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/users" element={<UserManagement />} />
                  <Route path="/admin/analytics" element={<AdminAnalytics />} />
                  <Route path="/admin/moderation" element={<ModerationQueue />} />
                  <Route path="/admin/settings" element={<SystemSettings />} />
                  <Route path="/admin/security" element={<SecurityLogs />} />
                  <Route path="/a-propos" element={<About />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/voitures" element={<Cars />} />
                  <Route path="/contact" element={<Contact />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              
              <Footer />
              <Chatbot />
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
