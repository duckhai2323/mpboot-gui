import { useSelector } from "react-redux"
import { RootState } from "../../redux/store/root"

export const SourceWarning = () => {
    const { sourceChanged, isExecutionHistory } = useSelector((state: RootState) => state.execution)

    if (!isExecutionHistory ) return <></>
    if (!sourceChanged) return <></>
    return (
        <div style={{color: 'red'}}>
            Source modifed
        </div>
    )
}