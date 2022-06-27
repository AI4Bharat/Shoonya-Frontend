import React from "react";
import { CircularProgress } from "@mui/material";

const FullPageLoader = () => {
    return (
        <div className="full-page-loader">
            <CircularProgress />
        </div>
    );
}

export default FullPageLoader;