import { useMemo, useEffect, useState } from 'react';
import io from 'socket.io-client';

export const useSocket = (serverPath) => {
  const socket = useMemo(() => io.connect(serverPath, {
    transports: ['websocket']
  }), [serverPath]);
  const [online, setOnline] = useState(false);

  useEffect(() => {
    setOnline(socket.connected);
  }, [socket])

  useEffect(() => {
    socket.on('connect', () => {
      setOnline(true);
    })
    return () => socket.off('connect');
  }, [socket])

  useEffect(() => {
    socket.on('disconnect', () => {
      setOnline(false);
    })
    return () => socket.off('disconnect');
  }, [socket])

  return {
    socket,
    online
  }
}