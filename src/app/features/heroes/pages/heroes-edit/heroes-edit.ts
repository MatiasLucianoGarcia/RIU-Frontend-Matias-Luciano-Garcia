import { NgIf } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { HeroService } from '../../services/hero-service';
import { ActivatedRoute, Router } from '@angular/router';
import { Universe } from '../../domain/hero.model';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-heroes-edit',
  imports: [ReactiveFormsModule, NgIf,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule,MatIcon
    ],
  templateUrl: './heroes-edit.html',
  styleUrl: './heroes-edit.scss'
})
export class HeroesEdit implements OnInit{
  private fb = inject(FormBuilder);
  private svc = inject(HeroService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  preview = signal<string | null>(null);


  isEdit = false;
  heroId: string | null = null;

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    alterEgo: ['', [Validators.required, Validators.minLength(2)]],
    power: [''],
    universe: <(Universe | null)>null,
    imageUrl: [''],
  });

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.isEdit = !!id;
    this.heroId = id;

    if (this.isEdit && id) {
      const hero = this.svc.getById(id);
      if (!hero) { this.goBack(); return; }
      this.form.patchValue({
        name: hero.name,
        alterEgo: hero.alterEgo,
        power: hero.powers ?? '',
        universe: hero.universe ?? null,
        imageUrl: hero.image
      });
    }
  }

  onSubmit() {
    if (this.form.invalid) return;
    const { name, power, universe, alterEgo, imageUrl } = this.form.value;

    const heroToSave = {
        name: name!, 
        power: power ?? undefined, 
        universe: universe ?? undefined, 
        alterEgo:alterEgo ?? undefined,
        image: imageUrl ?? undefined,
    }

    if (this.isEdit && this.heroId) {
  
      this.svc.update(this.heroId, 
        heroToSave);
    } else {
      this.svc.create({
        ...heroToSave,
        createdAt: '', updatedAt: ''
      } as any);
    }
    this.goBack();
  }

  goBack(){ this.router.navigate(['/heroes']); }


async onFileSelected(ev: Event) {
  const file = (ev.target as HTMLInputElement).files?.[0];
  if (!file) return;
  const dataUrl = await this.resizeToDataURL(file, 600, 600);
  this.form.patchValue({ imageUrl: dataUrl });
  this.preview.set(dataUrl);
}

private resizeToDataURL(file: File, maxW: number, maxH: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();
    reader.onload = () => {
      img.onload = () => {
        const { width, height } = img;
        const ratio = Math.min(maxW / width, maxH / height, 1);
        const w = Math.round(width * ratio);
        const h = Math.round(height * ratio);
        const canvas = document.createElement('canvas');
        canvas.width = w; canvas.height = h;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', 0.85));
      };
      img.onerror = reject;
      img.src = reader.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
}

