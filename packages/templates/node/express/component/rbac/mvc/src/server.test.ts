import app from "./app.test";
import env from "./configs/env";

const PORT = env.PORT || 6060;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
