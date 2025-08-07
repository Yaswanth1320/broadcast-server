# Enhanced Broadcast Server

A feature-rich WebSocket-based broadcast server that enables real-time messaging between multiple clients with advanced features like client names, special commands, and improved user experience.

## 🚀 Features

- **Real-time messaging**: Instant message broadcasting to all connected clients
- **Client name management**: Set and display custom names for better identification
- **Special commands**: Built-in commands for enhanced functionality
- **Multiple client support**: Handle multiple clients connecting and disconnecting
- **Interactive CLI**: Easy-to-use command-line interface for both server and client
- **Robust error handling**: Comprehensive error handling and graceful shutdown
- **Connection management**: Automatic client tracking and status updates
- **JSON messaging**: Structured message format with timestamps
- **Command system**: Extensible command framework for future features

## 📦 Installation

1. Navigate to the broadcast-server directory:
   ```bash
   cd broadcast-server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Make the CLI executable:
   ```bash
   chmod +x index.js
   ```

## 🎯 Usage

### Starting the Server

To start the enhanced broadcast server:

```bash
# Start server on default port (8080)
node index.js start

# Start server on custom port
node index.js start --port 3000

# Start server on custom host and port
node index.js start --host 0.0.0.0 --port 3000
```

**Server Options:**
- `-p, --port <port>`: Port to listen on (default: 8080)
- `-h, --host <host>`: Host to bind to (default: localhost)

### Connecting as a Client

To connect to the server as a client:

```bash
# Connect to default server
node index.js connect

# Connect to custom server
node index.js connect --host 192.168.1.100 --port 3000

# Connect with custom initial name
node index.js connect --name "Alice"
```

**Client Options:**
- `-p, --port <port>`: Server port (default: 8080)
- `-h, --host <host>`: Server host (default: localhost)
- `-n, --name <name>`: Initial client name (default: Anonymous)

### Client Commands

Once connected as a client, you can use these commands:

- **Send messages**: Type your message and press Enter
- **Set name**: `/name YourName` - Set your display name
- **List clients**: `/list` - Show all connected clients
- **Get help**: `/help` - Show available commands
- **Quit**: `/quit` or type `quit`/`exit` to disconnect

## 🔧 Special Commands

The enhanced broadcast server supports several special commands:

| Command | Description | Example |
|---------|-------------|---------|
| `/name YourName` | Set your display name | `/name JohnDoe` |
| `/list` | Show all connected clients | `/list` |
| `/help` | Show available commands | `/help` |
| `/quit` | Disconnect from server | `/quit` |

## 📋 Example Usage

### Terminal 1 - Start Server
```bash
$ node index.js start --port 8080
Starting broadcast server on localhost:8080
Server features:
  • Real-time message broadcasting
  • Client name management
  • Special commands: /name, /list, /help, /quit
  • Multiple client support
  • Graceful shutdown handling

🚀 Broadcast server is running on ws://localhost:8080
Press Ctrl+C to stop the server

📡 Client 1 connected from ::1
👥 Total clients connected: 1
💬 AliceSmith (Client #1): Hello everyone!
```

### Terminal 2 - Connect as Client 1
```bash
$ node index.js connect --name "Alice"
Connecting to ws://localhost:8080 as Alice
Client features:
  • Real-time messaging
  • Custom name setting with /name command
  • View connected clients with /list
  • Get help with /help
  • Graceful disconnection with /quit

🔗 Connecting to ws://localhost:8080...
✅ Connected to server!
👤 Initial name: Alice
💬 Type your messages and press Enter to send
📝 Type 'quit' or 'exit' to disconnect
🔧 Special commands: /name, /list, /help, /quit

> /name AliceSmith
📢 [14:30:15] Your name has been set to: AliceSmith
📢 [14:30:15] Client-1 is now known as AliceSmith
> Hello everyone!
[14:30:20] AliceSmith: Hello everyone!
> /list
📢 [14:30:25] Connected clients: AliceSmith (Client #1), BobJohnson (Client #2)
```

### Terminal 3 - Connect as Client 2
```bash
$ node index.js connect --name "Bob"
🔗 Connecting to ws://localhost:8080...
✅ Connected to server!
👤 Initial name: Bob
💬 Type your messages and press Enter to send
📝 Type 'quit' or 'exit' to disconnect
🔧 Special commands: /name, /list, /help, /quit

[14:30:15] AliceSmith: Hello everyone!
> /name BobJohnson
📢 [14:30:30] Your name has been set to: BobJohnson
📢 [14:30:30] Client-2 is now known as BobJohnson
> Hi AliceSmith!
[14:30:35] BobJohnson: Hi AliceSmith!
```

## 📨 Message Format

The server uses JSON for message communication:

### Client to Server
```json
{
  "content": "Your message or command here"
}
```

### Server to Client
```json
{
  "type": "message|system|error",
  "clientId": 1,
  "clientName": "AliceSmith",
  "content": "Message content",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

**Message Types:**
- `message`: Regular chat message from a client
- `system`: Server notifications (connections, disconnections, name changes, etc.)
- `error`: Error messages for invalid commands or operations

## 🏗️ Architecture

### Server (`server.js`)
- Creates WebSocket server with enhanced features
- Manages client connections with names and metadata
- Handles special commands (`/name`, `/list`, `/help`, `/quit`)
- Broadcasts messages to all connected clients
- Provides comprehensive system notifications
- Validates client names and commands
- Tracks client authentication status

### Client (`client.js`)
- Connects to WebSocket server with improved UX
- Provides interactive command-line interface
- Displays messages with sender names
- Handles special commands and responses
- Manages connection state and errors
- Supports graceful disconnection

### CLI (`index.js`)
- Command-line interface using Commander.js
- Supports both server and client modes
- Configurable options for host, port, and client name
- Enhanced help and feature descriptions

## 🛡️ Error Handling

The application includes comprehensive error handling:

- **Connection errors**: Graceful handling of network issues
- **Message parsing**: Validation of JSON message format
- **Command validation**: Proper validation of special commands
- **Name validation**: Length and format validation for client names
- **Client disconnections**: Automatic cleanup of disconnected clients
- **Server shutdown**: Graceful shutdown with client notification
- **Invalid input**: User-friendly error messages with helpful suggestions

## 🧪 Testing

### Automated Test
Run the comprehensive test script:
```bash
# Start server in one terminal
node index.js start

# Run test in another terminal
node test.js
```

### Manual Testing
Follow the detailed demo guide in `demo.md` for step-by-step testing instructions.

## 🔮 Extending the Project

Here are some ideas to extend the functionality:

- **Authentication**: Add user authentication and authorization
- **Message history**: Store and retrieve message history
- **Private messages**: Support for direct messaging between clients
- **Rooms/Channels**: Create separate chat rooms
- **File sharing**: Support for file uploads and downloads
- **Web interface**: Add a web-based client interface
- **Message encryption**: End-to-end encryption for messages
- **User profiles**: User profiles with avatars and status
- **Message reactions**: Add emoji reactions to messages
- **Typing indicators**: Show when someone is typing
- **Message editing**: Allow editing of sent messages
- **Message deletion**: Allow deletion of messages

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use**: Change the port using `--port` option
2. **Connection refused**: Make sure the server is running
3. **Permission denied**: Make sure the script is executable (`chmod +x index.js`)
4. **Name not updating**: Use the `/name` command correctly
5. **Commands not working**: Check if you're typing the command correctly

### Debug Mode

To see more detailed logging, you can modify the console.log statements in the code or add environment variables for debugging.

## 📄 License

MIT License - feel free to use this project for learning and development!

## 🤝 Contributing

Feel free to contribute to this project by:
- Adding new features
- Improving error handling
- Enhancing the user interface
- Adding more test cases
- Improving documentation 