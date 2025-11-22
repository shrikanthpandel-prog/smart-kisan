import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Cloud, Droplets, Wind, Sun, CloudRain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

const hourlyData = [
  { time: "Now", temp: 28, icon: Sun, rain: 0 },
  { time: "14:00", temp: 29, icon: Sun, rain: 0 },
  { time: "15:00", temp: 30, icon: Sun, rain: 10 },
  { time: "16:00", temp: 29, icon: Cloud, rain: 20 },
  { time: "17:00", temp: 27, icon: CloudRain, rain: 60 },
  { time: "18:00", temp: 26, icon: CloudRain, rain: 80 },
  { time: "19:00", temp: 25, icon: Cloud, rain: 40 },
  { time: "20:00", temp: 24, icon: Cloud, rain: 20 },
];

const dailyData = [
  { day: "monday", high: 30, low: 22, rain: 20, icon: Sun },
  { day: "tuesday", high: 29, low: 21, rain: 40, icon: Cloud },
  { day: "wednesday", high: 28, low: 20, rain: 60, icon: CloudRain },
  { day: "thursday", high: 27, low: 19, rain: 80, icon: CloudRain },
  { day: "friday", high: 28, low: 20, rain: 40, icon: Cloud },
  { day: "saturday", high: 29, low: 21, rain: 20, icon: Sun },
  { day: "sunday", high: 30, low: 22, rain: 10, icon: Sun },
];

const Weather = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"hourly" | "daily">("hourly");

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10 pb-20">
      <header className="p-4 flex items-center gap-4 bg-card/50 backdrop-blur-sm border-b border-border sticky top-0 z-10">
        <Button variant="ghost" size="icon" onClick={() => navigate("/home")}>
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <h1 className="text-xl font-bold">{t("weather")}</h1>
      </header>

      <div className="p-6 space-y-6">
        {/* Current Weather */}
        <div className="bg-gradient-primary rounded-3xl p-8 text-center shadow-glow">
          <div className="flex justify-center mb-4">
            <Sun className="w-24 h-24 text-primary-foreground animate-pulse" />
          </div>
          <h2 className="text-5xl font-bold text-primary-foreground mb-2">28°C</h2>
          <p className="text-primary-foreground/90 text-lg mb-4">{t("sunny")}</p>
          <div className="flex justify-center gap-8 text-primary-foreground/80">
            <div className="flex items-center gap-2">
              <Droplets className="w-5 h-5" />
              <span>65%</span>
            </div>
            <div className="flex items-center gap-2">
              <Wind className="w-5 h-5" />
              <span>12 km/h</span>
            </div>
          </div>
        </div>

        {/* Smart Tips */}
        <div className="bg-card rounded-3xl p-6 border border-border shadow-card">
          <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <Cloud className="w-5 h-5 text-primary" />
            {t("smartTips")}
          </h3>
          <div className="space-y-3">
            <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10">
              <p className="text-sm text-foreground">
                ☀️ {t("goodWeatherForIrrigation")}
              </p>
            </div>
            <div className="bg-accent/5 rounded-2xl p-4 border border-accent/10">
              <p className="text-sm text-foreground">
                🌧️ {t("rainExpectedTomorrow")}
              </p>
            </div>
            <div className="bg-success/5 rounded-2xl p-4 border border-success/10">
              <p className="text-sm text-foreground">
                🌱 {t("idealForPlanting")}
              </p>
            </div>
          </div>
        </div>

        {/* Forecast Tabs */}
        <div className="bg-card rounded-3xl p-6 border border-border shadow-card">
          <div className="flex gap-2 mb-6">
            <Button
              variant={activeTab === "hourly" ? "default" : "outline"}
              onClick={() => setActiveTab("hourly")}
              className="flex-1 rounded-full"
            >
              {t("hourly")}
            </Button>
            <Button
              variant={activeTab === "daily" ? "default" : "outline"}
              onClick={() => setActiveTab("daily")}
              className="flex-1 rounded-full"
            >
              {t("daily")}
            </Button>
          </div>

          {/* Hourly Forecast */}
          {activeTab === "hourly" && (
            <div className="space-y-3">
              {hourlyData.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl hover:bg-muted/50 transition-colors"
                >
                  <span className="text-sm font-medium text-foreground w-16">
                    {item.time}
                  </span>
                  <div className="flex items-center gap-3 flex-1 justify-center">
                    <item.icon className="w-6 h-6 text-primary" />
                    <span className="text-lg font-bold text-foreground">
                      {item.temp}°
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-info">
                    <Droplets className="w-4 h-4" />
                    <span className="text-sm font-medium w-12 text-right">
                      {item.rain}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Daily Forecast */}
          {activeTab === "daily" && (
            <div className="space-y-3">
              {dailyData.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl hover:bg-muted/50 transition-colors"
                >
                  <span className="text-sm font-medium text-foreground w-24 capitalize">
                    {t(item.day)}
                  </span>
                  <div className="flex items-center gap-3 flex-1 justify-center">
                    <item.icon className="w-6 h-6 text-primary" />
                    <div className="flex gap-2">
                      <span className="text-lg font-bold text-foreground">
                        {item.high}°
                      </span>
                      <span className="text-lg text-muted-foreground">
                        {item.low}°
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-info">
                    <Droplets className="w-4 h-4" />
                    <span className="text-sm font-medium w-12 text-right">
                      {item.rain}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Weather;
