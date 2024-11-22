import './Wait.scss';
import React, { useState } from 'react';

interface Props {
  active?: boolean;
  spinner?: boolean;
  relative?: boolean
}

const Wait: React.FC<Props> = ({ active, spinner, relative }) => {
  return ( active?
      <div className={`Wait-underlay${relative?' Wait-relative':''}`}>
        {spinner?<div className="Wait-spinner"></div>:null}
      </div>
    :null
  );
};

export default Wait;