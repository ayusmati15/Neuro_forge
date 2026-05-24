import express from "express";

import cors from "cors";

import http from "http";

import { Server } from "socket.io";

import compileRoutes
from "./routes/compileRoutes.js";

const app = express();

const server =
    http.createServer(app);

// SOCKET.IO
const io = new Server(server, {

    cors: {
        origin: "*"
    }
});

// EXPORT IO
export { io };


// -------------------------
// MIDDLEWARE
// -------------------------

app.use(cors());

app.use(express.json());


// -------------------------
// ROUTES
// -------------------------

app.use(
    "/api",
    compileRoutes
);


// -------------------------
// SOCKET CONNECTION
// -------------------------

io.on(
    "connection",
    (socket) => {

        console.log(
            "Client Connected:",
            socket.id
        );

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


// -------------------------
// START SERVER
// -------------------------

const PORT = 5000;

server.listen(
    PORT,
    () => {

        console.log(
            `NeuroForge backend running on ${PORT}`
        );
    }
);