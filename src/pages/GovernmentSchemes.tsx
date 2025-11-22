import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Building2, FileText, CheckCircle2, ExternalLink, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { API_CONFIG } from "@/config/api.config";
import api from "@/services/api.service";

interface Scheme {
  _id: string;
  schemeName: string;
  category: string;
  description: string;
  eligibility: string[];
  benefits: string[];
  documents: string[];
  applicationLink: string;
  state: string | null;
}

const GovernmentSchemes = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);

  const categories = [
    { value: "all", label: "All Schemes", icon: Building2 },
    { value: "subsidy", label: "Subsidies", icon: FileText },
    { value: "insurance", label: "Insurance", icon: CheckCircle2 },
    { value: "loan", label: "Loans", icon: FileText },
    { value: "training", label: "Training", icon: FileText },
    { value: "equipment", label: "Equipment", icon: FileText },
  ];

  useEffect(() => {
    fetchSchemes();
  }, [selectedCategory]);

  const fetchSchemes = async () => {
    try {
      setLoading(true);
      const params = selectedCategory !== "all" ? `?category=${selectedCategory}` : "";
      const response = await api.get(`${API_CONFIG.baseURL}/schemes${params}`);
      setSchemes(response.data);
    } catch (error) {
      console.error("Error fetching schemes:", error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      subsidy: "text-success bg-success/10 border-success/20",
      insurance: "text-info bg-info/10 border-info/20",
      loan: "text-warning bg-warning/10 border-warning/20",
      training: "text-accent bg-accent/10 border-accent/20",
      equipment: "text-primary bg-primary/10 border-primary/20",
    };
    return colors[category] || "text-muted-foreground bg-muted/10 border-muted/20";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10 pb-20">
      <header className="p-4 flex items-center gap-4 bg-card/50 backdrop-blur-sm border-b border-border sticky top-0 z-10">
        <Button variant="ghost" size="icon" onClick={() => navigate("/home")}>
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <div>
          <h1 className="text-xl font-bold">{t("governmentSchemes")}</h1>
          <p className="text-sm text-muted-foreground">{t("schemesSubtitle")}</p>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* Category Filter */}
        <div className="bg-card rounded-3xl p-4 border border-border shadow-card">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">{t("filterByCategory")}</h3>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <Button
                key={cat.value}
                variant={selectedCategory === cat.value ? "default" : "outline"}
                onClick={() => setSelectedCategory(cat.value)}
                className="rounded-full whitespace-nowrap"
                size="sm"
              >
                {cat.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Schemes List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">{t("loadingSchemes")}</p>
          </div>
        ) : schemes.length === 0 ? (
          <div className="text-center py-12">
            <Building2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">{t("noSchemesFound")}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {schemes.map((scheme) => (
              <div
                key={scheme._id}
                className="bg-card rounded-3xl p-6 border border-border shadow-card hover:shadow-glow transition-all cursor-pointer"
                onClick={() => setSelectedScheme(scheme)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-foreground mb-2">
                      {scheme.schemeName}
                    </h3>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(
                        scheme.category
                      )}`}
                    >
                      {scheme.category.toUpperCase()}
                    </span>
                  </div>
                  <Building2 className="w-8 h-8 text-primary" />
                </div>

                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {scheme.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-muted-foreground">
                      {scheme.benefits.length} {t("benefits")}
                    </span>
                    <span className="text-muted-foreground">
                      {scheme.documents.length} {t("documentsRequired")}
                    </span>
                  </div>
                  <Button size="sm" className="rounded-full">
                    {t("viewDetails")}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Scheme Detail Modal */}
      {selectedScheme && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
          onClick={() => setSelectedScheme(null)}
        >
          <div
            className="bg-card rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between">
              <h2 className="font-bold text-xl">{selectedScheme.schemeName}</h2>
              <Button variant="ghost" size="icon" onClick={() => setSelectedScheme(null)}>
                <ArrowLeft className="w-6 h-6" />
              </Button>
            </div>

            <div className="p-6 space-y-6">
              {/* Description */}
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  {t("description")}
                </h3>
                <p className="text-muted-foreground">{selectedScheme.description}</p>
              </div>

              {/* Eligibility */}
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-success" />
                  {t("eligibility")}
                </h3>
                <ul className="space-y-2">
                  {selectedScheme.eligibility.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-success mt-1">•</span>
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Benefits */}
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-info" />
                  {t("benefits")}
                </h3>
                <ul className="space-y-2">
                  {selectedScheme.benefits.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-info mt-1">•</span>
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Documents Required */}
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-warning" />
                  {t("documentsRequired")}
                </h3>
                <ul className="space-y-2">
                  {selectedScheme.documents.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-warning mt-1">•</span>
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Apply Button */}
              <a
                href={selectedScheme.applicationLink}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Button className="w-full rounded-full h-12 text-lg gradient-primary">
                  <ExternalLink className="w-5 h-5 mr-2" />
                  {t("applyNow")}
                </Button>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GovernmentSchemes;
