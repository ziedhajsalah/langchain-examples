import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { getClaudeOutput, getClaudeOutputStream } from "./anthropic";

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const apiPrefix = process.env.API_PREFIX || "/api";

// Middleware for parsing JSON bodies
app.use(express.json());

// Example route
app.get(apiPrefix, (req: Request, res: Response) => {
  res.json({
    message: "Hello from Express + TypeScript!",
    environment: process.env.NODE_ENV,
  });
});

app.post(apiPrefix + "/claude", async (req: Request, res: Response) => {
  const input = req.body.input;
  getClaudeOutput(input).then((output) => {
    res.json({ output });
  });
});

app.post(apiPrefix + "/claude/stream", async (req: Request, res: Response) => {
  const input = req.body.input;
  // getClaudeOutput(input).then((output) => {
  //   res.json({ output });
  // });
  const stream = await getClaudeOutputStream(input);
  // const reader = stream.getReader();
  res.setHeader("Content-Type", "text/plain");
  const writable = new WritableStream({
    write(chunk) {
      res.write(chunk);
    },
    close() {
      res.end();
    },
    abort(err) {
      console.error("Stream aborted:", err);
      res.status(500).end("Streaming error");
    },
  });
  stream.pipeTo(writable);
  // try {
  //   while (true) {
  //     const { done, value } = await reader.read();
  //     if (done) break;
  //     console.log(value);
  //     res.write(value);
  //   }
  //   res.end();
  // } catch (err) {
  //   console.error("Streaming error:", err);
  //   res.status(500).send("Streaming error");
  // }
});

app.listen(port, () => {
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode at http://localhost:${port}`,
  );
});
