import React from "react";
import { Spin } from "antd";

const FullPageLoader = () => {
    return (
        <div className="full-page-loader">
            <Spin size="large" tip="Loading..."/>
        </div>
    );
}

export default FullPageLoader;