function NetworkGraph({ layers }) {

    return (

        <svg
            width="1400"
            height="350"
            style={{
                marginTop: "40px"
            }}
        >

            {
                layers.map(
                    (
                        layer,
                        index
                    ) => {

                        const x =
                            150 + index * 180;

                        const y = 150;

                        // LINE
                        if (
                            index <
                            layers.length - 1
                        ) {

                            const nextX =
                                150 +
                                (index + 1) * 180;

                            return (

                                <g key={index}>

                                    {/* CONNECTION */}

                                    <line
                                        x1={x + 60}
                                        y1={y}

                                        x2={nextX - 60}
                                        y2={y}

                                        stroke="#ff9f1c"

                                        strokeWidth="5"

                                        strokeDasharray="10"
                                    >

                                        <animate
                                            attributeName="stroke-dashoffset"

                                            from="100"

                                            to="0"

                                            dur="2s"

                                            repeatCount="indefinite"
                                        />

                                    </line>

                                    {/* NODE */}

                                    <circle
                                        cx={x}
                                        cy={y}

                                        r="55"

                                        fill="#111827"

                                        stroke="#00ffd0"

                                        strokeWidth="4"
                                    />

                                    {/* LABEL */}

                                    <text
                                        x={x}
                                        y={y - 5}

                                        textAnchor="middle"

                                        fill="white"

                                        fontSize="15"
                                    >
                                        {layer.type}
                                    </text>

                                    {
                                        layer.neurons && (

                                            <text
                                                x={x}
                                                y={y + 20}

                                                textAnchor="middle"

                                                fill="#ff9f1c"

                                                fontSize="13"
                                            >
                                                {
                                                    layer.neurons
                                                }
                                            </text>
                                        )
                                    }

                                </g>
                            );
                        }

                        // LAST NODE

                        return (

                            <g key={index}>

                                <circle
                                    cx={x}
                                    cy={y}

                                    r="55"

                                    fill="#111827"

                                    stroke="#00ffd0"

                                    strokeWidth="4"
                                />

                                <text
                                    x={x}
                                    y={y - 5}

                                    textAnchor="middle"

                                    fill="white"

                                    fontSize="15"
                                >
                                    {layer.type}
                                </text>

                                {
                                    layer.neurons && (

                                        <text
                                            x={x}
                                            y={y + 20}

                                            textAnchor="middle"

                                            fill="#ff9f1c"

                                            fontSize="13"
                                        >
                                            {
                                                layer.neurons
                                            }
                                        </text>
                                    )
                                }

                            </g>
                        );
                    }
                )
            }

        </svg>
    );
}

export default NetworkGraph;