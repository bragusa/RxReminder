import { useEffect, useState, useRef } from 'react';

const useBroadcastChannel = (channelName, initialValue) => {
  const [value, setValue] = useState(initialValue);
  const channelRef = useRef(new BroadcastChannel(channelName));

  useEffect(() => {
    const channel = channelRef.current;

    const handleChannelMessage = (event) => {
      setValue(event.data);
    };

    channel.addEventListener('message', handleChannelMessage);

    return () => {
      channel.removeEventListener('message', handleChannelMessage);
      channel.close();
    };
  }, [channelName]);

  const sendMessage = (message) => {
    channelRef.current.postMessage(message);
  };

  return [value, sendMessage];
};

export default useBroadcastChannel;