import styles from "../styles/Home.module.css";

export default function Home() {
    // How do we show the recently listed NFTs?

    // We will index the emitted events off-chain & then read from our database
    // |_ Setup a server to listen for those events to be fired, & we will add them to a database to query 

    // We can do this using Moralis server (centralized & many features) or The Graph (decentralized)
    // [The Graph -> an indexing protocol for querying networks like Ethereum & IPFS]

    // Centralized Server :-
    // All logic is still 100% on chain 
    // Speed & Development time 
    // hard to start a production blockchain project 100% decentralized 
    // can create more features with a centralized back end to start 

    return (
        <div className={styles.container}>
            
            
            Homepage
        </div>
    );
}
