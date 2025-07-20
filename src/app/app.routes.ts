import { Routes } from '@angular/router';
import { FallingBlocksComponent } from './falling-blocks';



export const routes: Routes = [
  { path: '', component: FallingBlocksComponent },
  { path: '**', component: FallingBlocksComponent, pathMatch: 'full' }
]
