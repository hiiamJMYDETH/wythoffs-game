import Image from "../../../inspo/Screenshot_20230929_134935.webp";

function Background() {
    return (
        <img src={Image} style={{
            position:'absolute',
            zIndex:'-1',
            width:'100%',
            height:'100%'
        }}/>
    )
}

export default Background;