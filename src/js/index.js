import Search from './models/Search'
import Recipe from './models/Recipe'
import List from './models/List'
import Like from './models/Likes'
import * as searchView from './views/searchView'
import * as recipeView from './views/recipeView'
import * as listView from './views/listView'
import * as likesView from './views/likesView'
import {elements,renderLoader,clearLoader} from './views/base'
import Likes from './models/Likes'

//const qry = searchView.getResults
//const search = new Search()
//search.getResults()
//console.log(search)

/**
 * Global state of the app
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked products 
 * - 
 */

const state ={}


/***
 * SEARCH CONTROLLER
 * 
 */
const controlSearch = async ()=>{ 
    //1.get query from view
    const query = elements.searchInput.value
     
    if(query){
        //2.new search object and add it to state
        state.search = new Search(query)
    }
    //3.Prepare UI for result   
    searchView.clearInput()
    searchView.clearResult()
    renderLoader(elements.searchRes)
    

    
    //4.Search for products
    try {
        await state.search.getResults()       
        
         //5.render reuslt on UI
         searchView.renderResults(state.search)
        
       
    } catch (error) {
        alert(error)
      
    }
    clearLoader()

   
} 

 elements.searchForm.addEventListener('submit',e=>{
    e.preventDefault()
    controlSearch()

 })

 window.addEventListener('load',e=>{
  

 })

elements.searchResPages.addEventListener('click',e=>{
   
    const btn = e.target.closest('.btn-inline')
    if(btn){
        const goToPage = parseInt(btn.dataset.goto,10)
        searchView.clearResult()
        searchView.renderResults(state.search,goToPage)
        

    }
   
})

/**
 * RECIPE CONTROLLER
 */

const controlRecipe = async ()=>{
    const id = window.location.hash.replace('#','')
    
    if(id){
        recipeView.clearRecipe()
        renderLoader(elements.recipe)
       try {
        
            //get recipe data
        state.recipe = new Recipe(id)

        //hight light  link
        searchView.highlightSelected(id)
       
        //test recipe
        //window.r = state.recipe
    
        await state.recipe.getRecipe ()

        //after getResults,continue... so async function
        state.recipe.calcTime()
        state.recipe.calcServings()
        state.recipe.parseIngredients()

        //render ui
        clearLoader()
        recipeView.renderRecipe(
            state.recipe,
            state.likes.isLiked(id)
        )
       } catch (error) {
           alert(error)
       }
      
       
    }

}

['hashchange','load'].forEach(event=>window.addEventListener(event,controlRecipe))

//handling recipe button click

/***
 * List Controller
 */

const controlList = ()=>{
    //create new list if there is not yet
    if(!state.list) state.list = new List()
    state.recipe.ingredients.forEach(el=>{
        const item = state.list.addItems(el.count,el.unit,el.ingredient)
        listView.renderItem(item)
    })
}

/**
 * Like controller
 */
// state.likes = new Likes()
// likesView.toggleLikeMenu(state.likes.getNumLikes())
const controlLike = ()=>{
    if(!state.likes) state.likes = new Likes()
    const currentID = state.recipe.id

    if(!state.likes.isLiked(currentID)){
        //Add like to the state
        const newLike = state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        )    
        //Toggle the like button
        likesView.toggleLikeBtn(true) 
        //Add like to UI list 
        likesView.renderLike(newLike)
        
    }else{
        //Remove like from the state
        state.likes.deleteLike(currentID)
        //Toggle the like button
        likesView.toggleLikeBtn(false)
        //Remove like from UI list 
        likesView.deleteLike(currentID)
    }
   
    likesView.toggleLikeMenu(state.likes.getNumLikes())

}

//Restore liked recipes from page Load
window.addEventListener('load',()=>{
    state.likes = new Likes()
    //Restore likes
    state.likes.readStorage()
    //console.log(state.likes)

    //Toggle like menu button
    likesView.toggleLikeMenu(state.likes.getNumLikes())
    
    //Render existed likes
    //console.log(state.likes)
    state.likes.likes.forEach(like => likesView.renderLike(like))
 

 })


//Handle deleted and update list item  events
elements.shopping.addEventListener('click',e=>{
    const id =  e.target.closest('.shopping__item').dataset.itemid
    if(e.target.matches('.shopping__delete, .shopping__delete *')){
        //delete from state
        state.list.deleteItem(id) 
        //delete from UI
        listView.deleteItem(id)
        //handle the count updated
     }
     else if(e.target.matches('.shopping__count-value')){
        const val = parseFloat(e.target.value,10)
        state.list.updateCount(id,val)
    }

})


elements.recipe.addEventListener('click',e=>{
    //console.log('click')
    if(e.target.matches('.bth-decrease, .btn-decrease *')){
        //Decrease button is clicked       
        if(state.recipe.servings>1){
            state.recipe.updateServings('dec')
            recipeView.updateServingsIngredient(state.recipe)
        }
    }else if (e.target.matches('.bth-increase, .btn-increase *')){
        state.recipe.updateServings('inc')
        recipeView.updateServingsIngredient(state.recipe)
    }else if(e.target.matches('.recipe__btn-add, .recipe__btn-add *')){
       // console.log(`recipe__btn`)
       controlList()
    }else if(e.target.matches('.recipe__love, .recipe__love *')){
        //Like controller     
       controlLike()
    }
})
const l = new List()
window.l = l