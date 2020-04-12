import React, { useState, useEffect } from "react";
import VolumeAnalyser from "./VolumeAnalyser";

export const Microphone = ({ onVolumeChange, getMic }) => {
  const [audio, setAudio] = useState(null);

  useEffect(() => {
    if (!getMic) {
      if (!audio) return;
      audio.getTracks().forEach((track) => track.stop());
      setAudio(null);
    } else {
      async function getMicrophone() {
        const audio = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });
        setAudio(audio);
      }
      getMicrophone();
    }
  }, [getMic]);

  const onVolumeUpdate = (volume) => {
    onVolumeChange(volume);
  };

  return (
    <>{audio && <VolumeAnalyser audio={audio} onUpdate={onVolumeUpdate} />}</>
  );
};

export default Microphone;
