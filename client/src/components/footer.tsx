import useRingStore from "../stores/ringStore"
import Logo from "./logo"

import { useCallback } from "react";


const Footer: React.FC = () => {

    const links = useRingStore(useCallback(s => s.links, []));
    return (
      <div className="fullWidth align-end padded" style={{bottom: 0, left: 0}}>
        <div className="center">
          <Logo linkList={Object.values(links)} />  
        </div>
      </div>
    )
}