import { NgModule } from '@angular/core';



import { ReactiveFormsModule } from '@angular/forms';
import { RecipesRoutingModule } from './recipes-routing.module';
import { RecipesComponent } from './recipes.component';
import { RecipeListComponent } from './recipe-list/recipe-list.component';
import { RecipeDetailComponent } from './recipe-detail/recipe-detail.component';
import { RecipeStartComponent } from './recipe-start/recipe-start.component';
import { RecipeEditComponent } from './recipe-edit/recipe-edit.component';
import { RecipeItemComponent } from './recipe-list/recipe-item/recipe-item.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
    declarations: [

        RecipesComponent,
        RecipeListComponent,
        RecipeDetailComponent,
        RecipeStartComponent,
        RecipeEditComponent,
        RecipeItemComponent
    ],
    imports:[        
        SharedModule,
        //RouterModule,
        ReactiveFormsModule,
        RecipesRoutingModule
    ],
    exports:[
        RecipesComponent,
        RecipeListComponent,
        RecipeDetailComponent,
        RecipeStartComponent,
        RecipeEditComponent,
        RecipeItemComponent
    ]
})
export class RecipesModule{

}