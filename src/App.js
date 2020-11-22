import React, { useState, useEffect } from 'react';

import NewsCards from './components/NewsCards/NewsCards';
import alanBtn from '@alan-ai/alan-sdk-web';
import useStyles from './styles.js'

const alanKey = '9ec459bed89444fe2529ec941682e2892e956eca572e1d8b807a3e2338fdd0dc/stage';


const App = () => {
    const [newsArticles, setNewsArticles] = useState([]);
    const classes = useStyles(); 

    useEffect(() => {
        alanBtn({
            key: alanKey,
            onCommand:({ command, articles}) => {
                if (command === 'newHeadlines') {
                    setNewsArticles(articles);
                    console.log(articles);
                }
            }
        })
    },[])

    return(
        <div>
            <div className={classes.logoContainer}>
                <img src="https://alan.app/voice/images/previews/preview.jpg" className={classes.alanLogo} alt="Alan Logo"/>

            </div>
        <NewsCards articles = {newsArticles} />
        </div>
    )
}

export default App;