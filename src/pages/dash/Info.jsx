import "./../../App.scss"
import { useState } from "react"
import { retriveData } from "../../utils/localStorage"
import { Icon } from "@chakra-ui/react";
import { FaLeaf } from "react-icons/fa";
export const Info = () => {
    const [user, changeUser] = useState(retriveData("PData"))
    return (
        <>
            <div className="buy">
                <div className="dashIcon" style={{ padding: "1rem 0" }}>

                    <Icon color="#023047" ml="0.7rem" boxSize="5.4rem" as={FaLeaf} />
                </div>
                <div style={{ paddingTop: "1.2rem 0", textAlign: "center", fontSize: "1.5rem", fontWeight: "bolder", color: "#2B1736ff" }}>
                    Your Account Info
                </div>
                <div style={{ paddingTop: "20px" }}></div>
                <div className="container row infoDesc">
                    <div className="col s4 name">Veg. Type</div>
                    <div className="col s6 namespec">spinach</div>
                </div>
                <div className="container row infoDesc">
                    <div className="col s4 name">Email </div>
                    <div className="col s7 namespec">{user?.email}</div>
                </div>
                <div className="container row infoDesc">
                    <div className="col s4 name">Farm Size</div>
                    <div className="col s6 namespec">3.4 Hectares</div>
                </div>
                <div className="container row infoDesc">
                    <div className="col s4 name">Device Id</div>
                    <div className="col s6 namespec">{user?.deviceId}</div>
                </div>
            </div>
        </>
    )
}