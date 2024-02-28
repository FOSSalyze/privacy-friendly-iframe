import { PFIFrameConfig } from '../../../src/types';
export type TestWindow = {
    executed: boolean;
    caughtData: any;
    _pfiFrameConfig?: {
        default?: PFIFrameConfig;
        byId?: {
            [id: string]: PFIFrameConfig;
        };
    };
} & Cypress.AUTWindow;