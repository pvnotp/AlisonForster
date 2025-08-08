import { Routes } from '@angular/router';
import { FallingBlocksComponent } from './falling-blocks/falling-blocks.component';
import { ResumeComponent } from './resume/resume.component';



export const routes: Routes = [
  { path: 'resume', component: ResumeComponent },
  { path: '', component: FallingBlocksComponent },
  { path: '**', component: FallingBlocksComponent, pathMatch: 'full' }
]
