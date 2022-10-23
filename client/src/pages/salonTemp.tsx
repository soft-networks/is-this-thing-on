/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { NextPage } from "next";


const SalonTemp: NextPage = () => {

  return (
    <div className="fullBleed hideOverflow">
      <img src="https://storage.googleapis.com/is-this-thing-on/salon.png" style={{width: "100%", height: "100%", overflow: "none"}}/>
    </div>
  )
};  

export default SalonTemp;