# AI Observability Project

##  Overview
This project demonstrates an observability system built using Node.js, Express, OpenTelemetry, and the ELK stack (Elasticsearch, Kibana).

The goal is to monitor API requests, collect logs and traces, and visualize them for debugging and performance analysis.

---

##  Features

- REST API built with Express.js
- Structured logging using Winston and Morgan
- Distributed tracing using OpenTelemetry
- Logs stored in Elasticsearch
- Visualization using Kibana (Discover)

---

## Tech Stack

- Node.js
- Express.js
- OpenTelemetry
- Elasticsearch
- Kibana
- Docker

---

## Project Structure

ai-observability-project/
│
├── index.js
├── logger.js
├── tracing.js
├── docker-compose.yml
├── package.json
└── README.md



---

## Setup Instructions

### 1. Install dependencies
### 2. Start Elasticsearch & Kibana
### 3. Run the server


---

## API Endpoints

### Health Check

### Get Users

### Create Order

Body:
{
"item": "Laptop"
}



---

## Observability

- Logs are generated using Winston
- Traces are created using OpenTelemetry
- Logs are stored in Elasticsearch
- Logs can be visualized in Kibana (Discover)

---

## Use Case

This setup helps in:
- Monitoring API requests
- Debugging errors
- Tracking request flow using trace IDs
- Analyzing logs in real time

---

## Future Improvements

- Add alerting for error rates
- Create dashboards in Kibana
- Monitor response times
- Async checkout flow with failure simulation
- Basic security using CORS and Helmet


---

##  Author

Sanjana Kesharwani