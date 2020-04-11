import React, { useState, useEffect } from "react";
import VolumeAnalyser from "./VolumeAnalyser";

export const Microphone = ({ onVolumeChange }) => {
  const [audio, setAudio] = useState(null);
  const [getMic, setGetMic] = useState(false);

  useEffect(() => {
    if (!getMic) {
      stopMicrophone();
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

  const stopMicrophone = () => {
    if (!audio) return;
    audio.getTracks().forEach((track) => track.stop());
    setAudio(null);
  };

  const toggleMicrophone = () => {
    if (audio) {
      setGetMic(false);
    } else {
      setGetMic(true);
    }
  };

  const onVolumeUpdate = (volume) => {
    onVolumeChange(volume);
  };

  return (
    <>
      <button onClick={toggleMicrophone}>
        {audio ? "Stop microphone" : "Get microphone input"}
      </button>
      {audio && <VolumeAnalyser audio={audio} onUpdate={onVolumeUpdate} />}
    </>
  );
};

export default Microphone;
