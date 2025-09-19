import express from "express";
import pino from "pino";
import dotenv from "dotenv";
import { asCloudTool, FragolaCloud } from "./fragolaCloud/FragolaCloud";
import { cloneRepoTool } from "./tools/cloneRepo/cloneRepo.tool";
import { readFileById } from "./tools/readFileById/readFileById.tool";
import { authtoken } from "ngrok";
import { grepCodebaseTool } from "./tools/grepCodebase/grepCodebase.tool";

// Load environment variables
dotenv.config();

// Logger qui écrit dans la console
const log = pino();
const app = express();

// Express middleware for JSON parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const fragolaCloud = new FragolaCloud(app);
const PORT = process.env.PORT || 3000;

// Route racine
app.get("/", (req, res) => {
  res.json({ message: "hello world" });
});

// Exposing tools for eleven labs
fragolaCloud.exposeTool(asCloudTool(cloneRepoTool));
fragolaCloud.exposeTool(asCloudTool(readFileById));
fragolaCloud.exposeTool(asCloudTool(grepCodebaseTool));

// Lancer le serveur
app.listen(PORT, async () => {
    console.log(`Fragola cloud started on http://localhost:${PORT}`);
  // if (!process.env["PROD"]) {
  //   console.log(PORT);
  //   try {
  //     const ngrok = require('ngrok');
  //     const url = await ngrok.connect(PORT, {authtoken: process.env["NGROK_AUTH_TOKEN"]});
  //     log.info(`Fragola cloud started on http://localhost:${PORT} | Ngrok tunnel open at ${url}`);
  //   } catch (error) {
  //     console.log(JSON.stringify(error))
  //     log.error(`Failed to connect ngrok: ${error instanceof Error ? error.message : String(error)}`);
  //   }
  // } else {
  //   //TODO: handle prod log
  // }
  fragolaCloud.logExposedTools();
});
