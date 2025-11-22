import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

const languages = [
  { code: "en", name: "English", native: "English" },
  { code: "hi", name: "Hindi", native: "हिंदी" },
  { code: "kn", name: "Kannada", native: "ಕನ್ನಡ" },
  { code: "ta", name: "Tamil", native: "தமிழ்" },
  { code: "te", name: "Telugu", native: "తెలుగు" },
  { code: "ml", name: "Malayalam", native: "മലയാളം" },
  { code: "mr", name: "Marathi", native: "मराठी" },
  { code: "gu", name: "Gujarati", native: "ગુજરાતી" },
  { code: "pa", name: "Punjabi", native: "ਪੰਜਾਬੀ" },
  { code: "bn", name: "Bengali", native: "বাংলা" },
  { code: "or", name: "Odia", native: "ଓଡ଼ିଆ" },
  { code: "as", name: "Assamese", native: "অসমীয়া" },
];

const LanguageSelection = () => {
  const { setLanguage } = useLanguage();
  const [selectedLang, setSelectedLang] = useState<string>("");
  const navigate = useNavigate();

  const handleLanguageSelect = (code: string) => {
    setSelectedLang(code);
    setLanguage(code as any);
    setTimeout(() => {
      navigate("/home");
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-accent/20 flex items-center justify-center p-6 animate-fade-in">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-12 animate-slide-up">
          <Globe className="w-20 h-20 mx-auto mb-4 text-primary animate-pulse-soft" />
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">
            Welcome to Kisan Smart
          </h1>
          <p className="text-lg text-muted-foreground">Select Your Language / अपनी भाषा चुनें</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {languages.map((lang, index) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageSelect(lang.code)}
              className={`
                relative p-6 rounded-3xl bg-card border-2 transition-all duration-300
                hover:scale-105 hover:shadow-glow active:scale-95
                ${selectedLang === lang.code ? "border-primary shadow-glow" : "border-border"}
              `}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {selectedLang === lang.code && (
                <div className="absolute top-2 right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <Check className="w-5 h-5 text-primary-foreground" />
                </div>
              )}
              <div className="text-center">
                <div className="text-3xl mb-2">🇮🇳</div>
                <h3 className="text-lg font-semibold text-card-foreground mb-1">{lang.native}</h3>
                <p className="text-sm text-muted-foreground">{lang.name}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LanguageSelection;
