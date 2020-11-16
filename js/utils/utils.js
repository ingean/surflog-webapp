function getObjInArray(key,value,array) {
  for (var i in array) {
      if (array[i][key] == value) { return array[i];}
  }
}

function jsonToArray(json, key) {
  return json.map(function (obj) {
    return obj[key];
  });  
}

function copyToClipboard(elementid) {
  const hiddenel = document.getElementById(elementid);
  const el = document.createElement('textarea');
  el.value = hiddenel.value;
  el.setAttribute('readonly', '');
  el.style.position = 'absolute';
  el.style.left = '-9999px';
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
  showAlert('Score-rapport kopiert til utklippstavlen','success','copy');
}