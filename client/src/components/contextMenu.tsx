import { useCallback, useEffect, useState } from 'react';
import { useMuseumMode } from '../stores/useMuseumMode';
import classNames from 'classnames';
import { useImageResizer } from '../stores/useImageResizer';
import useScanningStore from '../stores/useScanningSTore';

export const ContextMenu: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { isMuseumMode } = useMuseumMode();
    useEffect(() => {
        const handleDoubleClick = (e: MouseEvent) => {
            e.preventDefault();
            setIsOpen(true);
        };
        
        document.addEventListener('contextmenu', handleDoubleClick);
        return () => {
            document.removeEventListener('contextmenu', handleDoubleClick);
        };
    }, []);

    return (
        <div
            className={classNames("fixed everest fullBleed center:children", { "hide": !isOpen })}
            style={{ background: "rgba(0,0,0,0.2)" }}
        >
            <div className="stack narrow whiteFill border padded:s-2">
                <MuseumModeSelector />
                {isMuseumMode && <ImageResizer />}
                <div className="border cursor:pointer padded:s-2 whiteFill greenFill:hover" onClick={() => setIsOpen(false)}>close</div>
            </div>
        </div>
    );
};

export const MuseumModeSelector: React.FC = () => {
    const { isMuseumMode, isProjectorMode, enableMuseumMode, disableMuseumMode, enableProjectorMode, disableProjectorMode } = useMuseumMode();
    const setIsScanning = useScanningStore(useCallback((s) => s.setIsScanning, []));

    const setProjectorMode = useCallback(() => {
        disableMuseumMode();
        enableProjectorMode();    
        setIsScanning(true);
    }, [enableProjectorMode, disableMuseumMode, setIsScanning]);

    const setMuseumMode = useCallback(() => {
        enableMuseumMode();
        disableProjectorMode();
        setIsScanning(false);
    }, [enableMuseumMode, disableProjectorMode, setIsScanning]);

    const disableAllModes = useCallback(() => {
        disableMuseumMode();
        disableProjectorMode();
        setIsScanning(false);
    }, [disableMuseumMode, disableProjectorMode, setIsScanning]);

    return (
        <div className="horizontal-stack">
            <div
                onClick={() => setMuseumMode()}
                className={classNames("border cursor:pointer padded:s-2 whiteFill greenFill:hover", { "greenFill": isMuseumMode })}
            >
                museum mode
            </div>
            <div
                onClick={() => setProjectorMode()}
                className={classNames("border cursor:pointer padded:s-2 whiteFill greenFill:hover", { "greenFill": isProjectorMode })}
            >
                projector mode
            </div>
            <div
                onClick={disableAllModes}
                className={classNames("border cursor:pointer padded:s-2 whiteFill greenFill:hover", { "greenFill": !isMuseumMode && !isProjectorMode })}
            >
                regular mode
            </div>
        </div>
    );
};

export const ImageResizer: React.FC = () => {
    const { incrementWidth, decrementWidth, incrementHeight, decrementHeight } = useImageResizer();
    return (
        <div className="stack">
            <div className="horizontal-stack">
                <div className="stack:s-2">
                    <div style={{ height: "20px" }}>height</div>
                    <div className="border cursor:pointer padded:s-2 whiteFill greenFill:hover" onClick={incrementHeight}> + </div>
                    <div className="border cursor:pointer padded:s-2 whiteFill greenFill:hover" onClick={decrementHeight}> - </div>
                </div>
                <div className="stack:s-2">
                    <div style={{ height: "20px" }}>width</div>
                    <div className="border cursor:pointer padded:s-2 whiteFill greenFill:hover" onClick={incrementWidth}> + </div>
                    <div className="border cursor:pointer padded:s-2 whiteFill greenFill:hover" onClick={decrementWidth}> - </div>
                </div>
            </div>
        </div>

    );
};
