import './Dialog.css';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import images from '../../../Resources/Images';
import FocusTrap from '../../KeyNavigation/FocusTrap';
import { useContext, useCallback, useEffect, useRef } from "react";
import { AppContext } from '../../../Context';
import strings from '../../../Resources/Strings';
import ReactDOM from "react-dom";

const Dialog = props => {
  const dialog = useRef(null);
  const headerRef = useRef(null);
  const contentRef = useRef(null);
  const footerRef = useRef(null);
  const [appContext, setAppContext] = useContext(AppContext);
  const [zIndex, setZIndex] = useState();
  
  const hideMe = useCallback((evt) => {
    if(props.owner){
      props.owner.focus();
      evt.stopPropagation();
    }

    let currentContext = {...appContext};
    currentContext.zIndex--;
    setAppContext(currentContext);
    setZIndex(null);

    props.hideCallback();

  }, [props]);

  useEffect(() => { 
    if(props.owner){
      let currentContext = {...appContext};
      currentContext.zIndex++;
      setAppContext(currentContext);
      setZIndex(currentContext.zIndex);
      console.log('showing dialog at zIndex', currentContext.zIndex);
      dialog.current.style.height = (dialog.current.getBoundingClientRect().height - 2) + 'px';
      const defaultFocus = contentRef.current.querySelector('a[data-default], input[data-default], button[data-default], textarea[data-default]');
      if(defaultFocus){
        defaultFocus.focus();
        try{
          defaultFocus.select();
        }catch(error){}
      }
      else {
        const contentFocus = contentRef.current.querySelector('a, input, button, textarea');
        if(contentFocus){
          contentFocus.focus();
          try{
            contentFocus.select();
          }catch(error){}
        }
        else {
          const footerFocus = footerRef.current.querySelector('a, input, button, textarea');
          if(footerFocus){
            footerFocus.focus();
          }
          else {
            const headerFocus = headerRef.current.querySelector('a, input, button, textarea');
            if(headerFocus){
              headerFocus.focus();
            } 
          }
        }
      }
      if(props.centerOnOwner){
        const ownerRect = props.owner.getBoundingClientRect();
        let dialogRect = dialog.current.getBoundingClientRect();
        let left = (ownerRect.left + ownerRect.width/2);
        let top = (ownerRect.top + ownerRect.height/2);

        if(top < 16) {
          top = 26;
        }
        const vDiff = (top + dialogRect.height) - window.innerHeight;
        if(vDiff > 0){
          top -= vDiff;
        }

        if(dialogRect.width/2 - left < 32) {
          left += 32;
        }
        const hDiff = (left + dialogRect.width) - window.innerWidth;
        if(hDiff > 0){
          left -= hDiff;
        }
        dialog.current.style.left = left +'px';
        dialog.current.style.top = top +'px';
      }
      const currentRect = dialog.current.getBoundingClientRect();
      if(currentRect.x < 0){
        dialog.current.style.left = (10+currentRect.width/2)+'px';
      }
      if(currentRect.y < 0){
        dialog.current.style.top = (10+currentRect.height/2)+'px';
      }
    }
    else if(zIndex){
      let currentContext = {...appContext};
      currentContext.zIndex--;
      setAppContext(currentContext);
      setZIndex(null);
    }

  }, [props.owner, props.centerOnOwner]);

  let startMousePosition;
  let originalPosition;

  const myMouseMove = (evt)=>{
    const rect = dialog.current.getBoundingClientRect();
    const positionDiff = [evt.pageX-startMousePosition[0], evt.pageY-startMousePosition[1]];
    const newPosition = [originalPosition[0]+positionDiff[0]+(rect.width/2), originalPosition[1]+positionDiff[1]+(rect.height/2)];
    dialog.current.style.left = newPosition[0]+'px';
    dialog.current.style.top = newPosition[1]+'px';
  }

  const myMouseDown = (evt) =>{
    evt.currentTarget.style.cursor='grabbing';
    const rect = dialog.current.getBoundingClientRect();
    startMousePosition=[evt.nativeEvent.pageX, evt.nativeEvent.pageY];
    originalPosition=[rect.left, rect.top];
    document.body.addEventListener('mousemove', myMouseMove);
    document.body.addEventListener('mouseup', (evt)=>{
      if(headerRef?.current){
        headerRef.current.style.cursor='grab';
      }
      document.body.removeEventListener('mousemove', myMouseMove);
    });
  }

  const theDialog = <div style={{display: props.owner?'initial':'none', zIndex: zIndex}} onClick={()=>{if(props.showClose){props.hideCallback()}}} onMouseDown={(evt)=>{evt.stopPropagation()}} onKeyDown={(evt)=>{if(['Escape'].includes(evt.key)){
    hideMe(evt);
    }}} className='teamCalendar--dialog-wrapper' data-owner-selector={props.owner?.selector}>
      <div ref={dialog} onClick={(evt)=>{evt.stopPropagation()}} className='teamCalendar--dialog'>
        <FocusTrap>
          <div ref={headerRef} onMouseDown={myMouseDown} className='teamCalendar--dialog-header'>
            <span>{props.title}</span><span>{props.help?<span style={{cursor: 'default'}} title={props.help}>{images.help}</span>:null}{props.headerAction?<button title={props.headerAction.title} onClick={props.headerAction.action}>{props.headerAction.image}</button>:null}{props.showClose?<button title={strings.Close} onClick={props.hideCallback} className='teamCalendar--dialog-close'>{images.close}</button>:null}</span>
          </div>
          <div ref={contentRef} className={props.padding?'teamCalendar--dialog-content':'teamCalendar--dialog-content-no-padding'}>
            {props.children}
          </div>
          <div ref={footerRef} className='teamCalendar--dialog-footer'>
              {props.footer}
          </div>
        </FocusTrap>
    </div>
  </div>;

  // return dialog;


  if(props.usePortal){
    // React does *not* create a new div. It renders the children into `domNode`.
    // `domNode` is any valid DOM node, regardless of its location in the DOM.
      return props.owner?ReactDOM.createPortal(
        theDialog,
        document.body
      ):null;
    }
    return props.owner?theDialog:null;
}

Dialog.propTypes = {
  hideCallback: PropTypes.func,
  showClose: PropTypes.bool,
  padding: PropTypes.bool,
  usePortal: PropTypes.bool,
  footer: PropTypes.element,
  centerOnOwner: PropTypes.bool,
  help: PropTypes.string
};

Dialog.defaultProps = {
  hideCallback: ()=>{},
  showClose: true,
  padding: true,
  usePortal: false,
  centerOnOwner: false,
  help: null
};

export default Dialog;