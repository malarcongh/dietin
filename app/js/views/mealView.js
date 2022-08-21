export default class mealView{

    addHandlerUpdateServingSize(handler){
        const thisObj = this;
        this._searchScreen.addEventListener('input', function(e){
            if(!e.target.matches('.serving__size-input')) return;

            let servingSize = Number(e.target.value);
            const item = e.target.closest('.result__item');
            const itemId = item.dataset.id;
            handler(item, itemId, servingSize, thisObj);
            // console.log(itemBody);
        })
    }

    _addHandlerResultItem(addHandler, editHandler){
        const thisObj = this;
        this._searchScreen.addEventListener('click', function(e){

            // Click on add button.
            if(e.target.classList.contains('fa-circle-plus') && !thisObj.isAdding){
                const resultItem = e.target.closest('.result__item');
                const id = resultItem.dataset.id;
                const isActive = resultItem.matches('.result__item-active');

                addHandler(resultItem, id, isActive, thisObj);

                // if(resultItem.matches('.result__item-active')) thisObj._toggleActiveResultItem(resultItem);
                // resultItem.querySelector('.');
                const itemHeader = resultItem.querySelector('.result__item-header');
                const itemBody = resultItem.querySelector('.result__item-body');

                // itemHeader.style.animation = '';
                // itemHeader.style.animation = 'bgGreen 1s';
                // itemBody.style.animation = 'bgLightGreen 1s';
                itemHeader.addEventListener('animationend', function(){
                    itemHeader.classList.remove('bgGreen');
                    itemBody.classList.remove('bgLightGreen');
                    thisObj.isAdding = false;
                }, {once: true});
                itemHeader.classList.add('bgGreen');
                itemBody.classList.add('bgLightGreen');
                thisObj.isAdding = true;

                return;
            }


            // Click on header but not add button
            if(!e.target.classList.contains('fa-circle-plus') && e.target.closest('.result__item-header')){
                const resultItem = e.target.closest('.result__item');
                const resultItemId = resultItem.dataset.id;

                // If the item is going to be activated restore the original macro nutrients values before any edit.
                if(!resultItem.matches('.result__item-active')){
                    editHandler(resultItem, resultItemId, thisObj);
                    resultItem.querySelector('.serving__size-input').value = '';
                }

                thisObj._toggleActiveResultItem(resultItem);

                // If a prev item exists, that prev item is active and its different than the actual item, the prev item should be closed.
                thisObj._prevActiveResultItem && thisObj._prevActiveResultItem.matches('.result__item-active') && thisObj._prevActiveResultItem !== resultItem && thisObj._toggleActiveResultItem(thisObj._prevActiveResultItem);

                thisObj._prevActiveResultItem = resultItem;
            }
        })
    }

    _addHandlerCloseBtn(){
        const thisObj = this;
        this._closeBtn.addEventListener('click', function(){
            thisObj._parentElement.classList.remove('meal__screen-visible');
        })
    }

    _addHandlerAddbtn(){
        const thisObj = this;
        this._addBtn.addEventListener('click', function(){
            thisObj._searchScreen.classList.toggle('show-screen');
            this.querySelector('i').classList.toggle('rotate');
        })
    }

    addHandlerSearch(handler){
        const thisObj = this;
        this._searchForm.addEventListener('submit', function(e){
            e.preventDefault();
            handler(thisObj);
            thisObj._clearInput();
        })
    }

    renderSearchResults(results){
        const markup = results.map(res => {
            return `
                <div class="result__item" data-id="${res.id}">
                    <div class="result__item-header">
                        <div class="food__info">
                            <div class="food__info-product">${res.description}</div>
                            <div class="food__info-aditional">
                                <span class="food__brand">${res.brand}</span><span class="food__serving-quantity">, ${res.servingSize}</span><span class="food__serving-unit">${res.servingSizeUnit}</span>
                            </div>
                        </div>
                        <div class="right__container">
                            <div class="food__calories"><span class="food__serving-calories">${res.foodNutrients.calories}</span> kcal</div>
                            <div class="add__item-btn"><i class="fa-solid fa-circle-plus"></i></div>
                        </div>
                    </div>
                    <div class="result__item-body">
                        <div class="title"><b>Nutritional information</b></div>
                        <div class="calories__div macro__div">
                            <div class="macro__text">Calories</div>
                            <div class="macro__quantity"><span class="macro__quantity-text">${res.foodNutrients.calories}</span> kcal</div>
                        </div>
                        <div class="protein__div macro__div">
                            <div class="macro__text">Protein</div>
                            <div class="macro__quantity"><span class="macro__quantity-text">${res.foodNutrients.protein}</span> g</div>
                        </div>
                        <div class="carbs__div macro__div">
                            <div class="macro__text">Carbohydrates</div>
                            <div class="macro__quantity"><span class="macro__quantity-text">${res.foodNutrients.carbs}</span> g</div>
                        </div>
                        <div class="sugar__div macro__div">
                            <div class="macro__text">Sugar</div>
                            <div class="macro__quantity"><span class="macro__quantity-text">${res.foodNutrients.sugar}</span> g</div>
                        </div>
                        <div class="fat__div macro__div">
                            <div class="macro__text">Fats</div>
                            <div class="macro__quantity"><span class="macro__quantity-text">${res.foodNutrients.fat}</span> g</div>
                        </div>
                        <div class="sodium__div macro__div">
                            <div class="macro__text">Sodium</div>
                            <div class="macro__quantity"><span class="macro__quantity-text">${res.foodNutrients.sodium}</span> g</div>
                        </div>
                        <div class="serving__div macro__div">
                            <div class="serving__size-text">Serving size</div>
                            <div class="input__container">
                                <input class="serving__size-input" type="number" placeholder="${res.servingSize}"><span>g</span>
                            </div>
                        </div>
                        
                    </div> 
                </div>`;
        }).join('');
        const resultsContainer = this._parentElement.querySelector('.add__food-results');
        resultsContainer.insertAdjacentHTML('afterbegin', markup);
    }

    renderMacros(item, edit){
        Object.entries(edit).forEach(([macro, quantity]) => {
            const macroContainer = item.querySelector(`.${macro}__div`);
            if(macroContainer) macroContainer.querySelector('.macro__quantity-text').innerText = quantity;
        })
    }

    renderNewItem(item){
        const markup = `
            <div class="saved__item" data-id=${item.id}>
                <div class="food__info">
                    <div class="food__info-product">${item.description}</div>
                    <div class="food__info-aditional">
                        <span class="food__brand">${item.brand}</span>, <span class="food__serving-quantity">${item.servingSize}</span><span class="food__serving-unit">${item.servingUnit}</span>
                    </div>
                </div>
                <div class="right__container">
                    <div class="food__calories"><span class="food__serving-calories">${item.foodNutrients.calories}</span> kcal</div>
                </div>   
            </div>
        `;
        this._parentElement.querySelector('.food__saved-container').insertAdjacentHTML('afterbegin', markup);
    }

    renderTotalMacros(meal){
        let totalCalories = meal.reduce((acc, curItem) => curItem.foodNutrients.calories + acc, 0);
        let totalProtein = meal.reduce((prev, curItem) => curItem.foodNutrients.protein + prev, 0);
        let totalCarbs = meal.reduce((prev, curItem) => curItem.foodNutrients.carbs + prev, 0);
        let totalFat = meal.reduce((prev, curItem) => curItem.foodNutrients.fat + prev, 0);

        this._parentElement.querySelector('.item-calories h4').innerText = `${Math.round(totalCalories)} kcal`;
        this._parentElement.querySelector('.item-protein h4').innerText = `${Math.round(totalProtein)} g`;
        this._parentElement.querySelector('.item-carbs h4').innerText = `${Math.round(totalCarbs)} g`;
        this._parentElement.querySelector('.item-fat h4').innerText = `${Math.round(totalFat)} g`;
    }

    removeItem(id){
        const children = this._parentElement.querySelector('.food__saved-container').children;
        const item = Array.prototype.find.call(children, function(child){
            return child.dataset.id === id;
        })
        item.parentNode.removeChild(item);

        this.renderPlaceholderImage();
    }



    renderPlaceholderImage(){
        if (this._parentElement.querySelector('.food__saved-container').children.length <= 1) this._parentElement.querySelector('.placeholder-img__container').classList.add('active');
    }

    removePlaceholderImage(){
        this._parentElement.querySelector('.placeholder-img__container').classList.remove('active');
    }



    getQuery(){
        return this._searchInput.value;
    }

    renderLoader(){
        this._clearResults();
        this._loader.style.display = 'block';
    }

    stopLoader(){
        this._loader.style.display = 'none';
    }

    _toggleActiveResultItem(item){
        const itemHeader = item.querySelector('.result__item-header');
        const itemBody = item.querySelector('.result__item-body');
        const itemServingQuantity = itemHeader.querySelector('.food__serving-quantity');
        const itemServingUnit = itemHeader.querySelector('.food__serving-unit');
        const itemServingCalories = itemHeader.querySelector('.food__calories');
        item.classList.toggle('result__item-active');
        itemHeader.classList.toggle('bg-grey');
        itemBody.classList.toggle('maxh-100');
        [itemServingCalories, itemServingQuantity, itemServingUnit].forEach( el => el.classList.toggle('opacity-0'));
    }

    _clearResults(){
        this._parentElement.querySelector('.add__food-results').innerHTML = '';
    }

    _clearInput(){
        this._searchInput.value = '';
    }

    resetView(){
      this._parentElement.classList.remove('meal__screen-visible');
      this._clearInput();
      this._clearResults();
      this._searchScreen.classList.remove('show-screen');
      this._addBtn.querySelector('i').classList.remove('rotate');
    }
}

// export default new mealView();