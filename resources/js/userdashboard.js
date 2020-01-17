$(document).ready(
    function() {
        var noteid;
        var campaignid;
        loadMyCampaign();
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
            $('#pageList').hide();
            $('#paymentList').hide();
            $('#userhelp').hide();
            $('#copiedtext').addClass('active');
            $('#showuserprofile').removeClass('active');
            $('#showuserhelp').removeClass('active');
            $('#showuserpages').removeClass('active');
            $('#showmypayments').removeClass('active');
        })

        $('#showuserhelp').click(function() {
            $('#userprofile').hide();
            $('#pageList').hide();
            $('#textList').hide();
            $('#paymentList').hide();
            $('#userhelp').show();
            $('#copiedtext').removeClass('active');
            $('#showuserprofile').removeClass('active');
            $('#showuserpages').removeClass('active');
            $('#showuserhelp').addClass('active');
            $('#showmypayments').removeClass('active');
        })


        $('#showuserprofile').click(function() {
            $('#userprofile').show();
            $('#pageList').hide();
            $('#textList').hide();
            $('#paymentList').hide();
            $('#userhelp').hide();
            $('#copiedtext').removeClass('active');
            $('#showuserprofile').addClass('active');
            $('#showuserhelp').removeClass('active');
            $('#showuserpages').removeClass('active');
            $('#showmypayments').removeClass('active');


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

        $('#showuserpages').click(function() {
            $('#pageList').show();
            $('#userprofile').hide();
            $('#textList').hide();
            $('#paymentList').hide();
            $('#userhelp').hide();
            $('#copiedtext').removeClass('active');
            $('#showuserpages').addClass('active');
            $('#showuserprofile').removeClass('active');
            $('#showuserhelp').removeClass('active');
            $('#showmypayments').removeClass('active');
            loadMyPages();


        })

        $('#showmypayments').click(function() {
            $('#paymentList').show();
            $('#pageList').hide();
            $('#userprofile').hide();
            $('#textList').hide();
            $('#userhelp').hide();
            $('#copiedtext').removeClass('active');
            $('#showmypayments').addClass('active');
            $('#showuserpages').removeClass('active');
            $('#showuserprofile').removeClass('active');
            $('#showuserhelp').removeClass('active');
            // loadMyPages();
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

        $('#PaymentDetails').on('click', '#requestmypayment', function(e) {
            e.preventDefault();
            var requestPaymentData = {
                date: $('#date').val(),
                amount: $('#amount').val(),
                method: $('#paymentmethod').val()
            }
            $.ajax({
                url: "http://localhost:3001/v1/requestpayment/",
                method: 'POST',
                dataType: 'json',
                headers: {
                    "Authorization": `bearer ${localStorage.getItem('token')}`
                },
                // data:JSON.stringify(editadminData),
                data: requestPaymentData,
                success: function(result, status) {
                    $('#PaymentDetails')[0].reset();
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
        $('#campaignList').on('click', '#edit', function() {
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
        $('#addCampaign').on('click', '#addmycampaign', function(e) {
            e.preventDefault();
            var myCampaign = {
                post_name: $('#post_name').val(),
                post_link: $('#post_link').val(),
                total_days: $('#total_days').val(),
                total_budget: $('#total_budget').val(),
                age: $('#age').val(),
                rate: "125",
                status: "pending",
                gender: $('#gender').val(),
                area: $('#area').val(),
                pages_id: '1'
            }
            console.log(myCampaign);
            $.ajax({
                url: 'http://localhost:3001/v1/campaign/',
                method: 'POST',
                dataType: 'json',
                headers: {
                    "Authorization": `bearer ${localStorage.getItem('token')}`
                },

                data: myCampaign,

                success: function(result) {
                    $('#addCampaign')[0].reset();
                    $('#message').html(result.message);
                    loadMyCampaign();
                },
                error: function() {

                }
            })
        })

$(document).off("click",".StopBoostingBtn").on("click",".StopBoostingBtn",function(e){
    e.preventDefault()
    $('#campaignid').val($(this).attr("campaignid"))
})

        $('#stopBoost').submit(function(e) {
            e.preventDefault();            
            var stopBoostData = {
                boost_id: $('#campaignid').val(),
                reason: $('#reason').val()
            }

            $.ajax({

                url: "http://localhost:3001/v1/stopboostrequest/",
                method: "POST",
                contentType: 'application/json',
                dataType: 'json',
                headers: {
                    "Authorization": `bearer ${localStorage.getItem('token')}`
                },
                data: JSON.stringify(stopBoostData),
                success: function(result) {
                    $('#message').html(result.message);
                    // $('#exampleModal').modal("hide");
                    loadMyCampaign();
                    // console.log(result)
                    // your logic here , redirect to another page or show message etc
                },
                error: function() {

                }

            })

        })


        // clicklistener for request a new page
        $('#addPage').on('click', '#requestmypage', function(e) {
            e.preventDefault();
            var myPage = {
                page_name: $('#page_name').val(),
                purpose: $('#purpose').val()
            }
            // console.log(myPage);
            $.ajax({
                url: 'http://localhost:3001/v1/requestpage/',
                method: 'POST',
                dataType: 'json',
                headers: {
                    "Authorization": `bearer ${localStorage.getItem('token')}`
                },
                data: myPage,
                success: function(result) {
                    $('#addPage')[0].reset();
                    // console.log(result.message)
                    $('#message').html(result.message);
                    loadMyPages();
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
                    loadMyCampaign();
                    // console.log(result)
                    // your logic here , redirect to another page or show message etc
                },
                error: function() {

                }

            })

        })


        $('#campaignList').on('click', '#delete', function() {
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
                        loadMyCampaign();
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

function loadMyPages() {
    $.ajax({
        url: "http://localhost:3001/v1/findPages/",
        method: 'GET',
        dataType: 'json',
        headers: {
            "Authorization": `bearer ${localStorage.getItem('token')}`
        },
        success: function(result, status) {
            console.log(result);
            // result is sent from index.js as ajson file
            $('#mypageList').empty();
            for (key in result) {
                $('#mypageList').append('<tr ]\
      <th scope="row">1</th>\
      <td>' + result[key].id + '</td>\
      <td>' + result[key].page_name + '</td>\
      <td>' + result[key].page_username + '</td>\
      <td>' + result[key].status + '</td>\
      <td>' + result[key].purpose + '</td>\
    </tr>')
            }
        },
        error: function(jqXHR, status) {}
    })
}

function findMyPayments() {
    $.ajax({
        url: "http://localhost:3001/v1/findPayments/",
        method: 'GET',
        dataType: 'json',
        headers: {
            "Authorization": `bearer ${localStorage.getItem('token')}`
        },
        success: function(result, status) {
            console.log(result);
            // result is sent from index.js as ajson file
            $('#myPaymentList').empty();
            for (key in result) {
                $('#myPaymentList').append('<tr ]\
      <th scope="row">1</th>\
      <td>' + result[key].id + '</td>\
      <td>' + result[key].date + '</td>\
      <td>' + result[key].amount + '</td>\
      <td>' + result[key].method + '</td>\
      <td>' + result[key].description + '</td>\
    </tr>')
            }
        },
        error: function(jqXHR, status) {}
    })
}

function loadMyCampaign() {
    var chagedate=function(date){
        var temp=new Date(date)
        return temp.getFullYear()+"-"+(temp.getMonth()+1)+"-"+temp.getDay()
    }
    $.ajax({
        url: "http://localhost:3001/v1/campaign/",
        method: 'GET',
        dataType: 'json',
        headers: {
            "Authorization": `bearer ${localStorage.getItem('token')}`
        },
        success: function(result, status) {
            // console.log(result);
            // result is sent from index.js as ajson file
            $('#campaignList').empty();
            for (key in result) {
                $('#campaignList').append('<tr ]\
      <th scope="row">1</th>\
      <td>' + result[key].id + '</td>\
      <td>' + result[key].post_name + '</td>\
      <td>' + result[key].total_days + '</td>\
      <td>' + result[key].total_budget + '</td>\
      <td>' + result[key].status + '</td>\
      <td>' + chagedate(result[key].createdAt) + '</td>\
      <td>' + result[key].rate + '</td>\
      <td>' + result[key].dony_by + '</td>\
      <td><label campaignid="' + result[key].id + '" class="btn StopBoostingBtn" style="color: #20d4c4;" data-toggle="modal" data-target="#boostStop">Stop</label></td>\
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

function validateRealDate(element) {
    if(!element.value) return;
    let date = new Date(element.value);
    let minDate = new Date();
    minDate.setDate(minDate.getDate()-1);
    if(minDate.getTime() > date.getTime()+1) {
        $(element).val('');
    }
    console.log(minDate.getTime(), date.getTime());
}