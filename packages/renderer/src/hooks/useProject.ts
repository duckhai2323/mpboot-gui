import { useCallback } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store/root";

export const useProject = () : [projectPath : string, getRelativePath: (path : string) => string]=> {
    const projectState = useSelector((state: RootState) => state.project);

    const projectPath = projectState.projectPath;

    const getRelativePath = useCallback((path: string) => {
        const relativePath = path.replace(projectPath, '.');
        return relativePath;
    }, [projectPath])

    return [projectPath, getRelativePath]
}