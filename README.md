# JSON Editor

A simple, intuitive JSON editor built with HTML, CSS, and JavaScript, with Supabase for authentication and storage.

## Features

- JSON syntax highlighting
- JSON validation and formatting
- User authentication (signup, login, logout)
- Save and load JSON documents
- Responsive design

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/json-editor.git
cd json-editor
```

### 2. Set up Supabase

1. Create a Supabase account at [https://supabase.com](https://supabase.com)
2. Create a new project
3. Go to SQL Editor and run the SQL commands from `supabase/schema.sql`
4. Get your Supabase URL and anon key from the API settings

### 3. Configure the application

1. Create a `.env` file in the root directory based on `.env.example`
2. Add your Supabase URL and anon key to the `.env` file:

```
VITE_SUPABASE_URL=https://your-supabase-url.supabase.co
VITE_SUPABASE_KEY=your-supabase-anon-key
```

> **Note**: The `.env` file contains sensitive information and should never be committed to your repository.

### 4. Install dependencies

```bash
npm install
```

### 5. Run the application

#### Development mode

```bash
npm run dev
```

This will start a development server with hot-reloading at `http://localhost:3000`.

#### Production build

```bash
npm run build
```

This will create a production-ready build in the `dist` directory.

#### Deployment script

```bash
npm run deploy
```

This script will:
1. Check for a `.env` file and create one from `.env.example` if needed
2. Build the application for production
3. Provide instructions for deploying to your hosting provider

### 6. Deployment

After building the application, you can deploy it to various hosting platforms:

#### Option 1: Vercel (Recommended)

We've included a detailed guide for deploying to Vercel:

```bash
# View the Vercel deployment guide
cat VERCEL_DEPLOYMENT.md
```

Or simply run:

```bash
npm run deploy:vercel
```

#### Option 2: Other static hosting (Netlify, GitHub Pages)

1. Build the application: `npm run build`
2. Deploy the `dist` directory to your hosting provider

#### Option 3: Node.js hosting

1. Build the application: `npm run build`
2. Copy the `dist` directory to your server
3. Serve the files using a web server like Nginx or Apache

#### Environment Variables in Production

When deploying to production, you'll need to set the environment variables on your hosting platform:

- For Netlify/Vercel: Configure environment variables in their dashboard (use `VITE_SUPABASE_URL` and `VITE_SUPABASE_KEY`)
- For traditional hosting: Set environment variables on your server or use a `.env` file

## Usage

1. **Create a new JSON document**: Click the "New" button to start with a blank document
2. **Format JSON**: Click the "Format" button to pretty-print your JSON
3. **Validate JSON**: Click the "Validate" button to check if your JSON is valid
4. **Save a document**: Sign up or log in, then click the "Save" button
5. **Load a document**: Click the "Load" button to see your saved documents

## License

MIT
