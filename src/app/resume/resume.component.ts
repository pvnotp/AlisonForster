import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-resume',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resume.component.html',
  styleUrls: ['./resume.component.scss']
})
export class ResumeComponent {
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
