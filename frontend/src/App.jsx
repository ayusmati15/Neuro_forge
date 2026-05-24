import "./App.css";

import { useState } from "react";

import NetworkGraph from "./components/NetworkGraph";

const activationColors = {
    Dense: "#ffffff",
    ReLU: "#ff6b6b",
    GELU: "#6bcBff",
    SELU: "#c77dff",
    ELU: "#ffd93d",
    Tanh: "#4d96ff",
    Softmax: "#00c896",
    Swish: "#ff9f1c",
    Dropout: "#ff4ecd"
};

function App() {

    const [layers, setLayers] =
        useState([]);

    const [results, setResults] =
        useState(null);

    const [loading, setLoading] =
        useState(false);

    // -------------------------
    // ADD LAYER
    // -------------------------

    const addLayer = (type) => {

        let neurons = 128;

        let rate = 0.5;

        // DENSE
        if (type === "Dense") {

            const input =
                prompt(
                    "Enter neuron count:"
                );

            neurons =
                Number(input) || 128;
        }

        // DROPOUT
        if (type === "Dropout") {

            const input =
                prompt(
                    "Enter dropout rate (0-1):"
                );

            rate =
                Number(input) || 0.5;
        }

        setLayers((prev) => [

            ...prev,

            {
                type,
                neurons,
                rate
            }
        ]);
    };

    // -------------------------
    // COMPILE MODEL
    // -------------------------

    const compileModel = async () => {

        setLoading(true);

        try {

            const response =
                await fetch(
                    "http://localhost:5000/api/compile-model",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            layers
                        })
                    }
                );

            const data =
                await response.json();

            setResults(data);

        } catch (err) {

            console.error(err);

        } finally {

            setLoading(false);
        }
    };

    return (

        <div className="container">

            <h1>
                NeuroForge
            </h1>

            {/* ------------------ */}
            {/* CONTROLS */}
            {/* ------------------ */}

            <div className="controls">

                <button
                    onClick={() =>
                        addLayer("Dense")
                    }
                >
                    Dense
                </button>

                <button
                    onClick={() =>
                        addLayer("ReLU")
                    }
                >
                    ReLU
                </button>

                <button
                    onClick={() =>
                        addLayer("GELU")
                    }
                >
                    GELU
                </button>

                <button
                    onClick={() =>
                        addLayer("SELU")
                    }
                >
                    SELU
                </button>

                <button
                    onClick={() =>
                        addLayer("ELU")
                    }
                >
                    ELU
                </button>

                <button
                    onClick={() =>
                        addLayer("Tanh")
                    }
                >
                    Tanh
                </button>

                <button
                    onClick={() =>
                        addLayer("Softmax")
                    }
                >
                    Softmax
                </button>

                <button
                    onClick={() =>
                        addLayer("Swish")
                    }
                >
                    Swish
                </button>

                <button
                    onClick={() =>
                        addLayer("Dropout")
                    }
                >
                    Dropout
                </button>

                <button
                    className="compile-btn"
                    onClick={compileModel}
                >
                    {
                        loading
                            ? "Compiling..."
                            : "Compile Model"
                    }
                </button>
            </div>

            {/* ------------------ */}
            {/* GRAPH */}
            {/* ------------------ */}

            <NetworkGraph
                layers={layers}
            />

            {/* ------------------ */}
            {/* VISUALIZATION */}
            {/* ------------------ */}

            <div className="visualization">

                {
                    layers.map(
                        (
                            layer,
                            index
                        ) => {

                            const color =
                                activationColors[
                                    layer.type
                                ] || "#ffffff";

                            return (

                                <div
                                    key={index}
                                    className="layer-card"
                                    style={{

                                        border:
                                            `2px solid ${color}`,

                                        boxShadow:
                                            `0px 0px 25px ${color}`,

                                        background:
                                            `linear-gradient(
                                                145deg,
                                                ${color}22,
                                                #111
                                            )`
                                    }}
                                >

                                    <h2>
                                        {
                                            layer.type
                                        }
                                    </h2>

                                    {
                                        layer.neurons &&
                                        layer.type === "Dense" && (

                                            <p>
                                                Neurons:
                                                {" "}
                                                {
                                                    layer.neurons
                                                }
                                            </p>
                                        )
                                    }

                                    {
                                        results?.layers?.[index]
                                            ?.output_shape && (

                                            <p>
                                                Shape:
                                                {" "}
                                                [
                                                {
                                                    results
                                                        .layers[index]
                                                        .output_shape
                                                        .join(", ")
                                                }
                                                ]
                                            </p>
                                        )
                                    }

                                    {
                                        layer.rate !== undefined &&
                                        layer.type === "Dropout" && (

                                            <p>
                                                Dropout:
                                                {" "}
                                                {
                                                    layer.rate
                                                }
                                            </p>
                                        )
                                    }

                                </div>
                            );
                        }
                    )
                }

            </div>

            {/* ------------------ */}
            {/* RESULTS */}
            {/* ------------------ */}

            <div className="results">

                <h2>
                    Compilation Results
                </h2>

              <pre>

                {
                   results?.generated_code
                }

              </pre>

            </div>

        </div>
    );
}

export default App;