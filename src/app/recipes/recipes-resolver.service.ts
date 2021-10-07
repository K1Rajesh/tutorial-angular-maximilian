import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { DataStorageService } from '../shared/data-storage.service';
import { Ingredient } from '../shared/ingredient.model';
import { Recipe } from './recipe.model';
import { RecipeService } from './recipe.service';

@Injectable({
  providedIn: 'root'
})
export class RecipesResolverService implements Resolve<Recipe[]>{
   recipes: Recipe[] = [
    new Recipe(
      'Bokka',
      'A super-tasty Schnitzel - just awesome!',
      'https://upload.wikimedia.org/wikipedia/commons/7/72/Schnitzel.JPG',
      [
        new Ingredient('Meat', 1),
        new Ingredient('French Fries', 20)
      ]),
    new Recipe('Chekka',
      'What else you need to say?',
      'https://upload.wikimedia.org/wikipedia/commons/b/be/Burger_King_Angus_Bacon_%26_Cheese_Steak_Burger.jpg',
      [
        new Ingredient('Buns', 2),
        new Ingredient('Meat', 1)
      ])
  ];
  
  constructor(private dataStorageService:DataStorageService, 
    private recipeService:RecipeService) { 
    console.log(" executing RecipesResolverService - construtor");

  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot)
  :Observable<Recipe[]>| Recipe[]
  {
    console.log(" executing resolve method");
    const recipes = this.recipeService.getRecipes();
    if(recipes.length==0){
    return this.dataStorageService.fetchRecipes(); //.subscribe();
     //return of(this.recipes);
    }else{
    return recipes;
    }
  }
}
//   Observable<Recipe[]>
//
