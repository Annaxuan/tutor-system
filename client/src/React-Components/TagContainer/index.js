import "./index.css"

const TagContainer = ({children, className, ...others}) => <div className={"tagContainer " + (className ? className : "") } {...others}>{children}</div>
const Tag = ({children, selected = false, className, ...others}) => <span className={"tag" + (selected ? " selected " : " ") + (className ? className : "")} {...others}>{children}</span>

export {
	TagContainer,
	Tag
}