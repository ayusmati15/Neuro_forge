import {
  useEffect,
  useState,
  useRef
} from "react";

import {
  Canvas,
  useFrame
} from "@react-three/fiber";

import {
  OrbitControls,
  Sphere,
  Line,
  Text
} from "@react-three/drei";

import socket from "./socket";

function Pulse({
  start,
  end,
  activity
}) {

  const ref = useRef();

  const t = useRef(
    Math.random()
  );

  useFrame(() => {

    // DYNAMIC SPEED
    t.current +=
      0.005 +
      activity * 0.03;

    if (t.current > 1) {
      t.current = 0;
    }

    const x =
      start[0] +
      (end[0] - start[0]) *
      t.current;

    const y =
      start[1] +
      (end[1] - start[1]) *
      t.current;

    const z =
      start[2] +
      (end[2] - start[2]) *
      t.current;

    ref.current.position.set(
      x,
      y,
      z
    );
  });

  return (
    <Sphere
      ref={ref}
      args={[0.05, 12, 12]}
    >
      <meshStandardMaterial
        color="orange"
        emissive="orange"
        emissiveIntensity={
          2 + activity * 8
        }
      />
    </Sphere>
  );
}

function NeuralCluster({
  layer,
  position
}) {

  const neuronCount =
    Math.min(
      10,
      Math.max(
        3,
        Math.floor(
          layer.parameters / 20000
        )
      )
    );

  const glow =
    Math.max(
      1,
      layer.flops / 100000
    );

  // CREATE VISUAL NEURONS
  const neurons =
    [...Array(neuronCount)]
      .map((_, idx) => {

        const offsetY =
          idx * 0.45 -
          neuronCount * 0.22;

        return [
          position[0],
          position[1] + offsetY,
          position[2]
        ];
      });

  return (
    <group>

      {/* NEURONS */}

      {
        neurons.map(
          (pos, idx) => (

            <Sphere
              key={idx}
              args={[0.16, 24, 24]}
              position={pos}
            >
              <meshStandardMaterial
                color="cyan"
                emissive="cyan"
                emissiveIntensity={glow}
              />
            </Sphere>
          )
        )
      }

      {/* LAYER LABEL */}

      <Text
        position={[
          position[0],
          position[1] + 1.7,
          position[2]
        ]}
        fontSize={0.22}
        color="white"
      >
        {layer.layer_type}
      </Text>

      {/* PARAM COUNT */}

      <Text
        position={[
          position[0],
          position[1] - 1.7,
          position[2]
        ]}
        fontSize={0.15}
        color="orange"
      >
        {layer.parameters} params
      </Text>

    </group>
  );
}

function DenseConnections({
  startLayer,
  endLayer,
  activity
}) {

  const startCount =
    Math.min(
      10,
      Math.max(
        3,
        Math.floor(
          startLayer.parameters / 20000
        )
      )
    );

  const endCount =
    Math.min(
      10,
      Math.max(
        3,
        Math.floor(
          endLayer.parameters / 20000
        )
      )
    );

  const connections = [];

  // CREATE EVERY CONNECTION
  for (
    let i = 0;
    i < startCount;
    i++
  ) {

    for (
      let j = 0;
      j < endCount;
      j++
    ) {

      const start = [
        startLayer.position[0],
        startLayer.position[1]
          + i * 0.45
          - startCount * 0.22,
        0
      ];

      const end = [
        endLayer.position[0],
        endLayer.position[1]
          + j * 0.45
          - endCount * 0.22,
        0
      ];

      connections.push({
        start,
        end
      });
    }
  }

  return (
    <group>

      {
        connections.map(
          (conn, idx) => (

            <group key={idx}>

              <Line
                points={[
                  conn.start,
                  conn.end
                ]}
                color="white"
                lineWidth={1}
              />

              <Pulse
                start={conn.start}
                end={conn.end}
                activity={activity}
              />

            </group>
          )
        )
      }

    </group>
  );
}

export default function App() {

  const [layers, setLayers] =
    useState([]);

  const [trainingData,
    setTrainingData] =
    useState({
      epoch: 0,
      loss: 0,
      activity: 0
    });

  useEffect(() => {

    // MODEL PROFILE
    socket.on(
      "neural-profile",
      (data) => {

        console.log(
          "Telemetry:",
          data
        );

        setLayers(
          data.layers
        );
      }
    );

    // TRAINING STREAM
    socket.on(
      "training-update",
      (data) => {

        console.log(
          "Training:",
          data
        );

        setTrainingData(data);
      }
    );

    return () => {

      socket.off(
        "neural-profile"
      );

      socket.off(
        "training-update"
      );
    };

  }, []);

  // POSITION LAYERS
  const positionedLayers =
    layers.map(
      (layer, idx) => {

        const x =
          idx * 4 -
          (
            (layers.length - 1)
            * 2
          );

        let y = 0;

        if (
          layer.layer_type ===
          "ReLU"
        ) {
          y = 1.5;
        }

        if (
          layer.layer_type ===
          "Sigmoid"
        ) {
          y = -1.5;
        }

        return {
          ...layer,
          position: [x, y, 0]
        };
      }
    );

  return (

    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "black"
      }}
    >

      <Canvas
        camera={{
          position: [0, 0, 16]
        }}
      >

        <ambientLight intensity={0.5} />

        <pointLight
          position={[10, 10, 10]}
        />

        {/* TRAINING HUD */}

        <Text
          position={[-6, 5, 0]}
          fontSize={0.3}
          color="lime"
        >
          Epoch: {
            trainingData.epoch
          }
        </Text>

        <Text
          position={[-6, 4.5, 0]}
          fontSize={0.3}
          color="orange"
        >
          Loss: {
            trainingData.loss
          }
        </Text>

        <Text
          position={[-6, 4, 0]}
          fontSize={0.3}
          color="cyan"
        >
          Activity: {
            trainingData.activity
          }
        </Text>

        {/* NEURAL CLUSTERS */}

        {
          positionedLayers.map(
            (layer, idx) => (

              <NeuralCluster
                key={idx}
                layer={layer}
                position={
                  layer.position
                }
              />
            )
          )
        }

        {/* TRUE DENSE CONNECTIONS */}

        {
          positionedLayers.map(
            (_, idx) => {

              if (
                idx ===
                positionedLayers.length - 1
              ) {
                return null;
              }

              return (

                <DenseConnections
                  key={idx}
                  startLayer={
                    positionedLayers[idx]
                  }
                  endLayer={
                    positionedLayers[idx + 1]
                  }
                  activity={
                    Number(
                      trainingData.activity
                    )
                  }
                />
              );
            }
          )
        }

        <OrbitControls />

      </Canvas>

    </div>
  );
}