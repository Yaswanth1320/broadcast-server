# Quick Setup for Friends

This guide helps your friends quickly join your broadcast server.

## 🚀 Quick Start

### Step 1: Install Node.js
Download and install Node.js from [nodejs.org](https://nodejs.org)

### Step 2: Download Files
Download these files from your friend:
- `client.js`
- `package.json`
- `join-chat.js`

### Step 3: Install Dependencies
```bash
npm install
```

### Step 4: Join the Chat
```bash
node join-chat.js "YourName"
```

## 🔧 Manual Connection

If the join script doesn't work, connect manually:

```bash
node index.js connect --host YOUR_SERVER_IP --port 8080 --name "YourName"
```

## 📋 Connection Examples

### Local Network (Same WiFi)
```bash
node join-chat.js "Alice"
# or
node index.js connect --host 192.168.1.100 --port 8080 --name "Alice"
```

### Cloud Server
```bash
node join-chat.js "Bob"
# or
node index.js connect --host your-app.railway.app --port 443 --name "Bob"
```

## 🎯 Available Commands

Once connected, you can use these commands:
- `/name YourName` - Set your display name
- `/list` - Show all connected users
- `/help` - Show available commands
- `/quit` - Disconnect from server

## 🆘 Troubleshooting

### "Connection refused"
- Make sure the server is running
- Check if the IP/port is correct
- Ask your friend to verify the server status

### "Module not found"
- Run `npm install` to install dependencies

### "Permission denied"
- Make sure you have Node.js installed correctly

## 📞 Get Help

If you have issues:
1. Check this guide
2. Ask your friend for the correct server details
3. Make sure you're using the right IP/port

Happy chatting! 🎉 