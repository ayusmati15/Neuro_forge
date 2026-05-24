import { spawn } from "child_process";

export const runPythonCompiler =
    (architecture) => {

    return new Promise(
        (resolve, reject) => {

            // PASS JSON STRING
            const architectureJSON =
                JSON.stringify(
                    architecture
                );

            const pythonProcess =
                spawn(
                    "python",
                    [
                        "./workers/runtime_worker.py",
                        architectureJSON
                    ]
                );

            let result = "";

            let error = "";

            // STDOUT
            pythonProcess.stdout.on(
                "data",
                (data) => {

                    result +=
                        data.toString();
                }
            );

            // STDERR
            pythonProcess.stderr.on(
                "data",
                (data) => {

                    error +=
                        data.toString();
                }
            );

            // FINISH
            pythonProcess.on(
                "close",
                () => {

                    if (error) {

                        reject(
                            new Error(error)
                        );

                    } else {

                        try {

                            resolve(
                                JSON.parse(result)
                            );

                        } catch (err) {

                            reject(err);
                        }
                    }
                }
            );
        }
    );
};