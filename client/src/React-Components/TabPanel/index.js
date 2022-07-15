import "./index.css"

function TabPanel(props) {
	const {children, value, index, ...other} = props;

	return (
		<div hidden={value !== index} {...other}>
			{value === index && (
				<div className={"tabPanelContainer"}>
					{children}
				</div>
			)}
		</div>
	);
}

export default TabPanel;