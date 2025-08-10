import { Component } from '@angular/core';
import { FallingBlocksComponent } from '../falling-blocks';
import { BlockData } from '../falling-blocks/falling-block.interfaces';

@Component({
  selector: 'app-home',
  imports: [FallingBlocksComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  public readonly blockData: BlockData[] = [
    { text: 'DEVELOPER', width: 0.8, linkText: 'PROJECTS', link: '/projects' },
    { text: 'STACK', width: 0.5, linkText: 'LINKEDIN', link: 'https://www.linkedin.com/in/alison-forster-a45681172' },
    { text: 'FULL', width: 0.4, linkText: 'ABOUT', link: '/about' },
    { text: 'FORSTER', width: 0.7, linkText: 'CONTACT', link: '/contact' },
    { text: 'ALISON', width: 0.6, linkText: 'RESUME', link: '/resume' }
  ];

}
