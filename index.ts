import express from "express";
import pino from "pino";
import dotenv from "dotenv";
import {asCloudTool, FragolaCloud} from "./fragolaCloud/FragolaCloud";
import { cloneRepoTool } from "./tools/cloneRepo/cloneRepo.tool";

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

// Lancer le serveur
app.listen(PORT, () => {
  log.info(`Fragola cloud started on http://localhost:${PORT}`);
  fragolaCloud.logExposedTools();
});
