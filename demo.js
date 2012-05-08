$(function() {
  $('#button').click(start);

  $('#buybg, #close, #closebutton').click(function() {
    $('#buyflow').fadeOut('fast', function() {
      $('#frame').hide();
    });
  });

  $('#cardchange').click(function() {

    
    slideToggle();
  });

  $('#buybutton').click(handleBuy);

  $('.instrument_list li').click(function() {
    if ($(this).attr("class") == "expired") return;
    $('.instrument_list li').removeClass('card_line_selected');
    $(this).addClass('card_line_selected');
    updateCardThumb($(this));
    setTimeout(slideIn, 250);
  });
  
  $('.addcardbutton').click(function() {
    open('addinstrument.html', 'addinstrument',
         'resizable=yes, scrollbars=yes, status=no, width=579, height=468');
  });

  $('#loginbutton').click(function() {
    open('login.html', 'login',
         'resizable=yes, scrollbars=yes, status=no, width=577, height=439');
  });
  
  setTimeout(start, 500);
});

function updateCardThumb(card) {
  $('#cardchange').html("<img src='images/cc_" + card.attr("card_type") + ".png'> ***-" + card.attr("card_num") + " <img id='cardarrow' src='images/disclosure_arrow_dk_grey.png' />");
  $('#cardchange').attr('card_type', card.attr('card_type'));
  $('#cardchange').attr('card_num', card.attr('card_num'));
}

function start () {
  $('#buyflow').fadeIn('fast', function() {
    $('#loading').fadeIn('fast', function() {
      $('#loader').prependTo('#loading h3');
      var ai = new ActivityIndicator();
      ai.start();
      setTimeout(function() {
        ai.stop();
        $('#loading').fadeOut();
        showFrame();
      }, 0/*2500*/);
    });
  });
}

function showFrame() {
  var state = $('input:radio[name=state]:checked').val();
  var items = $('input:radio[name=items]:checked').val();
  slideIn();
  $('#email').hide();
  $('#notlogged').hide();
  $('#newuser').hide();
  $('#cardchange').hide();
  $('#showinstruments_one').hide();
  $('#showinstruments_multi').hide();
  $('#receipt').hide();
  $('#closebutton').hide();
  $('#basepanel').show();
  $('#multi_instrument_list').empty();

  if (items == 'multi_line') {
    $('#subtotal_price').text('$5,024.85');
    $('#taxes_price').text('$401.99');
    $('#total_price').text('$5,426.84');
  } else if (items == 'single_quantity') {
    $('#subtotal_price').text('$1.99');
    $('#taxes_price').text('$0.00');
    $('#total_price').text('$1.99');
  } else if (items == 'single_quantity_tax') {
    $('#subtotal_price').text('$1.99');
    $('#taxes_price').text('$0.10');
    $('#total_price').text('$2.09');
  } else if (items == 'multi_quantity') {
    $('#subtotal_price').text('$7.96');
    $('#taxes_price').text('$0.64');
    $('#total_price').text('$8.60');
  }
  
  if ($('#total_price').text() == $('#subtotal_price').text()) {
    $('#summary_items').hide();
    $('#taxes_label').hide();
    $('#taxes_price').hide();
  } else {
    $('#summary_items').show();
    $('#taxes_label').show();
    $('#taxes_price').show();
  }
  
  if (items == 'multi_line') {
    $('#iteminfo_multi').show();
    $('#iteminfo_one').hide();
    $('#iteminfo_quantity').hide();
  } else if (items == 'multi_quantity') {
    $('#iteminfo_one').hide();
    $('#iteminfo_quantity').show();
    $('#iteminfo_multi').hide();
  } else {
    $('#iteminfo_one').show();
    $('#iteminfo_quantity').hide();
    $('#iteminfo_multi').hide();
  }

  if (state == 'notlogged') {
    $('#notlogged').show();
    showButton('loginbutton');
    slideOut();
  } else {
    showButton('buybutton');
  }
  if (state == 'newuser') {
    $('#newuser').show();
    $('#buybutton').addClass('disabled');
    slideOut();
  }
  if (state == 'logged_multi') {
    $('#cardchange').show();
    showButton('buybutton');
    var cloned = $('#big_list').clone(true);
    $('#multi_instrument_list').append(cloned);
    cloned.show();
    $('#showinstruments_multi').show();
  } else {
    var cloned = $('#small_list').clone(true);
    $('#multi_instrument_list').append(cloned);
    cloned.show();
  }
  if (state == 'logged_one') {
    $('#cardchange').show();
    showButton('buybutton');
    $('#showinstruments_one').show();
  }
  $('#frame').fadeIn();
}

function slideToggle() {
  if ($('#slider').is(':visible')) slideIn();
  else slideOut();
}

function slideIn() {
  $('#cardarrow').attr('src', 'images/disclosure_arrow_dk_grey.png');
  $('#cardchange').removeClass('active');
  $('#slider').slideUp();
}
function slideOut() {
  $('#cardarrow').attr('src', 'images/disclosure_arrow_dk_grey_down.png');
  $('#cardchange').addClass('active');
  $('#slider').slideDown();
}

function showButton(button) {
  $('.bigbutton').hide();
  $('#' + button).show();
}

function handleBuy() {
  slideIn();
  $('#cardchange').hide();
  showButton('none');
  $('#basepanel').hide();
  
  $('#progress').slideDown('fast', function() {
    $('#loader').prependTo('#progress div')
    var ai = new ActivityIndicator();
    ai.start();
    setTimeout(function() {
      ai.stop();
      $('#progress').hide();
      $('#receipt_total').text($('#total_price').text());
      $('#receipt_seller').text('Rovio Mobile Gaming, Inc.');
      var card_type = $('#cardchange').attr('card_type');
      var card_type_name = "Card";
      switch (card_type) {
        case 'visa':
          card_type_name = "Visa";
          break;
        case 'master':
          card_type_name = "MC";
          break;
        case 'discover':
          card_type_name = "Disc";
          break;
        case 'amex':
          card_type_name = "AmEx";
          break;
        default:
          break;
      }
      $('#receipt_instrument').html((card_type_name != "Card" ? "<img src='images/cc_" + card_type + ".png'>" : "") + "<span class='card_type_name'>" + card_type_name + ' ***-' + $('#cardchange').attr('card_num') + "</span>");
      $('#receipt_date').text('Apr 30, 2012');
      $('#closebutton').show();
      $('#receipt').slideDown();
    }, 5000);
  })
}

function addInstrumentDone() {
  if ($('#showinstruments_one').is(':visible')) {
    scrollTo($('#showinstruments_one'), $('#showinstruments_multi'), function() { appendInstrument(false); });
  } else if ($('#newuser').is(':visible')) {
    scrollTo($('#newuser'), $('#showinstruments_one'));
    $('#buybutton').removeClass('disabled');
    $('#cardchange').show();
  } else {
    appendInstrument(true);
  }
}

function appendInstrument(is_multi) {
  var cloned = $('#clone_visa').clone(true);
  cloned.attr('id', '');

  var card_num = Math.floor(Math.random() * 8999) + 1000;
  var exp_mon = Math.floor(Math.random() * 11) + 1;
  if (exp_mon < 10) exp_mon = '0' + exp_mon;
  var exp_year = Math.floor(Math.random() * 5) + 13;
  var card_type = 'visa';
  switch (Math.floor(Math.random() * 4)) {
    case 0:
      card_type = 'visa';
      break;
    case 1:
      card_type = 'master';
      break;
    case 2:
      card_type = 'amex';
      break;
    case 3:
      card_type = 'discover';
      break;
    default:
      break;
  }

  cloned.attr('card_num', card_num);
  cloned.attr('card_type', card_type);
  cloned.children('.card_details').text('***-' + card_num);
  cloned.children('.card_expire').text(' (expires ' + exp_mon + '/' + exp_year + ')');
  cloned.children('.card_image').html("<img src='images/cc_" + card_type + ".png' />");

  $('#multi_instrument_list ul').prepend(cloned);
  $('.instrument_list li').removeClass('card_line_selected');
  cloned.addClass('card_line_selected');
  updateCardThumb(cloned);
  cloned.hide();
  cloned.slideDown(400, function() {
    $('#multi_instrument_list').scrollTop(0);
    if (is_multi == true) {
      setTimeout(slideIn, 1000);
    }
  });
}

function loginDone() {
  showButton('buybutton');
  $('#buybutton').addClass('disabled');
  scrollTo($('#notlogged'), $('#newuser'));
}

function scrollTo(current, target, callback) {
  var slider = $('#slider');
  var curHeight = current.outerHeight();
  var targetHeight = target.outerHeight();
  
  function showTarget() {
    current.height(targetHeight > curHeight ? targetHeight : curHeight);
    target.show();
    slider.animate({
      scrollTop: target.offset().top - slider.offset().top + slider.scrollTop() - 15
    }, 500, function () {
      current.hide();
      slider.css('height', 'auto');
      if (callback) callback();
    });
  }

  slider.animate({
    height: targetHeight > curHeight ? targetHeight : curHeight
  }, 500, showTarget);
}
