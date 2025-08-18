import { Component } from '@angular/core';
import { BlockData } from '../falling-blocks/falling-block.interfaces';
import { FallingBlocksComponent } from '../falling-blocks';

@Component({
  selector: 'app-projects',
  imports: [FallingBlocksComponent],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css',
  standalone: true,
})
export class ProjectsComponent {
  public readonly alchemy: BlockData[] = [
    { text: 'COACHING', width: 0.8, linkText: 'GITHUB', link: 'https://github.com/pvnotp/AlchemyCoaching' },
    { text: 'ALCHEMY', width: 0.7, linkText: 'VISIT', link: 'https://alchemycoaching-gacve7fsgmarengw.eastus2-01.azurewebsites.net/' },
  ];

  public readonly alison: BlockData[] = [
    { text: 'WEBSITE', width: 0.6, linkText: 'GITHUB', link: 'https://github.com/pvnotp/AlisonForster' },
    { text: 'THIS', width: 0.4, linkText: 'HOME', link: '/' },
  ];

  public readonly geocities: BlockData[] = [
    { text: 'TIMES', width: 0.5, linkText: 'GITHUB', link: 'https://github.com/pvnotp/GeocitiesTimes'},
    { text: 'GEOCITIES', width: 0.8, linkText: 'VISIT', link: 'https://geocitiestimes-h2daaffnehapbhav.eastus2-01.azurewebsites.net/' },
    { text: 'THE', width: 0.3 },
  ];
}
