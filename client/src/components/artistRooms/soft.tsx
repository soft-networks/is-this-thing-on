import React, { useMemo } from "react";
import DefaultRoomview from "./defaultRoom";

const Soft: React.FC = () => {
  return (
      <DefaultRoomview
        chatStyle={{
          "--chatContainerBackground": "rgb(189, 222, 239)",
          "--chatBorderColor": "rgb(135, 188, 215)",
          "--chatMessageColor": "rgb(70, 116, 91)",
          "--chatAuthorColor": "#183c28"
        } as React.CSSProperties}
      />
  );
};

export default Soft;
