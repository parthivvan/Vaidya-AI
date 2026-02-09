# 🏥 MediFlow AI - Advanced Healthcare Ecosystem

![Status](https://img.shields.io/badge/Status-Beta-blue)
![MERN](https://img.shields.io/badge/Stack-MERN-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

**MediFlow AI** is a comprehensive, full-stack healthcare platform designed to bridge the gap between patients, doctors, and diagnostic centers. It goes beyond simple appointment booking to offer a complete medical ecosystem including an E-Pharmacy, Smart Lab Booking, and a sophisticated Super Admin monitoring suite.

---

## 🚀 Features & Modules

### 🧑‍🦱 **Patient Portal**
* **Smart Appointment Booking:** Real-time slot availability with conflict detection (no double-booking).
* **E-Pharmacy:** Full-fledged e-commerce store for medicines with cart management and category filtering.
* **Smart Lab Tests:** Book diagnostic tests with "Home Collection" vs. "Lab Visit" indicators.
* **Location Intelligence:** Auto-detects user city to filter nearby lab services.
* **AI Prescription Analysis:** (Beta) Upload a prescription to auto-suggest required tests.

### 👨‍⚕️ **Doctor Dashboard**
* **Live Schedule:** View upcoming appointments in real-time.
* **Patient Management:** Access patient history and appointment reasons.
* **Secure Access:** Role-Based Access Control (RBAC) ensuring doctors only see their data.

### 🕵️‍♂️ **Super Admin (God Mode)**
* **The "Spy Log":** An audit trail that logs every sensitive action (e.g., "Dr. X viewed Patient Y's report").
* **Live User Map:** Tracks active users and their real-time locations across the platform.
* **Global Stats:** Monitor total revenue, server health, and security events.

---

## 🛠️ Tech Stack

* **Frontend:** React.js (Vite), Tailwind CSS, Lucide React (Icons).
* **Backend:** Node.js, Express.js.
* **Database:** MongoDB Atlas (Mongoose ODM).
* **Authentication:** JWT (JSON Web Tokens) & Local Storage.
* **Integrations:** OpenStreetMap (Geolocation), Google Gemini (Planned for AI Analysis).

---

## ✅ Project Checklist (Status)

### **Completed Modules** 🟢
- [x] **Authentication System** (Login/Register with RBAC).
- [x] **Doctor Dashboard** (Appointments & Stats).
- [x] **Patient Dashboard** (Booking Flow).
- [x] **Pharmacy Store** (Cart, Categories, Search).
- [x] **Lab Test Booking** (Location Detection, Home/Lab Filter).
- [x] **Super Admin Dashboard** (Spy Log, User Map).
- [x] **Backend API** (RESTful architecture for Users, Doctors, Orders, Logs).

### **In Progress / Next Steps** 🟡
- [ ] **AI Integration:** Connect Google Gemini API to the "Prescription Analyzer" UI.
- [ ] **Payment Gateway:** Integrate Stripe/Razorpay for checkout.
- [ ] **Email Notifications:** Send confirmation emails via Nodemailer.

---

## ⚙️ Installation & Setup

1. **Clone the Repo**
   ```bash
   git clone <YOUR_GITHUB_REPO_URL>
   cd mediflow-ai
Backend Setup

Bash
cd server-node
npm install
# Create a .env file with: PORT=5001, MONGO_URI=..., JWT_SECRET=...
npm start
Frontend Setup

Bash
cd client
npm install
npm run dev
📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

👨‍💻 Created by Solomon Pattapu

---


MIT License

Copyright (c) 2026 Solomon Pattapu

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.