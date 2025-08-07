const WebSocket = require("ws");
const readline = require("readline");
const chalk = require("chalk");
const boxen = require("boxen");
const figlet = require("figlet");
const gradient = require("gradient-string");
const ora = require("ora");

/**
 * Creates a beautifully styled WebSocket client that connects to the broadcast server
 * serverUrl - WebSocket server URL
 * clientName - Initial client name (can be changed later)
 * returns - The WebSocket client instance
 */
function createClient(serverUrl, clientName = "Anonymous") {
  // Create WebSocket connection to the server
  const ws = new WebSocket(serverUrl);
  let isConnected = false;
  let currentName = clientName;
  let messageCount = 0;
  let spinner;

  // Display minimal welcome banner
  console.clear();
  console.log(
    gradient.cristal(
      figlet.textSync("BROADCAST", {
        font: "Standard",
        horizontalLayout: "default",
        verticalLayout: "default",
      })
    )
  );

  console.log(
    chalk.cyan.bold("🎯 Real-time Chat Client") +
      chalk.gray(" • ") +
      chalk.yellow(serverUrl) +
      chalk.gray(" • ") +
      chalk.green(currentName)
  );

  // Show connection spinner
  spinner = ora("Connecting to server...").start();

  /**
   * Handle successful connection to the server
   */
  ws.on("open", () => {
    isConnected = true;
    spinner.succeed(chalk.green("Connected to server!"));

    // Display minimal connection info
    console.log(
      chalk.green("✅ Connected! ") +
        chalk.gray("Type your messages or use commands: ") +
        chalk.cyan("/name, /list, /help, /quit")
    );

    // Set up readline interface for user input
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: chalk.cyan("💬 "),
    });

    /**
     * Handle user input from the command line
     * input - User input string
     */
    rl.on("line", (input) => {
      const trimmedInput = input.trim();

      // Skip empty input
      if (!trimmedInput) {
        rl.prompt();
        return;
      }

      // Check for quit commands
      if (
        trimmedInput.toLowerCase() === "quit" ||
        trimmedInput.toLowerCase() === "exit"
      ) {
        console.log(chalk.yellow("👋 Disconnecting..."));
        ws.close();
        rl.close();
        return;
      }

      // Send message to server if connected
      if (isConnected && ws.readyState === WebSocket.OPEN) {
        const message = {
          content: trimmedInput,
        };
        ws.send(JSON.stringify(message));
        messageCount++;
      } else {
        console.log(chalk.red("❌ Not connected to server"));
      }

      rl.prompt();
    });

    /**
     * Handle readline interface closure
     */
    rl.on("close", () => {
      console.log(
        chalk.blue("👋 Goodbye! ") + chalk.gray(`Sent ${messageCount} messages`)
      );
      process.exit(0);
    });

    // Show initial prompt for user input
    rl.prompt();
  });

  /**
   * Handle incoming messages from the server
   * data - Raw message data from server
   */
  ws.on("message", (data) => {
    try {
      const message = JSON.parse(data);
      const timestamp = new Date(message.timestamp).toLocaleTimeString();

      // Handle different message types with minimal formatting
      switch (message.type) {
        case "message":
          // Display regular chat messages with sender name
          const senderName =
            message.clientName || `Client #${message.clientId}`;
          console.log(
            chalk.cyan(senderName) +
              chalk.gray(" • ") +
              chalk.white(message.content) +
              chalk.gray(" • ") +
              chalk.dim(timestamp)
          );
          break;

        case "system":
          // Display system messages with minimal styling
          console.log(
            chalk.yellow("📢 ") +
              chalk.white(message.content) +
              chalk.gray(" • ") +
              chalk.dim(timestamp)
          );
          break;

        case "error":
          // Display error messages with minimal styling
          console.log(
            chalk.red("❌ ") +
              chalk.white(message.content) +
              chalk.gray(" • ") +
              chalk.dim(timestamp)
          );
          break;

        default:
          // Handle unknown message types
          console.log(
            chalk.gray(`[${timestamp}] Unknown message type: ${message.type}`)
          );
      }

      // Re-prompt for user input after displaying message
      process.stdout.write(chalk.cyan("💬 "));
    } catch (error) {
      console.error(chalk.red("❌ Error parsing message:"), error.message);
      process.stdout.write(chalk.cyan("💬 "));
    }
  });

  /**
   * Handle connection closure
   * code - Close code
   * reason - Close reason
   */
  ws.on("close", (code, reason) => {
    isConnected = false;
    console.log(
      chalk.red("🔌 Disconnected ") +
        chalk.gray(`(code: ${code})`) +
        (reason ? chalk.gray(` • ${reason}`) : "") +
        chalk.gray(` • Sent ${messageCount} messages`)
    );
    process.exit(0);
  });

  /**
   * Handle connection errors
   * error - Error object
   */
  ws.on("error", (error) => {
    spinner.fail(chalk.red("Connection failed!"));
    console.error(chalk.red("❌ Connection error:"), error.message);
    console.log(
      chalk.yellow("💡 Make sure the server is running: ") +
        chalk.cyan("node index.js start")
    );
    process.exit(1);
  });

  /**
   * Handle process termination (Ctrl+C)
   */
  process.on("SIGINT", () => {
    console.log(chalk.yellow("\n🛑 Disconnecting..."));
    if (isConnected) {
      ws.close();
    } else {
      process.exit(0);
    }
  });

  return ws;
}

module.exports = { createClient };
