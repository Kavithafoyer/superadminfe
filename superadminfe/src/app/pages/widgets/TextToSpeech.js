import { Button, IconButton } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { memo } from 'react';
import { FcSpeaker } from 'react-icons/fc';
const TextToSpeech = ({ Meassage }) => {
    const [text, setText] = useState('');
    const synth = window.speechSynthesis;
//   console.log("Meassage",Meassage)
    const handleTextChange = (e) => {
      setText(e.target.value);
    };
    const speakText = () => {
      if (synth.speaking) {
        synth.cancel();
      }
      if (Meassage.trim() !== '') {
        const utterance = new SpeechSynthesisUtterance(Meassage);
        synth.speak(utterance);
      }
    };
    return (
        <IconButton sx={{padding:"0px !important",margin:"0px !important"}} onClick={speakText}><FcSpeaker size={18} style={{padding:"0px !important",margin:"0px !important"}} /></IconButton>
    );
};
export default memo(TextToSpeech);