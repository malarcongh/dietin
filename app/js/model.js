import { API_URL, API_KEY, TIMEOUT_SEC } from "./config.js";

export const state = {
    userData: {
        preferences: {
            recommend: true
        },
        username: '',
        age: 0,
        height: 185,
        currentWeight: 80,
        diet: '',
        targetWeight: 0,
        targetInfo: {

        },
        personalInfo: {

        },
        targetMacros:{
            calories: 2500,
            carbs: 340,        // rest of the calories
            protein: 160,    // 2gr per kg
            fat: 80           // 1gr per kg
        },
        totalMacros:{
            calories: 0,
            carbs: 0,
            protein: 0,
            fat: 0
        },
        meals:{
            breakfast: [],
            lunch: [],
            snacks: [],
            dinner: []
        }
    },
    search: {
        meal: '',
        query: '',
        results : [],
    }
}

export const loadSearchResults = async function(query){
    const data = await AJAX(`${API_URL}search?api_key=${API_KEY}&query=${query}`);
    state.search.query = query;

    state.search.results = data.foods.map(food => {
        if(!food.servingSize) return;
        return {
            id: getUniqueId(),
            description: capitalize(food.description),
            brand: food.brandName ? capitalize(food.brandName): 'Generic',
            servingSize: food.servingSize,
            servingSizeUnit : food.servingSizeUnit,
            foodNutrients: {
                protein: food.foodNutrients[0] ? food.foodNutrients[0].value : '',
                fat: food.foodNutrients[1] ? food.foodNutrients[1].value : '',
                carbs: food.foodNutrients[2] ? food.foodNutrients[2].value : '',
                calories: food.foodNutrients[3] ? food.foodNutrients[3].value : '',
                sugar: food.foodNutrients[4] ? food.foodNutrients[4].value : '',
                fiber: food.foodNutrients[5] ? food.foodNutrients[5].value : '',
                sodium: food.foodNutrients[6] ? food.foodNutrients[6].value : '',
            }
            
        }
    }).filter(Boolean);
}

export const getResult = function(id){
    return state.search.results.find(el => el.id === id);
}


export const editMacrosPerServing = function(item, servingSize){

    let entries = Object.entries(item.foodNutrients).map(function([macro, quantity]){
        return servingSize ? [macro, round(quantity * (servingSize / item.servingSize))] : [macro, quantity];
    })

    let obj = Object.fromEntries(entries);

    item.edit = {
        servingSize: servingSize || item.servingSize,
        macros: obj
    };
}

export const addFood = function(food, useEdit, meal){
    let today = new Date();
    state.userData.meals[meal].push({
        id: getUniqueId(),
        meal: meal,
        brand: food.brand,
        time: `${(today.getHours()+'').padStart(2, '0')}:${(today.getMinutes()+'').padStart(2, '0')}`,
        description: food.description,
        servingSize: useEdit ? food.edit.servingSize: food.servingSize,
        servingUnit: food.servingSizeUnit,
        foodNutrients: useEdit ? {...food.edit.macros}: {...food.foodNutrients}
    });

    updateTotalMacros();
}

export const removeItem = function(id, meal){
    const index = state.userData.meals[meal].findIndex(el => el.id === id);
    state.userData.meals[meal].splice(index, 1);

    updateTotalMacros();
}

export const resetEdit = function(item){
    item.edit = {
        servingSize: item.servingSize,
        macros: {...item.foodNutrients}
    };
}

export const updateTargetMacros = function(){

    let targetCalories;

    if(state.userData.preferences.recommend){

        let baseCalories = Math.round(((10 * state.userData.personalInfo.currWeight) + (6.25 + state.userData.personalInfo.height) - (5 * state.userData.personalInfo.age) + 5) * 2.6);

        let diff = state.userData.personalInfo.currWeight - state.userData.targetInfo.targetWeight;

        targetCalories = (diff > 0) ? baseCalories - 300
        : (diff < 0) ? baseCalories + 300
        : baseCalories;
    }

    if(!state.userData.preferences.recommend){
        targetCalories = state.userData.targetInfo.targetCalories;
    }

    state.userData.targetInfo.targetCalories = targetCalories;
    console.log(state.userData.targetInfo.targetCalories);

    let protein = 2 * state.userData.personalInfo.currWeight;
    let fat = 1 * state.userData.personalInfo.currWeight;
    let carbs = (targetCalories - ((protein * 4) + (fat * 9))) / 4;
    
    state.userData.targetMacros = {
        calories: targetCalories,
        carbs: carbs,
        protein: protein,
        fat: fat
    }

    console.log(state.userData.targetMacros);

}

const updateTotalMacros = function(){

    const macros = {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0
    }

    Object.values(state.userData.meals).forEach(function(meal){
        meal.forEach(function(food){
            macros.calories += food.foodNutrients.calories;
            macros.protein += food.foodNutrients.protein;
            macros.carbs += food.foodNutrients.carbs;
            macros.fat += food.foodNutrients.fat;
        })
    })

    state.userData.totalMacros = macros;
}

const round = function(number){
    return Math.round(number * 100) / 100;
}


const capitalize = function(string){
    const lowerCaseString = string.toLowerCase();
    return lowerCaseString.charAt(0).toUpperCase() + lowerCaseString.slice(1);
}

const AJAX = async function(url){
    try{
        const res = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);
        const data = await res.json();
        if(!res.ok) throw new Error(`${data.message} (${res.status})`);
        return data;
    }catch(err){
        throw err;
    }
}

const timeout = function (s) {
    return new Promise(function (_, reject) {
        setTimeout(function () {
            reject(new Error(`Request took too long! Timeout after ${s} second`));
        }, s * 1000);
    });
};

const getUniqueId = function(){
    let chars = 'abcdefghijklmnopqrstuvwxyz1234567890';
    let str = '';

    for(let i = 0; i < 10; i++){
        str += chars[parseInt(Math.random() * (chars.length))];
    }

    return str;
}


  