sap.ui.define([], function () {
  "use strict";

  const LOCAL_HOSTS = ["localhost", "127.0.0.1"];
  class Environment {
    static isLocal() {
      return LOCAL_HOSTS.includes(window.location.hostname);
    }
  }
  return Environment;
});
//# sourceMappingURL=Environment-dbg.js.map
