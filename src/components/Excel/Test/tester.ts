export const testThis = (evalString: string, myList: number[]) => {
    const condition = eval(evalString);
    return myList.reduce(
        (acc, curr) => (condition(curr) ? acc + curr : acc + 0),
        0,
    );
};
