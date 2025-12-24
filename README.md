# BreastCancerPredictionSystemNextJS
BreastCancerPredictionSystemNextJS is a full‑stack web application for managing patients, capturing clinical data, running an automated breast cancer risk prediction, and generating medical reports (PDF).

 ## Overview
 
- A Next.js (App Router) web app (UI + API routes) connected to MongoDB for users/patients/clinical data.
- A Flask API that loads a trained ML model and exposes a prediction endpoint.

## Features

- Authentication (JWT): login/register with role-based access (gynécologue / patiente)
- Patient management: create/list/update/delete patient profiles (linked to a gynécologue)
- Clinical data management: create/list/update clinical measurements for a patient
- Automatic prediction: sends features to Flask /api/predict and displays the result
- Reports: list reports and download a generated PDF report per clinical record

  
```
 📁 BreastCancerPredictionSystemNextJS
├─ 📝 README.md                          # Project documentation (root)
├─ 📝 package.json                       # Root dependencies/scripts
├─ 📝 package-lock.json                  # Lockfile
├─ 📂 node_modules                       # Node dependencies (local)
│
├─ 📁 backend                            # ML + Flask prediction API
│  ├─ 📝 main.py                         # Train/prepare model, save model file
│  ├─ 📝 app.py                          # Flask API: /api/status, /api/predict
│  ├─ 💾 gradient_boosting_model.pkl     # Saved trained model used for prediction
│  ├─ 📄 dataR2.csv                      # Dataset used for training
│  ├─ 📝 .gitkeep                        # Keep folder tracked
│  └─ 📂 venv                            # Python virtual environment
│
└─ 📁 projet-nextjs                      # Next.js App (frontend + API routes)
   ├─ 📝 README.md                       # Next.js documentation
   ├─ 📝 package.json                    # Frontend dependencies/scripts
   ├─ 📝 next.config.ts                  # Next.js config
   ├─ 📝 tsconfig.json                   # TypeScript config
   ├─ 📝 eslint.config.mjs               # ESLint config
   ├─ 📝 postcss.config.mjs              # PostCSS config
   ├─ 📝 next-env.d.ts                   # Next.js TS types
   ├─ 📝 .env                            # Environment variables (local)
   ├─ 📂 public                          # Static assets
   ├─ 📂 src
   │  ├─ 📂 app                          # Pages + API routes (App Router)
   │  ├─ 📂 lib                          # MongoDB + JWT helpers
   │  ├─ 📂 models                       # Mongoose models (User/Patiente/ClinicalData)
   │  └─ 📂 utils                        # PDF generation utilities
   └─ 📂 .next                           # Next.js build output (local)

```
## Prerequisites

- Node.js (recommended: 18+)
- Python (recommended: 3.10+)
- MongoDB (local or remote)
- (Optional) Postman for API testing

## Installation

1. Clone the repository:

```bash
git clone https://github.com/OnsElfekih/BreastCancerPredictionSystemNextJS.git
cd BreastCancerPredictionSystemNextJS
```

2. Install Next.js dependencies
   
   ```bash
   cd projet-nextjs
   npm install
   ```
   
3. Configure environment variables
  
4. Install Python dependencies (Flask + ML)

```bash
cd ../backend
python -m venv venv
# Windows PowerShell
.\venv\Scripts\Activate.ps1
pip install flask flask-cors joblib numpy
```

5. Install dependencies:
   
   ```bash
   pip install -r requirements.txt
   ```
   
6. Usage
   - Start MongoDB
   - Run the Flask prediction API
   - Run the Next.js application

 7. Workflow:
    - Authentication
    - Patient management 
    - Clinical data
    - Prediction
    - Reports (PDF)
