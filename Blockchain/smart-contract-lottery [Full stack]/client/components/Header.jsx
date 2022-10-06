import { ConnectButton } from "@web3uikit/web3"


const Header = () => {
    return (
        <div>
            Decentralized Lottery
            <ConnectButton moralisAuth={false} />
        </div>
    )
}

export default Header