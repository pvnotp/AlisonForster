import { Component } from '@angular/core';
import { FallingBlocksComponent } from '../falling-blocks/falling-blocks.component';

@Component({
  selector: 'app-landing-page',
  imports: [FallingBlocksComponent],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css'
})
export class LandingPageComponent {

}
