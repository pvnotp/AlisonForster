
import { BlockData, ResponsiveDimensions, LandedBlockInfo } from './falling-block.interfaces';
export class FallingBlock {
  private element: HTMLDivElement | null = null;
  private x = 0;
  private y = 0;
  private rotation = 0;
  public isLanded = false;
  private velocity = 0;
  private readonly gravity = 1;
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
    this.element.style.height = this.dimensions.blockHeight + 'px';
    this.element.style.fontSize = this.dimensions.fontSize + 'px';
    this.element.style.padding = this.dimensions.padding + 'px 0';

    const data = this.blockData[this.index % this.blockData.length];
    this.width = data.width * this.dimensions.containerWidth;

    this.element.style.width = this.width + 'px';
    this.element.style.height = this.height + 'px';
    this.element.textContent = data.text;

    this.element.addEventListener('mouseenter', () => {
      this.isHovering = true;
      if (data.linkText && data.link) {
        this.showLink(data.linkText, data.link);
      }

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

    const slideFromLeft = (this.container.parentElement?.offsetWidth ?? 0) < longestBlockWidth * 2;
    this.linkElement = document.createElement('div');
    this.linkElement.className = 'link-element';
    this.linkElement.style.top = this.y + 'px';
    this.linkElement.style.height = this.height + 'px';
    this.linkElement.style.fontSize = (this.dimensions.fontSize * 0.8) + 'px';
    this.linkElement.style.width = this.width + 'px'; // Set final width
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
