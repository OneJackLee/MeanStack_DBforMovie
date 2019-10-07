import { Component, OnInit } from '@angular/core';
import { DatabaseService } from "../database.service";


@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.css']
})
export class MovieComponent implements OnInit {
  moviesDB: any[] =  [];
  actorsTempDB:any[] = [];
  section = 1;

  movieTitle: string = "";
  mYear: number = 0;
  movieId: string = "";
  actorsAr: any[] = [];

  actorId: string = "";
  actorName: string = "";
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

  onSelectActor(item){
    this.actorId = item._id;
    this.actorName = item.name;
  }
  //Update a Movie
  onSelectUpdate(item) {
    this.movieTitle = item.title;
    this.mYear = item.year;
    this.movieId = item._id;
    this.actorsAr = item.actors
  }
  onUpdateMovie(){
    if (this.actorId != ""){
      this.actorsAr.push(this.actorId)
    }
    let obj = { title: this.movieTitle, year: this.mYear, actors: this.actorsAr};

    this.dbService.updateMovie(this.movieId, obj).subscribe(result => {
      this.resetValues();
      this.onGetMovies();
    });
  }

  onDeleteBeforeYear(){
    this.onGetMovies();
    let temp = this.moviesDB.filter(element => element.year <= this.mYear)
    temp.forEach(element => {
      this.dbService.deleteMovie(element._id).subscribe(result =>{
        this.onGetMovies();
      });
    })
    // temp.forEach(element => {
    //   this.onDeleteMovie(element);
    // })
    this.resetValues();
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
    this.onGetActor();
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
    this.actorId = "";
    this.actorName = "";
  }

  onGetActor(){
    this.dbService.getActors().subscribe((result:any[]) => {this.actorsTempDB = result});
  }

}
