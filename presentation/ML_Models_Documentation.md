# SupplySenseAI Machine Learning Documentation

## Overview

This document provides detailed information about the machine learning models, algorithms, and methodologies implemented in SupplySenseAI for demand forecasting and inventory optimization.

## Machine Learning Architecture

### ML Service Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Data Input    │───▶│  Preprocessing  │───▶│  ML Pipeline    │
│                 │    │                 │    │                 │
│ • CSV Upload    │    │ • Data Cleaning │    │ • Model Train   │
│ • API Input     │    │ • Feature Eng   │    │ • Prediction    │
│ • Real-time     │    │ • Validation    │    │ • Optimization  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                       │
                                                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Optimization   │───▶│   Analytics     │───▶│   Output        │
│                 │    │                 │    │                 │
│ • Safety Stock  │    │ • Performance   │    │ • Charts        │
│ • Reorder Pt    │    │ • Accuracy      │    │ • Metrics       │
│ • Recommendations│    │ • Insights     │    │ • Reports       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Data Processing Pipeline

### 1. Data Ingestion

#### Supported Data Formats
- **CSV Files**: Historical demand data
- **API Payloads**: Real-time data streams
- **Database Queries**: Internal data sources

#### CSV Format Requirements
```csv
material_name,date,quantity,unit
Steel Rod,2023-01-01,450,kg
Steel Rod,2023-02-01,520,kg
Copper Wire,2023-01-01,200,meters
Copper Wire,2023-02-01,180,meters
```

#### Data Validation
```python
def validate_csv_data(df):
    required_columns = ['material_name', 'date', 'quantity']
    if not all(col in df.columns for col in required_columns):
        raise ValueError("Missing required columns")

    # Date format validation
    try:
        pd.to_datetime(df['date'])
    except:
        raise ValueError("Invalid date format")

    # Quantity validation
    if (df['quantity'] <= 0).any():
        raise ValueError("Quantity must be positive")

    return True
```

### 2. Data Preprocessing

#### Feature Engineering
```python
def preprocess_data(df):
    # Convert date column
    df['date'] = pd.to_datetime(df['date'])

    # Extract temporal features
    df['month_num'] = df['date'].dt.month
    df['year'] = df['date'].dt.year
    df['quarter'] = df['date'].dt.quarter
    df['day_of_year'] = df['date'].dt.dayofyear

    # Calculate rolling statistics
    df['rolling_mean_3'] = df.groupby('material_name')['quantity'].rolling(3).mean().reset_index(0, drop=True)
    df['rolling_std_3'] = df.groupby('material_name')['quantity'].rolling(3).std().reset_index(0, drop=True)

    # Lag features
    df['lag_1'] = df.groupby('material_name')['quantity'].shift(1)
    df['lag_2'] = df.groupby('material_name')['quantity'].shift(2)
    df['lag_3'] = df.groupby('material_name')['quantity'].shift(3)

    # Seasonal decomposition (simplified)
    df['seasonal_factor'] = df['month_num'].map({
        1: 0.8, 2: 0.9, 3: 1.1, 4: 1.2, 5: 1.3, 6: 1.4,
        7: 1.2, 8: 1.1, 9: 1.0, 10: 0.9, 11: 0.8, 12: 0.7
    })

    return df.dropna()  # Remove rows with NaN values
```

#### Data Normalization
```python
from sklearn.preprocessing import StandardScaler

def normalize_features(X):
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    return X_scaled, scaler
```

## Machine Learning Models

### 1. Random Forest Regressor

#### Model Configuration
```python
from sklearn.ensemble import RandomForestRegressor

def create_rf_model():
    model = RandomForestRegressor(
        n_estimators=100,          # Number of trees
        max_depth=None,            # Unlimited depth
        min_samples_split=2,       # Minimum samples to split
        min_samples_leaf=1,        # Minimum samples per leaf
        max_features='auto',       # Features to consider
        random_state=42,           # Reproducibility
        n_jobs=-1                  # Use all CPU cores
    )
    return model
```

#### Hyperparameter Tuning
```python
from sklearn.model_selection import GridSearchCV

param_grid = {
    'n_estimators': [50, 100, 200],
    'max_depth': [None, 10, 20, 30],
    'min_samples_split': [2, 5, 10],
    'min_samples_leaf': [1, 2, 4],
    'max_features': ['auto', 'sqrt', 'log2']
}

grid_search = GridSearchCV(
    RandomForestRegressor(random_state=42),
    param_grid,
    cv=5,
    scoring='neg_mean_absolute_error',
    n_jobs=-1
)
```

#### Feature Importance Analysis
```python
def get_feature_importance(model, feature_names):
    importance = model.feature_importances_
    feature_importance = pd.DataFrame({
        'feature': feature_names,
        'importance': importance
    }).sort_values('importance', ascending=False)

    return feature_importance
```

### 2. Linear Regression (Baseline)

#### Model Implementation
```python
from sklearn.linear_model import LinearRegression

def create_linear_model():
    model = LinearRegression(
        fit_intercept=True,    # Calculate intercept
        normalize=True,        # Normalize features
        n_jobs=-1              # Parallel computation
    )
    return model
```

### 3. Advanced Models (Future Implementation)

#### LSTM Neural Network
```python
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout

def create_lstm_model(input_shape):
    model = Sequential([
        LSTM(50, activation='relu', input_shape=input_shape, return_sequences=True),
        Dropout(0.2),
        LSTM(50, activation='relu'),
        Dropout(0.2),
        Dense(1)
    ])

    model.compile(optimizer='adam', loss='mse', metrics=['mae'])
    return model
```

#### Gradient Boosting
```python
from xgboost import XGBRegressor

def create_xgb_model():
    model = XGBRegressor(
        n_estimators=100,
        learning_rate=0.1,
        max_depth=6,
        min_child_weight=1,
        gamma=0,
        subsample=0.8,
        colsample_bytree=0.8,
        objective='reg:squarederror',
        random_state=42
    )
    return model
```

## Forecasting Methodology

### Time Series Forecasting Approach

#### 1. Data Preparation
```python
def prepare_forecasting_data(df, material_name, forecast_periods=12):
    # Filter data for specific material
    material_data = df[df['material_name'] == material_name].copy()

    # Sort by date
    material_data = material_data.sort_values('date')

    # Create features and target
    feature_cols = ['month_num', 'year', 'quarter', 'seasonal_factor',
                   'rolling_mean_3', 'lag_1', 'lag_2', 'lag_3']
    target_col = 'quantity'

    X = material_data[feature_cols]
    y = material_data[target_col]

    return X, y, material_data
```

#### 2. Model Training and Validation
```python
from sklearn.model_selection import TimeSeriesSplit
from sklearn.metrics import mean_absolute_error, mean_squared_error

def train_and_validate_model(X, y, model):
    # Time series cross-validation
    tscv = TimeSeriesSplit(n_splits=5)

    mae_scores = []
    rmse_scores = []

    for train_index, test_index in tscv.split(X):
        X_train, X_test = X.iloc[train_index], X.iloc[test_index]
        y_train, y_test = y.iloc[train_index], y.iloc[test_index]

        # Train model
        model.fit(X_train, y_train)

        # Make predictions
        y_pred = model.predict(X_test)

        # Calculate metrics
        mae = mean_absolute_error(y_test, y_pred)
        rmse = np.sqrt(mean_squared_error(y_test, y_pred))

        mae_scores.append(mae)
        rmse_scores.append(rmse)

    return {
        'mae_mean': np.mean(mae_scores),
        'mae_std': np.std(mae_scores),
        'rmse_mean': np.mean(rmse_scores),
        'rmse_std': np.std(rmse_scores)
    }
```

#### 3. Future Prediction Generation
```python
def generate_future_predictions(model, last_date, forecast_periods, material_data):
    predictions = []
    current_features = material_data.iloc[-1].copy()

    for i in range(forecast_periods):
        # Update date
        current_date = last_date + pd.DateOffset(months=i+1)

        # Update features
        current_features['month_num'] = current_date.month
        current_features['year'] = current_date.year
        current_features['quarter'] = current_date.quarter
        current_features['seasonal_factor'] = get_seasonal_factor(current_date.month)

        # Prepare feature vector
        feature_vector = current_features[['month_num', 'year', 'quarter', 'seasonal_factor',
                                         'rolling_mean_3', 'lag_1', 'lag_2', 'lag_3']].values.reshape(1, -1)

        # Make prediction
        pred = model.predict(feature_vector)[0]
        predictions.append(max(0, pred))  # Ensure non-negative predictions

        # Update lag features for next iteration
        current_features['lag_3'] = current_features['lag_2']
        current_features['lag_2'] = current_features['lag_1']
        current_features['lag_1'] = pred

    return predictions
```

## Inventory Optimization

### Safety Stock Calculation

#### Statistical Method
```python
def calculate_safety_stock(forecasts, service_level=0.95):
    """
    Calculate safety stock using statistical method

    Parameters:
    forecasts (array): Array of forecasted demand values
    service_level (float): Desired service level (default 95%)

    Returns:
    dict: Safety stock metrics
    """
    # Calculate standard deviation of forecasts
    forecast_std = np.std(forecasts)

    # Calculate average demand
    avg_demand = np.mean(forecasts)

    # Z-score for service level (95% = 1.645, 99% = 2.326)
    z_score = 1.645 if service_level == 0.95 else 2.326

    # Assume lead time of 1 month for simplicity
    lead_time_months = 1

    # Safety Stock = Z × σ × √(Lead Time)
    safety_stock = z_score * forecast_std * np.sqrt(lead_time_months)

    return {
        'safety_stock': round(safety_stock),
        'z_score': z_score,
        'forecast_std': round(forecast_std, 2),
        'service_level': service_level
    }
```

#### Reorder Point Calculation
```python
def calculate_reorder_point(avg_demand, safety_stock, lead_time_months=1):
    """
    Calculate reorder point

    Parameters:
    avg_demand (float): Average monthly demand
    safety_stock (float): Calculated safety stock
    lead_time_months (int): Lead time in months

    Returns:
    float: Reorder point
    """
    # Reorder Point = (Average Demand × Lead Time) + Safety Stock
    reorder_point = (avg_demand * lead_time_months) + safety_stock

    return round(reorder_point)
```

### Economic Order Quantity (EOQ)

#### Basic EOQ Calculation
```python
def calculate_eoq(annual_demand, ordering_cost, holding_cost_per_unit):
    """
    Calculate Economic Order Quantity

    Parameters:
    annual_demand (float): Annual demand quantity
    ordering_cost (float): Cost per order
    holding_cost_per_unit (float): Annual holding cost per unit

    Returns:
    dict: EOQ and related metrics
    """
    # EOQ = √(2 × Annual Demand × Ordering Cost / Holding Cost per Unit)
    eoq = np.sqrt((2 * annual_demand * ordering_cost) / holding_cost_per_unit)

    # Total annual cost
    ordering_cost_total = (annual_demand / eoq) * ordering_cost
    holding_cost_total = (eoq / 2) * holding_cost_per_unit
    total_cost = ordering_cost_total + holding_cost_total

    return {
        'eoq': round(eoq),
        'ordering_cost_total': round(ordering_cost_total, 2),
        'holding_cost_total': round(holding_cost_total, 2),
        'total_cost': round(total_cost, 2),
        'order_frequency': round(annual_demand / eoq, 1)
    }
```

## Model Evaluation Metrics

### Regression Metrics
```python
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

def calculate_regression_metrics(y_true, y_pred):
    """
    Calculate comprehensive regression metrics

    Parameters:
    y_true (array): Actual values
    y_pred (array): Predicted values

    Returns:
    dict: Performance metrics
    """
    mae = mean_absolute_error(y_true, y_pred)
    mse = mean_squared_error(y_true, y_pred)
    rmse = np.sqrt(mse)
    r2 = r2_score(y_true, y_pred)

    # Mean Absolute Percentage Error
    mape = np.mean(np.abs((y_true - y_pred) / y_true)) * 100

    # Symmetric Mean Absolute Percentage Error
    smape = 2 * np.mean(np.abs(y_pred - y_true) / (np.abs(y_pred) + np.abs(y_true))) * 100

    return {
        'mae': round(mae, 2),
        'mse': round(mse, 2),
        'rmse': round(rmse, 2),
        'r2_score': round(r2, 4),
        'mape': round(mape, 2),
        'smape': round(smape, 2)
    }
```

### Forecast Accuracy Metrics
```python
def calculate_forecast_accuracy(actual, predicted):
    """
    Calculate forecast accuracy metrics

    Parameters:
    actual (array): Actual demand values
    predicted (array): Predicted demand values

    Returns:
    dict: Accuracy metrics
    """
    # Mean Absolute Error
    mae = np.mean(np.abs(actual - predicted))

    # Mean Absolute Percentage Error
    mape = np.mean(np.abs((actual - predicted) / actual)) * 100

    # Root Mean Square Error
    rmse = np.sqrt(np.mean((actual - predicted) ** 2))

    # Mean Absolute Scaled Error (MASE)
    naive_forecast = np.roll(actual, 1)
    naive_forecast[0] = actual[0]  # First value remains the same
    naive_mae = np.mean(np.abs(actual - naive_forecast))
    mase = mae / naive_mae if naive_mae != 0 else float('inf')

    return {
        'mae': round(mae, 2),
        'mape': round(mape, 2),
        'rmse': round(rmse, 2),
        'mase': round(mase, 4)
    }
```

## Model Persistence and Deployment

### Model Saving and Loading
```python
import joblib
import os

def save_model(model, model_name, scaler=None):
    """
    Save trained model and scaler

    Parameters:
    model: Trained ML model
    model_name (str): Name for the model file
    scaler: Fitted scaler (optional)
    """
    model_dir = 'models'
    os.makedirs(model_dir, exist_ok=True)

    # Save model
    model_path = os.path.join(model_dir, f'{model_name}_model.pkl')
    joblib.dump(model, model_path)

    # Save scaler if provided
    if scaler:
        scaler_path = os.path.join(model_dir, f'{model_name}_scaler.pkl')
        joblib.dump(scaler, scaler_path)

    print(f"Model saved to {model_path}")

def load_model(model_name):
    """
    Load saved model and scaler

    Parameters:
    model_name (str): Name of the model file

    Returns:
    tuple: (model, scaler) or (model, None)
    """
    model_dir = 'models'
    model_path = os.path.join(model_dir, f'{model_name}_model.pkl')
    scaler_path = os.path.join(model_dir, f'{model_name}_scaler.pkl')

    # Load model
    model = joblib.load(model_path)

    # Load scaler if exists
    scaler = None
    if os.path.exists(scaler_path):
        scaler = joblib.load(scaler_path)

    return model, scaler
```

## Performance Optimization

### Model Caching
```python
from functools import lru_cache
import hashlib

@lru_cache(maxsize=100)
def get_cached_forecast(material_name, data_hash, forecast_periods):
    """
    Cache forecast results to avoid redundant calculations

    Parameters:
    material_name (str): Name of the material
    data_hash (str): Hash of input data
    forecast_periods (int): Number of periods to forecast

    Returns:
    dict: Cached forecast result or None
    """
    # Implementation would check Redis/database for cached results
    pass
```

### Parallel Processing
```python
from concurrent.futures import ThreadPoolExecutor
import multiprocessing

def parallel_forecast_materials(materials_data, forecast_function):
    """
    Generate forecasts for multiple materials in parallel

    Parameters:
    materials_data (list): List of material data dictionaries
    forecast_function (callable): Function to generate forecast for single material

    Returns:
    dict: Dictionary of forecast results by material
    """
    num_workers = min(multiprocessing.cpu_count(), len(materials_data))

    with ThreadPoolExecutor(max_workers=num_workers) as executor:
        futures = {
            executor.submit(forecast_function, material): material['name']
            for material in materials_data
        }

        results = {}
        for future in futures:
            material_name = futures[future]
            try:
                results[material_name] = future.result()
            except Exception as e:
                results[material_name] = {'error': str(e)}

    return results
```

## Monitoring and Maintenance

### Model Performance Tracking
```python
def track_model_performance(model_name, metrics, timestamp=None):
    """
    Track model performance over time

    Parameters:
    model_name (str): Name of the model
    metrics (dict): Performance metrics
    timestamp (datetime): Timestamp of evaluation
    """
    if timestamp is None:
        timestamp = datetime.datetime.now()

    performance_record = {
        'model_name': model_name,
        'timestamp': timestamp,
        'metrics': metrics
    }

    # Save to database or file
    save_performance_record(performance_record)
```

### Model Retraining Triggers
```python
def should_retrain_model(current_accuracy, baseline_accuracy, threshold=0.1):
    """
    Determine if model needs retraining

    Parameters:
    current_accuracy (float): Current model accuracy
    baseline_accuracy (float): Baseline accuracy threshold
    threshold (float): Minimum accuracy drop to trigger retraining

    Returns:
    bool: True if retraining is needed
    """
    accuracy_drop = baseline_accuracy - current_accuracy
    return accuracy_drop > threshold
```

This comprehensive ML documentation covers all aspects of the machine learning implementation in SupplySenseAI, from data processing to model deployment and monitoring.