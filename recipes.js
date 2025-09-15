const form = document.querySelector('form');
const recipeNameInput = document.querySelector('#recipe-name');
const ingredientsInput = document.querySelector('#recipe-ingredients');
const list = document.querySelector('ul');

function saveRecipes(recipes) {
    localStorage.setItem('recipes', JSON.stringify(recipes));
}

function loadRecipes() {
    const savedRecipes = localStorage.getItem('recipes');
    return savedRecipes ? JSON.parse(savedRecipes) : [];
}

function displayRecipes() {
    const recipes = loadRecipes();
    list.innerHTML = '';
    recipes.forEach(function(recipe) {
        const listItem = document.createElement('li');
        
        // ★★★★★★★★★★★★★★★★★★★★★
        // ここが一番のポイントです！
        // recipeオブジェクトからidを取り出して、liタグのdata-idに設定します。
        listItem.dataset.id = recipe.id;
        // ★★★★★★★★★★★★★★★★★★★★★
        
        const span = document.createElement('span');
        span.textContent = `${recipe.name} (材料: ${recipe.ingredients.join(', ')})`;
        listItem.appendChild(span);
        
        const deleteButton = document.createElement('button');
        deleteButton.textContent = '削除';
        listItem.appendChild(deleteButton);

        list.appendChild(listItem);
    });
}

// ★★★ ここからデバッグ ★★★
list.addEventListener('click', function(event) {
    console.log('リストがクリックされました！');

    if (event.target.tagName === 'BUTTON') {
        console.log('ボタンが押されました！');

        // ★★★ ボタンの親要素（<li>）そのものをコンソールに表示する ★★★
        const parentLiElement = event.target.parentElement;
        console.log('ボタンの親要素:', parentLiElement);

        const id = parentLiElement.dataset.id;
        console.log('取得したID:', id);
        
        let recipes = loadRecipes();
        
        recipes = recipes.filter(function(recipe) {
            return recipe.id !== Number(id);
        });
        
        saveRecipes(recipes);
        displayRecipes();
    }
});
// ★★★ ここまでデバッグ ★★★


form.addEventListener('submit', function(event) {
    event.preventDefault();
    const recipes = loadRecipes();
    const newRecipe = {
        id: Date.now(),
        name: recipeNameInput.value,
        ingredients: ingredientsInput.value.split('\n').filter(function(ing) {
            return ing.trim() !== '';
        })
    };
    if (newRecipe.name.trim() === '') return;
    recipes.push(newRecipe);
    saveRecipes(recipes);
    displayRecipes();
    recipeNameInput.value = '';
    ingredientsInput.value = '';
});

displayRecipes();
