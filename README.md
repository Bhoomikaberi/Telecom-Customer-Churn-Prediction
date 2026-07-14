# Telecom Customer Churn Prediction using Machine Learning

An end-to-end Machine Learning pipeline and real-time interactive dashboard to predict telecom customer churn. The project contains a model training suite comparing multiple algorithms and a modern, glassmorphic dark-mode web application showcasing prescriptive customer retention actions.

## Project Architecture

```
TelecomChurnPrediction/
├── Telco-Customer-Churn.csv       # Dataset downloaded from IBM/Kaggle
├── telecom_customer_churn.ipynb   # Improved Jupyter Notebook with comparative ML modeling
├── train.py                       # Python script to train and save the best model
├── churn_model_assets.joblib      # Serialized ML model and scaling pipeline assets
├── app.py                         # Flask prediction server & API endpoint
├── index.html                     # Premium dark-mode glassmorphic dashboard
├── styles.css                     # Customized neon CSS design
├── script.js                      # Dynamic gauge transitions & recommendation engine
└── requirements.txt               # Dependency checklist
```

## Setup & Running the Project

Ensure you have your environment libraries installed:
```bash
pip install -r requirements.txt
```

### 1. The Jupyter Notebook
Open the Jupyter Notebook:
- [telecom_customer_churn.ipynb](file:///Users/bhoomikaberi/.gemini/antigravity-ide/scratch/TelecomChurnPrediction/telecom_customer_churn.ipynb)

In this notebook, we:
- Corrected the `pandas` file loading to read the dataset locally (`Telco-Customer-Churn.csv`).
- Engineered the `AvgMonthlyCharge` indicator.
- Conducted comparative training across **Random Forest**, **HistGradientBoosting**, and **Logistic Regression**.
- Analyzed feature importance rankings showing that **Contract Terms**, **Tenure**, and **Internet Service (Fiber Optic)** are major drivers of churn risk.

### 2. Interactive Web Dashboard
Run the Flask prediction backend server:
```bash
python3 app.py
```

This will spin up a server on `http://localhost:5001`. Open your browser and navigate to:
[http://localhost:5001](http://localhost:5001)

#### Dashboard Key Features:
- **Demographics, Services, & Billing Forms**: Input fields for customer options.
- **Dynamic Circular Gauge**: Instantly displays the calculated churn probability.
- **Color-Coded Badges**: Low Risk (Green), Medium Risk (Yellow), High Risk (Red).
- **Stabilizers & Risk Accelerators Diagnostics**: Lists custom diagnostic metrics highlighting what helps or hurts customer retention.
- **Prescriptive Recommendation Engine**: Recommends action plans (e.g., auto-pay incentives, support bundlings, contract upgrades) tailored to input values.

## Performance Analysis
- **Logistic Regression (Best Overall AUC)**: Accuracy: **74%**, ROC-AUC: **84%** (provides high sensitivity/recall for catching churners).
- **HistGradientBoosting**: Accuracy: **75.5%**, ROC-AUC: **83.2%**.
- **Random Forest**: Accuracy: **79%**, ROC-AUC: **82.5%**.
