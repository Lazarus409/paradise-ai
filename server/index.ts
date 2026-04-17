import { createServer } from "http";
import { createApp } from "./app.ts";

const app = createApp({ serveStatic: true });
const port = Number(process.env.PORT || 3000);

createServer(app).listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
