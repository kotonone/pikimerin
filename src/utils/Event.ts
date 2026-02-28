export function createEvent(type: string, eventInitDict: any) {
    const event = new Event(type, {
        bubbles: eventInitDict.bubbles,
        cancelable: eventInitDict.cancelable,
        composed: eventInitDict.composed,
    });

    for (const [key, value] of Object.entries(eventInitDict)) {
        // @ts-ignore
        event[key] = value;
    }

    return event;
}
