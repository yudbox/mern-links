import React, {useCallback, useContext, useState, useEffect} from "react";
import {useParams} from 'react-router-dom'
import {useHttp} from '../hooks/http.hook'
import {AuthContext} from '../context/AuthContext'
import Loader from '../components/Loader'
import LinkCard from '../components/LinkCard'

export const DetailPage = () => {
    const {token} = useContext(AuthContext)
    const {request, loading} = useHttp()
    const[link, setLink] = useState(null)
    const linkId = useParams().id //this param id placed in file routes.js in path="/detail/:id"
    
    const getLink = useCallback( async() => {
        try {
           const receivedLink =  await request(`/api/link/${linkId}`, 'GET', null, {
                Authorization: `Bearer ${token}`
            })
            setLink(receivedLink)
        } catch (error) {}
    }, [token, linkId, request])

    useEffect(() => {
        getLink()
    }, [getLink])
    
    if (loading) {
        return <Loader />
    }

    return(
        <>
            {!loading && link && <LinkCard link={link} />}
        </>
    )
}