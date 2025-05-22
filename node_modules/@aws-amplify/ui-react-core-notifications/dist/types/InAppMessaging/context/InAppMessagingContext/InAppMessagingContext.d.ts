/// <reference types="react" />
import { InAppMessage } from '../../types';
export interface InAppMessagingContextType {
    clearMessage: () => void;
    displayMessage: (message: InAppMessage) => void;
    message: InAppMessage | null;
}
declare const InAppMessagingContext: import("react").Context<InAppMessagingContextType | null>;
export default InAppMessagingContext;
