import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Lightbulb, Sprout, Droplets, Bug, Sun, MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";

const SmartSuggestions = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState<Array<{ text: string; sender: "user" | "bot" }>>([
    { text: t("assistantGreeting"), sender: "bot" },
  ]);
  const [input, setInput] = useState("");

  const suggestions = [
    {
      id: 1,
      category: "Seasonal",
      title: t("smartSuggestions.wheatSowing.title"),
      description: t("smartSuggestions.wheatSowing.desc"),
      icon: Sun,
      color: "text-warning",
      bg: "bg-warning/10",
    },
    {
      id: 2,
      category: "Irrigation",
      title: t("smartSuggestions.waterConservation.title"),
      description: t("smartSuggestions.waterConservation.desc"),
      icon: Droplets,
      color: "text-info",
      bg: "bg-info/10",
    },
    {
      id: 3,
      category: "Pest Control",
      title: t("smartSuggestions.pestControl.title"),
      description: t("smartSuggestions.pestControl.desc"),
      icon: Bug,
      color: "text-destructive",
      bg: "bg-destructive/10",
    },
    {
      id: 4,
      category: "Soil Health",
      title: t("smartSuggestions.organicManure.title"),
      description: t("smartSuggestions.organicManure.desc"),
      icon: Sprout,
      color: "text-success",
      bg: "bg-success/10",
    },
  ];

  const sendMessage = () => {
    if (!input.trim()) return;

    setMessages([...messages, { text: input, sender: "user" }]);
    
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          text: "Thank you for your question! Based on current weather conditions, I recommend checking soil moisture before the next irrigation.",
          sender: "bot",
        },
      ]);
    }, 1000);

    setInput("");
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="p-4 flex items-center gap-4 bg-card border-b border-border sticky top-0 z-10">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <h1 className="text-xl font-bold">{t("smartTips")}</h1>
      </header>

      {!showChat ? (
        <div className="p-4">
          {/* Daily Tip Card */}
          <div className="bg-gradient-to-br from-primary to-accent rounded-3xl p-6 text-primary-foreground shadow-lg mb-8 animate-slide-up">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Lightbulb className="w-6 h-6 text-yellow-300" />
              </div>
              <h2 className="text-lg font-bold">{t("todaysTip")}</h2>
            </div>
            <p className="text-lg leading-relaxed opacity-90">
              {t("tipContent")}
            </p>
          </div>

          {/* Categories */}
          <div className="flex gap-3 overflow-x-auto pb-4 mb-4">
            {[t("seasonalTips"), t("cropAdvice"), t("soilHealth"), t("pestControl")].map((cat) => (
              <button
                key={cat}
                className="px-4 py-2 rounded-full bg-secondary text-secondary-foreground whitespace-nowrap text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Suggestions List */}
          <div className="space-y-4">
            {suggestions.map((item) => (
              <div key={item.id} className="bg-card p-5 rounded-3xl border border-border shadow-sm animate-slide-up">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${item.bg}`}>
                    <item.icon className={`w-6 h-6 ${item.color}`} />
                  </div>
                  <div>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${item.bg} ${item.color} mb-2 inline-block`}>
                      {item.category}
                    </span>
                    <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Chat Button */}
          <div className="fixed bottom-6 right-6 z-50">
            <Button
              onClick={() => setShowChat(true)}
              className="w-16 h-16 rounded-full shadow-glow gradient-primary animate-glow"
              size="icon"
            >
              <MessageCircle className="w-8 h-8" />
            </Button>
          </div>
        </div>
      ) : (
        /* Chat Interface */
        <div className="flex flex-col h-[calc(100vh-80px)]">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] p-4 rounded-3xl ${
                    msg.sender === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-card border border-border text-card-foreground"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <div className="p-4 border-t border-border bg-card/50 backdrop-blur-sm">
            <div className="flex gap-3">
              <Input
                placeholder={t("typeMessage")}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                className="rounded-full"
              />
              <Button onClick={sendMessage} size="icon" className="rounded-full gradient-primary">
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <Button
            onClick={() => setShowChat(false)}
            variant="outline"
            className="m-4 rounded-full"
          >
            Back to Suggestions
          </Button>
        </div>
      )}
    </div>
  );
};

export default SmartSuggestions;
