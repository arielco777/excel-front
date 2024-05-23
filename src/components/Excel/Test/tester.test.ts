import { expect, test } from "vitest";
import { testThis } from "./tester";

test("adds 1 + 2 to equal 3", () => {
    const myList = [1, 5, 6, 8, 3, 5];
    const condition = "(x)=>x>3";
    const evaled = eval(condition);
    const answer = myList.reduce(
        (acc, curr) => (evaled(curr) ? acc + curr : acc + 0),
        0,
    );
    console.log("Answer: ", answer);
    expect(testThis(condition, myList)).toBe(answer);
});
