import React, {useEffect, useState} from "react";
import Loader from "react-loaders";
import AnimatedLetters from "../AnimatedLetters";
import "./index.scss";

const Portfolio = () => {
    const [letterClass, setLetterClass] = useState('text-animate');
    // const [portfolio, setPortfolio] = useState([]);




    useEffect(() => {
        const timer = setTimeout(() => {
            setLetterClass('text-animate-hover');
        }, 3000);

        return () => {
            clearTimeout(timer);
        }
    });
    const portfolio = [{
        image: "https://media-exp1.licdn.com/dms/image/C4D22AQHTSF1t5u-R6A/feedshare-shrink_2048_1536/0/1650071589429?e=1660780800&v=beta&t=3PVTZJRxX4BH7sekxEsr5-FMlbNDby-At5ITkKFieiU",
        name: "Expense tracker",
        description: "This is an advance expense tracker application in which you can add, delete, and search for all of your expenses.",
        url: "https://xpense-tracker123.netlify.app/"
    },
    {
        image: "https://media-exp1.licdn.com/dms/image/D4D2CAQH-h2yvraJ3lQ/comment-image-shrink_8192_1280/0/1657979004749?e=1658584800&v=beta&t=d83WIcTp_gHjatpSqwU0jdTmv1KAM6wtPOhnWCvBimQ",
        name: "Cryptoverse",
        description: "Cryptoverse is an application where you can check all cryptos value in USD. On this application you can also read latest news related to a specific coin",
        url: "https://cryptoverse123.netlify.app/"
    },
    {
        image: "https://media-exp1.licdn.com/dms/image/D4D2CAQFewwSlkxOBLQ/comment-image-shrink_8192_1280/0/1657979320239?e=1658584800&v=beta&t=TNPZ8kJL4IvPjeRQi2ag0_Y6VqcSgztWdsOQxxxWAXg",
        name: "Utube",
        description: "This is a youtube clone web application using ReactJs.In this we are using axios to make an API call to get data from youtube API.",
        url: "https://utube123.netlify.app/"
    }]



    const renderPortfolio = (portfolio) => {
        return (
            <div className="images-container">
                {
                    portfolio.map((port, idx) => {
                        return (
                            <div className="image-box" key={idx}>
                                {/* <img
                                    src={port.image}
                                    className="portfolio-image"
                                    alt="portfolio" /> */}
                                    <iframe className="portfolio-image" src={port.url} title={port.description}></iframe>
                                <div className="content">
                                    <p className="title">{port.name}</p>
                                    <h4 className="description">{port.description}</h4>
                                    <button
                                        className="btn"
                                        onClick={() => window.open(port.url)}
                                    >View</button>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        );
    }


    return (
        <>
            <div className="container portfolio-page">
                <h1 className="page-title">
                    <AnimatedLetters
                        letterClass={letterClass}
                        strArray={"Projects".split("")}
                        idx={15}
                    />
                </h1>
                <div>{renderPortfolio(portfolio)}</div>
            </div>
            <Loader type="pacman" />
        </>
    );
}

export default Portfolio;