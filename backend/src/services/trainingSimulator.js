export function startTrainingSimulation(io) {

    let epoch = 1;

    setInterval(() => {

        const loss =
            (
                Math.random() * 0.5
            ).toFixed(3);

        const activity =
            (
                Math.random()
            ).toFixed(2);

        io.emit(
            "training-update",
            {
                epoch,
                loss,
                activity
            }
        );

        console.log(
            "Training Update:",
            {
                epoch,
                loss,
                activity
            }
        );

        epoch++;

    }, 1000);
}