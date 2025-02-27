import * as React from 'react';

export function setMockRefElement(node: Partial<HTMLElement>): void {
    const mockRef = {
        get current() {
            return node;
        },
        set current(_value) {
            //noop
        },
    };

    jest.spyOn(React, 'useRef').mockReturnValueOnce(mockRef);
}
