import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Plus, CheckCircle2, Clock, Sprout } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { API_CONFIG } from "@/config/api.config";
import api from "@/services/api.service";

interface Reminder {
  _id: string;
  type: string;
  date: string;
  message: string;
  completed: boolean;
}

interface CropSchedule {
  _id: string;
  crop: string;
  plantingDate: string;
  harvestDate: string;
  location: string;
  status: string;
  reminders: Reminder[];
}

const CropCalendar = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [schedules, setSchedules] = useState<CropSchedule[]>([]);
  const [upcomingReminders, setUpcomingReminders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    crop: "",
    plantingDate: "",
    harvestDate: "",
    location: "",
  });

  useEffect(() => {
    fetchSchedules();
    fetchUpcomingReminders();
  }, []);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const response = await api.get(`${API_CONFIG.baseURL}/calendar`);
      setSchedules(response.data);
    } catch (error: any) {
      console.error("Error fetching schedules:", error);
      if (error.response?.status === 401) {
        toast({
          title: "Please login",
          description: "You need to login to view crop calendar",
          variant: "destructive",
        });
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchUpcomingReminders = async () => {
    try {
      const response = await api.get(`${API_CONFIG.baseURL}/calendar/upcoming`);
      setUpcomingReminders(response.data);
    } catch (error) {
      console.error("Error fetching reminders:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post(`${API_CONFIG.baseURL}/calendar`, formData);
      toast({
        title: "Success",
        description: "Crop schedule created with auto-generated reminders!",
      });
      setShowAddForm(false);
      setFormData({ crop: "", plantingDate: "", harvestDate: "", location: "" });
      fetchSchedules();
      fetchUpcomingReminders();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create crop schedule",
        variant: "destructive",
      });
    }
  };

  const markReminderComplete = async (calendarId: string, reminderId: string) => {
    try {
      await api.patch(`${API_CONFIG.baseURL}/calendar/${calendarId}/reminder/${reminderId}`, {
        completed: true,
      });
      toast({
        title: "Reminder completed",
        description: "Great job staying on schedule!",
      });
      fetchSchedules();
      fetchUpcomingReminders();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update reminder",
        variant: "destructive",
      });
    }
  };

  const getReminderIcon = (type: string) => {
    const icons: Record<string, any> = {
      planting: Sprout,
      irrigation: "💧",
      fertilizer: "🌱",
      pesticide: "🐛",
      harvest: "🌾",
    };
    return icons[type] || Clock;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      planned: "text-muted-foreground bg-muted/10",
      planted: "text-info bg-info/10",
      growing: "text-success bg-success/10",
      harvested: "text-warning bg-warning/10",
    };
    return colors[status] || "text-muted-foreground bg-muted/10";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10 pb-20">
      <header className="p-4 flex items-center justify-between bg-card/50 backdrop-blur-sm border-b border-border sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/home")}>
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div>
            <h1 className="text-xl font-bold">{t("cropCalendar")}</h1>
            <p className="text-sm text-muted-foreground">{t("calendarSubtitle")}</p>
          </div>
        </div>
        <Button onClick={() => setShowAddForm(true)} className="rounded-full">
          <Plus className="w-5 h-5 mr-2" />
          {t("addCrop")}
        </Button>
      </header>

      <div className="p-6 space-y-6">
        {/* Upcoming Reminders */}
        {upcomingReminders.length > 0 && (
          <div className="bg-gradient-primary rounded-3xl p-6 shadow-glow">
            <h3 className="font-bold text-lg text-primary-foreground mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              {t("upcomingReminders")}
            </h3>
            <div className="space-y-3">
              {upcomingReminders.slice(0, 3).map((reminder: any) => (
                <div
                  key={reminder._id}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getReminderIcon(reminder.type)}</span>
                    <div>
                      <p className="font-medium text-primary-foreground">{reminder.message}</p>
                      <p className="text-sm text-primary-foreground/70">
                        {new Date(reminder.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => markReminderComplete(reminder.calendarId, reminder._id)}
                    className="rounded-full"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Crop Schedules */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">{t("loadingSchedules")}</p>
          </div>
        ) : schedules.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">{t("noSchedules")}</p>
            <Button onClick={() => setShowAddForm(true)} className="rounded-full">
              <Plus className="w-5 h-5 mr-2" />
              {t("addFirstCrop")}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {schedules.map((schedule) => (
              <div
                key={schedule._id}
                className="bg-card rounded-3xl p-6 border border-border shadow-card"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-lg text-foreground mb-2">
                      {schedule.crop}
                    </h3>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        schedule.status
                      )}`}
                    >
                      {schedule.status.toUpperCase()}
                    </span>
                  </div>
                  <Sprout className="w-8 h-8 text-success" />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">{t("plantingDate")}</p>
                    <p className="font-medium">
                      {new Date(schedule.plantingDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">{t("harvestDate")}</p>
                    <p className="font-medium">
                      {new Date(schedule.harvestDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <p className="text-sm font-medium mb-2">{t("reminders")} ({schedule.reminders.length})</p>
                  <div className="space-y-2">
                    {schedule.reminders.slice(0, 3).map((reminder) => (
                      <div
                        key={reminder._id}
                        className={`flex items-center justify-between p-2 rounded-lg ${
                          reminder.completed ? "bg-success/10" : "bg-muted/30"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {reminder.completed ? (
                            <CheckCircle2 className="w-4 h-4 text-success" />
                          ) : (
                            <Clock className="w-4 h-4 text-muted-foreground" />
                          )}
                          <span className="text-sm">{reminder.message}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(reminder.date).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Crop Form Modal */}
      {showAddForm && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
          onClick={() => setShowAddForm(false)}
        >
          <div
            className="bg-card rounded-3xl max-w-md w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-border">
              <h2 className="font-bold text-xl">{t("addCropSchedule")}</h2>
              <p className="text-sm text-muted-foreground">
                {t("remindersAutoGenerated")}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">{t("cropName")}</label>
                <Input
                  type="text"
                  placeholder="e.g., Wheat, Rice, Tomato"
                  value={formData.crop}
                  onChange={(e) => setFormData({ ...formData, crop: e.target.value })}
                  required
                  className="rounded-full"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">{t("plantingDate")}</label>
                <Input
                  type="date"
                  value={formData.plantingDate}
                  onChange={(e) => setFormData({ ...formData, plantingDate: e.target.value })}
                  required
                  className="rounded-full"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">{t("harvestDate")}</label>
                <Input
                  type="date"
                  value={formData.harvestDate}
                  onChange={(e) => setFormData({ ...formData, harvestDate: e.target.value })}
                  required
                  className="rounded-full"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">{t("locationOptional")}</label>
                <Input
                  type="text"
                  placeholder="e.g., North Field"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="rounded-full"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  className="flex-1 rounded-full gradient-primary"
                >
                  {t("createSchedule")}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 rounded-full"
                >
                  {t("cancel")}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CropCalendar;
