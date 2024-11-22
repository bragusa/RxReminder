import React, { useRef} from "react";
import './FocusTrap.css';
import PropTypes from 'prop-types';


const FocusTrap = props => {
  const firstRef = useRef(null);
  const lastRef = useRef(null);

  const blur = (evt)=>{
    const focusElements = firstRef.current.parentElement.querySelectorAll('input, a, button');
    if(evt.currentTarget === firstRef.current){
      focusElements[focusElements.length-1].focus()
    }
    if(evt.currentTarget === lastRef.current){
      focusElements[0].focus()
    }
  }

  let first, last;
  switch (props.elementType){
    case 'td':
      first = <td ref={firstRef} onFocus={blur} className='teamCalendar--trap-first' tabIndex={0}></td>
      last = <td ref={lastRef} onFocus={blur} className='teamCalendar--trap-last' tabIndex={0}></td>
      break;
    default:
      first = <span ref={firstRef} onFocus={blur} className='teamCalendar--trap-first' tabIndex={0}></span>;
      last = <span ref={lastRef} onFocus={blur} className='teamCalendar--trap-last' tabIndex={0}></span>
      break;
  }

  return <>
      {first}
      <React.Fragment>
        {props.children}
      </React.Fragment>
      {last}
  </>
}

FocusTrap.propTypes = {
  elementType: PropTypes.string
}
FocusTrap.defaultProps = {
  elementType: 'span'
};

export default FocusTrap;