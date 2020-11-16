function showError(error,title,descr,reference = '') {
  if(reference !='') {
    descr += ': ' + reference;
    title += ': ' + reference;
  }
  
  //For debugging
  console.log(descr);
  console.log(error.message);
  console.log(error.stack);

  //For user
  showAlert(title,'alert alert-danger','wrench')
}

function showAlert(text,type,icon) {
  $.notify({
      icon: 'glyphicon glyphicon-' + icon,
      message: text 
  },{
      type: type,
      placement: {
          from: "bottom",
          align: "right"
      }
  });
}