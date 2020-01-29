import {elements} from './base'
import {limiteRecipeTitle} from './searchView'

export const toggleLikeBtn = isLiked =>{
    const iconString = isLiked?'icon-heart':'icon-heart-outlined'
    const el = document.querySelector('.recipe__love use')
    if(el)el.setAttribute('href',`img/icons.svg#${iconString}`)

}

export const toggleLikeMenu = numLikes => {
    elements.likesMenu.style.visibility = numLikes > 0 ? 'visible':'hidden'

}

export const renderLike = like =>{
   const markup = `
        <li>
        <a class="likes__link" href="#${like.id}">
        <figure class="likes__fig">
        <img src="${like.img}" alt="${like.title}">
        </figure>
        <div class="likes__data">
        <h4 class="likes__name">${limiteRecipeTitle(like.title,18)}</h4>
        <p class="likes__author">${limiteRecipeTitle(like.author,18)}</p>
        </div>
        </a>
        </li>
    `
    elements.likeList.insertAdjacentHTML('beforeend',markup)

}

export const deleteLike = id =>{
    const el = document.querySelector(`.likes__link[href*="${id}"]`).parentElement
    
    if(el){
        el.parentElement.removeChild(el)
    }
    
 
 }



