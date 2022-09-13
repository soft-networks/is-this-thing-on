import Footer from "./footer";
import Transactions from "../components/transactions";

const Layout: React.FunctionComponent = ({ children }) => (
  <div className="fullBleed lightFill relative" >
    <main className="fullBleed">{children}</main>
    <Footer />
  </div>
);

export default Layout;
