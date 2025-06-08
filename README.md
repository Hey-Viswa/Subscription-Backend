# Subscription Management Backend API

A modern, production-ready Node.js backend API for managing users, authentication, and subscriptions. Built for SaaS and subscription-based applications, it features secure user management, subscription tracking, robust security, automated reminders, and transactional email workflows.

---

## 🗂️ Workflow Overview

![Workflow Concept](./workflow-concept%20(1).png)

This workflow demonstrates how the system processes client requests using a Workflow API and QStash for stepwise, reliable execution:

1. **Client** sends initial data to the **Workflow API**.
2. The **Workflow API** forwards the initial data to **QStash** to start the workflow.
3. **QStash** triggers the workflow steps:
    - **Step 1**: Receives initial data, processes it, and returns results.
    - **Step 2**: Receives results from Step 1, processes them, and returns final results.
4. Each step's results are passed along and can be used for further processing or notifications.

This architecture enables reliable, decoupled, and scalable background processing for subscription management, reminders, and notifications.

### 🔄 Subscription Reminder Workflow (Algorithm)

1. **Triggering the Workflow** — The workflow begins whenever a user creates or submits a new subscription. The created subscription ID is passed to the workflow.
2. **Retrieving Subscription Details**
    - The process extracts the **subscription ID** from the context.
    - It then searches for the corresponding subscription in the database.
3. **Validation Checks**
    - If the subscription **does not exist**, an error is logged, and the process terminates.
    - If the subscription exists, its **status is checked**:
        - If **inactive**, the status is logged, and the process exits.
        - If **active**, the renewal date is verified.
4. **Renewal Date Evaluation**
    - If the renewal date **has passed**, it logs this information and exits.
    - If the renewal date is **in the future**, the reminder loop begins.
5. **Reminder Scheduling**
    - For each predefined reminder:
        - The **reminder date is calculated**.
        - If the reminder date is **in the future**, the system waits until that time.
        - Once the reminder date arrives (or if it has already passed), the **reminder email is sent**.
6. **Completion**
    - The process repeats for all reminders in the list.
    - After processing all reminders, the workflow concludes.

---

## 🚀 Features

- **User Registration & Authentication** (JWT-based)
- **User CRUD** (Create, Read, Update, Delete)
- **Subscription Management** (create, view, update, delete subscriptions)
- **Role-Based Route Protection** (via JWT middleware)
- **Rate Limiting & Bot Protection** (Arcjet integration)
- **Automated Subscription Renewal Reminders** (scheduled notifications)
- **Transactional Email Notifications** (welcome, password reset, renewal, payment alerts)
- **Centralized Error Handling**
- **Environment-Based Configuration**

---

## 📝 TODO

- [ ] Implement a view to show subscription options (`GET /` in subscription.route.js)
- [ ] Implement a view to show subscription details (`GET /:id` in subscription.route.js)
- [ ] Implement a view to update subscription details (`PUT /:id` in subscription.route.js)
- [ ] Implement a view to delete a subscription (`DELETE /` in subscription.route.js)
- [ ] Implement a view to cancel a user's subscription (`PUT /user/:id/cancel` in subscription.route.js)
- [ ] Implement a view to show upcoming renewals (`PUT /upcoming-renewals` in subscription.route.js)
- [ ] (Add your next tasks here to keep track of what to implement)
- [ ] Example: Add admin dashboard endpoints
- [ ] Example: Integrate payment gateway (Stripe, PayPal, etc.)
- [ ] Example: Add API documentation (Swagger/OpenAPI)

---

## 🛠️ Tech Stack

- **Node.js** (v22+)
- **Express.js** (API framework)
- **MongoDB** (database, via Mongoose ODM)
- **Mongoose** (schema & validation)
- **bcryptjs** (password hashing)
- **jsonwebtoken** (JWT authentication)
- **dotenv** (environment variable management)
- **Arcjet** (rate limiting, bot & attack protection)
- **cookie-parser** (cookie support)
- **Nodemailer** (email delivery)
- **node-cron** (scheduled jobs)

---

## 📁 Folder Structure

```
├── app.js                     # Main entry point
├── config/                    # Environment & Arcjet config
├── controllers/               # Route controllers (auth, user, subscription)
├── database/                  # MongoDB connection logic
├── middlewares/               # Auth, Arcjet, error handling
├── models/                    # Mongoose models (User, Subscription)
├── routes/                    # Express route definitions
├── package.json               # Dependencies & scripts
└── .env.*.local               # Environment variables
```

---

## ⚙️ How It Works

- **User Registration**: `/api/v1/auth/sign-up` (returns JWT token)
- **User Login**: `/api/v1/auth/sign-in` (returns JWT token)
- **Authenticated Requests**: Send `Authorization: Bearer <token>` header
- **Subscription Endpoints**: `/api/v1/subscriptions` (CRUD operations, protected)
- **Rate Limiting & Bot Protection**: All routes protected by Arcjet middleware
- **Automated Reminders**: Scheduled jobs notify users before subscription renewals/expirations
- **Transactional Emails**: Welcome, password reset, renewal reminders, and payment alerts
- **Error Handling**: Centralized, consistent error responses

---

## 🏁 Getting Started

1. **Clone the repository**

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables** (`.env.development.local`)

4. **Start MongoDB** (local or Atlas)

5. **Run the server**

   ```bash
   npm run dev
   ```

6. **Test endpoints** using Thunder Client, Postman, or curl

---

## 🔑 Environment Variables

- `PORT` - Port to run the server
- `DB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret for JWT signing
- `JWT_EXPIRATION` - JWT token expiration (e.g. `1d`)
- `ARCJET_API_KEY` - Arcjet API key (for rate limiting & bot protection)
- `EMAIL_HOST` - SMTP host for email delivery
- `EMAIL_PORT` - SMTP port
- `EMAIL_USER` - SMTP username
- `EMAIL_PASS` - SMTP password

---

## 🔒 Security

- **Passwords** are hashed with bcryptjs
- **JWT** is used for stateless authentication
- **Arcjet** protects against bots, abuse, and common attacks
- **All sensitive config** is loaded from environment variables

---

## 💡 Example Usage

### Register a User

```http
POST /api/v1/auth/sign-up
Content-Type: application/json
{
  "name": "biswa",
  "email": "agentgaming892@gmail.com",
  "password": "123456"
}
```

### Login

```http
POST /api/v1/auth/sign-in
Content-Type: application/json
{
  "email": "agentgaming892@gmail.com",
  "password": "123456"
}
```

### Create a Subscription (Authenticated)

```http
POST /api/v1/subscriptions
Authorization: Bearer <token>
Content-Type: application/json
{
  "name": "Netflix",
  "category": "Video",
  "price": 15.99,
  "paymentMethod": "Credit Card"
}
```

---

## 📝 Notes

- All protected routes require a valid JWT in the `Authorization` header.
- Arcjet may block requests that look like bots or exceed rate limits.
- Adjust allowed categories and validation in `models/subscription.model.js` as needed.

---

## ✉️ Automated Reminders & Email Notifications

- **Subscription Renewal Reminders**: Users are automatically notified before their subscription is about to renew or expire. A scheduled workflow (using node-cron) checks for upcoming renewals and triggers notifications.
- **Email Notification Workflow**: Integrated with an email service (Nodemailer, SendGrid, etc.) to send transactional emails, including:
  - Welcome emails on registration
  - Password reset emails
  - Subscription renewal reminders
  - Payment confirmation and failure alerts

---

## 📄 License

MIT
