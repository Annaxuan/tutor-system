import React, {useState} from 'react'
import { uid } from "react-uid";
import { TreeItem, TreeView } from '@mui/lab';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const SideOptions = (props) => {
    const {options, userNodeID, courseNodeID, handler} = props;
    let count = 0;

    const treeItemParser = (options) => {
        if (Array.isArray(options)){
            return <TreeItem
                key={uid({key: options[0]})}
                nodeId={`${count++}`}
                label={options[0]}
                children={options.slice(1).map(treeItemParser)}
            />
        }else {
            return <TreeItem key={uid({item: options})}
                             nodeId={`${count++}`}
                             label={options}
            />
        }
    }

    const defaultExpanded = ["0"];
    if (userNodeID != null && courseNodeID != null) {
        defaultExpanded.push(courseNodeID);
    }

    // Making the tree view controlled
    const [selected, setSelected] = useState(userNodeID);
    const [expanded, setExpanded] = useState(defaultExpanded);

    return (
        <TreeView
            onNodeSelect={(event, value) => {
                setSelected(value)
                handler(event, value);
            }}
            onNodeToggle={(event, value) => {
                setExpanded(value)
            }}
            defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpandIcon={<ChevronRightIcon />}
            expanded={expanded}
            selected={selected}
        >
            {treeItemParser(options)}
        </TreeView>
    );
}

export default SideOptions;