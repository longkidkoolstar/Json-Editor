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

#### Option 1: Using environment variables (recommended)

1. Create a `.env` file in the project root with the following variables:

```
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
```

2. Install dependencies:

```bash
npm install
```

#### Option 2: Direct configuration

1. Open `js/config.js`
2. Replace the placeholder values with your Supabase URL and anon key:

```javascript
const SUPABASE_URL = 'https://your-supabase-url.supabase.co';
const SUPABASE_KEY = 'your-supabase-anon-key';
```

### 4. Run the application

#### Using the included Node.js server (recommended):

```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

#### Using other servers:

You can use any local server to run the application. For example:

##### Using Python:

```bash
# Python 3
python -m http.server

# Python 2
python -m SimpleHTTPServer
```

##### Using Node.js http-server:

```bash
# Install http-server if you haven't already
npm install -g http-server

# Run the server
http-server
```

**Note**: When using servers other than the included Node.js server, environment variables will not be available to the client.

Then open your browser and navigate to `http://localhost:8000` (or whatever port your server is using).

## Usage

1. **Create a new JSON document**: Click the "New" button to start with a blank document
2. **Format JSON**: Click the "Format" button to pretty-print your JSON
3. **Validate JSON**: Click the "Validate" button to check if your JSON is valid
4. **Save a document**: Sign up or log in, then click the "Save" button
5. **Load a document**: Click the "Load" button to see your saved documents

## Deployment to Vercel

1. Push your code to GitHub (make sure `.env` is in `.gitignore`).

2. Create a new project on Vercel and connect it to your GitHub repository.

3. In the Vercel project settings, add the following environment variables:
   - `SUPABASE_URL`
   - `SUPABASE_KEY`

4. Deploy your project.

## How Environment Variables Work

- The server exposes environment variables to the client via the `/env-config.js` endpoint.
- The client loads these variables before loading the application code.
- The application uses these variables for Supabase configuration.

## License

MIT
