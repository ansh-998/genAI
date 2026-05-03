# Project Documentation: genAI
**An AI-Powered Interview Preparation & Resume Tailoring System**

---

## 1. Project Overview
**genAI** is a full-stack application designed to help job seekers prepare for interviews by analyzing their resumes against specific job descriptions. It leverages Google's Gemini 2.0 Flash model to generate personalized interview questions, identify skill gaps, and create structured preparation roadmaps.

---

## 2. Technical Architecture

### **High-Level Stack**
- **Frontend:** React (Vite), SCSS, React Router 7, Axios, Context API.
- **Backend:** Node.js, Express.js.
- **Database:** MongoDB (Mongoose ODM).
- **AI Engine:** Google Gemini 2.0 Flash (via `@google/genai`).
- **PDF Engine:** Puppeteer (Headless Chrome) & pdf-parse.

### **Architecture Diagram**
```text
[User] <--> [React Frontend] <--> [Express API] <--> [MongoDB]
                                        |
                                        +--> [Gemini AI]
                                        +--> [Puppeteer PDF Engine]
```

---

## 3. Core Workflows & Data Flow

### **A. Interview Report Generation**
1. **Input:** User submits `resume` (PDF), `jobDescription` (Text), and `selfDescription` (Text).
2. **Text Extraction:** Backend uses `pdf-parse` to extract text from the uploaded PDF buffer.
3. **AI Prompting:** The `ai.service.js` constructs a prompt for Gemini. It uses **Zod** to define a strict JSON schema, ensuring the AI returns a valid, parseable object.
4. **Data Structure:**
   - **Match Score:** 0-100.
   - **Technical Questions:** Question, Intention, Model Answer.
   - **Behavioral Questions:** Question, Intention, Model Answer.
   - **Skill Gaps:** Skill name and Severity (low/medium/high).
   - **Roadmap:** Day-by-day task list.
5. **Storage:** The resulting JSON is merged with user metadata and saved to the `InterviewReport` collection.

### **B. AI-Tailored Resume PDF**
1. **Logic:** Uses the existing data from a generated report.
2. **AI Generation:** Gemini is asked to generate a **complete HTML/CSS** resume tailored to the JD.
3. **Rendering:** The HTML is passed to **Puppeteer**.
4. **Export:** Puppeteer renders the HTML in a virtual A4 page and generates a PDF buffer, which is sent to the client as an attachment.

---

## 4. Database Schema (Mongoose)

### **User Model**
- `username`, `email`, `password` (hashed).

### **InterviewReport Model**
- `jobDescription`, `resume` (extracted text), `selfDescription`.
- `matchScore` (Number).
- `technicalQuestions` (Array of Objects).
- `behavioralQuestions` (Array of Objects).
- `skillGaps` (Array of Objects).
- `preparationPlan` (Array of Day Objects).
- `user` (Reference to User Model).

---

## 5. API Endpoints

### **Auth Routes (`/api/auth`)**
- `POST /register`: Create new account.
- `POST /login`: Authenticate and set HttpOnly cookie.
- `GET /logout`: Clear cookie and blacklist token.
- `GET /get-me`: Get profile of currently logged-in user.

### **Interview Routes (`/api/interview`)**
- `POST /`: Generate a new report (Requires PDF upload).
- `GET /`: List all reports for the logged-in user (summarized).
- `GET /report/:interviewId`: Fetch full details of a specific report.
- `POST /resume/pdf/:interviewReportId`: Generate and download the tailored resume PDF.

---

## 6. Frontend Organization

### **Features Directory Structure**
- `features/auth/`: Context, hooks, and pages for Login/Register.
- `features/interview/`:
  - `interview.context.jsx`: Manages loading states and report data.
  - `pages/Home.jsx`: Dashboard for uploading and listing reports.
  - `pages/Interview.jsx`: Detailed view with tabs for Questions, Roadmap, and Score.

### **State Management**
- **AuthContext:** Tracks the `user` object and `isAuthenticated` status globally.
- **InterviewContext:** Handles the active `report` and the list of previous `reports`.

---

## 7. Key Configuration Files
- **Backend `.env`:** Contains `PORT`, `MONGO_URI`, `JWT_SECRET`, and `GOOGLE_GENAI_API_KEY`.
- **Frontend `vite.config.js`:** Configured for React and SCSS processing.

---

## 8. Summary for Future Revision
If you are looking at this after 6 months:
- The **"Magic"** happens in `Backend/src/services/ai.service.js` where prompts are engineered.
- The **PDF handling** is split between `file.middleware.js` (upload) and Puppeteer (export).
- The **Frontend layout** is heavily dependent on `interview.scss` for the side-nav and dashboard feel.
