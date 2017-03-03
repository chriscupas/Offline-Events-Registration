process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
var ActiveDirectory = require('activedirectory');
var util = require('util')
var fs = require('fs')
var async = require('async')

var obj = {dev: "/config.json", prod: "/config_prod.json"};
var configs = {};
var n = require('nonce')();


async.forEachOf(obj, function (value, key, callback) {
  fs.readFile(__dirname + value, "utf8", function (err, data) {
    if (err) return callback(err);
    try {
      configs[key] = JSON.parse(data);
    } catch (e) {
      return callback(e);
    }
    callback();
  })
}, function (err) {
  if (err) console.error(err.message);
})

db = {};
var Datastore = require('nedb');
db.events = new Datastore({ filename: 'db/data.json', autoload: true });
db.scanbcode = new Datastore({ filename: 'db/attendance.json', autoload: true });
db.settings = new Datastore({ filename: 'conf/config.json', autoload: true });

var date = new Date();
var components = [

    date.getYear(),
    date.getMonth(),
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
    date.getSeconds(),
    date.getMilliseconds()
];

var id = components.join("");

var length = 13;
var trimmedString = id.substring(0, length);
if(trimmedString.length <= 12) {
  trimmedString += "0";
}
var d = new Date();

$("input[name='euser_barcode']").val(trimmedString);

 $(document).ready( function($){  
    var em_booking_doing_ajax = false;
    $('#em-booking-form').addClass('em-booking-form'); //backward compatability

    $("#user_idtype_others").hide();

    $("#user_idtype").change(function() {
      if( $(this).val() == "others" ) {
        $("#user_idtype_others").show().val('');
        $('#euser_idnum').val("");
      }else if($(this).val() == "iqama"){
        $('#euser_idnum').val("");
        $("#user_idtype_others").hide();
      }else if($(this).val() == "passport"){
        $('#euser_idnum').val("");
        $("#user_idtype_others").hide();
      }else if($(this).val() == "saudi_id"){
        $('#euser_idnum').val("");
        $("#user_idtype_others").hide();
      } else {
        $("#user_idtype_others").hide();
      }
      
    });

$(document).on('submit', '#scan_barcode', function(e){
  e.preventDefault();
  var em_booking_form = $(this);  
  var bcode = $("#att_barcode");
  $(".em-booking-message-error, .em-booking-message-success").remove();

  if( bcode.val() == "" ) {
    $('<div class="em-booking-message-error em-booking-message">Empty Input</div>').insertBefore(em_booking_form);    
    $('html, body').animate({scrollTop : 60},800);
  } else {
    db.scanbcode.find({ euser_barcode: bcode.val()}, function (err, docs) {
      // Update attendance to scan barcode DB
      if(docs.length > 0 ) {
        db.scanbcode.update({ euser_barcode: bcode.val() }, { $push: { attendance: d.toLocaleString() } }, {}, function (err) {
          if(err == null) {
                $('<div class="em-booking-message-success em-booking-message">Attendance updated.</div>').insertBefore(em_booking_form);              
          } else {
                $('<div class="em-booking-message-error em-booking-message">Error found</div>').insertBefore(em_booking_form);    
          }

          $('html, body').animate({scrollTop : 60},800);
        });
      } else {
        db.events.find({ euser_barcode: bcode.val()}, function (err, docs) {
          // Insert to scan barcode DB if we dont find any data from it
          if(docs.length > 0 ) {
            var doc = { euser_barcode: bcode.val(), attendance: [ d.toLocaleString() ]};

            db.scanbcode.insert(doc, function (err) {
              if(err == null) {
                $('<div class="em-booking-message-success em-booking-message">Attendance recorded.</div>').insertBefore(em_booking_form);    
              } else {
                $('<div class="em-booking-message-error em-booking-message">Error found</div>').insertBefore(em_booking_form);    
              }         
            });
          } else {
            $('<div class="em-booking-message-error em-booking-message">Cannot find from database.</div>').insertBefore(em_booking_form);    
          }
          
          $('html, body').animate({scrollTop : 60},800);
        });
      }
    });
  }

  return false;
});

$(document).on('submit', '.em-booking-form', function(e){
  e.preventDefault();
  var $email = $("#euser_email");
  db.events.loadDatabase(function (err) {

  if(err) {
    alert(err);
    return false;
  }

  db.events.find({ euser_email: $email.val()}, function (err, docs) {
      var errors = "";
      $(".em-booking-message-error, .em-booking-message-success").remove();

      if( $("input[name='euser_barcode']").val() == "" ) {
        alert("Barcode is not loaded. Page will be reloaded.");
        window.location.reload();
        return false;
      }

      if( $("#event_id").val() == "" ) {
        errors += "<strong>ERROR</strong>: Please enter Event ID <br />";
      }
      if( $("#euser_idnum").val() == "" ) {
        errors += "<strong>ERROR</strong>: Please enter ID number <br />";
      }
      if( $("#dbem_phone").val() == "" )  {
        errors += "<strong>ERROR</strong>: Please enter a Phone Number. <br />";
      }

      
      var re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

      if( $email.val() == '' || !re.test($email.val()) )  {
        errors += "<strong>ERROR</strong>: Please enter a valid e-mail address. <br />";
      }     
      if(docs.length) {
        errors += "<strong>ERROR</strong>: Duplicate email entry. <br />";
      }
     
      if( errors == "" ) {
          var added_buttons = '<div class="em-booking-buttons">' + 
                              '<input type="button" class="em-booking-submit btn" value="New Booking" onclick="javascript: window.location.reload();">'+ '</div>';

          $('<div class="em-booking-message-success em-booking-message">Successfully Registered</div>' +  added_buttons).insertBefore($('.em-booking-form'));
            $('.em-booking-form').hide();
          $(".em-booking-submit").hide();
          $(".box-footer").append(added_buttons);

          db.events.insert([$('.em-booking-form').jsonify()], function (err) {});

          db.events.loadDatabase(function (err) {
            db.events.find({}, function (err, docs) { });
          });

      } else {
        $('<div class="em-booking-message-error em-booking-message">'+errors+'</div>').insertBefore($('.em-booking-form'));
        $('html, body').animate({scrollTop : 60},800);
      }

      return false;

  });
  });
});

//change category
$('#user_field_work').change(function() {
  var val = $(this).find("option:selected").text().toLowerCase();
  
  if( val.indexOf("tvtc") >= 0 ){
    var valIDType = $('#user_idtype').append('<option selected=\"selected\" value=\"emp_id\">Employee ID</option>');
    $('#p_user_address, #p_user_nationality, #p_user_gender, #p_user_company, #p_user_job_title,.others').hide();
    $('#p_department_no').show();
    $('.user_idnum_keyp').focus();
    $('#user_idtype').attr('disabled',true);
    $('#user_idtype').val( valIDType.val() );
    $('#euser_name,#euser_email,#euser_department_no').attr('readonly',true).val("");
    $('.user_phone_country_code').val('966');
    $('.user_idnum_keyp,#dbem_phone,#euser_job_title,#euser_department_no').val('');

        
  }else{
    $("#user_idtype option[value='emp_id']").remove();
    var valIDType = $('#user_idtype option').eq(0).val();
    $('#p_user_address, #p_user_phone_country_code,#p_user_phone_country_code,#p_user_nationality,#p_user_gender,#p_user_company,#p_user_job_title,.others').show();
    $('#p_department_no').hide();
    $('#user_idtype').attr('disabled',false);
    $('#user_idtype').val(valIDType);
    $('#euser_name').focus();
    $('#euser_name,#euser_email,#p_department_no').attr('readonly',false).val("");
    $('#euser_idnum,#dbem_phone,#euser_address,#euser_job_title').val("");
    $('.user_phone_country_code').val('966');

  } 
});

$(document).ready(function(){
  // $('#p_user_pass').hide();
  $('#p_department_no').hide();
  $("div#login_form_book").removeClass("login_form_book");
  
  
  $( "#gallery_tabs" ).insertBefore( "#em-booking" );


});


$('#euser_idnum').keyup(function(){
  var selectIDType = $('#user_idtype').val();
  var idnum = $('#euser_idnum').val();
  var em_booking_form = $(".em-booking-form");

  limitText(this, 7)
  $('#loaderImg').show();
  $(".em-booking-message-error").remove();

  if(selectIDType === 'emp_id') {

  var ad = new ActiveDirectory(configs['dev']);
  var query = 'employeeid=' + idnum;
  
  ad.findUsers(query, true, function(err, users) {
    if (err) {
      $('<div class="em-booking-message-error em-booking-message">ERROR: ' +JSON.stringify(err) + '</div>').insertBefore(em_booking_form);
      return;
    }
   
    if ((! users) || (users.length == 0)) {
        $('<div class="em-booking-message-error em-booking-message">Invalid ID number.</div>').insertBefore(em_booking_form);
        $('#euser_name, #euser_email,#dbem_phone').val("");
        $('#loaderImg').hide(); 
        return false;      
    } else {
      var dept_number, Umail, username;
      
      $.each(users, function( index, value ) {
          dept_number = value.departmentNumber;
          Umail = value.mail;
          username = value.sAMAccountName;
      });

      $('#errs').html('');
      $('#euser_name').val(username);
      $('#euser_email').val(Umail);
      $('#euser_department_no').val(dept_number);
      
      $('#loaderImg').hide();

    }
  });


  }
   return false;
});

//limit the field
function limitText(field, maxChar){
    var ref = $(field),
        val = ref.val();
    if ( val.length >= maxChar ){
        ref.val(function() {
            return val.substr(0, maxChar);       
        });
    }
}

// number only Phone
$('#dbem_phone').keypress(function(evt){
  evt = (evt) ? evt : window.event;
  var charCode = (evt.which) ? evt.which : evt.keyCode;

  if(this.value.length == 0 && charCode == 48){
    $('#ers').html('No leading zeroes!').css('display','block');
    return false;
  }else if(charCode > 31 && (charCode < 48 || charCode > 57)) {
    $('#ers').html('Please input number only.').css('display','block');
    return false;
  }
  
  $('#ers').html('');
  
  return true;
});
});

$('body').show();
NProgress.start();


jQuery(window).load(function () {
    NProgress.done(); $('.has').removeClass('out');
    NProgress.remove();
});
 
const shell = require('electron').shell;

$(document).on('click', 'a[href^="http"]', function(event) {
    event.preventDefault();
    shell.openExternal(this.href);
}); 
