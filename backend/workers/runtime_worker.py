import sys
import json
import torch
import time

from compiler import (
    generate_model_code,
    write_model_file,
    load_dynamic_model
)

# RECEIVE JSON
input_data = sys.stdin.read()

architecture = json.loads(input_data)

# GENERATE MODEL
code = generate_model_code(
    architecture
)

write_model_file(code)

model = load_dynamic_model()

# STORAGE
layer_profiles = []

# HOOK FUNCTION
def create_hook(name):

    def hook(module, input, output):

        params = 0

        if hasattr(module, "weight"):
            params += module.weight.numel()

        if hasattr(module, "bias") and module.bias is not None:
            params += module.bias.numel()

        layer_profiles.append({
            "layer": name,
            "output_shape": list(output.shape),
            "parameters": params
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

# TOTAL PARAMS
total_params = sum(
    p.numel()
    for p in model.parameters()
)

# RESPONSE
results = {
    "layers": layer_profiles,
    "total_parameters": total_params,
    "execution_time_ms":
        round((end - start) * 1000, 3)
}

# SEND RESPONSE
print(json.dumps(results))