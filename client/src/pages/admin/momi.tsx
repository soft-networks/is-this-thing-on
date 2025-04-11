import { useEffect } from 'react';
import { populateGlobalStickerCDN } from '../../lib/firestore/stickers';
import { useMuseumMode } from '../../stores/useMuseumMode';

const MomiAdmin = () => {
  const { isMuseumMode, enableMuseumMode, disableMuseumMode } = useMuseumMode();

  useEffect(() => {
    populateGlobalStickerCDN();
  }, []);
  
  return (
    <div className="padded stack fullWidth">
      <h1>PLINTH MODE?</h1>
      <button
        className="padded:s-2 border clickable whiteFill greenFill:hover"
        onClick={() => {
          if (isMuseumMode) {
            disableMuseumMode();
          } else {
            enableMuseumMode();
          }
        }}
      >
        {isMuseumMode ? 'Disable Plinth Mode' : 'Enable Plinth Mode'}
      </button>
    </div>
  );
};

export default MomiAdmin; 