import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useRef, useState } from "react";
const KeyNavigation = ({ maintainFocus = false, selector = 'element', tabOut = true, children, }) => {
    const inputRef = useRef(null);
    const [currentElement, setCurrentElement] = useState(0);
    useEffect(() => {
        if (inputRef.current) {
            // Get elements based on the selector
            const elements = [
                ...Array.from(inputRef.current.querySelectorAll(selector)),
                ...(selector === 'button' ? [] : Array.from(inputRef.current.querySelectorAll('button'))),
            ];
            elements.forEach((element, elementIndex) => {
                if (tabOut) {
                    element.setAttribute('tabindex', elementIndex === currentElement ? '0' : '-1');
                }
                element.setAttribute('data-element-index', elementIndex.toString());
                if (maintainFocus) {
                    element.addEventListener('focus', () => {
                        setCurrentElement(elementIndex);
                    });
                }
                const focusElement = (original, offset) => {
                    // Ensure that newElement is an HTMLElement or null
                    const newElement = elements[parseInt(original.getAttribute('data-element-index') || '') + offset];
                    if (newElement) {
                        // Safely cast newElement to HTMLElement
                        const newElem = newElement;
                        if (!newElem.hasAttribute('disabled')) {
                            newElem.focus();
                        }
                        else {
                            focusElement(newElem, offset);
                        }
                    }
                    else {
                        // Loop focus back to the first or last element
                        if (offset > 0) {
                            const firstElement = elements[0];
                            firstElement.focus();
                        }
                        else {
                            const lastElement = elements[elements.length - 1];
                            lastElement.focus();
                        }
                    }
                };
                // Cast evt.currentTarget to HTMLElement
                element.addEventListener('keydown', (evt) => {
                    const element = evt.currentTarget; // cast the currentTarget to HTMLElement
                    switch (evt.key) {
                        case 'ArrowUp':
                        case 'ArrowLeft':
                            focusElement(element, -1);
                            evt.stopPropagation();
                            evt.preventDefault();
                            break;
                        case 'ArrowRight':
                        case 'ArrowDown':
                            focusElement(element, 1);
                            evt.stopPropagation();
                            evt.preventDefault();
                            break;
                    }
                });
            });
        }
    }, [selector, tabOut, maintainFocus, currentElement]);
    return _jsx("div", { ref: inputRef, style: { display: 'contents' }, children: children });
};
export default KeyNavigation;
