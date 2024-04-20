import React, {useContext, useState, useEffect} from "react";
import { UserContext } from "../context/UserContext";

const BuyCard = ({ item, fundsToPurchase, setFundsToPurchase }) => {
    const [clicked, setClicked] = useState(false)


    const onClickAdd = () => {
        setClicked(!clicked)
        const updatedFundsToPurchase = [...fundsToPurchase]
        updatedFundsToPurchase.push({...item, quantity: 1})
        setFundsToPurchase(updatedFundsToPurchase)  
    }
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
                <p className="card-footer-item">Price: {item.Net_Asset_Value}</p>
                <button className={clicked ? "card-footer-item button is-light" : "card-footer-item button-primary"} onClick={onClickAdd}>Add</button>
            </footer>
        </div>
    );
};

const FundCards = ({fundsToPurchase, setFundsToPurchase}) => {
    const [token] = useContext(UserContext);
    const [fundsPageWise, setFundsPageWise] = useState([]);
    const [page, setPage] = useState(1);

    useEffect( () => {
        const getFundsPage = async (page) => {
            const requestOptions = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                }
            };
            const response = await fetch(`/v1/get-funds-list?page=1`, requestOptions);
            if (!response.ok) {
                console.log("Error")
            }
            const data = await response.json();
            setFundsPageWise(data)
        }
        getFundsPage()
        const handleScroll = () => {
            if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight) return;
            getFundsPage();
            setPage(prevPage => prevPage + 1);
        };
    
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        }
    }, [token, page])

    return (
        <div>
        {Array.isArray(fundsPageWise) && fundsPageWise.map((value, index) => (
            <BuyCard key={index} item={value} fundsToPurchase={fundsToPurchase} setFundsToPurchase={setFundsToPurchase}/>
        ))}
        </div>
    )
}

export default FundCards