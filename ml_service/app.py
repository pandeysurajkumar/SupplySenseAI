from flask import Flask, request, jsonify
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
import datetime

app = Flask(__name__)

# Train a model on the fly for this request
# In a real production system, we would load pre-trained models
@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        
        # 1. Parse Input Data
        # We expect a list of historical records: { "date": "2023-01-01", "quantity": 100, ... }
        # And parameters for prediction: { "months": 12, "budget": 100 }
        
        history = data.get('history', [])
        params = data.get('params', {})
        
        if not history:
            return jsonify({"error": "No historical data provided"}), 400

        df = pd.DataFrame(history)
        
        # Ensure date column exists and is datetime
        if 'date' not in df.columns or 'quantity' not in df.columns:
             return jsonify({"error": "History must contain 'date' and 'quantity' columns"}), 400
             
        df['date'] = pd.to_datetime(df['date'])
        df['month_num'] = df['date'].dt.month
        df['year'] = df['date'].dt.year
        df['timestamp'] = df['date'].apply(lambda x: x.timestamp())
        
        # 2. Prepare Features (X) and Target (y)
        # Simple features: Month, Year. 
        # Advanced: Lag features, Moving Averages (omitted for speed/simplicity of demo)
        
        X = df[['month_num', 'year']]
        y = df['quantity']
        
        # 3. Train Model
        # Using Random Forest for non-linear patterns (seasonality)
        model = RandomForestRegressor(n_estimators=100, random_state=42)
        model.fit(X, y)
        
        # 4. Generate Future Dates for Prediction
        forecast_period = int(params.get('forecastPeriod', 12)) # months
        last_date = df['date'].max()
        
        future_dates = []
        future_X = []
        
        current_date = last_date
        for i in range(forecast_period):
            # Add ~30 days
            current_date = current_date + datetime.timedelta(days=30) 
            future_dates.append(current_date.strftime("%b %Y"))
            future_X.append([current_date.month, current_date.year])
            
        # 5. Predict
        predictions = model.predict(future_X)
        
        # 6. Inventory Logic integration (Python side calculation)
        # We can simulate demand scaling based on "Budget" or "Tower Type" multipliers here too
        budget_multiplier = float(params.get('budget', 100)) / 100.0  # Normalize around 100Cr
        
        # Adjust predictions based on budget (assuming history was for a 'standard' project)
        # In real life, history would be normalized per unit of budget. 
        final_predictions = predictions * budget_multiplier
        
        # 7. Inventory Optimization (Safety Stock & Reorder Point)
        # We calculate the standard deviation of the forecasted demand to estimate volatility.
        # Service Level of 95% implies Z-score approx 1.645
        
        forecast_std = np.std(final_predictions)
        avg_demand = np.mean(final_predictions)
        
        # Lead time (assume 1 month for simplicity, or 30 days)
        lead_time_months = 1
        
        # Safety Stock = Z * std_dev * sqrt(lead_time)
        z_score = 1.645
        safety_stock = z_score * forecast_std * np.sqrt(lead_time_months)
        
        # Reorder Point = (Avg Daily Demand * Lead Time Days) + Safety Stock
        # Here we work in months, so: (Avg Monthly Demand * Lead Time Months) + Safety Stock
        reorder_point = (avg_demand * lead_time_months) + safety_stock
        
        optimization_metrics = {
             "safety_stock": round(safety_stock),
             "reorder_point": round(reorder_point),
             "average_monthly_demand": round(avg_demand)
        }
        
        result = {
            "success": True,
            "chartLabels": future_dates,
            "chartData": [round(x) for x in final_predictions.tolist()],
            "optimization_metrics": optimization_metrics,
            "model_used": "RandomForestRegressor + InventoryOpt",
            "message": "Forecast generated successfully using Python ML"
        }
        
        return jsonify(result)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5001, debug=True)
