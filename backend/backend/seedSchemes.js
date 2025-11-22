require('dotenv').config();
const mongoose = require('mongoose');
const GovernmentScheme = require('./src/models/GovernmentScheme');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/farmerdb';

const schemes = [
  {
    schemeName: "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)",
    category: "subsidy",
    description: "Direct income support of ₹6000 per year to all farmer families across the country in three equal installments of ₹2000 each every four months.",
    eligibility: [
      "Small and marginal farmers",
      "Land ownership proof required",
      "Valid Aadhaar card",
      "Bank account linked to Aadhaar"
    ],
    benefits: [
      "₹6000 per year direct bank transfer",
      "₹2000 every 4 months",
      "No middleman involved",
      "Covers all farmer families"
    ],
    documents: [
      "Aadhaar card",
      "Bank account details",
      "Land ownership records",
      "Passport size photograph"
    ],
    applicationLink: "https://pmkisan.gov.in/",
    state: null,
    active: true
  },
  {
    schemeName: "PMFBY (Pradhan Mantri Fasal Bima Yojana)",
    category: "insurance",
    description: "Comprehensive crop insurance scheme providing financial support to farmers suffering crop loss/damage arising out of unforeseen events.",
    eligibility: [
      "All farmers growing notified crops",
      "Sharecroppers and tenant farmers",
      "Compulsory for loanee farmers"
    ],
    benefits: [
      "Maximum 2% premium for Kharif crops",
      "1.5% for Rabi crops",
      "5% for commercial/horticultural crops",
      "Coverage for natural calamities, pests & diseases"
    ],
    documents: [
      "Aadhaar card",
      "Bank account details",
      "Land records",
      "Sowing certificate",
      "Loan sanction letter (if applicable)"
    ],
    applicationLink: "https://pmfby.gov.in/",
    state: null,
    active: true
  },
  {
    schemeName: "Kisan Credit Card (KCC)",
    category: "loan",
    description: "Credit facility for farmers to meet their agricultural needs including cultivation, post-harvest expenses, and consumption requirements.",
    eligibility: [
      "All farmers - individual/joint borrowers",
      "Tenant farmers, oral lessees & sharecroppers",
      "Self Help Groups or Joint Liability Groups"
    ],
    benefits: [
      "Interest subvention of 2%",
      "Additional 3% interest subvention on prompt repayment",
      "Effective interest rate of 4% per annum",
      "Flexible repayment terms"
    ],
    documents: [
      "Aadhaar card",
      "PAN card",
      "Land ownership documents",
      "Passport size photographs",
      "Address proof"
    ],
    applicationLink: "https://www.india.gov.in/spotlight/kisan-credit-card-kcc",
    state: null,
    active: true
  },
  {
    schemeName: "Soil Health Card Scheme",
    category: "training",
    description: "Provides soil health cards to farmers which carry crop-wise recommendations of nutrients and fertilizers required for individual farms.",
    eligibility: [
      "All farmers",
      "Land ownership or cultivation proof"
    ],
    benefits: [
      "Free soil testing",
      "Customized fertilizer recommendations",
      "Improved soil health",
      "Increased productivity"
    ],
    documents: [
      "Aadhaar card",
      "Land records",
      "Contact details"
    ],
    applicationLink: "https://soilhealth.dac.gov.in/",
    state: null,
    active: true
  },
  {
    schemeName: "National Agriculture Market (e-NAM)",
    category: "subsidy",
    description: "Pan-India electronic trading portal which networks the existing APMC mandis to create a unified national market for agricultural commodities.",
    eligibility: [
      "All farmers",
      "Registered traders",
      "Commission agents"
    ],
    benefits: [
      "Better price discovery",
      "Transparent auction process",
      "Online payment",
      "Access to more buyers"
    ],
    documents: [
      "Aadhaar card",
      "Bank account details",
      "Mobile number"
    ],
    applicationLink: "https://www.enam.gov.in/",
    state: null,
    active: true
  },
  {
    schemeName: "PM Kusum (Solar Pump Scheme)",
    category: "equipment",
    description: "Provides financial support for installation of solar pumps and grid connected solar power plants in rural areas.",
    eligibility: [
      "Individual farmers",
      "Group of farmers/FPOs/Panchayats",
      "Cooperative societies"
    ],
    benefits: [
      "60% subsidy from government",
      "30% loan from banks",
      "Only 10% farmer contribution",
      "Reduced electricity costs"
    ],
    documents: [
      "Aadhaar card",
      "Land ownership documents",
      "Bank account details",
      "Electricity bill"
    ],
    applicationLink: "https://pmkusum.mnre.gov.in/",
    state: null,
    active: true
  }
];

async function seedSchemes() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('Connected to MongoDB');
    
    // Clear existing schemes
    await GovernmentScheme.deleteMany({});
    console.log('Cleared existing schemes');
    
    // Insert new schemes
    await GovernmentScheme.insertMany(schemes);
    console.log(`Inserted ${schemes.length} government schemes`);
    
    console.log('Seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seedSchemes();
