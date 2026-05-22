
import torch
import torch.nn as nn

class DynamicModel(nn.Module):

    def __init__(self):
        super().__init__()

        self.layer0 = nn.Linear(
            784,
            128
        )

        self.layer1 = nn.ReLU()


    def forward(self, x):

        x = self.layer0(x)

        x = self.layer1(x)

        return x
