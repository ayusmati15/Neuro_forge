import express from "express";
import cors from "cors";

import http from "http";

import { Server } from "socket.io";

import compileRoutes from "./routes/compileRoutes.js";

import {
    startTrainingSimulation
} from "./services/trainingSimulator.js";

const app = express();

const server =
    http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

app.use(cors());

app.use(express.json());

// MAKE SOCKET AVAILABLE
app.set("io", io);

// ROUTES
app.use(
    "/api",
    compileRoutes
);

// SOCKET CONNECTION
io.on(
    "connection",
    (socket) => {

        console.log(
            "Client Connected:",
            socket.id
        );

        // START TRAINING STREAM
        startTrainingSimulation(io);

        socket.on(
            "disconnect",
            () => {

                console.log(
                    "Client Disconnected:",
                    socket.id
                );
            }
        );
    }
);

const PORT = 5000;

server.listen(PORT, () => {

    console.log(
        `NeuroForge backend running on ${PORT}`
    );
});