# How to Run Subway Reader

## Prerequisites
*   **Node.js**: Version 18 or higher (required for built-in `fetch` support and Vite).
*   **npm**: Included with Node.js.
*   **Gemini API Key**: Required for AI summarization features (get one at [aistudio.google.com](https://aistudio.google.com/)).

## 1. Installation
Clone the repository and install dependencies:

```bash
npm install
```

## 2. Running Tests

### Unit & Component Tests
These tests cover utility functions (storage) and UI components (ArticleCard).

```bash
npm test
```

### End-to-End (E2E) Tests
These tests simulate a full user journey using Playwright (Chrome/headless).

```bash
# First time setup (installs browser binaries)
npx playwright install

# Run tests
npm run e2e
```

## 3. Local Development (PC/Mac)

### Simulated Mode (Frontend Only)
For quick UI changes without the backend proxy:
```bash
npm run dev
```
*   Opens at `http://localhost:5173`.
*   **Note**: In the app settings, ensure "Simulated Mode" is **ON**.

### Full Stack Mode
To test the Proxy Server and React App together locally:
1.  Build the frontend: `npm run build`
2.  Start the server: `npm start`
3.  Opens at `http://localhost:3000`.

---

## 4. Raspberry Pi Deployment

Follow these steps to turn your Raspberry Pi into the Subway Reader server.

### Step 1: Transfer Code
Clone this repo onto your Pi or copy the files over via SCP/FTP.

### Step 2: Install Node.js
Ensure your Pi has Node.js 18+ installed.
```bash
node -v
# If < 18, install via NodeSource:
# curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
# sudo apt-get install -y nodejs
```

### Step 3: Install & Build
Navigate to the project folder on the Pi:
```bash
cd subway-reader
npm install
npm run build
```
*   `npm run build` compiles the React application into the `dist/` folder, which `server.js` serves statically.

### Step 4: Run the Server
You need to provide your Google Gemini API key as an environment variable.

**Temporary Run:**
```bash
export API_KEY="your_actual_api_key_here"
npm start
```

**Persistent Run (Recommended with PM2):**
To keep the app running even if you disconnect from SSH or reboot:
```bash
sudo npm install -g pm2
API_KEY="your_actual_api_key_here" pm2 start server.js --name subway-reader
pm2 save
pm2 startup
```

### Step 5: Connect from your Phone
1.  Find your Pi's IP address: `hostname -I`
2.  Open your phone's browser.
3.  Navigate to: `http://<YOUR_PI_IP>:3000` (e.g., `http://192.168.1.50:3000`).
4.  **Important**: In the Web App, open **Settings**, disable **Simulated Mode**, and set the **Server URL** to `http://<YOUR_PI_IP>:3000`.

## Troubleshooting
*   **Puppeteer Error (Syntax error: "(" unexpected)**: This means Puppeteer is trying to run an incompatible Chrome binary (e.g., x64 on an ARM Raspberry Pi). 
    *   **Fix**: Install Chromium system-wide: `sudo apt install chromium-browser` (or `chromium`). The server will automatically detect and use it.
*   **CORS Errors**: If connecting from a different device, ensure the `server.js` is running and the IP address in App Settings matches the Pi's IP.
*   **Gemini Errors**: If summaries fail, check that the `API_KEY` was correctly exported before starting the server.