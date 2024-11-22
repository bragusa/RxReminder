import './Popup.css';
import React, { useContext, useState, useCallback, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import KeyNavigation from '../KeyNavigation/KeyNavigation';
import images from '../../Resources/Images';

import ReactDOM from "react-dom";
import { AppContext } from '../../Context';

const Popup = props => {
  const popupRef = useRef(null);
  const [appContext, setAppContext] = useContext(AppContext);
  const [zIndex, setZIndex] = useState();

  const hideMe = useCallback((evt) => {
    console.log('hideme');
    if(props.owner?.selector){
      const owner = document.querySelector(props.owner.selector);
      if(owner){
        owner.focus();
        evt.stopPropagation();
      }
    }

    if(zIndex){
      let currentContext = {...appContext};
      console.log(zIndex, currentContext.zIndex);
      currentContext.zIndex = currentContext.zIndex-1;
      setAppContext(currentContext);
      setZIndex(null);
      console.log('hiding popup zIndex should now be:', currentContext.zIndex);
    }

    props.hideCallback();
  }, [props]);

  useEffect(() => { 

    if(popupRef.current && props.owner){
      let currentContext = {...appContext};
      currentContext.zIndex++;
      setAppContext(currentContext);
      setZIndex(currentContext.zIndex);
      console.log('showing popup at zIndex', currentContext.zIndex);
      const ownerPos = document.querySelector(props.owner.selector)?.getBoundingClientRect();

      const getPopupRect = ()=>{
        return popupRef.current.getBoundingClientRect()
      }
      if(props.center){
        if(props.matchWidth){
          popupRef.current.style.width = ownerPos.width+'px';
        }
        Object.assign(popupRef.current.style, {top: (ownerPos.top+(ownerPos.height/2))-(getPopupRect().height/2)+document.scrollingElement.scrollTop+'px', left: (ownerPos.left+(ownerPos.width/2))-(getPopupRect().width/2)+document.scrollingElement.scrollLeft+'px'});
      }
      else {
        Object.assign(popupRef.current.style, {top: ownerPos.bottom+document.scrollingElement.scrollTop+'px', left: ownerPos.left+document.scrollingElement.scrollLeft+'px'});
        if(getPopupRect().bottom > window.innerHeight){
          Object.assign(popupRef.current.style, {top: (ownerPos.top-getPopupRect().height)+'px'});
        }

        if(getPopupRect().right > window.innerWidth){
          Object.assign(popupRef.current.style, {left: (ownerPos.left-getPopupRect().width)+'px'});
        }
      }
      
      const selector = props.focusSelector || 'button';
      popupRef.current.querySelector(selector)?.focus();
      document.body.addEventListener('mousedown', hideMe);
      const popupRect = popupRef.current.getBoundingClientRect();
      if(popupRect.left<0){
        popupRef.current.style.left = '10px';
      }
      if(popupRect.top<0){
        popupRef.current.style.top = '10px';
      }

      const vDiff = popupRect.bottom - window.innerHeight;
      const hDiff = popupRect.right - window.innerWidth;

      if(vDiff > 0){
        popupRef.current.style.top = popupRect.top - vDiff + 'px';
      }
      if(hDiff > 0){
        popupRef.current.style.left = popupRect.left - hDiff + 'px';
      }

    }

    return ()=>{
      document.body.removeEventListener('mousedown', hideMe);
    }
  }, [props.show, props.owner, props.focusSelector]);

  const popup = <div style={{zIndex: zIndex}} onMouseDown={(evt)=>{evt.stopPropagation()}} ref={popupRef} onKeyUp={(evt)=>{if(['Escape', 'Enter', ' '].includes(evt.key)){
    hideMe(evt);
    }}} className='teamCalendar--popup' data-owner-selector={props.owner?.selector}>
    <KeyNavigation selector={props.focusSelector} maintainFocus={props.maintainFocus}>
      <div className='teamCalendar--popup-header'><h4>{props.title}</h4><button onClick={props.hideCallback} className='teamCalendar--popup-close'>{images.close}</button></div>
      <div className='teamCalendar--popup-content' onKeyDown={(evt)=>{if(['Escape', 'Enter', ' '].includes(evt.key)){evt.stopPropagation();}}}>{props.children}</div>
      {props.footer}
    </KeyNavigation>
  </div>;

  if(props.usePortal){
  // React does *not* create a new div. It renders the children into `domNode`.
  // `domNode` is any valid DOM node, regardless of its location in the DOM.
    return props.owner?ReactDOM.createPortal(
      popup,
      document.body
    ):null;
  }
  return props.owner?popup:null;
}

Popup.propTypes = {
  owner: PropTypes.shape({selector: PropTypes.string}),
  focusSelector: PropTypes.string,
  maintainFocus: PropTypes.bool,
  hideCallback: PropTypes.func,
  center: PropTypes.bool,
  matchWidth: PropTypes.bool,
  title: PropTypes.string,
  footer: PropTypes.element
};

Popup.defaultProps = {
  hideCallback: ()=>{},
  center: false
};

export default Popup;