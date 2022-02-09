import IsThisThingOnFooter from "../components/isThisThingOnFooter";
import { StreamNameProvider } from "../lib/streamNameProvider"


const Layout : React.FunctionComponent = ({children}) => { 
  return (
    <StreamNameProvider>
      <div className="stack:large">
        <main>
          {children}
        </main>
        <IsThisThingOnFooter />
      </div>
    </StreamNameProvider>
  )
}

export default Layout;