import { Navigate, Outlet } from 'react-router-dom';
import { GrhUserAuthenticationState } from './helpers/session-storage';

const GrhPrivatesRoutes = ({redirectPath='/grh/login', children }: any) => {

    if (GrhUserAuthenticationState() !== 'yes') {
        return <Navigate to={redirectPath} replace />
    }

    return children ? children : <Outlet />
};

export default GrhPrivatesRoutes;
