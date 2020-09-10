let url = "http://localhost:8001/api/";
$(document).ready(function () {
    fetchIncompleteTasks();
});

$("#showAll").click(function () {
    if ($(this).prop("checked") == true) {
        fetchAllTasks();
    }else{
        fetchIncompleteTasks();
    }
});

$(document).on("click", "#singleTask", function () {
    if ($(this).prop("checked") == true) {
        changeStatus($(this).attr("data-id"));
    }
});

$(document).on("click", "#trashIcon", function () {
    let id = $(this).attr("data-id");
    $(document).on("click", "#yesDel", function () {
        deleteTask(id);
    });
});

async function addTask(){
    let response = await fetch(url + "task",{method: "POST",body: JSON.stringify({taskname:$('#taskname').val()}),headers: {
		'Content-type': 'application/json; charset=UTF-8'
	}});
    let data = await response.json();
    if(data.success==true){
        if($('#showAll').prop("checked") == true){
            fetchAllTasks();
        }else{
            fetchIncompleteTasks();
        }   
    }
    if(data.success==false && data.error == "The taskname has already been taken." ){
        $('#error').removeClass('d-none');
    }
}

async function fetchAllTasks() {
    let response = await fetch(url + "task");
    let data = await response.json();
    let html = "";
    $("#tbody").empty();
    data.data.forEach(function (item) {
        let checked = item.status === "complete" ? "checked" : null;
        html += `<tr style="width:25%">
            <td scope="row" width="3%"><input type="checkbox" ${checked} id="singleTask" data-id=${item.id} aria-label="Checkbox for following text input"></td>
            <td>${item.taskname}</td>
            <td width="5%" style="text-align: center;"><i class="fas fa-trash" data-id=${item.id} id="trashIcon" style="cursor:pointer; color:#dc3545;" data-toggle="modal" data-target="#exampleModal"></i></td>
        </tr>`;
    });
    $("#tbody").append(html);
    $('#error').addClass('d-none');
}

async function fetchIncompleteTasks() {
    let response = await fetch(url + "task/incomplete");
    let data = await response.json();
    let html = "";
    $("#tbody").empty();
    if(data.success == false && data.Message == "No Data Found"){
        html="<p class='text-center'>No Incomplete Tasks</p>"
    }else{
        data.data.forEach(function (item) {
            let checked = item.status === "complete" ? "checked" : null;
            html += `<tr style="width:25%">
                <td scope="row" width="3%"><input type="checkbox" ${checked} id="singleTask" data-id=${item.id} aria-label="Checkbox for following text input"></td>
                <td>${item.taskname}</td>
                <td width="5%" style="text-align: center;"><i class="fas fa-trash" data-id=${item.id} id="trashIcon" style="cursor:pointer; color:#dc3545;" data-toggle="modal" data-target="#exampleModal"></i></td>
            </tr>`;
        });
    }
    $("#tbody").append(html);
    $('#error').addClass('d-none');
}

async function changeStatus(id) {
    let response = await fetch(url + "task/" + id + "/changestatus", {
        method: "PUT",
    });
    let data = await response.json();
    if (data.success === true) {
        if($('#showAll').prop("checked") == true){
            fetchAllTasks();
        }else{
            fetchIncompleteTasks();
            //here we can also do the following approach

            // let tr = $("#tbody").find("tr");
            // tr.each(function (index, value) {
            //     if ($(this).find('#singleTask').attr('data-id') == id) {
            //         $(this).remove();
            //     }
            // });
        }        
    }
}

async function deleteTask(id) {
    let response = await fetch(url + "task/" + id, {
        method: "DELETE",
    });
    let data = await response.json();
    if (data.success === true) {
        if($('#showAll').prop("checked") == true){
            $('#exampleModal').modal('hide')
            fetchAllTasks();
        }else{
            $('#exampleModal').modal('hide')
            fetchIncompleteTasks();
        }        
    }
}
