import pandas as pd
import numpy as np
import os
import joblib
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.ensemble import RandomForestClassifier, HistGradientBoostingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix, roc_auc_score

def train_and_save():
    print("--- Loading Dataset ---")
    data_path = "Telco-Customer-Churn.csv"
    if not os.path.exists(data_path):
        raise FileNotFoundError(f"Dataset not found at {data_path}")
        
    dataset = pd.read_csv(data_path)
    print(f"Dataset loaded successfully. Shape: {dataset.shape}")
    
    print("\n--- Data Cleaning & Feature Engineering ---")
    # Clean TotalCharges
    dataset['TotalCharges'] = pd.to_numeric(dataset['TotalCharges'], errors='coerce')
    dataset['TotalCharges'] = dataset['TotalCharges'].fillna(dataset['TotalCharges'].median())
    
    # Drop customerID
    dataset.drop(columns=['customerID'], inplace=True, errors='ignore')
    
    # Feature engineering: AvgMonthlyCharge
    dataset['AvgMonthlyCharge'] = dataset.apply(
        lambda row: row['TotalCharges'] / row['tenure'] if row['tenure'] > 0 else row['MonthlyCharges'], 
        axis=1
    )
    
    print("\n--- Categorical Encoding ---")
    # Save label encoders so we can reuse them for predictions
    label_encoders = {}
    categorical_cols = dataset.select_dtypes(include=['object']).columns
    for col in categorical_cols:
        le = LabelEncoder()
        dataset[col] = le.fit_transform(dataset[col])
        label_encoders[col] = le
        print(f"Encoded {col}: {list(le.classes_)}")
        
    # Split features and target
    X = dataset.drop('Churn', axis=1)
    y = dataset['Churn']
    
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, stratify=y, random_state=42
    )
    
    print("\n--- Feature Scaling ---")
    num_cols = ['tenure', 'MonthlyCharges', 'TotalCharges', 'AvgMonthlyCharge']
    scaler = StandardScaler()
    
    # Scale numerical columns
    X_train_scaled = X_train.copy()
    X_test_scaled = X_test.copy()
    X_train_scaled[num_cols] = scaler.fit_transform(X_train[num_cols])
    X_test_scaled[num_cols] = scaler.transform(X_test[num_cols])
    
    print("\n--- Model Training & Comparison ---")
    # 1. Random Forest (Original)
    rf = RandomForestClassifier(n_estimators=200, random_state=42, class_weight='balanced')
    rf.fit(X_train_scaled, y_train)
    rf_pred = rf.predict(X_test_scaled)
    rf_acc = accuracy_score(y_test, rf_pred)
    rf_auc = roc_auc_score(y_test, rf.predict_proba(X_test_scaled)[:, 1])
    print(f"Random Forest - Accuracy: {rf_acc:.4f}, ROC-AUC: {rf_auc:.4f}")
    
    # 2. Logistic Regression
    lr = LogisticRegression(max_iter=1000, random_state=42, class_weight='balanced')
    lr.fit(X_train_scaled, y_train)
    lr_pred = lr.predict(X_test_scaled)
    lr_acc = accuracy_score(y_test, lr_pred)
    lr_auc = roc_auc_score(y_test, lr.predict_proba(X_test_scaled)[:, 1])
    print(f"Logistic Regression - Accuracy: {lr_acc:.4f}, ROC-AUC: {lr_auc:.4f}")
    
    # 3. Gradient Boosting
    gb = HistGradientBoostingClassifier(random_state=42, class_weight='balanced')
    gb.fit(X_train_scaled, y_train)
    gb_pred = gb.predict(X_test_scaled)
    gb_acc = accuracy_score(y_test, gb_pred)
    gb_auc = roc_auc_score(y_test, gb.predict_proba(X_test_scaled)[:, 1])
    print(f"HistGradientBoosting - Accuracy: {gb_acc:.4f}, ROC-AUC: {gb_auc:.4f}")
    
    # Select best model based on ROC-AUC
    models = {
        'RandomForest': (rf, rf_acc, rf_auc),
        'LogisticRegression': (lr, lr_acc, lr_auc),
        'GradientBoosting': (gb, gb_acc, gb_auc)
    }
    
    best_model_name = max(models, key=lambda k: models[k][2])
    best_model, best_acc, best_auc = models[best_model_name]
    print(f"\n>>> Best Model: {best_model_name} (ROC-AUC: {best_auc:.4f})")
    
    # Detailed report for the best model
    best_pred = best_model.predict(X_test_scaled)
    print("\nClassification Report (Best Model):")
    print(classification_report(y_test, best_pred))
    
    print("Confusion Matrix (Best Model):")
    print(confusion_matrix(y_test, best_pred))
    
    # Save the model and preprocessing assets
    model_assets = {
        'model': best_model,
        'model_name': best_model_name,
        'scaler': scaler,
        'label_encoders': label_encoders,
        'features': list(X.columns),
        'num_cols': num_cols
    }
    
    asset_path = 'churn_model_assets.joblib'
    joblib.dump(model_assets, asset_path)
    print(f"\nSaved model assets to {asset_path}")

if __name__ == "__main__":
    train_and_save()
