import { updateCard } from './statsCard.js';

export function updateDMICard(spot) {
  updateCard(spot, 'dmi', [
    {id: 'waveheight', caption: 'Bølgehøyde'}, 
    {id: 'waveperiod', caption: 'Bølgeperiode'}, 
    {id: 'swellheight', caption: 'Dønning'}, 
    {id: 'swellperiod', caption: 'Dønning, periode'}, 
    {id: 'wind', caption: 'Vind'}]
  );
}