sap.ui.define(["../auth/AuthenticationService", "../auth/providers/XsuaaAuthHelper"], function (___auth_AuthenticationService, ___auth_providers_XsuaaAuthHelper) {
  "use strict";

  const AuthenticationService = ___auth_AuthenticationService["AuthenticationService"];
  const XsuaaAuthHelper = ___auth_providers_XsuaaAuthHelper["XsuaaAuthHelper"];
  class BackendUnavailableError extends Error {
    constructor() {
      super("Backend unavailable");
      this.name = "BackendUnavailableError";
    }
  }
  class SessionExpiredError extends Error {
    constructor() {
      super("Session expired");
      this.name = "SessionExpiredError";
    }
  }
  class RequestFailedError extends Error {
    constructor(message, status) {
      super(message);
      this.status = status;
      this.name = "RequestFailedError";
    }
  }
  function buildAuthHeaders(headers = {}) {
    const result = new Headers(headers);
    const token = AuthenticationService.getSession()?.accessToken;
    if (token) {
      result.set("Authorization", `Bearer ${token}`);
    }
    return result;
  }
  async function adminRequest(path, init = {}) {
    let response;
    try {
      response = await fetch(`${XsuaaAuthHelper.getConfig().adminService}${path}`, {
        ...init,
        headers: buildAuthHeaders(init.headers)
      });
    } catch {
      throw new BackendUnavailableError();
    }
    if (response.status === 401) {
      AuthenticationService.notifySessionExpired();
      throw new SessionExpiredError();
    }
    if (!response.ok) {
      throw new RequestFailedError(await readErrorMessage(response), response.status);
    }
    return response;
  }
  async function readErrorMessage(response) {
    try {
      const payload = await response.json();
      return payload.error?.message ?? response.statusText;
    } catch {
      return response.statusText;
    }
  }
  function isSessionExpiredError(error) {
    return error instanceof SessionExpiredError;
  }
  function isBackendUnavailableError(error) {
    return error instanceof BackendUnavailableError;
  }
  var __exports = {
    __esModule: true
  };
  __exports.BackendUnavailableError = BackendUnavailableError;
  __exports.SessionExpiredError = SessionExpiredError;
  __exports.RequestFailedError = RequestFailedError;
  __exports.buildAuthHeaders = buildAuthHeaders;
  __exports.adminRequest = adminRequest;
  __exports.isSessionExpiredError = isSessionExpiredError;
  __exports.isBackendUnavailableError = isBackendUnavailableError;
  return __exports;
});
//# sourceMappingURL=http-dbg.js.map
