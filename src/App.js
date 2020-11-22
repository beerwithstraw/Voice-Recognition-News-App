import React, { useState, useEffect } from 'react';

import NewsCards from './components/NewsCards/NewsCards';

import alanBtn from '@alan-ai/alan-sdk-web';
const alanKey = '9ec459bed89444fe2529ec941682e2892e956eca572e1d8b807a3e2338fdd0dc/stage';


const App = () => {
    const [newsArticles, setNewsArticles] = useState([]);

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
        <h1>Alan AI News Application</h1>
        <NewsCards articles = {newsArticles} />
        </div>
    )
}

export default App;