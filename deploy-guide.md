# Deploy Broadcast Server for Friends

This guide shows you how to deploy your broadcast server so your friends can join from different accounts and locations.

## 🌐 Deployment Options

### Option 1: Local Network (Same WiFi/LAN)
**Best for**: Friends in the same location (home, office, school)

### Option 2: Cloud Deployment (Recommended)
**Best for**: Friends anywhere in the world

### Option 3: Port Forwarding
**Best for**: Friends connecting to your home network

## 🚀 Option 1: Local Network Deployment

### Step 1: Find Your Local IP
```bash
# On macOS/Linux
ifconfig | grep "inet " | grep -v 127.0.0.1

# On Windows
ipconfig | findstr "IPv4"
```

Look for something like `192.168.1.100` or `10.0.0.50`

### Step 2: Start Server on Local Network
```bash
# Start server on all network interfaces
node index.js start --host 0.0.0.0 --port 8080
```

### Step 3: Friends Connect
Your friends use:
```bash
node index.js connect --host YOUR_LOCAL_IP --port 8080 --name "FriendName"
```

**Example:**
```bash
node index.js connect --host 192.168.1.100 --port 8080 --name "Alice"
```

## ☁️ Option 2: Cloud Deployment (Recommended)

### Deploy to Railway (Free Tier)

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Prepare for Deployment**
   Create a `railway.json` file:
   ```json
   {
     "build": {
       "builder": "NIXPACKS"
     },
     "deploy": {
       "startCommand": "node index.js start --host 0.0.0.0 --port $PORT",
       "restartPolicyType": "ON_FAILURE",
       "restartPolicyMaxRetries": 10
     }
   }
   ```

3. **Deploy**
   - Connect your GitHub repository
   - Railway will auto-deploy
   - Get your public URL (e.g., `https://your-app.railway.app`)

4. **Friends Connect**
   ```bash
   node index.js connect --host your-app.railway.app --port 443 --name "FriendName"
   ```

### Deploy to Heroku (Free Tier)

1. **Create Heroku Account**
   - Go to [heroku.com](https://heroku.com)
   - Sign up

2. **Create Procfile**
   ```
   web: node index.js start --host 0.0.0.0 --port $PORT
   ```

3. **Deploy**
   ```bash
   # Install Heroku CLI
   npm install -g heroku

   # Login and deploy
   heroku login
   heroku create your-broadcast-app
   git add .
   git commit -m "Deploy broadcast server"
   git push heroku main
   ```

4. **Friends Connect**
   ```bash
   node index.js connect --host your-broadcast-app.herokuapp.com --port 443 --name "FriendName"
   ```

### Deploy to DigitalOcean (Paid)

1. **Create Droplet**
   - Ubuntu 20.04 LTS
   - Basic plan ($5/month)

2. **Server Setup**
   ```bash
   # SSH into your server
   ssh root@your-server-ip

   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs

   # Clone your project
   git clone https://github.com/your-username/broadcast-server.git
   cd broadcast-server
   npm install

   # Start server
   node index.js start --host 0.0.0.0 --port 8080
   ```

3. **Friends Connect**
   ```bash
   node index.js connect --host your-server-ip --port 8080 --name "FriendName"
   ```

## 🔧 Option 3: Port Forwarding (Home Network)

### Step 1: Configure Router
1. Log into your router admin panel (usually `192.168.1.1`)
2. Find "Port Forwarding" section
3. Add rule:
   - **External Port**: 8080
   - **Internal IP**: Your computer's local IP
   - **Internal Port**: 8080
   - **Protocol**: TCP

### Step 2: Find Public IP
```bash
# Get your public IP
curl ifconfig.me
# or visit whatismyipaddress.com
```

### Step 3: Start Server
```bash
node index.js start --host 0.0.0.0 --port 8080
```

### Step 4: Friends Connect
```bash
node index.js connect --host YOUR_PUBLIC_IP --port 8080 --name "FriendName"
```

## 🛡️ Security Considerations

### For Production Deployment

1. **Add Authentication**
   ```javascript
   // Add to server.js
   const validTokens = ['token1', 'token2', 'token3'];
   
   wss.on('connection', (ws, req) => {
     const token = req.url.split('token=')[1];
     if (!validTokens.includes(token)) {
       ws.close(1008, 'Invalid token');
       return;
     }
     // ... rest of connection logic
   });
   ```

2. **Use HTTPS/WSS**
   - Deploy with SSL certificate
   - Use `wss://` instead of `ws://`

3. **Rate Limiting**
   - Limit messages per client
   - Prevent spam

## 📱 Easy Setup for Friends

### Create a Simple Script
Create `join-chat.js`:
```javascript
#!/usr/bin/env node

const { createClient } = require('./client');

const SERVER_URL = 'ws://your-server-ip:8080';
const CLIENT_NAME = process.argv[2] || 'Anonymous';

console.log('🎯 Joining Broadcast Chat...');
console.log(`Server: ${SERVER_URL}`);
console.log(`Name: ${CLIENT_NAME}`);
console.log('');

createClient(SERVER_URL, CLIENT_NAME);
```

### Friends Just Run
```bash
node join-chat.js "FriendName"
```

## 🌍 Public Deployment Checklist

- [ ] **Choose deployment platform** (Railway, Heroku, DigitalOcean)
- [ ] **Set host to 0.0.0.0** for external access
- [ ] **Configure firewall** to allow port 8080
- [ ] **Test connection** from different network
- [ ] **Share connection details** with friends
- [ ] **Monitor server** for performance

## 📋 Connection Examples

### Local Network
```bash
# You start server
node index.js start --host 0.0.0.0 --port 8080

# Friends connect
node index.js connect --host 192.168.1.100 --port 8080 --name "Alice"
node index.js connect --host 192.168.1.100 --port 8080 --name "Bob"
```

### Cloud Deployment
```bash
# Friends connect to your cloud server
node index.js connect --host your-app.railway.app --port 443 --name "Alice"
node index.js connect --host your-app.railway.app --port 443 --name "Bob"
```

### Port Forwarding
```bash
# Friends connect to your public IP
node index.js connect --host 203.0.113.1 --port 8080 --name "Alice"
node index.js connect --host 203.0.113.1 --port 8080 --name "Bob"
```

## 🎯 Quick Start for Friends

1. **Install Node.js** (if not already installed)
2. **Download the client files** (client.js, package.json)
3. **Install dependencies**: `npm install`
4. **Connect**: `node index.js connect --host YOUR_SERVER --port 8080 --name "FriendName"`

## 🚀 Recommended Setup

For the best experience with friends:

1. **Use Railway or Heroku** (free, reliable)
2. **Set up automatic deployment** from GitHub
3. **Create a simple join script** for friends
4. **Share the connection details** in a group chat
5. **Monitor the server** for any issues

Your friends can now join your broadcast server from anywhere in the world! 🌍 