import IsThisThingOnFooter from "../components/isThisThingOnFooter";

const Layout: React.FunctionComponent = ({ children }) => (
  <div className="stack:large full-bleed">
    <main className="flex-1 padded">{children}</main>
    <IsThisThingOnFooter />
  </div>
);

export default Layout;
