$("#submit-event").click((e) => {
    e.preventDefault();
    const hours = $("[name='hours']").val();
    const event = $("[name='event-name']").val();
    $.ajax({
        method: "GET",
        url: "http://localhost:5000/api/user/events",
        dataType: "json",
        success: (data) => {
            for(i=0; i<data.length-1; i++){
                if(moment(data[i].end.dateTime).diff(moment(data[i+1].start), "hour")>hours){
                    //makes sure we don't schedule an event after 9PM or before 9AM
                    if(moment(data[i].end.dateTime).hour() + hours > 21 && moment(data[i+1].start.dateTime).hour - hours < 9){
                        continue;
                    }
                    else {
                        $("#time-options").html(`You have time between ${moment(data[i].end.dateTime).format("MM/DD at HH:MM")} and ${moment(data[i].start.dateTime).format("MM/DD at HH:MM")}`);
                    }
                }
            }

        }
    })
})