import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import FundCards from "./FundCards";

const ListFunds = ({ fundFamily , fundsToPurchase, setFundsToPurchase}) => {
    const [token] = useContext(UserContext);
    const [datadisplay, setDataDisplay] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const listFunds = async () => {
            setLoading(true);
            const requestOptions = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                }
            };
            const response = await fetch(`/v1/funds-list?family=${fundFamily}`, requestOptions);
            if (!response.ok) {
                console.log("Error")
            }
            const data = await response.json();
            setDataDisplay(data)
            setLoading(false)
        };
        listFunds();
    }, [token, fundFamily]);

    return (
        <div>
            {loading ? <div className="loader"></div>: 
                <div className="card-list">
                    {!datadisplay ? (<p>Yes there is no data</p>): (<FundCards fundsToPurchase={fundsToPurchase} setFundsToPurchase={setFundsToPurchase}/>)}
                </div>
            }
        </div>
    );
};

export default ListFunds;
