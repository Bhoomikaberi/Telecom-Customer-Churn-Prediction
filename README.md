#  Telecom Customer Churn Prediction using Machine Learning

##  Project Overview

Telecom companies lose a significant amount of revenue when customers discontinue their services. This project develops an end-to-end Machine Learning solution to predict customer churn using customer demographics, account details, and service usage information.

The project includes data preprocessing, exploratory data analysis (EDA), feature engineering, model training, model evaluation, and a Flask-based web application that allows users to predict customer churn through an interactive interface.

---

##  Features

- Data preprocessing and cleaning
- Exploratory Data Analysis (EDA)
- Feature engineering
- Training multiple Machine Learning models
- Model evaluation and comparison
- Saving the best trained model
- Flask-based prediction API
- Interactive web interface for predictions

---

##  Tech Stack

### Programming Language
- Python

### Machine Learning Libraries
- Scikit-learn
- Pandas
- NumPy
- Joblib

### Visualization
- Matplotlib
- Seaborn

### Web Technologies
- Flask
- HTML
- CSS
- JavaScript

### Development Tools
- Jupyter Notebook
- VS Code
- Git
- GitHub

---

##  Project Structure

```
TelecomChurnPrediction/
│── Telco-Customer-Churn.csv        # Dataset
│── telecom_customer_churn.ipynb    # EDA and model development
│── train.py                        # Model training script
│── app.py                          # Flask application
│── test_api.py                     # API testing script
│── churn_model_assets.joblib       # Saved model and preprocessing pipeline
│── index.html                      # Frontend
│── styles.css                      # Styling
│── script.js                       # Frontend logic
│── requirements.txt                # Project dependencies
│── README.md
```

---

##  Dataset

The dataset contains telecom customer information, including:

- Customer demographics
- Contract details
- Internet services
- Payment information
- Monthly charges
- Total charges
- Tenure
- Churn status

Target Variable:

```
Churn
```

---

##  Machine Learning Workflow

The project follows these steps:

1. Load the dataset
2. Clean missing values
3. Perform Exploratory Data Analysis (EDA)
4. Encode categorical variables
5. Feature Engineering
6. Split the dataset into training and testing sets
7. Train Machine Learning models
8. Evaluate model performance
9. Save the best model
10. Deploy using Flask

---

##  Models Used

The project compares multiple Machine Learning algorithms, such as:

- Logistic Regression
- Decision Tree
- Random Forest
- Support Vector Machine (SVM)
- K-Nearest Neighbors (KNN)
- XGBoost (if used)

The best-performing model is saved for deployment.

---

##  Model Evaluation Metrics

The trained models are evaluated using:

- Accuracy
- Precision
- Recall
- F1 Score
- ROC-AUC Score
- Confusion Matrix

---

##  Installation

Clone the repository

```bash
git clone https://github.com/Bhoomikaberi/Telecom-Customer-Churn-Prediction.git
```

Move into the project directory

```bash
cd Telecom-Customer-Churn-Prediction
```

Install dependencies

```bash
pip install -r requirements.txt
```

---

##  Run the Project

Start the Flask server

```bash
python app.py
```

Open your browser and visit

```
http://127.0.0.1:5000
```

---

##  Application Workflow

1. Enter customer details
2. Click **Predict**
3. The trained model analyzes the customer information
4. The application predicts whether the customer is likely to churn
5. The prediction result is displayed on the screen

---

##  Important Files

| File | Description |
|------|-------------|
| `app.py` | Flask application |
| `train.py` | Model training script |
| `telecom_customer_churn.ipynb` | Data analysis and model development |
| `test_api.py` | API testing |
| `requirements.txt` | Required Python packages |
| `churn_model_assets.joblib` | Saved ML model |

---

## Screenshots

Add screenshots of your application here.

Example:

```
screenshots/
    home.png
    prediction.png
```

Then include them using:

```md
![Home Page](screenshots/home.png)

![Prediction Result](screenshots/prediction.png)
```

---

## Future Improvements

- Deploy the application on Render or AWS
- Add user authentication
- Improve model performance
- Integrate real-time customer data
- Create an admin analytics dashboard

---

##  Author

**Bhoomika Beri**

Pre-Final Year Electronics & Computer Engineering Student

Machine Learning | Software Development | Data Science

GitHub: https://github.com/Bhoomikaberi

---

## ⭐ If you found this project useful, consider giving it a star!