import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, TrendingUp, TrendingDown, Search, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";

const marketData = [
  { crop: "wheat", buying: 2150, selling: 2400, trend: "up", change: 5.2, location: "Punjab" },
  { crop: "rice", buying: 3100, selling: 3500, trend: "up", change: 3.8, location: "West Bengal" },
  { crop: "corn", buying: 1850, selling: 2100, trend: "down", change: -2.1, location: "Karnataka" },
  { crop: "potato", buying: 850, selling: 1100, trend: "up", change: 8.5, location: "Uttar Pradesh" },
  { crop: "tomato", buying: 1200, selling: 1650, trend: "down", change: -4.3, location: "Maharashtra" },
  { crop: "onion", buying: 950, selling: 1300, trend: "up", change: 6.7, location: "Maharashtra" },
  { crop: "cotton", buying: 5800, selling: 6200, trend: "up", change: 2.4, location: "Gujarat" },
  { crop: "sugarcane", buying: 280, selling: 320, trend: "down", change: -1.8, location: "Uttar Pradesh" },
];

const MarketPrice = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<string>("all");

  // Get unique locations
  const locations = ["all", ...Array.from(new Set(marketData.map(item => item.location)))];

  const filteredData = marketData.filter((item) =>
    t(`crops.${item.crop}` as any).toLowerCase().includes(search.toLowerCase()) &&
    (selectedLocation === "all" || item.location === selectedLocation)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-success/5 to-accent/10">
      {/* Header */}
      <header className="p-4 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/home")}>
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-2xl font-bold text-primary">{t('marketPrice')}</h1>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            className="pl-10 bg-background/50 backdrop-blur-sm"
            placeholder={t('marketPrice') + "..."} 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Location Filter */}
        <div className="flex items-center gap-2 mb-2">
          <MapPin className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">{t("location") || "Location"}</span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {locations.map((location) => (
            <button
              key={location}
              onClick={() => setSelectedLocation(location)}
              className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all ${
                selectedLocation === location
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {location === "all" ? t("allLocations") || "All Locations" : location}
            </button>
          ))}
        </div>
      </header>

      {/* Market List */}
      <div className="p-4 space-y-4">
        {filteredData.map((item, index) => (
          <div
            key={index}
            className="bg-card/50 backdrop-blur-sm p-4 rounded-xl border border-border shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  {t(`crops.${item.crop}` as any)}
                </h3>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                  <MapPin className="w-3 h-3" />
                  {item.location}
                </div>
                <div className="flex items-center gap-2">
                  {item.trend === "up" ? (
                    <TrendingUp className="w-5 h-5 text-success" />
                  ) : (
                    <TrendingDown className="w-5 h-5 text-destructive" />
                  )}
                  <span
                    className={`text-sm font-semibold ${
                      item.trend === "up" ? "text-success" : "text-destructive"
                    }`}
                  >
                    {item.change > 0 ? "+" : ""}
                    {item.change}%
                  </span>
                </div>
              </div>
              <div className="text-5xl">
                {item.crop === "wheat" && "🌾"}
                {item.crop === "rice" && "🍚"}
                {item.crop === "corn" && "🌽"}
                {item.crop === "potato" && "🥔"}
                {item.crop === "tomato" && "🍅"}
                {item.crop === "onion" && "🧅"}
                {item.crop === "cotton" && "🌿"}
                {item.crop === "sugarcane" && "🎋"}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-success/10 rounded-2xl p-4">
                <p className="text-sm text-muted-foreground mb-1">Buying Price</p>
                <p className="text-2xl font-bold text-success">₹{item.buying}</p>
                <p className="text-xs text-muted-foreground">per quintal</p>
              </div>
              <div className="bg-info/10 rounded-2xl p-4">
                <p className="text-sm text-muted-foreground mb-1">Selling Price</p>
                <p className="text-2xl font-bold text-info">₹{item.selling}</p>
                <p className="text-xs text-muted-foreground">per quintal</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketPrice;
