# Finance AI Advisor  
A full-stack MERN application that helps users track expenses, manage monthly budgets, upload CSV transaction reports, and receive AI-generated financial insights.  
The system includes authentication, budgeting, transaction management with duplicate detection, and monthly AI summaries.

---

## 🚀 Features

### 🔐 Authentication
- Register / Login using JWT  
- Secure password hashing using bcrypt  
- Protected API routes  

### 📊 Dashboard
- Monthly spending overview  
- Budget vs actual visualization  
- Pie chart for category-wise spending  
- Timeline chart for daily spending  
- AI-generated monthly insights  

### 💸 Transactions
- Add transactions manually  
- Upload CSV file (supports duplicate skipping or forced overwrite)  
- Auto-categorization of transactions  
- Filter by date and category  

### 📁 CSV Upload
Format required:
```
date,description,amount
2025-12-01,Swiggy Order,250
2025-12-01,Uber Ride,140
```

### 💼 Budgets
- Set total budget for the month  
- Set per-category budgets  
- Budget performance indicators (within, close, over)

### 🤖 AI Monthly Summary
- Auto-generated summary text  
- High-spending categories  
- Suggestions to reduce expenses  
- Suggested monthly savings goal  

### 📜 History Page
- Past AI summaries stored month-wise  

---

## 🏗️ Tech Stack

### Frontend  
- React (Vite)  
- TailwindCSS  
- Axios  
- Recharts  

### Backend  
- Node.js  
- Express  
- MongoDB + Mongoose  
- Multer (CSV upload)  
- JWT Authentication  
- Helmet & Rate Limiting (security)  
- dotenv for environment variables  

---

## 📦 Folder Structure

```
server/
  ├── src/
  │   ├── config/
  │   │   └── db.js
  │   ├── middleware/
  │   │   └── auth.js
  │   ├── models/
  │   │   ├── User.js
  │   │   ├── Transaction.js
  │   │   ├── Budget.js
  │   │   └── MonthlySummary.js
  │   ├── routes/
  │   │   ├── authRoutes.js
  │   │   ├── transactionRoutes.js
  │   │   ├── budgetRoutes.js
  │   │   └── summaryRoutes.js
  │   ├── utils/
  │   │   └── checkDuplicate.js
  │   └── index.js
  ├── package.json

client/
  ├── src/
  │   ├── components/
  │   ├── context/
  │   ├── pages/
  │   ├── lib/api.js
  │   └── main.jsx
  ├── package.json
```

---

## 🔧 Setup Instructions

### 1. Clone the repo
```
git clone https://github.com/yourusername/finance-ai-advisor.git
cd finance-ai-advisor
```

### 2. Install dependencies  
Backend:
```
cd server
npm install
```

Frontend:
```
cd client
npm install
```

### 3. Environment variables  
Create `.env` in `/server`:

```
PORT=5000
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_secret
```

### 4. Run Backend
```
cd server
npm run dev
```

### 5. Run Frontend
```
cd client
npm run dev
```

---

## 🧪 CSV Upload Requirements

### Required Columns:
- `date` (YYYY-MM-DD)
- `description`
- `amount`

### Example:
```
date,description,amount
2025-12-01,Swiggy Order,520
2025-12-01,Uber Ride,180
2025-12-02,Groceries,900
```

---

## 🚀 Deployment

### Backend (Vercel)
- Use `vercel.json` rewrites  
- Add `MONGO_URI`, `JWT_SECRET` as environment variables  
- Ensure `index.js` exports an Express handler  

### Frontend (Vercel / Netlify)
- Set `VITE_API_URL` to point to backend  

---

## 📌 Contact
For support, open an issue or contact the developer.

