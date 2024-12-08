import React, { useEffect, useRef, useState } from "react";
import PropTypes from 'prop-types';

const KeyNavigation = props => {

  const inputRef = useRef(null);
  const [currentElement, setCurrentElement] = useState(0);

  useEffect(() => { 
    if(inputRef.current){
      const elements = [...Array.from(inputRef.current?.querySelectorAll(props.selector)), ...(props.selector==='button'?[]:inputRef.current?.querySelectorAll('button'))];
      elements.forEach((element, elementIndex) => {
        if(props.tabOut){
          element.setAttribute('tabindex', (elementIndex=== currentElement?'0':'-1'));
        }
        element.setAttribute('data-element-index', elementIndex);
        if(props.maintainFocus){
          element.addEventListener('focus', ()=>{
            setCurrentElement(elementIndex);
          });
        }

        const focusElement = (original, offset) =>{
          const newElement = elements[parseInt(original.getAttribute('data-element-index'))+offset];
          if(newElement){
            if(!newElement.hasAttribute('disabled')){
              newElement.focus();
            }
            else {
              focusElement(newElement, offset);
            }
          }else {
            if(offset>0){
              elements[0].focus()
            }
            else {
              elements[elements.length-1].focus();
            }
          }
          

        }

        element.addEventListener('keydown', (evt)=>{
          const element = evt.currentTarget;
          // eslint-disable-next-line default-case
          switch (evt.key){
            case 'ArrowUp':
              focusElement(element, -1);
              evt.stopPropagation();
              evt.preventDefault();
              break;
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
        })
      });
    }
  });
  return <div ref={inputRef} style={{display: 'contents'}}>{props.children}</div>
}

KeyNavigation.propTypes = {
  maintainFocus: PropTypes.bool,
  selector: PropTypes.string,
  tabOut: PropTypes.bool,
  inTable: PropTypes.bool
};

KeyNavigation.defaultProps = {
  maintainFocus: true,
  selector: 'element',
  tabOut: true,
  inTable: false
};

export default KeyNavigation;