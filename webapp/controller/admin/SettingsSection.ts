import JSONModel from "sap/ui/model/json/JSONModel";
import type Control from "sap/ui/core/Control";
import type Context from "sap/ui/model/odata/v4/Context";
import type Admin from "../Admin.controller";
import DraftService from "../../service/DraftService";

const SETTINGS_FILTER = "IsActiveEntity eq false or SiblingEntity/IsActiveEntity eq null";

export default class SettingsSection {

    public readonly model = new JSONModel({ editing: false, loaded: false });

    constructor(private readonly controller: Admin) { }

    public onEdit = async (): Promise<void> => {
        try {
            const draft = await this.controller.runBusy(() => this.draftService().editDraft(this.getContext()));
            this.showContext(draft);
        } catch (error) {
            this.controller.handleError(error, "settingsEditError");
        }
    };

    public onSave = async (): Promise<void> => {
        try {
            await this.controller.runBusy(() => this.draftService().activateDraft(this.getContext()));
            this.controller.showToast("settingsSaved");
            await this.load();
            await this.controller.refreshStoreInfo();
        } catch (error) {
            this.controller.handleError(error, "settingsSaveError");
        }
    };

    public onCancel = async (): Promise<void> => {
        try {
            await this.draftService().discardDraft(this.getContext());
        } catch (error) {
            this.controller.handleError(error, "settingsCancelError");
        } finally {
            await this.load();
        }
    };

    public async load(): Promise<void> {
        try {
            const contexts = await this.controller.runBusy(() => this.controller.getAdminModel()
                .bindList("/StoreSettings", undefined, undefined, undefined, { $filter: SETTINGS_FILTER })
                .requestContexts(0, 1));

            this.showContext(contexts[0]);
        } catch (error) {
            this.controller.handleError(error, "settingsLoadError");
        }
    }

    private showContext(context: Context): void {
        this.getForm().setBindingContext(context);
        this.model.setData({ editing: context.getProperty("IsActiveEntity") === false, loaded: true });
    }

    private getContext(): Context {
        return this.getForm().getBindingContext() as Context;
    }

    private getForm(): Control {
        return this.controller.byControlId<Control>("settingsForm");
    }

    private draftService(): DraftService {
        return new DraftService(this.controller.getAdminModel());
    }

}
