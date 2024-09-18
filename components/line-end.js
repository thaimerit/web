export default function LineEnd({ label, className, style }) {
    return <div style={style} className={"border-b border-gray-200 relative " + className}>
        {label != undefined && <div className="absolute text-gray-600" style={{
            textAlign: "center",
            background: "#fff",
            padding: "0px 5px",
            left: "50%",
            transform: "translate(-50%, -50%)"
        }}>{label}</div>}
    </div>
}