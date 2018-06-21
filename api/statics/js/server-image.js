/*jshint esversion:6*/

var a = new Annotator("#annotator", "#labels");
a.labelsClasses = ["badge", "badge-pill"];
function send() {
    var h = new XMLHttpRequest();
    h.open("POST", "http://localhost:8000/send");
    h.onreadystatechange = function(){
        if (this.readyState == XMLHttpRequest.DONE) {
            a.reset();
            next();
        }
    };
    h.send(a.toJson());

}

function reset() {
    warn({
        title   : "Remove all annotations ?",
        body    : "Do you really want to remove the whole annotations ?",
        action  : "reallyreset()",
        okbutton: "Ok",
    });
}

function reallyreset() {
    a.reset();
    $('#alert [data-action]').attr('onclick', '');
    $('#alert').modal('hide');
}

function next() {
    console.log("next !!");
    var h = new XMLHttpRequest();
    h.open("GET", "http://localhost:8000/next");
    h.onreadystatechange = function(evt){
        if (this.readyState == XMLHttpRequest.DONE) {
            switch(this.status) {
                case 200:
                    a.loadImage(this.responseText);
                    break;
                case 204:
                    warn({title: "Good job !", body: "It seems that there is no more image to work on."});
                    break;
                case 404:
                    warn({title: "Image not found", body: "The image was not found on the server"});
                    break;
                default:
                    warn({title: "Damned", body: "Something goes wrong"});
            }
        }
    };
    h.send();
}


function warn(opt){
    $('#alert [data-action]').attr('onclick', '');
    $('#alert .modal-title').text(opt.title);
    $('#alert .modal-body').text(opt.body);
    if (!opt.action) {
        $('#alert .modal-footer').hide();
    } else {
        $('#alert [data-action]').attr('onclick', opt.action);
    }
    if (opt.okbutton) {
        $('#alert [data-action]').text('ok').show();
    } else {
        $('#alert [data-action]').hide();
    }
    $('#alert').modal();
}

function pageAdapter() {
    var h = new XMLHttpRequest();
    h.open('GET', 'http://localhost:8000/adaptation');
    h.onreadystatechange = function(){
        if (this.readyState == XMLHttpRequest.DONE) {
            switch(this.status) {
                case 200:
                    var response = JSON.parse(this.responseText);
                    var template = document.createElement('template');
                    template.innerHTML = response.content;
                    var content = template.content;
                    console.log(content);

                    var element = document.querySelector(response.selector);
                    element.appendChild(content);
                    break;
                case 204:
                    break;

                default:
                    warn({
                        title: "Something goes wrong !",
                        body: "There were an error calling the page adapter"
                    });
            }
        }
    };
    h.send();
}


document.addEventListener('DOMContentLoaded', () => {
    pageAdapter();
    next();
});
