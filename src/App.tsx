import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import LanguageSelection from "./pages/LanguageSelection";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Home from "./pages/Home";
import AIScanner from "./pages/AIScanner";
import Weather from "./pages/Weather";
import MarketPrice from "./pages/MarketPrice";
import Marketplace from "./pages/Marketplace";
import Khatabook from "./pages/Khatabook";
import SmartSuggestions from "./pages/SmartSuggestions";
import KisanSathi from "./pages/KisanSathi";
import GovernmentSchemes from "./pages/GovernmentSchemes";
import CropCalendar from "./pages/CropCalendar";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LanguageSelection />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/home" element={<Home />} />
            <Route path="/scanner" element={<AIScanner />} />
            <Route path="/weather" element={<Weather />} />
            <Route path="/market" element={<MarketPrice />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/khatabook" element={<Khatabook />} />
            <Route path="/suggestions" element={<SmartSuggestions />} />
            <Route path="/kisan-sathi" element={<KisanSathi />} />
            <Route path="/schemes" element={<GovernmentSchemes />} />
            <Route path="/calendar" element={<CropCalendar />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
