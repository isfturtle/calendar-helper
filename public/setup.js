let calendars = [];

//Gets the users calendars and lists them with checkboxes
$.ajax({
    method: "GET",
    url: "http://localhost:5000/api/user/calendars",
    dataType: "json",
    success: (data) => {
        for (i = 0; i < data.items.length; i++) {
            if (data.items[i].id) {
                let html = `<div><input type="checkbox" value="${data.items[i].id}" name="calendar"><label for="${data.items[i].id}">${data.items[i].summary}</label></div>`;
                $("#calendar-list").append(html);
            }
        }
    }
})

$("#submit-calendars").click((e) => {
    e.preventDefault();
    let calendars = [];
    console.log($("[name='calendar']:checked"));
    // $("[name='calendar']:checked").each(() => {
    //     console.log("iterating");
    //     console.log($(this));
    //     calendars.push($(this).val());
    // })
    calendars.push("6an4f2oeksqqja5g3j6lm7d98g@group.calendar.google.com");
    console.log(calendars);
    $.ajax({
        method: "POST",
        url: "http://localhost:5000/api/user/calendars",
        dataType: "json",
        contentType: 'application/json',
        data: JSON.stringify({ "calendars": calendars }),
        success: (res) => {
            console.log(res);
        }
    })
})
