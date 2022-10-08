import "../styles/globals.css";
import { MoralisProvider } from "react-moralis";
import { NotificationProvider } from "@web3uikit/core";

function MyApp({ Component, pageProps }) {
    return (
        // initializeOnMount is optionality to hook into a server to add more features to the website
        // but in this project we are not using any server
        <MoralisProvider initializeOnMount={false}>
            <NotificationProvider>
                <Component {...pageProps} />
            </NotificationProvider>
        </MoralisProvider>
    );
}

export default MyApp;
