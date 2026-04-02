import { useSelector } from 'react-redux';
import { RootState } from '../store';

const useAuth = () => {
    const auth = useSelector((state: RootState) => state.auth);
    return auth;
};

export default useAuth;
