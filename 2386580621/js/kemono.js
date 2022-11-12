let container               // set once and forget
let bgColor;                // background color
const ORIGWIDTH = 58;        // original dimensions of the image
const ORIGHEIGHT = 63;
var imgWidth = ORIGWIDTH * 5;        // dimensions of the image to calculate zoom size
var imgHeight = ORIGHEIGHT * 5;
var rows = 1, columns = 3; // how many rows/cols; range: 1..50 (y tho)
var horiz = -120, vert = 0;    // margin between images; range: -1000..1000
var altRow = true;          // should rows alternate? (to make it less same-y)
var altImg = true;
var initialised = false, drawing = false;     // just in case, to not break things

// detect when the user made changes
// unsure if these are set when initializing the wallpaper, hence the need for global vars
// it's dirtier but safer this way, besides, not like it creates a security risk or performance issues
window.wallpaperPropertyListener = {
    applyUserProperties: function(properties) {
        // set bg color
        if(properties.schemecolor)
        {
            var colorArray = properties.schemecolor.value.split(" ", 3);
            colorArray = colorArray.map(function(c){
                return Math.ceil(c * 255);
            });
            bgColor = "rgb(" + colorArray + ")";
            document.body.style.backgroundColor = bgColor;
            console.log(bgColor);
        }

        // calculate what should be the new image size in px
        if(properties.zoom)
        {
            imgHeight = ORIGHEIGHT * properties.zoom.value;
            imgWidth = ORIGWIDTH * properties.zoom.value;
        }

        // just get and set the values, let the function handle the thing
        if(properties.columns) columns = properties.columns.value;
        if(properties.rows) rows = properties.rows.value;
        if(properties.spacingvertical) vert = properties.spacingvertical.value;
        if(properties.spacinghorizontal) horiz = properties.spacinghorizontal.value;
        if(properties.alternaterows) altRow = properties.alternaterows.value;
        if(properties.alternateimg) altImg = properties.alternateimg.value;

        // redraw if settings changed && we can draw
        if(initialised && !drawing)
            redrawKemonochan();
    }
};

window.onload = function () {
    init();
    initialised = true;
}

function init()
{
    container = document.getElementById("container");
    container.style.width = window.innerWidth + "px";
    container.style.height = window.innerHeight + "px";
    document.body.style.backgroundColor = "rgb(250, 242, 220)";
    redrawKemonochan();
}

function redrawKemonochan()
{
    drawing = true;
    let row;
    let cell;
    let image;
    var index = 0;  // z-index to overlap properly
    var table = document.createElement("div"); // divs because centering things in css is hell ¯\_(ツ)_/¯
    var odd = false;
    var cols;
    table.setAttribute("id", "imgTable");

    // delete previous table
    var previous = document.getElementById("imgTable");
    if(previous) previous.remove();

    // create rows, cells and add images onto them
    for(var i = 0; i < rows; i++)
    {
        // create rows and assign proper class
        row = document.createElement("div");

        if(odd && altRow)
        {
            cols = columns - 1;
            row.setAttribute("class", "tableRowOdd")
        }
        else
        {
            row.setAttribute("class", "tableRow");
            cols = columns;
        }

        var cols = odd && altRow ? columns - 1 : columns; // number of cols to draw
        for(var j = 0; j < cols; j++)
        {
            image = document.createElement("img");
            odd && altImg ? image.setAttribute("src", "img/chanReverse.gif") : image.setAttribute("src", "img/chan.gif");
            image.style.zIndex = index++;
            cell = document.createElement("div");
            cell.setAttribute("class", "tableCell");

            // set the sizes -- sucks that can't be done in css without it being cumbersome
            cell.style.width = (imgWidth + horiz) <= 0 ? "1px" : (imgWidth + horiz) + "px";
            cell.style.height = (imgHeight + vert) <= 0 ? "1px" : (imgHeight + vert) + "px";
            image.style.width = imgWidth + "px";
            image.style.height = imgHeight + "px";

            // append the stuff
            cell.appendChild(image);
            row.appendChild(cell);
        }
        table.appendChild(row);
        if(altRow || altImg) odd = !odd;   // flip odd-ness
    }
    container.appendChild(table); // append table to main div (so it's centered)
    drawing = false;
}