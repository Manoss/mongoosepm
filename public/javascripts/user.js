$(document).ready(function(){
    var strHTMLOutput = '';
    $.ajax('/project/byuser/' + userID, {
        dataType: 'json',
        error: function(){
        console.log("ajax error :(");
    },
    success: function (data) {
        if (data.length > 0) {
            if (data.status && data.status === 'error'){
                strHTMLOutput = "<li>Error: " + data.error + "</li>";
                console.log("Error data Ajax")
            } else {
                var intItem,
                totalItems = data.length,
                arrLI = [];
                for (intItem = totalItems - 1; intItem >= 0; intItem--) {
                    arrLI.push('<a href="/project/' + data[intItem]._id + '">' + data[intItem].projectName + "</a>" + ' | ' + '<a href="/project/edit/' + data[intItem]._id + '">' + 'Edit' + "</a>" + ' | ' + '<a href="/project/delete/' + data[intItem]._id + '">' + 'Delete' + "</a>");
                }
                strHTMLOutput = "<li>" + arrLI.join('</li><li>') + "</li>";
            }
            }else{
                strHTMLOutput = "<li>You haven't created any projects yet</li>";
            }
            $('#myprojects').html(strHTMLOutput);
        }
    }); 
});