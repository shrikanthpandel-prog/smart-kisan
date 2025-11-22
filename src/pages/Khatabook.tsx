import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";

interface Entry {
  id: string;
  type: "profit" | "loss" | "investment";
  title: string;
  amount: number;
  date: string;
}

const Khatabook = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [activeTab, setActiveTab] = useState<"profit" | "loss" | "investment">("profit");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: "", amount: "" });

  useEffect(() => {
    const saved = localStorage.getItem("kisanKhatabook");
    if (saved) {
      setEntries(JSON.parse(saved));
    }
  }, []);

  const saveEntry = () => {
    if (!formData.title || !formData.amount) return;

    const newEntry: Entry = {
      id: Date.now().toString(),
      type: activeTab,
      title: formData.title,
      amount: parseFloat(formData.amount),
      date: new Date().toLocaleDateString(),
    };

    const updated = [...entries, newEntry];
    setEntries(updated);
    localStorage.setItem("kisanKhatabook", JSON.stringify(updated));
    setFormData({ title: "", amount: "" });
    setShowForm(false);
  };

  const filteredEntries = entries.filter((e) => e.type === activeTab);

  const totals = {
    profit: entries.filter((e) => e.type === "profit").reduce((sum, e) => sum + e.amount, 0),
    loss: entries.filter((e) => e.type === "loss").reduce((sum, e) => sum + e.amount, 0),
    investment: entries.filter((e) => e.type === "investment").reduce((sum, e) => sum + e.amount, 0),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-warning/5 to-accent/10 pb-24">
      {/* Header */}
      <header className="p-4 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/home")}>
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-foreground">{t("khatabook")}</h1>
            <p className="text-sm text-muted-foreground">{t("balance")}</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-success/10 rounded-2xl p-3 text-center">
            <TrendingUp className="w-5 h-5 mx-auto mb-1 text-success" />
            <p className="text-xs text-muted-foreground">{t("credit")}</p>
            <p className="text-sm font-bold text-success">₹{totals.profit}</p>
          </div>
          <div className="bg-destructive/10 rounded-2xl p-3 text-center">
            <TrendingDown className="w-5 h-5 mx-auto mb-1 text-destructive" />
            <p className="text-xs text-muted-foreground">{t("debit")}</p>
            <p className="text-sm font-bold text-destructive">₹{totals.loss}</p>
          </div>
          <div className="bg-info/10 rounded-2xl p-3 text-center">
            <Wallet className="w-5 h-5 mx-auto mb-1 text-info" />
            <p className="text-xs text-muted-foreground">{t("balance")}</p>
            <p className="text-sm font-bold text-info">₹{totals.investment}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {(["profit", "loss", "investment"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 rounded-full text-sm font-semibold transition-all ${
                activeTab === tab
                  ? "bg-primary text-primary-foreground shadow-glow"
                  : "bg-card text-muted-foreground border border-border"
              }`}
            >
              {tab === "profit" && t("credit")}
              {tab === "loss" && t("debit")}
              {tab === "investment" && t("balance")}
            </button>
          ))}
        </div>
      </header>

      {/* Entries */}
      <div className="p-6 space-y-3">
        {filteredEntries.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">{t("noEntriesYet")}</p>
          </div>
        ) : (
          filteredEntries.map((entry) => (
            <div
              key={entry.id}
              className="bg-card rounded-3xl p-5 border border-border shadow-card flex items-center justify-between"
            >
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-1">{entry.title}</h3>
                <p className="text-sm text-muted-foreground">{entry.date}</p>
              </div>
              <div className="text-right">
                <p
                  className={`text-2xl font-bold ${
                    entry.type === "profit"
                      ? "text-success"
                      : entry.type === "loss"
                      ? "text-destructive"
                      : "text-info"
                  }`}
                >
                  ₹{entry.amount}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setShowForm(!showForm)}
          className="w-16 h-16 rounded-full shadow-glow gradient-primary"
          size="icon"
        >
          <Plus className="w-8 h-8" />
        </Button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end justify-center z-50 p-4">
          <div className="bg-card rounded-t-3xl p-6 w-full max-w-md animate-slide-up">
            <h3 className="text-xl font-bold mb-4">{t("addTransaction")}</h3>
            <Input
              placeholder={t("description")}
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="mb-3 rounded-2xl"
            />
            <Input
              type="number"
              placeholder={t("amount")}
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="mb-4 rounded-2xl"
            />
            <div className="flex gap-3">
              <Button onClick={() => setShowForm(false)} variant="outline" className="flex-1 rounded-full">
                Cancel
              </Button>
              <Button onClick={saveEntry} className="flex-1 rounded-full gradient-primary">
                Save
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Khatabook;
