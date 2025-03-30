import { useMuseumMode } from '../../stores/useMuseumMode';

const MomiAdmin = () => {
  const { isMuseumMode, enableMuseumMode, disableMuseumMode } = useMuseumMode();

  return (
    <div className="padded fullWidth">
      <h1>MOMI ADMIN</h1>
      <button
        onClick={() => {
          if (isMuseumMode) {
            disableMuseumMode();
          } else {
            enableMuseumMode();
          }
        }}
      >
        {isMuseumMode ? 'Disable Museum Mode' : 'Enable Museum Mode'}
      </button>
    </div>
  );
};

export default MomiAdmin; 