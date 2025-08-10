import { Routes } from '@angular/router';
import { FallingBlocksComponent } from './falling-blocks/falling-blocks.component';
import { ResumeComponent } from './resume/resume.component';
import { HomeComponent } from './home/home.component';
import { ContactComponent } from './contact/contact.component';
import { AboutComponent } from './about/about.component';
import { ProjectsComponent } from './projects/projects.component';



export const routes: Routes = [
  { path: 'resume', component: ResumeComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'about', component: AboutComponent },
  { path: 'projects', component: ProjectsComponent },
  { path: '', component: HomeComponent },
  { path: '**', component: FallingBlocksComponent, pathMatch: 'full' }
]
