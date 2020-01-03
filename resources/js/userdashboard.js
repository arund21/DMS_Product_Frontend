$(document).ready(
    function() {
        var noteid;
        loadMyText();
        userName();

        $('#edituserprofile').on('keyup', function() {
            $('#editprofile').prop('disabled', !1);

        })
        $('#editpassword').on('keyup', function() {
            $('#changepassword').prop('disabled', !1);
        })

        $('#copiedtext').click(function() {
            $('#userprofile').hide();
            $('#textList').show();
            $('#userhelp').hide();
            $('#copiedtext').addClass('active');
            $('#showuserprofile').removeClass('active');
            $('#showuserhelp').removeClass('active');
        })


        $('#showuserprofile').click(function() {
            $('#userprofile').show();
            $('#textList').hide();
            $('#userhelp').hide();
            $('#copiedtext').removeClass('active');
            $('#showuserprofile').addClass('active');
            $('#showuserhelp').removeClass('active');


            $.ajax({
                url: "http://localhost:3001/v1/findAuthUser/",
                method: 'GET',
                dataType: 'json',
                headers: {
                    "Authorization": `bearer ${localStorage.getItem('token')}`
                },
                success: function(result, status) {
                    console.log(result);
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

        $('#showuserhelp').click(function() {
            $('#userprofile').hide();
            $('#textList').hide();
            $('#userhelp').show();
            $('#copiedtext').removeClass('active');
            $('#showuserprofile').removeClass('active');
            $('#showuserhelp').addClass('active');
        })


        $('#edituserprofile').on('click', '#editprofile', function(e) {
            e.preventDefault();
            var edituserData = {
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
                data: edituserData,
                success: function(result, status) {
                    userName();
                    $('#message').html(result.message);
                },
                error: function(jqXHR, status) {}
            })
        })




        $('#userlogout').click(function() {
            var isDelete = confirm("Are you sure?");
            if (isDelete == true) {
                localStorage.removeItem('token');
                location.href = "../../index.html";
            }

        })

        // clicklistener for edit button on userdashboard
        $('#notesList').on('click', '#edit', function() {
            //this is the userid 
            noteid = $(this)[0].attributes.noteid.nodeValue;

            $.ajax({

                url: 'http://localhost:3001/v1/findtext/' + noteid,
                method: 'get',
                dataType: 'json',
                headers: {
                    "Authorization": `bearer ${localStorage.getItem('token')}`
                },
                success: function(result) {
                    console.log(result);
                    $('#header').val(result.header)
                    $('#content').val(result.content)

                },
                error: function() {

                }
            })
        })



        // clicklistener for edit button on userdashboard
        $('#addNote').on('click', '#addmynote', function(e) {
            e.preventDefault();
            var myNote = {
                header: $('#addheader').val(),
                content: $('#addcontent').val()
            }
            console.log(myNote);
            $.ajax({
                url: 'http://localhost:3001/v1/text/',
                method: 'POST',
                dataType: 'json',
                headers: {
                    "Authorization": `bearer ${localStorage.getItem('token')}`
                },

                data: myNote,

                success: function(result) {
                    $('#addNote')[0].reset();
                    $('#message').html(result.message);
                    loadMyText();
                },
                error: function() {

                }
            })
        })


        // clicklistener for edit button on userdashboard
        $('#sendMyFeedback').on('click', '#sendNow', function(e) {
            e.preventDefault();
            var myFeedback = {
                subject: $('#subject').val(),
                content: $('#feedbackcontent').val()
            }
            $.ajax({
                url: 'http://localhost:3001/v1/givefeedback/',
                method: 'POST',
                dataType: 'json',
                headers: {
                    "Authorization": `bearer ${localStorage.getItem('token')}`
                },

                data: myFeedback,

                success: function(result) {
                    $('#sendFeedback').modal("hide");
                    $('#sendMyFeedback')[0].reset();
                    $('#feedbackmessage').html(result.message);

                },
                error: function() {

                }
            })
        })


        $('#editNote').submit(function(e) {
            e.preventDefault();
            var editData = {
                header: $('#header').val(),
                content: $('#content').val()
            }

            $.ajax({

                url: 'http://localhost:3001/v1/text/' + noteid, // here uid has already been set to actual userid in previous funciton when edit is clicked, since uid is global
                method: "PUT",
                contentType: 'application/json',
                dataType: 'json',
                headers: {
                    "Authorization": `bearer ${localStorage.getItem('token')}`
                },
                data: JSON.stringify(editData),
                success: function(result) {
                    $('#exampleModal').modal("hide");
                    loadMyText();
                    // console.log(result)
                    // your logic here , redirect to another page or show message etc
                },
                error: function() {

                }

            })

        })


        $('#notesList').on('click', '#delete', function() {
            noteid = $(this)[0].attributes.noteid.nodeValue
            var isDelete = confirm("Are you sure?");
            if (isDelete == true) {
                $.ajax({
                    url: 'http://localhost:3001/v1/text/' + noteid,
                    method: 'delete',
                    dataType: 'json',
                    headers: {
                        "Authorization": `bearer ${localStorage.getItem('token')}`
                    },
                    success: function() {
                        loadMyText();
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

function loadMyText() {
    $.ajax({
        url: "http://localhost:3001/v1/text/",
        method: 'GET',
        dataType: 'json',
        headers: {
            "Authorization": `bearer ${localStorage.getItem('token')}`
        },
        success: function(result, status) {
            // console.log(result);
            // result is sent from index.js as ajson file
            $('#notesList').empty();
            for (key in result) {
                $('#notesList').append('<tr ]\
      <th scope="row">1</th>\
      <td>' + result[key].id + '</td>\
      <td>' + result[key].header + '</td>\
      <td>' + result[key].content + '</td>\
      <td>' + result[key].createdAt + '</td>\
       <td><label noteid="' + result[key].id + '" class="btn" data-toggle="modal" data-target="#exampleModal" id="edit" style="color: blue;" >Edit</label></td>\
      <td><label noteid="' + result[key].id + '" class="btn" id="delete" style="color: red;" >Delete</label></td>\
      <td><label noteid="' + result[key].id + '" class="btn" id="copy" style="color: #20d4c4;" >Copy</label></td>\
    </tr>')
            }
        },
        error: function(jqXHR, status) {}
    })
}

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


$(function() {

    $.get({
        url: 'http://localhost:3001/api/check/auth',
        headers: {
            "authorization": 'bearer ' + localStorage.getItem('token')
        }
    }).then(authUser => {

        if (authUser.is_admin == 'true') {
            location.href = '../admin/index.html';
        } else {

        }



    }, failed => {

        location.href = '../../index.html';
    });

});


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