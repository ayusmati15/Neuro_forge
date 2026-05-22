import sys
import json
import torch
import time

from compiler import (
    generate_model_code,
    write_model_file,
    load_dynamic_model
)

# RECEIVE JSON FROM NODE
input_data = sys.stdin.read()

architecture = json.loads(input_data)

# GENERATE DYNAMIC MODEL CODE
code = generate_model_code(
    architecture
)

# WRITE GENERATED FILE
write_model_file(code)

# LOAD GENERATED MODEL
model = load_dynamic_model()

# STORAGE
layer_profiles = []


# HOOK FUNCTION
def create_hook(name):

    def hook(module, input, output):

        params = 0
        flops = 0

        # PARAM COUNT
        if hasattr(module, "weight"):

            params += module.weight.numel()

            # APPROX FLOPs
            flops = (
                module.weight.numel() * 2
            )

        # BIAS COUNT
        if (
            hasattr(module, "bias")
            and module.bias is not None
        ):
            params += module.bias.numel()

        # SAVE PROFILE
        layer_profiles.append({
            "layer": name,
            "layer_type":
                module.__class__.__name__,
            "output_shape":
                list(output.shape),
            "parameters": params,
            "flops": flops
        })

    return hook


# REGISTER HOOKS
for name, layer in model.named_children():

    layer.register_forward_hook(
        create_hook(name)
    )

# DUMMY INPUT
x = torch.randn(1, 784)

# TIMER START
start = time.time()

# FORWARD PASS
output = model(x)

# TIMER END
end = time.time()

# TOTAL PARAM COUNT
total_params = sum(
    p.numel()
    for p in model.parameters()
)

# MEMORY ESTIMATION (FP32)
memory_mb = (
    total_params * 4
) / (1024 ** 2)

# FINAL RESPONSE
results = {
    "layers": layer_profiles,
    "total_parameters": total_params,
    "memory_mb": round(memory_mb, 3),
    "execution_time_ms":
        round((end - start) * 1000, 3),
    "final_output_shape":
        list(output.shape)
}

# SEND TO NODE
print(json.dumps(results))