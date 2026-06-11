import { Navigate, Outlet } from 'react-router-dom';
import { UserAuthenticationState } from './helpers/session-storage';

const GbcPrivatesRoutes = ({redirectPath='/gbc/login', children }: any) => {

    if (UserAuthenticationState() !== 'yes') {
        return <Navigate to={redirectPath} replace />
    }

    return children ? children : <Outlet />
};

export default GbcPrivatesRoutes;
