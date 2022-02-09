import IsThisThingOnFooter from "../components/isThisThingOnFooter";
import { StreamNamesProvider } from "../useHooks/useStreamNames"


const Layout : React.FunctionComponent = ({children}) => { 
  return (
    <StreamNamesProvider>
      <div className="stack:large full-bleed padded">
        <main>
          {children}
        </main>
        <IsThisThingOnFooter />
      </div>
    </StreamNamesProvider>
  )
}

export default Layout;