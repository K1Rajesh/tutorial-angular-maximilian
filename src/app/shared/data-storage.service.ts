import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Recipe } from '../recipes/recipe.model';
import { RecipeService } from '../recipes/recipe.service';

import { exhaustMap, map, take, tap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {

  constructor(private httpClient:HttpClient,private recipeService : RecipeService,private authService:AuthService) { 

  }
  storeRecipes(){
    this.httpClient.put('https://ng-course-recipe-book-6e017-default-rtdb.firebaseio.com/recipes.json',
    this.recipeService.getRecipes())
    .subscribe((response)=>{console.log(response)});
  }
  //
  fetchRecipes(){

    return         this.httpClient.
    get<Recipe[]>('https://ng-course-recipe-book-6e017-default-rtdb.firebaseio.com/recipes.json')
    .pipe(
      map((recipes)=>{
        return recipes.map(recipe=>{
          //console.log("At fetchRecipes - map");
          return {...recipe,ingredients:recipe.ingredients?recipe.ingredients:[]}
        });}),
        tap((recipes)=>{
          //console.log("At fetchRecipes - tap");
          this.recipeService.setRecipes(recipes);
        })

    )

  }

}
