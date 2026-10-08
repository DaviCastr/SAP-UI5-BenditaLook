import BaseController from "./BaseController";

/**
 * @namespace apps.dflc.benditalook.controller
 */
export default class App extends BaseController {

    public onInit(): void {
        this.getView()?.addStyleClass("blApp");
    }

}
