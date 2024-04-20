import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../context/UserContext"
import ListFunds from "./ListFunds";

const Card = ({ item }) => {
    return (
        <div className="card">
            <header className="card-header">
                <p className="card-header-title title is-5">{item.Scheme_Name}</p>
            </header>
            <div className="card-content">
                <div className="content">
                    <p className="">Code: {item.Scheme_Code}</p>
                    <p className="">Category: {item.Scheme_Category}</p>
                    <p className="">Family: {item.Mutual_Fund_Family}</p>
                </div> 
            </div>
            <footer className="card-footer"> 
                <p className="card-footer-item">Quantity</p>
                <p className="card-footer-item">{item.quantity}</p>
            </footer>
        </div>
    )
}

const Purchased = () => {
    const [token] = useContext(UserContext)
    const [data, setData] = useState([])
    const [showContent, setShowContent] = useState(false)
    const [fundFamily, setFundFamily] = useState([])
    const [selectedFamily, setSelectedFamily] = useState("")
    const [fundsToPurchase, setFundsToPurchase] = useState([])
    const [autoRefresh, setAutoRefresh] = useState(false)

    const handleClick = () => {
        setShowContent(!showContent)
        setAutoRefresh(!autoRefresh)
    }

    const handleBuy = async () => {
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
            body: JSON.stringify(fundsToPurchase)
        }
        console.log(JSON.stringify(fundsToPurchase))
        const response = await fetch("/v1/purchase", requestOptions)
        const data = await response.json()
        if (!response.ok) {
            console.log("Error")
        } else {
            console.log("Success", {data})
        }
        setShowContent(!showContent)
    }

    const handleSelectChange = (event) => {
        setSelectedFamily(event.target.value);
    }

    useEffect(() => {
        const fetchFundFamily = async () => {
            const requestOptions = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                }
            }
    
            const response = await fetch("/v1/get-fund-family", requestOptions)
            if (!response.ok) {
                console.log("Error")
            }
            const data = await response.json()
            setFundFamily(data)
        }

        const fetchPurchasedList = async () => {
            const requestOptions = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                }
            }
        
            const response = await fetch("/v1/get-purchase-list", requestOptions)
            if (!response.ok) {
                console.log("Error")
            }
            const data = await response.json()
            setData(data)
        }
        if (autoRefresh) {
            fetchPurchasedList()
        }
        fetchFundFamily()
    }, [token, autoRefresh])

    return(
        <div>
            {
                !showContent ? (
                    <div>
                        <center><button className="button is-primary mb-5" onClick={handleClick}>Purchase Funds</button></center>
                        {
                            !Array.isArray(data) ? (
                                <div className="box">
                                    <h3 className="has-text-weight-bold has-text-danger has-text-centered block is-size-4">{data.message}</h3>
                                </div>
                            ) : (
                            <div className="box">
                                <h1 className="has-text-weight-bold has-text-info has-text-centered block is-size-4" >Purchased Funds List</h1>
                                <div className="card-list">
                                    {Array.isArray(data) && data.map((item, index) => (
                                        <Card key={index} item={item} />
                                    ))}
                                </div>
                            </div>
                            )
                        }
                    </div>
                ) : (
                    <div>
                        <div className="columns is-centered">
                            <div className="column">
                                <button className="button is-primary m-5" onClick={handleBuy}>Buy</button>
                            </div>
                            <div className="column is-two-thirds"></div>
                            <div className="column">
                                <button className="button is-primary m-5" onClick={handleClick}>Back</button>
                            </div>
                        </div>
                        <div className="box">
                            <div className="dropdown is-active">
                                <div className="dropdown-trigger">
                                <select className="button" value={selectedFamily} onChange={handleSelectChange}>
                                    <option value="">Select Fund Family</option>
                                    {Array.isArray(fundFamily) && fundFamily.map((value, index) => (
                                        <option className="has-text-left" key={index} value={value}>{value}</option>
                                    ))}
                                </select>
                                </div>
                            </div>
                            <div className="box m-5">
                                {!selectedFamily && <p className="has-text-weight-bold has-text-danger">Please select a fund family</p>}
                                {selectedFamily && <ListFunds fundFamily={selectedFamily} fundsToPurchase={fundsToPurchase} setFundsToPurchase={setFundsToPurchase}/>}
                            </div>
                        </div>
                        </div>
                )
            }
        </div>
    )
}

export default Purchased;
