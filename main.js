//Web-scraping data
const mainURL = 'https://api.themoviedb.org/3/discover/movie?api_key=2339027b84839948cd9be5de8b2b36da&language=en-US&sort_by=revenue.desc&include_adult=false&include_video=false&page=1';
const movieBaseURL = 'https://api.themoviedb.org/3/movie/335?api_key=2339027b84839948cd9be5de8b2b36da&language=en-US';
let getRevenueURL = '';
let ID_Array = [];
let revenue;
let text = '';
let data;
let response;

(async() =>{

try {
    response = await fetch(mainURL);
    data = await response.json();
    
    console.log(data);
    console.log(data.results[0].title);
    
    ID_Array = [].concat.apply([], data.results.map(d => d.id))
    console.log(ID_Array);
    

    getRevenueByID(ID_Array);
} catch (error) {
    console.log(error);
}
})();

getRevenueByID = async (arr) => {
    for (let i = 0; i < arr.length; i++){
        console.log('ID is: ', arr[i]);
        getRevenueURL = await fetch('https://api.themoviedb.org/3/movie/' + arr[i] + '?api_key=2339027b84839948cd9be5de8b2b36da&language=en-US');
        console.log(getRevenueURL);
        let data = await getRevenueURL.json();
        console.log('data received: ',data);
        console.log('Revenue for the movie with ID: ' + arr[i] + ' is: ' + data.revenue);
    
    }
};

