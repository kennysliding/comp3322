// DOM Ready =============================================================
$(document).ready(function () {
    // Populate the commodity list on initial page load
    populateCommodityList();
});
// Functions =============================================================
// Fill commodity list with actual data
function populateCommodityList() {
    // Empty content string
    var listCommodity = '<table > <tr><th>Name</th><th>Category</th><th>Status</th><th>Delete?</th></tr>';
    // jQuery AJAX call for JSON
    $.getJSON('/users/commodities', function (data) {
        // Put each item in received JSON collection into a <tr> element
        $.each(data, function () {
            listCommodity += '<tr><td>' + this.name + '</td><td>' +
                this.category + '</td><td id="status_' + this._id + '">' +
                this.status + '<button data="' + this._id +
                '" class="myButton" onclick="showStatusOptions(event,this)">update</button>' +
                '</td><td>' + '<button data="' + this._id +
                '" class="myButton" onclick="deleteCommodity(event,this)">delete</button>' +
                '</td></tr>';
        });
        listCommodity += '</table>'
        // Inject the whole commodity list string into our existing #commodityList element
        $('#commodityList').html(listCommodity);
    });
};

// Add Commodity button click
$('#btnAddcommodity').on('click', addCommodity); // Add commodity
function addCommodity(event) {
    event.preventDefault(); //validation - increase errorCount if any field is blank 
    var errorCount = 0; $('#addcommodity input').each(function (index, val) { if ($(this).val() === '') { errorCount++; } }); $('#addCommodity select').each(function (index, val) { if ($(this).val() === '') { errorCount++; } }); // Check and make sure errorCount's still at zero 
    if (errorCount === 0) { // If it is, compile all commodity information into one object
        var category = $('#addcommodity fieldset select#inputCategory').val(); var name = $('#addcommodity fieldset input#inputName').val(); var status = $('#addcommodity fieldset select#inputStatus').val(); var newCommodity = { 'category': category, 'name': name, 'status': status }
        $.ajax({
            type: 'POST', data: newCommodity, url: '/users/addcommodity', dataType: 'JSON'
        }).done(function (response) { // Check for successful (blank) response 
            if (response.msg === '') { // Clear the form inputs 
                $('#addcommodity fieldset input').val(''); $('#addcommodity fieldset select').val('0'); // Update the table 
                populateCommodityList();
            } else { // If something goes wrong, alert the error message that our service returned 
                alert('Error: ' + response.msg);
            }
        });
    } else { // If errorCount is more than 0, prompt to fill in all fields 
        alert('Please fill in all fields'); return false;
    }
};

// Delete Commodity 
function deleteCommodity(event, instance) {
    event.preventDefault();
    var id = $(instance).attr('data');

    $.ajax({
        type: 'DELETE',
        url: `/users/deletecommodity/${id}`
    })
        .done(function (response) { // Check for successful (blank) response 
            if (response.msg === '') {
                populateCommodityList();
            } else { // If something goes wrong, alert the error message that our service returned 
                alert('Error: ' + response.msg);
            }
        });
};

// Show Status Selection
function showStatusOptions(event, instance) {
    event.preventDefault();
    var id = $(instance).attr('data');
    var statusField = '<select><option value="0">-- Status --</option><option value="in stock">in stock</option><option value="out of stock">out of stock</option></select><button data="' + id + '" class="myButton" onclick="updateCommodity(event,this)">update</button>';
    $("#status_" + id).html(statusField);
};
// Update Commodity (status)
function updateCommodity(event, instance) {
    event.preventDefault();
    var id = $(instance).attr('data');
    var newStatus = $("#status_" + id + " select").val();
    if (newStatus === '0') {
        alert('Please select status');
        return false;
    }
    else {
        var changeStatus = {
            'status': newStatus
        }
        $.ajax({
            type: 'PUT',
            url: `/users/updatecommodity/${id}`,
            data: { status: newStatus },
            dataType: 'JSON'
        }).done(function (response) { // Check for successful (blank) response 
            if (response.msg === '') {
                populateCommodityList();
            } else { // If something goes wrong, alert the error message that our service returned 
                alert('Error: ' + response.msg);
            }
        });
    }
};