/** (11)
 * src/utils/codeExecutor.js
 */

import { VM } from "vm2";
import logger from "./logger.js";

const executionLogger = logger.child({ label: "utils/codeExecutor.js" });

export const executeUserCode = async (code) => {
  try {
    const vm = new VM({
      timeout: 2000, // Prevent infinite loops
      sandbox: {}, // Secure execution
    });

    executionLogger.info("Executing user code...");
    const output = vm.run(code);

    return { success: true, output: String(output) };
  } catch (error) {
    executionLogger.warn(`Code execution error: ${error.message}`);
    return { success: false, error: error.message };
  }
};
