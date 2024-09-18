import { CircularProgress } from "@mui/material";

export function LoadingScreen() {
    return (
        <div
            style={{
                position: "absolute",
                top: "0px",
                bottom: "0px",
                left: "0px",
                right: "0px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <CircularProgress />
        </div>
    );
}
