# VisaConnect – Visa Application & Consultation Portal

VisaConnect is a modern, responsive visa application and consultation portal built using React.js and Vite. It allows users to explore visa destinations, submit visa applications, book consultations, and track application progress through an interactive interface.

**Live Demo:** https://visaconnect-portal.vercel.app/

**GitHub Repository:** https://github.com/gitayusshh/VisaConnect

## Features

- **Responsive Homepage:** Hero section, popular destinations, visa services, and an overview of the application process.
- **Country Explorer:** Browse visa destinations, search and filter countries, and view visa-related information.
- **Visa Application:** Multi-step application form with input validation, progress tracking, review, and confirmation.
- **Application Tracking:** Track applications using a unique application ID and view their current status.
- **Consultation Booking:** Submit a pending request, view your consultation statuses, and let an admin confirm or decline requests.
- **User Authentication:** Demo login with DummyJSON and browser-stored signup accounts.
- **Admin Dashboard:** The `ayush1234` account can review applications and consultation requests.
- **Contact Page:** Contact form and consultancy information.
- **Responsive UI:** Optimized for desktop, tablet, and mobile devices.

## Tech Stack

| Technology | Purpose |
|---|---|
| React.js | Frontend development |
| JavaScript (ES6+) | Application logic |
| Vite | Development and build tool |
| React Router | Client-side routing |
| CSS3 | Styling and responsive design |
| React Toastify | Notifications |
| DummyJSON API | Demo authentication and user data |
| LocalStorage | Client-side data persistence |
| Git & GitHub | Version control |
| Vercel | Deployment |

## Installation and Setup

### Prerequisites

- Node.js
- npm
- Git

### Run Locally

Clone the repository:

```bash
git clone https://github.com/gitayusshh/VisaConnect.git
```

Navigate to the project:

```bash
cd VisaConnect
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local URL displayed in the terminal.

### Production Build

```bash
npm run build
```

The optimized production files are generated in the `dist` directory.

## Demo Authentication and Roles


The application includes user and admin authentication for demonstration purposes.

**Admin Login Credentials**

- Username: `ayush1234 `
- Password: `ayush@7268`

**Admin account**

- Username: `ayush1234`
- Use the password set when signing up with this username.

Only the admin account can access `/dashboard` and `/admin`. Role checks are client-side demonstrations, not production security.

## Application Workflow

1. Explore available countries and visa services.
2. Select a destination and start a visa application.
3. Complete the application form and review the details.
4. Submit the application to generate a unique tracking ID.
5. Track the application using its ID.
6. Book a consultation using the available mock slots.
7. Admin `ayush1234` reviews requests from the dashboard; other users can track applications and see their consultation statuses.

## Application Tracking Demo

The portal includes sample tracking IDs to demonstrate different application statuses:

- `VC-DEMO001`
- `VC-DEMO002`
- `VC-DEMO003`
- `VC-DEMO004`
- `VC-DEMO005`

## Architecture Overview

The application follows a component-based React architecture:

- **Pages:** Individual application screens and workflows.
- **Components:** Reusable UI elements, including navigation and footer.
- **Routing:** React Router for navigation between pages.
- **Data:** Local country information and external demo API responses.
- **Storage:** Browser LocalStorage for applications and consultations.
- **Styling:** Global and premium CSS stylesheets.

## Implementation Notes and Limitations

- Visa applications and consultation bookings are simulated.
- Application and booking data are stored locally in the user's browser.
- Uploaded documents are not transmitted to a server.
- Application statuses are demonstrations, not updates from real visa authorities.
- Consultation availability is based on mock time slots.
- Signup accounts and application roles are stored or checked in the browser.
- Client-side role checks can be bypassed and are not suitable for real admin authorization.
- No real visa processing, payment, or backend database is included.

## AI Assistance Disclosure

AI-assisted development tools were used to support implementation, debugging, UI styling, and documentation. The application was developed, configured, tested, and deployed as part of a frontend technical assessment.

## Deployment

The application is deployed using Vercel, with source code maintained on GitHub.

**Live Application:** https://visaconnect-portal.vercel.app/

## Author

**Ayush Agnihotri**

Frontend Developer Technical Assessment Project

