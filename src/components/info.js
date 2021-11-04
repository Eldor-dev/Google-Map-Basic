import React from "react";
import { Descriptions } from "antd";

function Info ({address, city, area, state}) {

return (
    <div style={{ padding: "1px", margin: "0 auto"}}>
       <h3>Google Map Basic</h3> 
       <Descriptions size={"small"} bordered>
            <Descriptions.Item  label="City">{city}</Descriptions.Item>
            <Descriptions.Item  label="Area">{area}</Descriptions.Item>
            <Descriptions.Item  label="State">{state}</Descriptions.Item>
            <Descriptions.Item  label="Address">{address}</Descriptions.Item>
       </Descriptions>
    </div>
)

}

export default Info;