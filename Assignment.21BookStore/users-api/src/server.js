import { AppCr } from "./app.js";

const app = AppCr();

const PORT = 3000;
const HOST = "127.0.0.1";

app.listen(PORT, HOST, () => {
  console.log(`Server is running in Url  http://${HOST}:${PORT}`);
});
