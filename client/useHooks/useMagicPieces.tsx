import { useCallback, useEffect, useState } from "react";
import { MagicPiece } from "../components/magicPieces";
import { syncMagicPieces, updateMagicPiecePos } from "../lib/firebase";
import useCurrentStreamName from "./useCurrentStreamName";

const useMagicPieces = () => {
  const id = useCurrentStreamName();
  const [magicPieces, setMagicPieces] = useState<MagicPiece[]>([]);

  useEffect(() => {
    syncMagicPieces(id, setMagicPieces);
  }, [id]);

  const updatePiece = useCallback((pieceId: string, nx: number, ny: number) => {
    updateMagicPiecePos(id, pieceId, nx, ny)
  }, [id]);

  return {pieces: magicPieces, updatePiecePos: updatePiece };
};


export default useMagicPieces;
