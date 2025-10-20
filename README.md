# 🚀 AmigosCode Project Starter Template

A modern, production-ready Next.js starter template with TypeScript, Tailwind CSS 4, and developer-friendly tooling.

## ✨ Features

- **⚡ Next.js 15** - Latest App Router with React 19
- **🎨 Tailwind CSS 4** - Latest version with Lightning CSS
- **🔧 TypeScript** - Full type safety
- **📦 Axios** - HTTP client with interceptors and error handling
- **🎯 ESLint** - Code linting and quality
- **💅 Prettier** - Code formatting with import sorting
- **🐶 Husky** - Git hooks for code quality
- **🎭 Custom Components** - Reusable UI components and icons
- **📱 Responsive Design** - Mobile-first approach
- **🔒 Type Safety** - Full TypeScript support

## 🛠️ Tech Stack

| Technology                                    | Version     | Purpose         |
| --------------------------------------------- | ----------- | --------------- |
| [Next.js](https://nextjs.org/)                | 15.0.3      | React framework |
| [React](https://react.dev/)                   | 19.0.0-rc.1 | UI library      |
| [TypeScript](https://www.typescriptlang.org/) | 5.x         | Type safety     |
| [Tailwind CSS](https://tailwindcss.com/)      | 4.0.0       | Styling         |
| [Axios](https://axios-http.com/)              | 1.10.0      | HTTP client     |
| [ESLint](https://eslint.org/)                 | 8.x         | Code linting    |
| [Prettier](https://prettier.io/)              | 3.2.4       | Code formatting |
| [Husky](https://typicode.github.io/husky/)    | 8.0.3       | Git hooks       |

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v20 or higher) - [Download here](https://nodejs.org/)
- **PNPM** package manager - [Installation guide](https://pnpm.io/installation)

## 🚀 Quick Start

1. **Clone the repository**

   ```bash
   git clone https://github.com/amigoscode/amigoscode-starter-web.git
   cd amigoscode-starter-web
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Start the development server**

   ```bash
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── src/
│   ├── components/        # Reusable components
│   ├── hooks/            # Custom React hooks
│   ├── services/         # API services
│   ├── icons/            # SVG icons
│   ├── fonts.ts          # Font configuration
│   └── globals.css       # Global styles
├── public/               # Static assets
├── docs/                 # Documentation
└── config files          # Various configuration files
```

## 🎯 Available Scripts

| Script                 | Description               |
| ---------------------- | ------------------------- |
| `pnpm dev`             | Start development server  |
| `pnpm build`           | Build for production      |
| `pnpm start`           | Start production server   |
| `pnpm lint`            | Run ESLint                |
| `pnpm prettier:format` | Format code with Prettier |

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# API Configuration
NEXT_PUBLIC_API_URL=https://your-api.com

# Add other environment variables as needed
```

### Tailwind CSS

The template uses Tailwind CSS 4 with custom configuration:

- Custom fonts (Inter, Montserrat)
- Custom animations and keyframes
- Responsive design utilities

### TypeScript

Full TypeScript support with:

- Strict type checking
- Path aliases (`@/` for `src/`)
- Type-safe API calls

## 📚 Documentation

- [Tailwind CSS 4 Migration](./docs/tailwind-migration.md)
- [Component Library](./docs/components.md)
- [API Integration](./docs/api-integration.md)
- [Deployment Guide](./docs/deployment.md)

## 🌟 Key Features

### 🎨 Modern Styling

- **Tailwind CSS 4** with Lightning CSS engine
- **Custom animations** and keyframes
- **Responsive design** patterns
- **Dark mode** ready

### 🔌 API Integration

- **Axios client** with interceptors
- **Type-safe API calls**
- **Error handling** and logging
- **Authentication** support

### 🧩 Component Library

- **Reusable components** (ProductCard, Orb, etc.)
- **Icon system** with SVG components
- **Custom hooks** for common patterns
- **TypeScript interfaces**

### 🛠️ Developer Experience

- **ESLint** configuration
- **Prettier** with import sorting
- **Husky** pre-commit hooks
- **TypeScript** strict mode

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feat/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feat/amazing-feature`)
5. **Open** a Pull Request

### Branch Naming Convention

- **Feature**: `feat/feature-name`
- **Bug Fix**: `fix/bug-description`
- **Documentation**: `docs/documentation-update`
- **Refactor**: `refactor/component-name`

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [AmigosCode](https://amigoscode.com) - For the amazing learning platform
- [Next.js](https://nextjs.org/) - For the incredible React framework
- [Tailwind CSS](https://tailwindcss.com/) - For the utility-first CSS framework
- [Vercel](https://vercel.com/) - For the deployment platform

## 📞 Support

- **Website**: [amigoscode.com](https://amigoscode.com)
- **GitHub Issues**: [Report a bug](https://github.com/amigoscode/amigoscode-starter-web/issues)
- **Discord**: [Join our community](https://discord.gg/amigoscode)
