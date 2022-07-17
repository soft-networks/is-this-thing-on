import Footer from "../components/footer";
import Transactions from "../components/transactions";

const Layout: React.FunctionComponent = ({ children }) => (
  <div className="stack:large full-bleed">
    <main className="flex-1 padded">{children}</main>
    <Footer />
    <Transactions/>
  </div>
);

export default Layout;
