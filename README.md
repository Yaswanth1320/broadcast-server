# Broadcast Server - Connect to Chat

A simple real-time chat server where you can connect with friends.

## 🚀 Quick Connect

### Your Server is Live at:
```
https://web-production-045e7.up.railway.app/
```

## 📋 How to Join (For Friends)

### Step 1: Install Node.js
Download from [nodejs.org](https://nodejs.org) and install

### Step 2: Download Files
Get these files from your friend:
- `client.js`
- `package.json` 
- `join-chat.js`

### Step 3: Install Dependencies
```bash
npm install
```

### Step 4: Connect to Chat
```bash
node join-chat.js "YourName"
```

**Example:**
```bash
node join-chat.js "Alice"
```

## 🔧 Manual Connection

If the join script doesn't work:

```bash
node index.js connect --host web-production-045e7.up.railway.app --port 443 --name "YourName"
```

## 🎯 Available Commands

Once connected, use these commands:
- `/name YourName` - Set your display name
- `/list` - Show all connected users  
- `/help` - Show available commands
- `/quit` - Disconnect from server

## 📱 Example Chat Session

```
💬 Hello everyone!
📢 Welcome! You are client #1
💬 /name Alice
📢 Your name has been set to: Alice
💬 Hi Bob!
Alice • Hi Bob! • 14:30:15
```

## 🆘 Troubleshooting

**"Connection refused"**
- Server might be down, ask your friend to check

**"Module not found"** 
- Run `npm install` again

**"Permission denied"**
- Make sure Node.js is installed correctly

## 📞 Need Help?

1. Check this guide
2. Ask your friend for the correct server details
3. Make sure you're using the right command

Happy chatting! 🎉 