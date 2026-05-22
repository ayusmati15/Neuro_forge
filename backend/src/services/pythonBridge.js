import { spawn } from "child_process";

export function runPythonCompiler(architecture) {

    return new Promise((resolve, reject) => {

        const pythonProcess = spawn(
            "python",
            ["workers/runtime_worker.py"]
        );

        let result = "";
        let errorOutput = "";

        // SEND JSON TO PYTHON
        pythonProcess.stdin.write(
            JSON.stringify(architecture)
        );

        pythonProcess.stdin.end();

        // RECEIVE OUTPUT
        pythonProcess.stdout.on("data", (data) => {
            result += data.toString();
        });

        // RECEIVE ERRORS
        pythonProcess.stderr.on("data", (data) => {
            errorOutput += data.toString();
        });

        // PROCESS CLOSED
        pythonProcess.on("close", (code) => {

            if (code !== 0) {

                reject(
                    new Error(errorOutput)
                );

            } else {

                resolve(
                    JSON.parse(result)
                );
            }
        });
    });
}