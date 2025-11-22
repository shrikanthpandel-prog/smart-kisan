/**
 * Teachable Machine Configuration
 * 
 * Configure your Teachable Machine model here
 */

export const TEACHABLE_MACHINE_CONFIG = {
  // 👇 YOUR TEACHABLE MACHINE MODEL URL
  modelURL: "https://teachablemachine.withgoogle.com/models/0NVieGiBn/",
  
  // Automatically generated paths (don't change these)
  get modelJsonURL() {
    return `${this.modelURL}model.json`;
  },
  get metadataURL() {
    return `${this.modelURL}metadata.json`;
  },
  
  // Confidence threshold (0.0 - 1.0)
  confidenceThreshold: 0.5,
};
