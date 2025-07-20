import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit, HostListener, ChangeDetectorRef } from '@angular/core';

interface BlockData {
  text: string;
  width: number;
  linkText: string;
  link: string;
}

interface LandedBlockInfo {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ResponsiveDimensions {
  containerWidth: number;
  containerHeight: number;
  blockHeight: number;
  fontSize: number;
  padding: number;
  margin: number;
}

@Component({
  selector: 'app-falling-blocks',
  templateUrl: './falling-blocks.component.html',
  styleUrl: './falling-blocks.component.css'
})
export class FallingBlocksComponent implements OnDestroy, AfterViewInit {
  @ViewChild('container', { static: true }) containerRef!: ElementRef<HTMLDivElement>;

  private blocks: FallingBlock[] = [];
  private landedBlocks: LandedBlockInfo[] = [];
  private animationId: number | null = null;
  private currentBlockIndex = 0;
  private blockReleaseTimer = 0;
  private readonly blockReleaseInterval = 30;

  public isAnimating = false;
  public dimensions: ResponsiveDimensions = {
    containerWidth: 500,
    containerHeight: 600,
    blockHeight: 54,
    fontSize: 54,
    padding: 15,
    margin: 10
  };

  private readonly blockData: BlockData[] = [
    { text: 'DEVELOPER', width: 0.9, linkText: 'PROJECTS', link: '/projects' }, // Will be multiplied by container width
    { text: 'STACK', width: 0.5, linkText: 'RESUME', link: '/resume' },
    { text: 'FULL', width: 0.4, linkText: 'BIO', link: '/bio' },
    { text: 'FORSTER', width: 0.64, linkText: 'LINKEDIN', link: 'www.linkedin.com/in/alison-forster-a45681172' },
    { text: 'ALISON', width: 0.64, linkText: 'CONTACT', link: '/contact' }
  ];


  constructor(private cdr: ChangeDetectorRef) { }

  ngAfterViewInit(): void {
    this.calculateDimensions();

    const container = this.containerRef.nativeElement;
    container.style.width = this.dimensions.containerWidth + 'px';
    container.style.height = (this.dimensions.containerHeight + 300) + 'px';
    container.style.position = 'fixed';
    container.style.bottom = '0';
    container.style.left = '10%';

    this.cdr.detectChanges();
    this.start();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    console.log("resize");
    this.reset();
    this.calculateDimensions();
    const container = this.containerRef.nativeElement;
    container.style.width = this.dimensions.containerWidth + 'px';
    container.style.height = (this.dimensions.containerHeight + 300) + 'px';
    container.style.position = 'fixed';
    container.style.bottom = '0';
    container.style.left = '10%';

    this.cdr.detectChanges();
    this.start();
  }

  private calculateDimensions(): void {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Container takes up most of the viewport but leaves some margin
    const containerWidth = Math.min(viewportWidth * 0.9, viewportHeight);
    const containerHeight = viewportHeight;

    // Scale everything based on container size
    const scale = containerWidth / 500; // 500 was our original container width

    this.dimensions = {
      containerWidth: containerWidth,
      containerHeight: containerHeight,
      blockHeight: 54 * scale,
      fontSize: 54 * scale,
      padding: 15 * scale,
      margin: 10 * scale
    };
  }

  ngOnDestroy(): void {
    this.cleanup();
  }

  start(): void {
    if (this.animationId) return;

    console.log('Starting animation...');
    this.isAnimating = true;
    this.animate();
  }

  reset(): void {
    this.cleanup();

    // Remove all block elements
    const allElements = this.containerRef.nativeElement.querySelectorAll('.block');
    allElements.forEach(element => {
      element.remove();
    });

    this.blocks = [];
    this.landedBlocks = [];
    this.currentBlockIndex = 0;
    this.blockReleaseTimer = 0;
    this.isAnimating = false;
  }

  private cleanup(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  private animate(): void {
    // Release new blocks at intervals
    if (this.currentBlockIndex < 5) {
      if (this.blockReleaseTimer % this.blockReleaseInterval === 0) {
        console.log(`Creating block ${this.currentBlockIndex}`);
        const block = new FallingBlock(
          this.containerRef.nativeElement,
          this.currentBlockIndex,
          this.landedBlocks,
          this.blockData,
          this.dimensions
        );
        this.blocks.push(block);
        this.currentBlockIndex++;
      }
      this.blockReleaseTimer++;
    }

    // Update all blocks
    let allLanded = true;
    this.blocks.forEach(block => {
      block.update();
      if (!block.isLanded) allLanded = false;
    });

    // Continue animation if not all blocks are landed or we haven't released all blocks
    if (!allLanded || this.currentBlockIndex < 5) {
      this.animationId = requestAnimationFrame(() => this.animate());
    } else {
      this.animationId = null;
      this.isAnimating = false;
      console.log('Animation complete');
    }
  }
}

class FallingBlock {
  private element: HTMLDivElement | null = null;
  private x = 0;
  private y = 0;
  private rotation = 0;
  public isLanded = false;
  private velocity = 0;
  private readonly gravity = 0.5;
  private width = 320;
  private height = 84;
  private isHovering = false;

  constructor(
    private container: HTMLElement,
    private index: number,
    private landedBlocks: LandedBlockInfo[],
    private blockData: BlockData[],
    private dimensions: ResponsiveDimensions,
    private linkElement: HTMLElement | null = null
  ) {
    this.height = this.dimensions.blockHeight + (this.dimensions.padding * 2);

    // Smaller initial rotation for clearer observation
    const baseAngle = 10 + Math.random() * 20; // 10 to 30 degrees
    this.rotation = Math.random() < 0.5 ? baseAngle : -baseAngle;

    this.create();
  }

  private create(): void {
    this.element = document.createElement('div');
    this.element.className = 'block';

    // Apply responsive styles programmatically
    this.element.style.position = 'absolute';
    this.element.style.height = this.dimensions.blockHeight + 'px';
    this.element.style.background = 'white';
    this.element.style.transformOrigin = 'center center';
    this.element.style.transition = 'none';
    this.element.style.display = 'flex';
    this.element.style.alignItems = 'center';
    this.element.style.justifyContent = 'center';
    this.element.style.fontFamily = 'Arial, sans-serif';
    this.element.style.fontSize = this.dimensions.fontSize + 'px';
    this.element.style.fontWeight = 'bold';
    this.element.style.color = 'black';
    this.element.style.padding = this.dimensions.padding + 'px 0';
    this.element.style.boxSizing = 'border-box';
    this.element.style.zIndex = '10';

    const data = this.blockData[this.index % this.blockData.length];
    this.width = data.width * this.dimensions.containerWidth;

    this.element.style.width = this.width + 'px';
    this.element.style.height = this.height + 'px';
    this.element.textContent = data.text;

    this.element.addEventListener('mouseenter', () => {
      this.isHovering = true;
      this.showLink(data.linkText, data.link)
    });
    this.element.addEventListener('mouseleave', () => {
      this.isHovering = false;
      // Small delay to allow moving to link element
      setTimeout(() => {
        if (!this.isHovering) {
          this.hideLink();
        }
      }, 50);
    });

    const containerWidth = this.dimensions.containerWidth * 0.96; // Leave some margin
    const maxX = containerWidth - this.width;
    this.x = maxX / 2 + Math.random() * (this.dimensions.containerWidth * 0.08) - (this.dimensions.containerWidth * 0.04);
    this.y = -100 - (this.index * 50);

    this.updatePosition();
    this.container.appendChild(this.element);
  }

  private updatePosition(): void {
    if (!this.element) return;

    this.element.style.left = this.x + 'px';
    this.element.style.top = this.y + 'px';
    this.element.style.transform = `rotate(${this.rotation}deg)`;
  }

  private getBottomCornerY(): number {
    const radians = (this.rotation * Math.PI) / 180;
    const cos = Math.cos(radians);
    const sin = Math.sin(radians);

    const halfWidth = this.width / 2;
    const halfHeight = this.height / 2;

    const corners = [
      { x: -halfWidth, y: -halfHeight },
      { x: halfWidth, y: -halfHeight },
      { x: halfWidth, y: halfHeight },
      { x: -halfWidth, y: halfHeight }
    ];

    let lowestY = -Infinity;
    corners.forEach(corner => {
      const rotatedY = corner.x * sin + corner.y * cos;
      lowestY = Math.max(lowestY, rotatedY);
    });

    return this.y + lowestY;
  }

  private getLandingY(): number {
    const containerHeight = this.container.offsetHeight;
    let landingY = containerHeight - this.height - this.dimensions.margin;

    for (let block of this.landedBlocks) {
      const blockRight = block.x + block.width;
      const blockLeft = block.x;
      const thisRight = this.x + this.width;
      const thisLeft = this.x;

      if (!(thisRight < blockLeft || thisLeft > blockRight)) {
        const potentialY = block.y - this.height - this.dimensions.margin;
        if (potentialY < landingY) {
          landingY = potentialY;
        }
      }
    }

    return landingY;
  }

  update(): void {
    if (this.isLanded || !this.element) return;

    this.velocity += this.gravity;
    this.y += this.velocity;

    const bottomY = this.getBottomCornerY();
    const landingY = this.getLandingY();

    if (bottomY >= landingY) {
      const radians = (this.rotation * Math.PI) / 180;
      const cos = Math.cos(radians);
      const sin = Math.sin(radians);

      const halfWidth = this.width / 2;
      const halfHeight = this.height / 2;

      const corners = [
        { x: -halfWidth, y: -halfHeight },
        { x: halfWidth, y: -halfHeight },
        { x: halfWidth, y: halfHeight },
        { x: -halfWidth, y: halfHeight }
      ];

      // Find the lowest corner in world coordinates
      let lowestCorner = { worldX: 0, worldY: -Infinity, localX: 0, localY: 0 };
      corners.forEach(corner => {
        const worldX = this.x + (corner.x * cos - corner.y * sin);
        const worldY = this.y + (corner.x * sin + corner.y * cos);
        if (worldY > lowestCorner.worldY) {
          lowestCorner = {
            worldX: worldX,
            worldY: worldY,
            localX: corner.x,
            localY: corner.y
          };
        }
      });

      // Calculate where the center should be when the block is flat
      const finalCenterX = lowestCorner.worldX - lowestCorner.localX;
      const finalCenterY = landingY + halfHeight;

      // Change transform origin to the contact point for the rotation
      const contactRelativeToCenter = {
        x: lowestCorner.localX,
        y: lowestCorner.localY
      };

      // Set transform origin to the contact point
      this.element.style.transformOrigin = `${halfWidth + contactRelativeToCenter.x}px ${halfHeight + contactRelativeToCenter.y}px`;

      // Position the block at the final location
      this.x = finalCenterX;
      this.y = finalCenterY - halfHeight;
      this.rotation = 0;

      this.isLanded = true;
      this.landedBlocks.push({
        x: this.x,
        y: this.y,
        width: this.width,
        height: this.height
      });

      // Fast rotation animation
      this.element.style.transition = 'transform 0.2s ease-out';
    }

    this.updatePosition();
  }

  private showLink(linkText: string, url: string): void {
    if (!this.isLanded || this.linkElement || !this.element) return;
  
  this.isHovering = true;
  
  // Check screen width
  const longestBlockWidth = Math.max(...this.blockData.map(block => block.width)) * this.dimensions.containerWidth;
  const slideFromLeft = window.innerWidth < longestBlockWidth * 2;
  
  this.linkElement = document.createElement('div');
  this.linkElement.className = 'link-element';

    this.linkElement.style.position = 'absolute';

    this.linkElement.style.top = this.y + 'px';
    this.linkElement.style.height = this.height + 'px';
    this.linkElement.style.background = '#333';
    this.linkElement.style.color = 'white';
    this.linkElement.style.display = 'flex';
    this.linkElement.style.alignItems = 'center';
    this.linkElement.style.justifyContent = 'center';
    this.linkElement.style.fontFamily = 'Arial, sans-serif';
    this.linkElement.style.fontWeight = 'bold';
    this.linkElement.style.fontSize = (this.dimensions.fontSize * 0.8) + 'px';
    this.linkElement.style.width = this.width + 'px'; // Set final width
    this.linkElement.style.transform = 'translateX(-100%)'; // Start completely hidden to the left of its position
    this.linkElement.style.transition = 'transform 0.3s ease-out';
    this.linkElement.textContent = linkText;

    this.linkElement.addEventListener('mouseenter', () => {
      this.isHovering = true;
    });

    this.linkElement.addEventListener('mouseleave', () => {
      this.isHovering = false;
      setTimeout(() => {
        if (!this.isHovering) {
          this.hideLink();
        }
      }, 50);
    });

    // Make the link clickable
    this.linkElement.addEventListener('click', () => {
      if (url.startsWith('http')) {
        window.open(url, '_blank');
      } else {
        window.location.href = url;
      }
    });

    if (slideFromLeft) {
      this.linkElement.style.right = '0'; // Left edge of block
      this.linkElement.style.top = '0';
      this.linkElement.style.zIndex = '15';
      this.element.style.overflow = 'hidden';
      this.element.appendChild(this.linkElement);
    } else {
      this.linkElement.style.left = (this.x + this.width) + 'px'; // Right edge of block
      this.linkElement.style.zIndex = '5';
      this.container.appendChild(this.linkElement);
    }



    // Trigger slide-out animation
    setTimeout(() => {
      if (this.linkElement) {
        this.linkElement.style.transform = 'translateX(0)'; // Slide to its natural position
      }
    }, 10);
  }

  private hideLink(): void {
    if (this.linkElement) {
      this.isHovering = false; // Reset hover state when hiding
      this.linkElement.style.transform = 'translateX(-100%)';

      setTimeout(() => {
        if (this.linkElement && this.linkElement.parentNode) {
          this.linkElement.parentNode.removeChild(this.linkElement);
          this.linkElement = null;
        }
      }, 300);
    }
  }
}
