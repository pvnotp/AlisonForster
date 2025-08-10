import { Component } from '@angular/core';
import { BlockData } from '../falling-blocks/falling-block.interfaces';
import { FallingBlocksComponent } from '../falling-blocks';

@Component({
  selector: 'app-projects',
  imports: [FallingBlocksComponent],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css'
})
export class ProjectsComponent {
  public readonly alchemy: BlockData[] = [
    { text: 'ALCHEMY COACHING', width: 1.25, linkText: 'VISIT', link: 'https://alchemycoaching-gacve7fsgmarengw.eastus2-01.azurewebsites.net/' },
  ];

  public readonly alison: BlockData[] = [
    { text: 'THIS WEBSITE', width: 1, linkText: 'HOME', link: '/' },
  ];
}
