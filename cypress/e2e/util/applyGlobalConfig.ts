import { PFIFrameConfig } from "../../../src/types";
import { TestWindow } from "./types";

export const applyGlobalConfig = (testWindow: TestWindow, config: PFIFrameConfig, id?: string | null) => {
    if (id == null) {
        if (testWindow._pfiFrameConfig == null) {
            testWindow._pfiFrameConfig = {
                default: config,
            };
        } else {
            testWindow._pfiFrameConfig.default = config;
        }
    } else {
        if (testWindow._pfiFrameConfig == null) {
            testWindow._pfiFrameConfig = {
                byId: {
                    [id]: config,
                },
            };
        } else {
            testWindow._pfiFrameConfig.byId = {
                ...(testWindow._pfiFrameConfig.byId ?? {}),
                [id]: config,
            };
        }
    }
};
