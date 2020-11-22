const API_KEY = '6bb236672e18465fb8e28a4880ce1559';
let savedArticles = [];

intent('What does this app do?', 'What can I do here?', 
       reply('This is a project on Artificial Intelligence News Reader by Pulkit Agarwal.'));


// News by Source
intent('Show me some news from $(source* (.*))', (p) => {
    let NEWS_API_URL = `https://newsapi.org/v2/top-headlines?apiKey=${API_KEY}`;
    
    if(p.source.value){
        NEWS_API_URL = `${NEWS_API_URL}&sources=${p.source.value.toLowerCase().split(" ").join('-')}`;
    }
    
    api.request(NEWS_API_URL, (error, response, body) => {
        const { articles} = JSON.parse(body);
    
        if(!articles.length){
            p.play('Sorry, no news is available from this source. Please try searching from a different source');
            return;
        }
        
        savedArticles = articles;
        
        p.play({ command: 'newHeadlines', articles});
        p.play(`Here is some (latest|recent) news from ${p.source.value}`);
        
        p.play('Would you like me to read the headlines?');
        p.then(confirmation);
    });
});

// News by Term
intent('What\'s up with $(term* (.*))', (p) => {
    let NEWS_API_URL = `https://newsapi.org/v2/everything?apiKey=${API_KEY}`;
    
    if(p.term.value){
        NEWS_API_URL = `${NEWS_API_URL}&q=${p.term.value}`;
    }
    
    api.request(NEWS_API_URL, (error, response, body) => {
        const { articles} = JSON.parse(body);
    
        if(!articles.length){
            p.play('Sorry, no article is available right now. Please try searching for a different article.');
            return;
        }
        
        savedArticles = articles;
        
        p.play({ command: 'newHeadlines', articles});
        p.play(`Here are some (latest|recent) articles on ${p.term.value}`);
        
        p.play('Would you like me to read the headlines?');
        p.then(confirmation);
    });
});

// News by Categories
const CATEGORIES = ['business', 'entertainment', 'general', 'health', 'science', 'sports', 'technology']
const CATEGORIES_INTENT = `${CATEGORIES.map((category) => `${category}~${category}`).join('|')}|`;

intent(`(show|what is|tell me|what|what's are|what're|read) (the|) (recent|latest|) $(N news|headlines) (in|about) $(C~ ${CATEGORIES_INTENT})`,
       `(read|show|get|bring me|give me) (the|) (recent|latest) $(C~ ${CATEGORIES_INTENT}) $(N news|headlines)`, (p) => {
    let NEWS_API_URL = `https://newsapi.org/v2/top-headlines?apiKey=${API_KEY}&country=us`;
    
    if(p.C.value){
        NEWS_API_URL = `${NEWS_API_URL}&category=${p.C.value}`;
    }
    
    api.request(NEWS_API_URL, (error, response, body) => {
        const { articles} = JSON.parse(body);
    
        if(!articles.length){
            p.play('Sorry, no article is available right now. Please try searching a different category.') 
        }
        
        savedArticles = articles;
        
        p.play({ command: 'newHeadlines', articles});
        if(p.C.value){
            p.play(`Here are some (latest|recent) articles on ${p.C.value}`)
        }else{
            p.play(`Here are some (latest|recent) articles.`)
        }
 
        p.play('Would you like me to read the headlines?');
        p.then(confirmation);
    });
});

const confirmation = context(() => {
    intent('yes', async (p) =>{
        for( let i =0; i<savedArticles.length; i++){
            p.play({command: 'highlight', article: savedArticles[i]});
            p.play(`${savedArticles[i].title}`);
        }
    });
    intent('no', (p) =>{
        p.play('Sure, Happy Reading!')
        
    });
});


intent('Open (article|) (number|) $(number* (.*))', (p) => {
    if(p.number.value){
        p.play({command: 'open', number: p.number.value, articles: savedArticles})
    }

});

intent('Go Back', (p) => {
    p.play('Sure');
    p.play({command: 'newHeadlines', articles: []});
});

