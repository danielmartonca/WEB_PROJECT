const paragraph = document.getElementsByClassName("edit");
const edit_button = document.getElementById("button-edit");
const end_button = document.getElementById("button-save");

edit_button.addEventListener("click", function() {
    for (var i=0; i < paragraph.length; i++) {
        paragraph[i].contentEditable = true;
        paragraph[i].style.backgroundColor = "#2b2d2f";
        paragraph[i].style.padding = "5px";
    }
} );

end_button.addEventListener("click", function() {
    for (var i=0; i < paragraph.length; i++) {
        paragraph[i].contentEditable = false;
        paragraph[i].style.backgroundColor = "#757575";
        paragraph[i].style.padding = "0px";
    }
} )