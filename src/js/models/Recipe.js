import {key} from '../config'
import axios from 'axios'

export default class Recipe{

    constructor(id) {
        this.id = id
    }

    async getRecipe(){
        
        try {
            //const res = await axios(`https://api.spoonacular.com/food/products/${this.id}?apiKey=${key}`)
            const res = await axios(`https://api.spoonacular.com/recipes/${this.id}/information??includeNutrition=false&apiKey=${key}`)
           
            this.title =res.data.title
            this.author = res.data.creditsText
            this.img = res.data.image
            this.url = res.data.soureUrl
            
            this.ingredients = res.data.extendedIngredients
           
        } catch (error) {
            console.log(error)
        }

    }

    calcTime(){
        const numInt = this.ingredients.length
        const periods = Math.ceil(numInt/3)
        this.time = periods * 15
    }

    calcServings(){
        this.servings = 4

    }

    parseIngredients(){
        const newIngerdients = this.ingredients.map(el =>{
            const unitsLong = ['tablespoons','tablesoon','ounce','ounces','teaspoon','teaspoons','cups','pounds','servings','serving']
            const unitsShort = ['tbsp','tbsp','oz','oz','tsp','tsp','cup','pound','ser','ser']

            let ingredient = el.name.toLowerCase()
                             .replace("/ *\([^)]*\) */g"," ")
            let unit = el.unit
            let amount = Math.round(el.amount,-2)
            // unitsLong.forEach((unit,i)=> {
            //     ingredient = ingredient.replace(unit,unitsShort[i])
            // });
            //let arrIng = ingredient.split(' ')
            //let unitIndex = .findIndex(el2=>unitsLong.includes(el2))
            //includes = `${amount} ${unit} ${ingredient}`
            
            let objIng;
            if(unitsLong.indexOf(unit)>-1 && amount>0){
               //there is a unit 
               objIng ={
                count:amount,
                unit:unitsShort[unitsLong.indexOf(unit)],
                ingredient
               }
            }else if(unitsLong.indexOf(unit)> -1 && amount===0){
            
               //there is no unit,  but the first int is number
                objIng ={
                    count:' ',
                    unit:unitsShort[unitsLong.indexOf(unit)],
                    ingredient
                }

            }else if(unitsLong.indexOf(unit) === -1 && amount===0){
               // there is no unit
               objIng = {
                   count:' ',
                   unit:'  ',
                   ingredient
               }
            }else{
                objIng={
                    count:' ',
                    unit:'  ',
                    ingredient
                }
            }
            

            return objIng

        })
        this.ingredients = newIngerdients
    }
    updateServings(type){
        //servings 
        const newServings = type === 'dec'?this.servings-1:this.servings+1
        //ingredients
        this.ingredients.forEach(ing=>{
            ing.count = ing.count * (newServings/this.servings)
        })
        this.servings = newServings

    }       

       
 }
    
