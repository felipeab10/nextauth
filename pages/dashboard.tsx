
import { useContext, useEffect } from "react"
import { Can } from "../components/Can"
import { AuthContext } from "../contexts/AuthContext"
import { useCan } from "../hooks/useCan"
import { setupAPIClient } from "../services/api"
import { api } from "../services/apiClient"

import { withSSRAuth } from "../utils/withSSRAuth"

export default function Dashboard() {
    const { user, signOut, broadcastAuth } = useContext(AuthContext);

    const userCanSeeMetrics = useCan({
        permisisons: ['metrics.list']
    });

    useEffect(() => {
        api.get('/me').then(response => console.log(response))

    }, []);

    function logOut() {
        broadcastAuth.current.postMessage("signOut");
        signOut();
    }
    return (
        <>
            <h1>Dashboard {user?.email}</h1>

            <button type="button" onClick={logOut}>Sign Out</button>

            <Can permissions={['metrics.list']}>
                <div>Métricas</div>
            </Can>
        </>
    )
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
    const apiClient = setupAPIClient(ctx)
    //const response = await apiClient.get('/me');

    return {
        props: {}
    }
})