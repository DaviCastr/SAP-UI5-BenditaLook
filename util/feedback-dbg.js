sap.ui.define([], function () {
  "use strict";

  const GENERIC_TRANSPORT_ERROR = /^(Communication error|Network error|Failed to fetch)/i;
  function getBackendErrorMessage(error) {
    const visited = new Set();
    let current = error;
    while (current && !visited.has(current)) {
      visited.add(current);
      const candidate = current;
      const backendMessage = candidate.error?.message;
      if (typeof backendMessage === "string" && backendMessage.trim()) {
        return backendMessage;
      }
      if (typeof candidate.message === "string" && candidate.message.trim() && !GENERIC_TRANSPORT_ERROR.test(candidate.message)) {
        return candidate.message;
      }
      current = candidate.cause;
    }
    return undefined;
  }
  var __exports = {
    __esModule: true
  };
  __exports.getBackendErrorMessage = getBackendErrorMessage;
  return __exports;
});
//# sourceMappingURL=feedback-dbg.js.map
