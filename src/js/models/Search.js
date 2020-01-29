import axios from 'axios'
import {key} from '../config'
 
export default class  Search{

    constructor(query){
        this.query = query
    }


    async getResults(){
        let num = 30
        //let res = await axios(`https://api.spoonacular.com/food/wine/dishes?wine=malbec&apiKey=${key}`)
        try {
            let res = await axios(`https://api.spoonacular.com/recipes/search?query=${this.query}&number=${num}&apiKey=${key}`)
            
            this.recipes = res.data.results
            this.baseUrl = res.data.baseUri
                      
        } catch (error) {
            alert(error)
        }
       
    }


}
//getResults('wine')
