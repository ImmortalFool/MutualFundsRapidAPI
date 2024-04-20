import React, { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";
import ErrorMessage from "./ErrorMessage";

const Login = () => {
    const[username, setUserName] = useState("")
    const[password, setPassword] = useState("")
    const[errorMessage, setErrorMessage] = useState("")
    const[, setToken] = useContext(UserContext)

    const submitLogin = async () => {
        const formData = new URLSearchParams();
        formData.append('grant_type', '');
        formData.append('username', username);
        formData.append('password', password);
        formData.append('scope', '');
        formData.append('client_id', '');
        formData.append('client_secret', '');
    
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: formData.toString()
        };
    
        const response = await fetch("/auth/v1/token", requestOptions);
        const data = await response.json();

        if (!response.ok) {
            setErrorMessage(data.detail);
        } else {
            setToken(data.access_token);
        }
    }
    const handleSubmit = (e) => {
        e.preventDefault()
        submitLogin()
    }

    return (
        <div className="column">
            <form className="box" onSubmit={handleSubmit}>
                <h1 className="title has-text-centered">Login</h1>
                <div className="field">
                    <label className="label">Username</label>
                    <input 
                        type="text" 
                        placeholder="Enter username" 
                        value={username} 
                        onChange={ (e) => setUserName(e.target.value)}
                        className="input"
                        required
                    />
                </div>
                <div className="field">
                    <label className="label">Password</label>
                    <input 
                        type="password" 
                        placeholder="Enter password" 
                        value={password} 
                        onChange={ (e) => setPassword(e.target.value)}
                        className="input"
                        required
                    />
                </div>
                <ErrorMessage message={errorMessage}/>
                <br></br>
                <button className="button is-primary" type="submit">Login</button>
            </form>
        </div>
    )
}

export default Login
