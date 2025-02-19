import {fetching} from "../../components/utilities.jsx";
import MobileSideBar from "../../components/MobileSideBar.jsx";

function HomePageM() {
    fetching().then((message) => {
        console.log('Message from API:', message);
      });
    return (
        <div className="page">
            <MobileSideBar />
            <div className="center">
                <h1>Welcome to Wythoff's Game Online</h1>
            </div>
        </div>
    )
}

export default HomePageM;