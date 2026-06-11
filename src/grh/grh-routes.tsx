import { Route, Routes } from "react-router-dom";
import PageNotFound from "../pages/page-not-found";
import { GrhInactiveProvider } from "./helpers/inactive-provider";
import GrhPrivatesRoutes from "./grh-privates-routes";
import GrhLogin from "./pages/login";
import Grh from "./pages/grh";


const GrhRoutes = () => {
    return (
        <GrhInactiveProvider>
            <Routes>
                <Route path='login' element={<GrhLogin />} />
                <Route element={<GrhPrivatesRoutes redirectPath='/grh/login' />} >
                    <Route index element={<Grh />} />
                    {/* Les autres routes sans grh*/}
                    
                </Route> 

                <Route path="*" element={<PageNotFound />} />           
            </Routes>
        </GrhInactiveProvider>
    );
};

export default GrhRoutes;
