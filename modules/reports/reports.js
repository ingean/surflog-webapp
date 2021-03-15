import { getReports } from "./getReports.js";

export function initReports() {
  bindUIActions()
  getReports()
}


function bindUIActions() {
  //Enable confirmation
  $(document).on('click','#btn-deleteReport', () =>{
    $('#btn-deleteReport').confirmation('show');
  });
}