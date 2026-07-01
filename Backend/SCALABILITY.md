# Scalability Notes

This document outlines how the current architecture could be scaled for production use.

## Current Architecture
- Single Node.js/Express server
- MongoDB with Mongoose ODM
- Stateless JWT authentication (no server-side session storage)

## Scaling Considerations

### 1. Horizontal Scaling
Since authentication is stateless (JWT-based), the API server can be horizontally scaled behind a load balancer (e.g., Nginx, AWS ALB) without needing sticky sessions. Multiple instances can run in parallel.

### 2. Caching
Frequently accessed, rarely changing data (e.g., monthly totals, category lists) could be cached using Redis to reduce database load. Cache invalidation would trigger on expense create/update/delete.

### 3. Database Scaling
- Add indexes on `user`, `category`, and `date` fields in the Expense collection to speed up filtered queries.
- For very large datasets, MongoDB sharding by `user` ID could distribute load across multiple database nodes.

### 4. Microservices (future)
As features grow (notifications, recurring expenses, budgets), the Auth and Expense modules could be split into separate services communicating via REST or a message queue (e.g., RabbitMQ), each independently deployable and scalable.

### 5. Rate Limiting & Security
Adding rate limiting (e.g., `express-rate-limit`) on auth routes would protect against brute-force login attempts as traffic grows.

### 6. Logging & Monitoring
Structured logging (e.g., Winston) and monitoring (e.g., Prometheus/Grafana) would be added to track performance and errors in production.

### 7. Containerization
Dockerizing the app would standardize deployment across environments and simplify scaling via orchestration tools like Kubernetes.