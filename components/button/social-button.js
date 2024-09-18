export default function SocialButton(props) {
    return <button {...props} type='button' className={'rounded-md border border-gray-800 text-gray-800 bg-white px-4 py-2 flex justify-between  items-center ' + props.className} >
        {props.icon != undefined && <img src={props.icon} width="30px"/>} {props.children} {props.icon != undefined && <div></div>}
    </button>
}