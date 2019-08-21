//SVG width and height, margin
const margin = {
  top: 10,
  right: 120,
  bottom: -10,
  left: 120
};

const fullSVGWidth =
  (window.innerWidth || document.documentElement.clientWidth) + 12000;
console.log("This is your window width: ", fullSVGWidth);
const fullSVGHeight =
  window.innerHeight || document.documentElement.clientHeight;
console.log("This is your window height: ", fullSVGHeight);

//SVG
const svg = d3
  .select(".curve")
  .append("svg")
  .attr("width", fullSVGWidth)
  .attr("height", fullSVGHeight)
  .attr("z-index", 3);

const color = d3.scaleSequential(d3.interpolateReds).domain([1, 2800000000]);

d3.json("data.json")

  .then(data => {
    //  console.log(data);
    var combined = [];
    for (let i = 0; i < data.length; i++) {
      combined.push(...data[i].results);
    }
    console.log("new combined data", combined);

    combined.sort(function(a, b) {
      return +a.revenue - +b.revenue;
    });

    /**************************************
    
            FILM AREA CHART STARTS
    
    **************************************/

    const color1 = d3
      .scaleSequential(d3.interpolateWarm)
      .domain([1, 2800000000]);

    /**************************************
     
             FILM AREA CHART STARTS
     
     **************************************/

    //  console.log(data);
    var combined1 = [];
    for (let i = 0; i < data.length; i++) {
      combined1.push(...data[i].results);
    }
    console.log("new combined data", combined1);

    combined.sort(function(a, b) {
      return +a.revenue - +b.revenue;
    });

    /**************************************
    
            FILM AREA CHART STARTS
    
    **************************************/

    //Calculate mean box / mean revenue
    const meanBox = d3.mean(combined1, d => d.revenue);
    console.log("box mean is: ", meanBox);

    //Movie object
    const startYear = new Date("January 1, 1950 00:00:00");
    console.log("start year is: ", startYear);

    const movies = combined1
      .map(d => {
        const date = new Date(d.release_date);
        const revenue = parseInt(d.revenue);
        return {
          title: d.title,
          date,
          revenue
        };
        // })
      })
      .filter(d => d.date >= startYear);

    console.log("movies:", movies);

    const [minDate, maxDate] = d3.extent(movies, d => d.date);

    //x-scale, time scale
    const xScale1 = d3
      .scaleTime()
      .domain([d3.timeYear.floor(minDate), d3.timeYear.floor(maxDate)])
      .range([margin.left, fullSVGWidth - margin.right]);

    console.log("domain " + xScale1.domain() + " range" + xScale1.range());

    //x-axis
    let xAxis = d3
      .axisBottom(xScale1)
      .tickSizeInner([0])
      .tickSizeOuter([0]);

    svg
      .append("g")
      .attr("class", "x_axis")
      .attr("transform", "translate(" + 0 + "," + (fullSVGHeight - 680) + ")")
      .call(xAxis);

    //y-scale, box office
    const boxExtent = d3.extent(combined1, d => d.revenue - meanBox);
    const yScale1 = d3
      .scaleLinear()
      .domain(boxExtent)
      .range([fullSVGHeight - margin.bottom, fullSVGHeight - margin.top - 800]);

    console.log(yScale1.domain(), yScale1.range());

    //highest revenue
    const highestRevenue = d3.max(movies, d => d.revenue);

    //Area generator
    const area = d3
      .area()
      .x(d => xScale1(d.date))
      .y0(d => yScale1(d.val))
      .y1(d => yScale1(0))
      .curve(d3.curveCatmullRom);

    //curves
    const curve = svg
      .selectAll("path.curve")
      .data(movies)
      .enter()
      .append("path")
      .classed("curve", true)
      .attr("d", d =>
        area([
          {
            date: d3.timeMonth.offset(d.date, -10),
            val: 0
          },
          {
            date: d.date,
            val: 0
          },
          {
            date: d3.timeMonth.offset(d.date, 10),
            val: 0
          }
        ])
      )

      .attr("fill", function(d) {
        if (d.revenue === highestRevenue) {
          return "pink";
        } else if (d.revenue <= 100000000) {
          return "black";
        } else {
          return "white";
        }
      })
      .attr("opacity", function(d) {
        if (d.revenue <= 1000000000) {
          return 0.1;
        } else {
          return 0.4;
        }
      });

    curve
      .transition()
      .duration(10000)
      .attr("d", d =>
        area([
          {
            date: d3.timeMonth.offset(d.date, -10),
            val: 0
          },
          {
            date: d.date,
            val: d.revenue - meanBox
          },
          {
            date: d3.timeMonth.offset(d.date, 10),
            val: 0
          }
        ])
      );

    //points
    const points = svg
      .selectAll("g")
      .data(movies)
      .enter()
      .append("circle")
      .attr("class", "points");

    points
      .attr("cx", function(d) {
        return xScale1(d.date);
      })
      .attr("cy", function(d) {
        return yScale1(d.revenue - meanBox);
      })
      .attr("r", 2.5)
      .attr("opacity", 0.4)
      .style("fill", "yellow");

    /**************************************
    
            FILM AREA CHART ENDS
    
    **************************************/

    /**************************************
    
    THIS IS FILM LIST ELEMETNS / TEXT BLOCK
    
    **************************************/

    //Sort data by title in alphabetic order
    function sortByTitle(a, b) {
      if (a.title < b.title) {
        return -1;
      }
      if (a.title > b.title) {
        return 1;
      }
      return 0;
    }

    const sorted = combined.sort(sortByTitle);

    let ul = d3.select(".full-list").append("ul");

    ul.selectAll("li")
      .data(sorted)
      .enter()
      .append("li")
      .attr("class", "titles")
      .text(function(d) {
        return d.title;
      })
      .attr("id", d => d.title.replace(/ |,|\./g, "_"));

    //alphabet array
    let alphabetArr = [
      "a",
      "b",
      "c",
      "d",
      "e",
      "f",
      "g",
      "h",
      "i",
      "j",
      "k",
      "l",
      "m",
      "n",
      "o",
      "p",
      "q",
      "r",
      "s",
      "t",
      "u",
      "v",
      "w",
      "x",
      "y",
      "z"
    ];

    let DOMElementsArr = [
      "8MM",
      "Avengers:_Infinity_War",
      "Butch_Cassidy_and_the_Sundance_Kid",
      "Curse_of_the_Golden_Flower",
      "Déjà_Vu",
      "Eyes_Wide_Shut",
      "Fury",
      "Gulliver's_Travels",
      "Hulk",
      "Italy_Italy",
      "Justin_Bieber:_Never_Say_Never",
      "Kung_Fu_Yoga",
      "Lucy",
      "Mystic_River",
      "Nutty_Professor_II:_The_Klumps",
      "Oz_the_Great_and_Powerful",
      "Puss_in_Boots",
      "Quantum_of_Solace",
      "S_W_A_T_",
      "Syriana",
      "Two_Weeks_Notice",
      "Urban_Legend",
      "Volver",
      "X-Men",
      "X2",
      "Youth"
    ];

    function insertAfter(el, referenceNode) {
      referenceNode.parentNode.insertBefore(el, referenceNode.nextSibling);
    }

    //function that loops through both arrays
    function injectAllAlphabetLetters() {
      // iterate until last element of minimum length array(to avoid problem in case array length are different)
      for (
        let i = 0;
        i < alphabetArr.length && i < DOMElementsArr.length;
        i++
      ) {
        //Create new element and set properties
        let newEl = document.createElement("li");
        newEl.className = "titles alphabet";
        newEl.innerHTML = alphabetArr[i][0];

        // get the element based on id
        let ref = document.getElementById(DOMElementsArr[i]);
        // call function to insert
        insertAfter(newEl, ref);
      }
    }
    injectAllAlphabetLetters();

    /*************************************
      
    END OF FILM LIST ELEMETNS / TEXT BLOCK
      
    **************************************/

    //Bar chart styling
    function strokeWidth(selection) {
      selection.attr("stroke", "grey").attr("stroke-width", "5px");
    }

    function noStroke(selection) {
      selection.attr("stroke", "none");
    }

    /*******************
  
    SEARCH BLOCK STARTS
  
    *******************/

    const searchValue = document.getElementById("input-value");

    document
      .querySelector("form#search-movie")
      .addEventListener("submit", function(e) {
        //prevent the normal submission of the form
        e.preventDefault();

        const movieIDs = document.querySelectorAll("li");

        for (let i = 0; i < movieIDs.length; i++) {
          if (searchValue.value === movieIDs[i].innerHTML) {
            console.log("found");
            movieIDs[i].innerHTML =
              "<span style ='background-color:white;padding: 5px 5px 5px 10px;'>" +
              movieIDs[i].innerHTML +
              " </span>";
            // document.getElementById(movieIDs[i]).classList.add('found');
          }
        }
      });

    /*****************
  
    SEARCH BLOCK ENDS
      
    *****************/
  })
  .catch(error => console.log(error));

/****************************
  
  ON SCROLL BLOCK STARTS
  
*****************************/

// When the user scrolls the page, execute myFunction
window.onscroll = function() {
  changeFindPosition();
};

// Get the header
let header = document.querySelector(".find");

// Get the offset position of the navbar
let sticky = header.offsetTop;

// Add the sticky class to the header when you reach its scroll position
// remove "sticky" when you leave the scroll position
function changeFindPosition() {
  if (window.pageYOffset - 600 > sticky) {
    header.classList.add("sticky");
  } else {
    header.classList.remove("sticky");
  }
}

/****************************
  
  ON SCROLL BLOCK ENDS
  
*****************************/
