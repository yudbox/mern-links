import React, { useCallback, useContext, useEffect, useState } from "react";
import {useHttp} from '../hooks/http.hook'
import {AuthContext} from '../context/AuthContext'
import Loader from '../components/Loader'
import LinksList from '../components/LinksList'

export const LinksPage = () => {
    const [links, setLinks] = useState([])
    const { loading, request } = useHttp()
    const { token } = useContext(AuthContext)

    const loadLinks = useCallback( async () => {
        try {
            const receivedLinks = await request('/api/link', 'GET', null, {
                Authorization: `Bearer ${token}`
            })
            setLinks(receivedLinks)
        } catch (error) {}
    }, [token, request])

    useEffect( () => {
        loadLinks()
    }, [loadLinks])

    if (loading) {
        return <Loader />
    }

    return(
        <>
            {!loading && <LinksList links={links} />}
        </>
    )
}