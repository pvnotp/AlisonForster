import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FallingBlocksComponent } from '../falling-blocks';
import { BlockData } from '../falling-blocks/falling-block.interfaces';

@Component({
  selector: 'app-resume',
  standalone: true,
  imports: [CommonModule, FallingBlocksComponent],
  templateUrl: './resume.component.html',
  styleUrls: ['./resume.component.scss']
})
export class ResumeComponent {

  public readonly resumeBlock: BlockData[] = [

    { text: 'RESUME', width: 0.8, linkText: 'PDF', link: 'assets/AlisonForsterResume.pdf' },
    { text: '', width: 1, linkText: '', link: '' },
    { text: 'FORSTER', width: 0.8, linkText: '', link: '' },
    { text: 'ALISON', width: 0.6, linkText: '', link: '' },
  ];

  languages: string[] = [
    'C#', '.NET', 'ASP.NET', 'Angular', 'TypeScript', 'JavaScript', 'Entity Framework',
    'SQL', 'HTML', 'CSS'
  ];

  architectures: string[] = [
    'REST', 'Service-Oriented Architecture (SOA)', 'Event-Driven Architecture', 'Test Driven Development (TDD)', 'N-Tier Architecture', 'MVC'
  ];


  tools: string[] = [
    'Git', 'Bitbucket', 'Agile', 'Visual Studio', 'Rider', 'JIRA'
  ];


  downloadResume() {
    const pdfUrl = 'assets/AlisonForsterResume.pdf';
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = 'AlisonForsterResume.pdf';
    link.click();
  }
}
