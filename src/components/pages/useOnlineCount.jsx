import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import getBaseURL from '../../utlis/baseURL'; 

let socket;

export default function useOnlineCount() {
  const [count, setCount] = useState(0);
  const prevCount = useRef(0);

  useEffect(() => {
    if (!socket) {
      socket = io(getBaseURL(), { withCredentials: true });
    }

    const handleCount = (newCount) => {
      prevCount.current = count;
      setCount(newCount);
    };

    socket.on('online-count', handleCount);
    return () => socket.off('online-count', handleCount);
  }, [count]);

  return count;
}