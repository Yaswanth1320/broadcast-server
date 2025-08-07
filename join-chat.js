#!/usr/bin/env node

/**
 * Simple script for friends to join the broadcast chat
 * Usage: node join-chat.js "FriendName"
 */

const { createClient } = require("./client");

// Configuration - Update these values
const SERVER_URL = "ws://localhost:8080"; // Change to your server URL
const DEFAULT_NAME = "Anonymous";

// Get client name from command line argument
const CLIENT_NAME = process.argv[2] || DEFAULT_NAME;

console.log("🎯 Joining Broadcast Chat...");
console.log(`Server: ${SERVER_URL}`);
console.log(`Name: ${CLIENT_NAME}`);
console.log("");

// Connect to the server
createClient(SERVER_URL, CLIENT_NAME);
