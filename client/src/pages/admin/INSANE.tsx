// Because of what I'm about to do i, I should never code again.

import { NextPage } from "next";
import { useEffect } from "react";
import { bhavikShouldNeverCodeAgain, butWeMayAsWellDoItAll, repopulateMollyDeletedAssets } from "../../lib/firestore";


const insane: NextPage = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (true) {
      //bhavikShouldNeverCodeAgain();
      // butWeMayAsWellDoItAll();
      //repopulateMollyDeletedAssets();
    }
    
  }, []);
  return <div> this page is insane</div>;
};

export default insane;
