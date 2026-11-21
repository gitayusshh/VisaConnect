# VisaConnect – Visa Application & Consultation Portal

VisaConnect is a modern, responsive web application built using **React.js and Vite**. The platform provides a simulated visa consultancy experience where users can explore international destinations, submit visa applications, schedule consultations, and track application progress.

The project demonstrates frontend development skills, including reusable React components, client-side routing, form validation, API integration, authentication workflows, and responsive UI design.

**Live Demo:** https://visaconnect-portal.vercel.app/

**GitHub Repository:** https://github.com/gitayusshh/VisaConnect

---

## Features

### 1. Homepage
- Modern, responsive landing page with intuitive navigation.
- Popular visa destinations and service categories.
- Step-by-step explanation of the application process.
- Testimonials and clear call-to-action buttons.

### 2. Country Explorer
- Browse popular international destinations.
- Search and filter countries.
- View country-specific visa information.
- Explore available visa categories, estimated processing times, and indicative service fees.

### 3. Visa Application
- Multi-step application form with input validation.
- Progress indicator and application review.
- Unique application ID generation after submission.
- Application details stored locally for demonstration.

### 4. Application Tracking
- Track submitted applications using a unique tracking ID.
- View application progress and current status.
- Visual status indicators for different processing stages.

### 5. Consultation Booking
- Schedule consultations using available demo time slots.
- Submit consultation requests.
- View booking details and consultation status.
- Admin review functionality for confirming or declining requests.

### 6. User Authentication
- User registration with a self-selected username and password.
- Login using registered account credentials.
- Browser-based session handling for demonstration.
- Protected routes for authenticated users.
- Client-side access checks for administrative features.

### 7. User Dashboard
- View submitted visa applications.
- Access consultation booking information.
- Monitor application and consultation statuses.
- Navigate to important portal features.

### 8. Admin Dashboard
- Review submitted visa applications.
- Manage application statuses.
- Review consultation requests.
- Confirm or decline consultation bookings.
- Demonstrate role-based access within the frontend.

### 9. Contact Page
- Contact form with input validation.
- Consultancy contact information.

### 10. Responsive Design
- Responsive layouts for desktop, tablet, and mobile devices.
- Reusable UI components and consistent styling.
- Interactive forms, navigation, and notifications.

---

## Tech Stack

| Technology | Purpose |
|---|---|
| React.js | Frontend UI development |
| JavaScript (ES6+) | Application logic |
| Vite | Development server and production build |
| React Router | Client-side routing |
| CSS3 | Styling and responsive layouts |
| Lucide React | Icons |
| React Toastify | User notifications |
| DummyJSON API | Sample user data integration |
| Browser LocalStorage | Client-side data persistence |
| Git & GitHub | Version control |
| Vercel | Application deployment |

---

## Installation and Setup

### Prerequisites

Make sure the following are installed:

- Node.js
- npm
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/gitayusshh/VisaConnect.git
```

### 2. Navigate to the Project

```bash
cd VisaConnect
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start the Development Server

```bash
npm run dev
```

Open the local development URL displayed in the terminal, usually:

`http://localhost:5173`

### 5. Build for Production

```bash
npm run build
```

The production-ready files will be generated in the `dist` directory.

---

## Authentication and User Roles

VisaConnect includes a simulated authentication system designed for frontend demonstration.

### User Registration

1. Open the Signup page.
2. Enter the required registration information.
3. Choose a username and password.
4. Complete registration.
5. Log in using the registered credentials.

### User Access

Authenticated users can access the dashboard to view their applications and consultation details.

### Administrative Access

The application also includes administrative functionality for reviewing visa applications and consultation requests.

Administrative access is determined by the application's demo role-checking logic.

**No predefined admin credentials are provided in this documentation.**

**Security Notice:** Authentication and role checks are implemented on the client side for demonstration purposes. This approach is not suitable for production authentication or authorization.

---

## Application Workflow

1. **Explore Destinations:** Browse available countries and visa services.
2. **Create an Account:** Register and log in to the portal.
3. **Apply for a Visa:** Complete the multi-step application form.
4. **Submit Application:** Review the entered information and submit the form.
5. **Receive Tracking ID:** Obtain a unique application reference.
6. **Track Progress:** Enter the tracking ID to view application status.
7. **Book Consultation:** Select a demo time slot and submit a consultation request.
8. **Access Dashboard:** View application and consultation information.
9. **Administrative Review:** Authorized demo administrators can review applications and consultation requests.

---

## Application Tracking Demo

The application includes sample tracking IDs to demonstrate different application statuses.

```text
VC-DEMO001
VC-DEMO002
VC-DEMO003
VC-DEMO004
VC-DEMO005
```

Users can enter these IDs on the tracking page to explore the demonstration workflow.

---

## Project Structure

```text
VisaConnect/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── CountryCard.jsx
│   │   ├── Footer.jsx
│   │   ├── Navbar.jsx
│   │   └── ProtectedRoute.jsx
│   ├── data/
│   │   └── countries.js
│   ├── pages/
│   │   ├── AdminApplications.jsx
│   │   ├── ApplyVisa.jsx
│   │   ├── Consultation.jsx
│   │   ├── Contact.jsx
│   │   ├── Countries.jsx
│   │   ├── CountryDetails.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   ├── TrackApplication.jsx
│   │   └── Users.jsx
│   ├── services/
│   │   ├── api.js
│   │   └── consultations.js
│   ├── styles/
│   │   ├── global.css
│   │   └── premium.css
│   ├── App.jsx
│   └── main.jsx
├── package.json
├── vite.config.js
├── vercel.json
└── README.md
```

---

## Architecture Overview

VisaConnect follows a component-based frontend architecture.

**Presentation Layer:** React components and pages handle the user interface.

**Routing Layer:** React Router manages navigation and protected routes.

**Data Layer:** Static JavaScript data and external demo API responses provide information to the frontend.

**Storage Layer:** Browser LocalStorage stores simulated account, application, and consultation information.

**Service Layer:** Service modules organize API-related and consultation-related functionality.

**Styling Layer:** Global and premium CSS stylesheets provide responsive layouts and visual consistency.

---

## Implementation Notes and Limitations

VisaConnect is a frontend demonstration project and does not provide actual immigration or visa processing services.

- No production backend or centralized database is implemented.
- Application and consultation information is stored in the browser.
- Data may not be shared across different devices or browsers.
- Clearing browser storage may remove locally saved records.
- Visa application statuses are simulated.
- Consultation time slots and booking confirmations are demonstrations.
- Uploaded documents are not transmitted to a production server.
- Client-side authentication and role checks do not provide production-grade security.
- No real payments or visa processing are performed.

For a production implementation, the application would require secure backend authentication, server-side authorization, database integration, document storage, and appropriate data protection measures.

---

## AI Assistance Disclosure

AI-assisted development tools were used to support implementation, debugging, UI styling, and documentation.

The project was configured, tested, and deployed as part of a frontend development technical assessment.

---

## Deployment

VisaConnect is deployed on **Vercel**, with the source code maintained on **GitHub**.

**Live Application:** https://visaconnect-portal.vercel.app/

**Source Code:** https://github.com/gitayusshh/VisaConnect

---

## Author

**Ayush Agnihotri**

Frontend Developer Technical Assessment Project


