import express from "express";

import {
    runPythonCompiler
} from "../services/pythonBridge.js";

import {
    io
} from "../server.js";

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

            // REALTIME SOCKET STREAM
            io.emit(
                "neural-profile",
                results
            );

            res.json(results);

        } catch (err) {

            console.error(err);

            res.status(500).json({
                error: err.message
            });
        }
    }
);

export default router;