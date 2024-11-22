import '../../Resources/Colors.css';
import './Calendar.css';

import DateUtility from '../../Utility/DateUtility';
import PropTypes from 'prop-types';
import images from '../../Resources/Images';
import Popup from '../Popup/Popup';
import { timeOffTypes } from '../../Resources/TimeOffTypes';

import React, { useRef, useState } from 'react';
import strings from '../../Resources/Strings';
// import KeyNavigation from '../KeyNavigation/KeyNavigation';
import Utility from '../../Utility/Utility';
import Dialog from '../Dialog/Dialog';
// import Snowfall from 'react-snowfall'
// import Turkey from '../../Effects/Turkey';
// import ChristmasLights from '../../Effects/ChristmasLights';

const Calendar = props => {
  // TODO - automatic holidays
  // const holidaysForYear = props.allHolidays[props.userInfo?.country].years[props.displayDate?.getFullYear()];
  const dateResources = DateUtility.getResources();
  const [selected, setSelected] = useState([]);
  const [showPopup, setShowPopup] = useState(null);
  const [focusDay, setFocusDay] = useState(null);
  // const [showComment, setShowComment] = useState(null);
  const [commentDialogOwner, setCommentDialogOwner] = useState(null);
  const [comment, setComment] = useState(null);
  const [editComment, setEditComment] = useState(false);
  const commentArea = useRef();
  const timeOffById = {};
  timeOffTypes.forEach(type=>{
    timeOffById[type.shortName] = type.fullName; 
  });
  const getFirstFocusable = ()=>{
    let returnDay;
    for(let i=1; i<3; i++){
      if(!returnDay){
        let dateToCheck = new Date(props.displayDate.getFullYear(), props.displayDate.getMonth(), i);
        if(![0,6].includes(dateToCheck.getDay())){
          returnDay = i;
        }
      }
    }
    return focusDay || returnDay;
  }
  const firstFocusableDay = getFirstFocusable();;


  const writeDayHeaders = ()=>{
    return <tr className='teamCalendar--calendar-headers'>
      {dateResources.days[props.small?'short':'long'].map((day) =>{
        return <th key={`key_${day}`}><div>{props.small?day.substring(0,1):day}</div></th>;
      })}
    </tr>
  }

  const handleArrowKey = (evt) =>{
    if(evt.key!=='Tab'){
      evt.preventDefault();
    }
    const day = evt.currentTarget.closest('.teamCalendar--calendar-day');
    const next = day.nextSibling;
    const prev = day.previousSibling;
    const rowIndex = day.parentElement.rowIndex;

    const focusDay = (day) =>{
      document.activeElement.setAttribute('tabindex','-1');
      const newFocusDay = day.querySelector('.teamCalendar--action-button') || day;
      if(newFocusDay){
        newFocusDay.setAttribute('tabindex', '0')
        newFocusDay?.focus();
        setFocusDay(newFocusDay.id);
      }
    }

    const canFocus = (day) => {
      if(day.getAttribute('data-can-focus') !== 'true'){
        return false;
      }
      return true;
    }

    // eslint-disable-next-line default-case
    switch (evt.key){
      case 'ArrowRight':
        if(canFocus(next)){
          focusDay(next);
        }
        break;
      case 'ArrowLeft':
        if(canFocus(prev)){
          focusDay(prev);
        }
        break;
      case 'ArrowUp':
        if(rowIndex>1){
          const previousRowDays = day.parentElement.previousSibling.querySelectorAll('TD');
          const previousRowSameDayOfWeek = previousRowDays[day.getAttribute('data-day-of-week')]
          if(canFocus(previousRowSameDayOfWeek)){
            focusDay(previousRowSameDayOfWeek);
          }
        }
        break;
      case 'ArrowDown':
        if(rowIndex<5){
          const nextRowDays = day.parentElement.nextSibling.querySelectorAll('TD');
          const nextRowSameDayOfWeek = nextRowDays[day.getAttribute('data-day-of-week')]
          if(canFocus(nextRowSameDayOfWeek)){
            focusDay(nextRowSameDayOfWeek);
          }
        }
        break;
    }
  }

  const selectDay = (evt)=>{
    let selectedCopy = [...selected];
    if(!evt.ctrlKey){
      selectedCopy = [];
    }
    const day = evt.currentTarget;
    const date = day.getAttribute('data-date');
    if(selected.includes(date)){
      const newSelected = selectedCopy.filter((selectDate) => selectDate !== date);
      setSelected(newSelected);
      return;
    }
    setSelected([...selectedCopy,date]);
  }

  const writeDay = (day, dayNum, dayOfWeek)=>{
    let offset = props.displayDate.getDay();
    
    let displayNum = 0;
    if(dayNum>=offset){
      displayNum = dayNum+1-offset;
      if(displayNum < 1 || displayNum>new Date(props.displayDate.getFullYear(), props.displayDate.getMonth()+1, 0).getDate()){
        displayNum = 0;
      }
    }
    const myDate = displayNum>0 && displayNum.toString().length>0?new Date(props.displayDate.getFullYear(), props.displayDate.getMonth(), displayNum):null;

    const userDataYear = props.userData.years[props.displayDate.getFullYear()]?.timeoff || {};
    const userDataComments = props.userData.years[props.displayDate.getFullYear()]?.comments || {};
    let userValue = myDate?userDataYear[(myDate.getMonth()+1)+'-'+myDate.getDate()] || '':'';
        
    const attributes = {};
    if(myDate && myDate.toDateString() === new Date().toDateString()){
      attributes['data-today'] = 'true';
    }

    const actualUserValue = userValue || '';
    if(props.small){
      userValue = userValue?userValue:(displayNum?displayNum.toString():'');
    }

    let myDateData = myDate?`${myDate.getFullYear()}-${myDate.getMonth()+1}-${myDate.getDate()}`:'';

    let isSelected = selected.includes(myDateData);

    const commonHoliday = null;
    //TODO - automatic holidays
    //const commonHoliday = myDate && holidaysForYear ? holidaysForYear[`${myDate.getMonth()+1}-${myDate.getDate()}`] : null;
    if((props.small && commonHoliday && actualUserValue.length===0) ||  (commonHoliday && (!commonHoliday.background ||  !props.userInfo.preferences.holidaydecorations))){
      userValue='H';
    }

    let className = 'teamCalendar--calendar-day'+(isSelected?' teamCalendar--day-selected':'');
    className+=(dayOfWeek===0 || dayOfWeek === 6?' teamCalendar--calendar-weekend-day':'');
    if(displayNum){
      className+=(['VA','PA'].includes(userValue)?' teamCalendar--day-am':'');
      className+=(['VP','PP'].includes(userValue)?' teamCalendar--day-pm':'');
      className+=(['VA','VP','V'].includes(userValue)?' teamCalendar--day-vacation':'');
      className+=(userValue.includes('S')?' teamCalendar--day-sick':'');
      className+=(userValue.includes('O')?' teamCalendar--day-other':'');
      className+=(['PA','PP','P'].includes(userValue)?' teamCalendar--day-personal':'');
      className+=(commonHoliday || userValue.includes('H')?' teamCalendar--day-holiday':'');
    }

    const editable = props.displayDate >= props.firstEditableDay;// && !commonHoliday;

    const clickButton = (evt)=>{ evt.preventDefault(); evt.stopPropagation(); if(editable && !evt.ctrlKey){setShowPopup({commonHoliday: commonHoliday, selector: `#day_${myDateData} .teamCalendar--action-button`})}};

    const comment = myDate?userDataComments[(myDate.getMonth()+1)+'-'+myDate.getDate()] || '':'';

    return <td style={{position: 'relative', background:  !userValue && !props.small && props.userInfo.preferences.holidaydecorations?commonHoliday?.background:null}} data-holiday-description={commonHoliday?.title} 
    data-editable={editable} data-user-value={actualUserValue} data-commented={comment?'true':'false'} data-flip={editable && props.hovertoflip && displayNum>0 && dayOfWeek !== 0 && dayOfWeek !== 6} tabIndex={editable &&!props.small && displayNum===firstFocusableDay?0:-1} key={`key${dayNum}`} id={`day_${myDateData}`} {...attributes} data-date={myDateData} 
      onMouseLeave={(evt)=>{if(!props.hovertoflip){evt.currentTarget.removeAttribute('data-flip')}}} 
      onMouseDown={(evt)=>{evt.preventDefault();if(editable && evt.button===0 && displayNum && dayOfWeek !==0 && dayOfWeek !== 6){ 
        evt.currentTarget.setAttribute('data-flip','true');selectDay(evt);}}} 
      onKeyDown={(evt)=>{ editable && handleArrowKey(evt);if(displayNum && dayOfWeek !==0 && dayOfWeek !== 6 && [' ', 'Enter'].includes(evt.key)){
        evt.preventDefault();evt.currentTarget.setAttribute('data-flip','true');if(evt.ctrlKey){selectDay(evt)}; let currentday = evt.currentTarget; setTimeout(()=>{
        let nav = currentday.querySelector('div[role="button"]');
        nav?.setAttribute('tabindex','0');
        nav?.focus();},500)}}}
      data-can-focus={displayNum && dayOfWeek !==0 && dayOfWeek !== 6} 
      data-day-of-week={dayOfWeek} className={className}>
      <div className='teamCalendar--calendar-day-inner'>
        <div className='teamCalendar--calendar-day-front' data-holiday-icon={!userValue && props.userInfo.preferences.holidaydecorations?commonHoliday?.icon:null}>
          {/* {!userValue && !props.small && props.userInfo.preferences.holidaydecorations && commonHoliday?.effects?.includes('lights')?<ChristmasLights/>:null} */}
          {!props.small?<><div id={`day${myDateData}`} onFocus={(evt)=>{evt.currentTarget.closest('.teamCalendar--calendar-day').focus()}} className='teamCalendar--calendar-day-number'>{displayNum>0?displayNum:''}</div>
          <div title={commonHoliday?commonHoliday.title:displayNum>0?timeOffById[userValue]:''} className='teamCalendar--calendar-day-content' >
            <div>{displayNum>0?userValue:''}</div>
          </div></>:null}
          {props.small && displayNum>0?<div className='teamCalendar--focus'><button title={commonHoliday?commonHoliday.title:displayNum>0?timeOffById[userValue]:''} tabIndex={displayNum===firstFocusableDay?0:-1} 
            onMouseDown={(evt)=>{
              if(!evt.ctrlKey){evt.stopPropagation()}
            }}
            onClick={(evt)=>{if(editable){clickButton(evt)}}} onKeyDown={(evt)=>{if([' ', 'Enter'].includes(evt.key)){clickButton(evt)}}} className='teamCalendar--action-button'>
            {props.small?userValue:images.overflow.vertical}
          </button></div>:null}
          {(comment || editable ) && displayNum && dayOfWeek !==0 && dayOfWeek !== 6?<div onClick={(evt)=>{setEditComment(editable);setComment(comment);setCommentDialogOwner(evt.currentTarget)}} onMouseDown={(evt)=>{evt.preventDefault();evt.stopPropagation();}} className='teamCalendar--calendar-day-front-comment' 
          title={editable?comment?Utility.buildString('EditComment',comment):strings.AddComment:Utility.buildString('ViewComment',comment)}></div>:null}
        {/* {!userValue && !props.small && props.userInfo.preferences.holidaydecorations && commonHoliday?.effects?.includes('snow')?<Snowfall snowflakeCount={30}/>:null}  
        {!userValue &&  !props.small && props.userInfo.preferences.holidaydecorations && commonHoliday?.effects?.includes('turkey')? <Turkey title={commonHoliday?.title}/>: null} */}
        </div>
        <div className='teamCalendar--calendar-day-back'>
          <div className='teamCalendar--pto-types' style={{display: 'none'}}>
            {renderTimeOffTypes(false, commonHoliday !== null && commonHoliday !== undefined)}
          </div>
        </div>
      </div>
    </td>
  }

  const writeWeek = (week) => {
    return <tr key={`week_${week}`} className='teamCalendar--calendar-week'>
      {dateResources.days.long.map((day, dayOfWeek) => {
        return writeDay(day, dayOfWeek+(week*7), dayOfWeek);
      })}
      </tr>
  }
  
  const writeMonth = ()=>{
    let month = [];
    for(let week=0;week<5;week++){
      month.push(writeWeek(week));
    }
    return month;
  }



  const renderTimeOffTypes = (popup, onlyOther)=>{
    const buttons = [];
    const chooseValue = (evt,value,popup)=>{
      evt.stopPropagation();
      let day;
      if(popup){
        const target = evt.currentTarget.closest('[data-owner-selector]');
        const ownerSelector = target.getAttribute('data-owner-selector');
        if(ownerSelector){
          const owner = document.querySelector(ownerSelector);
          if(owner){
            day = owner.closest('.teamCalendar--calendar-day');
          }
        }
      }
      else {
        day = evt.currentTarget.closest('.teamCalendar--calendar-day');
        if(!day && showPopup.selector){
          day = document.querySelector(showPopup.selector).closest('.teamCalendar--calendar-day');
        }
      }

      if(day){
        day.removeAttribute('data-flip');
        'mouseleave mousedown'.split(' ').forEach(function(evt){
          day.addEventListener(evt,()=>{
            if(props.hovertoflip){
              day.setAttribute('data-flip','true');
            }
            else {
              day.removeAttribute('data-flip');
            }
          },false);
        });
        
        if(selected && selected.includes(day.getAttribute('data-date'))){
          selected.forEach(day=>{
            props.updateUserDate(day,value);
          });
        }
        else{
          const currentValue = day.getAttribute('data-user-value');
          if(value !== currentValue){
            const date = day.getAttribute('data-date');
            props.updateUserDate(date,value,day);
          }
        }
        setSelected([]);
      }
      setShowPopup(null);
    };  


    timeOffTypes.forEach((type, typeIndex) => {
      if(!onlyOther || (onlyOther && type.shortName === 'O') || (onlyOther && type.shortName === '')){
        buttons.push(<div role='button' data-only-other={onlyOther} key={`button_${type.shortName}`} title={type.fullName || strings.Clear} onClick={(evt)=>{chooseValue(evt, type.shortName.toUpperCase(), popup)}} onKeyDown={(evt)=>{if([' ','Enter'].includes(evt.key)){ chooseValue(evt, type.shortName.toUpperCase(), popup);}}} className={`teamCalendar--pto-type teamCalendar--pto-type-${type.fullName.toLowerCase().replaceAll(' ','-')}${!type.shortName?' no-hover':''}`}>{type.shortName || strings.Clear}</div>);
      }
    });
    return buttons;
  }

  const applyComment = (evt)=>{
    const date = commentDialogOwner.closest('.teamCalendar--calendar-day')?.getAttribute('data-date');
    const commentToApply = commentArea.current.value;
    if(date){
      props.updateComment(date, commentToApply);
    }
  }
  const editable = props.displayDate >= props.firstEditableDay;

  return <>
    <table className={'teamCalendar--calendar-month'+(props.small?' teamCalendar--small':'')} data-edit={editable} /*style={{pointerEvents: props.displayDate < props.firstEditableDay?'none':'inherit'}}*/>
      <tbody>
        {props.renderHeader?writeDayHeaders():null}
        {writeMonth()}
      </tbody>
    </table>
    <Popup center={true} hideCallback={()=>{document.querySelector(showPopup.selector)?.focus();setShowPopup(null)}} owner={showPopup} focusSelector='.teamCalendar--pto-type' maintainFocus={true}>
      <div className='teamCalendar--pto-types'>
        {renderTimeOffTypes(false, showPopup && showPopup.commonHoliday !== null && showPopup.commonHoliday !== undefined)}
      </div>
    </Popup>
    <Dialog id='comment_dialog' help={strings.HoldShift} centerOnOwner={true} title={comment?editComment?strings.EditComment.substring(0,strings.EditComment.indexOf(':')):strings.ViewComment.substring(0,strings.ViewComment.indexOf(':')):strings.AddComment} usePortal={true} owner={commentDialogOwner} hideCallback={()=>{commentDialogOwner?.focus();setCommentDialogOwner(null)}} footer={<div className='teamCalendar--dialog-footer-buttons'><button data-default={editComment?null:'true'} onClick={()=>{commentDialogOwner?.focus();setCommentDialogOwner(null)}}>{editComment?strings.Cancel:strings.Done}</button>{editComment?<button onClick={()=>{commentDialogOwner?.focus();setCommentDialogOwner(null);applyComment();}}  data-default={editComment?'true':null}>{strings.Apply}</button>:null}</div>}>
      {editComment?<div className='teamCalendar--comment'><textarea  onKeyDown={evt=>{if(evt.key==='Enter' && !evt.shiftKey){commentDialogOwner?.focus();setCommentDialogOwner(null);applyComment()}}}
       ref={commentArea} onChange={()=>{console.log('update comment')}} defaultValue={comment}/></div> :
      <div className='teamCalendar--readonly-comment'>
        {comment}
      </div>}
    </Dialog>
  </>
}

Calendar.propTypes = {
  displayDate: PropTypes.object,
  small: PropTypes.bool,
  userInfo: PropTypes.shape({
    name: PropTypes.string, 
    theme: PropTypes.string, 
    manager: PropTypes.string
  }),
  updateUserDate: PropTypes.func,
  userData: PropTypes.object,
  renderHeader: PropTypes.bool,
  hovertoflip: PropTypes.bool,
  firstEditableDay: PropTypes.object.isRequired,
  allHolidays: PropTypes.object
};

Calendar.defaultProps = {
  small: false,
  updateUserDate: ()=>{},
  renderHeader: true,
  hovertoflip: true
};

export default Calendar;
