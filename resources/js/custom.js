$(document).ready(
    function() {
        //start of registration activity
        $('#signup').click(function(event) {
            event.preventDefault();
            const myFormData = {
                fname: $('#fname').val(),
                lname: $('#lname').val(),
                email: $('#email').val(),
                password: $('#password').val(),
                rpassword: $('#rpassword').val()
            };
            $.post({
                url: 'http://localhost:3001/upload',
                contentType: false,
                processData: false,
                data: new FormData(document.getElementById('register-form'))
            }).then(resp => {
                myFormData.image = resp.filename;
                registrationAction(myFormData)
            }, nophoto => {
                myFormData.image = 'addimage.png';
                registrationAction(myFormData)
            });
        })
        //end of registration form
        function registrationAction(myFormData) {
            $.ajax({
                // v1 is the version , users is the route in backend 
                url: 'http://localhost:3001/v1/users',
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(myFormData),
                processData: false,
                success: function(result, status) {
                    console.log(result);
                    console.log(status);
                    $('#message').html(result.message);
                },
                error: function(jqXHR, status) {
                    if (jqXHR.status === 422) {
                        const { errors } = jqXHR.responseJSON;
                        $('#message').html(errors.flat(1).join('. '));
                    }
                }

            })
        }

        //login form
        $('#signin').click(function(event) {
            event.preventDefault();
            if ($('#lemail').val() == '') {
                $('#loginmessage').html("Please input email");
                $('#lemail').focus();

            } else if ($('#lpassword').val() == '') {
                $('#loginmessage').html("Please input password");
                $('#lpassword').focus();
            }
            const myFormData = {
                lemail: $('#lemail').val(),
                lpassword: $('#lpassword').val()
            }
            $.ajax({

                // v1 is the version , users is the route in backend 
                url: 'http://localhost:3001/v1/auth',
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(myFormData),
                success: function(result, status, res) {
                    if (res.status == 200) {
                        $('#loginmessage').html("Welcome user");
                        localStorage.setItem('token', result.token);
                        location.href = "pages/users/index.html";
                    } else if (res.status == 201) {
                        $('#loginmessage').html("Welcome Admin");
                        localStorage.setItem('token', result.token);
                        location.href = "pages/admin/index.html";
                    }

                    // console.log(result.token);
                    // window.localStorage.setItem('token',result.token);
                },
                error: function(jqXHR, status, res) {

                    console.log(jqXHR.responseJSON.message);
                    $('#loginmessage').html(jqXHR.responseJSON.message);
                }

            })
        })

        $('.nav-link').on('click', '#userimage', function() {
           

    $.get({
        url: 'http://localhost:3001/api/check/auth',
        headers: {
            "authorization": 'bearer ' + localStorage.getItem('token')
        }
    }).then(authUser => {

        if (authUser.is_admin == 'true') {
            location.href = 'pages/admin/index.html';
        } else {
            location.href = 'pages/users/index.html';
        }



    }, failed => {

        // location.href = 'index.html';
    });
        })



    })

$(document).on('change', '#agree-term', function(e) {
    const term = 'Please agree term and condition before registration.';
    $('#signup').prop('disabled', !this.checked).attr('title', this.checked ? '' : term);
});


$(function() {
var checkToken = localStorage.getItem('token');
if (checkToken!=null) {
    $.get({
        url: 'http://localhost:3001/api/check/auth',
        headers: {
            "authorization": 'bearer ' + checkToken
        }
    }).then(authUser => {
/*
        if (authUser.is_admin == 'true') {
            location.href = './pages/admin/index.html';
        } else {
        	location.href = './pages/users/index.html';
        }*/
userName();
        $('section.signup,section.sign-in').hide()
        $('#userimage').show()

    }, failed => {

    });
}





});


function userName() {


    $.ajax({
        url: "http://localhost:3001/v1/getRecentUser/",
        method: 'GET',
        dataType: 'json',
        headers: {
            "Authorization": `bearer ${localStorage.getItem('token')}`
        },
        success: function(result, status) {
            
            $('#userimage').attr('src', 'http://localhost:3001/image/' + result.img || 'default.jpg');
        },
        error: function(jqXHR, status) {}
    })

}