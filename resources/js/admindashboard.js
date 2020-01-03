$(document).ready(
    function() {
        userName();
        // $('#adminprofile').hide();
        // $('#userslist').hide();

        $('#editadminprofile').on('keyup', function() {
            $('#editprofile').prop('disabled', !1);

        })
        $('#editpassword').on('keyup', function() {
            $('#changepassword').prop('disabled', !1);
        })

        $('#editadminprofile').on('click', '#editprofile', function(e) {
            e.preventDefault();
            var editadminData = {
                fname: $('#fname').val(),
                lname: $('#lname').val(),
                address: $('#address').val(),
                gender: $('#gender').val(),
                country: $('#country').val(),
                phone: $('#phone').val()
            }
            $.ajax({
                url: "http://localhost:3001/v1/editAuthUser/",
                method: 'PUT',
                dataType: 'json',
                headers: {
                    "Authorization": `bearer ${localStorage.getItem('token')}`
                },
                // data:JSON.stringify(editadminData),
                data: editadminData,
                success: function(result, status) {
                    userName();
                    $('#message').html(result.message);
                },
                error: function(jqXHR, status) {}
            })
        })





        var userid;
        $('#showdashboard').addClass('active');
        $('#adminlogout').click(function() {
            var isDelete = confirm("Are you sure?");
            if (isDelete == true) {
                localStorage.removeItem('token');
                location.href = "../../index.html";
            }

        })

        $('#showdashboard').click(function() {
            $('#userslist').hide();
            $('#admindashboard').show();
            $('#adminprofile').hide();
            $('#feedbacklist').hide();
            $('#showdashboard').addClass('active');
            $('#showFeedBack').removeClass('active');
            $('#showusers').removeClass('active');
            $('#showprofile').removeClass('active');
        })

        $('#showusers').click(function() {
            $('#userslist').show();
            $('#admindashboard').hide();
            $('#adminprofile').hide();
            $('#feedbacklist').hide();
            $('#showusers').addClass('active');
            $('#showFeedBack').removeClass('active');
            $('#showdashboard').removeClass('active');
            $('#showprofile').removeClass('active');
        })


        $('#showFeedBack').click(function() {
            var feedbackid;
            $('#feedbacklist').show();
            $('#admindashboard').hide();
            $('#adminprofile').hide();
            $('#userslist').hide();
            $('#showFeedBack').addClass('active');
            $('#showdashboard').removeClass('active');
            $('#showprofile').removeClass('active');
            $('#showusers').removeClass('active');

            deleteMyFeedback1();



        })

        $('#allFeedBackList').on('click', '#deletefeedback', function() {
            feedbackid = $(this)[0].attributes.feedbackid.nodeValue
            var isDelete = confirm("Are you sure?");
            if (isDelete == true) {
                $.ajax({
                    url: 'http://localhost:3001/v1/feedback/' + feedbackid,
                    method: 'delete',
                    dataType: 'json',
                    headers: {
                        "Authorization": `bearer ${localStorage.getItem('token')}`
                    },
                    success: function() {
                        deleteMyFeedback1();
                    },
                    error: function() {

                    }

                })
            }
        })


        $('#showprofile').click(function() {
            $('#userslist').hide();
            $('#adminprofile').show();
            $('#admindashboard').hide();
            $('#feedbacklist').hide();
            $('#showprofile').addClass('active');
            $('#showdashboard').removeClass('active');
            $('#showusers').removeClass('active');
            $('#showFeedBack').removeClass('active');

            $.ajax({
                url: "http://localhost:3001/v1/findAuthUser/",
                method: 'GET',
                dataType: 'json',
                headers: {
                    "Authorization": `bearer ${localStorage.getItem('token')}`
                },
                success: function(result, status) {
                    $('#fname').val(result.fname);
                    $('#lname').val(result.lname);
                    $('#email').val(result.email);
                    $('#gender').val(result.gender);
                    $('#address').val(result.address);
                    $('#country').val(result.country);
                    $('#phone').val(result.phone);
                },
                error: function(jqXHR, status) {}
            })




        })




        var categories = document.getElementById("sel1");
        categories.onchange = function() { myFunction() };

        function myFunction() {

            var status = categories.options[categories.selectedIndex].text;
            console.log(status);
            if (status == "Blocked") {
                $.ajax({
                    url: "http://localhost:3001/v1/blockedusers/",
                    method: 'GET',
                    dataType: 'json',
                    headers: {
                        "Authorization": `bearer ${localStorage.getItem('token')}`
                    },
                    success: function(result, status) {
                        $('#usersList').empty();
                        for (key in result) {
                            $('#usersList').append('<tr>\
      <td>' + result[key].id + '</td>\
      <td>' + result[key].fname + " " + result[key].lname + '</td>\
      <td>' + result[key].email + '</td>\
      <td>' + result[key].country + '</td>\
      <td>' + result[key].status + '</td>\
      <td>' + result[key].createdAt + '</td>\
    <td><label userid="' + result[key].id + '"  id="unblock" style="color: red;" >UnBlock</label></td>\
    </tr>')
                        }
                    },
                    error: function(jqXHR, status) {}
                })
            } else if (status == "Active") {

                $.ajax({
                    url: "http://localhost:3001/v1/users/",
                    method: 'GET',
                    dataType: 'json',
                    headers: {
                        "Authorization": `bearer ${localStorage.getItem('token')}`
                    },
                    success: function(result, status) {
                        $('#usersList').empty();
                        for (key in result) {
                            $('#usersList').append('<tr>\
                          <td>' + result[key].id + '</td>\
                          <td>' + result[key].fname + " " + result[key].lname + '</td>\
                          <td>' + result[key].email + '</td>\
                          <td>' + result[key].country + '</td>\
                          <td>' + result[key].status + '</td>\
                          <td>' + result[key].createdAt + '</td>\
                        <td><label userid="' + result[key].id + '"  id="block" style="color: red;" >block</label></td>\
                        </tr>')
                        }
                    },
                    error: function(jqXHR, status) {

                    }
                })
            } else if (status == "--Select Category--") {
                $('#usersList').empty();
            }

        }

        $('#usersList').on('click', '#block', function() {
            userid = $(this)[0].attributes.userid.nodeValue
            var isBlock = confirm("Are you sure?");
            if (isBlock == true) {
                $.ajax({
                    url: 'http://localhost:3001/v1/blockuser/' + userid,
                    method: 'PUT',
                    dataType: 'json',
                    headers: {
                        "Authorization": `bearer ${localStorage.getItem('token')}`
                    },
                    success: function() {
                        myFunction();
                    },
                    error: function() {

                    }
                })
            }
        })

        $('#usersList').on('click', '#unblock', function() {
            userid = $(this)[0].attributes.userid.nodeValue
            var isunBlock = confirm("Are you sure?");
            if (isunBlock == true) {
                $.ajax({
                    url: 'http://localhost:3001/v1/unblockuser/' + userid,
                    method: 'PUT',
                    dataType: 'json',
                    headers: {
                        "Authorization": `bearer ${localStorage.getItem('token')}`
                    },
                    success: function() {
                        myFunction();
                    },
                    error: function() {

                    }
                })
            }
        })


        $('#editpassword').on('click', '#changepassword', function(e) {
            e.preventDefault();
            const myFormData = {
                currentpassword: $('#currentpassword').val(),
                newpassword: $('#newpassword').val(),
                retypepassword: $('#retypepassword').val()
            }

            $.ajax({

                // v1 is the version , users is the route in backend 
                url: 'http://localhost:3001/v1/changepassword/',
                method: 'POST',
                contentType: 'application/json',
                headers: {
                    "Authorization": `bearer ${localStorage.getItem('token')}`
                },
                data: JSON.stringify(myFormData),

                success: function(result, status, res) {
                    $('#editpassword')[0].reset();
                    $('#Pmessage').html(result.message);

                },
                error: function(jqXHR, status, res) {

                    console.log(jqXHR.responseJSON.message);
                    $('#Pmessage').html(jqXHR.responseJSON.message);

                }

            })

        })



    })

function userName() {
    $.ajax({
        url: "http://localhost:3001/v1/getRecentUser/",
        method: 'GET',
        dataType: 'json',
        headers: {
            "Authorization": `bearer ${localStorage.getItem('token')}`
        },
        success: function(result, status) {
            $('#username').text(result.fname + " " + result.lname);
            $('#userimage').attr('src', 'http://localhost:3001/image/' + result.img || 'default.jpg');
        },
        error: function(jqXHR, status) {}
    })

}

function deleteMyFeedback1() {
    $.ajax({
        url: "http://localhost:3001/v1/feedback/",
        method: 'GET',
        dataType: 'json',
        headers: {
            "Authorization": `bearer ${localStorage.getItem('token')}`
        },
        success: function(result, status) {
            $('#allFeedBackList').empty();
            for (key in result) {
                $('#allFeedBackList').append('<tr>\
                      <td>' + result[key].id + '</td>\
                      <td>' + result[key].email + '</td>\
                      <td>' + result[key].subject + '</td>\
                      <td>' + result[key].content + '</td>\
                      <td>' + result[key].createdAt + '</td>\
                    <td><label feedbackid="' + result[key].id + '"  id="deletefeedback" style="color: red;" >Delete</label></td>\
                    </tr>')
            }
        },
        error: function(jqXHR, status) {}
    })
}

$(function() {

    $.get({
        url: 'http://localhost:3001/api/check/auth',
        headers: {
            "authorization": 'bearer ' + localStorage.getItem('token')
        }
    }).then(authUser => {

        if (authUser.is_admin == 'true') {

        } else {
            location.href = '../users/index.html';
        }

    }, failed => {

        location.href = '../../index.html';
    });

});

function validateChangePasswordForm() {

    if ('#currentpassword'.isEmpty()) {
        console.log("i am here")
    }
}

$('#user-count').load('http://localhost:3001/api/userCount');


// responsible for changing profile image
$(document).on('change', '#ChangeProfile', function() {
    if (this.files.length) {
        const myFormData = new FormData();
        myFormData.append('imageFile', this.files[0]);

        $.post({
            url: 'http://localhost:3001/upload',
            contentType: false,
            processData: false,
            data: myFormData
        }).then(file => {
            $.ajax({
                url: "http://localhost:3001/v1/editAuthUser/",
                method: 'PUT',
                dataType: 'json',
                headers: {
                    "Authorization": `bearer ${localStorage.getItem('token')}`
                },
                // data:JSON.stringify(editadminData),
                data: {
                    img: file.filename
                },
                success: function(result, status) {
                    userName();
                    $('#message').html(result.message);
                },
                error: function(jqXHR, status) {}
            })
        });
    }
});