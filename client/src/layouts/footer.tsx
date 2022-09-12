import useRingStore from "../stores/ringStore"
import Logo from "../components/logo"

import { useCallback } from "react";
import Ring from "../components/ring";


const Footer: React.FC = () => {

    const links = useRingStore(useCallback(s => s.links, []));
    return (
      <div className="fullWidth align-end padded" style={{bottom: 0, left: 0}}>
        <div className="centerh" style={{width: "30%"}}>
          <Ring collapsed/>
        </div>
      </div>
    )
}

export default Footer