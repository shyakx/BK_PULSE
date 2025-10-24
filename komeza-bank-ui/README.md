# BK Pulse - Retention Department Platform

A comprehensive retention management platform built specifically for Bank of Kigali's Retention Department. This application provides role-based dashboards, campaign management, and customer retention tools for the retention team.

## 🚀 Features

- **Role-Based Dashboards**: Specialized interfaces for HOD, Senior Managers, Data Analysts, and Officers
- **Retention KPIs**: Real-time tracking of retention rates, churn reduction, and BK Capital sales
- **Campaign Management**: Create and monitor retention campaigns with automated tracking
- **Customer 360° View**: Complete customer profiles with churn scores and AI recommendations
- **BK Capital Integration**: Focus on Aguka, Tekana, and PPS product sales
- **Quality Assurance**: Call monitoring and performance tracking tools

## 🛠️ Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Routing**: React Router DOM
- **Build Tool**: Vite
- **Icons**: Heroicons (SVG)
- **Fonts**: Inter & Poppins (Google Fonts)

## 📁 Project Structure

```
komeza-bank-ui/
├── public/
│   ├── logo.png
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── Input.jsx
│   │   ├── LayoutWrapper.jsx
│   │   ├── RoleGuard.jsx
│   │   └── Sidebar.jsx
│   ├── pages/
│   │   ├── HODDashboard.jsx
│   │   ├── SeniorManagerDashboard.jsx
│   │   ├── DataAnalystDashboard.jsx
│   │   ├── OfficerDashboard.jsx
│   │   ├── CallQueue.jsx
│   │   ├── KnowledgeHub.jsx
│   │   ├── CampaignManagement.jsx
│   │   └── [other retention pages]
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── utils/
│   │   └── roles.js
│   ├── services/
│   │   └── api.ts
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── tailwind.config.js
├── package.json
└── README.md
```

## 🎨 Design System

### Colors
- **Primary**: Blue gradient (#3b82f6 to #1e3a8a)
- **Secondary**: Gray scale (#f8fafc to #0f172a)
- **Accent**: Green (#22c55e)
- **Danger**: Red (#ef4444)

### Typography
- **Display**: Poppins (headings)
- **Body**: Inter (content)

### Components
- **Buttons**: Primary, Secondary, Outline, Ghost variants
- **Cards**: Soft, Medium, Strong shadow variants
- **Inputs**: With validation states and icons
- **Navigation**: Responsive with mobile menu

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd komeza-bank-ui
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📱 Pages

### Role-Based Dashboards
- **HOD Dashboard**: Strategic oversight, KPIs, branch performance, product penetration
- **Senior Manager Dashboard**: Operational metrics, campaign management, team performance
- **Data Analyst Dashboard**: Model monitoring, customer insights, data pipeline status
- **Officer Dashboard**: Customer 360° view, call queue, performance tracking

### Specialized Pages
- **Call Queue**: Prioritized customer contact list with filtering
- **Knowledge Hub**: Product information, scripts, and best practices
- **Campaign Management**: Create and manage retention campaigns
- **Quality Assurance**: Call monitoring and performance tracking

## 🔧 Configuration

### Tailwind CSS
The project uses a custom Tailwind configuration with:
- Extended color palette
- Custom shadows
- Typography plugin
- Forms plugin

### Environment Variables
Create a `.env` file for environment-specific configurations:
```env
VITE_API_URL=your_api_url
VITE_APP_NAME=BK Pulse
```

## 📊 Key Metrics

- **Retention Rate**: 94.2%
- **Churn Reduction**: 12.5%
- **BK Capital Sales**: Aguka, Tekana, PPS conversion tracking
- **Call Quality Score**: 4.2/5.0
- **Campaign Success Rate**: 87.5%

## 🔒 Security & Compliance

- Built with Rwanda Law No. 058/2021 compliance in mind
- Data encryption and anonymization
- Role-based access control
- Audit trails and logging

## 👥 Team

- **Samuel MUTINDA** - Head, Data & Analytics
- **Steven SHYAKA** - Machine Learning Engineer
- **Alphonse MUHAYIMANA** - Business Applications Lead
- **Francine UMULISA** - Customer Experience Manager
- **Herve TWAHIRWA** - Data Scientist
- **Sandra UWADEDE** - Business Applications Specialist

## 📄 License

This project is proprietary software developed for Bank of Kigali.

## 🤝 Contributing

This is an internal project for Bank of Kigali. For contributions, please contact the development team.

## 📞 Support

For technical support or questions:
- Email: komeza.support@bk.rw
- Phone: +250 788 000 000
- Address: Bank of Kigali, KN 4 Ave, Kigali, Rwanda