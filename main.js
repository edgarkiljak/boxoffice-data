//SVG width and height, margin
const margin = {
  top: 10,
  right: 20,
  bottom: -10,
  left: 20
};

const fullSVGWidth = 700 + margin.right + margin.left;
const fullSVGHeight = 500 + margin.top + margin.bottom;

//SVG
const svg = d3
  .select(".visual")
  .append("svg")
  .attr("class", "bar-chart")
  .attr("width", fullSVGWidth)
  .attr("height", fullSVGHeight);

//x and y range
const xScale = d3
  .scaleBand()
  .range([0, fullSVGWidth - margin.right - margin.left]);

const yScale = d3
  .scaleBand()
  .range([fullSVGHeight - margin.top - margin.bottom, 0]);

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

    const color = d3
      .scaleSequential(d3.interpolateReds)
      .domain([1, 2800000000]);

    console.log("sorted combined data", combined);
    //x and y domain
    xScale.domain(combined.map(d => d.revenue));
    yScale.domain(combined.map(d => d.original_title));

    let rect = svg
      .selectAll("g")
      .data(combined)
      .enter()
      .append("g")
      .on("mouseover", function() {
        d3.select(this)
          .append("text")
          .attr("class", "text")
          .attr("x", function(d) {
            return xScale(d.revenue);
          })
          .attr("y", function(d) {
            return yScale.bandwidth() + 175;
          })
          .style("font-size", 10)
          .attr("dy", -20)
          .attr("dx", function(d, i) {
            if (d.title.length > 5 && d3.select(this).attr("x") > 400) {
              return -100;
            }
            if (d.title.length > 10 && d3.select(this).attr("x") > 400) {
              return -1200;
            } else {
              return 10;
            }
          })
          .text(d => d.title);
      })
      .on("mouseout", function() {
        d3.select(".text").remove();
      });

    let bars = rect
      .append("rect")
      .attr("class", "film-elem")
      .attr("width", 10000 / 10)
      .attr("height", 0)
      .attr("x", d => 500000)
      .attr("y", function(d) {
        return yScale.bandwidth() + 175;
      })

      .on("mouseover", function() {
        d3.select(this).call(strokeWidth);
      })
      .on("mouseout", function() {
        d3.select(this).call(noStroke);
      });

    bars
      .transition()
      .duration(1000)
      .delay(function(d, i) {
        return i * 5;
      })
      .attr("fill", function(d) {
        return color(+d.revenue);
      })
      .attr("width", xScale.bandwidth())
      .attr("height", 80)
      .attr("x", d => xScale(d.revenue))
      .attr("y", function(d) {
        return yScale.bandwidth() + 175;
      });

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

    document.querySelector("form#search-movie").addEventListener("submit", function(e) {
        //prevent the normal submission of the form
        e.preventDefault();
        
        
        const movieIDs = document.querySelectorAll('li');

        for (let i = 0; i < movieIDs.length; i++){
          if (searchValue.value === movieIDs[i].innerHTML) {
            console.log('found');
            movieIDs[i].innerHTML = "<span style ='background-color:white;padding: 5px 5px 5px 10px;'>" + movieIDs[i].innerHTML+" </span>"
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
