import { useEffect, useRef, useState } from "react";
import ReactPlayer from 'react-player';

export default function Player(props) {

    const videoNode = useRef(null);
    const [player, setPlayer] = useState(null);
    const [isPlaying, setIsPlaying] = useState(true);
    
    useEffect(() => {
        // if (videoNode.current) {
        //     const _player = videojs(videoNode.current, props);
        //     setPlayer(_player);
        //     return () => {
        //         if (player !== null) {
        //             player.dispose();
        //         }
        //     };
        // }
        console.log("props-->",props)
    }, []);
    
    return (
    <div className="">
        <ReactPlayer width={"100%"} className="w-100" url={props.url} playing={ isPlaying } />
    </div>
    );

}