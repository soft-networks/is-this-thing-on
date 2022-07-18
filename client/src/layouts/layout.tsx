import Footer from "../components/footer";
import Transactions from "../components/transactions";

const Layout: React.FunctionComponent = ({ children }) => (
  <div className="stack fullBleed lightFill" >
    <main className="flex-1">{children}</main>
    <Footer />
    <Transactions/>
  </div>
);

export default Layout;
