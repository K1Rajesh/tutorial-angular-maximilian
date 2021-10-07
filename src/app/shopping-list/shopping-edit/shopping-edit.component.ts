import {
  Component,
  OnInit, OnDestroy,
  ElementRef,
  ViewChild
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

import { Ingredient } from '../../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  //@ViewChild('nameInput', { static: false }) nameInputRef: ElementRef;
  //@ViewChild('amountInput', { static: false }) amountInputRef: ElementRef;
  
  name:string;
  amount:number;
  editMode = false;
  editedItem:Ingredient;
  editItemIndex:number;

  @ViewChild('f', { static: false }) form: NgForm;

  editSubscription : Subscription;

  constructor(private slService: ShoppingListService) { }

  ngOnInit() {
    this.editSubscription = this.slService.startEditing.subscribe((index:number)=>{
      this.editMode = true;
      this.editItemIndex = index;
      this.editedItem = this.slService.getIngredient(index);
      this.form.setValue({name:this.editedItem.name,amount:this.editedItem.amount});

    });
  }

  onSubmit(form : NgForm) {
    //console.log(form);
    //form.value.name;
    const ingName = form.value.name;
    const ingAmount = form.value.amount;
    const newIngredient = new Ingredient(ingName, ingAmount);
    //const newIngredient = new Ingredient(this.name, this.amount);
    if(this.editMode){
      this.slService.updateIngredient(this.editItemIndex,newIngredient);
      this.editMode=false;

    }else{
      this.slService.addIngredient(newIngredient);
    }
    this.form.reset();
    
  }
  onClear(){
    this.editMode=false;
    this.form.reset();

  }
  onDelete(){
    this.onClear();
    this.slService.deleteIngredient(this.editItemIndex);
    
  }
  ngOnDestroy(){
    this.editSubscription.unsubscribe();

  }

}