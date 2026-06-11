import { Navigate, Outlet } from 'react-router-dom';
import { GimUserAuthenticationState } from './helpers/session-storage';

const GimPrivatesRoutes = ({redirectPath='/gim/login', children }: any) => {

    if (GimUserAuthenticationState() !== 'yes') {
        return <Navigate to={redirectPath} replace />
    }

    return children ? children : <Outlet />
};

export default GimPrivatesRoutes;
