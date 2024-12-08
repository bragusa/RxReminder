import React, { useEffect, useRef, useState } from "react";

// Define the types for props
interface KeyNavigationProps {
  maintainFocus?: boolean;
  selector?: string;
  tabOut?: boolean;
  children: React.ReactNode;
}

const KeyNavigation: React.FC<KeyNavigationProps> = ({
  maintainFocus = false,
  selector = 'element',
  tabOut = true,
  children,
}) => {
  const inputRef = useRef<HTMLDivElement | null>(null);
  const [currentElement, setCurrentElement] = useState<number>(0);

  useEffect(() => {
    if (inputRef.current) {
      // Get elements based on the selector
      const elements = [
        ...Array.from(inputRef.current.querySelectorAll<HTMLElement>(selector)),
        ...(selector === 'button' ? [] : Array.from(inputRef.current.querySelectorAll<HTMLElement>('button'))),
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

        const focusElement = (original: HTMLElement, offset: number) => {
          // Ensure that newElement is an HTMLElement or null
          const newElement = elements[parseInt(original.getAttribute('data-element-index') || '') + offset];

          if (newElement) {
            // Safely cast newElement to HTMLElement
            const newElem = newElement as HTMLElement;

            if (!newElem.hasAttribute('disabled')) {
              newElem.focus();
            } else {
              focusElement(newElem, offset);
            }
          } else {
            // Loop focus back to the first or last element
            if (offset > 0) {
              const firstElement = elements[0] as HTMLElement;
              firstElement.focus();
            } else {
              const lastElement = elements[elements.length - 1] as HTMLElement;
              lastElement.focus();
            }
          }
        };

        // Cast evt.currentTarget to HTMLElement
        element.addEventListener('keydown', (evt: KeyboardEvent) => {
          const element = evt.currentTarget as HTMLElement; // cast the currentTarget to HTMLElement
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

  return <div ref={inputRef} style={{ display: 'contents' }}>{children}</div>;
};

export default KeyNavigation;
