import { Component, OnInit,AfterViewInit } from '@angular/core';
import { FormGroup,FormControl,FormArray, AbstractControl, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { RecipeService } from '../recipe.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit,AfterViewInit {
  id: number;
  editMode = false
  recipeForm: FormGroup;
  

  constructor(private route: ActivatedRoute,private recipeService : RecipeService,
    private router:Router) { }

  ngOnInit() {
    this.route.params.subscribe(
        (params: Params) => {
          this.id = +params['id'];
          this.editMode = params['id'] != null;         
          //setTimeout(()=>{ alert("Hello"); this.initForm();}, 15000);
          this.initForm();   
        }
    );

  }
  ngAfterViewInit(){
    

  }

  private initForm(){

    var recipeName="",recipeImagePath="",recipeDescription="";
    let recipeIgredients = new FormArray([]);
    if(this.editMode){

      var editedRecipe = this.recipeService.getRecipe(this.id);
      recipeName=editedRecipe.name;
      recipeImagePath=editedRecipe.imagePath;
      recipeDescription=editedRecipe.description;

      if(editedRecipe.ingredients){
        for(let ingredient of editedRecipe.ingredients){
          recipeIgredients.push(
            new FormGroup({
              name:new FormControl(ingredient.name,Validators.required),
              amount:new FormControl(ingredient.amount,[Validators.required, 
                Validators.pattern(/^[1-9]+[0-9]*$/)])
              })
          );


        }

      }





    }
  
    this.recipeForm = new FormGroup({
      'name':new FormControl(recipeName,Validators.required),
      'imagePath':new FormControl(recipeImagePath,Validators.required),
      'description':new FormControl(recipeDescription,Validators.required),
      'ingredients':recipeIgredients
    });


  }
   get controls() :AbstractControl[]{ // a getter!
     return (<FormArray>this.recipeForm.get('ingredients')).controls;
   }
  onSubmit():void{
    console.log(this.recipeForm);
     if(this.editMode){
       this.recipeService.updateRecipe(this.id,this.recipeForm.value);
     }else{
       this.recipeService.addRecipe(this.recipeForm.value);
     }
     this.onCancel();
    
    
  }
  onAddIngredient():void{
    (<FormArray>this.recipeForm.get('ingredients')).push(new FormGroup({
      name:new FormControl(null,Validators.required),
      amount:new FormControl(null,[Validators.required, 
        Validators.pattern(/^[1-9]+[0-9]*$/)])}));

  }
  onRemoveIngredient(index:number):void{
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(index);
  }

  onCancel(){
    this.router.navigate(['../'], { relativeTo: this.route });
  }



}