import React from 'react';

export function DaButton(props) {
  return(
    <div>
      < button onclick={props.clickFunctions}>
        Add to plate
      </button>
    </div>
  )
}
