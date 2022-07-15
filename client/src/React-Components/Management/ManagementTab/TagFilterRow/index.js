import "./index.css"
import {Tag, TagContainer} from "../../../TagContainer";

const TagFilterRow = ({name, optionMap, selected, setSelected, ...others}) => {

	const onClickOption = (option) => {
		setSelected(option.value)
	}

	return (
		<div className={"filterRow"}>
			<h3>{name}</h3>
			<TagContainer {...others}>
				{optionMap.map((option) => <Tag
					selected={selected === option.value}
					key={option.key}
					onClick={() => onClickOption(option)}
				>{option.key}</Tag>)}
			</TagContainer>
		</div>
	)
}

export default TagFilterRow;
