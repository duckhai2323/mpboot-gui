import React from "react";
import { Link } from "react-router-dom";
import { TreeView } from "../components/TreeView/TreeView";

export const TreeViewPage = () => {
    return (
        <>
            <Link to={"/main"}>Back to Main</Link>
            <TreeView width={1000} height={1000} mode="radial" />
        </>
    )
}