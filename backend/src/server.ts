import { createApp } from "./app.ts";
import { seedTestData } from "./seed.ts";

const PORT = 3380;

seedTestData();

createApp().listen(PORT, () => {
  console.log(`🌱 Plantify backend running on http://localhost:${PORT}`);
});
