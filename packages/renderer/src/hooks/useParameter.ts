import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Actions } from '../redux/slice/parameter.slice';
import type { ParameterState } from '../redux/state/parameter.state';
import type { RootState } from '../redux/store/root';

export const useParameter = (): [ParameterState, (source: string) => void] => {
    const parameter = useSelector((state: RootState) => state.parameter);
    const dispatch = useDispatch();

    const setSource = useCallback((source: string) => {
        dispatch(Actions.setParameter({ source }));
    }, [dispatch]);

    return [parameter, setSource];
};