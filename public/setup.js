let calendars = [];

//Gets the users calendars and lists them with checkboxes
$.ajax({
    method: "GET",
    url: "http://localhost:5000/api/calendars",
    dataType: "json",
    success: (data) => {
        for (i = 0; i < data.items.length; i++) {
            let html = `<div><input type="checkbox" value="${data.items[i].id}" name="calendar"><label for="${data.items[i].id}">${data.items[i].summary}</label></div>`;
            $("#calendar-list").append(html);     
        }
    }
})

$("#submit-calendars").click(() => {
    let calendars = [];
    $("#calendar-list :checked").each(() => {
        calendars.push($(this).val());
    })
    $.ajax({
        method: "POST",
        url: "http://localhost:5000/api/user/calendars",
        dataType: "json",
        data: JSON.stringify({calendars: calendars}),
        success: () => {} 
    })
})
