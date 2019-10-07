import { Component, OnInit } from '@angular/core';
import { DatabaseService } from "../database.service";


@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.css']
})
export class MovieComponent implements OnInit {
  moviesDB: any[] =  [];
  section = 1;

  movieTitle: string = "";
  mYear: number = 0;
  movieId: string = "";
  constructor(private dbService: DatabaseService) {}

  //Get all Movies
  onGetMovies(){
    this.dbService.getMovies().subscribe((data:any[])=>{
      this.moviesDB = data;
    })
  }
  //Create a new Movie, POST request
  onSaveMovie(){
    let obj = { title: this.movieTitle, year: this.mYear};
    this.dbService.createMovie(obj).subscribe(result => {
      this.onGetMovies();
    })
  }

  onDeleteBeforeYear(aYear:number){
    this.onGetMovies();
    let temp = this.moviesDB.filter(element => element.year <= aYear)
    temp.forEach(element => {
      this.dbService.deleteMovie(element._id).subscribe();
    })
    // temp.forEach(element => {
    //   this.onDeleteMovie(element);
    // })
    this.onGetMovies();
  }
  //Delete Movie
  onDeleteMovie(item){
    this.dbService.deleteMovie(item._id).subscribe(result=>{
      this.onGetMovies();
    });
  }

  // This lifecycle callback function will be invoked with the component get initialized by Angular.
  ngOnInit() {
    this.onGetMovies();
  }

  changeSection(sectionId) {
    this.section = sectionId;
    this.resetValues();
  }

  resetValues() {
    this.movieTitle = "";
    this.mYear = 0;
    this.movieId = "";
  }


}
