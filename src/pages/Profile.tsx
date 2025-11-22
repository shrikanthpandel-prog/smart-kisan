import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, Mail, MapPin, Calendar, LogOut, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import { getCurrentUser, logout } from "@/services/auth.service";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    location: "",
  });

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      navigate("/login");
      return;
    }
    setUser(currentUser);
    setFormData({
      name: currentUser.name || "",
      email: currentUser.email || "",
      location: currentUser.location || "",
    });
  }, [navigate]);

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
    navigate("/login");
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    // TODO: Implement update profile API call
    toast({
      title: "Coming Soon",
      description: "Profile update feature will be available soon",
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      location: user?.location || "",
    });
    setIsEditing(false);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10 pb-20">
      <header className="p-4 flex items-center justify-between bg-card/50 backdrop-blur-sm border-b border-border sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/home")}>
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-xl font-bold">Profile</h1>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleLogout}
          className="text-destructive hover:text-destructive"
        >
          <LogOut className="w-6 h-6" />
        </Button>
      </header>

      <div className="p-6 max-w-md mx-auto space-y-6">
        {/* Profile Header */}
        <div className="bg-gradient-primary rounded-3xl p-8 text-center shadow-glow">
          <div className="w-24 h-24 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <User className="w-12 h-12 text-primary-foreground" />
          </div>
          <h2 className="text-2xl font-bold text-primary-foreground mb-1">
            {user.name}
          </h2>
          <p className="text-primary-foreground/80">{user.email}</p>
        </div>

        {/* Profile Details */}
        <div className="bg-card rounded-3xl p-6 border border-border shadow-card space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-foreground">Personal Information</h3>
            {!isEditing ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleEdit}
                className="text-primary"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            ) : null}
          </div>

          {/* Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <User className="w-4 h-4" />
              Full Name
            </label>
            {isEditing ? (
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="rounded-full"
              />
            ) : (
              <p className="text-foreground font-medium">{user.name}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email
            </label>
            <p className="text-foreground font-medium">{user.email}</p>
            <p className="text-xs text-muted-foreground">Email cannot be changed</p>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Location
            </label>
            {isEditing ? (
              <Input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Enter your location"
                className="rounded-full"
              />
            ) : (
              <p className="text-foreground font-medium">
                {user.location || "Not specified"}
              </p>
            )}
          </div>

          {/* Member Since */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Member Since
            </label>
            <p className="text-foreground font-medium">
              {user.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : "Recently joined"}
            </p>
          </div>

          {/* Edit Actions */}
          {isEditing && (
            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleSave}
                className="flex-1 rounded-full gradient-primary"
              >
                Save Changes
              </Button>
              <Button
                onClick={handleCancel}
                variant="outline"
                className="flex-1 rounded-full"
              >
                Cancel
              </Button>
            </div>
          )}
        </div>

        {/* Logout Button */}
        <Button
          onClick={handleLogout}
          variant="destructive"
          className="w-full rounded-full h-12 text-lg font-semibold"
        >
          <LogOut className="w-5 h-5 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Profile;
