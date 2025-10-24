# Deployment Guide - BK Pulse

Guide for deploying BK Pulse to production environments.

## Deployment Options

### Option 1: Docker Deployment (Recommended)

#### Create Dockerfile

```dockerfile
FROM python:3.10-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY . .

# Create directories
RUN mkdir -p data/raw data/processed data/models logs

# Expose API port
EXPOSE 5000

# Default command (can be overridden)
CMD ["python", "src/api/app.py"]
```

#### Create docker-compose.yml

```yaml
version: '3.8'

services:
  bk-pulse-api:
    build: .
    ports:
      - "5000:5000"
    volumes:
      - ./data:/app/data
      - ./logs:/app/logs
      - ./config.yaml:/app/config.yaml
    environment:
      - API_HOST=0.0.0.0
      - API_PORT=5000
      - API_DEBUG=False
    restart: unless-stopped
```

#### Build and Run

```bash
# Build image
docker build -t bk-pulse:latest .

# Run container
docker run -d \
  -p 5000:5000 \
  -v $(pwd)/data:/app/data \
  -v $(pwd)/logs:/app/logs \
  --name bk-pulse-api \
  bk-pulse:latest

# Or use docker-compose
docker-compose up -d
```

### Option 2: Cloud Deployment

#### AWS Elastic Beanstalk

1. Install EB CLI:
   ```bash
   pip install awsebcli
   ```

2. Initialize:
   ```bash
   eb init -p python-3.10 bk-pulse
   ```

3. Create environment:
   ```bash
   eb create bk-pulse-prod
   ```

4. Deploy:
   ```bash
   eb deploy
   ```

#### Google Cloud Run

1. Build container:
   ```bash
   gcloud builds submit --tag gcr.io/PROJECT_ID/bk-pulse
   ```

2. Deploy:
   ```bash
   gcloud run deploy bk-pulse \
     --image gcr.io/PROJECT_ID/bk-pulse \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated
   ```

#### Azure App Service

1. Login:
   ```bash
   az login
   ```

2. Create app:
   ```bash
   az webapp up --name bk-pulse --runtime "PYTHON:3.10"
   ```

### Option 3: Traditional Server Deployment

#### Using Gunicorn (Production WSGI Server)

1. Install Gunicorn:
   ```bash
   pip install gunicorn
   ```

2. Create `wsgi.py`:
   ```python
   from src.api.app import app
   
   if __name__ == "__main__":
       app.run()
   ```

3. Run with Gunicorn:
   ```bash
   gunicorn --bind 0.0.0.0:5000 --workers 4 --timeout 120 wsgi:app
   ```

#### Using Nginx as Reverse Proxy

Create `/etc/nginx/sites-available/bk-pulse`:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

Enable and restart:
```bash
sudo ln -s /etc/nginx/sites-available/bk-pulse /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### Systemd Service

Create `/etc/systemd/system/bk-pulse.service`:

```ini
[Unit]
Description=BK Pulse Churn Prediction API
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/opt/bk-pulse
Environment="PATH=/opt/bk-pulse/venv/bin"
ExecStart=/opt/bk-pulse/venv/bin/gunicorn --bind 0.0.0.0:5000 --workers 4 wsgi:app
Restart=always

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl enable bk-pulse
sudo systemctl start bk-pulse
```

## Production Configuration

### Security

1. **Use Environment Variables:**
   ```bash
   export API_DEBUG=False
   export SECRET_KEY="your-secret-key"
   ```

2. **Enable HTTPS:**
   - Use Let's Encrypt for SSL certificates
   - Configure Nginx for HTTPS

3. **API Authentication:**
   Add authentication to Flask app:
   ```python
   from flask import request
   from functools import wraps
   
   def require_api_key(f):
       @wraps(f)
       def decorated_function(*args, **kwargs):
           api_key = request.headers.get('X-API-Key')
           if api_key != os.environ.get('API_KEY'):
               return jsonify({'error': 'Invalid API key'}), 401
           return f(*args, **kwargs)
       return decorated_function
   ```

### Performance Optimization

1. **Model Caching:**
   - Load model once at startup
   - Use Redis for distributed caching

2. **Database for Predictions:**
   - Store predictions in PostgreSQL/MongoDB
   - Track prediction history

3. **Async Processing:**
   - Use Celery for batch predictions
   - Implement job queue for large datasets

### Monitoring

#### Application Monitoring

1. **Logging:**
   ```python
   import logging
   logging.basicConfig(
       level=logging.INFO,
       format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
       handlers=[
           logging.FileHandler('logs/app.log'),
           logging.StreamHandler()
       ]
   )
   ```

2. **Metrics:**
   - Use Prometheus for metrics collection
   - Grafana for visualization

3. **Error Tracking:**
   - Integrate Sentry for error tracking
   - Set up alerts for critical errors

#### Health Checks

```python
@app.route('/health')
def health():
    try:
        # Check model is loaded
        if model is None:
            return jsonify({'status': 'unhealthy', 'reason': 'Model not loaded'}), 503
        
        # Check database connection (if applicable)
        # db.ping()
        
        return jsonify({'status': 'healthy'}), 200
    except Exception as e:
        return jsonify({'status': 'unhealthy', 'reason': str(e)}), 503
```

## Automated Predictions

### Scheduled Batch Processing

#### Using Cron

```bash
# Add to crontab (crontab -e)
0 2 * * * cd /opt/bk-pulse && /opt/bk-pulse/venv/bin/python predict.py --batch --input /data/daily_customers.csv --output /data/predictions_$(date +\%Y\%m\%d).csv
```

#### Using Airflow

Create DAG for scheduled predictions:

```python
from airflow import DAG
from airflow.operators.bash import BashOperator
from datetime import datetime, timedelta

default_args = {
    'owner': 'bk-pulse',
    'depends_on_past': False,
    'start_date': datetime(2024, 1, 1),
    'retries': 1,
    'retry_delay': timedelta(minutes=5),
}

dag = DAG(
    'bk_pulse_daily_predictions',
    default_args=default_args,
    schedule_interval='0 2 * * *',  # Daily at 2 AM
)

predict_task = BashOperator(
    task_id='run_predictions',
    bash_command='cd /opt/bk-pulse && python predict.py --batch --input /data/customers.csv --output /data/predictions.csv',
    dag=dag,
)
```

## Scaling

### Horizontal Scaling

1. **Load Balancer:**
   - Use AWS ELB, Google Cloud Load Balancer, or HAProxy
   - Distribute traffic across multiple API instances

2. **Kubernetes:**
   ```yaml
   apiVersion: apps/v1
   kind: Deployment
   metadata:
     name: bk-pulse
   spec:
     replicas: 3
     selector:
       matchLabels:
         app: bk-pulse
     template:
       metadata:
         labels:
           app: bk-pulse
       spec:
         containers:
         - name: bk-pulse
           image: bk-pulse:latest
           ports:
           - containerPort: 5000
   ```

### Database for Predictions

Store predictions for tracking and analytics:

```python
# Example with SQLAlchemy
from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class Prediction(Base):
    __tablename__ = 'predictions'
    
    id = Column(Integer, primary_key=True)
    customer_id = Column(String)
    churn_probability = Column(Float)
    risk_level = Column(String)
    prediction_date = Column(DateTime, default=datetime.utcnow)
    
engine = create_engine('postgresql://user:pass@localhost/bk_pulse')
Base.metadata.create_all(engine)
```

## Model Retraining

### Automated Retraining Pipeline

```python
# retrain.py
import schedule
import time
from train import main as train_model

def retrain_job():
    print("Starting model retraining...")
    train_model(config_path='config.yaml', use_sample_data=False)
    print("Model retraining completed")

# Retrain weekly
schedule.every().monday.at("03:00").do(retrain_job)

while True:
    schedule.run_pending()
    time.sleep(3600)  # Check every hour
```

## Backup and Recovery

### Model Versioning

```bash
# Backup model with timestamp
cp data/models/churn_model.joblib data/models/churn_model_$(date +%Y%m%d).joblib

# Keep last 10 versions
ls -t data/models/churn_model_*.joblib | tail -n +11 | xargs rm -f
```

### Database Backups

```bash
# PostgreSQL backup
pg_dump bk_pulse > backup_$(date +%Y%m%d).sql

# Upload to S3
aws s3 cp backup_$(date +%Y%m%d).sql s3://bk-pulse-backups/
```

## Testing in Production

### Smoke Tests

```bash
#!/bin/bash
# smoke_test.sh

API_URL="http://your-api-url.com"

# Health check
curl -f $API_URL/health || exit 1

# Test prediction
curl -f -X POST $API_URL/predict \
  -H "Content-Type: application/json" \
  -d '{"customer_id": "TEST001", ...}' || exit 1

echo "Smoke tests passed!"
```

### A/B Testing

Deploy multiple model versions and compare:

```python
@app.route('/predict/<version>')
def predict_version(version):
    if version == 'v1':
        model = load_model('models/v1/model.joblib')
    elif version == 'v2':
        model = load_model('models/v2/model.joblib')
    # ... rest of prediction logic
```

## Maintenance

### Monitoring Checklist

- [ ] API response times < 200ms
- [ ] Error rate < 1%
- [ ] Model predictions within expected range
- [ ] Disk space > 20% free
- [ ] Memory usage < 80%
- [ ] Log file rotation working

### Regular Tasks

- Weekly model retraining with new data
- Monthly performance review and optimization
- Quarterly security updates
- Annual infrastructure review

## Rollback Plan

If issues occur in production:

1. **Quick Rollback:**
   ```bash
   # Restore previous model version
   cp data/models/churn_model_backup.joblib data/models/churn_model.joblib
   
   # Restart service
   sudo systemctl restart bk-pulse
   ```

2. **Container Rollback:**
   ```bash
   docker stop bk-pulse-api
   docker run -d --name bk-pulse-api bk-pulse:previous-tag
   ```

## Support

For deployment issues:
- Check logs: `tail -f logs/app.log`
- Review health endpoint: `curl http://localhost:5000/health`
- GitHub Issues: https://github.com/shyakx/BK_PULSE/issues

---

*BK Pulse Deployment Guide*  
*Mission Capstone Project - ALU Rwanda*
