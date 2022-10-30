import { Chat } from "../components/chat";
import Footer from "./footer";

const Layout: React.FunctionComponent = ({ children }) => (
  <div className="fullBleed lightFill relative" key="layout">
    <main className="fullBleed" key="main-container">
      <Chat className=" absoluteOrigin" key="chat"/>
      {children}
    </main>
    <Footer />
  </div>
);

export default Layout;
