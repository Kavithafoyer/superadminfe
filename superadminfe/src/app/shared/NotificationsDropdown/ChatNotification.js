import Div from '@jumbo/shared/Div/Div';
import { Avatar, Button, IconButton, Typography } from '@mui/material';
import { CloseIcon } from 'app/icons/PngIcons';
import React, { useState, useEffect, useRef } from 'react';

const ChatNotification = ({ message, onClose, onExpand, expanded }) => {
    //console.log("messagess",message)// Extract the properties from message object
  // alert(message?.Meassage?.substring(0,10))
    return (
      <div
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          backgroundColor: '#ffffff',
          border:"1px solid #3c7c33",
          padding: '10px',
          borderRadius: '4px',
          boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
          cursor: 'pointer',
        }}
      >
        {!expanded && <div onClick={onExpand}>
          <Typography>"New message"</Typography>
          <Typography>{ message?.Meassage?.substring(0,10)+"..."}</Typography>
          </div>}
      
        {expanded && (
            <>
              <Div className='col-lg-1'
              onClick={onClose}>
                    <img
                      className="short-logo"
                      src={`/images/close.png`}
                      width={20}
                      height={20}
                      alt="crm"
                     
                    />
               </Div>

         
          <div className='row'
          style={{
            marginTop:"20px",
            marginBottom:"20px"
          }}>

             <Div className='col-lg-10'>
            <Typography> {message?.Meassage}</Typography>
            </Div>
            
       
          </div>
          
          </>
        )}
         {/* {expanded && (
        
        <i className="fa fa-times" aria-hidden="true"
        size="10px" 
        style={{
          color:"black"
        }}
         />
      
      )} */}
      </div>
    );
  };
  
export default ChatNotification;
