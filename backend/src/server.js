import express from "express";
import cors from "cors";

import compileRoutes from "./routes/compileRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", compileRoutes);

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`NeuroForge backend running on ${PORT}`);
});