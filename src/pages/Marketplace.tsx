// Marketplace page with sell (crop) and buy (supplies) listings
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingBag, Phone, MessageCircle, MapPin, Search, Filter, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

// Listings data
const listings = [
  // Crop sell entries (farmers selling crops)
  {
    id: 1,
    crop: "wheat",
    quantity: "500 kg",
    price: 2400,
    location: "Bangalore Rural",
    seller: "Ramesh Kumar",
    phone: "+91 98765 43210",
    type: "sell",
  },
  {
    id: 2,
    crop: "rice",
    quantity: "1000 kg",
    price: 3500,
    location: "Mysore",
    seller: "Suresh Patil",
    phone: "+91 98765 43211",
    type: "sell",
  },
  {
    id: 3,
    crop: "corn",
    quantity: "300 kg",
    price: 2100,
    location: "Mandya",
    seller: "Prakash M",
    phone: "+91 98765 43212",
    type: "sell",
  },
  // Supply buy entries (fertilizers, pesticides, equipment, services)
  {
    id: 4,
    product: "Urea Fertilizer",
    quantity: "1000 kg",
    price: 5000,
    location: "Hubli",
    seller: "Agri Supplies Co.",
    phone: "+91 98765 43213",
    type: "buy",
    category: "fertilizer",
  },
  {
    id: 5,
    product: "Pesticide - Neem Oil",
    quantity: "200 L",
    price: 3000,
    location: "Mangalore",
    seller: "Green Protect Ltd.",
    phone: "+91 98765 43214",
    type: "buy",
    category: "pesticide",
  },
  {
    id: 6,
    product: "Tractor Model X",
    quantity: "1",
    price: 850000,
    location: "Belgaum",
    seller: "Machinery Rentals Inc.",
    phone: "+91 98765 43215",
    type: "buy",
    category: "machinery",
  },
  {
    id: 7,
    product: "Plough Rental",
    quantity: "1",
    price: 1500,
    location: "Gulbarga",
    seller: "Equipment Rentals Pvt.",
    phone: "+91 98765 43216",
    type: "buy",
    category: "equipment",
  },
  {
    id: 8,
    product: "Organic Compost",
    quantity: "500 kg",
    price: 1200,
    location: "Chitradurga",
    seller: "Eco Farms",
    phone: "+91 98765 43217",
    type: "buy",
    category: "fertilizer",
  },
  {
    id: 9,
    product: "Drip Irrigation Kit",
    quantity: "1 set",
    price: 7500,
    location: "Davanagere",
    seller: "AquaTech Solutions",
    phone: "+91 98765 43218",
    type: "buy",
    category: "equipment",
  },
  {
    id: 10,
    product: "Farm Labor",
    quantity: "1 day",
    price: 800,
    location: "Kolar",
    seller: "Rural Workforce",
    phone: "+91 98765 43219",
    type: "buy",
    category: "service",
  },
];

const Marketplace = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"buy" | "sell">("sell");
  const [search, setSearch] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<string>("all");

  // Unique locations for filter dropdown
  const locations = ["all", ...Array.from(new Set(listings.map((item) => item.location)))];

  const filteredListings = listings.filter((item) => {
    const title = item.crop || item.product || "";
    const searchMatch =
      title.toLowerCase().includes(search.toLowerCase()) ||
      (item.location && item.location.toLowerCase().includes(search.toLowerCase()));
    const locationMatch = selectedLocation === "all" || item.location === selectedLocation;
    const typeMatch = item.type === activeTab;
    return searchMatch && locationMatch && typeMatch;
  });

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="p-4 flex items-center gap-4 bg-card border-b border-border sticky top-0 z-10">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <h1 className="text-xl font-bold">{t("marketplace")}</h1>
      </header>

      <div className="p-4">
        {/* Search and Location Filter */}
        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder={t("itemName")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 pl-9 pr-4 rounded-full border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        {/* Location Filter */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">{t("location") || "Location"}</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
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
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab("sell")}
            className={`flex-1 py-3 rounded-full font-semibold transition-all ${
              activeTab === "sell" ? "bg-primary text-primary-foreground shadow-lg" : "bg-secondary text-muted-foreground"
            }`}
          >
            {t("sell")}
          </button>
          <button
            onClick={() => setActiveTab("buy")}
            className={`flex-1 py-3 rounded-full font-semibold transition-all ${
              activeTab === "buy" ? "bg-primary text-primary-foreground shadow-lg" : "bg-secondary text-muted-foreground"
            }`}
          >
            {t("buy")}
          </button>
        </div>

        {/* Listings */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredListings.map((item) => (
            <div key={item.id} className="border rounded-lg p-4 shadow-sm bg-card">
              <h3 className="font-semibold text-lg mb-2">
                {item.crop || item.product}
              </h3>
              <p>{t("quantity")}: {item.quantity}</p>
              <p>{t("price")}: ₹{item.price}</p>
              <p>{t("location")}: {item.location}</p>
              <p>{t("seller")}: {item.seller}</p>
              <p>{t("contact")}: {item.phone}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
