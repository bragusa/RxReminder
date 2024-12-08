import React, { forwardRef, useEffect, useRef, useState } from 'react';
import './Dialog.scss';
import { User } from '../../App.js';

export interface DialogProps {
  title: string;
  content: React.ReactElement;
  close?: ()=>void;
  user: User;
  index: number;
  cancel: string | null;
  apply: string | null;
}

export interface SimpleDialogProps {
  title: string;
  content: React.ReactElement;
  cancel: string | null;
  apply: string | null;
}

export interface DialogContentProps {
  user?: User;
  close: ()=>void;
}

export interface DialogContentRef {
  apply: () => void;
  cancel: () => void;
}

const Dialog: React.FC<DialogProps> = ({ title, content, close, index, cancel, apply }) => {
//const Dialog = forwardRef<HTMLDivElement, DialogProps>(({ title, content, close, index }, ref) => {
  const contentRef = useRef<any>(null); // Create a ref for the content
  useEffect(()=>{
    document.body.style.overflow = 'hidden';
      
    const dialog = document.querySelector('.Dialog-underlay') as HTMLElement;
    dialog.style.zIndex = ((index+1)*1000).toString();

    setTimeout(()=>{
      
      dialog.style.opacity = '1';
      dialog.style.transform = 'scale(1)';
    }, 100);

    return ()=>{
      document.body.style.overflow = 'auto';
    }
  }, [])

  const newContent = React.cloneElement(content, {
    ...content.props,
    close: close,
    ref: contentRef
  });

  return (<div className="Dialog-underlay">
      <div className='Dialog-main'>
        <header><span>{title}</span><button onClick={close} className='Dialog-close'>x</button></header>
        <div className='Dialog-content'>{newContent}</div>
          <div className='Dialog-button-group'>
            {cancel?<button onClick={() => {
              if (contentRef.current) {
                contentRef.current.cancel(); // Call method on content
              }
            }}>{cancel}</button>:null}
            <button onClick={() => {
              if (contentRef.current) {
                contentRef.current.apply(); // Call method on content
                if(close){
                  close();
                }
              }
            }}>{apply}</button>
          </div>
      </div>
    </div>
  );
};

export default Dialog;