import { el, div, image } from '../components/elements.js'
import { inputLabel } from './formGroup.js'
import { post } from '../utils/api.js'
import { slForecastFromImage } from '../reports/create.js'
import { notify, Loader } from '../utils/logger.js'

export const formSuggestFromImg = (options) => {

  let fileInput = el('input', {
    type: 'file', 
    id: options.id,
    name: options.name,
    class: 'form-control',
    multiple: false
  })

  fileInput.addEventListener('change', onFileInputChange)
  
  let uploadBtn = el('button', {id:'forecast-image-btn margin-left', class: 'btn btn-success'}, 'Last opp bilde')
  uploadBtn.addEventListener('click', onUploadClick)
  
  return  div('form-input', 
    [
      div({id: 'forecast-image-preview-container'}),
      inputLabel(options.id, options.caption),
      div('flex-row center-v', [
        fileInput,
        uploadBtn,
        div({id: 'forecast-image-status'})
      ])
    ]
  )
}

const onFileInputChange = (event) => {
  const input = event.target
  const [file] = input.files
  if (file) {
    let src = URL.createObjectURL(file)
    let previewContainer = document.getElementById('forecast-image-preview-container')
    let preview = image(src, {id: 'forecast-image-preview', width: '550px'})
    previewContainer.appendChild(preview)
  }
}

const onUploadClick = async (event) => {
  event.preventDefault() // Prevent form from submitting automatically and invoking JQuery
  let btn = event.target

  if (btn.innerText == 'Last opp bilde') {
    let status = await uploadForecastImage()
    if (status) btn.innerText = 'Foreslå verdier'
  } else {
    convertForecastImageToText()
    if (status) btn.innerText = 'Last opp bilde'
  }
}

const uploadForecastImage = async () => {
  let data = new FormData()
  
  let date = document.getElementById('application-date').value
  data.append('reportdate', moment(date).format('YYYY-MM-DD'))

  let fileInput = document.getElementById('session-forecastimage')
  data.append('files', fileInput.files[0])
  
  let load = new Loader('#forecast-image-status')
  let r = await post('images', data)  
  load.stop()
  return true
}

const convertForecastImageToText = async () => {
  let image = document.getElementById('forecast-image-preview')
  
  let load = new Loader('#forecast-image-status')
  let result = await post('images', image.src)

  let suggestions = slForecastFromImage(result)
  if (!suggestions) {
    notify('Ikke mulig å hente ut forslag fra bilde av varsel', 'danger', 'image')
    return
  }

  suggestions.forEach(s => {
    if (s.value) {
      let input = document.getElementById(`session-${s.id}`)
      input.value = s.value
    }
  })

  load.stop()
  return true
}