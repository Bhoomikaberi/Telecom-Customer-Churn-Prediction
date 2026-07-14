from flask import Flask, request, jsonify, send_from_directory
import pandas as pd
import numpy as np
import joblib
import os

app = Flask(__name__, static_folder='.', static_url_path='')

# Load the saved model and preprocessing assets
ASSET_PATH = 'churn_model_assets.joblib'
if not os.path.exists(ASSET_PATH):
    raise FileNotFoundError(f"Model assets not found. Please run the training script first.")

assets = joblib.load(ASSET_PATH)
model = assets['model']
model_name = assets['model_name']
scaler = assets['scaler']
label_encoders = assets['label_encoders']
features = assets['features']
num_cols = assets['num_cols']

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        if not data:
            return jsonify({'error': 'No input data provided'}), 400
            
        # Create a single-row DataFrame from input
        df = pd.DataFrame([data])
        
        # Ensure numerical types are correct
        df['tenure'] = pd.to_numeric(df['tenure'], errors='coerce').fillna(0).astype(float)
        df['MonthlyCharges'] = pd.to_numeric(df['MonthlyCharges'], errors='coerce').fillna(0.0).astype(float)
        df['TotalCharges'] = pd.to_numeric(df['TotalCharges'], errors='coerce').fillna(0.0).astype(float)
        df['SeniorCitizen'] = pd.to_numeric(df['SeniorCitizen'], errors='coerce').fillna(0).astype(int)
        
        # Calculate AvgMonthlyCharge
        df['AvgMonthlyCharge'] = df.apply(
            lambda row: row['TotalCharges'] / row['tenure'] if row['tenure'] > 0 else row['MonthlyCharges'], 
            axis=1
        ).astype(float)
        # Normalize contract terms to match model training categories
        # (only Month-to-month / One year / Two year exist in the training data)
        if 'Contract' in df.columns:
            c_val = str(df.loc[0, 'Contract']).strip().lower()
            if 'month' in c_val:
                df.loc[0, 'Contract'] = 'Month-to-month'
            elif '1' in c_val or 'one' in c_val:
                df.loc[0, 'Contract'] = 'One year'
            else:
                df.loc[0, 'Contract'] = 'Two year'
                
        # Encode categorical columns
        for col, le in label_encoders.items():
            if col == 'Churn':
                continue
            if col in df.columns:
                val = str(df.loc[0, col]).strip()
                # Use class mapping
                if val in le.classes_:
                    df[col] = le.transform([val])[0]
                else:
                    # Fallback to the most frequent class if unseen/invalid value
                    df[col] = le.transform([le.classes_[0]])[0]
                    
        # Reorder columns to match the trained features exactly
        df = df[features]
        
        # Scale numeric features
        df_scaled = df.copy()
        df_scaled[num_cols] = scaler.transform(df[num_cols])
        
        # Make predictions
        prob = float(model.predict_proba(df_scaled)[0, 1])
        pred = int(model.predict(df_scaled)[0])
        
        return jsonify({
            'status': 'success',
            'model_used': model_name,
            'churn_prediction': pred,
            'churn_probability': prob
        })
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({
            'status': 'error',
            'error': str(e)
        }), 400

if __name__ == '__main__':
    print(f"Starting Flask server with model: {model_name}...")
    app.run(debug=True, port=5001, host='0.0.0.0')
