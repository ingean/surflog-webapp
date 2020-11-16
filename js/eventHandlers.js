$(function() {   
  //Collapsable panels
  $(document).on('click', '.panel-heading span.collapsable', function(e){
      var $this = $(this);
      if(!$this.hasClass('panel-collapsed')) {
          $this.parents('.panel').find('.panel-body-fluid').slideUp();
          $this.addClass('panel-collapsed');
          $this.find('i').removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');
      } else {
          $this.parents('.panel').find('.panel-body-fluid').slideDown();
          $this.removeClass('panel-collapsed');
          $this.find('i').removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up');
      }
  })

  //Enable confirmation
  $(document).on('click','#btn-deleteReport', function(){
      $('#btn-deleteReport').confirmation('show');
  });

  //Enable popover on profile pict
  $('[data-toggle=popover]').popover({
      trigger: 'focus',
      html: true,
      title: 'Logget inn som'
  })

  //Intitalize datepicker
  $('#datepicker').datepicker({
      showOn: "button",
      dateFormat: "dd/mm/yy",
      buttonImage: "images/calendar_white_25.png",
      buttonImageOnly: true,
      buttonText: "Velg dato",
      onSelect: function(dateText, inst) {
      dateSelected($(this).datepicker('getDate'));
  }}) 

  //Set click event for dropdowns
  $(document).on('click','li a', function(){
      $(this).parents(".dropdown").find('.btn').html($(this).text() + ' <span class="caret"></span>');
      $(this).parents(".dropdown").find('.btn').val($(this).data('value'));
  })

  //Set click event for radio buttons
  $(document).on('click', '#radioBtn a', function(){
      var sel = $(this).data('title');
      var tog = $(this).data('toggle');
      $('#'+tog).prop('value', sel);
      
      $('a[data-toggle="'+tog+'"]').not('[data-title="'+sel+'"]').removeClass('Active').addClass('notActive');
      $('a[data-toggle="'+tog+'"][data-title="'+sel+'"]').removeClass('notActive').addClass('Active');
  })

  //Submit session form
  $(document).on('click','#button-submit-session', function(e){
    e.preventDefault();
    submitSession()
  });

  $(document).on('click','div.setup-panel div a', function (e) {
      e.preventDefault();
      var $target = $($(this).attr('href')),
              $item = $(this);

      if (!$item.hasClass('disabled')) {
          $('div.setup-panel div a').removeClass('btn-primary').addClass('btn-default');
          $item.addClass('btn-primary');
          $('.setup-content').hide();
          $target.show();
          $target.find('input:eq(0)').focus();
      }
  });

  $(document).on('click','.nextBtn',function(){
      var curStep = $(this).closest(".setup-content"),
      curStepBtn = curStep.attr("id"),
      nextStepWizard = $('div.setup-panel div a[href="#' + curStepBtn + '"]').parent().next().children("a"),
      curInputs = curStep.find("input[type='text'],input[type='url']"),
      isValid = true;

      $(".form-group").removeClass("has-error");
      for(var i=0; i<curInputs.length; i++){
          if (!curInputs[i].validity.valid){
              isValid = false;
              $(curInputs[i]).closest(".form-group").addClass("has-error");
          }
      }

      if (isValid)
          nextStepWizard.removeAttr('disabled').trigger('click');
  });
});
