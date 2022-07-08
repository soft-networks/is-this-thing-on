import Footer from "../components/footer";

const Layout: React.FunctionComponent = ({ children }) => (
  <div className="stack:large full-bleed">
    <main className="flex-1 padded">{children}</main>
    <Footer />
  </div>
);

export default Layout;
