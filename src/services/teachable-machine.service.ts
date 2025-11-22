import * as tmImage from "@teachablemachine/image";
import { TEACHABLE_MACHINE_CONFIG } from "@/config/teachable-machine.config";

/**
 * Teachable Machine Service
 * Handles image classification using your trained model
 */

export interface ClassificationResult {
  className: string;
  probability: number;
}

export interface ScanResult {
  topPrediction: ClassificationResult;
  allPredictions: ClassificationResult[];
  confidence: string;
  severity: string;
  treatment: string;
  prevention: string;
}

let model: tmImage.CustomMobileNet | null = null;

/**
 * Load the Teachable Machine model
 */
export async function loadModel(): Promise<void> {
  if (model) return; // Already loaded

  try {
    const modelURL = TEACHABLE_MACHINE_CONFIG.modelJsonURL;
    const metadataURL = TEACHABLE_MACHINE_CONFIG.metadataURL;
    
    model = await tmImage.load(modelURL, metadataURL);
    console.log("Teachable Machine model loaded successfully");
  } catch (error) {
    console.error("Error loading Teachable Machine model:", error);
    throw new Error("Failed to load AI model. Please check your internet connection.");
  }
}

/**
 * Classify an image using the Teachable Machine model
 * @param imageElement - HTML Image element to classify
 */
export async function classifyImage(imageElement: HTMLImageElement): Promise<ScanResult> {
  if (!model) {
    await loadModel();
  }

  if (!model) {
    throw new Error("Model not loaded");
  }

  try {
    const predictions = await model.predict(imageElement);
    
    // Log all predictions for debugging
    console.log("=== TEACHABLE MACHINE PREDICTIONS ===");
    predictions.forEach((pred, idx) => {
      console.log(`${idx + 1}. ${pred.className}: ${(pred.probability * 100).toFixed(2)}%`);
    });
    console.log("=====================================");
    
    // Sort predictions by probability
    const sortedPredictions = predictions
      .map(p => ({
        className: p.className,
        probability: p.probability,
      }))
      .sort((a, b) => b.probability - a.probability);

    const topPrediction = sortedPredictions[0];
    const confidence = `${Math.round(topPrediction.probability * 100)}%`;
    
    console.log(`Top Prediction: ${topPrediction.className} (${confidence})`);
    
    // Determine severity based on confidence
    let severity = "Low";
    if (topPrediction.probability > 0.8) {
      severity = "High";
    } else if (topPrediction.probability > 0.6) {
      severity = "Medium";
    }

    // Generate treatment and prevention based on the detected class
    const { treatment, prevention } = generateAdvice(topPrediction.className);

    return {
      topPrediction,
      allPredictions: sortedPredictions,
      confidence,
      severity,
      treatment,
      prevention,
    };
  } catch (error) {
    console.error("Error classifying image:", error);
    throw new Error("Failed to analyze image. Please try again.");
  }
}

/**
 * Generate treatment and prevention advice based on detected disease/condition
 */
function generateAdvice(className: string): { treatment: string; prevention: string } {
  // You can customize these based on your model's classes
  const adviceMap: Record<string, { treatment: string; prevention: string }> = {
    "Healthy": {
      treatment: "No treatment needed. Your crop appears healthy!",
      prevention: "Continue regular monitoring and maintain good agricultural practices.",
    },
    "Leaf Blight": {
      treatment: "Apply copper-based fungicide. Remove affected leaves immediately.",
      prevention: "Ensure proper spacing between plants for air circulation. Avoid overhead watering.",
    },
    "Rust": {
      treatment: "Use sulfur-based fungicide. Prune infected areas.",
      prevention: "Plant resistant varieties. Maintain field hygiene.",
    },
    "Powdery Mildew": {
      treatment: "Apply neem oil or potassium bicarbonate solution.",
      prevention: "Improve air circulation. Water in the morning to allow leaves to dry.",
    },
    // Add more disease-specific advice based on your model's classes
  };

  // Default advice if class not found in map
  const defaultAdvice = {
    treatment: `Detected: ${className}. Consult with a local agricultural expert for specific treatment recommendations.`,
    prevention: "Regular monitoring, proper irrigation, and maintaining field hygiene are essential preventive measures.",
  };

  return adviceMap[className] || defaultAdvice;
}

/**
 * Process image file and convert to HTMLImageElement
 */
export async function processImageFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = e.target?.result as string;
    };
    
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}
