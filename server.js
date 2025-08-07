const WebSocket = require("ws");
const chalk = require("chalk");
const boxen = require("boxen");
const figlet = require("figlet");
const gradient = require("gradient-string");

/**
 * Creates and starts a WebSocket broadcast server
 * port - Port number to listen on (default: 8080)
 * host - Host address to bind to (default: localhost)
 * returns - The WebSocket server instance
 */
function createServer(port = 8080, host = "localhost") {
  // Display minimal server banner
  console.clear();
  console.log(
    gradient.cristal(
      figlet.textSync("BROADCAST SERVER", {
        font: "Standard",
        horizontalLayout: "default",
        verticalLayout: "default",
      })
    )
  );

  console.log(
    chalk.cyan.bold("🚀 WebSocket Broadcast Server") +
      chalk.gray(" • ") +
      chalk.yellow(`${host}:${port}`) +
      chalk.gray(" • ") +
      chalk.cyan(`ws://${host}:${port}`)
  );

  // Create WebSocket server instance
  const wss = new WebSocket.Server({
    port: parseInt(port),
    host: host,
  });

  // Store connected clients with their information
  const clients = new Map(); // Using Map for better key-value management
  let clientCount = 0;

  // Display server startup information
  console.log(
    chalk.green("✅ Server started! ") +
      chalk.gray("Listening for connections • ") +
      chalk.red("Ctrl+C to stop")
  );

  /**
   * Handle new client connections
   * ws - WebSocket connection instance
   * req - HTTP request object
   */
  wss.on("connection", (ws, req) => {
    const clientId = ++clientCount;

    // Create client information object
    const clientInfo = {
      id: clientId,
      ws: ws,
      ip: req.socket.remoteAddress,
      name: `Client-${clientId}`, // Default name, will be updated when client sends name
      connectedAt: new Date(),
      isAuthenticated: false, // Track if client has set their name
    };

    // Add client to the clients map
    clients.set(clientId, clientInfo);

    console.log(
      chalk.blue("📡 Client connected ") +
        chalk.white(`#${clientId}`) +
        chalk.gray(" • ") +
        chalk.white(clientInfo.ip) +
        chalk.gray(" • ") +
        chalk.white(clientInfo.name) +
        chalk.gray(" • ") +
        chalk.white(`${clients.size} total`)
    );

    // Send welcome message to the new client
    const welcomeMessage = {
      type: "system",
      content: `Welcome! You are client #${clientId}. There are ${clients.size} clients connected.`,
      timestamp: new Date().toISOString(),
      clientId: clientId,
    };
    ws.send(JSON.stringify(welcomeMessage));

    // Send instructions for setting name
    const nameInstructions = {
      type: "system",
      content: "To set your name, send: /name YourName",
      timestamp: new Date().toISOString(),
      clientId: clientId,
    };
    ws.send(JSON.stringify(nameInstructions));

    // Broadcast new client connection to all other clients
    const connectionMessage = {
      type: "system",
      content: `Client #${clientId} has joined the chat.`,
      timestamp: new Date().toISOString(),
      clientId: clientId,
    };
    broadcastToOthers(ws, connectionMessage);

    /**
     * Handle incoming messages from clients
     * data - Raw message data
     */
    ws.on("message", (data) => {
      try {
        const message = JSON.parse(data);

        // Handle special commands
        if (message.content && message.content.startsWith("/")) {
          handleSpecialCommand(clientId, message.content, ws);
          return;
        }

        // Create broadcast message with client name
        const broadcastMessage = {
          type: "message",
          clientId: clientId,
          clientName: clientInfo.name,
          content: message.content,
          timestamp: new Date().toISOString(),
        };

        // Display message in server console with minimal styling
        console.log(
          chalk.cyan("💬 Message ") +
            chalk.white(`${clientInfo.name} (#${clientId}): `) +
            chalk.white(message.content)
        );

        // Broadcast to all clients including sender
        broadcastToAll(broadcastMessage);
      } catch (error) {
        console.error(
          chalk.red("❌ Parse error ") +
            chalk.white(`Client #${clientId}: `) +
            error.message
        );

        // Send error message back to the client
        const errorMessage = {
          type: "error",
          content:
            'Invalid message format. Please send JSON with a "content" field.',
          timestamp: new Date().toISOString(),
          clientId: clientId,
        };
        ws.send(JSON.stringify(errorMessage));
      }
    });

    /**
     * Handle client disconnection
     * code - Close code
     * reason - Close reason
     */
    ws.on("close", (code, reason) => {
      const clientName = clientInfo.name;
      clients.delete(clientId);

      console.log(
        chalk.red("🔌 Client disconnected ") +
          chalk.white(`${clientName} (#${clientId})`) +
          chalk.gray(` • code: ${code}`) +
          (reason ? chalk.gray(` • ${reason}`) : "") +
          chalk.gray(` • ${clients.size} remaining`)
      );

      // Broadcast disconnection to remaining clients
      const disconnectMessage = {
        type: "system",
        content: `${clientName} (Client #${clientId}) has left the chat.`,
        timestamp: new Date().toISOString(),
        clientId: clientId,
      };
      broadcastToAll(disconnectMessage);
    });

    /**
     * Handle WebSocket errors for individual clients
     * error - Error object
     */
    ws.on("error", (error) => {
      console.error(
        chalk.red("❌ WebSocket error ") +
          chalk.white(`Client #${clientId}: `) +
          error.message
      );
      clients.delete(clientId);
    });
  });

  /**
   * Handle special commands from clients
   * clientId - Client ID
   * command - Command string
   * ws - WebSocket connection
   */
  function handleSpecialCommand(clientId, command, ws) {
    const clientInfo = clients.get(clientId);

    if (!clientInfo) return;

    const parts = command.split(" ");
    const cmd = parts[0].toLowerCase();

    switch (cmd) {
      case "/name":
        if (parts.length < 2) {
          sendError(ws, "Usage: /name YourName", clientId);
          return;
        }

        const newName = parts.slice(1).join(" ").trim();
        if (newName.length === 0) {
          sendError(ws, "Name cannot be empty", clientId);
          return;
        }

        if (newName.length > 20) {
          sendError(ws, "Name too long (max 20 characters)", clientId);
          return;
        }

        const oldName = clientInfo.name;
        clientInfo.name = newName;
        clientInfo.isAuthenticated = true;

        // Send confirmation to the client
        const confirmMessage = {
          type: "system",
          content: `Your name has been set to: ${newName}`,
          timestamp: new Date().toISOString(),
          clientId: clientId,
        };
        ws.send(JSON.stringify(confirmMessage));

        // Broadcast name change to all clients
        const nameChangeMessage = {
          type: "system",
          content: `${oldName} is now known as ${newName}`,
          timestamp: new Date().toISOString(),
          clientId: clientId,
        };
        broadcastToAll(nameChangeMessage);

        console.log(
          chalk.yellow("📝 Name changed ") +
            chalk.white(`${oldName} → ${newName} (#${clientId})`)
        );
        break;

      case "/list":
        // Send list of connected clients
        const clientList = Array.from(clients.values())
          .map((client) => `${client.name} (Client #${client.id})`)
          .join(", ");

        const listMessage = {
          type: "system",
          content: `Connected clients: ${clientList}`,
          timestamp: new Date().toISOString(),
          clientId: clientId,
        };
        ws.send(JSON.stringify(listMessage));
        break;

      case "/help":
        // Send help information
        const helpMessage = {
          type: "system",
          content: "Available commands: /name YourName, /list, /help, /quit",
          timestamp: new Date().toISOString(),
          clientId: clientId,
        };
        ws.send(JSON.stringify(helpMessage));
        break;

      case "/quit":
        // Gracefully close the connection
        ws.close(1000, "Client requested disconnect");
        break;

      default:
        sendError(
          ws,
          `Unknown command: ${cmd}. Type /help for available commands.`,
          clientId
        );
    }
  }

  /**
   * Send error message to a specific client
   * ws - WebSocket connection
   * message - Error message
   * clientId - Client ID
   */
  function sendError(ws, message, clientId) {
    const errorMessage = {
      type: "error",
      content: message,
      timestamp: new Date().toISOString(),
      clientId: clientId,
    };
    ws.send(JSON.stringify(errorMessage));
  }

  /**
   * Handle server-level errors
   * error - Error object
   */
  wss.on("error", (error) => {
    console.error(chalk.red("❌ Server error:"), error.message);
  });

  /**
   * Handle graceful server shutdown
   */
  process.on("SIGINT", () => {
    console.log(
      chalk.yellow("🛑 Shutting down server ") +
        chalk.gray(`• ${clients.size} clients to disconnect`)
    );

    // Close all client connections
    clients.forEach((client) => {
      const shutdownMessage = {
        type: "system",
        content: "Server is shutting down.",
        timestamp: new Date().toISOString(),
        clientId: client.id,
      };
      client.ws.send(JSON.stringify(shutdownMessage));
      client.ws.close();
    });

    wss.close(() => {
      console.log(
        chalk.green("✅ Server shutdown complete ") +
          chalk.gray("• All connections closed")
      );
      process.exit(0);
    });
  });

  /**
   * Broadcast message to all connected clients
   * message - Message object to broadcast
   */
  function broadcastToAll(message) {
    const messageStr = JSON.stringify(message);
    clients.forEach((client) => {
      if (client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(messageStr);
      }
    });
  }

  /**
   * Broadcast message to all clients except the sender
   * senderWs - Sender's WebSocket connection
   * message - Message object to broadcast
   */
  function broadcastToOthers(senderWs, message) {
    const messageStr = JSON.stringify(message);
    clients.forEach((client) => {
      if (client.ws !== senderWs && client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(messageStr);
      }
    });
  }

  return wss;
}

module.exports = { createServer };
