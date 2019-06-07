//Global variables (and const) declaration
const mainURL =
  "https://api.themoviedb.org/3/discover/movie?api_key=2339027b84839948cd9be5de8b2b36da&language=en-US&sort_by=revenue.desc&include_adult=false&include_video=false&page=";
const movieBaseURL =
  "https://api.themoviedb.org/3/movie/335?api_key=2339027b84839948cd9be5de8b2b36da&language=en-US";
const apiKey = "2339027b84839948cd9be5de8b2b36da";
const data = {};
let getRevenueByID,revenue, response, obj;
let Each_ID_Array = [],
  All_ID_Array = [],
  All_ID_Array_merged = [],
  pages_Array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 
    26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 
    51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 
    76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100],
  keyValueArr = [],
  allKeyValueArr = [],
  objectArr = [];
  responses = [];
let text = "";

//fetch function 
let getSearchResultsForOnePage = url => {
  //fetch
  return fetch(url);
};

//Function to cool down requests
let pause = time => {
  // handy pause function to await
  return new Promise(resolve => setTimeout(resolve, time));
};

//Get main object for d3 visualisation
getAllSearchResultProfiles = async searchURL => {
  let URLs = [];
  for (let i = 0; i < pages_Array.length; i++) {
    URLs.push(searchURL + pages_Array[i]);
  }
  console.log(URLs);
  for (let url of URLs) {
    console.log("sending request");
    response = await getSearchResultsForOnePage(url);
    console.log("received", response);
    responses.push(await response.json());
    await pause(100);
  }

  console.log('responses', responses);

  return responses;
};

//Function to get revenue by ID
getRevenueByID = async (arr) => {
    let resObj = {}; // Is an complete result
    for (let i = 0; i < arr.length; i++) {
      console.log("ID is: ", arr[i]);
      console.count('Current');
      getRevenueURL = await fetch(
        "https://api.themoviedb.org/3/movie/" +
          arr[i] +
          "?api_key=" +
          apiKey +
          "&language=en-US"
      );
      let data = await getRevenueURL.json();
      console.log("data received: ", data);
      await pause(100);

      //return key/value array
      keyValueArr = Object.entries(data)[16];


      allKeyValueArr.push(keyValueArr);

      //convert key/value array to object
      obj = Object.assign(
        ...allKeyValueArr.map(d => ({
          [d[0]]: d[1]
        }))
      );

      console.log("object is: ", obj);
      resObj[arr[i]] = obj;
      console.log("resObj: ", resObj[arr[i]]);
    }
    console.log("OUTPUT - getRevenueByID: ", resObj);
    return resObj;
  };

(getFinalObject = () => {
  getAllSearchResultProfiles(mainURL).then(async (data) => {
      //get movie ID's
      for (let i = 0; i < data.length; i++) {
        Each_ID_Array = data[i].results.map(d => d.id);
        All_ID_Array.push(Each_ID_Array);
        console.table('All ID Array', All_ID_Array);
        All_ID_Array_merged = [].concat.apply([], All_ID_Array);
        console.table('All ID Array merged',All_ID_Array_merged);    

        console.log('data[i].results: ',data[i].results);

        obj = await getRevenueByID(All_ID_Array_merged);
        console.log('obj is', obj);

         //inject revenue key/value
         Object.keys(data[i].results).forEach(key => {
          console.log("The name of the current key: ", key);
          console.log("The value of the current key: ", data[i].results[key]);
          data[i].results[key]["revenue"] = obj[data[i].results[key].id]["revenue"];
          console.log('data[i].results[key]["revenue"]: ',  data[i].results[key]["revenue"]);         
        });


      }

      console.log('data for visualisation is:',data);
    }).catch(error => console.log(error));


})();

