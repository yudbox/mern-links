import React, { useState, useEffect, useContext } from "react";
import { useHttp } from '../hooks/http.hook'
import {AuthContext} from '../context/AuthContext'
import {useHistory} from 'react-router-dom' 

export const CreatePage = () => {
    const history = useHistory()
    const auth = useContext(AuthContext)
    const [link, setLink] = useState('')
    const { request } = useHttp();

    // данный useEffect делает инпуты окна регистрации активными после вылогинивания
    useEffect(() => {
        window.M.updateTextFields()
    }, [])

    const changeHandler = (e) => {
        setLink(e.target.value)
    }

    const pressHandler = async (e) => {
        if (e.key === 'Enter') {
            try {
                const data = await request('/api/link/generate', 'POST', {from: link}, {
                    Authorization: `Bearer ${auth.token}`
                })
                history.push(`/detail/${data.link._id}`)
            } catch (error) { }
        }

    }
    return (
        <div className="row">
            <div className="col s8 offset-s2" style={{ paddingTop: '2rem' }}>
                <div className="input-field">
                    <input
                        placeholder="Insert the link"
                        id="link"
                        type="text"
                        value={link}
                        onChange={changeHandler}
                        onKeyPress={pressHandler}
                    />
                    <label htmlFor="link">Your link</label>
                </div>
            </div>
        </div>
    )
}