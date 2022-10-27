import { Chat } from "../components/chat";
import Footer from "./footer";

const Layout: React.FunctionComponent = ({ children }) => (
  <div className="fullBleed lightFill relative" >
    <main className="fullBleed">
      <Chat className=" absoluteOrigin" />
      {children}
    </main>
    <Footer />
  </div>
);

export default Layout;
