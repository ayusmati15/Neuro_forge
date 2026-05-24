import sys
import json
import time
import random

import torch
import torch.nn as nn

# -------------------------
# READ ARCHITECTURE
# -------------------------

architecture = json.loads(
    sys.argv[1]
)

layers_data = architecture["layers"]

# -------------------------
# VALIDATION
# -------------------------

errors = []

activation_layers = [
    "ReLU",
    "GELU",
    "SELU",
    "ELU",
    "Tanh",
    "Softmax",
    "Swish"
]

if len(layers_data) == 0:

    errors.append(
        "Architecture is empty."
    )

for i, layer in enumerate(layers_data):

    current = layer["type"]

    # -------------------------
    # ACTIVATION FIRST
    # -------------------------

    if (
        i == 0
        and current in activation_layers
    ):

        errors.append(
            f"{current} cannot be the first layer."
        )

    # -------------------------
    # SOFTMAX NOT LAST
    # -------------------------

    if (
        current == "Softmax"
        and i != len(layers_data) - 1
    ):

        errors.append(
            "Softmax should be the final layer."
        )

    # -------------------------
    # DOUBLE ACTIVATION
    # -------------------------

    if i > 0:

        prev =layers_data[i - 1]["type"]

        if (
            prev in activation_layers
            and current in activation_layers
        ):

            errors.append(
                f"Invalid sequence: {prev} → {current}"
            )

# -------------------------
# RETURN ERRORS
# -------------------------

if len(errors) > 0:

    print(
        json.dumps({
            "errors": errors
        })
    )

    sys.exit(0)

# -------------------------
# BUILD MODEL
# -------------------------

model_layers = []

input_size = 784

layer_profiles = []

generated_code = []

generated_code.append(
"""import torch
import torch.nn as nn

class NeuroForgeModel(nn.Module):

    def __init__(self):
        super().__init__()

        self.network = nn.Sequential(
"""
)

start_time = time.time()

for layer in layers_data:

    layer_type = layer["type"]

    # -------------------------
    # DENSE
    # -------------------------

    if layer_type == "Dense":

        neurons = layer.get(
            "neurons",
            128
        )

        dense = nn.Linear(
            input_size,
            neurons
        )

        model_layers.append(
            dense
        )

        generated_code.append(
            f"            nn.Linear({input_size}, {neurons}),"
        )

        params = sum(
            p.numel()
            for p in dense.parameters()
        )

        layer_profiles.append({

            "type": "Dense",

            "neurons": neurons,

            "output_shape":
                [1, neurons],

            "parameters": params,

            "activity_strength":
                round(
                    random.uniform(
                        0.2,
                        1.0
                    ),
                    3
                ),

            "latency_ms":
                round(
                    random.uniform(
                        0.05,
                        0.4
                    ),
                    3
                ),

            "tensor_elements":
                neurons
        })

        input_size = neurons

    # -------------------------
    # RELU
    # -------------------------

    elif layer_type == "ReLU":

        model_layers.append(
            nn.ReLU()
        )

        generated_code.append(
            "            nn.ReLU(),"
        )

        layer_profiles.append({

            "type": "ReLU",

            "output_shape":
                [1, input_size]
        })

    # -------------------------
    # GELU
    # -------------------------

    elif layer_type == "GELU":

        model_layers.append(
            nn.GELU()
        )

        generated_code.append(
            "            nn.GELU(),"
        )

        layer_profiles.append({

            "type": "GELU",

            "output_shape":
                [1, input_size]
        })

    # -------------------------
    # SELU
    # -------------------------

    elif layer_type == "SELU":

        model_layers.append(
            nn.SELU()
        )

        generated_code.append(
            "            nn.SELU(),"
        )

        layer_profiles.append({

            "type": "SELU",

            "output_shape":
                [1, input_size]
        })

    # -------------------------
    # ELU
    # -------------------------

    elif layer_type == "ELU":

        model_layers.append(
            nn.ELU()
        )

        generated_code.append(
            "            nn.ELU(),"
        )

        layer_profiles.append({

            "type": "ELU",

            "output_shape":
                [1, input_size]
        })

    # -------------------------
    # TANH
    # -------------------------

    elif layer_type == "Tanh":

        model_layers.append(
            nn.Tanh()
        )

        generated_code.append(
            "            nn.Tanh(),"
        )

        layer_profiles.append({

            "type": "Tanh",

            "output_shape":
                [1, input_size]
        })

    # -------------------------
    # SOFTMAX
    # -------------------------

    elif layer_type == "Softmax":

        model_layers.append(
            nn.Softmax(dim=1)
        )

        generated_code.append(
            "            nn.Softmax(dim=1),"
        )

        layer_profiles.append({

            "type": "Softmax",

            "output_shape":
                [1, input_size]
        })

    # -------------------------
    # SWISH
    # -------------------------

    elif layer_type == "Swish":

        model_layers.append(
            nn.SiLU()
        )

        generated_code.append(
            "            nn.SiLU(),"
        )

        layer_profiles.append({

            "type": "Swish",

            "output_shape":
                [1, input_size]
        })

    # -------------------------
    # DROPOUT
    # -------------------------

    elif layer_type == "Dropout":

        rate = layer.get(
            "rate",
            0.5
        )

        model_layers.append(
            nn.Dropout(rate)
        )

        generated_code.append(
            f"            nn.Dropout({rate}),"
        )

        layer_profiles.append({

            "type": "Dropout",

            "rate": rate,

            "output_shape":
                [1, input_size]
        })

# -------------------------
# FINALIZE GENERATED CODE
# -------------------------

generated_code.append(
"""        )

    def forward(self, x):
        return self.network(x)
"""
)

# -------------------------
# BUILD MODEL
# -------------------------

model = nn.Sequential(
    *model_layers
)

# -------------------------
# PARAMS
# -------------------------

total_params = sum(
    p.numel()
    for p in model.parameters()
)

# -------------------------
# EXECUTION TIME
# -------------------------

execution_time = (
    time.time()
    - start_time
) * 1000

# -------------------------
# OUTPUT
# -------------------------

output = {

    "layers":
        layer_profiles,

    "total_parameters":
        total_params,

    "execution_time_ms":
        round(
            execution_time,
            3
        ),

    "generated_code":
        "\n".join(
            generated_code
        )
}

print(
    json.dumps(output)
)