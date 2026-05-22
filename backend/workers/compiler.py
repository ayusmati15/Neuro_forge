import torch
import importlib.util


def generate_model_code(config):

    code = """
import torch
import torch.nn as nn

class DynamicModel(nn.Module):

    def __init__(self):
        super().__init__()
"""

    # CREATE LAYERS
    for idx, layer in enumerate(config["layers"]):

        # LINEAR LAYER
        if layer["type"] == "Linear":

            code += f"""
        self.layer{idx} = nn.Linear(
            {layer['in_features']},
            {layer['out_features']}
        )
"""

        # RELU ACTIVATION
        elif layer["type"] == "ReLU":

            code += f"""
        self.layer{idx} = nn.ReLU()
"""

        # SIGMOID ACTIVATION
        elif layer["type"] == "Sigmoid":

            code += f"""
        self.layer{idx} = nn.Sigmoid()
"""

        # TANH ACTIVATION
        elif layer["type"] == "Tanh":

            code += f"""
        self.layer{idx} = nn.Tanh()
"""

        # DROPOUT
        elif layer["type"] == "Dropout":

            dropout_rate = layer.get("p", 0.5)

            code += f"""
        self.layer{idx} = nn.Dropout(
            p={dropout_rate}
        )
"""

    # FORWARD FUNCTION
    code += """

    def forward(self, x):
"""

    for idx, _ in enumerate(config["layers"]):

        code += f"""
        x = self.layer{idx}(x)
"""

    code += """
        return x
"""

    return code


def write_model_file(code):

    with open(
        "generated/dynamic_model.py",
        "w"
    ) as f:

        f.write(code)


def load_dynamic_model():

    spec = importlib.util.spec_from_file_location(
        "dynamic_model",
        "generated/dynamic_model.py"
    )

    module = importlib.util.module_from_spec(spec)

    spec.loader.exec_module(module)

    model = module.DynamicModel()

    return model