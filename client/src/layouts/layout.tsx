import Footer from "./footer";

const Layout: React.FunctionComponent = ({ children }) => (
  <div className="fullBleed lightFill relative" >
    <main className="fullBleed">{children}</main>
    <Footer />
  </div>
);

export default Layout;
