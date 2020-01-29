import {elements} from './base.js'

//get value
//and return value
export const getInput = ()=> elements.searchInput.value

export const clearInput = () => {elements.searchInput.value =''}

export const clearResult = () =>{
    elements.searchReList.innerHTML = ""
    elements.searchResPages.innerHTML = ""
}

export const limiteRecipeTitle=(title,limit= 20)=>{
    const newTitle = []
    if(title&&title.length>limit){
        title.split('').reduce((acc,cur)=>{
            if(acc+cur.length<=limit){
                newTitle.push(cur)
            }
            return acc+cur.length 
        },0)
        
        return newTitle.join('')+'...'
    }
    return title
}

export const highlightSelected = id =>{
    const resultArr = Array.from(document.querySelectorAll('.results__link'))
    resultArr.forEach(el=>el.classList.remove('results__link--active'))
    const el = document.querySelector(`.results__link[href*="#${id}"]`)
    if(el)el.classList.add(`results__link--active`)
}

const renderRecipe =(recipes,baseUrl)=>{
    
 recipes.forEach((recipe)=>{
    const markup = `
    <li>
        <a class="results__link results__link" href="#${recipe.id}">
            <figure class="results__fig">
                <img src="${baseUrl+recipe.image}" alt="${recipe.title}">
            </figure>   
            <div class="results__data">
                <h4 class="results__name">${limiteRecipeTitle(recipe.title)} ...</h4>
                <p class= "results__author">${recipe.title}</p>
            </div>
        </a>
    </li>
    `
    elements.searchReList.insertAdjacentHTML('beforeEnd',markup)
 })
}



//type:pre or next
const createButton = (page,type)=>
    `<button class="btn-inline results__btn--${type}" data-goto="${type === 'prev' ? page-1:page+1}">
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left':'right'}"></use>
        </svg>
        <span>Page ${type === 'prev' ? page-1:page+1}</span>
    </button>`


const renderButtons = (page,numResults,resPerpage)=>{
    const pages = Math.ceil(numResults/resPerpage)
    let button
    if(page==1 && pages>1){
        //only button to next page
        button = createButton(page,'next')
    }else if(page < pages){
        //both button
        button = `${ createButton(page,'next')}${ createButton(page,'prev')}`
       
        
    }else if(page==pages && pages>1){
        button=createButton(page,'prev')
    }

    elements.searchResPages.insertAdjacentHTML('beforeEnd',button)
}


export const renderResults = (recipes,page=1,resPerPage=10) =>{
  // recipes.foreach(el=>renderRecipe(el))
   const start = (page-1)*resPerPage
   const end = page * resPerPage
   const results = recipes.recipes
   renderRecipe(results.slice(start,end),recipes.baseUrl)
   renderButtons(page,results.length,resPerPage)
}