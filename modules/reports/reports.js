import { getReports } from "./getReports.js";

function bindUIActions() {
  //Enable confirmation
  $(document).on('click','#btn-deleteReport', () =>{
    $('#btn-deleteReport').confirmation('show');
  });
}

export function initReports() {
  bindUIActions()
  getReports()
}

