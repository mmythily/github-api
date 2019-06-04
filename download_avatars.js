const request = require('request');
const secret = require('./secrets');
const fs = require('fs');

const repoOwner = process.argv[2];
const repoName = process.argv[3];

if (!repoOwner || !repoName) {
    console.log("Please use the gitbhub username and the repo name");
    process.exit();
}

console.log('Welcome to the Github Avatar Downloader!')

const getRepoContributors = (repoOwner, repoName, cb) => {
    var option = {
        url:`https://api.github.com/repos/${repoOwner}/${repoName}/contributors`,
        headers: {
            'User-Agent': 'request',
            'Authorization': 'Token ' + secret.GITHUB_TOKEN
        }
    }

    request(option, (error, response, body) => {
        if (response.statusCode === 200) {
            const data = JSON.parse(body);
            let avatarURLs = data.map( contributor => {
                var contributorURL = {};
                contributorURL[contributor.login] = contributor.avatar_url;
                return contributorURL;
            })
            cb (error, avatarURLs);
        }
    });
}

const downloadImageByURL = (url, filePath) => {
    request.get (url)
            .on('error', err => {
                throw err;
            })
            .on('response', response => {
                console.log(`Response Status Code: ${response.statusCode}`);
                console.log(`Response Status Message: ${response.statusMessage}`);
                console.log(`Response Headers: ${response.headers['content-type']}`)
            })
            .pipe(fs.createWriteStream(filePath))
}

const saveAvatarImages = (err, body) => {
    console.log("Errors:", err);
    body.forEach( contributor => {

        let key = Object.keys(contributor);
        const folderPath = `./avatar-images/${key[0]}.png`;

        downloadImageByURL(contributor[key[0]], folderPath);
    });
}

getRepoContributors(repoOwner, repoName , saveAvatarImages);


