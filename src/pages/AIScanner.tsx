import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Camera, Scan, Leaf, Bug, Droplets, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { classifyImage, processImageFile, loadModel, ScanResult } from "@/services/teachable-machine.service";
import { useToast } from "@/hooks/use-toast";

const scanModes = [
  { id: "crop", label: "Crop Disease", icon: Leaf, color: "bg-success" },
  { id: "soil", label: "Soil Quality", icon: Droplets, color: "bg-info" },
  { id: "weed", label: "Weed Detection", icon: Bug, color: "bg-warning" },
];

const AIScanner = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [selectedMode, setSelectedMode] = useState("crop");
  const [isScanning, setIsScanning] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load model on component mount
  useEffect(() => {
    const initModel = async () => {
      setIsModelLoading(true);
      try {
        await loadModel();
        toast({
          title: "AI Model Ready",
          description: "Your Teachable Machine model is loaded and ready to scan!",
        });
      } catch (error) {
        toast({
          title: "Model Loading Failed",
          description: error instanceof Error ? error.message : "Failed to load AI model",
          variant: "destructive",
        });
      } finally {
        setIsModelLoading(false);
      }
    };
    initModel();
  }, [toast]);

  const handleImageSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsScanning(true);
      setResult(null);

      // Display the image
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);

      // Process and classify the image with Teachable Machine
      const imageElement = await processImageFile(file);
      const scanResult = await classifyImage(imageElement);
      
      // Enhance with Gemini analysis if configured
      try {
        const { analyzeWithGemini, isGeminiConfigured } = await import("@/services/gemini.service");
        
        if (isGeminiConfigured()) {
          const geminiAnalysis = await analyzeWithGemini(
            scanResult.topPrediction.className,
            scanResult.topPrediction.probability
          );
          
          // Update result with Gemini's enhanced advice
          scanResult.treatment = geminiAnalysis.treatment;
          scanResult.prevention = geminiAnalysis.prevention;
        }
      } catch (geminiError) {
        console.log("Gemini enhancement skipped:", geminiError);
        // Continue with Teachable Machine results only
      }
      
      setResult(scanResult);
      
      toast({
        title: "Scan Complete",
        description: `Detected: ${scanResult.topPrediction.className}`,
      });
    } catch (error) {
      toast({
        title: "Scan Failed",
        description: error instanceof Error ? error.message : "Failed to analyze image",
        variant: "destructive",
      });
    } finally {
      setIsScanning(false);
    }
  };

  const handleScanClick = () => {
    fileInputRef.current?.click();
  };

  const handleReset = () => {
    setResult(null);
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10">
      {/* Header */}
      <header className="p-4 flex items-center gap-4 border-b border-border bg-card/50 backdrop-blur-sm">
        <Button variant="ghost" size="icon" onClick={() => navigate("/home")}>
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <div>
          <h1 className="text-xl font-bold text-foreground">{t("aiScanner")}</h1>
          <p className="text-sm text-muted-foreground">{t("scanCrop")}</p>
        </div>
      </header>

      {/* Mode Selector */}
      <div className="p-4">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {scanModes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => setSelectedMode(mode.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                selectedMode === mode.id
                  ? `${mode.color} text-white shadow-glow`
                  : "bg-card border border-border text-card-foreground"
              }`}
            >
              <mode.icon className="w-5 h-5" />
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      {/* Scanner View */}
      <div className="p-6">
        <div className="relative aspect-square max-w-md mx-auto bg-card rounded-3xl overflow-hidden border-2 border-primary shadow-glow">
          {/* Image display or camera placeholder */}
          {selectedImage ? (
            <div className="absolute inset-0">
              <img 
                src={selectedImage} 
                alt="Selected crop" 
                className="w-full h-full object-cover"
              />
              {!isScanning && (
                <button
                  onClick={handleReset}
                  className="absolute top-4 right-4 w-10 h-10 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <div className="text-center">
                <Camera className="w-24 h-24 text-muted-foreground/50 mx-auto mb-4" />
                <p className="text-muted-foreground">{t("uploadImage")}</p>
              </div>
            </div>
          )}

          {/* Scanning frame */}
          <div className="absolute inset-8 border-4 border-primary rounded-2xl pointer-events-none">
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-secondary rounded-tl-lg"></div>
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-secondary rounded-tr-lg"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-secondary rounded-bl-lg"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-secondary rounded-br-lg"></div>
          </div>

          {/* Scanning beam */}
          {isScanning && (
            <div className="absolute inset-8 overflow-hidden rounded-2xl">
              <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-secondary to-transparent animate-scan"></div>
            </div>
          )}

          {/* AI particles effect */}
          {isScanning && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-accent rounded-full animate-ping"></div>
              <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-secondary rounded-full animate-ping" style={{ animationDelay: "0.2s" }}></div>
              <div className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-primary rounded-full animate-ping" style={{ animationDelay: "0.4s" }}></div>
            </div>
          )}
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
          className="hidden"
        />

        {/* Scan Button */}
        {!result && (
          <div className="flex justify-center mt-8">
            <Button
              onClick={handleScanClick}
              disabled={isScanning || isModelLoading}
              className="w-full max-w-sm h-14 text-lg rounded-full gradient-primary shadow-glow"
            >
              {isModelLoading ? (
                <>
                  <Scan className="w-6 h-6 mr-2 animate-spin" />
                  Loading AI Model...
                </>
              ) : isScanning ? (
                <>
                  <Scan className="w-6 h-6 mr-2 animate-spin" />
                  {t("analyzing")}
                </>
              ) : (
                <>
                  <Upload className="w-6 h-6 mr-2" />
                  {t("uploadImage")}
                </>
              )}
            </Button>
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="mt-8 p-6 bg-card rounded-3xl border border-border shadow-card animate-slide-up">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground">{result.topPrediction.className}</h2>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2 text-foreground">{t("treatment")}</h3>
                <p className="text-muted-foreground leading-relaxed">{result.treatment}</p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2 text-foreground">{t("prevention")}</h3>
                <p className="text-muted-foreground leading-relaxed">{result.prevention}</p>
              </div>
            </div>
            <Button onClick={handleReset} className="w-full mt-6 rounded-full">
              Scan Another Image
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIScanner;
