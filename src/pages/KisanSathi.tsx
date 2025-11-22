import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Users, Phone, MessageCircle, Video, Newspaper, Send, Mic, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import { chatWithGemini, isGeminiConfigured } from "@/services/gemini.service";
import { useToast } from "@/hooks/use-toast";

const KisanSathi = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Array<{ text: string; sender: "user" | "bot" }>>([
    { text: t("assistantGreeting"), sender: "bot" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const features = [
    {
      title: t("expertConsultation"),
      description: t("connectExperts"),
      icon: Phone,
      color: "bg-info/10 text-info",
    },
    {
      title: t("communityForum"),
      description: t("joinDiscussion"),
      icon: MessageCircle,
      color: "bg-success/10 text-success",
    },
    {
      title: t("videoTutorials"),
      description: t("learnFarming"),
      icon: Video,
      color: "bg-warning/10 text-warning",
    },
    {
      title: t("latestNews"),
      description: t("agricultureNews"),
      icon: Newspaper,
      color: "bg-accent/10 text-accent",
    },
  ];

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setMessages([...messages, { text: userMessage, sender: "user" }]);
    setInput("");
    setIsLoading(true);
    
    try {
      // Check if Gemini is configured
      if (!isGeminiConfigured()) {
        toast({
          title: "AI Not Configured",
          description: "Please add your Gemini API key in the configuration",
          variant: "destructive",
        });
        setMessages((prev) => [
          ...prev,
          {
            text: "AI service is not configured. Please contact support.",
            sender: "bot",
          },
        ]);
        setIsLoading(false);
        return;
      }

      // Call Gemini API
      const result = await chatWithGemini(messages, userMessage);
      
      setMessages((prev) => [
        ...prev,
        {
          text: result.response,
          sender: "bot",
        },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        {
          text: "I'm having trouble responding right now. Please try again.",
          sender: "bot",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-primary/10 flex flex-col">
      {/* Header */}
      <header className="p-4 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/home")}>
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-foreground">{t("kisanSathi")}</h1>
            <p className="text-sm text-muted-foreground">{t("farmingCompanion")}</p>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="p-6 text-center">
        <div className="w-24 h-24 mx-auto mb-4 bg-gradient-primary rounded-full flex items-center justify-center shadow-glow animate-pulse-soft">
          <Users className="w-12 h-12 text-primary-foreground" />
        </div>
        <h2 className="text-3xl font-bold text-foreground mb-2">
          {t("connectLearnGrow")}
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          {t("communityDescription")}
        </p>
      </div>

      {/* Features */}
      <div className="p-6 space-y-4">
        {features.map((feature, index) => (
          <button
            key={index}
            className="w-full bg-card rounded-3xl p-6 border border-border shadow-card hover:shadow-glow transition-all text-left"
          >
            <div className="flex items-start gap-4">
              <div className={`w-16 h-16 rounded-2xl ${feature.color} flex items-center justify-center`}>
                <feature.icon className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-foreground mb-1">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Chat Interface (Simplified for this page as it seems to be a landing page for the assistant features, but adding basic chat interaction as per previous code structure) */}
       <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length > 1 && messages.slice(1).map((msg, index) => (
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

      {/* CTA / Chat Input */}
      <div className="p-4 border-t border-border bg-card/50 backdrop-blur-sm sticky bottom-0">
         <div className="flex gap-2 items-center">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ImageIcon className="w-5 h-5 text-muted-foreground" />
          </Button>
          <Input
            placeholder={t("typeMessage")}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && !isLoading && sendMessage()}
            disabled={isLoading}
            className="rounded-full"
          />
          {input.trim() ? (
            <Button 
              onClick={sendMessage} 
              size="icon" 
              className="rounded-full gradient-primary"
              disabled={isLoading}
            >
              <Send className={`w-5 h-5 ${isLoading ? 'animate-pulse' : ''}`} />
            </Button>
          ) : (
            <Button variant="ghost" size="icon" className="rounded-full">
              <Mic className="w-5 h-5 text-muted-foreground" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default KisanSathi;
