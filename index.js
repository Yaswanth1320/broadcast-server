#!/usr/bin/env node

/**
 * Broadcast Server CLI Application
 *
 * This is the main entry point for the broadcast server application.
 * It provides a command-line interface for starting the server or connecting as a client.
 *
 * Usage:
 *   node index.js start [options]    - Start the broadcast server
 *   node index.js connect [options]  - Connect to server as a client
 *   node index.js --help             - Show help information
 */

const { Command } = require("commander");
const WebSocket = require("ws");
const readline = require("readline");
const chalk = require("chalk");
const figlet = require("figlet");
const gradient = require("gradient-string");
const { createServer } = require("./server");
const { createClient } = require("./client");

// Display minimal application banner
console.log(
  gradient.rainbow(
    figlet.textSync("BROADCAST", {
      font: "Standard",
      horizontalLayout: "default",
      verticalLayout: "default",
    })
  )
);

console.log(
  chalk.cyan.bold("🎯 Real-time WebSocket Broadcast Server") +
    chalk.gray(" • ") +
    chalk.gray("Feature-rich chat with client names and commands")
);

// Create the main command program
const program = new Command();

// Configure the main program
program
  .name("broadcast-server")
  .description(
    "A feature-rich WebSocket broadcast server for real-time messaging"
  )
  .version("1.0.0");

/**
 * Start command - Launches the broadcast server
 *
 * This command starts a WebSocket server that:
 * - Listens for client connections on the specified port
 * - Broadcasts messages to all connected clients
 * - Handles client names and special commands
 * - Provides real-time chat functionality
 */
program
  .command("start")
  .description("Start the broadcast server")
  .option("-p, --port <port>", "Port to listen on", "8080")
  .option("-h, --host <host>", "Host to bind to", "localhost")
  .action((options) => {
    console.log(
      chalk.blue("🚀 Starting broadcast server ") +
        chalk.gray("• ") +
        chalk.white(`${options.host}:${options.port}`) +
        chalk.gray(" • ") +
        chalk.cyan(`ws://${options.host}:${options.port}`)
    );

    console.log(
      chalk.green("✨ Features: ") +
        chalk.white(
          "Real-time messaging • Client names • Commands • Multiple clients"
        )
    );

    createServer(options.port, options.host);
  });

/**
 * Connect command - Connects to the broadcast server as a client
 *
 * This command connects to a running broadcast server and provides:
 * - Interactive chat interface
 * - Real-time message reception
 * - Ability to set custom names
 * - Special command support
 * - Graceful disconnection
 */
program
  .command("connect")
  .description("Connect to the broadcast server as a client")
  .option("-p, --port <port>", "Server port", "8080")
  .option("-h, --host <host>", "Server host", "localhost")
  .option("-n, --name <name>", "Initial client name", "Anonymous")
  .action((options) => {
    const serverUrl = `ws://${options.host}:${options.port}`;

    console.log(
      chalk.blue("🔗 Connecting to broadcast server ") +
        chalk.gray("• ") +
        chalk.white(serverUrl) +
        chalk.gray(" • ") +
        chalk.white(options.name)
    );

    console.log(
      chalk.green("✨ Features: ") +
        chalk.white(
          "Real-time messaging • Custom names • Commands • Beautiful interface"
        )
    );

    createClient(serverUrl, options.name);
  });

// Parse command line arguments
program.parse();
