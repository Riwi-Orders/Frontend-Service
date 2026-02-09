import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {Navbar} from './shared/components/navbar/navbar';
import { LoadingSpinner } from './shared/components/loading-spinner/loading-spinner';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoadingSpinner, Navbar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App { }
