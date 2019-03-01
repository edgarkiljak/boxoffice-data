//Web-scraping data
const mainURL = 'https://api.themoviedb.org/3/discover/movie?api_key=2339027b84839948cd9be5de8b2b36da&language=en-US&sort_by=revenue.desc&include_adult=false&include_video=false&page=1';
const movieBaseURL = 'https://api.themoviedb.org/3/movie/335?api_key=2339027b84839948cd9be5de8b2b36da&language=en-US';
const apiKey = '2339027b84839948cd9be5de8b2b36da';
let revenue, data, response, obj;
let ID_Array = [], keyValueArr = [], allKeyValueArr = [], objectArr = [];
let text = '';


//Get main object for d3 visualisation 
(getMovieList = async() => {

try {
    response = await fetch(mainURL);
    data = await response.json();

    console.log(data);
    console.log(data.results[0].title);

    //get movie ID's
    ID_Array = [].concat.apply([], data.results.map(d => d.id))
    console.log('ID: ', ID_Array);

    obj = await getRevenueByID(ID_Array);
    console.trace(getRevenueByID);
    console.table(allKeyValueArr);

    //inject revenue key/value 
   Object.keys(data.results).forEach(key => {
    console.log('The name of the current key: ', key);          
    console.log('The value of the current key: ', data.results[key]);
    console.info('OBJECT VALUE FOR REVENUE: ', obj, ID_Array, data.results[key].id, key);
    data.results[key]['revenue'] = obj[data.results[key].id]['revenue'];
});

console.log('Data ready for visualisation: ',data);
} catch (error) {
    console.log(error);
}
})();

//Retrieve revenue key/value pairs by movie ID's
getRevenueByID = async (arr) => {
  let resObj = {}; // Is an complete result
    for (let i = 0; i < arr.length; i++){
        console.count('Count');
        console.log('ID is: ', arr[i]);

        getRevenueURL = await fetch(
            'https://api.themoviedb.org/3/movie/' +
            arr[i] + 
            '?api_key=' +
            apiKey + 
            '&language=en-US');
        let data = await getRevenueURL.json();
        console.log('data received: ',data);

        //return key/value array
        keyValueArr = Object.entries(data)[16];
        console.table(keyValueArr);    

        allKeyValueArr.push(keyValueArr);

        //convert key/value array to object
        obj = Object.assign(...allKeyValueArr.map(d => ({[d[0]]: d[1]})));
        console.log('object is: ',obj);
        resObj[arr[i]] = obj;
        console.log('resObj: ',resObj[arr[i]]);
    }
    console.log('OUTPUT - getRevenueByID: ', resObj);
    return resObj;
};