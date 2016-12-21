var resultarray = [];

//List all the ToDoLists belonging to a given user. The identifier of the user should be specified as
//a condition in the WHERE clause of the query.
var exercise_1 = function(name){
	item = {};
	item.name = name;
	$.ajax({
            url: '/exercise_1',
            type: 'post',
            dataType: 'json',
            success: function (data) {
                document.getElementById('form_1').value = "";

                resultarray = [];
                convertToHTML(data);
                showresult();
            },
            data: item
        });
}

var exercise_4b = function(priority) {
	item = {};
	item.priority = priority;
	$.ajax({
            url: '/exercise_4b',
            type: 'post',
            dataType: 'json',
            success: function (data) {
            	console.log(data);
                document.getElementById('form_1').value = "";

                resultarray = [];
                convertToHTML(data);
                showresult();
            },
            data: item
    });
}

var exercise_4c = function(completion) {
	item = {};
	item.completion = completion;
	$.ajax({
            url: '/exercise_4c',
            type: 'post',
            dataType: 'json',
            success: function (data) {
            	console.log(data);
                document.getElementById('form_1').value = "";

                resultarray = [];
                convertToHTML(data);
                showresult();
            },
            data: item
    });
}

//For a given tag, show all the ToDoLists that contain ToDoItems which are tagged with that tag
var exercise_7 = function(tag){
	item = {};
	item.tag = tag;
	$.ajax({
            url: '/exercise_7',
            type: 'post',
            dataType: 'json',
            success: function (data) {
            	console.log(data);
                document.getElementById('form_1').value = "";

                resultarray = [];
                convertToHTML(data);
                showresult();
            },
            data: item
        });

}

//For each tag, calculate the number of currently pending and completed to-dos.
var exercise_8 = function(tag){
	item = {};
	item.tag = tag;

	$.ajax({
            url: '/exercise_8',
            type: 'post',
            dataType: 'json',
            success: function (data) {
                document.getElementById('form_1').value = "";

                resultarray = [];
                convertToHTML(data);
                showresult();
            },
            data: item
        });
}

var convertToHTML = function(result){
	"use strict";

	result.forEach(function(item){
		var newitem = ItemToHTML(item);
			resultarray.push(newitem);
	});
}

var ItemToHTML = function(item) {
	var paragraph = document.createElement("li");
	var p_string = "";

	for (var key in item) {
  		if (item.hasOwnProperty(key)) {
    		p_string += key + " : " + item[key] + ". ";
    		
  		}
	}
	
	return paragraph.appendChild(document.createTextNode(p_string));
}

//$(document).ajaxStop(function() {
//  showresult();
//});

var showresult = function(){
	div = document.getElementById("div_results");
	removechildren(div);

	resultarray.forEach(function(item){
		div.appendChild(item);
	})
}

//Removes children of node
function removechildren(node){
	while(node.firstChild) {
		node.removeChild(node.firstChild);
	}
}

