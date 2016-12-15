//Global variable
var globaltasknumber = 0;
var listactivetasks = [];
var listcompletedtasks = [];



//Constructor to create class
//function task(task_name, task_tag, task_priority, task_due, task_reminder, task_note) {
//	this.tasknumber = globaltasknumber + 1;
//	this.taskname = textboxhastext(task_name)?task_name:null;
//	this.tasktag = textboxhastext(task_tag)?task_tag:null;
//	this.taskpriority = textboxhastext(task_priority)?task_priority:null;
//	this.taskdue = textboxhastext(task_due)?task_due:null;
//	this.reminder = textboxhastext(task_reminder)?task_reminder:null;
//	this.note = textboxhastext(task_note)?task_note:null;
//	this.taskactive = true;
//
//	globaltasknumber += 1;
//}

//Functions for page
//Function create a task
function createtask(taskname, tasktag, taskpriority, duedate, reminder, note){
	//Check if task has a taskname
	if(textboxhastext(taskname)){
		//Create task
		var newtask = basictask(taskname, tasktag, taskpriority, duedate, reminder, note);
		//Convert to JSON
		var taskJSON = createJSON(newtask);

		//Post task
		$.ajax({
            url: '/addtodo',
            type: 'post',
            dataType: 'json',
            success: function (data) {
                console.log(data);
                LoadTasks("todos.json");
            },
            data: taskJSON
        });

		//Remove text from textboxes
		document.getElementById("f_task").value = "";
		document.getElementById("f_tag").value = "";
		document.getElementById("f_priority").value = "";
		document.getElementById("f_duedate").value = "";
		document.getElementById("f_reminder").value = "";	
		document.getElementById("f_note").value = "";		
	}

}

//Function creates new task in HTML
var newtaskHTML = function(taskname, tasktag, taskpriority, duedate, reminder, note) {
	//Create the task itself
	var newtask = basictask(taskname, tasktag, taskpriority, duedate, reminder, note);

	//Add classes for CSS
	newtask = addClassHTML(newtask);

	//Create active button
	var cb_active = active_checkbox(newtask);
	newtask.appendChild(cb_active);				//Assign 

	//Create text in paragraph
	newtask.appendChild(document.createTextNode(newtask.dataset.taskname));	//Set task name in text
		
	//Create edit button
	var btn_edit = button_edit(newtask);
	newtask.appendChild(btn_edit);							//Add the edit button

	//Create remove button
	var btn_remove = button_remove(newtask);
	newtask.appendChild(btn_remove);							//Add the remove button

	return newtask;
}

//Checks if textbox is empty or only contains spaces
function textboxhastext(id){
	try{
		return !(id.length === 0 || !id.trim());
	} catch (err){
		return false;
	}
	
}

//Function to create task
var basictask = function(task_name, task_tag, task_priority, task_due, task_reminder, task_note) {
	var paragraph = document.createElement("p");	//Create paragraph
	paragraph.id = "paragraph" + globaltasknumber;						//Set id

	//Add data
	paragraph.dataset.id = globaltasknumber;
	paragraph.dataset.taskname = textboxhastext(task_name)?task_name:null;
	paragraph.dataset.tasktag = textboxhastext(task_tag)?task_tag:null;
	paragraph.dataset.taskpriority = textboxhastext(task_priority)?task_priority:null;
	paragraph.dataset.taskdue = textboxhastext(task_due)?task_due:null;
	paragraph.dataset.reminder = textboxhastext(task_reminder)?task_reminder:null;
	paragraph.dataset.note = textboxhastext(task_note)?task_note:null;
	paragraph.dataset.taskactive = true;

	globaltasknumber++;

	return paragraph;
}

//Create active/completed checkbox
var active_checkbox = function(newtask) {
	var cb_active = document.createElement("input");		//Create input		
	cb_active.type = "checkbox";							//Set type

	//Assign function to set task inactive or active
	cb_active.onclick = function () {
		//Check for checked or unchecked
		if(cb_active.checked == true) {
			newtask.dataset.taskactive = false;

			for(var i = 0; i < listactivetasks.length; i++) {
				if(listactivetasks[i].dataset.id == newtask.dataset.id) {
					listactivetasks.splice(i,1);
					listcompletedtasks.push(newtask);
					break;
				}
			}
		} else {
			newtask.dataset.taskactive = false;
			for(var i = 0; i < listcompletedtasks.length; i++) {
				if(listcompletedtasks[i].dataset.id == newtask.dataset.id) {
					listcompletedtasks.splice(i,1);
					listactivetasks.push(newtask);
					break;
				}
			}
		}
		settasks();

	}
	return cb_active;
}

//Set all tasks in the page
function settasks() {
	var nodeactivetasks = document.getElementById("main_middle_activetasks");
	var nodecompletedtasks = document.getElementById("main_middle_completedtasks");
	removechildren(nodeactivetasks);
	removechildren(nodecompletedtasks);

	listactivetasks.forEach(function(element) {
		nodeactivetasks.appendChild(element);	
	})

	listcompletedtasks.forEach(function(element) {
		nodecompletedtasks.appendChild(element);
	})


}

//Removes children of node
function removechildren(node){
	while(node.firstChild) {
		node.removeChild(node.firstChild);
	}
}

//Create edit button
var button_edit = function(newtask){
	var btn_edit = document.createElement("button");			//Create button
	btn_edit.appendChild(document.createTextNode("Edit")); 		//Assig text to button

	btn_edit.onclick = function(){ 								//Create function edit
		newtask.innerHTML = "";
		//Create input field
		edit_field =document.createElement("form");

		//Create taskname field
		var text_taskname = document.createTextNode("Taskname:");
		var field_taskname = document.createElement("input");
		field_taskname.type = "text";
		field_taskname.id = "field_taskname" + newtask.dataset.id;
		field_taskname.value = newtask.dataset.taskname;
		edit_field.appendChild(text_taskname);
		edit_field.appendChild(field_taskname);

		//Create tag field
		var text_tag = document.createTextNode("Tag:");
		var field_tag = document.createElement("input");
		field_tag.type = "text";
		field_tag.id = "field_tag" + newtask.dataset.id;
		field_tag.value = newtask.dataset.tasktag;
		edit_field.appendChild(text_tag);
		edit_field.appendChild(field_tag);

		//Create priority field
		var text_priority = document.createTextNode("Priority:");
		var field_priority = document.createElement("input");
		field_priority.type = "number";
		field_priority.id = "field_priority" + newtask.dataset.id;
		field_priority.value = newtask.dataset.taskpriority;
		edit_field.appendChild(text_priority);
		edit_field.appendChild(field_priority);

		//Create duedate field
		var text_duedate = document.createTextNode("Duedate:");
		var field_duedate = document.createElement("input");
		field_duedate.type = "date";
		field_duedate.id = "field_duedate" + newtask.dataset.id;
		field_duedate.value = newtask.dataset.taskdue;
		edit_field.appendChild(text_duedate);
		edit_field.appendChild(field_duedate);

		//Create reminder field
		var text_reminder = document.createTextNode("Reminder:");
		var field_reminder = document.createElement("input");
		field_reminder.type = "date";
		field_reminder.id = "field_reminder" + newtask.dataset.id;
		field_reminder.value = newtask.dataset.reminder;
		edit_field.appendChild(text_reminder);
		edit_field.appendChild(field_reminder);

		//Create reminder field
		var text_note = document.createTextNode("Note:");
		var field_note = document.createElement("input");
		field_note.type = "text";
		field_note.id = "field_note" + newtask.dataset.id;
		field_note.value = newtask.dataset.note;
		edit_field.appendChild(text_note);
		edit_field.appendChild(field_note);

		var savebtn = button_save(newtask, field_taskname.id, field_tag.id, field_priority.id, 
			field_duedate.id, field_reminder.id, field_note.id);
		edit_field.appendChild(savebtn);
		newtask.appendChild(edit_field);

		//Create input			
		return false;
	};
	return btn_edit;
}

//Creates a remove button based on a btn_id and paragraph_id
var button_remove = function(newtask) {
	var btn_remove = document.createElement("button");			//Create button
	btn_remove.appendChild(document.createTextNode("Remove"));	//Add text to button

	btn_remove.onclick = function(){ 							//Create function remove
		var taskJSON = createJSON(newtask);

		$.ajax({
            url: '/removetodo',
            type: 'post',
            dataType: 'json',
            success: function (data) {
                console.log(data);
                LoadTasks("todos.json");
            },
            data: taskJSON
        });
		settasks();
	};
	return btn_remove;

}

//Creates a save button based on a btn_id and paragraph_id
var button_save = function(originaltask, field_id, tag_id, priority_id, 
			duedate_id, reminder_id, note_id) {
	var btn_save = document.createElement("button");			//Create button
	btn_save.appendChild(document.createTextNode("Save"));	//Add text to button
	btn_save.onclick = function(){ 							//Create function remove
		
		var item = {
		id: parseInt(originaltask.dataset.id),
		taskname: document.getElementById(field_id).value,
		tasktag: document.getElementById(tag_id).value,
		taskpriority:  document.getElementById(priority_id).value,
		taskdue:  document.getElementById(duedate_id).value,
		reminder:  document.getElementById(reminder_id).value,
		note:  document.getElementById(note_id).value,
		taskactive: originaltask.dataset.taskactive
		};


		$.ajax({
            url: '/edittodo',
            type: 'post',
            dataType: 'json',
            success: function (data) {
                console.log(data);
                LoadTasks("todos.json");
            },
            data: item
        });

	};
	return btn_save;

}

//Sort newest first
function SortNewTop () {
	var sorted = false;
	while(!sorted) {
		sorted = true;
		for(var i = 0; i < listactivetasks.length - 1; i++) {
			if(listactivetasks[i].dataset.id < listactivetasks[i + 1].dataset.id) {
				var temp = listactivetasks[i];
				listactivetasks[i] = listactivetasks[i + 1];
				listactivetasks[i + 1] = temp;
				sorted = false;
				break;
			}
		}
	}

	sorted = false;
	while(!sorted) {
		sorted = true;
		for(var i = 0; i < listcompletedtasks.length - 1; i++) {
			if(listcompletedtasks[i].dataset.id < listcompletedtasks[i + 1].dataset.id) {
				var temp = listcompletedtasks[i];
				listcompletedtasks[i] = listcompletedtasks[i + 1];
				listcompletedtasks[i + 1] = temp;
				sorted = false;
				break;
			}
		}
	}

	settasks();

}

//Sort oldest first
function SortOldTop() {
	var sorted = false;
	while(!sorted) {
		sorted = true;
		for(var i = 1; i < listactivetasks.length; i++) {
			if(listactivetasks[i].dataset.id < listactivetasks[i - 1].dataset.id) {
				var temp = listactivetasks[i];
				listactivetasks[i] = listactivetasks[i - 1];
				listactivetasks[i - 1] = temp;
				sorted = false;
				break;
			}
		}
	}

	sorted = false;
	while(!sorted) {
		sorted = true;
		for(var i = 1; i < listcompletedtasks.length; i++) {
			if(listcompletedtasks[i].dataset.id < listcompletedtasks[i - 1].dataset.id) {
				var temp = listcompletedtasks[i];
				listcompletedtasks[i] = listcompletedtasks[i - 1];
				listcompletedtasks[i - 1] = temp;
				sorted = false;
				break;
			}
		}
	}

	settasks();
}

//Function to read JSON
var LoadTasks = function(url){
	"use strict";
	listactivetasks = [];
	listcompletedtasks = [];

	$.getJSON(url, function (response) {
		response.forEach(function(task){
			//Set globaltasknumber
			if(parseInt(globaltasknumber) <= parseInt(task.id)) {
				globaltasknumber = parseInt(parseInt(task.id) + 1);
			}
			var newtask = newtaskHTML(task.taskname, task.tasktag, task.taskpriority,task.taskduedate,task.reminder,task.note );
			newtask.dataset.id = task.id;
			if(task.taskactive == true || task.taskactive == "true") {
				listactivetasks.push(newtask);
			} else {
				newtask.dataset.taskactive = false;
				listcompletedtasks.push(newtask);
			}
		})


	});

	settasks();
}

function createJSON(task) {
	var item = {
		id: parseInt(task.dataset.id),
		taskname: task.dataset.taskname,
		tasktag: task.dataset.tasktag,
		taskpriority: task.dataset.taskpriority,
		taskdue: task.dataset.taskdue,
		reminder: task.dataset.reminder,
		note: task.dataset.note,
		taskactive: task.dataset.taskactive
	};

	//item = JSON.stringify(item);

    return item;
}

$(document).ajaxStop(function() {
  settasks();
});

window.onload = function() {
	LoadTasks("todos.json");
}

function hasClass(el, className) {
  if (el.classList)
    return el.classList.contains(className)
  else
    return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'))
}

function addClass(el, className) {
  if (el.classList)
    el.classList.add(className)
  else if (!hasClass(el, className)) el.className += " " + className
}

function removeClass(el, className) {
  if (el.classList)
    el.classList.remove(className)
  else if (hasClass(el, className)) {
    var reg = new RegExp('(\\s|^)' + className + '(\\s|$)')
    el.className=el.className.replace(reg, ' ')
  }
}

function addClassHTML(paragraph) {
	for(var i = 0; i < 5; i++) {
		removeClass(paragraph, "Priority" + i);
	}
	addClass(paragraph, "Priority" + paragraph.dataset.taskpriority);

	removeClass(paragraph, "due");
	removeClass(paragraph, "overdue");
	if(paragraph.dataset.taskdue < Date()){
		addClass(paragraph, "due");
	} else {
		addClass(paragraph, "overdue");
	}

	return paragraph;
}