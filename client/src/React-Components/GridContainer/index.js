import "./index.css"

const GridContainer = ({children, ...other}) => <div className={"container"} {...other}>{children}</div>
const Sidebar = ({children, show = true, ...other}) => <>{show && <div className={"item4"} {...other}>{children}</div>}</>
const SidebarContent = ({children, show = true, ...other}) => <>{show && <div className={"item8"} {...other}>{children}</div>}</>
const FullWidthContent = ({children, show = true, ...other}) => <>{show && <div className={"item12"} {...other}>{children}</div>}</>

export {
	GridContainer,
	Sidebar,
	SidebarContent,
	FullWidthContent,
}
