import BaseController from "./BaseController";
import { AuthenticationService } from "../auth/AuthenticationService";

/**
 * @namespace apps.dflc.benditalook.controller
 */
export default class Login extends BaseController {

    public onInit(): void {
        this.getRouter().getRoute("login")?.attachPatternMatched(() => this.redirectWhenAuthenticated());
    }

    public async onLogin(): Promise<void> {
        try {
            await AuthenticationService.login();
            await this.redirectWhenAuthenticated();
        } catch (error) {
            this.handleError(error, "loginError");
        }
    }

    private async redirectWhenAuthenticated(): Promise<void> {
        if (await AuthenticationService.isAuthenticated()) {
            this.navTo("admin", {}, true);
        }
    }

}
