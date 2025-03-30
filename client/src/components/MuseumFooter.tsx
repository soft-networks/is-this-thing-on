import React from 'react';
import { useRoomStore } from '../stores/currentRoomStore';
import { useCallback } from 'react';

const MuseumFooter: React.FC = () => {
const roomColor = useRoomStore(useCallback(s => s.roomInfo?.roomColor, []));
  return (
    <footer className="flex-1 contrastFill center:children border-top" style={{'--roomColor': roomColor} as React.CSSProperties}>
        <div className="grow-text">momi footer</div>
      {/* Add your museum-specific footer content here */}
    </footer>
  );
};

export default MuseumFooter; 