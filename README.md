# Real Estate Management System

A comprehensive full-stack real estate management platform built with ASP.NET Core 9.0 and React. This system enables property listing, management, inquiry handling, and provides detailed analytics for administrators and agents.

## 🏗️ Architecture

This project follows a modern full-stack architecture:

- **Backend**: ASP.NET Core 9.0 Web API with Entity Framework Core
- **Frontend**: React 19.2 with Vite, TailwindCSS, and Radix UI
- **Database**: SQL Server (configurable for MySQL)
- **Authentication**: ASP.NET Core Identity with Cookie-based authentication

## ✨ Features

### For Clients
- 🔍 Browse and search available properties
- 📋 View detailed property information with images
- 💬 Submit inquiries for properties of interest
- 📊 Filter properties by type, price, location, and other criteria
- 👤 User registration and authentication

### For Agents
- 🏠 Create, update, and manage property listings
- 📸 Upload and manage property images
- 📨 View and respond to client inquiries
- 📈 Track property views and engagement
- 🔔 Manage property status (Available, Sold, Rented)

### For Administrators
- 📊 Comprehensive dashboard with statistics
- 👥 User management (Clients, Agents, Admins)
- 🏘️ Property management and oversight
- 📈 Analytics and reporting
  - Property distribution by city
  - Property distribution by type
  - Monthly statistics
  - Recent activity tracking
- 🔐 Role-based access control

## 🛠️ Technology Stack

### Backend
- **Framework**: ASP.NET Core 9.0
- **ORM**: Entity Framework Core 9.0
- **Database**: SQL Server / MySQL
- **Authentication**: ASP.NET Core Identity
- **Architecture**: Repository Pattern with Service Layer

### Frontend
- **Library**: React 19.2
- **Build Tool**: Vite 7.2
- **Styling**: TailwindCSS 4.1
- **UI Components**: Radix UI
- **State Management**: Zustand 5.0
- **Routing**: React Router DOM 7.13
- **Icons**: Lucide React

### Development Tools
- **Language**: C# 12 (.NET 9.0), JavaScript (ES6+)
- **IDE**: JetBrains Rider / Visual Studio
- **Package Manager**: NuGet, npm

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- [.NET 9.0 SDK](https://dotnet.microsoft.com/download/dotnet/9.0)
- [Node.js](https://nodejs.org/) (v18 or higher)
- [SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads) or [MySQL](https://dev.mysql.com/downloads/mysql/)
- A code editor (Visual Studio, VS Code, or JetBrains Rider)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd ProjetDotnet
```

### 2. Backend Setup

#### Configure Database Connection

Edit `ProjetDotnet/appsettings.json` and update the connection string:

**For SQL Server:**
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=RealEstateDB;Trusted_Connection=True;TrustServerCertificate=True"
  }
}
```

**For MySQL:**
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Port=3306;Database=RealEstateDB;User=root;Password=yourpassword;"
  }
}
```

#### Install Dependencies and Run Migrations

```bash
cd ProjetDotnet
dotnet restore
dotnet ef database update
```

#### Run the Backend

```bash
dotnet run
```

The API will be available at `https://localhost:5001` and `http://localhost:5000`

### 3. Frontend Setup

Open a new terminal window:

```bash
cd frontend
npm install
npm run dev
```

The React application will be available at `http://localhost:5173`

## 👥 Default User Accounts

The system comes with pre-seeded user accounts for testing:

### Administrator
- **Email**: admin@realestate.com
- **Password**: Admin123!
- **Role**: Admin

### Agent Accounts
- **Email**: agent1@realestate.com
- **Password**: Agent123!
- **Role**: Agent

- **Email**: agent2@realestate.com
- **Password**: Agent123!
- **Role**: Agent

### Client Account
- **Email**: client1@email.com
- **Password**: Client123!
- **Role**: Client

## 📁 Project Structure

### Backend Structure (`/ProjetDotnet`)

```
ProjetDotnet/
├── Controllers/
│   ├── Api/                      # API Controllers
│   │   ├── AuthController.cs     # Authentication endpoints
│   │   ├── PropertiesApiController.cs
│   │   ├── InquiriesApiController.cs
│   │   ├── MessagesApiController.cs
│   │   ├── StatisticsApiController.cs
│   │   └── UsersApiController.cs
│   └── PropertiesController.cs   # MVC Controller
├── Models/
│   ├── ApplicationUser.cs        # Extended Identity User
│   ├── Property.cs               # Property entity
│   ├── PropertyImage.cs          # Property images
│   ├── Inquiry.cs                # Client inquiries
│   └── Message.cs                # Messaging system
├── DTOs/                         # Data Transfer Objects
├── Repositories/                 # Data access layer
├── Services/                     # Business logic layer
│   ├── PropertyService.cs
│   ├── InquiryService.cs
│   ├── UserService.cs
│   ├── StatisticsService.cs
│   └── DatabaseSeeder.cs
├── Interfaces/
│   ├── Repository/               # Repository interfaces
│   └── Services/                 # Service interfaces
├── Data/
│   └── ApplicationDbContext.cs   # EF Core DbContext
├── Migrations/                   # Database migrations
├── Enums/
│   ├── PropertyType.cs
│   ├── PropertyStatus.cs
│   ├── TransactionType.cs
│   ├── InquiryStatus.cs
│   └── UserRole.cs
└── Program.cs                    # Application entry point
```

### Frontend Structure (`/frontend`)

```
frontend/
├── src/
│   ├── pages/
│   │   ├── Home.jsx              # Landing page
│   │   ├── Properties.jsx        # Property listings
│   │   ├── PropertyDetails.jsx   # Property detail view
│   │   ├── Signin.jsx            # Authentication
│   │   ├── Signup.jsx
│   │   ├── AgentProperties.jsx   # Agent dashboard
│   │   ├── AgentInquiries.jsx
│   │   ├── AdminLayout.jsx       # Admin layout
│   │   ├── AdminStatistics.jsx   # Admin dashboard
│   │   ├── AdminProperties.jsx
│   │   └── AdminUsers.jsx
│   ├── components/               # Reusable components
│   ├── stores/                   # Zustand state stores
│   ├── lib/                      # Utilities
│   ├── App.jsx                   # Main app component
│   └── main.jsx                  # Entry point
├── public/                       # Static assets
├── package.json
└── vite.config.js
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/user` - Get current user info

### Properties
- `GET /api/properties` - Get all properties (with pagination & filters)
- `GET /api/properties/{id}` - Get property by ID
- `POST /api/properties` - Create new property (Agent/Admin)
- `PUT /api/properties/{id}` - Update property (Agent/Admin)
- `DELETE /api/properties/{id}` - Delete property (Admin)

### Inquiries
- `GET /api/inquiries` - Get inquiries (filtered by role)
- `GET /api/inquiries/{id}` - Get inquiry by ID
- `POST /api/inquiries` - Create new inquiry
- `PUT /api/inquiries/{id}/status` - Update inquiry status
- `DELETE /api/inquiries/{id}` - Delete inquiry

### Messages
- `GET /api/messages/inquiry/{inquiryId}` - Get messages for inquiry
- `POST /api/messages` - Send new message

### Statistics (Admin only)
- `GET /api/statistics/dashboard` - Get dashboard statistics
- `GET /api/statistics/monthly` - Get monthly statistics
- `GET /api/statistics/properties-by-city` - Property distribution by city
- `GET /api/statistics/properties-by-type` - Property distribution by type

### Users (Admin only)
- `GET /api/users` - Get all users (with pagination)
- `GET /api/users/{id}` - Get user by ID
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user
- `PUT /api/users/{id}/toggle-active` - Activate/Deactivate user

## 🗄️ Database Schema

### Key Entities

#### ApplicationUser (extends IdentityUser)
- FirstName, LastName
- PhoneNumber
- IsActive
- Role (Admin, Agent, Client)

#### Property
- Title, Description
- Price, Area
- PropertyType (House, Apartment, Villa, etc.)
- PropertyStatus (Available, Sold, Rented)
- TransactionType (Sale, Rent)
- Address, City
- Bedrooms, Bathrooms, YearBuilt
- IsFeatured, ViewCount
- Owner (ApplicationUser)
- Images (Collection)
- Inquiries (Collection)

#### PropertyImage
- ImageUrl
- IsMain
- Property (Foreign Key)

#### Inquiry
- Property (Foreign Key)
- User (Client)
- Message
- Status (Pending, InProgress, Answered, Closed)
- Messages (Collection)

#### Message
- Inquiry (Foreign Key)
- Sender (ApplicationUser)
- Content
- Timestamp

## 🔒 Security Features

- **Authentication**: Cookie-based authentication with ASP.NET Core Identity
- **Authorization**: Role-based access control (Admin, Agent, Client)
- **Password Policy**: Configurable password requirements
- **CORS**: Configured for local development
- **XSS Protection**: React's built-in protections
- **SQL Injection Prevention**: Entity Framework parameterized queries

## 🧪 Development

### Running in Development Mode

**Backend:**
```bash
cd ProjetDotnet
dotnet watch run
```

**Frontend:**
```bash
cd frontend
npm run dev
```

### Building for Production

**Backend:**
```bash
cd ProjetDotnet
dotnet publish -c Release -o ./publish
```

**Frontend:**
```bash
cd frontend
npm run build
```

The production build will be in the `frontend/dist` directory.

## 📦 Database Migrations

### Create a new migration:
```bash
cd ProjetDotnet
dotnet ef migrations add <MigrationName>
```

### Apply migrations:
```bash
dotnet ef database update
```

### Remove last migration:
```bash
dotnet ef migrations remove
```

## 🎨 UI Components

The frontend uses a combination of:
- **Radix UI**: Accessible, unstyled UI components
- **TailwindCSS**: Utility-first CSS framework
- **Lucide React**: Beautiful icon library
- **Custom Components**: Built with shadcn/ui patterns

## 🔧 Configuration

### Backend Configuration (`appsettings.json`)
- Connection strings
- Logging levels
- CORS policies
- Identity options

### Frontend Configuration (`vite.config.js`)
- Development server port
- Proxy settings
- Build optimization

## 📝 Environment Variables

Create `appsettings.Development.json` for local development:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Your-Development-Connection-String"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Debug",
      "Microsoft.AspNetCore": "Information"
    }
  }
}
```

## 🐛 Troubleshooting

### Database Connection Issues
- Ensure SQL Server/MySQL is running
- Verify connection string in `appsettings.json`
- Check firewall settings

### Migration Issues
```bash
dotnet ef database drop --force
dotnet ef database update
```

### CORS Issues
- Verify frontend URL in CORS policy (Program.cs)
- Check browser console for detailed error messages

### Port Conflicts
- Backend default: 5000/5001
- Frontend default: 5173
- Change in `Properties/launchSettings.json` and `vite.config.js`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- ASP.NET Core team for the excellent framework
- React team for the amazing UI library
- Radix UI for accessible components
- TailwindCSS for the utility-first CSS framework

## 📧 Support

For support, email your-email@example.com or open an issue in the repository.

---

**Built with ❤️ using ASP.NET Core and React**

