// src/services/codeExecutor.js
import { NodeVM } from "vm2";
import logger from "../utils/logger.js";

export const executeSolution = async (code, challenge) => {
  const vm = new NodeVM({
    timeout: challenge.timeLimit * 1000,
    sandbox: {},
    require: false,
    wrapper: "commonjs",
    compiler: "javascript",
  });

  try {
    const testResults = [];
    let allPassed = true;
    let firstOutput = null;

    for (const testCase of challenge.testCases) {
      try {
        const inputParams = JSON.parse(testCase.input);

        const testScript = `
          ${code}
          module.exports = ${challenge.functionName}(...${JSON.stringify(inputParams)});
        `;

        const startTime = process.hrtime();
        const output = vm.run(testScript);
        const [sec, nanosec] = process.hrtime(startTime);
        const runtime = sec * 1000 + nanosec / 1e6; // ms

        const expectedOutput = JSON.parse(testCase.output);
        const passed = JSON.stringify(output) === JSON.stringify(expectedOutput);

        if (firstOutput === null) {
          firstOutput = output;
        }

        testResults.push({
          passed,
          input: inputParams,
          output,
          expected: expectedOutput,
          runtime,
        });

        if (!passed) allPassed = false;

      } catch (err) {
        logger.error(`Test case failed: ${err.message}`);
        testResults.push({
          passed: false,
          input: JSON.parse(testCase.input),
          error: err.message,
          expected: JSON.parse(testCase.output),
          runtime: 0,
        });
        allPassed = false;
      }
    }

    return {
      success: allPassed,
      testResults,
      passedCount: testResults.filter(t => t.passed).length,
      totalTests: testResults.length,
      output: firstOutput !== null ? JSON.stringify(firstOutput) : null,
    };

  } catch (error) {
    logger.error(`Execution Error: ${error.message}`);
    return {
      success: false,
      error: error.message,
      testResults: [],
    };
  }
};

export const executeCode = executeSolution;
