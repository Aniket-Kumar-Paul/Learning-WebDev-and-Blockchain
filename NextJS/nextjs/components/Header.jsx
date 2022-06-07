import headerStyles from '../styles/Header.module.css'

const Header = () => {
    // const x = 2;
    return (
        <div>
            <h1 className={headerStyles.title}>
                <span> WebDev </span> News
            </h1>

            <p className={headerStyles.description}>Keep up to date with the latest web development news</p>
            {/* <style jsx>
                {`
                .title {
                    color: ${x>3 ? 'red' : 'blue'}; // conditional CSS
                }
            `}
            </style> */}
        </div>
    )
}

export default Header