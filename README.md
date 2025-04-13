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

1. Copy the `.env.example` file to `.env`:

```bash
cp .env.example .env
```

2. Edit the `.env` file and add your Supabase URL and anon key:

```
SUPABASE_URL=https://your-supabase-url.supabase.co
SUPABASE_KEY=your-supabase-anon-key
DOCUMENTS_TABLE=json_documents
```

### 4. Run the application

You can use any local server to run the application. For example:

#### Using Python:

```bash
# Python 3
python -m http.server

# Python 2
python -m SimpleHTTPServer
```

#### Using Node.js (recommended):

```bash
# Install dependencies
npm install

# Run the server with environment variables
npm run dev:local
```

This will start the server with the environment variables from your `.env` file.

Then open your browser and navigate to `http://localhost:3000` (or whatever port you've configured in your environment variables).

## Usage

1. **Create a new JSON document**: Click the "New" button to start with a blank document
2. **Format JSON**: Click the "Format" button to pretty-print your JSON
3. **Validate JSON**: Click the "Validate" button to check if your JSON is valid
4. **Save a document**: Sign up or log in, then click the "Save" button
5. **Load a document**: Click the "Load" button to see your saved documents

## License

MIT
