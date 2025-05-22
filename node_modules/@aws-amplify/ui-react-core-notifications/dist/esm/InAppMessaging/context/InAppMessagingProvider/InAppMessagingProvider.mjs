import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { onMessageReceived } from 'aws-amplify/in-app-messaging';
import InAppMessagingContext from '../InAppMessagingContext/InAppMessagingContext.mjs';

function InAppMessagingProvider({ children, }) {
    const [message, setMessage] = useState(null);
    useEffect(() => {
        const listener = onMessageReceived(setMessage);
        return listener.remove;
    }, []);
    const clearMessage = useCallback(() => {
        setMessage(null);
    }, []);
    const value = useMemo(() => ({
        clearMessage,
        displayMessage: setMessage,
        message,
    }), [clearMessage, message]);
    return (React.createElement(InAppMessagingContext.Provider, { value: value }, children));
}

export { InAppMessagingProvider as default };
