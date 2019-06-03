var request = require('request');
var secret = require('./secrets')

const getRepoContributors = (repoOwner, repoName, cb) => {
    var option = {
        url:`https://api.github.com/repos/${repoOwner}/${repoName}/contributors`,
        headers: {
            'User-Agent': 'request',
            'Authorization': secret.GITHUB_TOKEN
        }
    }
    
    request(option.url,function(error,response,body){
        cb (error,body);
    })

}

console.log('Welcome to the Github Avatar Downloader!')

getRepoContributors("jquery", "jquery", function(err, result) {
    console.log("Errors:", err);
    console.log("Result:", result);
});

//aa95121d2d04f34e5303f8a7eed27df3c4298728