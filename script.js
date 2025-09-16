const form = document.querySelector('form');
const input = document.querySelector('input');
const ingredientList = document.querySelector('#ingredient-list');
const suggestionList = document.querySelector('#suggestion-list');
const almostMakableList = document.querySelector('#almost-makable-list'); // ★ 新しいリストを取得

// --- メインの提案機能 ---
function updateAllSuggestions() {
    const ownedIngredients = loadIngredientsFromStorage();
    const allRecipes = loadRecipesFromStorage();

    // 提案リストを一度空にする
    suggestionList.innerHTML = ''; //作れる料理
    almostMakableList.innerHTML = ''; //あと１品で作れる料理

    // 全レシピをチェックして、作れる or あと一品で惜しいレシピを探す
    allRecipes.forEach(function(recipe) {
        // レシピに必要な材料のうち、冷蔵庫に「ない」ものをリストアップする
        const missingIngredients = recipe.ingredients.filter(function(required) {
            return !ownedIngredients.includes(required);
        });

        // 不足している材料の数で場合分け
        if (missingIngredients.length === 0) {
            // 不足ゼロ = 作れる！
            const listItem = document.createElement('li');
            listItem.textContent = recipe.name;
            suggestionList.appendChild(listItem);
        } else if (missingIngredients.length === 1) {
            // 不足が1品だけ = 惜しい！
            const listItem = document.createElement('li');
            listItem.textContent = `${recipe.name} (足りないもの: ${missingIngredients[0]})`;
            almostMakableList.appendChild(listItem);
        }
    });
}

// --- 冷蔵庫の材料を管理する機能 ---
function saveIngredientsToStorage(ingredients) {
    localStorage.setItem('ingredients', JSON.stringify(ingredients));
}

//ブラウザの記憶領域から、冷蔵庫の中身リストを読み込んでくる
function loadIngredientsFromStorage() {
    const savedIngredients = localStorage.getItem('ingredients');
    return savedIngredients ? JSON.parse(savedIngredients) : []; //もしsavedIngredientsの箱にデータがあればJSON.parse(savedIngredients)を実行,なければ空の配列を返す．
}
//取り出した材料リストを使って、画面に一覧表示する
function displayIngredients() {
    const ingredients = loadIngredientsFromStorage();
    ingredientList.innerHTML = ''; //これをしないと，表示がどんどん重複する
    ingredients.forEach(function(ingredientText) {
        addIngredientToList(ingredientText);
    });
}

function addIngredientToList(ingredientText) {
    const listItem = document.createElement('li');
    const span = document.createElement('span');
    span.textContent = ingredientText; //<span>にんじん</span>の形
    listItem.appendChild(span); //li><span>にんじん</span></li>の形
    const deleteButton = document.createElement('button'); //<button></button>
    deleteButton.textContent = '削除'; //button>削除</button>
    listItem.appendChild(deleteButton); //<li><span>にんじん</span><button>削除</button></li>の形
    ingredientList.appendChild(listItem);
}

// --- レシピ帳のデータを読み込むだけの機能 ---
//ブラウザの記憶領域から、全レシピのリストを読み込んでくる
function loadRecipesFromStorage() {
    const savedRecipes = localStorage.getItem('recipes');
    return savedRecipes ? JSON.parse(savedRecipes) : [];
}

// --- イベント処理 ---
form.addEventListener('submit', function(event) {
    event.preventDefault(); //フォーム送信時にページがリロードされるというブラウザのデフォルトの動きをキャンセルする
    const ingredientText = input.value.trim();
    if (ingredientText) {
        const currentIngredients = loadIngredientsFromStorage(); //localStorageから現在の材料リストを読み込む
        if (!currentIngredients.includes(ingredientText)) { //材料の重複を防ぐ
            currentIngredients.push(ingredientText);
            saveIngredientsToStorage(currentIngredients);
            displayIngredients();
            updateAllSuggestions(); // ★ 提案を更新
        }
        input.value = '';
    }
});

ingredientList.addEventListener('click', function(event) {
    if (event.target.tagName === 'BUTTON') {
        const listItem = event.target.parentElement;
        ingredientList.removeChild(listItem);

        const currentIngredients = [];
        ingredientList.querySelectorAll('li').forEach(function(item) {
            currentIngredients.push(item.querySelector('span').textContent);
        });
        saveIngredientsToStorage(currentIngredients);
        updateAllSuggestions(); // ★ 提案を更新
    }
});

// --- 最初に実行する処理 ---
displayIngredients();
updateAllSuggestions(); // ★ 提案を更新