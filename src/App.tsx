import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Navbar from "./components/Navbar";
import Work from "./pages/Work";
import About from "./pages/About";
import Play from "./pages/Play";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import CursorShadow from "./components/CursorShadow";
import SearchPopup from "./components/SearchPopup";
import { ThemeProvider } from "./context/ThemeContext";
import { ChatProvider } from "./context/ChatContext";
import ProjectDetail from "./pages/ProjectDetail";
import ExperienceDetail from './pages/ExperienceDetail';
import usePageTitle from "./hooks/use-page-title";

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Work />} />
        <Route path="/about" element={<About />} />
        <Route path="/play" element={<Play />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/projects/:id" element={<ProjectDetail />} />
        <Route path="/experiences/:id" element={<ExperienceDetail />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => {
  // Use the page title hook
  usePageTitle();
  
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <ChatProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <div className="relative">
                <CursorShadow />
                <Navbar />
                <SearchPopup />
                <AnimatedRoutes />
              </div>
            </BrowserRouter>
          </TooltipProvider>
        </ChatProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
