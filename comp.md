# servercn — Backend Component Catalog (v1)

A comprehensive list of **production-grade, copy-pasteable backend components**, inspired by shadcn but focused entirely on server-side infrastructure.

---

## 1. Authentication

### Password & Credentials

- password-hashing-bcrypt
- password-hashing-argon2
- password-verify
- password-strength-validator
- password-breach-check

### Token-Based Authentication

- jwt-access-token
- jwt-refresh-token
- jwt-rotation
- jwt-blacklist
- token-introspection

### Session-Based Authentication

- session-auth-express
- session-store-redis
- session-cookie-config

### OAuth / Social Authentication

- google-oauth
- github-oauth
- facebook-oauth
- apple-oauth
- oauth-callback-handler
- oauth-account-linking

### Verification & OTP

- email-verification-token
- password-reset-token
- otp-email
- otp-sms
- otp-totp

---

## 2. Authorization & Access Control

### Roles & Permissions

- rbac-core
- rbac-middleware
- permission-checker
- policy-engine

### Resource Protection

- ownership-guard
- scope-based-auth
- route-guard

---

## 3. Security

### Request Security

- rate-limit-memory
- rate-limit-redis
- bruteforce-protection
- csrf-protection
- cors-config
- helmet-config

### Data Protection

- encryption-aes
- encryption-field-level
- secure-compare
- hash-utility
- secret-rotation-helper

### Attack Prevention

- sql-injection-guard
- mongo-injection-guard
- xss-sanitizer
- request-size-limiter

---

## 4. API Infrastructure

### Validation & Parsing

- request-validator-zod
- request-validator-yup
- schema-registry
- query-parser
- pagination

### Error Handling

- http-error
- global-error-handler
- async-handler
- problem-details-rfc7807

### Response Utilities

- response-wrapper
- response-cache-control
- etag-handler

---

## 5. Database & Persistence

### Connections

- mongodb-connection
- postgres-connection
- mysql-connection
- redis-connection

### ORM / Query Helpers

- drizzle-mysql
- drizzle-postgres
- mongoose-base-model
- transaction-helper

### Data Utilities

- soft-delete
- audit-fields
- pagination-mongo
- cursor-pagination-sql

---

## 6. Logging, Monitoring & Observability

### Logging

- logger-pino
- logger-winston
- request-logger
- error-logger

### Metrics & Tracing

- health-check
- uptime-monitor
- prometheus-metrics
- opentelemetry-tracing

### Audit & Compliance

- audit-log
- activity-tracker
- security-event-logger

---

## 7. Background Jobs & Scheduling

### Job Processing

- job-queue-bullmq
- job-retry-strategy
- dead-letter-queue

### Scheduling

- cron-runner
- task-scheduler
- idempotency-key

---

## 8. File Handling & Storage

### Uploads

- file-upload-multer
- file-validation
- image-processor
- virus-scan-hook

### Storage Providers

- s3-storage
- cloudinary-storage
- local-storage

---

## 9. Email, Messaging & Notifications

### Email

- email-smtp
- email-template-engine
- email-queue
- email-provider-resend
- email-provider-sendgrid

### Messaging

- sms-twilio
- push-notifications-fcm
- webhook-sender
- webhook-verifier

---

## 10. Configuration & Environment

### Environment Management

- env-validator-zod
- env-validator-envalid
- config-loader

### Secrets

- secret-manager-aws
- secret-manager-vault
- dotenv-secure

---

## 11. Performance & Reliability

### Caching

- cache-memory
- cache-redis
- http-cache

### Resilience

- retry-policy
- circuit-breaker
- timeout-wrapper

---

## 12. Developer Experience (DX)

### Developer Tools

- api-docs-swagger
- api-docs-openapi
- postman-collection-generator

### Testing

- test-db-setup
- test-auth-mocks
- test-factories
- e2e-test-helper

---

## 13. SaaS-Specific Components

### Multi-Tenancy

- tenant-context
- tenant-isolation
- tenant-middleware

### Billing & Limits

- usage-tracker
- rate-limit-by-plan
- feature-flag

---

## 14. Internal / CLI (Non-Public)

- framework-detector
- component-installer
- version-checker
- config-merger

---

## Recommended v1 Launch Set

- password-hashing-argon2
- jwt-access-token
- jwt-refresh-token
- jwt-rotation
- google-oauth
- rbac-core
- rate-limit-redis
- request-validator-zod
- global-error-handler
- logger-pino
