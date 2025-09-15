const form = document.querySelector('form');
const input = document.querySelector('input');
const ingredientList = document.querySelector('#ingredient-list'); // 材料リストの<ul>
const suggestionList = document.querySelector('#suggestion-list'); // 提案リストの<ul>
const almostMakablelist = document.querySelector('#almost-makable-list');

// ★★★ 提案ロジックの本体 ★★★
function displaySuggestions() {
    // 1. 必要なデータを両方読み込む
    const ownedIngredients = loadIngredientsFromStorage(); // 冷蔵庫の中身
    const allRecipes = loadRecipesFromStorage(); // 全レシピ

    // 2. 提案リストを一度空にする
    suggestionList.innerHTML = '';

    // 3. 作れるレシピを探す
    const makableRecipes = allRecipes.filter(function(recipe) {
        return recipe.ingredients.every(function(requiredIngredient) {
            return ownedIngredients.includes(requiredIngredient);
        });
    });

    // 4. 見つかったレシピを画面に表示する
    makableRecipes.forEach(function(recipe) {
        const listItem = document.createElement('li');
        listItem.textContent = recipe.name;
        suggestionList.appendChild(listItem);
    });
}

// --- 冷蔵庫の材料を管理する機能 ---
function saveIngredientsToStorage(ingredients) {
    localStorage.setItem('ingredients', JSON.stringify(ingredients));
}

function loadIngredientsFromStorage() {
    const savedIngredients = localStorage.getItem('ingredients');
    return savedIngredients ? JSON.parse(savedIngredients) : [];
}

function displayIngredients() {
    const ingredients = loadIngredientsFromStorage();
    ingredientList.innerHTML = '';
    ingredients.forEach(function(ingredientText) {
        addIngredientToList(ingredientText);
    });
}

function addIngredientToList(ingredientText) {
    const listItem = document.createElement('li');
    
    // ★ 修正箇所：テキストをspanタグに入れる
    const span = document.createElement('span');
    span.textContent = ingredientText;
    listItem.appendChild(span);
    
    const deleteButton = document.createElement('button');
    deleteButton.textContent = '削除';
    listItem.appendChild(deleteButton);

    ingredientList.appendChild(listItem);
}

// --- レシピ帳のデータを読み込むだけの機能 ---
function loadRecipesFromStorage() {
    const savedRecipes = localStorage.getItem('recipes');
    return savedRecipes ? JSON.parse(savedRecipes) : [];
}


// --- イベント処理 ---
form.addEventListener('submit', function(event) {
    event.preventDefault();
    const ingredientText = input.value;
    if (ingredientText) {
        addIngredientToList(ingredientText);
        const currentIngredients = loadIngredientsFromStorage();
        currentIngredients.push(ingredientText);
        saveIngredientsToStorage(currentIngredients);
        displaySuggestions(); // ★ 提案を更新
        input.value = '';
    }
});

ingredientList.addEventListener('click', function(event) {
    if (event.target.tagName === 'BUTTON') {
        const listItem = event.target.parentElement;
        ingredientList.removeChild(listItem);

        const currentIngredients = [];
        ingredientList.querySelectorAll('li').forEach(function(item) {
            // ★ 修正箇所：firstChildではなく、spanタグを探してテキストを取得
            currentIngredients.push(item.querySelector('span').textContent);
        });
        saveIngredientsToStorage(currentIngredients);
        displaySuggestions();
    }
});

// --- 最初に実行する処理 ---
displayIngredients();
displaySuggestions(); // ★ 提案を更新