# React Chat Application with Role-Based Authority

A comprehensive React chat application featuring role-based access control, real-time messaging, product selling, payment processing, and multi-language translation support.

## 🎯 Features

### 🔐 User Authentication & Roles
- **Login/Register System** with local storage persistence
- **Role Hierarchy**: Admin → Staff → Agent
- **Role-based Permissions**:
  - **Admin**: Can chat with everyone, sell products, manage users
  - **Staff**: Can chat with Admin and other Staff
  - **Agent**: Can chat with Admin and Staff only

### 💬 Chat System
- **Real-time Messaging** with role-based restrictions
- **Message History** saved in localStorage
- **Role Badges** on messages and user profiles
- **Admin Message Highlighting** with special styling
- **Unread Message Counters**
- **User Online/Offline Status**

### 🌐 Multi-Language Translation
- **Translate Button** on each message
- **Supported Languages**: English, Hindi, Marathi, French, Spanish, German, Chinese, Japanese
- **Language Detection** and translation preferences
- **Simulated Google Translate API**

### 🛍️ Product Selling
- **Product Cards** with images, descriptions, and pricing
- **Admin-only Product Creation** within chat
- **Buy Now Buttons** integrated in messages
- **Product Catalog** management

### 💳 Payment Gateway
- **Stripe Integration** (simulated)
- **Secure Checkout Process**
- **Transaction History** tracking
- **Receipt Generation**
- **Payment Validation**

### 🎨 Modern UI/UX
- **Responsive Design** for all devices
- **Tailwind CSS** styling
- **Smooth Animations** and transitions
- **Dark Mode Support**
- **Custom Scrollbars**

## 📁 Project Structure

```
src/
├── components/
│   ├── ChatWindow.jsx      # Main chat interface
│   ├── MessageBubble.jsx   # Individual message component
│   ├── RoleBadge.jsx       # Role display component
│   ├── ProductCard.jsx     # Product display/selling
│   └── TranslateButton.jsx # Translation functionality
├── pages/
│   ├── Login.jsx          # Authentication page
│   ├── ChatRoom.jsx       # Main chat room
│   └── Checkout.jsx       # Payment processing
├── context/
│   ├── AuthContext.jsx    # User authentication
│   └── ChatContext.jsx    # Chat state management
├── utils/
│   ├── roles.js           # Role permissions
│   ├── payment.js         # Payment processing
│   └── translate.js       # Translation utilities
└── App.jsx               # Main application
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd chat_application
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 👥 Demo Accounts

Use these pre-configured accounts to test different roles:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@demo.com | admin123 |
| Staff | staff@demo.com | staff123 |
| Agent | agent@demo.com | agent123 |

## 🔧 Configuration

### Role Hierarchy
The application implements a strict role hierarchy:
- **Admin** can interact with all users
- **Staff** can interact with Admin and other Staff
- **Agent** can interact with Admin and Staff only

### Translation Settings
- Default language: English
- Supported languages: English, Hindi, Marathi, French, Spanish, German, Chinese, Japanese
- Translation preferences are saved in localStorage

### Payment Processing
- Simulated Stripe integration
- Test card numbers accepted
- Transaction history stored locally

## 🎨 Customization

### Styling
The application uses Tailwind CSS with custom configurations:
- Custom color palette for roles
- Responsive design breakpoints
- Animation utilities
- Custom shadows and effects

### Adding New Features
1. **New Roles**: Update `src/utils/roles.js`
2. **New Languages**: Update `src/utils/translate.js`
3. **Payment Methods**: Extend `src/utils/payment.js`

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones
- Different screen orientations

## 🔒 Security Features

- **Role-based Access Control** (RBAC)
- **Protected Routes** for authenticated users
- **Input Validation** for forms
- **Secure Payment Processing** simulation
- **Local Storage** for data persistence

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel/Netlify
1. Push your code to GitHub
2. Connect your repository to Vercel/Netlify
3. Deploy automatically

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the demo accounts for testing
- Review the code comments for implementation details

## 🔮 Future Enhancements

- [ ] Real-time WebSocket integration
- [ ] File sharing capabilities
- [ ] Voice and video calls
- [ ] Advanced analytics dashboard
- [ ] Mobile app development
- [ ] Backend API integration
- [ ] Database integration
- [ ] Push notifications

---

**Built with ❤️ using React, Tailwind CSS, and modern web technologies**
"# chat-application" 
