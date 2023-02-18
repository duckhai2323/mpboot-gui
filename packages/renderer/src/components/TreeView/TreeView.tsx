import React, { FC, useEffect, useMemo, useRef } from 'react'
// @ts-ignore
import * as phylotree from 'phylotree';
import "./phylotree.css"

const _newick = "(LngfishAu,(LngfishSA,LngfishAf),(Frog,((Turtle,((Sphenodon,Lizard),(Crocodile,Bird))),((((Human,(Cow,Whale)),Seal),(Mouse,Rat)),(Platypus,Opossum)))));"

export interface TreeViewProps {
    newick?: string,
    width: number,
    height: number,
    mode: "radial" | "normal"
}


export const TreeView: FC<TreeViewProps> = ({ newick = _newick, width, height, mode = "normal" }) => {
    const [treeRenderHtml, setTreeRenderHtml] = React.useState('<div></div>')

    useEffect(() => {
        const _tree = new phylotree.phylotree(newick);
        const renderOptions : any = {
            width: width,
            height: height,
            container: "#tree-container",
            'left-right-spacing': 'fit-to-size', 
            'top-bottom-spacing': 'fit-to-size',
        }
        if (mode === "radial") {
            renderOptions["align-tips"] = true;
            _tree.render(renderOptions)
            _tree.display.radial(true).update()
        } else {
            _tree.render(renderOptions)
            
        }

        var tmp = document.createElement("div");

        tmp.appendChild(_tree.display.show());
        setTreeRenderHtml(tmp.innerHTML);
    }, [newick, width, height])

    return (
        <div dangerouslySetInnerHTML={{ __html: treeRenderHtml }} id="tree-container"></div>
    )
}

