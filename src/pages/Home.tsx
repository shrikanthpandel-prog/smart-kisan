import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Scan,
  TrendingUp,
  ShoppingBag,
  BookOpen,
  Cloud,
  Lightbulb,
  Users,
  Sun,
  Moon,
  Languages,
  Home as HomeIcon,
  User,
  Building2,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import farm1 from "@/assets/farm1.jpg";
import farm2 from "@/assets/farm2.jpg";
import farm3 from "@/assets/farm3.jpg";
import farm4 from "@/assets/farm4.jpg";
import farm5 from "@/assets/farm5.jpg";



const crops = ["🌾 Wheat", "🌽 Corn", "🍚 Rice", "🥔 Potato", "🥕 Carrot", "🍅 Tomato"];
const farmImages = [farm1, farm2, farm3, farm4, farm5];

const Home = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [currentCrop, setCurrentCrop] = useState(0);
  const [currentBgImage, setCurrentBgImage] = useState(0);
  const [isDark, setIsDark] = useState(true);
  const [showLangModal, setShowLangModal] = useState(false);

  const features = [
    { id: "scanner", icon: Scan, title: t("aiScanner"), route: "/scanner", color: "text-accent" },
    { id: "market", icon: TrendingUp, title: t("marketPrice"), route: "/market", color: "text-success" },
    { id: "marketplace", icon: ShoppingBag, title: t("marketplace"), route: "/marketplace", color: "text-secondary" },
    { id: "khatabook", icon: BookOpen, title: t("khatabook"), route: "/khatabook", color: "text-warning" },
    { id: "weather", icon: Cloud, title: t("weather"), route: "/weather", color: "text-info" },
    { id: "suggestions", icon: Lightbulb, title: t("smartTips"), route: "/suggestions", color: "text-primary" },
    { id: "kisan-sathi", icon: Users, title: t("kisanSathi"), route: "/kisan-sathi", color: "text-accent" },
    { id: "schemes", icon: Building2, title: "Govt Schemes", route: "/schemes", color: "text-success" },
    { id: "calendar", icon: Calendar, title: "Crop Calendar", route: "/calendar", color: "text-info" },
  ];

  useEffect(() => {
    const isDarkMode = localStorage.getItem("theme") === "dark";
    setIsDark(isDarkMode);
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCrop((prev) => (prev + 1) % crops.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgImage((prev) => (prev + 1) % farmImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    localStorage.setItem("theme", newIsDark ? "dark" : "light");
    document.documentElement.classList.toggle("dark", newIsDark);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10 pb-32">
      {/* Header */}
      <header className="p-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-primary">{t("appTitle")}</h1>
          <p className="text-sm text-muted-foreground">{t("subTitle")}</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate("/profile")}
            className="rounded-full"
          >
            <User className="w-5 h-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowLangModal(true)}
            className="rounded-full"
          >
            <Languages className="w-5 h-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>
        </div>
      </header>

      {/* Welcome Section */}
      <div className="relative text-center px-6 py-8 animate-slide-up overflow-hidden">
        {/* Background Slideshow */}
        <div className="absolute inset-0 -z-10">
          {farmImages.map((img, index) => (
            <div
              key={index}
              className="absolute inset-0 transition-opacity duration-1000"
              style={{
                opacity: currentBgImage === index ? 1 : 0,
              }}
            >
              <img
                src={img}
                alt={`Farm ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background/90" />
            </div>
          ))}
        </div>
        
        <h2 className="relative text-3xl md:text-4xl font-bold text-foreground mb-2 drop-shadow-lg">
          {t("welcome")}
        </h2>
        
        {/* Today's Suggestion */}
        <div className="max-w-2xl mx-auto mt-6 p-4 bg-card/50 backdrop-blur-sm rounded-3xl border border-primary/20 shadow-card">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-5 h-5 text-warning" />
            <h3 className="font-semibold text-card-foreground">{t("todaysTip")}</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            {t("tipContent")}
          </p>
        </div>
      </div>

      {/* Central AI Scanner */}
      <div className="flex justify-center px-6 mb-8">
        <button
          onClick={() => navigate("/scanner")}
          className="relative group"
        >
          <div className="w-32 h-32 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow animate-glow transition-transform hover:scale-110 active:scale-95">
            <Scan className="w-16 h-16 text-primary-foreground" />
          </div>
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
            <p className="text-sm font-semibold text-foreground">AI Scanner</p>
          </div>
        </button>
      </div>

      {/* Feature Grid */}
      <div className="px-6 mt-16">
        <div className="grid grid-cols-3 gap-4 max-w-4xl mx-auto">
          {features.filter(f => f.id !== "scanner").map((feature, index) => (
            <button
              key={feature.id}
              onClick={() => navigate(feature.route)}
              className="p-4 bg-card rounded-3xl border border-border shadow-card transition-all hover:scale-105 hover:shadow-glow active:scale-95"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex flex-col items-center gap-2">
                <div className={`w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center ${feature.color}`}>
                  <feature.icon className="w-7 h-7" />
                </div>
                <p className="text-xs font-semibold text-center text-card-foreground leading-tight">
                  {feature.title}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <button
          onClick={() => navigate("/home")}
          className="w-20 h-20 rounded-full bg-gradient-primary shadow-glow animate-glow flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
        >
          <HomeIcon className="w-10 h-10 text-primary-foreground" />
        </button>
      </div>

      {/* Language Modal */}
      {showLangModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowLangModal(false)}>
          <div className="bg-card rounded-3xl p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold mb-4">Change Language</h3>
            <Button onClick={() => { navigate("/"); setShowLangModal(false); }} className="w-full">
              Go to Language Selection
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
