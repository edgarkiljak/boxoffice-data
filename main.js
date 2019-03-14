//Global variables (and const) declaration
const mainURL =
  "https://api.themoviedb.org/3/discover/movie?api_key=2339027b84839948cd9be5de8b2b36da&language=en-US&sort_by=revenue.desc&include_adult=false&include_video=false&page=";
const movieBaseURL =
  "https://api.themoviedb.org/3/movie/335?api_key=2339027b84839948cd9be5de8b2b36da&language=en-US";
const apiKey = "2339027b84839948cd9be5de8b2b36da";
let getRevenueByID,revenue, data, response, obj;
let Each_ID_Array = [],
  All_ID_Array = [],
  All_ID_Array_merged = [],
  pages_Array = [1, 2],
  keyValueArr = [],
  allKeyValueArr = [],
  objectArr = [];
  responses = [];
  newData = [];
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
    await pause(500);
  }

  console.log('responses', responses);

  return responses;
};

//Function to get revenue by ID
getRevenueByID = async (arr) => {
    let resObj = {}; // Is an complete result
    for (let i = 0; i < arr.length; i++) {
      console.log("ID is: ", arr[i]);
  
      getRevenueURL = await fetch(
        "https://api.themoviedb.org/3/movie/" +
          arr[i] +
          "?api_key=" +
          apiKey +
          "&language=en-US"
      );
      let data = await getRevenueURL.json();
      console.log("data received: ", data);
      await pause(200);
  
      //return key/value array
      keyValueArr = Object.entries(data)[16];
      console.table(keyValueArr);
  
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

(getFinalObject = async () => {
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

      console.log('data', data);

      newData = data.map(item => 
        Object.assign({}, item)
        );
        
      console.log('data for visualisation is:',newData);
    }).catch(error => console.log(error));


})();


// //SVG width and height, margin
// const margin = {
//     top: 10,
//     right: 20,
//     bottom: -10,
//     left: 20
//   };
  
//   const fullSVGWidth = 700 + margin.right + margin.left;
//   const fullSVGHeight = 500 + margin.top + margin.bottom;
  
//   //SVG
//   const svg = d3
//     .select("body")
//     .append("svg")
//     .attr("width", fullSVGWidth)
//     .attr("height", fullSVGHeight);
  
//   //x and y range
//   let xScale = d3
//     .scaleBand()
//     .range([0, fullSVGWidth - margin.right - margin.left])
//     .paddingInner(0.01);
  
//   let yScale = d3
//     .scaleBand()
//     .range([fullSVGHeight - margin.top - margin.bottom, 0]);
  

// console.table(data.results.map(d => d.original_title));
// console.table(data.results.map(d => d.title));

//x and y domain
// xScale.domain(data.results.map(d => d.title));
// yScale.domain(data.results.map(d => d.original_title));

// svg.selectAll('rect')
//     .data(data.results)
//     .enter()
//     .append('rect')
//     .style('fill', 'red')
//     .attr('width', xScale.bandwidth())
//     .attr('height', 70)
//     .attr('x', function (d) {
//         return xScale(d.title);
//     })
//     .attr('y', function (d) {
//         return yScale.bandwidth() + 175;
//     });

// } catch (error) {
//     console.log(error);
// }

//Retrieve revenue key/value pairs by movie ID's
