import { IAuthenticationProvider } from "../IAuthenticationProvider";
import { MockAuthenticationProvider } from "./MockAuthenticationProvider";
import { XsuaaAuthenticationProvider } from "./XsuaaAuthenticationProvider";
import { XsuaaAuthHelper } from "./XsuaaAuthHelper";

export class AuthenticatedProviderFactory {

    public static create(): IAuthenticationProvider {
        return XsuaaAuthHelper.getConfig().auth
            ? new XsuaaAuthenticationProvider()
            : new MockAuthenticationProvider();
    }

}
