import { Directive, Input, TemplateRef, ViewContainerRef, inject, effect } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';

@Directive({
  selector: '[appHasRole]',
  standalone: true
})
export class HasRoleDirective {
  private readonly templateRef = inject(TemplateRef);
  private readonly viewContainer = inject(ViewContainerRef);
  private readonly authService = inject(AuthService);
  
  private requiredRoles: string[] = [];
  private hasView = false;

  @Input() set appHasRole(roles: string[] | string) {
    this.requiredRoles = Array.isArray(roles) ? roles : [roles];
    this.updateView();
  }

  constructor() {
    // Reactively update the view if the user's session state changes (e.g., role granted)
    effect(() => {
      this.authService.currentUser(); // create dependency
      this.updateView();
    });
  }

  private updateView(): void {
    const user = this.authService.currentUser();
    
    if (user && user.roles) {
      const hasAccess = this.requiredRoles.some(role => user.roles.includes(role));
      
      if (hasAccess && !this.hasView) {
        this.viewContainer.createEmbeddedView(this.templateRef);
        this.hasView = true;
      } else if (!hasAccess && this.hasView) {
        this.viewContainer.clear();
        this.hasView = false;
      }
    } else {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
}