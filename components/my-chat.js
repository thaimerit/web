import Script from "next/script";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import { primary } from "../utils/variable";

export function MyChat({ url }) {
    if(!url) return <></>
    return (
        <a
            href={url} 
            target="_blank"
            rel="noreferrer"
            style={{
                position: "fixed",
                width: "70px",
                height: "70px",
                borderRadius: "50% 50%",
                backgroundColor: primary,
                color: "#FFF",
                right: "24px",
                bottom: "24px",
                zIndex: 9999,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >

            <div className="text-center">
                <div><QuestionAnswerIcon color={"#FFF"} sx={{ fontSize: "40px" }} /></div>
            </div>

        </a>
    );
}
