import express from "express";

import {
    runPythonCompiler
} from "../services/pythonBridge.js";

const router = express.Router();

router.post(
    "/compile-model",
    async (req, res) => {

        try {

            const architecture =
                req.body;

            const results =
                await runPythonCompiler(
                    architecture
                );

            // SOCKET EMIT
            const io =
                req.app.get("io");

            io.emit(
                "neural-profile",
                results
            );

            res.json(results);

        } catch (err) {

            res.status(500).json({
                error: err.message
            });
        }
    }
);

export default router;