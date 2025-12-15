# Salone Hub - Sierra Leone Civic Portal 🇸🇱

**Connect. Engage. Thrive.**

Salone Hub is a modern civic engagement portal designed to bridge the gap between the citizens of Sierra Leone and their government services. It provides a unified, user-friendly interface for accessing information, finding representatives, and getting answers to civic questions via an AI assistant.

![Salone Hub Preview](./public/og-image.png)

## ✨ Key Features

- **🤖 AI Civic Assistant**: A context-aware chatbot that answers questions about government procedures, fees, and locations in natural language.
- **📋 Service Directory**: A searchable database of government services (passports, licenses, business registration) with details on requirements, fees, and processing times.
- **👥 Representative Finder**: Easily locate and contact Members of Parliament, Counselors, and Mayors by district.
- **📰 Local News**: Stay updated with the latest civic and government news.
- **🌍 Multi-language Support**: Accessible in English and Krio (and more to come).
- **🌗 Dark/Light Mode**: Fully responsive design with theme support.
- **📱 PWA Ready**: Installable on mobile devices for offline access.

## 🛠️ Tech Stack

- **Frontend**: [React](https://react.dev/), [Vite](https://vitejs.dev/)
- **Backend/Database**: [Convex](https://convex.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Internationalization**: [i18next](https://www.i18next.com/)

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/salone-hub.git
    cd salone-hub
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Start the development server**
    ```bash
    npm run dev
    ```
    This command starts both the Vite frontend server and the Convex backend.

4.  **Open the app**
    Visit `http://localhost:5173` in your browser.

## 📦 Building for Production

To create a production-ready build:

```bash
npm run build
```

This acts as a full validation step, running TypeScript checks and assembling the static assets.

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements.

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
