import { updateCard } from './statsCard.js';

export function updateSMHICard(spot) {
  updateCard(spot, 'smhi', [
    {id: 'waveheight', caption: 'Bølgehøyde'}, 
    {id: 'waveheightmax', caption: 'Maks bølgehøyde'}, 
    {id: 'waveperiod', caption: 'Bølgeperiode'}, 
    {id: 'wavedir', caption: 'Bølgeretning'}]
  );
}