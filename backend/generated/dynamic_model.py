
import torch
import torch.nn as nn

class DynamicModel(nn.Module):

    def __init__(self):
        super().__init__()

        self.layer0 = nn.Linear(
            784,
            2048
        )

        self.layer1 = nn.ReLU()

        self.layer2 = nn.Linear(
            2048,
            1024
        )

        self.layer3 = nn.ReLU()

        self.layer4 = nn.Linear(
            1024,
            512
        )

        self.layer5 = nn.Sigmoid()

        self.layer6 = nn.Linear(
            512,
            128
        )


    def forward(self, x):

        x = self.layer0(x)

        x = self.layer1(x)

        x = self.layer2(x)

        x = self.layer3(x)

        x = self.layer4(x)

        x = self.layer5(x)

        x = self.layer6(x)

        return x
