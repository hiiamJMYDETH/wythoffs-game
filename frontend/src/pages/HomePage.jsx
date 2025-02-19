import {fetching} from "../components/utilities.jsx";
import SideBar from "../components/SideBar.jsx";

function HomePage() {
    fetching().then((message) => {
        console.log('Message from API:', message);
      });
    return (
        <div className="page">
            <SideBar />
            <div className="center">
                <h1>Welcome to Wythoff's Game Online</h1>
            </div>
        </div>
    )
}

export default HomePage;